---
layout: post
title:  "Recallfilai: document workflow"
date:   2025-02-24 00:00:46 +0100
categories:
    - '2025'
    - tech
    - recallfilai
    - workflow
    - document
permalink: /recallfilai/workflow/
---

**System Overview:**

This system introduces a linear workflow for "Document" objects, managed within a multi-tenant environment. Each "Tenant" defines a single, shared workflow that all its "Document" objects could adhere to.

**Core Components:**

1.  **Tenant:**
    * Each "Tenant" maintains a unique, linear workflow.
    * A "Tenant" defines a list of possible "Document" statuses.

2.  **Document:**
    * A "Document" is associated with a specific "Tenant."
    * All "Documents" within a "Tenant" follow the same workflow.
    * A "Document" has a current "Status" that reflects its position in the workflow.

3.  **Status:**
    * Each "Status" within a "Tenant's" workflow is a distinct stage.
    * A "Status" defines:
        * A "Next Status" and a "Previous Status," establishing the linear progression.
        * "Transition Conditions" for moving to the "Next Status" or "Previous Status."

4.  **Transitions:**
    * Transitions between "Statuses" can occur:
        * **Automatically:** Based on predefined time-based conditions (e.g., after a set duration).
        * **Conditionally:** Based on "Transition Conditions."
        * **Manually:** Through user intervention.
    * If a transition condition is not met, the status remains unchanged.

### **Object design**  

**1. Tenant:**  
```json
{
    "id": "Tenant A",
    ...
    "workflow": {
        "statuses": [
            {
                "id": "DRAFT",
                "label": "Draft",
                "next": "IN_REVIEW",
                "previous": null,
                "forwardRules": [],
                "backwardRules": []
            },
            {
                "id": "IN_REVIEW",
                "label": "In Review",
                "next": "DONE",
                "previous": "DRAFT",
                "forwardRules": [
                    { "type": "equals", "field": "approved", "value": true }
                ],
                "backwardRules": []
            },
            {
                "id": "DONE",
                "label": "Done",
                "next": null,
                "previous": "IN_REVIEW",
                "forwardRules": [],
                "backwardRules": []
            }
        ],
        "automated_transitions": [
            {
                "from_status": "IN_REVIEW",
                "to_status": "DONE",
                "condition": { "type": "time_elapsed", "duration": 7, "unit": "day" }
            }
        ]
    }
}
```
- **Statuses:** Each status has an ID, label, and pointers to next and previous states, along with conditions for transitioning forward and backward.  

---

**2. Document:**  
```json
{
    "id": "Document A",
    "tenant_id": "Tenant A",
    ...
    "metadata": {
        "approved": true,
        "priority": "high"
    },
    "status": "IN_REVIEW",
    "statusUpdatedAt": "2024-02-17T00:00:00Z"
}
```
- **Metadata:** A flexible object that can store any key-value pairs. Conditions will be evaluated against this metadata.  

---

### **Conditions Supported:**  
1. **Metadata-Based:**  
   - `equals` — Field equals a specific value.  
   - `not_equals` — Field does not equal a value.  
   - `includes` — Array field includes a specific value.  
   - `exists` — Field exists in metadata.  

2. **Time-Based:**  
   - `time_elapsed` — Transition if a certain number of unit time have passed since the last status update.  

3. **Manual Override:**  
   - Any user can manually trigger a transition, bypassing conditions.  

---

### **API Design**  

**Transition document automatically**  
- **PUT** `/documents/{documentId}/metadata`  
- **Body:**  
```json
{
    "approved": true
}
```
- **Logic:**  
   - Update the metadata and trigger the status workflow.
   - Find the document’s current status from the tenant workflow.  
   - Evaluate all `forwardRules` and `backwardRules`. If all pass, update the status.  
   - Update `statusUpdatedAt` to the current date/time.  

**Transition document manually**
- **PUT** `/documents/{documentId}/workflow`  
- **Body:**  
```json
{
    "status": "DONE",
    "reason": "Document reviewed and approved"
}
```

**Get available workflow**  
- **GET** `/tenants/{tenantId}/workflow`  
- **Response:**  
```json
{
    "statuses": [
        { "id": "DRAFT", "label": "Draft" },
        { "id": "IN_REVIEW", "label": "In Review" },
        { "id": "DONE", "label": "Done" }
    ]
}
```

**Java code**
```java
public record RuleDef(
        String type,
        Map<String, Object> context
) {
}
```
```java
public record Status(
        String id,
        String label,
        String next,
        String previous,
        List<RuleDef> forwardRules,
        List<RuleDef> backwardRules
) {
}
```
```java
public interface Rule {
    Outcome evaluate(RuleDef ruleDef, Document document);
}

```
```java
public record Outcome(
        boolean success,
        @Nullable String message
) {

    public static Outcome TRUE = new Outcome(true, null);
    public static Outcome FALSE = new Outcome(false, null);

    public static Outcome fail(String message) {
        return new Outcome(false, message);
    }

}
```
```java
public class ElapsedTimeRule implements Rule {

    @Override
    public Outcome evaluate(RuleDef ruleDef, Document document) {
        var dateKey = ruleDef.context().get("date");
        var durationObj = ruleDef.context().get("duration");
        var unitObj = ruleDef.context().get("unit");

        var missingDef = Stream.of("dateKey", "duration", "unit")
                .map(k -> ruleDef.context().get(k) == null ? k : null)
                .filter(Objects::nonNull)
                .collect(Collectors.joining(", "));

        if (isNotBlank(missingDef)) {
            return Outcome.fail("missing rule definition: " + missingDef);
        }

        Object dateAsText = document.metadata().get(dateKey.toString());
        if (dateAsText == null) {
            return Outcome.fail("missing date from metadata");
        }

        long duration;
        ChronoUnit unit;
        LocalDateTime date;
        try {
            duration = Long.parseLong(durationObj.toString());
            unit = ChronoUnit.valueOf(unitObj.toString().toUpperCase());
            date = LocalDateTime.parse(dateAsText.toString());
        } catch (Exception e) {
            log.warn("failed to parse date({})/duration({})/unit({})", dateAsText, durationObj, unitObj, e);
            return Outcome.fail(e.getMessage());
        }


        var sinceCreation = Duration.between(
                date, Services.getService(Time.class).now()
        );

        if (sinceCreation.get(unit) > duration) {
            return Outcome.TRUE;
        }

        return Outcome.FALSE;
    }

}
```
```java
public record Workflow(
        List<Status> statuses
) {

    private static Map<String, Rule> RULES = Map.of(
            "time_elapsed", new ElapsedTimeRule(),
            "equals", new MetadataValueRule(MetadataValueRule.Op.EQ),
            "contains", new MetadataValueRule(MetadataValueRule.Op.CONTAINS),
            ...
    );

    public Status getInitialStatus() {
        if (CollectionUtils.isEmpty(statuses)) {
            return null;
        }

        return statuses.getFirst();
    }

    public Document transition(Document document) {
        Status status = getStatus(document.status());

        final var forwardPass = status.forwardRules().stream()
                .map(ruleDef -> getOutcome(document, ruleDef))
                .filter(Objects::nonNull)
                .allMatch(Outcome::success);

        if (forwardPass) {
            final var nextStatus = getStatus(status.next());
            if (nextStatus != null) {
                return document.withStatus(nextStatus.id());
            }
        }

        final var backwardPass = status.backwardRules().stream()
                .map(ruleDef -> getOutcome(document, ruleDef))
                .filter(Objects::nonNull)
                .allMatch(Outcome::success);

        if (backwardPass) {
            final var prevStatus = getStatus(status.previous());
            if (prevStatus != null) {
                return document.withStatus(prevStatus.id());
            }
        }

        return document;
    }

    private Outcome getOutcome(Document document, RuleDef ruleDef) {
        Rule rule = RULES.get(ruleDef.type());
        if (rule == null) {
            log.warn("rule {} not found", ruleDef.type());
            return null;
        }

        final var outcome = rule.evaluate(ruleDef, document);
        if (isNotBlank(outcome.message())) {
            throw new IllegalStateException(outcome.message());
        }

        return outcome;
    }

    private Status getStatus(String id) {
        return statuses.stream()
                .filter(status -> status.id().equals(id))
                .findAny()
                .orElse(null);
    }

}
```
```java
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class WorkflowTest {

    MockedStatic<?> servicesMock;
    Time time;

    Workflow workflow;

    @BeforeAll
    void setup() {
        /**
         * DRAFT => IN_REVIEW : when approved metadata is set to true.
         * IN_REVIEW => DRAFT : when approved metadata is set to false.
         * IN_REVIEW => DONE : when reviewed metadata is set to true.
         * DONE => ARCHIVED : when duration is passed for the "createdAt" date in metadata.
         */
        workflow = new Workflow(
                List.of(
                        new Status(
                                "DRAFT",
                                "Draft",
                                "IN_REVIEW",
                                null,
                                List.of(
                                        new RuleDef("equals", Map.of(
                                                "approved", true
                                        ))
                                ),
                                List.of()
                        ),
                        new Status(
                                "IN_REVIEW",
                                "In review",
                                "DONE",
                                "DRAFT",
                                List.of(
                                        new RuleDef("equals", Map.of(
                                                "reviewed", true
                                        ))
                                ),
                                List.of(
                                        new RuleDef("equals", Map.of(
                                                "approved", false
                                        ))
                                )
                        ),
                        new Status(
                                "DONE",
                                "Done",
                                "ARCHIVED",
                                null,
                                List.of(
                                        new RuleDef("time_elapsed", Map.of(
                                                "date", "createdAt",
                                                "duration", 7,
                                                "unit", "seconds"
                                        ))
                                ),
                                List.of()
                        )
                )
        );

        time = Mockito.mock(Time.class, Mockito.RETURNS_DEEP_STUBS);

        servicesMock = Mockito.mockStatic(Services.class);
        servicesMock.when(() -> Services.getService(Time.class)).thenReturn(time);
    }

    @Test
    void test_forward() {
        final var document = Document.builder()
                .status("DRAFT")
                .metadata(Map.of(
                        "approved", true
                ))
                .build();

        final var newDocument = workflow.transition(document);
        assertEquals(
                "IN_REVIEW", newDocument.status()
        );

    }

    @Test
    void test_backward() {
        final var document = Document.builder()
                .status("IN_REVIEW")
                .metadata(Map.of(
                        "approved", false,
                        "reviewed", false
                ))
                .build();

        final var newDocument = workflow.transition(document);
        assertEquals(
                "DRAFT", newDocument.status()
        );

    }

}
```
