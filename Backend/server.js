import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { sendMessageToAssistant as sendAnthrowMessage, createNewThread as createAnthrowThread } from './Anthropic.js';
import { sendMessageToAssistant as sendGeminiMessage } from './Gemini.js';


const upload = multer();
const app = express();
app.use(cors());
app.use(express.json());

app.post('/anthropic/sendMessage', async (req, res) => {
  const { message } = req.body;
  console.log('Message:', message); // log the message
  const response = await sendAnthrowMessage(message);
  console.log('Response:', response); // log the response
  res.json(response);
});

app.post('/anthropic/createThread', async (req, res) => {
  const response = await createAnthrowThread();
  console.log('Response:', response); // log the response
  res.json(response);
});

app.post('/gemini/sendMessage', upload.fields([{ name: 'message', maxCount: 1 }, { name: 'file', maxCount: 1 }]), async (req, res) => {
  const message = req.body.message;
  const file = req.files.file ? req.files.file[0] : null;
  console.log('Message:', message); // log the message
  console.log('File:', file); // log the file
  const response = await sendGeminiMessage(message, file);
  console.log('Response:', response); // log the response
  res.json(response);
});


app.listen(5008, () => {
  console.log('Server is running on port 5000');
});