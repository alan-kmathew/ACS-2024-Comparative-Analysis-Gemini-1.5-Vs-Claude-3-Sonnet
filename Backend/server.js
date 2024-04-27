import express from 'express';
import cors from 'cors';
import { sendMessageToAssistant, createNewThread } from './Anthropic.js';


const app = express();
app.use(cors());
app.use(express.json());

app.post('/sendMessage', async (req, res) => {
  const { message } = req.body;
  console.log('Message:', message); // log the message
  const response = await sendMessageToAssistant(message);
  console.log('Response:', response); // log the response
  res.json(response);
});

app.post('/createThread', async (req, res) => {
  const response = await createNewThread();
  console.log('Response:', response); // log the response
  res.json(response);
});

app.listen(5008, () => {
  console.log('Server is running on port 5000');
});