# Deploying vibeployed.com

## What this costs

**Nothing, at your scale.** The whole thing is designed to sit inside Google's
free tiers, and it will stay there until the site is genuinely busy.

| Piece | Service | Free allowance | What that means here |
| --- | --- | --- | --- |
| The site | Firebase Hosting | 10 GB stored, 360 MB/day transfer | The page is ~250 KB, so roughly 1,400 visits a day before you pay |
| Form submissions | Cloud Firestore | 1 GiB stored, 20k writes/day, 50k reads/day | A contact form will not get near this |
| TLS certificate | Firebase Hosting | included | Free, auto-renewing |
| Custom domain | Firebase Hosting | included | vibeployed.com and www, no charge |
| CI/CD | GitHub Actions | 2,000 min/month on free accounts | A build is ~2 min |

Total: **$0/month.** You still have to attach a billing account to the Google
Cloud project, but nothing here bills against it at these volumes.

### What I deliberately did not use, and why

| Tempting option | Why not |
| --- | --- |
| Cloud Run | Bills per request and needs a container registry. For a static site it buys nothing, and a custom domain wants a load balancer at roughly $18/month |
| Cloud SQL | Cheapest instance is about $9/month, running whether anyone visits or not |
| Cloud Functions | Requires the paid Blaze plan. The browser can write to Firestore directly, so there is nothing for a function to do |
| App Engine | Always-on instance hours you do not need |

The architecture is: **static files on a CDN, plus one Firestore collection
the browser writes to directly.** No server exists, so there is no server to
pay for.

---

## What I need from you

1. **A GCP project ID.** Either an existing one or a new name, for example
   `vibeployed-prod`.
2. **A billing account attached to it.** Free tiers still require one on file.
   You will not be charged at these volumes, but set a budget alert anyway
   (step 7).
3. **Access to your domain's DNS** at whichever registrar you bought
   vibeployed.com from, to add two records.
4. **Either** `gcloud` installed here so I can run all of this for you, **or**
   you run the steps below yourself. I cannot authenticate to Google from this
   machine: `gcloud` is not installed, and its sign-in needs a browser.

---

## 1. Create the project

```bash
gcloud projects create YOUR_PROJECT_ID --name="Vibeployed"
gcloud config set project YOUR_PROJECT_ID
```

Attach billing in the console, then:

```bash
gcloud services enable \
  firebase.googleapis.com \
  firebasehosting.googleapis.com \
  firestore.googleapis.com \
  firebaserules.googleapis.com
```

## 2. Add Firebase and create the database

At <https://console.firebase.google.com> choose **Add project**, pick the
existing GCP project, and enable **Hosting**.

Then **Build → Firestore Database → Create database**:

- **Start in production mode.** Not test mode: test mode leaves the database
  open to the world for 30 days.
- Pick a location near your users. `nam5` (US) or `eur3` (Europe) are the
  multi-region options; a single region such as `us-east1` is cheaper and
  plenty for this.

The rules in `firestore.rules` are deployed by CI and will replace the
default locked-down rules with "anyone may submit the form, nobody may read".

## 3. Register a web app

Firebase console → **Project settings → General → Your apps → Web**. Copy the
config values. You need four of them:

```
apiKey, authDomain, projectId, appId
```

**These are not secrets.** Firebase web config is public by design and ships
inside the JavaScript bundle. What protects the database is `firestore.rules`,
which allows `create` on `contactRequests` and denies every read. Do not go
looking for a way to hide them.

## 4. Create a deploy service account

```bash
gcloud iam service-accounts create github-deployer \
  --display-name="GitHub Actions deployer"

for ROLE in roles/firebasehosting.admin roles/firebaserules.admin; do
  gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:github-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="$ROLE"
done

gcloud iam service-accounts keys create key.json \
  --iam-account="github-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com"
```

## 5. Give GitHub the config

```bash
# Secret: the deploy credential.
gh secret set FIREBASE_SERVICE_ACCOUNT --repo shivamkk32/vibeployed < key.json
rm key.json          # delete it, it is a long-lived credential

# Variables: public Firebase web config, baked into the build.
gh variable set FIREBASE_PROJECT_ID   --repo shivamkk32/vibeployed --body "YOUR_PROJECT_ID"
gh variable set FIREBASE_API_KEY      --repo shivamkk32/vibeployed --body "AIza..."
gh variable set FIREBASE_AUTH_DOMAIN  --repo shivamkk32/vibeployed --body "YOUR_PROJECT_ID.firebaseapp.com"
gh variable set FIREBASE_APP_ID       --repo shivamkk32/vibeployed --body "1:...:web:..."
```

## 6. Deploy

```bash
gh workflow run deploy.yml --repo shivamkk32/vibeployed
gh run watch --repo shivamkk32/vibeployed
```

The workflow builds the site, deploys `firestore.rules`, then publishes
hosting. Every later push to `main` repeats it.

## 7. Put a budget alert on it

Cheap insurance against a surprise, which is rather the point of this product:

```bash
gcloud billing budgets create \
  --billing-account=YOUR_BILLING_ACCOUNT_ID \
  --display-name="Vibeployed" \
  --budget-amount=5USD \
  --threshold-rule=percent=50 \
  --threshold-rule=percent=100
```

## 8. Attach the domain

Firebase console → **Hosting → Add custom domain** → `vibeployed.com`, and
again for `www.vibeployed.com`. Firebase shows the DNS records to add at your
registrar: normally two `A` records for the apex and a `CNAME` for `www`.
The certificate is issued automatically and can take up to about an hour.

---

## Reading the submissions

Firebase console → **Firestore Database → contactRequests**. Each document
holds `name`, `email`, `company`, `message`, `createdAt`, plus `referrer` and
`userAgent` for triage.

Rules deny reads from the browser, so the console and service accounts are the
only ways in. That is deliberate: a public form collection that anyone can
read is a data leak.

### Getting an email when someone submits

Not included, because every option costs something:

- A Firestore trigger needs Cloud Functions, which needs the **Blaze** plan.
  At this volume Blaze would still bill about $0, but it needs a card and can
  in principle charge you.
- The **Trigger Email from Firestore** extension is the least work, and needs
  Blaze plus an SMTP provider such as Brevo, whose free tier covers 300
  emails a day.

Until then, check the console. For a site with no traffic yet, that is fine.

## Spam

The form is public, so it will eventually get bot submissions. In order of
cost:

1. **Free, already done.** `firestore.rules` rejects anything malformed,
   oversized or with unexpected fields.
2. **Free.** Firebase **App Check** with reCAPTCHA v3 blocks traffic that is
   not from your real site. Worth turning on the day you get your first spam.
3. **Costs money.** A Cloud Function doing content filtering. Not worth it.

## Local development

```bash
cp .env.example .env.local     # paste the four values in
npm run dev
```

Without those the form stays in demo mode and says so, rather than pretending
to save.

## Deploying by hand

```bash
npm ci && npm run build
npx firebase-tools login
npx firebase-tools deploy --project YOUR_PROJECT_ID
```

## Why the rewrite in firebase.json matters

Every unknown path is rewritten to `/index.html`. The app uses
`BrowserRouter`, so without that a hard refresh on `/console` returns a 404.
Hashed assets under `/assets/**` are immutable for a year; `index.html` is
`no-cache` so a deploy is picked up immediately.
