const API_BASE_URL = 'http://localhost:5000/api';

// Helper for building query params
function buildQueryString(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '' && val !== 'All') {
      params.append(key, val);
    }
  });
  const q = params.toString();
  return q ? `?${q}` : '';
}

export const fetchDataset = async (filters) => {
  const res = await fetch(`${API_BASE_URL}/dataset${buildQueryString(filters)}`);
  return res.json();
};

export const fetchCustomers = async (filters) => {
  const res = await fetch(`${API_BASE_URL}/customers${buildQueryString(filters)}`);
  return res.json();
};

export const fetchPurchases = async (filters) => {
  const res = await fetch(`${API_BASE_URL}/purchases${buildQueryString(filters)}`);
  return res.json();
};

export const fetchStatistics = async (filters) => {
  const res = await fetch(`${API_BASE_URL}/statistics${buildQueryString(filters)}`);
  return res.json();
};

export const fetchCorrelation = async (filters, xVar = 'income') => {
  const params = buildQueryString({ ...filters, xVar });
  const res = await fetch(`${API_BASE_URL}/correlation${params}`);
  return res.json();
};

export const fetchCategories = async (filters) => {
  const res = await fetch(`${API_BASE_URL}/categories${buildQueryString(filters)}`);
  return res.json();
};

export const fetchRegions = async (filters) => {
  const res = await fetch(`${API_BASE_URL}/regions${buildQueryString(filters)}`);
  return res.json();
};

export const fetchSegments = async (filters, k = 4) => {
  const params = buildQueryString({ ...filters, k });
  const res = await fetch(`${API_BASE_URL}/segments${params}`);
  return res.json();
};

export const fetchInsights = async (filters) => {
  const res = await fetch(`${API_BASE_URL}/insights${buildQueryString(filters)}`);
  return res.json();
};

export const fetchMLModel = async (filters) => {
  const res = await fetch(`${API_BASE_URL}/ml/model${buildQueryString(filters)}`);
  return res.json();
};

export const predictMLPurchase = async (inputData, coefficients) => {
  const res = await fetch(`${API_BASE_URL}/ml/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ inputData, coefficients })
  });
  return res.json();
};

export const uploadDatasetFile = async (file) => {
  const formData = new FormData();
  formData.append('dataset', file);

  const res = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData
  });
  return res.json();
};
