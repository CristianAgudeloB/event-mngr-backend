import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { deleteUser, getUser, getUsers, updateUser } from '../controllers/user.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;