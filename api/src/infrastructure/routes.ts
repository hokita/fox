import { Router } from 'express';
import { HelloWorldController } from '../controllers/HelloWorldController';

const router = Router();
const helloWorldController = new HelloWorldController();

router.get('/hello', (req, res) => helloWorldController.getHelloWorld(req, res));

export default router;
