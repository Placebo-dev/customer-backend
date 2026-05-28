const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Render assigns a dynamic port via environment variables. If it doesn't exist, it falls back to 3000.
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); 

// Connect to MongoDB Atlas (Cloud Database)
// REPLACE the string below with your actual connection string from your MongoDB Atlas dashboard
const ATLAS_URI = "mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxx.mongodb.net/customerDB?retryWrites=true&w=majority";

mongoose.connect(ATLAS_URI)
  .then(() => console.log('Connected to Cloud MongoDB Atlas successfully!'))
  .catch(err => console.error('Cloud database connection error:', err));

// Customer Data Schema
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Customer = mongoose.model('Customer', customerSchema);

// REST API Routes
app.post('/api/customers', async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const newCustomer = new Customer({ name, phone, address });
    await newCustomer.save(); 
    res.status(201).json({ message: 'Customer saved to cloud successfully!', customer: newCustomer });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save customer data to cloud.' });
  }
});

app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend REST API server running securely.`);
});