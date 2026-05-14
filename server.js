require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const mediaRoutes = require('./routes/mediaRoutes');

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Nexus MongoDB Connected'))
    .catch((err) => console.log('Connection Failed:', err));


app.get('/', (req, res) => {
    res.send('Nexus API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});