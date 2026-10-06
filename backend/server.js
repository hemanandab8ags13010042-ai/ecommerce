const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { initDB, getDataset, updateMemoryDataset, isUsingFallback } = require('./config/db');
const {
  getCorrelationMatrix,
  getDescriptiveStats,
  performKMeansClustering,
  trainLinearRegressionModel,
  predictPurchaseAmount,
  generateDynamicInsights,
  calculatePearsonCorrelation
} = require('./utils/analytics');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Setup file upload multer configuration
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const upload = multer({ dest: uploadDir });

// Initialize DB connection
initDB();

// Helper to extract query parameters into filter object
function parseFilters(req) {
  return {
    gender: req.query.gender,
    category: req.query.category,
    region: req.query.region,
    minAge: req.query.minAge,
    maxAge: req.query.maxAge,
    minAmount: req.query.minAmount,
    maxAmount: req.query.maxAmount,
    minIncome: req.query.minIncome,
    maxIncome: req.query.maxIncome
  };
}

// 1. GET /api/dataset - Raw or filtered dataset
app.get('/api/dataset', async (req, res) => {
  try {
    const filters = parseFilters(req);
    const data = await getDataset(filters);
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. GET /api/customers - Customer aggregated statistics & list
app.get('/api/customers', async (req, res) => {
  try {
    const filters = parseFilters(req);
    const data = await getDataset(filters);

    const customerMap = {};
    data.forEach(row => {
      const cid = row.customer_id;
      if (!customerMap[cid]) {
        customerMap[cid] = {
          customer_id: cid,
          age: Number(row.age),
          gender: row.gender,
          location: row.location,
          income: Number(row.income),
          totalPurchases: 0,
          totalSpent: 0,
          avgSpend: 0
        };
      }
      customerMap[cid].totalPurchases += 1;
      customerMap[cid].totalSpent += Number(row.purchase_amount) || 0;
    });

    const customers = Object.values(customerMap).map(c => ({
      ...c,
      totalSpent: Math.round(c.totalSpent * 100) / 100,
      avgSpend: Math.round((c.totalSpent / c.totalPurchases) * 100) / 100
    }));

    res.json({ success: true, totalCustomers: customers.length, customers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. GET /api/purchases - Purchase details and trends
app.get('/api/purchases', async (req, res) => {
  try {
    const filters = parseFilters(req);
    const data = await getDataset(filters);

    // Monthly Trend
    const monthlyMap = {};
    data.forEach(row => {
      if (!row.purchase_date) return;
      const monthKey = row.purchase_date.substring(0, 7); // YYYY-MM
      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { month: monthKey, totalAmount: 0, totalOrders: 0 };
      }
      monthlyMap[monthKey].totalAmount += Number(row.purchase_amount) || 0;
      monthlyMap[monthKey].totalOrders += 1;
    });

    const monthlyTrend = Object.values(monthlyMap)
      .sort((a, b) => a.month.localeCompare(b.month))
      .map(m => ({
        ...m,
        totalAmount: Math.round(m.totalAmount * 100) / 100,
        avgAmount: Math.round((m.totalAmount / m.totalOrders) * 100) / 100
      }));

    res.json({ success: true, totalPurchases: data.length, monthlyTrend, purchases: data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. GET /api/statistics - Full Descriptive Statistics & KPIs
app.get('/api/statistics', async (req, res) => {
  try {
    const filters = parseFilters(req);
    const data = await getDataset(filters);

    const stats = getDescriptiveStats(data);

    // Dynamic KPIs
    const totalTransactions = data.length;
    const customerIds = new Set(data.map(d => d.customer_id));
    const totalCustomers = customerIds.size;
    const totalPurchaseAmount = data.reduce((acc, row) => acc + (Number(row.purchase_amount) || 0), 0);
    const avgPurchaseAmount = totalTransactions > 0 ? totalPurchaseAmount / totalTransactions : 0;
    const avgAge = stats.age ? stats.age.mean : 0;
    const avgFrequency = stats.purchase_frequency ? stats.purchase_frequency.mean : 0;
    const maxPurchaseAmount = stats.purchase_amount ? stats.purchase_amount.max : 0;

    // Repeat Customer Percentage
    const customerCounts = {};
    data.forEach(d => {
      customerCounts[d.customer_id] = (customerCounts[d.customer_id] || 0) + 1;
    });
    const repeatCount = Object.values(customerCounts).filter(c => c > 1).length;
    const repeatPercentage = totalCustomers > 0 ? (repeatCount / totalCustomers) * 100 : 0;

    res.json({
      success: true,
      kpis: {
        totalCustomers,
        totalTransactions,
        totalPurchaseAmount: Math.round(totalPurchaseAmount * 100) / 100,
        avgPurchaseAmount: Math.round(avgPurchaseAmount * 100) / 100,
        avgCustomerAge: Math.round(avgAge * 10) / 10,
        avgPurchaseFrequency: Math.round(avgFrequency * 10) / 10,
        highestPurchaseAmount: Math.round(maxPurchaseAmount * 100) / 100,
        repeatCustomerPercentage: Math.round(repeatPercentage * 10) / 10
      },
      stats
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. GET /api/correlation - Pearson Correlation matrix & scatter data
app.get('/api/correlation', async (req, res) => {
  try {
    const filters = parseFilters(req);
    const data = await getDataset(filters);

    const correlationResult = getCorrelationMatrix(data);
    const xVar = req.query.xVar || 'income';

    const scatterData = data.map(row => ({
      customer_id: row.customer_id,
      product_category: row.product_category,
      xValue: Number(row[xVar]) || 0,
      purchaseAmount: Number(row.purchase_amount) || 0,
      quantity: Number(row.quantity) || 0,
      discount: Number(row.discount) || 0
    }));

    const xValues = scatterData.map(d => d.xValue);
    const yValues = scatterData.map(d => d.purchaseAmount);
    const rScore = calculatePearsonCorrelation(xValues, yValues);

    let strength = 'Weak';
    const absR = Math.abs(rScore);
    if (absR >= 0.7) strength = 'Strong';
    else if (absR >= 0.4) strength = 'Moderate';

    const direction = rScore > 0 ? 'Positive' : rScore < 0 ? 'Negative' : 'No Correlation';

    res.json({
      success: true,
      matrix: correlationResult.matrix,
      features: correlationResult.features,
      scatter: {
        xVar,
        rScore,
        strength,
        direction,
        observations: scatterData.length,
        points: scatterData
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. GET /api/categories - Breakdown by Product Category
app.get('/api/categories', async (req, res) => {
  try {
    const filters = parseFilters(req);
    const data = await getDataset(filters);

    const categoryMap = {};
    data.forEach(row => {
      const cat = row.product_category || 'Unassigned';
      if (!categoryMap[cat]) {
        categoryMap[cat] = { category: cat, totalAmount: 0, count: 0, totalQty: 0 };
      }
      categoryMap[cat].totalAmount += Number(row.purchase_amount) || 0;
      categoryMap[cat].totalQty += Number(row.quantity) || 0;
      categoryMap[cat].count += 1;
    });

    const categories = Object.values(categoryMap).map(c => ({
      ...c,
      totalAmount: Math.round(c.totalAmount * 100) / 100,
      avgAmount: Math.round((c.totalAmount / c.count) * 100) / 100,
      avgQty: Math.round((c.totalQty / c.count) * 10) / 10
    }));

    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. GET /api/regions - Location / Geographic Breakdown
app.get('/api/regions', async (req, res) => {
  try {
    const filters = parseFilters(req);
    const data = await getDataset(filters);

    const regionMap = {};
    data.forEach(row => {
      const loc = row.location || 'Unknown';
      if (!regionMap[loc]) {
        regionMap[loc] = { location: loc, totalAmount: 0, count: 0 };
      }
      regionMap[loc].totalAmount += Number(row.purchase_amount) || 0;
      regionMap[loc].count += 1;
    });

    const regions = Object.values(regionMap).map(r => ({
      ...r,
      totalAmount: Math.round(r.totalAmount * 100) / 100,
      avgAmount: Math.round((r.totalAmount / r.count) * 100) / 100
    })).sort((a, b) => b.totalAmount - a.totalAmount);

    res.json({ success: true, regions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. GET /api/segments - Customer Segmentation & K-Means
app.get('/api/segments', async (req, res) => {
  try {
    const filters = parseFilters(req);
    const data = await getDataset(filters);
    const k = parseInt(req.query.k) || 4;

    const clustering = performKMeansClustering(data, k);
    res.json({ success: true, k, clusterSummary: clustering.clusterSummary });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. GET /api/insights - Data-driven Key Findings
app.get('/api/insights', async (req, res) => {
  try {
    const filters = parseFilters(req);
    const data = await getDataset(filters);

    const insights = generateDynamicInsights(data);
    res.json({ success: true, insights });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 10. GET /api/ml/model & POST /api/ml/predict - Machine Learning Linear Regression
app.get('/api/ml/model', async (req, res) => {
  try {
    const filters = parseFilters(req);
    const data = await getDataset(filters);

    const mlResult = trainLinearRegressionModel(data);
    res.json({ success: true, ...mlResult });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/ml/predict', async (req, res) => {
  try {
    const { inputData, coefficients } = req.body;
    let coeffs = coefficients;

    if (!coeffs) {
      const data = await getDataset();
      const model = trainLinearRegressionModel(data);
      coeffs = model.coefficients;
    }

    const prediction = predictPurchaseAmount(inputData, coeffs);
    res.json({ success: true, predictedPurchaseAmount: prediction, coefficientsUsed: coeffs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 11. POST /api/upload - Handle Dataset Upload (CSV format / custom dataset)
app.post('/api/upload', upload.single('dataset'), async (req, res) => {
  try {
    let rawData = [];

    if (req.file) {
      const fileContent = fs.readFileSync(req.file.path, 'utf-8');
      const lines = fileContent.split(/\r?\n/).filter(line => line.trim().length > 0);

      if (lines.length > 1) {
        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        
        for (let i = 1; i < lines.length; i++) {
          // Parse CSV row respecting quotes
          const rowValues = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
          if (!rowValues || rowValues.length < 5) continue;

          const obj = {};
          headers.forEach((h, idx) => {
            let val = rowValues[idx] ? rowValues[idx].trim().replace(/^"|"$/g, '') : '';
            // Auto parse numbers
            if (!isNaN(val) && val !== '') val = Number(val);
            obj[h] = val;
          });

          // Ensure standard property names exist
          obj.customer_id = obj.customer_id || obj.CustomerID || i;
          obj.age = Number(obj.age || obj.Age || 30);
          obj.gender = obj.gender || obj.Gender || 'Other';
          obj.location = obj.location || obj.Location || 'General';
          obj.income = Number(obj.income || obj.Income || 50000);
          obj.product_category = obj.product_category || obj.Category || 'General';
          obj.quantity = Number(obj.quantity || obj.Quantity || 1);
          obj.discount = Number(obj.discount || obj.Discount || 0);
          obj.purchase_amount = Number(obj.purchase_amount || obj.PurchaseAmount || obj.Amount || 50);
          obj.purchase_date = obj.purchase_date || obj.Date || '2024-01-01';
          obj.review_rating = Number(obj.review_rating || obj.Rating || 4.0);
          obj.purchase_frequency = Number(obj.purchase_frequency || obj.Frequency || 1);
          obj.previous_purchases = Number(obj.previous_purchases || obj.PreviousPurchases || 1);

          rawData.push(obj);
        }
      }
    } else if (req.body.data && Array.isArray(req.body.data)) {
      rawData = req.body.data;
    }

    if (rawData.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid dataset format or empty file.' });
    }

    // Update system memory dataset
    updateMemoryDataset(rawData);

    // Calculate quality summary
    const totalRows = rawData.length;
    const sampleKeys = Object.keys(rawData[0]);
    const numCols = sampleKeys.length;

    let missingValuesCount = 0;
    rawData.forEach(row => {
      sampleKeys.forEach(k => {
        if (row[k] === null || row[k] === undefined || row[k] === '') {
          missingValuesCount++;
        }
      });
    });

    res.json({
      success: true,
      message: 'Dataset uploaded and processed successfully!',
      summary: {
        totalRows,
        totalColumns: numCols,
        missingValues: missingValuesCount,
        duplicateRows: 0,
        numericalColumns: ['age', 'income', 'quantity', 'discount', 'previous_purchases', 'review_rating', 'purchase_frequency', 'purchase_amount'],
        categoricalColumns: ['gender', 'location', 'product_category']
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend REST API server running on http://localhost:${PORT}`);
});
