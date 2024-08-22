// Importing necessary modules
import express from "express";
import mongoose from "mongoose";
import cors from 'cors';

// Importing custom configurations
import { PORT, mongoDBURL } from './config.js';

// Importing routes


//  import Employee_Route from './Routes/Employee_Route.js';
// import Applicant_Route from './Routes/Applicant_Route.js';
import Booking_Route from './Routes/Booking_Route.js';
// import EmployeeSalary_Route from './Routes/EmployeeSalary_Route.js';
//  import Feedback_Route from './Routes/Feedback_Route.js';
//  import Inquire_Route from './Routes/inquire_Route.js';
import Promotion_Route from './Routes/Promotion_Route.js';



//  import Repair_Route from './Routes/Repair_Route.js';

//  import ServiceHistory_Route from './Routes/ServiceHistory_Route.js';
//  import Store_Route from './Routes/Store_Route.js';

// import Vacancy_Route  from './Routes/Vacancy_Route.js';
// import Vehicle_Route from './Routes/Vehicle_Route.js';



 

 



// Creating an instance of the Express application
const app = express();

// Middleware for parsing request body
app.use(express.json());

// Middleware for handling CORS POLICY
app.use(cors());

// Using routes for endpoints

//  app.use('/Employee', Employee_Route);

//  app.use('/Applicant', Applicant_Route);

app.use('/Booking', Booking_Route);
//  app.use('/EmployeeSalary', EmployeeSalary_Route);
//  app.use('/Feedback', Feedback_Route);
//  app.use('/inquire', Inquire_Route);
app.use('/Promotion', Promotion_Route);

//  app.use('/Repair', Repair_Route);

//  app.use('/ServiceHistory', ServiceHistory_Route);
//  app.use('/Store', Store_Route);

//  app.use('/Vacancy', Vacancy_Route);
//  app.use('/Vehicle', Vehicle_Route);


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