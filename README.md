# Prompt Engineering — course site (GitHub Pages)

This folder is a ready-to-publish website. It contains `index.html`, a `downloads/`
folder with the student PDFs and slide decks, and `.nojekyll`. Publishing it on
GitHub Pages puts your course page online at a URL like **https://anandvenkat4.github.io**.

> Your GitHub username is **anandvenkat4**, so your site will be
> **https://anandvenkat4.github.io**.

---

## Option A — No command line (easiest, ~5 minutes)

1. Create a free account at **github.com** (if you don't have one).
2. Click **New repository**. Name it **exactly** `anandvenkat4.github.io`
   (all lowercase). Set it to **Public**. Do NOT add a README. Click **Create**.
3. On the new repo page, click **uploading an existing file**.
4. Open this `github-site` folder on your computer, select **everything inside it**
   (the `index.html`, the `downloads` folder, and the `.nojekyll` file) and drag it
   into the browser. Wait for the upload to finish, then click **Commit changes**.
5. Go to **Settings → Pages**. Under *Build and deployment*, set **Source =
   Deploy from a branch**, **Branch = main**, folder **/(root)**. Click **Save**.
6. Wait 1–2 minutes, then open **https://anandvenkat4.github.io** — your site is live.

> Tip: if the `.nojekyll` file is hidden on your Mac, press **Cmd+Shift+.** in Finder
> to show hidden files before dragging, or don't worry — the site still works without it.

---

## Option B — Command line (git)

```bash
cd "path/to/github-site"
git init
git add .
git commit -m "Course site"
git branch -M main
git remote add origin https://github.com/anandvenkat4/anandvenkat4.github.io.git
git push -u origin main
```

Then enable Pages: **Settings → Pages → Source: Deploy from a branch → main → /(root)**.

---

## Updating the site later

Re-upload a changed file (Option A) or `git add . && git commit -m "update" && git push`
(Option B). Changes go live in a minute or two.

## Site structure

- `index.html` &mdash; your **portfolio landing page** (https://anandvenkat4.github.io).
- `course/index.html` &mdash; the **Prompt Engineering course** page (https://anandvenkat4.github.io/course/).
- `course/downloads/` &mdash; student PDFs and slide decks linked from the course page.

## What's published

- Portfolio landing page + the course page.
- Student downloads: Course Reader, Lab Manual, Session Brief, and the seven slide decks.
- Instructor-only files (lecture plan, rubrics, injection probes, classroom note) are
  **not** in this folder, so they stay private.

> The portfolio page has bracketed `[placeholders]` for your headline, about, roles and
> skills. Fill those in (or send me your LinkedIn text and I'll do it) before you publish.

## Custom domain (optional)

If you buy a domain later, add it under **Settings → Pages → Custom domain** and create
the DNS records GitHub shows you. HTTPS is issued automatically.
