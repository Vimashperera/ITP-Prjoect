
// Importing necessary modules
import express from "express";
import mongoose from "mongoose";
import cors from 'cors';

// Importing custom configurations
import { PORT, mongoDBURL } from './config.js';

// Importing routes

// import UserAccount_Route from './Routes/UserAccount_Route.js';
// import Employee_Route from './Routes/Employee_Route.js';


// Creating an instance of the Express application
const app = express();

// Middleware for parsing request body
app.use(express.json());

// Middleware for handling CORS POLICY
app.use(cors());

// Using routes for endpoints

// app.use('/customer', UserAccount_Route);


// Connecting to the MongoDB database
mongoose.connect(mongoDBURL)
  .then(() => {
    console.log('App connected to database');
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });