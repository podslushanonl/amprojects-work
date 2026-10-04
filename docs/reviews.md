# Review moderation

Reviews are stored in the existing bot database on the persistent Railway volume (table am_project_reviews). Public data is fetched from GET /api/reviews; only approved records and public fields are returned. No private contacts appear in that response. Static testimonials are an empty loading fallback.

POST /api/review validates and rate-limits submissions, signs an idempotency key, and forwards them to the bot using a dedicated AM_REVIEWS_SECRET. The worker requires the same secret and AM_REVIEWS_CHAT_ID. Never expose the secret to a browser.

The Telegram notification has Publish and Delete buttons. Only configured ADMIN_IDS may act. Publication changes the public feed immediately. The website refreshes every 15 seconds while visible and on return from Telegram. Delete requires confirmation, excludes the record from the feed and removes its stored content and contact; an idempotency tombstone prevents an old request from resurrecting it.

Use /amreviews in the bot to retrieve the latest 20 reviews. Reply /amreview to an old notification from this bot to import it as pending and receive buttons; imported reviews are never auto-published.

Deployment order: configure the dedicated shared secret and chat reference; deploy the bot PR first; verify its public endpoint; then deploy the website. No webhook/polling changes are required. No real test reviews should be published.
