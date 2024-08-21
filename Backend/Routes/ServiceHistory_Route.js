import express from 'express';
import mongoose from 'mongoose';
import { Vehicle } from '../Model/Vehicle.js';
import { serviceHistory } from '../Model/ServiceHistory.js';

const router = express.Router();

// Route to save a new reservation
router.post('/', async (request, response) => {
    try {
        // Create a new service history entry
        const newServiceHistory = new serviceHistory({
            cusID: request.body.cusID,
            Customer_Name: request.body.Customer_Name,
            Customer_Email: request.body.Customer_Email,
            Allocated_Employee: request.body.Allocated_Employee,
            Vehicle_Number: request.body.Vehicle_Number,
            Milage: request.body.Milage,
            Package: request.body.Package,
            Booking_Id: request.body.Booking_Id,
            nextService: request.body.nextService,
            Service_History: request.body.Service_History,
            Service_Date: request.body.Service_Date,
            selectedServices: Array.isArray(request.body.selectedServices) ? request.body.selectedServices : [request.body.selectedServices]
        });

        // Save the new service history entry
        const result = await newServiceHistory.save();
        return response.status(201).send(result);
    } catch (error) {
        console.error(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to read all service histories
router.get('/', async (request, response) => {
    try {
        const serviceHistories = await serviceHistory.find({});
        response.status(200).json({
            count: serviceHistories.length,
            service: serviceHistories,
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to get a service history by ID, vehicle number, Booking_Id, or cusID
router.get('/:identifier', async (request, response) => {
    try {
        const { identifier } = request.params;

        // Search by MongoDB ObjectId, vehicle number, Booking_Id, or cusID
        let serviceHistoryResult = mongoose.Types.ObjectId.isValid(identifier)
            ? await serviceHistory.findById(identifier)
            : await serviceHistory.find({
                  $or: [
                      { Vehicle_Number: identifier },
                      { Booking_Id: identifier },
                      { cusID: identifier }
                  ]
              });

        // Return the service history if found, otherwise return 404
        return serviceHistoryResult && serviceHistoryResult.length > 0
            ? response.status(200).json(serviceHistoryResult)
            : response.status(404).json({ message: 'Service history not found' });
    } catch (error) {
        console.error(error);
        response.status(500).send({ message: 'Error fetching service history: ' + error.message });
    }
});

// Route to update a service history by ID
router.put('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const updatedServiceHistory = await serviceHistory.findByIdAndUpdate(id, request.body);
        if (!updatedServiceHistory) {
            return response.status(404).send({ message: 'Service history not found' });
        }
        return response.status(200).send({ message: 'Service history updated' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to delete a service history by ID
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const result = await serviceHistory.findByIdAndDelete(id);
        return response.status(200).send({ message: 'Service history deleted' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to search service histories
router.get('/searchservices', async (request, response) => {
    try {
        const search = request.query.search;
        const serviceHistories = await serviceHistory.find({
            $or: [
                { Customer_Name: { $regex: search, $options: 'i' } },
                { Customer_Email: { $regex: search, $options: 'i' } },
                { Allocated_Employee: { $regex: search, $options: 'i' } },
                { Vehicle_Number: { $regex: search, $options: 'i' } },
                { Milage: { $regex: search, $options: 'i' } },
                { Package: { $regex: search, $options: 'i' } },
                { Booking_Id: { $regex: search, $options: 'i' } },
                { nextService: { $regex: search, $options: 'i' } },
                { selectedServices: { $regex: search, $options: 'i' } },
                { Service_History: { $regex: search, $options: 'i' } },
                { Service_Date: { $regex: search, $options: 'i' } }
            ]
        });
        response.status(200).json(serviceHistories);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

export default router;
