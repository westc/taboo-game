# Taboo

A pass-the-phone Taboo party game, built as a Progressive Web App that runs entirely on your device.

- **No server, no sign-in.** Decks and cards are stored in the browser's `localStorage` on the phone, tablet or computer you play on.
- **Static PWA** in [`docs/`](docs), hosted on GitHub Pages (Vue 3 from a CDN, no build step). It works offline once loaded, and phones can install it to the home screen.
- **Import / export** decks as JSON from **Settings → Data**. The file format is the same one the [Google Sheets version of Taboo](https://github.com/westc/gsheets-taboo-game) exports, so you can move decks between the two.

## Decks

- **Cards tab**: create decks, then add, edit and delete cards. A deck is saved when you add its first card. **Delete deck** removes a deck and all its cards.
- **Import**: merges the file into your decks. A card with the same word in the same deck (ignoring case) is replaced; everything else is added.
- **Export**: downloads every deck as `taboo-decks-YYYY-MM-DD.json`.

Because the cards only exist on one device, export now and then to keep a backup. Clearing the browser's site data deletes them. The app asks the browser for persistent storage so it doesn't clear them on its own to free up space.

### JSON format

```json
{
  "format": "taboo-decks",
  "version": 1,
  "exportedAt": "2026-10-19T12:00:00.000Z",
  "decks": [
    {
      "name": "Movies",
      "cards": [
        { "word": "Titanic", "difficulty": 1, "taboo": ["Ship", "Iceberg", "Leonardo"] }
      ]
    }
  ]
}
```

- `difficulty` is 1 (easy), 2 (medium) or 3 (hard). It's also the number of points a correct guess is worth.
- Import also accepts a plain array of cards that each have a `deck`, for example `[{ "word": "Titanic", "deck": "Movies", "difficulty": 1, "taboo": "Ship, Iceberg" }]`. `taboo` can be an array or a comma-separated string.

## Publish on GitHub Pages

1. Push this repo to GitHub.
2. On GitHub, go to **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, and pick `main` / `/docs`.
3. Open `https://<your-github-username>.github.io/<repo-name>/` on your phone, then use **Share → Add to Home Screen** (iOS) or **Install app** (Android/Chrome).

If you use a different URL, update the `og:url` and `og:image` link-preview tags in [`docs/index.html`](docs/index.html).

### Local testing

```sh
npm run serve
# open http://localhost:8000
```

## Updating the app

Browsers cache the PWA files. When you change anything in `docs/`, bump `VERSION` in [`docs/sw.js`](docs/sw.js) (for example, `tabooGame-v2`) so installed copies download the new files. They switch to the new version the next time they're opened. Keep the `tabooGame-` prefix: the Google Sheets version deletes caches that start with `taboo-`, and both apps share a cache store if they're on the same domain.
