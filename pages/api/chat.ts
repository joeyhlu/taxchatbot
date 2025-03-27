// pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const knowledgeBase: Record<string, string> = {
  'tax brackets': `
Tax brackets in the U.S. are ranges of income taxed at different rates.
For 2023, some examples:
- 10% bracket up to ~$11,000 (single)
- 12% bracket up to ~$44,725 (single)
- 22%, 24%, etc. for higher incomes.
`,
  'w-2': `
A W-2 form reports annual wages and taxes withheld from your paycheck.
Employers must send W-2 forms by Jan 31 each year.
`,
  'standard deduction': `
The standard deduction is a flat amount subtracted from your income before tax.
For 2023, it's $13,850 (single) and $27,700 (married filing jointly).
`,
  'filing statuses': `
The main filing statuses are:
- Single
- Married Filing Jointly
- Married Filing Separately
- Head of Household
- Qualifying Widow(er)
`,
};

function findAnswer(query: string): string {
  const lower = query.toLowerCase();

  if (lower.includes('hello') || lower.includes('hey')) {
    return 'Hello! How can I help you today?';
  }

  if (lower.includes('show me a table')) {
    return "Here’s an example table [TABLE_DEMO]";
  }

  for (const key of Object.keys(knowledgeBase)) {
    if (lower.includes(key)) {
      return knowledgeBase[key];
    }
  }

  return `I can help you with taxes. How can I help you today?`;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  const { messages } = req.body as { messages?: { content: string }[] };
  const lastUserMessage = messages?.[messages.length - 1]?.content || 'Hello!';
  const answer = findAnswer(lastUserMessage);
  const responseText = `CortaxAI says:\n\n${answer}`;

  res.write(`${responseText}\n\n`);
  res.write(`[DONE]\n\n`);
  res.end();
}
