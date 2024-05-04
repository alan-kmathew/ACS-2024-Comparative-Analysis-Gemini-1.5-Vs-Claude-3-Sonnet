import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory} from '@google/generative-ai';
import dotenv from 'dotenv';
import * as fs from 'fs';
dotenv.config();

const MODEL_NAME = 'gemini-1.5-pro-latest';
const API_KEY = process.env.GOOGLE_API_KEY || '';

const genAI = new GoogleGenerativeAI(API_KEY);

function fileToGenerativePart(buffer, mimeType) {
  return {
      inlineData: {
          data: Buffer.from(buffer).toString("base64"),
          mimeType,
      },
  };
}

export async function sendMessageToAssistant(message, file) {
  console.log('Message:', message); // log the message
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 1,
    topK: 0,
    topP: 0.95,
    maxOutputTokens: 8192,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
  });

  let result;
  if (file) {
    const imagePart = fileToGenerativePart(file.buffer, file.mimetype);
    result = await chat.sendMessage([message, imagePart]);
  } else {
    result = await chat.sendMessage(message);
  }

  const response = result.response;
  return response.text();
}
