import Anthropic from '@anthropic-ai/sdk'
import dotenv from 'dotenv';
dotenv.config();
// Create Anthropic API client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

// Request the Anthropic API for the response
async function start() {
  const messages = [{ role: 'user', content: 'Hello' }]

  const response = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    messages: messages,
    max_tokens: 1024,
    temperature: 1,
    top_k: 1,
    top_p: 1
  })

  console.log(response.content);
}

start()