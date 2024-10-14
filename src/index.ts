// import bodyParser from 'body-parser';
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';

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
  const prompt = `Rewrite the following text in a more formal tone: 
  ${req.body.text}`;

  console.log(prompt);

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });
  res.json(completion);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
