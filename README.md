# Ethiopian Cities Public Bus Tracking and Scheduling System

Single repo containing backend (Express + Apollo GraphQL + MongoDB) and frontend (Next.js App Router + TypeScript + Tailwind).

## Environment
Backend (.env):
- MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
- JWT_SECRET=<your-secret>
- FRONTEND_URL=http://localhost:4028
- PORT=5000

Frontend (.env.local):
- NEXT_PUBLIC_API_URL=http://localhost:5000/api
- NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<your-google-maps-key>

## Development
- Install deps: npm install
- Start both apps: npm run dev:all
- GraphQL endpoint: http://localhost:5000/graphql
- REST health: http://localhost:5000/api/health

## Deployment
- Frontend (Vercel): set NEXT_PUBLIC_API_URL to your Render backend public URL and NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in Vercel project settings.
- Backend (Render): set MONGODB_URI, JWT_SECRET, FRONTEND_URL to your Vercel domain, and command: node server.js.
