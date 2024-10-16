// import bodyParser from 'body-parser';
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';

import examples from '../data/examples';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

const app: Express = express();
const port = process.env.PORT || 5000;
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server here');
});

app.get('/api/writer', async (req: Request, res: Response) => {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content:
          'Write an essay on the role of ai in content generation. This should be between 200 and 350 words. Be concise and split this into a few paragraphs.',
      },
    ],
  });
  res.json(completion);
});

app.post('/api/writer', async (req: Request, res: Response) => {
  try {
    const prompt = req.body.text;
    const tone = req.body.tone || 'default';
    const defaultMessages = [
      {
        role: 'system',
        content:
          'The rewritten articles must feel like my past writings. Here are some examples of my past writings:',
      },
      ...examples.map((example) => ({
        role: 'user',
        content: example.content,
      })),
    ] as Array<{ role: any; content: string }>;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        ...defaultMessages,
        {
          role: 'system',
          content: `You will be provided with some texts, and your task is to rewrite the following text in a ${tone} tone.
            If past examples are provided, you should rewrite the text in a similar tone.
            Your only goal is to rewrite the text in the chosen tone. You should not add any additional information or change the meaning of the text.
            Correct all grammar and spelling mistakes. Make sure that the text is clear and easy to read.
            DO NOT include the original text in your response.
            Do not include any additional information in your response.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });
    res.json(completion);
  } catch (error) {
    res.status(400).json({ error });
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
