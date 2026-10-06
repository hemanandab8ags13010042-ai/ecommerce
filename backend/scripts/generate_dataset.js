const fs = require('fs');
const path = require('path');

const categories = ['Electronics', 'Clothing', 'Beauty', 'Grocery', 'Home & Kitchen', 'Sports', 'Books'];
const genders = ['Male', 'Female', 'Other'];
const locations = [
  'New York, USA', 'California, USA', 'Texas, USA', 'Florida, USA', 'London, UK',
  'Toronto, Canada', 'Sydney, Australia', 'Berlin, Germany', 'Tokyo, Japan', 'Paris, France'
];

const records = [];
const customerRecords = [];
const purchaseRecords = [];

const numCustomers = 500;

for (let i = 1; i <= numCustomers; i++) {
  const age = Math.floor(Math.random() * (68 - 18 + 1)) + 18;
  const gender = genders[Math.floor(Math.random() * genders.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];
  
  // Base income correlated slightly with age
  const baseIncome = 30000 + (age - 18) * 1200 + (Math.random() * 35000);
  const income = Math.round(baseIncome);
  
  const regYear = 2021 + Math.floor(Math.random() * 4);
  const regMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const regDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  const registration_date = `${regYear}-${regMonth}-${regDay}`;

  customerRecords.push({
    customer_id: i,
    age,
    gender,
    location,
    income,
    registration_date
  });

  // Each customer makes 1-3 purchases
  const numPurchases = Math.floor(Math.random() * 2) + 1;

  for (let p = 0; p < numPurchases; p++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const quantity = Math.floor(Math.random() * 8) + 1;
    const discount = Math.round((Math.random() * 30) * 10) / 10; // 0% to 30%
    const previous_purchases = Math.floor(Math.random() * 25) + 1;
    const purchase_frequency = Math.floor(previous_purchases / 2) + 1;
    
    // Rating 2.5 to 5.0
    const review_rating = Math.round((2.5 + Math.random() * 2.5) * 10) / 10;

    // Price per item based on category
    let basePricePerItem = 25;
    if (category === 'Electronics') basePricePerItem = 180 + Math.random() * 350;
    else if (category === 'Home & Kitchen') basePricePerItem = 70 + Math.random() * 120;
    else if (category === 'Sports') basePricePerItem = 45 + Math.random() * 90;
    else if (category === 'Clothing') basePricePerItem = 35 + Math.random() * 65;
    else if (category === 'Beauty') basePricePerItem = 25 + Math.random() * 50;
    else if (category === 'Grocery') basePricePerItem = 15 + Math.random() * 40;
    else if (category === 'Books') basePricePerItem = 12 + Math.random() * 30;

    // Calculate Purchase Amount with clear statistical correlation to Quantity, Income, and Discount
    const incomeFactor = income / 100000; // 0.3 to 1.2
    const subtotal = quantity * basePricePerItem * (1 + incomeFactor * 0.2);
    const discountFactor = 1 - (discount / 100);
    const rawPurchaseAmount = subtotal * discountFactor;
    const purchase_amount = Math.round(rawPurchaseAmount * 100) / 100;

    const pYear = 2024;
    const pMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const pDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    const purchase_date = `${pYear}-${pMonth}-${pDay}`;

    const purchase_id = purchaseRecords.length + 1;

    purchaseRecords.push({
      purchase_id,
      customer_id: i,
      product_category: category,
      quantity,
      discount,
      purchase_amount,
      purchase_date,
      review_rating,
      purchase_frequency,
      previous_purchases
    });

    records.push({
      customer_id: i,
      age,
      gender,
      location,
      income,
      registration_date,
      purchase_id,
      product_category: category,
      quantity,
      discount,
      purchase_amount,
      purchase_date,
      review_rating,
      purchase_frequency,
      previous_purchases
    });
  }
}

// Write dataset CSV
const csvHeaders = 'customer_id,age,gender,location,income,product_category,quantity,discount,previous_purchases,review_rating,purchase_frequency,purchase_amount,purchase_date\n';
const csvRows = records.map(r => 
  `${r.customer_id},${r.age},"${r.gender}","${r.location}",${r.income},"${r.product_category}",${r.quantity},${r.discount},${r.previous_purchases},${r.review_rating},${r.purchase_frequency},${r.purchase_amount},${r.purchase_date}`
).join('\n');

const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(path.join(dataDir, 'ecommerce_dataset.csv'), csvHeaders + csvRows);
fs.writeFileSync(path.join(dataDir, 'sample_data.json'), JSON.stringify(records, null, 2));

// Generate seed.sql
let seedSql = `-- Seed data for ecommerce_analytics database\nUSE ecommerce_analytics;\n\n`;
seedSql += `INSERT INTO customers (customer_id, age, gender, location, income, registration_date) VALUES\n`;
seedSql += customerRecords.map(c => 
  `(${c.customer_id}, ${c.age}, '${c.gender}', '${c.location.replace("'", "''")}', ${c.income}, '${c.registration_date}')`
).join(',\n') + ';\n\n';

seedSql += `INSERT INTO purchases (purchase_id, customer_id, product_category, quantity, discount, purchase_amount, purchase_date, review_rating, purchase_frequency, previous_purchases) VALUES\n`;
seedSql += purchaseRecords.map(p => 
  `(${p.purchase_id}, ${p.customer_id}, '${p.product_category}', ${p.quantity}, ${p.discount}, ${p.purchase_amount}, '${p.purchase_date}', ${p.review_rating}, ${p.purchase_frequency}, ${p.previous_purchases})`
).join(',\n') + ';\n';

const dbDir = path.join(__dirname, '../../database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
fs.writeFileSync(path.join(dbDir, 'seed.sql'), seedSql);

console.log(`Generated ${records.length} purchase records for ${customerRecords.length} customers.`);
