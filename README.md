# Banatiga Chatbot

A mobile-friendly AI chat app built with Node.js, Express, and OpenRouter.

## Run locally

1. Install Node.js 18 or newer.
2. In this folder, run `npm install`.
3. Set the `OPENROUTER_API_KEY` environment variable.
4. Run `npm start`.
5. Open `http://localhost:3000`.

Keep your API key private. Do not put it in frontend files or commit it to GitHub.

## Deploy on Render

1. Upload these project files to your GitHub repository.
2. In Render, create a **Web Service** and connect the repository.
3. Set **Build Command** to `npm install`.
4. Set **Start Command** to `npm start`.
5. In Render's Environment settings, add `OPENROUTER_API_KEY` with your own OpenRouter API key. Optionally set `OPENROUTER_MODEL` to a model available to your account.
6. Deploy the service.

The app will show a helpful message until the API key is configured.
