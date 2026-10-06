import Papa from 'papaparse';

// Helper Math utilities
export function calculateMean(arr) {
  if (!arr || arr.length === 0) return 0;
  const sum = arr.reduce((acc, val) => acc + (Number(val) || 0), 0);
  return sum / arr.length;
}

export function calculateMedian(arr) {
  if (!arr || arr.length === 0) return 0;
  const sorted = [...arr].map(Number).sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

export function calculateStdDev(arr, meanVal) {
  if (!arr || arr.length <= 1) return 0;
  const mean = meanVal !== undefined ? meanVal : calculateMean(arr);
  const variance = arr.reduce((acc, val) => acc + Math.pow((Number(val) || 0) - mean, 2), 0) / (arr.length - 1);
  return Math.sqrt(variance);
}

export function calculateQuartiles(arr) {
  if (!arr || arr.length === 0) return { q1: 0, q3: 0, iqr: 0 };
  const sorted = [...arr].map(Number).sort((a, b) => a - b);
  const getP = (p) => {
    const idx = (sorted.length - 1) * p;
    const l = Math.floor(idx);
    const u = Math.ceil(idx);
    const w = idx - l;
    return u >= sorted.length ? sorted[sorted.length - 1] : sorted[l] * (1 - w) + sorted[u] * w;
  };
  const q1 = getP(0.25);
  const q3 = getP(0.75);
  return { q1, q3, iqr: q3 - q1 };
}

// Pearson Correlation Coefficient calculation
export function calculatePearsonCorrelation(xArr, yArr) {
  if (!xArr || !yArr || xArr.length !== yArr.length || xArr.length === 0) return 0;

  const n = xArr.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;

  for (let i = 0; i < n; i++) {
    const x = Number(xArr[i]) || 0;
    const y = Number(yArr[i]) || 0;

    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
    sumY2 += y * y;
  }

  const num = n * sumXY - sumX * sumY;
  const den = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  if (den === 0) return 0;
  const r = num / den;
  return Math.max(-1, Math.min(1, Math.round(r * 1000) / 1000));
}

export const NUMERIC_VARIABLES = [
  { id: 'age', label: 'Age' },
  { id: 'income', label: 'Income' },
  { id: 'quantity', label: 'Quantity' },
  { id: 'discount', label: 'Discount (%)' },
  { id: 'previous_purchases', label: 'Previous Purchases' },
  { id: 'review_rating', label: 'Review Rating' },
  { id: 'purchase_frequency', label: 'Purchase Frequency' },
  { id: 'purchase_amount', label: 'Purchase Amount' }
];

// Calculate full Correlation Matrix
export function computeCorrelationMatrix(dataset) {
  const matrix = {};
  const keys = NUMERIC_VARIABLES.map(v => v.id);

  keys.forEach(k1 => {
    matrix[k1] = {};
    const arr1 = dataset.map(row => Number(row[k1]) || 0);

    keys.forEach(k2 => {
      const arr2 = dataset.map(row => Number(row[k2]) || 0);
      matrix[k1][k2] = calculatePearsonCorrelation(arr1, arr2);
    });
  });

  return matrix;
}

// Compute Descriptive Stats for all numeric columns
export function computeDescriptiveStats(dataset) {
  const stats = {};
  const keys = NUMERIC_VARIABLES.map(v => v.id);

  keys.forEach(key => {
    const vals = dataset.map(row => Number(row[key])).filter(v => !isNaN(v));
    if (vals.length === 0) {
      stats[key] = { mean: 0, median: 0, stdDev: 0, min: 0, max: 0, variance: 0, q1: 0, q3: 0, iqr: 0 };
      return;
    }

    const mean = calculateMean(vals);
    const median = calculateMedian(vals);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const stdDev = calculateStdDev(vals, mean);
    const variance = Math.pow(stdDev, 2);
    const { q1, q3, iqr } = calculateQuartiles(vals);

    stats[key] = {
      mean: Math.round(mean * 100) / 100,
      median: Math.round(median * 100) / 100,
      stdDev: Math.round(stdDev * 100) / 100,
      variance: Math.round(variance * 100) / 100,
      min: Math.round(min * 100) / 100,
      max: Math.round(max * 100) / 100,
      q1: Math.round(q1 * 100) / 100,
      q3: Math.round(q3 * 100) / 100,
      iqr: Math.round(iqr * 100) / 100
    };
  });

  return stats;
}

// CSV Parser Helper
export function parseCSVFile(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        const cleaned = results.data.map((row, idx) => ({
          customer_id: row.customer_id || row.CustomerID || idx + 1,
          age: Number(row.age || row.Age || 30),
          gender: String(row.gender || row.Gender || 'Other').trim(),
          location: String(row.location || row.Location || 'General').trim(),
          income: Number(row.income || row.Income || 50000),
          product_category: String(row.product_category || row.Category || 'General').trim(),
          quantity: Number(row.quantity || row.Quantity || 1),
          discount: Number(row.discount || row.Discount || 0),
          purchase_amount: Number(row.purchase_amount || row.PurchaseAmount || row.Amount || 50),
          purchase_date: String(row.purchase_date || row.Date || '2024-01-01').trim(),
          review_rating: Number(row.review_rating || row.Rating || 4.0),
          purchase_frequency: Number(row.purchase_frequency || row.Frequency || 1),
          previous_purchases: Number(row.previous_purchases || row.PreviousPurchases || 1)
        }));
        resolve({ data: cleaned, meta: results.meta });
      },
      error: (err) => reject(err)
    });
  });
}
