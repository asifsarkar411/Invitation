# Asif & Sayma — wedding invitation

A responsive wedding invitation with an animated opening screen, editable homepage, and guest RSVP form. The static page works as a local preview; Vercel API routes store the live homepage and RSVPs in MongoDB Atlas.

## Deploy to Vercel

1. Push this project to a Git repository and import it in Vercel. No build command or output directory is needed; the root `index.html` is served as a static site and files in `api/` become serverless functions.
2. Create a MongoDB Atlas database and allow Vercel's connections in the Atlas network access settings. Create a database user with read/write access to the selected database.
3. In Vercel Project Settings → Environment Variables, add `MONGODB_URI`, `MONGODB_DB` (optional; defaults to `asif_sayma_invitation`), and `ADMIN_PASSWORD` (a long, unique secret). Add them for the Production environment and redeploy.
4. Visit the deployed site and use **Edit website** in the lower-right corner to sign in. Update the homepage, event schedule, venue, and image URLs, then save. Open the **RSVPs** tab to see guest replies.

The database creates its `site` and `rsvps` collections automatically. RSVPs collect only a guest name, yes/no response, and submission time. Image fields accept public image URLs; upload photos to an image host and paste their URLs in the admin panel.

## Local preview

Open `index.html` directly or serve the project with any static server. Without the Vercel API and MongoDB variables, the RSVP form and admin editor use browser-local storage as a preview. This local mode does not publish content or deliver guest replies to the database.

Copy `.env.example` as a reference for the environment variables. Never commit real database credentials or the admin password.
