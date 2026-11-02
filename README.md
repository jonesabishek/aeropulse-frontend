# AeroPulse Frontend

React and Vite frontend for the AeroPulse wind monitoring platform.

## Local development

```bash
npm install
npm run dev
```

The Vite development server proxies API and Socket.IO requests to `http://localhost:5000`.

## Deploy to Vercel

1. Import the `aeropulse-frontend` GitHub repository into Vercel.
2. Set the project root to the repository root. The build command is `npm run build`, and the output directory is `dist`.
3. Add `VITE_API_URL` with the HTTPS base URL of the deployed backend, without a trailing slash. This value is used for both API and Socket.IO connections.
4. Deploy or redeploy after setting the environment variable.

See `.env.example` for the expected variable name. Do not put credentials or private keys in frontend environment variables; Vite exposes `VITE_*` values to browser clients.

## Push to GitHub

After creating an empty repository named `aeropulse-frontend`:

```bash
git remote add origin https://github.com/YOUR_USERNAME/aeropulse-frontend.git
git branch -M main
git push -u origin main
```
