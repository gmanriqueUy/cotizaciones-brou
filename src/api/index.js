import express from 'express';

/*
Import other routes
*/
import currency from './currency';
// import currencyDay from './currencyDay';

const router = express.Router();

// Use the routes
router.use('/currency', currency);
// router.use('/day', currencyDay);

export default router;
