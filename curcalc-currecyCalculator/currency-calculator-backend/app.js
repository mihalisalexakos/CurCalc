require('dotenv').config(); //imports env secret key
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const convertRoutes = require('./routes/convert');
const rateRoutes = require('./routes/rates');

const app = express();
app.use(cors());
app.use(express.json());

// for logging in
app.use('/api/auth', authRoutes);
// for converting currency
app.use('/api/convert', convertRoutes);
// for editing database - CRUD operations
app.use('/api/rates', rateRoutes);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server is up and running on port: ${PORT}`));
