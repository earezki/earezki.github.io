---
title: "Building an End-to-End Data Engineering and Machine Learning Pipeline with PySpark in Google Colab"
pubDate: 2025-11-01
description: "A step-by-step guide to using PySpark in Google Colab for data transformations, SQL analytics, feature engineering, and machine learning model training."
categories: ["AI News", "Big Data", "Data Science", "Machine Learning", "Technology", "Tutorials"]
---

## Building an End-to-End Data Engineering and Machine Learning Pipeline with PySpark in Google Colab

This tutorial demonstrates how to leverage Apache Spark and PySpark in a Google Colab environment to build a complete data engineering and machine learning pipeline. The workflow includes data preprocessing, SQL queries, window functions, model training, and Parquet file handling, all within a single-node setup.

---

### 1. **Setup and Initialization**

- **Spark Session Configuration**:
  - A local Spark session is initialized with `master("local[*]")` to utilize all available cores.
  - The `spark.sql.shuffle.partitions` is set to 4 to optimize shuffle operations.
  - **Spark version**: 3.5.1 (as specified in the `pip install` command).

- **Sample Dataset**:
  - A structured DataFrame is created with user data, including `id`, `name`, `country`, `signup_date`, `income`, and `plan` (subscription type).
  - The schema is explicitly defined using `StructType` for data validation.

---

### 2. **Data Transformations and SQL Queries**

- **Column Engineering**:
  - New columns like `signup_ts` (timestamp), `year`, `month`, and `is_india` (binary indicator) are added using PySpark SQL functions.
  - Example: `F.to_timestamp("signup_date")` converts the date string to a timestamp.

- **SQL Analytics**:
  - The DataFrame is registered as a SQL table (`users`), enabling SQL queries.
  - Example query: Aggregates user count and average income per country.
    ```sql
    SELECT country, COUNT(*) AS cnt, AVG(income) AS avg_income
    FROM users
    GROUP BY country
    ORDER BY cnt DESC
    ```

- **Window Functions**:
  - A window function ranks users by income within each country using `rank().over(Window.partitionBy("country").orderBy(F.col("income").desc()))`.

- **User-Defined Functions (UDFs)**:
  - A UDF `plan_priority` assigns numerical priority to subscription plans (`premium` = 3, `standard` = 2, `basic` = 1).
  - Applied via `F.udf(plan_priority, IntegerType())`.

---

### 3. **Data Joining and Aggregation**

- **Enrichment with Country Metadata**:
  - A separate DataFrame `country_df` contains country-level data (region, population).
  - Joined with the user DataFrame using `df.alias("u").join(country_df.alias("c"), on="country", how="left")`.

- **Regional Analysis**:
  - Aggregates user counts and average income by `region` and `plan` type.
  - Example output: Highlights regional trends in subscription plans and income.

---

### 4. **Machine Learning with Spark MLlib**

- **Feature Engineering**:
  - **Label Encoding**: Converts `plan` to a binary label (`1` for "premium", `0` for others).
  - **Indexing**: Uses `StringIndexer` to encode categorical `country` values.
  - **Feature Assembly**: Combines `income`, `country_idx`, and `plan_priority` into a feature vector using `VectorAssembler`.

- **Model Training**:
  - A logistic regression model is trained on 70% of the data (`train_df`), with 20 iterations.
  - **Evaluation**: Accuracy is computed on the test set using `MulticlassClassificationEvaluator` (metric: "accuracy").

- **Results**:
  - The model predicts subscription type (`premium` vs. others) with an accuracy metric (value not explicitly provided in the context).

---

### 5. **Data Persistence and Query Optimization**

- **Parquet File Handling**:
  - Processed data is saved to Parquet format (`/content/spark_users_parquet`) and reloaded for validation.
  - Parquet is used for efficient storage and schema preservation.

- **Query Optimization**:
  - A SQL query retrieves recent signups (`signup_ts >= '2025-10-01'`) and demonstrates the query execution plan using `recent.explain()`.

- **Session Termination**:
  - The Spark session is gracefully stopped with `spark.stop()`.

---

## Working Example

```python
# Complete PySpark Code Example
!pip install -q pyspark==3.5.1
from pyspark.sql import SparkSession, functions as F, Window
from pyspark.sql.types import StructType, StructField, IntegerType, StringType, FloatType
from pyspark.ml.feature import StringIndexer, VectorAssembler
from pyspark.ml.classification import LogisticRegression
from pyspark.ml.evaluation import MulticlassClassificationEvaluator

# Initialize Spark Session
spark = (SparkSession.builder.appName("ColabSparkPipeline")
         .master("local[*]")
         .config("spark.sql.shuffle.partitions", "4")
         .getOrCreate())

# Sample Data
data = [
    (1, "Alice", "IN", "2025-10-01", 56000.0, "premium"),
    # ... (additional data rows)
]
schema = StructType([
    StructField("id", IntegerType(), False),
    StructField("name", StringType(), True),
    StructField("country", StringType(), True),
    StructField("signup_date", StringType(), True),
    StructField("income", FloatType(), True),
    StructField("plan", StringType(), True),
])
df = spark.createDataFrame(data, schema)

# Transformations
df2 = df.withColumn("signup_ts", F.to_timestamp("signup_date")) \
        .withColumn("year", F.year("signup_ts")) \
        .withColumn("month", F.month("signup_ts")) \
        .withColumn("is_india", (F.col("country") == "IN").cast("int"))
df2.createOrReplaceTempView("users")

# SQL Query
spark.sql("""
    SELECT country, COUNT(*) AS cnt, AVG(income) AS avg_income
    FROM users
    GROUP BY country
    ORDER BY cnt DESC
""").show()

# ML Pipeline
country_indexer = StringIndexer(inputCol="country", outputCol="country_idx", handleInvalid="keep")
assembler = VectorAssembler(inputCols=["income", "country_idx", "plan_priority"], outputCol="features")
lr = LogisticRegression(featuresCol="features", labelCol="label", maxIter=20)
# ... (additional ML steps as in the context)
```

---

## Recommendations

- **UDF Performance**: Avoid heavy computations in UDFs to prevent performance bottlenecks.
- **Data Partitioning**: Use `repartition()` or `coalesce()` for large datasets to optimize shuffle operations.
- **Model Evaluation**: Always validate models using cross-validation and multiple metrics (e.g., precision, recall).
- **Parquet Usage**: Leverage Parquet for columnar storage and schema enforcement in production workflows.
- **Query Optimization**: Use `explain()` to analyze query plans and optimize joins or aggregations.

---

**Reference**: [How to Build an End-to-End Data Engineering and Machine Learning Pipeline with Apache Spark and PySpark](https://www.marktechpost.com/2025/11/01/how-to-build-an-end-to-end-data-engineering-and-machine-learning-pipeline-with-apache-spark-and-pyspark/)