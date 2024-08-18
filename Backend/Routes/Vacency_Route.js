// Importing the Express library
import express from 'express';
// Import the Vacancy model only once
import { Vacancy } from '../Model/Vacancy.js';

// Creating an Express router
const router = express.Router();

// Route for creating a new Vacancy
router.post('/', async (request, response) => {
    try {
        const { Name, Description } = request.body;

        if (!Name || !Description) {
            return response.status(400).json({ message: 'Please provide all required fields.' });
        }

        const newVacancy = { Name, Description };
        const vacancy = await Vacancy.create(newVacancy);

        return response.status(201).json(vacancy);
    } catch (error) {
        console.error(error.message);
        response.status(500).json({ message: error.message });
    }
});

// Route for retrieving all Vacancy items from the database
router.get('/', async (request, response) => {
    try {
        const vacancy = await Vacancy.find({});

        response.status(200).json({
            count: vacancy.length,
            data: vacancy,
        });
    } catch (error) {
        console.error(error.message);
        response.status(500).json({ message: error.message });
    }
});

// Route for retrieving a specific Vacancy item by ID
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        const vacancy = await Vacancy.findById(id);

        if (!vacancy) {
            return response.status(404).json({ message: 'Vacancy not found' });
        }

        response.status(200).json(vacancy);
    } catch (error) {
        console.error(error.message);
        response.status(500).json({ message: error.message });
    }
});

// Route for updating a Vacancy item by ID
router.put('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        const vacancy = await Vacancy.findById(id);

        if (!vacancy) {
            return response.status(404).json({ message: 'Vacancy not found' });
        }

        vacancy.Name = request.body.Name || vacancy.Name;
        vacancy.Description = request.body.Description || vacancy.Description;

        await vacancy.save();

        return response.status(200).json({ message: 'Vacancy updated successfully', data: vacancy });
    } catch (error) {
        console.error(error.message);
        response.status(500).json({ message: error.message });
    }
});

// Route for deleting a Vacancy item by ID
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        await Vacancy.findByIdAndDelete(id);

        return response.status(200).json({ message: 'Vacancy deleted successfully' });
    } catch (error) {
        console.error(error.message);
        response.status(500).json({ message: error.message });
    }
});

// Exporting the Express router
export default router;