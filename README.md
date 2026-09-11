# Research portfolio

Static site, no build step, no framework. Plain HTML, CSS and JavaScript.

Content that rarely changes (name, photo, title, affiliation, profile links,
resume link, contact emails) is hard-coded directly in `index.html`. Content
that keeps growing over time (research interests, publications, experience,
education) is rendered from `data/profile.json`.

```
index.html
css/style.css
js/app.js        reads the JSON and builds the sections that keep changing
data/profile.json
assets/portrait.jpg
assets/          put resume.pdf here too
robots.txt       tells search crawlers the whole site is indexable
sitemap.xml      lists the page for crawlers
```

## Run it locally

Opening `index.html` by double clicking will not work, because browsers refuse
to `fetch` a local file from a `file://` page. Serve the folder instead:

```bash
cd portfolio
python3 -m http.server 8000
```

Then open http://localhost:8000

## Publish on GitHub Pages

1. Create a repository named `ISLAH-Hamza.github.io`
2. Copy the contents of this folder into it, so that `index.html` sits at the repository root
3. `git add . && git commit -m "portfolio" && git push`
4. In the repository, go to Settings, then Pages, and set the source to the `main` branch, folder `/ (root)`

The site will be live at https://ISLAH-Hamza.github.io

## Change static content (name, photo, title, links, resume, contact)

Edit `index.html` directly:

- Name, role and affiliation: the `.name`, `.role` and `.affil` elements in the `<aside class="rail">`
- Profile links (Google Scholar, GitHub, ORCID, email): the `<ul class="links">` list
- Resume button: the `.resume-btn` link — point its `href` at `assets/resume.pdf` (or your file) and put the PDF at that path
- Portrait: the `<img class="portrait">` in the `.hero` section — replace `assets/portrait.jpg`, or point `src` at another file. Use a portrait shaped image, roughly 4 by 5, at about 1000 pixels wide
- Contact emails: the two `.contact-line` paragraphs in the `#contact` section

## Change content that grows over time

Edit `data/profile.json` only. The renderer handles these fields:

- `bio`: the opening paragraph next to the portrait
- `research_interests`: list of sentences
- `publications.accepted`, `publications.under_review`, `publications.preprints`.
  Each entry takes `title`, `authors`, `conference` or `journal`, `year`, and
  either `doi` or `url`. Your own name is detected by matching your surname
  (set as `SURNAME` in `js/app.js`) and shown in bold
- `experience`, `education`

## SEO metadata

`index.html`'s `<head>` carries the metadata search engines and link previews
read: a descriptive `<title>`, `meta description`/`keywords`/`robots`, a
`canonical` link, Open Graph and Twitter Card tags for link previews, and a
`schema.org` Person JSON-LD block (Google's Rich Results use this for the
knowledge-panel-style profile info).

All of these hard-code the site URL `https://islah-hamza.github.io/` — the
same address `robots.txt` and `sitemap.xml` point at. If you publish under a
different domain, update the URL in all four places: the `<link
rel="canonical">`, the `og:url`/`og:image`/`twitter:image` meta tags, the
JSON-LD `url`/`image`, `robots.txt`'s `Sitemap:` line, and `sitemap.xml`'s
`<loc>`.
