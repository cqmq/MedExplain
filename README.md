# MedExplain AI

MedExplain AI is a Next.js MVP that helps users understand medical reports in simple language. It accepts pasted text, PDFs, and report photos, sends the content to OpenAI with Structured Outputs, stores each result locally in SQLite, and renders a patient-friendly report summary with history, delete, copy, and print-to-PDF actions.

## Safety Positioning

This product explains report content for understanding only. It is not a diagnosis, does not replace a doctor, and does not recommend treatments or medication changes. The analyze flow requires explicit consent before submitting a report.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS 4 with shadcn-style Radix primitives
- Prisma + SQLite
- OpenAI Responses API via `openai`
- Lucide icons
- Browser print for PDF export

## Setup

```bash
npm install

cp .env.example .env
# Edit .env and set OPENAI_API_KEY.

npx prisma migrate dev --name init

npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

```env
OPENAI_API_KEY=sk-xxxxxxxx
DATABASE_URL="file:./dev.db"
MODEL=gpt-4o
```

`MODEL` is optional. The app defaults to `gpt-4o`, which supports vision/file inputs and structured JSON output.

## Useful Commands

```bash
npm run dev
npm run lint
npm run test
npm run build
npm start
```

## Core Flows

- Landing page: `/`
- Analyze: `/analyze`
- Demo report: `/analyze?demo=1`
- History: `/history`
- Report detail: `/reports/[id]`

## Privacy Note

Designed with privacy-first principles. This MVP stores reports locally in SQLite for demo purposes. A production deployment would add authentication, encryption at rest/in transit, access controls, audit logging, and applicable healthcare-compliance measures. No third-party analytics are included.

## Deployment Note

The app builds cleanly for Vercel, but SQLite is ephemeral on serverless infrastructure. For a hosted production demo, swap the Prisma datasource to a hosted Postgres provider such as Supabase or Neon and run `prisma migrate deploy`.
