# ARIMA Price Prediction Model – Implementation Guide

This guide explains how to implement an **ARIMA (Autoregressive Integrated Moving Average)** model for forecasting mobile device prices in your project. ARIMA is a time-series model suitable for predicting future price trends when you have historical price data over time.

---

## 1. What is ARIMA?

ARIMA models capture three components:

- **AR (Autoregressive)**: Uses past values to predict future values
- **I (Integrated)**: Differencing to make the series stationary (remove trends)
- **MA (Moving Average)**: Uses past forecast errors to improve predictions

**Parameters**: ARIMA(p, d, q)
- `p` = number of lag observations (AR order)
- `d` = degree of differencing (I order)
- `q` = size of moving average window (MA order)

---

## 2. Data Requirements

### 2.1 Price History (Time Series)

ARIMA needs **time-ordered price data**. Your `PriceHistory` model stores:

```javascript
// PriceHistory schema
{ mobileId, price, createdAt }
```

**Requirements:**
- At least **30–50 data points** per device for reasonable forecasts
- Regular time intervals (daily, weekly, or monthly)
- No large gaps in the timeline

### 2.2 Collecting Price History

**Option A – Manual / Admin:**  
When a seller updates a mobile’s price, append a record to `PriceHistory`:

```javascript
// In mobile update controller
await PriceHistory.create({ mobileId: mobile._id, price: newPrice });
```

**Option B – Scheduled job:**  
Periodically snapshot current prices for all active mobiles:

```javascript
// Cron job (e.g. daily)
const mobiles = await Mobile.find({ status: "active" });
for (const m of mobiles) {
  await PriceHistory.create({ mobileId: m._id, price: m.price });
}
```

---

## 3. Implementation Options

### Option 1: Python + Node.js (Recommended)

ARIMA is best implemented in Python with `statsmodels`. Use a Python script and call it from Node.js.

#### Step 1: Python environment

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install
pip install pandas numpy statsmodels scikit-learn
```

#### Step 2: Python script `scripts/arima_predict.py`

```python
#!/usr/bin/env python3
import sys
import json
import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.stattools import adfuller
import numpy as np

def find_d_order(series):
    """Find d (differencing order) using ADF test for stationarity."""
    for d in range(3):
        diff = series.diff(d).dropna()
        if len(diff) < 10:
            return max(0, d - 1)
        adf_result = adfuller(diff)
        if adf_result[1] < 0.05:  # p-value < 0.05 => stationary
            return d
    return 1

def predict_price(prices, steps=1):
    """Fit ARIMA and predict next value(s)."""
    series = pd.Series(prices)
    series = series.dropna()
    if len(series) < 10:
        return None, 0

    d = find_d_order(series)
    # Simple grid for p, q (you can use auto_arima for better selection)
    best_aic = np.inf
    best_model = None
    for p in range(3):
        for q in range(3):
            try:
                model = ARIMA(series, order=(p, d, q))
                fitted = model.fit()
                if fitted.aic < best_aic:
                    best_aic = fitted.aic
                    best_model = fitted
            except:
                continue

    if best_model is None:
        return float(series.iloc[-1]), 50  # fallback to last price

    forecast = best_model.forecast(steps=steps)
    pred = float(forecast[-1])
    # Rough confidence from historical residuals
    residuals = best_model.resid
    std = np.std(residuals) if len(residuals) > 0 else 0
    confidence = max(50, min(95, 100 - 10 * (std / pred * 100) if pred else 70))
    return pred, confidence

if __name__ == "__main__":
    data = json.loads(sys.stdin.read())
    prices = data.get("prices", [])
    pred, conf = predict_price(prices)
    print(json.dumps({"predictedPrice": round(pred, 0), "confidence": round(conf, 0)}))
```

#### Step 3: Call from Node.js

```javascript
import { exec } from "child_process";
import { promisify } from "util";
const execAsync = promisify(exec);

export const predictWithARIMA = async (prices) => {
  const input = JSON.stringify({ prices });
  const { stdout } = await execAsync(
    `python3 scripts/arima_predict.py`,
    { input, maxBuffer: 1024 * 1024 }
  );
  return JSON.parse(stdout);
};
```

---

### Option 2: Pure Node.js (Limited)

There is no mature ARIMA library in Node.js. Options:

- **`arima` (npm)**: Basic ARIMA, less flexible than Python
- **`ml-regression`**: Linear regression only, not ARIMA
- **`brain.js`**: Neural networks, not classical ARIMA

Example with `arima` (if you install it):

```javascript
const ARIMA = require("arima");

const arima = new ARIMA({ p: 2, d: 1, q: 2 });
arima.train([/* array of historical prices */]);
const [forecast] = arima.predict(1);
```

---

### Option 3: Separate Python API

Run a small Flask/FastAPI service that exposes ARIMA predictions. Your Node backend calls it via HTTP.

```python
# api/predict.py (Flask)
from flask import Flask, request, jsonify
from statsmodels.tsa.arima.model import ARIMA
import pandas as pd

app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    prices = data.get("prices", [])
    # ... ARIMA logic ...
    return jsonify({"predictedPrice": pred, "confidence": conf})
```

---

## 4. Integration with Your Backend

### 4.1 Replace Dummy Prediction

In `mobile.controller.js`, replace `computeDummyPrediction` with a call to your ARIMA logic:

```javascript
import PriceHistory from "../../models/PriceHistory.js";
import { predictWithARIMA } from "../../services/arima.js";  // or your implementation

export const getPricePrediction = async (req, res) => {
  const mobile = await Mobile.findById(req.params.id);
  if (!mobile) return res.status(404).json({ message: "Mobile not found" });

  const history = await PriceHistory.find({ mobileId: mobile._id })
    .sort({ createdAt: 1 })
    .lean();

  const prices = history.map((h) => h.price);
  if (prices.length < 10) {
    // Fallback to dummy when insufficient data
    const pred = computeDummyPrediction(mobile);
    return res.json({ ...pred, note: "Insufficient history. Using heuristic." });
  }

  const { predictedPrice, confidence } = await predictWithARIMA(prices);
  const trend = predictedPrice >= mobile.price ? "up" : "down";

  res.json({
    mobileId: mobile._id,
    currentPrice: mobile.price,
    predictedPrice: Math.round(predictedPrice),
    trend,
    confidence,
    algorithm: "arima",
  });
};
```

### 4.2 When to Record Price History

Add a hook or logic when prices change:

```javascript
// After Mobile.findByIdAndUpdate or similar
if (req.body.price && req.body.price !== mobile.price) {
  await PriceHistory.create({ mobileId: mobile._id, price: req.body.price });
}
```

---

## 5. Model Tuning (p, d, q)

### 5.1 Choosing d (Differencing)

- Use **ADF test** (Augmented Dickey–Fuller) for stationarity
- If p-value > 0.05, apply differencing and test again
- Often `d = 1` for price series

### 5.2 Choosing p and q

- **ACF (Autocorrelation)** plot: suggests `q`
- **PACF (Partial ACF)** plot: suggests `p`
- Or use **auto_arima** (e.g. `pmdarima` in Python) to search automatically

```python
from pmdarima import auto_arima
model = auto_arima(series, seasonal=False, stepwise=True)
# model.order gives (p, d, q)
```

---

## 6. LSTM (Alternative / Hybrid)

Your project mentions **LSTM** as well. LSTM is useful for:

- Longer sequences
- Non-linear patterns
- When you have many features (specs, brand, etc.)

**Hybrid approach:**
- Use **ARIMA** for time-series trend
- Use **LSTM** or a regression model for spec-based price estimation
- Combine: `final_pred = 0.5 * arima_pred + 0.5 * lstm_pred`

---

## 7. Checklist

- [ ] Populate `PriceHistory` when prices change (or via cron)
- [ ] Ensure at least 30+ points per device before using ARIMA
- [ ] Set up Python env and `statsmodels` (or chosen library)
- [ ] Implement `predictWithARIMA` (Python script or service)
- [ ] Replace `computeDummyPrediction` in controller with real ARIMA call
- [ ] Add fallback to dummy/heuristic when history is insufficient
- [ ] (Optional) Add LSTM or hybrid model later

---

## 8. References

- [Statsmodels ARIMA](https://www.statsmodels.org/stable/generated/statsmodels.tsa.arima.model.ARIMA.html)
- [Time Series Forecasting (Towards Data Science)](https://towardsdatascience.com/time-series-forecasting-arima-models-7f221e9eee06)
- [ADF Test for Stationarity](https://www.statsmodels.org/stable/generated/statsmodels.tsa.stattools.adfuller.html)
