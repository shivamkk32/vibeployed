# Deploying vibeployed.com

The site is a static single-page app, so the cheapest and simplest GCP option
is **Firebase Hosting**: global CDN, free TLS, free custom domains, and a free
tier that a marketing site will not exhaust. Cloud Run would also work but adds
a container, a registry and an always-warm instance to pay for, and buys you
nothing here because there is no server side.

Everything below is a one-time setup. After it, every push to `main` deploys.

## 1. Create the project and enable hosting

```bash
gcloud projects create YOUR_PROJECT_ID --name="Vibeployed"
gcloud config set project YOUR_PROJECT_ID
# Link billing in the console; the free tier still needs an account on file.
gcloud services enable firebasehosting.googleapis.com firebase.googleapis.com
```

Then add the project to Firebase once, at
<https://console.firebase.google.com> → Add project → pick the existing GCP
project → enable Hosting.

## 2. Point the repo at the project

Replace the placeholder in `.firebaserc`:

```json
{ "projects": { "default": "YOUR_PROJECT_ID" } }
```

## 3. Create a deploy service account

```bash
gcloud iam service-accounts create github-deployer \
  --display-name="GitHub Actions deployer"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:github-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/firebasehosting.admin"

gcloud iam service-accounts keys create key.json \
  --iam-account="github-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com"
```

## 4. Add the secrets to GitHub

```bash
gh secret set FIREBASE_SERVICE_ACCOUNT --repo shivamkk32/vibeployed < key.json
gh secret set FIREBASE_PROJECT_ID --repo shivamkk32/vibeployed --body "YOUR_PROJECT_ID"
rm key.json          # do not keep this on disk
```

`key.json` is a long-lived credential with deploy rights. Delete it once the
secret is set, and never commit it.

## 5. First deploy

Push to `main`, or run the workflow by hand:

```bash
gh workflow run deploy.yml --repo shivamkk32/vibeployed
gh run watch --repo shivamkk32/vibeployed
```

## 6. Attach the domain

In the Firebase console → Hosting → Add custom domain → `vibeployed.com`
(and `www.vibeployed.com`). Firebase gives you the DNS records to add at your
registrar: usually two `A` records for the apex and a `CNAME` for `www`.
The TLS certificate is issued automatically and takes up to about an hour.

## Deploying by hand

If you would rather not use CI:

```bash
npm ci && npm run build
npx firebase-tools login
npx firebase-tools deploy --only hosting --project YOUR_PROJECT_ID
```

## Why the rewrite matters

`firebase.json` rewrites every unknown path to `/index.html`. The app uses
`BrowserRouter`, so without that a hard refresh on `/console` returns a 404.
Hashed assets under `/assets/**` are served immutable for a year; `index.html`
is served `no-cache` so a deploy is picked up immediately.
