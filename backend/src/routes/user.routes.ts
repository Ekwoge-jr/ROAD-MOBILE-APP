import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAdmins,
  getCurrentUser,
  updateCurrentUser,
} from '../controllers/user.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/').get(protect, admin, getAllUsers);
router.route('/admins').get(protect, admin, getAdmins);
router.route('/me').get(protect, getCurrentUser).put(protect, updateCurrentUser);
router
  .route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

export default router; 