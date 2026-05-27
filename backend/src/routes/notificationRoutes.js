import express from 'express';
import { getNotifications, markAsRead, markAllAsRead } from '../controllers/notificationController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.route('/').get(getNotifications);
router.route('/read-all').put(markAllAsRead);
router.route('/:id/read').put(markAsRead);

export default router;
