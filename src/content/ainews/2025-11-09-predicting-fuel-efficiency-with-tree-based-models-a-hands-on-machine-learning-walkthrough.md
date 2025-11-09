---
title: "Machine Learning for Fuel Efficiency Prediction: Tree-Based Model Analysis"
pubDate: 2025-11-09
description: "A hands-on exploration of tree-based models (Decision Trees, Random Forests, XGBoost) to predict vehicle fuel efficiency (MPG), including data preparation, hyperparameter tuning, and feature importance analysis."
categories: ["AI News", "machinelearning", "python", "data-science"]

---

## Machine Learning for Fuel Efficiency Prediction: Tree-Based Model Analysis

This article explores the application of tree-based machine learning models to predict **fuel efficiency (MPG)** using a dataset of vehicle characteristics. The process involves data preparation, model training, hyperparameter tuning, and evaluation, with insights into feature importance and model performance.

---

### 🧩 Data Preparation

- **Dataset Features**:  
  - Numerical: `vehicle_weight`, `engine_displacement`, `horsepower`, `acceleration`  
  - Categorical: `model_year`, `origin`, `fuel_type`  

- **Data Cleaning**:  
  - Missing values were filled with **zeros** to ensure consistency.  

- **Train/Validation/Test Split**:  
  - **60%/20%/20%** split with `random_state=1` for reproducibility.  

- **Feature Encoding**:  
  - **DictVectorizer(sparse=True)** was used to convert categorical and numerical features into a format compatible with scikit-learn models.  

---

### 🌳 Decision Tree Regressor

- **Model Configuration**:  
  - `max_depth=1` to create a simple tree for initial feature analysis.  

- **Key Insight**:  
  - The first split was on **`model_year`**, indicating that newer vehicles have distinct fuel efficiency patterns compared to older models.  

- **Purpose**:  
  - Demonstrates how tree-based models identify the most influential feature for splitting data.  

---

### 🌲 Random Forest Regressor

- **Model Parameters**:  
  - `n_estimators=10`, `random_state=1`, `n_jobs=-1` (to use all CPU cores).  

- **Performance**:  
  - **Validation RMSE ≈ 4.5**, showing effective capture of relationships between engine specs and fuel efficiency.  

- **Hyperparameter Tuning**:  
  - Tested `n_estimators` from **10 to 200** (step = 10). Performance plateaued after **80 estimators**, indicating diminishing returns beyond this point.  

- **Depth Tuning**:  
  - Compared `max_depth` values of **10, 15, 20, 25** with increasing `n_estimators`.  
  - **Best RMSE at `max_depth=20`**, balancing bias and variance.  

---

### 🔍 Feature Importance Analysis

- **Top Predictors**:  
  - **`engine_displacement`** (most important), followed by **`vehicle_weight`** and **`horsepower`**.  

- **Domain Alignment**:  
  - Larger engines and heavier vehicles consume more fuel, aligning with real-world knowledge.  

- **Method**:  
  - Random Forest’s built-in feature importance metric was used to rank predictors.  

---

### ⚡ XGBoost Experiments

- **Model Configuration**:  
  - Parameters:  
    ```python
    xgb_params = {
        'eta': [0.3, 0.1],
        'max_depth': 6,
        'objective': 'reg:squarederror',
        'nthread': 8,
        'seed': 1
    }
    ```  
  - Trained for **100 rounds**.  

- **Performance**:  
  - **`eta=0.1`** (smaller learning rate) achieved the best validation RMSE, demonstrating that slower learning improves generalization.  

- **Key Takeaway**:  
  - XGBoost outperforms simpler models with proper hyperparameter tuning.  

---

### 🎯 Key Takeaways

- **Model Year Impact**:  
  - `model_year` strongly influences fuel efficiency in modern cars.  

- **Optimal Random Forest Configuration**:  
  - `n_estimators ≈ 80` and `max_depth=20` for balanced performance.  

- **Top Predictor**:  
  - **Engine displacement** is the most critical factor for predicting MPG.  

- **XGBoost Best Practice**:  
  - Use **lower `eta` values** (e.g., 0.1) for smoother convergence and better generalization.  

---

### 💡 Final Thoughts

This project highlights the iterative process of **model tuning**, **feature analysis**, and **interpretability** in tree-based models. By comparing Decision Trees, Random Forests, and XGBoost, the author demonstrates how hyperparameters like `n_estimators`, `max_depth`, and `eta` affect performance. The findings align with domain knowledge, emphasizing the practical value of machine learning in real-world scenarios like automotive engineering.

---

## Working Example (Python Code)

```python
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
from sklearn.feature_extraction import DictVectorizer

# Sample data preparation
data = [
    {"vehicle_weight": 2500, "engine_displacement": 150, "model_year": 2000},
    {"vehicle_weight": 3000, "engine_displacement": 200, "model_year": 2010},
    # ... more data points
]

# Split data
X_train, X_val, y_train, y_val = train_test_split(
    data, target, test_size=0.2, random_state=1
)

# Vectorize features
dv = DictVectorizer(sparse=True)
X_train_vec = dv.fit_transform(X_train)
X_val_vec = dv.transform(X_val)

# Train Random Forest
rf = RandomForestRegressor(n_estimators=80, max_depth=20, random_state=1)
rf.fit(X_train_vec, y_train)

# Evaluate
preds = rf.predict(X_val_vec)
rmse = mean_squared_error(y_val, preds, squared=False)
print(f"Validation RMSE: {rmse:.2f}")
```

---

## Recommendations

- **Use Cross-Validation**: Always validate hyperparameters using cross-validation to avoid overfitting.  
- **Monitor RMSE**: Track performance metrics like RMSE during tuning to identify optimal parameters.  
- **Feature Engineering**: Prioritize features like `engine_displacement` and `vehicle_weight` for better model accuracy.  
- **Avoid Over-Complexity**: Use `max_depth` and `n_estimators` judiciously to prevent overfitting.  
- **XGBoost Best Practices**: Start with small `eta` values (e.g., 0.1) and increase tree depth gradually.  

---

**Reference**: [Predicting Fuel Efficiency with Tree-Based Models](https://dev.to/techkene/predicting-fuel-efficiency-with-tree-based-models-a-hands-on-machine-learning-walkthrough-4ejg)