const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const cors = require('cors'); // Import cors
const dashboardRoutes = require('./routes/dashboard'); // Import dashboard routes
const clientRoutes = require('./routes/clients'); // Correct path to the routes/clients.js file



const app = express();

app.use(cors());

app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes); // Use dashboard routes

app.use('/api/clients', clientRoutes); 

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
