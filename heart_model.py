import pandas as pd

def load_data():
    df = pd.read_csv("cardio.csv", sep=";")
    print("Dataset Loaded")
    print(df.head())
    return df

#BASIC CLEANING
def basic_cleaning(df):
    df["age"] = df["age"] / 365
    df["age"] = df["age"].round().astype(int)
    df=df.drop(columns=["id"])
    print("\nBasic cleaning completed")
    return df

#FEATURE ENGINEERING
def add_bmi(df):
    df["bmi"] = df["weight"] / ((df["height"] / 100) ** 2)
    print("\nBMI feature added")
    print(df[["weight", "height", "bmi"]].head())
    return df
#REMOVE OUTLIERS
def remove_outliers(df):
    df=df[(df["ap_hi"] > 50) & (df["ap_hi"] < 250)]
    df=df[(df["ap_lo"] > 30) & (df["ap_lo"] < 150)]
    df=df[(df["height"] > 100) & (df["height"] < 220)]
    df=df[(df["weight"] > 30) & (df["weight"] < 200)]
    print("\nOutliers removed")
    print("Remaining records:", len(df))
    return df

#FEATURE SELECTION
def select_features(df):
    selected_features = ["age", "gender","ap_hi", "ap_lo", "cholesterol", "gluc", "smoke", "alco", "active","bmi"]
    X = df[selected_features]
    y = df["cardio"]
    print("\nFeatures selected")
    print(X.head())
    return X, y

#TRAIN TEST SPLIT
def split_data(X, y):
    from sklearn.model_selection import train_test_split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    print("\nData split into training and testing sets")
    print("Training samples:", X_train.shape[0])
    print("Testing samples:", X_test.shape[0])
    return X_train, X_test, y_train, y_test
 #SCALING
from sklearn.preprocessing import StandardScaler
def scale_data(X_train, X_test):
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    print("\nData scaling completed")
    return X_train_scaled, X_test_scaled, scaler

#MODEL TRAINING
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
def train_models(X_train, y_train):
    lr_model = LogisticRegression(max_iter=1000)
    lr_model.fit(X_train, y_train)
    print("\nLogistic Regression model trained")

    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_model.fit(X_train, y_train)
    print("Random Forest model trained")

    return lr_model, rf_model

#MODEL EVALUATION
from sklearn.metrics import classification_report, accuracy_score
def evaluate_model(lr_model, rf_model, X_test, y_test):
    lr_pred=lr_model.predict(X_test)
    print("\nLogistic Regression Evaluation:")
    print(classification_report(y_test, lr_pred))
    print("Accuracy:", accuracy_score(y_test, lr_pred))
    
    rf_pred=rf_model.predict(X_test)
    print("\nRandom Forest Evaluation:")
    print(classification_report(y_test, rf_pred))
    print("Accuracy:", accuracy_score(y_test, rf_pred))
#SAVE MODEL
import pickle
def save_model(model,scaler):
    with open("model/heart_model.pkl","wb") as f:
        pickle.dump(model,f)
    with open("model/scaler.pkl","wb") as f:
        pickle.dump(scaler,f)
    print("\nModel and scaler saved to disk")
if __name__ == "__main__":
    df = load_data()
    df = basic_cleaning(df)
    df = remove_outliers(df)
    df = add_bmi(df)
    X, y = select_features(df)
    X_train, X_test, y_train, y_test = split_data(X, y)
    X_train_scaled, X_test_scaled, scaler = scale_data(X_train, X_test)
    lr_model, rf_model = train_models(X_train_scaled, y_train)
    evaluate_model(lr_model, rf_model, X_test_scaled, y_test)
    save_model(rf_model, scaler)