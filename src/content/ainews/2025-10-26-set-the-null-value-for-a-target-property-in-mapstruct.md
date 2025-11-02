---
title: "Set the Null Value for a Target Property in MapStruct | Baeldung"
pubDate: 2025-10-26
description: "Explore techniques to consistently set a specific object field to null using MapStruct, including expressions, qualifiedBy, ignore, and @AfterMapping annotations."
categories: ["AI News", "Java", "MapStruct"]
---

## Set the Null Value for a Target Property in MapStruct | Baeldung

This article explains multiple strategies to ensure a specific property is always set to `null` during object mapping using **MapStruct**, a code generation library for Java. The focus is on scenarios where fields like `reviewedBy` in an entity should be explicitly reset to `null` when updating from a DTO. The approaches include using expressions, custom methods, `@AfterMapping`, and handling polymorphic types with `@SubclassMapping`.

---

### Key Techniques for Setting Null Values

#### 1. **Using Expressions**
- **Purpose**: Directly assign `null` to a target field using a Java expression.
- **Implementation**:
  ```java
  @Mapping(target = "reviewedBy", expression = "java(null)")
  Article toArticleUsingExpression(ArticleDTO dto, Article persisted);
  ```
- **Impact**: Ensures the `reviewedBy` field is explicitly set to `null` during mapping. Suitable for simple null assignments.
- **Test Case**:
  ```java
  @Test
  void givenArticleDTO_whenToArticleUsingExpression_thenReturnsArticleWithNullStatus() {
      // Verifies that 'reviewedBy' is null and 'title' is updated
  }
  ```

#### 2. **Using Custom Methods with `expression`**
- **Purpose**: Reuse logic by defining a method that returns `null`.
- **Implementation**:
  ```java
  @Mapping(target = "reviewedBy", expression = "java(getReviewedBy())")
  default String getReviewedBy() {
      return null;
  }
  ```
- **Impact**: Promotes reusability if additional logic (e.g., validation) is needed before returning `null`.

#### 3. **Using `qualifiedBy` with `@Named` Methods**
- **Purpose**: Reuse a named method across multiple mappings.
- **Implementation**:
  ```java
  @Mapping(target = "reviewedBy", qualifiedByName = "toNull")
  @Named("toNull")
  default String mapToNull(String property) {
      return null;
  }
  ```
- **Impact**: Centralizes null logic, reducing redundancy in mapper annotations.

#### 4. **Using `ignore` Property**
- **Purpose**: Leave the target field uninitialized (defaulting to `null`).
- **Implementation**:
  ```java
  @Mapping(target = "reviewedBy", ignore = true)
  Article toArticleUsingIgnore(ArticleDTO dto, Article persisted);
  ```
- **Impact**: Works only if the target object is newly created (all fields default to `null`). Avoids explicit null assignment.

#### 5. **Using `@AfterMapping` for Post-Processing**
- **Purpose**: Execute logic after mapping completes.
- **Implementation**:
  ```java
  @AfterMapping
  default void setNullReviewedBy(@MappingTarget Article article) {
      article.setReviewedBy(null);
  }
  ```
- **Impact**: Ensures `reviewedBy` is always `null` for all `Article` mappings in the mapper. May cause side effects if used in other methods.

---

### Generalizing for Polymorphic Types

#### **Using `@SubclassMapping` for Subtypes**
- **Purpose**: Apply null logic to all subtypes of a base class.
- **Implementation**:
  ```java
  @Mapper
  public interface ReviewableMapper {
      @SubclassMapping(source = ArticleDTO.class, target = Article.class)
      @SubclassMapping(source = WeeklyNewsDTO.class, target = WeeklyNews.class)
      @Mapping(target = "reviewedBy", expression = "java(null)")
      Reviewable toReviewable(ReviewableDTO dto);
  }
  ```
- **Impact**: Maps subtypes (e.g., `ArticleDTO` to `Article`) while ensuring `reviewedBy` is always `null`. Verified via `isInstanceOf()` in tests.

---

## Working Example (Code-Related)

```java
@Mapper
public interface ArticleMapper {
    @Mapping(target = "title", source = "dto.title")
    @Mapping(target = "id", source = "persisted.id")
    @Mapping(target = "reviewedBy", expression = "java(null)")
    Article toArticleUsingExpression(ArticleDTO dto, Article persisted);

    @AfterMapping
    default void setNullReviewedBy(@MappingTarget Article article) {
        article.setReviewedBy(null);
    }
}
```

---

## Recommendations (Code-Related)

- **Use `expression = "java(null)"`** for simple null assignments. It is concise and readable.
- **Prefer `@AfterMapping`** when the null logic must apply to all instances of a mapped type, but be cautious of unintended side effects.
- **Avoid `ignore`** unless the target object is guaranteed to be newly created (as fields default to `null`).
- **Leverage `@SubclassMapping`** for polymorphic types to avoid repetitive code across subtypes.
- **Test thoroughly** when using `@AfterMapping` or `qualifiedBy` to ensure no unintended behavior in other mapper methods.

---

## Potential Pitfalls

- **`@AfterMapping`** can inadvertently modify other fields if the method is not scoped correctly.
- **`ignore`** may not work as expected if the target object is not newly created (e.g., if it’s a persisted entity with non-null defaults).
- **Overuse of `qualifiedBy`** may lead to complex mappings that are hard to maintain.

---

**Reference**: [Set the Null Value for a Target Property in MapStruct | Baeldung](https://www.baeldung.com/java-mapstruct-set-null-value-property)