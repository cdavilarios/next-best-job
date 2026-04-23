# Deploy to GitHub Pages — Step by Step

## What you need
- A GitHub account (you have: cdavilarios)
- 10 minutes

---

## Step 1 — Create the repo on GitHub

1. Go to github.com → click **+** → **New repository**
2. Name: `next-best-job`
3. Set to **Public** (required for free GitHub Pages)
4. Click **Create repository**

---

## Step 2 — Upload the files

### Option A — GitHub web UI (easiest, no terminal needed)

1. On your new repo page, click **uploading an existing file**
2. Drag and drop all files from this folder:
   - `index.html`
   - `app.html`
   - `README.md`
   - `src/` folder (criteria.js, scorer.js, store.js)
3. Commit message: `initial commit — next-best-job agent`
4. Click **Commit changes**

### Option B — Terminal (if you have git installed)

```bash
cd /path/to/next-best-job
git init
git add .
git commit -m "initial commit — next-best-job agent"
git remote add origin https://github.com/cdavilarios/next-best-job.git
git push -u origin main
```

---

## Step 3 — Set your password

**Before pushing**, open `index.html` in a text editor.

Find this line (near the bottom, in the `<script>` block):
```js
const PASSWORD_HASH = "3b5f2e4a8c1d9f...";
```

Generate your own hash:

**Mac/Linux terminal:**
```bash
echo -n "your-password-here" | shasum -a 256
```

**Windows PowerShell:**
```powershell
$str = "your-password-here"
$bytes = [System.Text.Encoding]::UTF8.GetBytes($str)
$hash = [System.Security.Cryptography.SHA256]::Create().ComputeHash($bytes)
[System.BitConverter]::ToString($hash).Replace("-","").ToLower()
```

**Online (no install):** https://emn178.github.io/online-tools/sha256.html

Copy the hash output and replace the string in `index.html`. Then save and push.

---

## Step 4 — Enable GitHub Pages

1. Go to your repo on GitHub
2. Click **Settings** → scroll to **Pages** (left sidebar)
3. Under **Source**: select **Deploy from a branch**
4. Branch: **main** → Folder: **/ (root)**
5. Click **Save**

GitHub will show you your URL:
```
https://cdavilarios.github.io/next-best-job
```

It goes live in 1–3 minutes.

---

## Step 5 — Test it

1. Visit `https://cdavilarios.github.io/next-best-job`
2. You should see the public landing page
3. Click **Open dashboard** → enter your password
4. You should see the private dashboard

---

## Step 6 — Add your Anthropic API key (for AI generation)

1. In the private dashboard → **Settings**
2. Paste your Anthropic API key (get one at console.anthropic.com)
3. Click **Save key**
4. Go to **AI Generate** → fill in a role → click Generate

Your API key is stored only in your browser and is never sent anywhere except Anthropic's API.

---

## Updating the site

Every time you push new files to GitHub, the site updates automatically in ~1 minute.

```bash
git add .
git commit -m "update shortlist / add feature"
git push
```

---

## Your URLs

| URL | What it is |
|---|---|
| `cdavilarios.github.io/next-best-job` | Public landing page |
| `cdavilarios.github.io/next-best-job/app.html` | Private dashboard (password-gated) |
| `github.com/cdavilarios/next-best-job` | Source code (public) |

---

## Troubleshooting

**Page shows 404:** GitHub Pages takes up to 5 minutes. Check Settings → Pages to confirm it's enabled.

**Password not working:** Double-check your hash. Make sure there are no spaces and you used `-n` flag with echo (without `-n`, echo adds a newline which changes the hash).

**AI Generate not working:** Check your API key in Settings. It must start with `sk-ant-`. Get one at console.anthropic.com.

**Data not saving:** Make sure you're visiting the same URL each time (not localhost). localStorage is origin-specific.
