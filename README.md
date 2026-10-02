# AM Projects — Railway ready

## Included
- Responsive AM Projects website
- Founder portrait integrated in hero and About section
- AM Projects logo assets
- `/health` endpoint for Railway
- `POST /api/lead` backend
- Telegram Bot API delivery
- Server-side validation, honeypot and basic rate limiting

## Railway variables
The service needs:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

If this service is created inside the existing Railway project that contains the `worker` service,
the variables can be set without exposing secret values:

- `TELEGRAM_BOT_TOKEN=${{worker.BOT_TOKEN}}`
- `TELEGRAM_CHAT_ID=${{worker.CRM_TELEGRAM_CHAT_ID}}`

Only use those references if AM Projects leads should go through the same Telegram bot/chat.

## Commands
Railway can use the included `railway.toml`.
Start command: `npm start`
Healthcheck: `/health`
