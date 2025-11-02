---
title: "How to Mock Amazon SQS in Unit Tests with Dependency Injection and Mockito"
pubDate: 2025-10-24
description: "A comprehensive guide to mocking Amazon SQS in unit tests using dependency injection and Mockito for fast, deterministic, and credential-free testing."
categories: ["AI News", "Cloud", "Testing"]
---

## How to Mock Amazon SQS in Unit Tests with Dependency Injection and Mockito

This article explains how to mock Amazon SQS (Simple Queue Service) in unit tests using dependency injection and Mockito. The approach ensures tests are fast, deterministic, and do not require real AWS credentials, while verifying that code constructs the correct requests without interacting with actual SQS endpoints.

### Key Concepts and Implementation

#### 1. **Why Mock Amazon SQS?**
- **Purpose**: Avoid network dependencies, reduce test execution time, and ensure consistent test results.
- **Impact**: Eliminates reliance on real AWS infrastructure, making tests more reliable and faster.
- **Benefits**:
  - No need for AWS credentials or internet connectivity.
  - Enables focused testing of business logic without external service interactions.

#### 2. **Dependencies**
- **AWS SDK for Java**: Required for interacting with SQS.
  - Version used: `2.35.10`
  - Provides classes like `SqsClient`, `SqsAsyncClient`, and request/response models.
- **Testing Libraries**:
  - **JUnit 5**: For writing and running tests.
  - **Mockito**: For creating mock objects and stubbing behavior.
  - **AssertJ**: For assertions in tests.

#### 3. **Service Under Test**
- **Class**: `SqsMessagePublisher`
  - **Responsibility**: Sends messages to an SQS queue.
  - **Design**: Uses **dependency injection** to accept an `SqsClient` via constructor.
  - **Code Example**:
    ```java
    public class SqsMessagePublisher {
        private final SqsClient sqsClient;
        public SqsMessagePublisher(SqsClient sqsClient) {
            this.sqsClient = sqsClient;
        }
        public String publishMessage(String queueUrl, String messageBody) {
            SendMessageRequest request = SendMessageRequest.builder()
                .queueUrl(queueUrl)
                .messageBody(messageBody)
                .build();
            SendMessageResponse response = sqsClient.sendMessage(request);
            return response.messageId();
        }
    }
    ```
  - **Key Design Principle**: Decouples business logic from the concrete SQS client implementation, enabling easy substitution with a mock in tests.

#### 4. **Mocking Synchronous `SqsClient`**
- **Test Setup**:
  - Use `@Mock` to create a mock `SqsClient`.
  - Use `@InjectMocks` to inject the mock into the service under test.
  - Example:
    ```java
    @ExtendWith(MockitoExtension.class)
    class SqsMessagePublisherUnitTest {
        @Mock
        private SqsClient sqsClient;
        @InjectMocks
        private SqsMessagePublisher messagePublisher;
    }
    ```
- **Test Implementation**:
  - **Arrange**:
    - Stub the `sendMessage` method to return a predefined response.
    - Example:
      ```java
      when(sqsClient.sendMessage(any(SendMessageRequest.class)))
          .thenReturn(mockResponse);
      ```
  - **Act**:
    - Call `publishMessage` to trigger the method under test.
  - **Assert**:
    - Use `ArgumentCaptor` to verify the `SendMessageRequest` parameters.
    - Example:
      ```java
      ArgumentCaptor<SendMessageRequest> requestCaptor = 
          ArgumentCaptor.forClass(SendMessageRequest.class);
      verify(sqsClient).sendMessage(requestCaptor.capture());
      SendMessageRequest capturedRequest = requestCaptor.getValue();
      assertThat(capturedRequest.queueUrl()).isEqualTo(queueUrl);
      assertThat(capturedRequest.messageBody()).isEqualTo(messageBody);
      ```

#### 5. **Mocking Asynchronous `SqsAsyncClient`**
- **Service Class**: `SqsAsyncMessagePublisher`
  - Uses `SqsAsyncClient` and returns a `CompletableFuture<String>`.
- **Test Adjustments**:
  - Stub the `sendMessage` method to return a `CompletableFuture` wrapped around a mock response.
  - Example:
    ```java
    when(sqsAsyncClient.sendMessage(any(SendMessageRequest.class)))
        .thenReturn(CompletableFuture.completedFuture(mockResponse));
    ```
  - Use `.get()` on the `CompletableFuture` to retrieve the result synchronously during assertions.

#### 6. **Integration Testing Considerations**
- **Limitation of Unit Tests**: Cannot validate IAM permissions, network connectivity, or real queue configurations.
- **Solution**: Use **Testcontainers** with **LocalStack** to emulate AWS services locally.
  - Allows testing against a real SQS endpoint without actual AWS credentials.

#### 7. **Conclusion**
- **Summary**: Mocking Amazon SQS with Mockito and dependency injection enables fast, reliable unit tests that focus on business logic.
- **Best Practices**:
  - Always use dependency injection for external services.
  - Validate request parameters using `ArgumentCaptor`.
  - Use `CompletableFuture` for async clients.
- **Real-World Use Cases**:
  - Testing message publishing logic in microservices.
  - Validating error handling for malformed requests.
  - Ensuring queue URLs and message bodies are correctly formatted.

---

## Working Example

### Synchronous Test Example
```java
@Test
void whenPublishMessage_thenMessageIsSentWithCorrectParameters() {
    // Arrange
    String queueUrl = "https://sqs.us-east-1.amazonaws.com/123456789012/MyQueue";
    String messageBody = "Hello, SQS!";
    String expectedMessageId = "test-message-id-123";
    SendMessageResponse mockResponse = SendMessageResponse.builder()
        .messageId(expectedMessageId)
        .build();
    when(sqsClient.sendMessage(any(SendMessageRequest.class))).thenReturn(mockResponse);

    // Act
    String actualMessageId = messagePublisher.publishMessage(queueUrl, messageBody);

    // Assert
    assertThat(actualMessageId).isEqualTo(expectedMessageId);
    ArgumentCaptor<SendMessageRequest> requestCaptor = 
        ArgumentCaptor.forClass(SendMessageRequest.class);
    verify(sqsClient).sendMessage(requestCaptor.capture());
    SendMessageRequest capturedRequest = requestCaptor.getValue();
    assertThat(capturedRequest.queueUrl()).isEqualTo(queueUrl);
    assertThat(capturedRequest.messageBody()).isEqualTo(messageBody);
}
```

---

## Recommendations

- **When to Use This Approach**:
  - When testing code that interacts with external services like SQS.
  - When you need to isolate business logic from infrastructure dependencies.
- **Best Practices**:
  - Always mock external services to avoid network latency.
  - Use `ArgumentCaptor` to inspect request parameters.
  - For async clients, ensure `CompletableFuture` is properly stubbed.
- **Pitfalls to Avoid**:
  - Forgetting to mock dependencies, leading to real service calls.
  - Not verifying request parameters, resulting in incomplete test coverage.
  - Using hardcoded values instead of dynamic mocking for flexibility.

---

**Reference**: [How to Mock AmazonSQS in Unit Tests | Baeldung](https://www.baeldung.com/java-mock-amazonsqs-unit-tests)