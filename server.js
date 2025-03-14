const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

//Route files
const dentists = require('./routes/dentists');

//Load env vars
dotenv.config({ path: './config/config.env' });

//Connect to database
connectDB();

const app = express();

//Mount routers
app.use('/api/v1/dentists', dentists);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    //Close server & exit process
    server.close(() => process.exit(1));
});