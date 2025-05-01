const mongoose = require('mongoose');

const mongoURI = 'your_mongo_db_connection_string'; // Replace with your actual connection string

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;