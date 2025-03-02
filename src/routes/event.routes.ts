import { Router } from 'express';
import {createEvent, getEvents, getEvent, updateEvent, deleteEvent} from '../controllers/event.controller';

const router = Router();

router.post('/events', createEvent);
router.get('/events', getEvents);
router.get('/events/:id', getEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

export default router;