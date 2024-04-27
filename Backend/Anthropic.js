import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export const sendMessageToAssistant = async (message) => {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      messages: [{ role: 'user', content: message }],
      max_tokens: 1024,
      temperature: 1,
      top_k: 1,
      top_p: 1
    });
    return response;
  } catch (error) {
    if (error.name === 'RateLimitError') {
      console.error('Rate limit exceeded:', error);
      throw new Error('Rate limit exceeded. Please try again later.');
    } else {
      console.error("Error sending message to assistant:", error);
      throw error;
    }
  }
};

export const createNewThread = async () => {
  try {
    const messages = [{ role: 'user', content: 'Hello' }]
    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      messages: messages,
      max_tokens: 1024,
      temperature: 1,
      top_k: 1,
      top_p: 1
    })
    return response;
  } catch (error) {
    if (error.name === 'RateLimitError') {
      console.error('Rate limit exceeded:', error);
      throw new Error('Rate limit exceeded. Please try again later.');
    } else {
      console.error("Error creating new thread:", error);
      throw error;
    }
  }
};