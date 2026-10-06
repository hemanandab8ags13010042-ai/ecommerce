const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let pool = null;
let useFallback = false;
let memoryDataset = null;

// Load local fallback data file
function getLocalFallbackData() {
  if (memoryDataset) return memoryDataset;

  const jsonPath = path.join(__dirname, '../../data/sample_data.json');
  if (fs.existsSync(jsonPath)) {
    const raw = fs.readFileSync(jsonPath, 'utf-8');
    memoryDataset = JSON.parse(raw);
    return memoryDataset;
  }
  return [];
}

function updateMemoryDataset(newData) {
  memoryDataset = newData;
}

// Initialize connection to MySQL with auto fallback
async function initDB() {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ecommerce_analytics',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 3000
    });

    // Test connection
    const conn = await pool.getConnection();
    console.log('Successfully connected to MySQL database: ecommerce_analytics');
    conn.release();
    useFallback = false;
  } catch (err) {
    console.warn('MySQL connection failed or server not running. Falling back to high-performance dataset engine.');
    useFallback = true;
    memoryDataset = getLocalFallbackData();
  }
}

async function getDataset(filters = {}) {
  if (useFallback) {
    let data = getLocalFallbackData();

    // Apply global filters dynamically
    if (filters.gender && filters.gender !== 'All') {
      data = data.filter(d => d.gender === filters.gender);
    }
    if (filters.category && filters.category !== 'All') {
      data = data.filter(d => d.product_category === filters.category);
    }
    if (filters.region && filters.region !== 'All') {
      data = data.filter(d => d.location.includes(filters.region));
    }
    if (filters.minAge) {
      data = data.filter(d => Number(d.age) >= Number(filters.minAge));
    }
    if (filters.maxAge) {
      data = data.filter(d => Number(d.age) <= Number(filters.maxAge));
    }
    if (filters.minAmount) {
      data = data.filter(d => Number(d.purchase_amount) >= Number(filters.minAmount));
    }
    if (filters.maxAmount) {
      data = data.filter(d => Number(d.purchase_amount) <= Number(filters.maxAmount));
    }
    if (filters.minIncome) {
      data = data.filter(d => Number(d.income) >= Number(filters.minIncome));
    }
    if (filters.maxIncome) {
      data = data.filter(d => Number(d.income) <= Number(filters.maxIncome));
    }

    return data;
  }

  // MySQL Query
  try {
    let query = `
      SELECT 
        c.customer_id, c.age, c.gender, c.location, c.income, c.registration_date,
        p.purchase_id, p.product_category, p.quantity, p.discount, p.purchase_amount,
        p.purchase_date, p.review_rating, p.purchase_frequency, p.previous_purchases
      FROM customers c
      JOIN purchases p ON c.customer_id = p.customer_id
      WHERE 1=1
    `;
    const params = [];

    if (filters.gender && filters.gender !== 'All') {
      query += ` AND c.gender = ?`;
      params.push(filters.gender);
    }
    if (filters.category && filters.category !== 'All') {
      query += ` AND p.product_category = ?`;
      params.push(filters.category);
    }
    if (filters.region && filters.region !== 'All') {
      query += ` AND c.location LIKE ?`;
      params.push(`%${filters.region}%`);
    }
    if (filters.minAge) {
      query += ` AND c.age >= ?`;
      params.push(filters.minAge);
    }
    if (filters.maxAge) {
      query += ` AND c.age <= ?`;
      params.push(filters.maxAge);
    }
    if (filters.minAmount) {
      query += ` AND p.purchase_amount >= ?`;
      params.push(filters.minAmount);
    }
    if (filters.maxAmount) {
      query += ` AND p.purchase_amount <= ?`;
      params.push(filters.maxAmount);
    }

    const [rows] = await pool.query(query, params);
    return rows;
  } catch (err) {
    console.error('MySQL query error, using local fallback:', err.message);
    return getLocalFallbackData();
  }
}

module.exports = {
  initDB,
  getDataset,
  updateMemoryDataset,
  isUsingFallback: () => useFallback
};
