const express = require('express');
const cors = require('cors');
const customerRoutes = require('./routes/customerRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const accountRoutes = require('./routes/accountRoutes');
const branchRoutes = require('./routes/branchRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();

// app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));
app.use(express.json());

app.use('/customer', customerRoutes);
app.use('/employee', employeeRoutes);
app.use('/accounts', accountRoutes);
app.use('/branch', branchRoutes);
app.use('/transaction', transactionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});