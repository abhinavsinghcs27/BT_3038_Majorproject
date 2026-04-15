import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score,classification_report
import pickle

# 1. LOAD DATA

def load_data():
    df = pd.read_csv("diabetes.csv")
    print("Dataset Loaded ")
    print(df.head())
    return df



# 2. INSPECT DATA (OPTIONAL)

def inspect_data(df):
    print("\nDataset Info:")
    print(df.info())

    print("\nStatistical Summary:")
    print(df.describe())

    print("\nMissing Values:")
    print(df.isnull().sum())

    cols = ["Glucose", "BloodPressure", "Insulin", "BMI"]
    for col in cols:
        print(f"{col} zeros:", (df[col] == 0).sum())



# 3. CLEAN DATA

def clean_data(df):
    cols = ["Glucose", "BloodPressure", "Insulin", "BMI"]

    for col in cols:
        df[col] = df[col].replace(0, df[col].median())

    print("\nData cleaned successfully ")

    for col in cols:
        print(f"{col} zeros after cleaning:", (df[col] == 0).sum())

    return df

# 4. FEATURE SELECTION

def select_features(df):
    selected_features = [
        "Pregnancies",
        "Glucose",
        "BloodPressure",
        "Insulin",
        "BMI",
        "Age"
    ]

    X = df[selected_features]
    y = df["Outcome"]

    print("\nFeatures selected ")
    return X, y



# 5. TRAIN-TEST SPLIT

def split_data(X, y):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    print("\nTrain-Test Split Done ")
    print("Training set size:", X_train.shape[0])
    print("Testing set size:", X_test.shape[0])

    return X_train, X_test, y_train, y_test

# 6. SCALING (OPTIONAL)
def scale_data(X_train, X_test):
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    print("\nData scaling completed ")
    return X_train_scaled, X_test_scaled, scaler

# 7. MODEL TRAINING
def train_models(X_train, y_train):
    # Logistic Regression
    lr_model = LogisticRegression(max_iter=1000)
    lr_model.fit(X_train, y_train)
    print("\nLogistic Regression model trained ")

    # Random Forest Classifier
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_model.fit(X_train, y_train)
    print("Random Forest model trained ")

    return lr_model, rf_model

# 8. MODEL EVALUATION 
def evaluate_models(lr_model,rf_model,X_test,y_test):
    # Logistic Regression Evaluation
    lr_predictions = lr_model.predict(X_test)
    print("\nLogistic Regression Evaluation:")
    print("Accuracy:", accuracy_score(y_test, lr_predictions))
    print(classification_report(y_test, lr_predictions))

    # Random Forest Evaluation
    rf_predictions = rf_model.predict(X_test)
    print("\nRandom Forest Evaluation:")
    print("Accuracy:", accuracy_score(y_test, rf_predictions))
    print(classification_report(y_test, rf_predictions))

#9. MODEL SAVING 
def save_model(model,scaler):
    with open("model/diabetes_model.pkl", "wb") as f:
        pickle.dump(model, f)
    with open("model/scaler.pkl", "wb") as f:
        pickle.dump(scaler, f)
    print("\nModel and scaler saved successfully ")

# 10. PREDICTION FUNCTION
def predict_diabetes(model,scaler, input_data):
    columns = ["Pregnancies", "Glucose", "BloodPressure", "Insulin", "BMI", "Age"]
    data = pd.DataFrame([input_data], columns=columns)
    data_scaled = scaler.transform(data)
    prob=model.predict_proba(data_scaled)[0][1]
    if prob<0.3:
        risk="Low"
    elif prob<0.6:
        risk="Medium"
    else:
        risk="High"
    return risk,prob
# MAIN EXECUTION

if __name__ == "__main__":
    df = load_data()

    # Optional: enable when needed
    # inspect_data(df)

    df = clean_data(df)

    X, y = select_features(df)

    X_train, X_test, y_train, y_test = split_data(X, y)

    # Optional: enable when needed
    X_train_scaled, X_test_scaled,scaler = scale_data(X_train, X_test)
    lr_model, rf_model = train_models(X_train_scaled, y_train)
    evaluate_models(lr_model,rf_model,X_test_scaled,y_test)
    best_model = rf_model
    save_model(best_model,scaler)
    sample_input = [2, 120, 70, 80, 30.5, 25]
    risk,prob=predict_diabetes(best_model,scaler,sample_input)
    print("\n Prediction Test:")
    print(f"Risk Level: {risk}")
    print(f"Probability: {prob}")