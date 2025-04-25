const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
require('dotenv').config();
require('./models/User'); 
require('./models/Patient');
require('./models/Pharmacist'); 
require('./models/Medicine');
require('./models/Notification');

const authRoutes = require('./routes/auth');
const inventoryRoutes = require('./routes/inventoryRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const salesRoutes = require('./routes/salesRoutes');
const appointmentsRoutes = require('./routes/appointmentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');

const app = express();
app.use(express.json());
app.use(cors())

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Failed:', err));

app.use('/api/auth', authRoutes);
app.use('/api', inventoryRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/newsletter', newsletterRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
