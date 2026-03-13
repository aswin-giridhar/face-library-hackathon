# Face Library MVP

**Secure AI Likeness Licensing Platform**

Face Library is a licensing platform for human identity in generative AI. Creators upload their face/likeness, clients submit requests to use it, and an AI-powered contract agent generates UK-law-compliant licensing agreements.

## MVP Features

- **Talent uploads face/likeness** -- Photo upload with profile creation
- **Clients submit licensing requests** -- Three license types: Standard, Exclusive, Time-Limited
- **Manual review workflow** -- Admin reviews requests before talent approval
- **AI Contract Agent** -- One agent for IP contract generation, validation, and improvement
- **Watermark tracking** -- Placeholder for integration with watermark tracing technology partner
- **Stripe payments** -- Secure payment processing (90% to talent, 10% platform fee)
- **Full audit trail** -- Every action logged

## Architecture

```
                    +------------------+
                    |   Next.js App    |
                    |   (12 Pages)     |
                    +--------+---------+
                             |
                        REST API
                             |
                    +--------+---------+
                    |   FastAPI MVP    |
                    |  (25 Endpoints)  |
                    +--------+---------+
                             |
              +--------------+--------------+
              |              |              |
        +-----+----+  +-----+----+  +------+------+
        |IP Contract|  |Watermark |  |   Stripe    |
        |Agent      |  |Tracking  |  |   Payments  |
        |Generate   |  |Detect    |  |   Checkout  |
        |Validate   |  |Report    |  |   Webhooks  |
        |Improve    |  |Monitor   |  +-------------+
        +-----------+  +----------+
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS |
| Backend | Python, FastAPI, SQLAlchemy, SQLite |
| LLM | OpenAI-compatible API (configurable provider) |
| Auth | Supabase Auth |
| Payments | Stripe |
| Deployment | Vercel (frontend) + Render (backend) |

## Getting Started

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `LLM_API_KEY` | LLM provider API key | Yes |
| `LLM_BASE_URL` | LLM API endpoint | Yes |
| `LLM_MODEL` | Model name | Yes |
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `DATABASE_URL` | Database URL (SQLite or PostgreSQL) | Yes |

## API Endpoints

### Auth
- `POST /api/auth/signup` -- Create account (talent/client/agent)
- `POST /api/auth/login` -- Sign in
- `GET /api/auth/me/{id}` -- Get user

### Talent
- `POST /api/talent/register` -- Register talent profile
- `POST /api/talent/{id}/upload-image` -- Upload face photo
- `GET /api/talent/{id}` -- Get profile
- `PUT /api/talent/{id}/preferences` -- Update preferences
- `GET /api/talents` -- List all talents

### Client
- `POST /api/client/register` -- Register client
- `GET /api/client/{id}` -- Get profile

### Licensing
- `POST /api/licensing/request` -- Create license request
- `POST /api/licensing/{id}/generate-contract` -- Generate AI contract
- `POST /api/licensing/{id}/validate-contract` -- Validate contract
- `POST /api/licensing/{id}/improve-contract` -- Improve with feedback
- `POST /api/licensing/{id}/review` -- Manual admin review
- `POST /api/licensing/{id}/approve` -- Talent approve/reject

### Watermark Tracking
- `POST /api/watermark/report` -- Report detection
- `GET /api/watermark/license/{id}` -- Get by license
- `GET /api/watermark/talent/{id}` -- Get by talent

### Payments
- `POST /api/payments/checkout` -- Create Stripe checkout
- `POST /api/payments/webhook` -- Handle Stripe events

## License Types

| Type | Description | Default Duration |
|------|-------------|-----------------|
| Standard | Non-exclusive digital content license | 90 days |
| Exclusive | Exclusive rights within category | 180 days |
| Time-Limited | Short-term campaign license | 30 days |

## License

MIT
