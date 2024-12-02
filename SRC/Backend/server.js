const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const cors = require('cors'); // Import cors
const dashboardRoutes = require('./routes/dashboard'); // Import dashboard routes
const driverRoutes = require('./routes/drivers');

const clientRoutes = require('./routes/clients'); // Correct path to the routes/clients.js file
const trucksRoutes = require('./routes/trucks'); 
const documentRoutes = require('./routes/documents');


const app = express();

app.use(cors());

app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes); // Use dashboard routes
app.use('/api', driverRoutes); // Use the drivers route
app.use('/documents', documentRoutes);
app.use('/trucks', trucksRoutes);

app.use('/api/clients', clientRoutes); 

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
