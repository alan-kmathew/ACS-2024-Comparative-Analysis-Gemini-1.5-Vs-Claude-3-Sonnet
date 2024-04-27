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
  try {
    const response = await createNewThread();
    console.log('Response:', response); // log the response
    res.json(response);
  } catch (error) {
    if (error.name === 'RateLimitError') {
      console.error('Rate limit exceeded:', error);
      res.status(429).json({
        error: 'Rate limit exceeded. Please try again later.'
      });
    } else {
      console.error('Error in creating new thread:', error);
      res.status(500).json({
        error: 'An error occurred while creating a new thread.'
      });
    }
  }
});

app.listen(5008, () => {
  console.log('Server is running on port 5000');
});