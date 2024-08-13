//Route for save a new reservation

import  express from 'express';
import mongoose from 'mongoose';


import {createbooking} from '../Models/Booking.js';
import { addLimit } from '../Models/BookingLimit.js';

const router = express.Router();

router.post('/',async (request, response) => {
   try{
      if(
    !request.body.Customer_Name ||
    !request.body.Vehicle_Type || 
    !request.body.Vehicle_Number||
    !request.body.Contact_Number ||
    !request.body.Email
      ){
    return response.status(400).send({
      message: 'Send all required field'
    });
      }
      // Extract the booking date from the request
      const bookingDate = new Date(request.body.Booking_Date);
      // Query to find the booking limit for the selected date
      const bookingLimit = await addLimit.findOne({ Booking_Date: bookingDate });
      // Get the maximum bookings per day from the booking limit data
      const maxBookingsPerDay = bookingLimit ? bookingLimit.Booking_Limit : 0;// Default limit is 0 if booking limit is not available
      // Query to count bookings made on the selected date
      const bookingsCount = await createbooking.countDocuments({ Booking_Date: bookingDate });
      // Check if the booking limit for the selected date is exceeded
      if (bookingsCount >= maxBookingsPerDay) {
        console.error("Booking limit exceeded");
        return response.status(400).send({
            message: 'Booking limit exceeded for the selected date'
        });
    }

    const newVehicle = {
    cusID:request.body.cusID,
    Booking_Date: request.body.Booking_Date,
    Customer_Name: request.body.Customer_Name,
    Vehicle_Type: request.body.Vehicle_Type,
    Vehicle_Number: request.body.Vehicle_Number,
    Contact_Number: request.body.Contact_Number,
    Email: request.body.Email,
    selectedPackage: request.body.selectedPackage,
    selectedServices: request.body.selectedServices
    };
  
    const vehicle = await createbooking.create(newVehicle);

     // Send booking confirmation email
     sendBookingConfirmationEmail(request.body.Email, request.body);

    return response.status(201).send(vehicle);
    
      
    }catch(error){
    
    console.log(error.message);
    response.status(500).send({message: error.message});
    
    }
    
    });

    //get all booking details
    router.get('/',async (request, response) => {
      try {
        const bookings = await createbooking.find({});

        return response.status(200).json(bookings);
      }catch(error){

     console.log(error.message);
     response.status(500).send({message: error.message});

      }

    });

   
router.get('/:identifier', async (request, response) => {
  try {
      // Extracting the identifier from the request parameters
      const { identifier } = request.params;

      // Checking if the provided identifier is a valid MongoDB ObjectId
      if (mongoose.Types.ObjectId.isValid(identifier)) {
          // Fetching a vehicle from the database based on the ID
          const BookingByID = await createbooking.findById(identifier);
          if (BookingByID) {
              // Sending the fetched vehicle as a JSON response if found by ID
              return response.status(200).json(BookingByID);
          }
      }

      // If the provided identifier is not a valid ObjectId, try searching by register number
      const BookingByCUSID = await createbooking.find({ cusID: identifier });
      if (BookingByCUSID) {
          // Sending the fetched vehicle as a JSON response if found by register number
          return response.status(200).json(BookingByCUSID);
      }

      // If no vehicle found by either ID or register number, send a 404 Not Found response
      return response.status(404).json({ message: 'booking not found' });
  } catch (error) {
      // Handling errors and sending an error response with detailed error message
      console.error(error);
      response.status(500).send({ message: 'Error fetching booking: ' + error.message });
  }
});


    //Route for update booking
    router.put('/:id',async (request, response) => {
      try{
      if(
     !request.body.Customer_Name ||
     !request.body.Vehicle_Type || 
     !request.body.Vehicle_Number||
     !request.body.Contact_Number ||
     !request.body.Email
      ){
    return response.status(400).send({
      message: 'Send all required field'
    });
      }
    
      const {id} = request.params;

      const result = await createbooking.findByIdAndUpdate(id, request.body); 
     if (!result){
      return response.status(404).json({ message: 'book not found'});
     }
     return response.status(200).send({ message: 'book updated successfully' });
      }catch(error){
        console.log(error.message);
        response.status(500).send({ message: error.message });
      }
    });
    
    //Route for delete booking

    router.delete('/:id',async (request, response) => {
      try{
      const {id} = request.params;
      const result = await createbooking.findByIdAndDelete(id);
      if (!result){
      return response.status(404).json({ message: 'book not found'});
      }
     return response.status(200).send({ message: 'book deleted successfully' });
    }catch(error){
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  });




    export default router;


    