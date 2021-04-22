import { Router } from 'express';
import SearchRouter from './Search';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/search', SearchRouter);

// Export the base-router
export default router;
