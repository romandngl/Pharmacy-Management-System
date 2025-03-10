const express = require('express');
const mongoose = require('mongoose');
cosnt cors = require('cors')
require('dotenv').config();

const authRoutes = require('./routes/auth');
const inventoryRoutes = require('./routes/inventoryRoutes');

const app = express();
app.use(express.json());
app.use(cors())

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Failed:', err));

app.use('/api/auth', authRoutes);
app.use('/api', inventoryRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
