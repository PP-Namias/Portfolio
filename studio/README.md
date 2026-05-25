# Namias CMS Studio

Congratulations, you have now installed the Sanity Content Studio, an open-source real-time content editing environment connected to the Sanity backend.

## Local setup

- The studio reads the same Sanity env values as the root app from `.env` / `.env.local` in the repository root.
- Preview mode points to `http://localhost:3000` by default, or to `NEXT_PUBLIC_SITE_URL` when that variable is set.
- The presentation tool uses `/api/draft-mode/enable` to turn on draft mode before opening the preview.

Now you can do the following things:

- [Read “getting started” in the docs](https://www.sanity.io/docs/introduction/getting-started?utm_source=readme)
- [Join the Sanity community](https://www.sanity.io/community/join?utm_source=readme)
- [Extend and build plugins](https://www.sanity.io/docs/content-studio/extending?utm_source=readme)

## Scripts

- `npm run dev` — start the studio locally
- `npm run lint` — lint the studio package
- `npm run build` — build the studio for production
- `npm run start` — run the built studio locally
