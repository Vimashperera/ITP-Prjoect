import express from 'express';
import { Store } from '../Model/store.js';

const router = express.Router();

// Middleware for fetching a store by ID
async function getStore(req, res, next) {
  let store;
  try {
    store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.store = store;
  next();
}

// Create a new store
router.post('/', async (req, res) => {
  const store = new Store(req.body);

  try {
    await store.save();
    res.status(201).json(store);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all stores
router.get('/', async (req, res) => {
  try {
    const stores = await Store.find();
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single store by ID
router.get('/:id', getStore, (req, res) => {
  res.json(res.store);
});

// Route for updating a Vacancy item by ID
router.put('/:id', async (request, response) => {
  try {
      const { id } = request.params;

      const store = await Store.findById(id);

      if (!store) {
          return response.status(404).json({ message: 'store not found' });
      }

      store.Name = request.body.Name || store.Name;
      store.Quantity = request.body.Quantity || store.Quantity;
      store.Price = request.body.Price || store.Price;
      
      await store.save();

      return response.status(200).json({ message: 'store updated successfully', data: store });
  } catch (error) {
      console.error(error.message);
      response.status(500).json({ message: error.message });
  }
});
// Delete a store   
router.delete('/:id', getStore, async (req, res) => {
  try {
    await res.store.deleteOne(); // Use deleteOne() method
    res.json({ message: 'Store deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Exporting the Express router
export default router;