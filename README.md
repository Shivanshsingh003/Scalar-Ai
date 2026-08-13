# FormFlow — Typeform Clone

A monorepo for a Typeform-style form builder with a conversational one-question-at-a-time UX.

## Stack

| Layer    | Technology                                      |
| -------- | ----------------------------------------------- |
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Sonner |
| Backend  | FastAPI, SQLAlchemy, SQLite                     |

## Getting Started

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Delete `backend/data/app.db` to reset the database and load demo seed data on startup.

### Frontend

```bash
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

- Dashboard: http://localhost:3000/dashboard
- Demo form: http://localhost:3000/f/customer-feedback-demo
- API docs: http://localhost:8000/docs

## Features

- **Creator dashboard** — list, create, duplicate, publish/unpublish, delete forms
- **Form builder** — inline question editor, @dnd-kit reorder, auto-save
- **Respondent flow** — one question at a time, keyboard nav (↑↓ Enter ←→), animated progress bar
- **Analytics** — choice-question breakdowns with bar charts (`/dashboard/forms/{id}/results`)
- **CSV export** — download all responses
- **Demo data** — seeded "Customer Feedback Survey" with 5 sample responses

## API Endpoints

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/api/v1/forms` | List forms with response counts |
| POST | `/api/v1/forms/{id}/duplicate` | Duplicate form |
| PATCH | `/api/v1/forms/{id}` | Update form (`is_published: true/false`) |
| GET | `/api/v1/forms/{id}/responses/{response_id}` | Single response detail |
| GET | `/api/v1/forms/{id}/analytics` | Response analytics |
| GET | `/api/v1/forms/{id}/responses/export` | CSV export |
| GET | `/api/v1/public/forms/{slug}` | Published form |
| POST | `/api/v1/public/forms/{slug}/responses` | Submit response |

## Production

### Frontend

```bash
cd frontend
copy .env.example .env.local   # set NEXT_PUBLIC_API_URL to your API
npm run build                  # runs typecheck via prebuild
npm run start
```

Set `NEXT_PUBLIC_API_URL` to your deployed FastAPI base (including `/api/v1`).

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

For production, run behind a reverse proxy (nginx/Caddy) with HTTPS and configure CORS if the frontend is on a different origin.
