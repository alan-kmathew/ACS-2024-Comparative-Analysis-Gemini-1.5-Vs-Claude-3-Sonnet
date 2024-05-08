import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { sendMessageToAssistant as sendAnthrowMessage } from './Anthropic.js';
import { sendMessageToAssistant as sendGeminiMessage } from './Gemini.js';


const upload = multer();
const app = express();
app.use(cors());
app.use(express.json());

app.post('/anthropic/sendMessage', upload.fields([{ name: 'message', maxCount: 1 }, { name: 'file', maxCount: 1 }]), async (req, res) => {
  const message = req.body.message;
  const file = req.files.file ? req.files.file[0] : null;
  console.log('Message:', message); // log the message
  console.log('File:', file); // log the file
  const response = await sendAnthrowMessage(message, file); // modify sendAnthrowMessage to handle file
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


app.listen(8080, () => {
  console.log('Server is running on port 8080');
});