# Research portfolio

Static site, no build step, no framework. Plain HTML, CSS and JavaScript.
Everything on the page is rendered from `data/profile.json`.

```
index.html
css/style.css
js/app.js        reads the JSON and builds every section
data/profile.json
assets/portrait.jpg
assets/          put resume.pdf here too
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

## Add your resume

Put the PDF at `assets/resume.pdf`, then set the field in `data/profile.json`:

```json
"resume": "assets/resume.pdf"
```

While that field is an empty string the link stays hidden, so the site never
shows a broken download.

## Change the content

Edit `data/profile.json` only. The renderer handles these fields:

- `name`, `title`, `affiliation`, `location`, `email`, `bio`, `resume`, `photo`
- `profiles`: any key, any URL. Known keys get a proper label
  (`google_scholar`, `github`, `orcid`, `linkedin`, `dblp`), unknown keys fall
  back to the key name
- `research_interests`: list of sentences
- `publications.accepted`, `publications.under_review`, `publications.preprints`.
  Each entry takes `title`, `authors`, `conference` or `journal`, `year`, and
  either `doi` or `url`. Your own name is detected from `name` and set in bold
- `experience`, `education`

## Change the portrait

Replace `assets/portrait.jpg`, or point the `photo` field in the JSON at
another file. Use a portrait shaped image, roughly 4 by 5, at about 1000 pixels
wide. If `photo` is an empty string the image is removed and the opening
paragraph runs full width.
