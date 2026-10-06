/**
 * Data Science & Statistical Analytics Module
 * Includes Pearson Correlation, Descriptive Statistics, K-Means Clustering, Linear Regression & Insight Generation.
 */

// 1. Mean calculation
function calculateMean(arr) {
  if (!arr || arr.length === 0) return 0;
  const sum = arr.reduce((acc, val) => acc + (Number(val) || 0), 0);
  return sum / arr.length;
}

// 2. Median calculation
function calculateMedian(arr) {
  if (!arr || arr.length === 0) return 0;
  const sorted = [...arr].map(Number).sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

// 3. Standard Deviation calculation
function calculateStdDev(arr, meanVal) {
  if (!arr || arr.length <= 1) return 0;
  const mean = meanVal !== undefined ? meanVal : calculateMean(arr);
  const variance = arr.reduce((acc, val) => acc + Math.pow((Number(val) || 0) - mean, 2), 0) / (arr.length - 1);
  return Math.sqrt(variance);
}

// 4. Quartiles (Q1, Q3)
function calculateQuartiles(arr) {
  if (!arr || arr.length === 0) return { q1: 0, q3: 0, iqr: 0 };
  const sorted = [...arr].map(Number).sort((a, b) => a - b);
  const getPercentile = (p) => {
    const idx = (sorted.length - 1) * p;
    const lower = Math.floor(idx);
    const upper = Math.ceil(idx);
    const weight = idx - lower;
    if (upper >= sorted.length) return sorted[sorted.length - 1];
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  };
  const q1 = getPercentile(0.25);
  const q3 = getPercentile(0.75);
  return { q1, q3, iqr: q3 - q1 };
}

// 5. Pearson Correlation Coefficient calculation
function calculatePearsonCorrelation(xArr, yArr) {
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

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  if (denominator === 0) return 0;
  const r = numerator / denominator;
  return Math.max(-1, Math.min(1, Math.round(r * 1000) / 1000));
}

// 6. Full Correlation Matrix
const NUMERIC_FEATURES = [
  'age', 'income', 'quantity', 'discount', 
  'previous_purchases', 'review_rating', 'purchase_frequency', 'purchase_amount'
];

function getCorrelationMatrix(dataset) {
  const matrix = {};

  NUMERIC_FEATURES.forEach(feature1 => {
    matrix[feature1] = {};
    const arr1 = dataset.map(row => Number(row[feature1]) || 0);

    NUMERIC_FEATURES.forEach(feature2 => {
      const arr2 = dataset.map(row => Number(row[feature2]) || 0);
      matrix[feature1][feature2] = calculatePearsonCorrelation(arr1, arr2);
    });
  });

  return { features: NUMERIC_FEATURES, matrix };
}

// 7. Full Descriptive Statistics for all numerical columns
function getDescriptiveStats(dataset) {
  const stats = {};

  NUMERIC_FEATURES.forEach(feature => {
    const vals = dataset.map(row => Number(row[feature])).filter(v => !isNaN(v));
    if (vals.length === 0) {
      stats[feature] = { count: 0, mean: 0, median: 0, min: 0, max: 0, stdDev: 0, variance: 0, q1: 0, q3: 0, iqr: 0 };
      return;
    }

    const mean = calculateMean(vals);
    const median = calculateMedian(vals);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const stdDev = calculateStdDev(vals, mean);
    const variance = Math.pow(stdDev, 2);
    const { q1, q3, iqr } = calculateQuartiles(vals);

    stats[feature] = {
      count: vals.length,
      mean: Math.round(mean * 100) / 100,
      median: Math.round(median * 100) / 100,
      min: Math.round(min * 100) / 100,
      max: Math.round(max * 100) / 100,
      stdDev: Math.round(stdDev * 100) / 100,
      variance: Math.round(variance * 100) / 100,
      q1: Math.round(q1 * 100) / 100,
      q3: Math.round(q3 * 100) / 100,
      iqr: Math.round(iqr * 100) / 100
    };
  });

  return stats;
}

// 8. K-Means Clustering implementation
function performKMeansClustering(dataset, k = 4, maxIterations = 20) {
  if (!dataset || dataset.length === 0) return { clusters: [], clusterSummary: [] };

  const clusterFeatures = ['age', 'income', 'purchase_frequency', 'purchase_amount'];
  
  // Normalize features
  const means = {};
  const stdDevs = {};
  clusterFeatures.forEach(feat => {
    const vals = dataset.map(d => Number(d[feat]) || 0);
    means[feat] = calculateMean(vals);
    stdDevs[feat] = calculateStdDev(vals, means[feat]) || 1;
  });

  const normalizedData = dataset.map((row, idx) => {
    const norm = {};
    clusterFeatures.forEach(feat => {
      norm[feat] = ((Number(row[feat]) || 0) - means[feat]) / stdDevs[feat];
    });
    return { original: row, norm, index: idx };
  });

  // Pick initial k centroids deterministically based on quantiles to ensure stable runs
  let centroids = [];
  const step = Math.floor(normalizedData.length / k);
  for (let i = 0; i < k; i++) {
    const sampleIdx = Math.min(i * step + Math.floor(step / 2), normalizedData.length - 1);
    const c = {};
    clusterFeatures.forEach(f => {
      c[f] = normalizedData[sampleIdx].norm[f];
    });
    centroids.push(c);
  }

  let assignments = new Array(normalizedData.length).fill(0);

  for (let iter = 0; iter < maxIterations; iter++) {
    let changed = false;

    // Assign points to nearest centroid
    normalizedData.forEach((item, idx) => {
      let minDistance = Infinity;
      let closestCluster = 0;

      centroids.forEach((c, cIdx) => {
        let dist = 0;
        clusterFeatures.forEach(f => {
          dist += Math.pow(item.norm[f] - c[f], 2);
        });
        dist = Math.sqrt(dist);

        if (dist < minDistance) {
          minDistance = dist;
          closestCluster = cIdx;
        }
      });

      if (assignments[idx] !== closestCluster) {
        assignments[idx] = closestCluster;
        changed = true;
      }
    });

    if (!changed) break;

    // Recalculate centroids
    for (let cIdx = 0; cIdx < k; cIdx++) {
      const clusterPoints = normalizedData.filter((_, idx) => assignments[idx] === cIdx);
      if (clusterPoints.length > 0) {
        clusterFeatures.forEach(f => {
          centroids[cIdx][f] = clusterPoints.reduce((acc, p) => acc + p.norm[f], 0) / clusterPoints.length;
        });
      }
    }
  }

  // Generate Cluster Profiles & Summaries
  const clusterSummary = [];
  for (let cIdx = 0; cIdx < k; cIdx++) {
    const clusterRows = dataset.filter((_, idx) => assignments[idx] === cIdx);
    const count = clusterRows.length;
    const avgAmount = count > 0 ? calculateMean(clusterRows.map(r => Number(r.purchase_amount))) : 0;
    const avgFrequency = count > 0 ? calculateMean(clusterRows.map(r => Number(r.purchase_frequency))) : 0;
    const avgIncome = count > 0 ? calculateMean(clusterRows.map(r => Number(r.income))) : 0;
    const avgAge = count > 0 ? calculateMean(clusterRows.map(r => Number(r.age))) : 0;

    let label = `Cluster ${cIdx + 1}`;
    let description = 'Standard Cluster Group';
    
    // Assign descriptive segment titles based on characteristics
    if (avgAmount > 450 && avgFrequency > 8) {
      label = `Cluster ${cIdx + 1}: High-Value Loyalists`;
      description = 'High spending volume with frequent repeat purchases.';
    } else if (avgAmount > 300) {
      label = `Cluster ${cIdx + 1}: Big Spenders`;
      description = 'High basket values with moderate purchase frequency.';
    } else if (avgFrequency > 10) {
      label = `Cluster ${cIdx + 1}: Frequent Buyers`;
      description = 'Regular purchasers with lower to average cart amounts.';
    } else if (avgIncome > 70000) {
      label = `Cluster ${cIdx + 1}: High Income Prospects`;
      description = 'Affluent customers with potential for upselling.';
    } else {
      label = `Cluster ${cIdx + 1}: Budget / Occasional Shoppers`;
      description = 'Lower transaction amounts and low activity frequency.';
    }

    clusterSummary.push({
      clusterId: cIdx + 1,
      name: label,
      description,
      count,
      percentage: dataset.length > 0 ? Math.round((count / dataset.length) * 1000) / 10 : 0,
      avgPurchaseAmount: Math.round(avgAmount * 100) / 100,
      avgFrequency: Math.round(avgFrequency * 10) / 10,
      avgIncome: Math.round(avgIncome),
      avgAge: Math.round(avgAge * 10) / 10
    });
  }

  return { assignments, clusterSummary };
}

// 9. Multiple Linear Regression OLS (Predict Purchase Amount)
function trainLinearRegressionModel(dataset) {
  if (!dataset || dataset.length < 10) {
    return { r2: 0, mae: 0, rmse: 0, coefficients: {}, samplePredictions: [] };
  }

  const features = ['age', 'income', 'quantity', 'discount', 'previous_purchases', 'review_rating', 'purchase_frequency'];
  const target = 'purchase_amount';

  const n = dataset.length;
  const p = features.length;

  // Simple Normal Equation estimation: beta = (X^T X)^-1 X^T y
  // Construct matrix X (n x (p+1)) and vector Y (n x 1)
  const X = [];
  const Y = [];

  for (let i = 0; i < n; i++) {
    const row = dataset[i];
    const xRow = [1]; // Intercept
    features.forEach(f => {
      xRow.push(Number(row[f]) || 0);
    });
    X.push(xRow);
    Y.push(Number(row[target]) || 0);
  }

  // Transpose X -> XT
  const XT = Array(p + 1).fill(0).map(() => Array(n).fill(0));
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < p + 1; c++) {
      XT[c][r] = X[r][c];
    }
  }

  // XTX = XT * X
  const XTX = Array(p + 1).fill(0).map(() => Array(p + 1).fill(0));
  for (let i = 0; i < p + 1; i++) {
    for (let j = 0; j < p + 1; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += XT[i][k] * X[k][j];
      }
      XTX[i][j] = sum;
    }
  }

  // XTY = XT * Y
  const XTY = Array(p + 1).fill(0);
  for (let i = 0; i < p + 1; i++) {
    let sum = 0;
    for (let k = 0; k < n; k++) {
      sum += XT[i][k] * Y[k];
    }
    XTY[i] = sum;
  }

  // Gaussian elimination with row pivoting to solve XTX * Beta = XTY
  const A = XTX.map((row, idx) => [...row, XTY[idx]]);
  const size = p + 1;

  for (let i = 0; i < size; i++) {
    let maxRow = i;
    for (let k = i + 1; k < size; k++) {
      if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {
        maxRow = k;
      }
    }
    const temp = A[i];
    A[i] = A[maxRow];
    A[maxRow] = temp;

    if (Math.abs(A[i][i]) < 1e-10) continue; // Singular

    for (let k = i + 1; k < size; k++) {
      const c = -A[k][i] / A[i][i];
      for (let j = i; j < size + 1; j++) {
        if (i === j) {
          A[k][j] = 0;
        } else {
          A[k][j] += c * A[i][j];
        }
      }
    }
  }

  const beta = Array(size).fill(0);
  for (let i = size - 1; i >= 0; i--) {
    let sum = A[i][size];
    for (let j = i + 1; j < size; j++) {
      sum -= A[i][j] * beta[j];
    }
    beta[i] = A[i][i] !== 0 ? sum / A[i][i] : 0;
  }

  const coefficients = { intercept: Math.round(beta[0] * 100) / 100 };
  features.forEach((feat, idx) => {
    coefficients[feat] = Math.round(beta[idx + 1] * 1000) / 1000;
  });

  // Calculate Predictions & Model Metrics (R², MAE, RMSE)
  let ssTotal = 0;
  let ssResidual = 0;
  let totalAbsError = 0;
  const meanY = calculateMean(Y);
  const samplePredictions = [];

  for (let i = 0; i < n; i++) {
    let pred = beta[0];
    features.forEach((feat, idx) => {
      pred += beta[idx + 1] * (Number(dataset[i][feat]) || 0);
    });

    const actual = Y[i];
    ssTotal += Math.pow(actual - meanY, 2);
    ssResidual += Math.pow(actual - pred, 2);
    totalAbsError += Math.abs(actual - pred);

    if (i < 100) { // Keep top 100 for visualization scatter plot
      samplePredictions.push({
        id: i + 1,
        actual: Math.round(actual * 100) / 100,
        predicted: Math.round(pred * 100) / 100,
        category: dataset[i].product_category || 'General'
      });
    }
  }

  const r2 = ssTotal !== 0 ? Math.max(0, 1 - (ssResidual / ssTotal)) : 0;
  const mae = totalAbsError / n;
  const rmse = Math.sqrt(ssResidual / n);

  return {
    r2: Math.round(r2 * 1000) / 1000,
    mae: Math.round(mae * 100) / 100,
    rmse: Math.round(rmse * 100) / 100,
    coefficients,
    samplePredictions
  };
}

// Predict single input object
function predictPurchaseAmount(inputObj, coefficients) {
  let pred = coefficients.intercept || 0;
  const features = ['age', 'income', 'quantity', 'discount', 'previous_purchases', 'review_rating', 'purchase_frequency'];
  features.forEach(f => {
    pred += (coefficients[f] || 0) * (Number(inputObj[f]) || 0);
  });
  return Math.max(0, Math.round(pred * 100) / 100);
}

// 10. Generate Data-Driven Insights dynamically from dataset
function generateDynamicInsights(dataset) {
  if (!dataset || dataset.length === 0) return [];

  const corrObj = getCorrelationMatrix(dataset);
  const purchaseCorrs = corrObj.matrix['purchase_amount'];
  const stats = getDescriptiveStats(dataset);

  // Find feature with highest correlation to purchase_amount (excluding purchase_amount itself)
  let maxCorrFeature = '';
  let maxCorrVal = -2;

  Object.entries(purchaseCorrs).forEach(([feat, val]) => {
    if (feat !== 'purchase_amount' && val > maxCorrVal) {
      maxCorrVal = val;
      maxCorrFeature = feat;
    }
  });

  const insights = [];

  // Key Finding 1: Strongest Correlation Driver
  const featureReadableName = maxCorrFeature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  let corrStrengthStr = 'weak';
  if (Math.abs(maxCorrVal) > 0.7) corrStrengthStr = 'strong';
  else if (Math.abs(maxCorrVal) > 0.4) corrStrengthStr = 'moderate';

  const dirStr = maxCorrVal >= 0 ? 'positive' : 'negative';

  insights.push({
    id: 1,
    title: `Key Correlation Driver: ${featureReadableName}`,
    category: 'Correlation Analysis',
    importance: 'High',
    metric: `r = ${maxCorrVal}`,
    description: `Analysis reveals that '${featureReadableName}' exhibits the strongest correlation (r = ${maxCorrVal}) with Purchase Amount in this dataset. It shows a ${corrStrengthStr} ${dirStr} linear relationship with basket spending.`,
    recommendation: `Target optimization strategies towards ${featureReadableName.toLowerCase()} to boost basket sizes.`
  });

  // Key Finding 2: Category Spending Leader
  const categoryMap = {};
  dataset.forEach(row => {
    const cat = row.product_category || 'Other';
    if (!categoryMap[cat]) categoryMap[cat] = { total: 0, count: 0 };
    categoryMap[cat].total += Number(row.purchase_amount) || 0;
    categoryMap[cat].count += 1;
  });

  let topCategory = '';
  let maxCatTotal = 0;
  Object.entries(categoryMap).forEach(([cat, data]) => {
    if (data.total > maxCatTotal) {
      maxCatTotal = data.total;
      topCategory = cat;
    }
  });

  const totalRevenue = dataset.reduce((acc, row) => acc + (Number(row.purchase_amount) || 0), 0);
  const topCatShare = totalRevenue > 0 ? Math.round((maxCatTotal / totalRevenue) * 100) : 0;

  insights.push({
    id: 2,
    title: `Dominant Category: ${topCategory}`,
    category: 'Category Performance',
    importance: 'Medium',
    metric: `${topCatShare}% Revenue Share`,
    description: `${topCategory} commands the largest share of overall transaction volume, accounting for \$${Math.round(maxCatTotal).toLocaleString()} (${topCatShare}% of total gross purchase value).`,
    recommendation: `Expand product depth and cross-selling campaigns within ${topCategory} while scaling high-margin bundles.`
  });

  // Key Finding 3: Discount Impact Analysis
  const discountCorr = purchaseCorrs['discount'] || 0;
  let discountImpactText = 'shows minimal impact';
  if (discountCorr < -0.15) discountImpactText = 'negatively impacts total purchase value (higher discounts are associated with lower spending items)';
  else if (discountCorr > 0.15) discountImpactText = 'positively encourages larger basket sizes';

  insights.push({
    id: 3,
    title: 'Discount Elasticity & Basket Value',
    category: 'Pricing Strategy',
    importance: 'High',
    metric: `Discount r = ${discountCorr}`,
    description: `Discount percentage yields a correlation coefficient of r = ${discountCorr} against Purchase Amount. Data indicates that price reductions ${discountImpactText}.`,
    recommendation: `Audit promotional tiering to prevent margin erosion without driving incremental basket quantity.`
  });

  // Key Finding 4: Customer Purchase Frequency & Loyalty
  const freqCorr = purchaseCorrs['purchase_frequency'] || 0;
  const avgFreq = stats['purchase_frequency'] ? stats['purchase_frequency'].mean : 0;

  insights.push({
    id: 4,
    title: 'Purchase Frequency & Lifetime Value',
    category: 'Customer Loyalty',
    importance: 'Medium',
    metric: `Avg Frequency = ${avgFreq} purchases`,
    description: `Repeat purchase frequency averages ${avgFreq} orders per customer, with a correlation of r = ${freqCorr} to transaction spending. High-frequency buyers consistently generate superior aggregate lifetime value.`,
    recommendation: `Implement automated re-engagement triggers and loyalty tier incentives for customers approaching ${Math.ceil(avgFreq)} orders.`
  });

  return insights;
}

module.exports = {
  calculateMean,
  calculateMedian,
  calculateStdDev,
  calculateQuartiles,
  calculatePearsonCorrelation,
  getCorrelationMatrix,
  getDescriptiveStats,
  performKMeansClustering,
  trainLinearRegressionModel,
  predictPurchaseAmount,
  generateDynamicInsights,
  NUMERIC_FEATURES
};
