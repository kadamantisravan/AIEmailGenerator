require('dotenv').config();
const { Groq } = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function test() {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Say hello from Groq AI' }],
      model: 'llama-3.3-70b-versatile',
    });

    console.log('Groq says:', chatCompletion.choices[0].message.content);
  } catch (err) {
    console.error('Groq API Error:', err);
  }
}

test();
