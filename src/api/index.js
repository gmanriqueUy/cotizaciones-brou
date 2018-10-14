import express from 'express';

/*
Import other routes
*/
import currency from './currency';

const router = express.Router();

// Use the routes
router.use('/currency', currency);

export default router;
