# Client reviews

Published data is the `testimonials` array in `public/site-data.js`. Add real client feedback only after permission to publish. No examples or test entries are shipped.

Each entry uses: `name` (public author name), `project` (optional service/project), `text` (approved verbatim review), `rating` (integer 1–5 supplied by that client), `published` (true after approval).

The page displays only valid, published entries; calculates the arithmetic mean; shows a one-decimal average, fractional SVG stars and review count. Empty data shows no score. Do not infer a rating from positive text. Unrated or pending entries are excluded from both display and aggregate.

This is an owner-published review section, not a public review submission form. Real reviews will be added later at the owner's request.
