# Client reviews

Published data is the `testimonials` array in `public/site-data.js`. Add real client feedback only after permission to publish. No examples or test entries are shipped.

Each entry uses: `name` (public author name), `project` (optional service/project), `text` (approved verbatim review), `rating` (integer 1–5 supplied by that client), `published` (true after approval).

The page displays only valid, published entries; calculates the arithmetic mean; shows a one-decimal average, fractional SVG stars and review count. Empty data shows no score. Do not infer a rating from positive text. Unrated or pending entries are excluded from both display and aggregate.

Visitors submit using the review dialog and POST /api/review. Valid submissions are delivered to the configured owner Telegram chat using TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID. Success is shown only after Telegram confirms delivery. Pending submissions are retained in Telegram, not in the ephemeral Railway filesystem. The owner checks the review and adds it to testimonials with published:true to publish. Do not copy the private contact into public data. No automatic publication or approval buttons are provided.
