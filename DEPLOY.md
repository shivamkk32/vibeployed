# Deploying vibeployed.com

## The short version: this costs you nothing

**Stay on the Firebase Spark plan and you cannot be charged.** Spark is the
free tier, it has no billing account attached, and when a quota runs out the
service simply stops until the next day rather than billing you. Your $10-15
is never touched, because there is nothing for Google to charge it to.

That is the whole reason for the architecture. There is no server anywhere:
static files on a CDN, and the browser writing straight into one Firestore
collection. Nothing runs when nobody is visiting.

> **Correcting something I said earlier:** I previously told you a billing
> account was required. It is not, as long as you stay on Spark and do the
> setup through the Firebase console. Only the paid Blaze plan needs a card,
> and you do not need Blaze for any of this.

### What you get free, and what would run out first

| Piece | Free allowance | What that means here |
| --- | --- | --- |
| Firebase Hosting | 10 GB stored, **360 MB/day** transfer | Page weighs ~193 KB, so roughly **1,800 visits a day** |
| Cloud Firestore | 1 GiB stored, **20k writes/day** | The contact form will not get close |
| TLS certificate | included | Free, auto-renewing |
| Custom domain | included | vibeployed.com and www, no charge |
| GitHub Actions | 2,000 min/month, and **unlimited on public repos** | Your repo is public, so builds are free |

The first thing you would exhaust is hosting transfer, at around 1,800 visits
a day. If you ever get there, put Cloudflare's free tier in front and the
problem disappears.

### What I deliberately avoided, and what it would have cost you

| Tempting option | Monthly cost | Why not |
| --- | --- | --- |
| Cloud Run | ~$5-15 + registry | Bills per request; a custom domain wants a load balancer at ~$18 |
| Cloud SQL | **~$9 minimum** | Runs whether anyone visits or not. Would eat your whole budget |
| Cloud Functions | needs Blaze | The browser writes to Firestore directly, so there is nothing for it to do |
| App Engine | instance hours | Always-on capacity you do not need |

Any one of those would have spent your budget every month, forever, for a site
that gets no traffic yet.

---

## Setup: all in the browser, no gcloud needed

You do not need the Google Cloud SDK installed for any of this.

### 1. Create the project

<https://console.firebase.google.com> → **Add project** → name it
`vibeployed` → you can turn Google Analytics off.

When asked about a plan, **stay on Spark**. Do not upgrade to Blaze.

### 2. Turn on Hosting

**Build → Hosting → Get started.** You can skip the CLI instructions it shows;
the GitHub workflow in this repo does that part.

### 3. Create the database

**Build → Firestore Database → Create database.**

> ⚠️ Choose **Production mode**, not test mode. Test mode leaves your database
> open to the entire internet for 30 days.

Pick a single region such as `us-east1` rather than a multi-region: cheaper,
and stays inside the free tier. `firestore.rules` in this repo replaces the
locked-down defaults on the first deploy with "anyone may submit the form,
nobody may read it".

### 4. Register a web app

**Project settings → General → Your apps → Web (`</>`)**. Nickname it
`vibeployed-web`. Copy the config block it shows you.

You need four values: `apiKey`, `authDomain`, `projectId`, `appId`.

**These are not secrets.** Firebase web config is public by design and ships
inside the JavaScript bundle. What protects your database is
`firestore.rules`, which permits `create` on `contactRequests` and denies
every read. Do not go looking for a way to hide them.

### 5. Create the deploy credential

<https://console.cloud.google.com/iam-admin/serviceaccounts> (same project)

1. **Create service account**, name it `github-deployer`
2. Grant it two roles: **Firebase Hosting Admin** and **Firebase Rules Admin**
3. Open it → **Keys → Add key → Create new key → JSON**. It downloads a file.

### 6. Give GitHub the config

In a terminal, from the folder where that JSON landed:

```bash
gh secret set FIREBASE_SERVICE_ACCOUNT --repo shivamkk32/vibeployed < the-downloaded-file.json
```

Then delete the downloaded file. It is a long-lived credential.

Send me the four values from step 4 and I will set the rest, or do it
yourself:

```bash
gh variable set FIREBASE_PROJECT_ID  --repo shivamkk32/vibeployed --body "your-project-id"
gh variable set FIREBASE_API_KEY     --repo shivamkk32/vibeployed --body "AIza..."
gh variable set FIREBASE_AUTH_DOMAIN --repo shivamkk32/vibeployed --body "your-project-id.firebaseapp.com"
gh variable set FIREBASE_APP_ID      --repo shivamkk32/vibeployed --body "1:...:web:..."
```

### 7. Deploy

```bash
gh workflow run deploy.yml --repo shivamkk32/vibeployed
gh run watch --repo shivamkk32/vibeployed
```

The workflow builds, deploys `firestore.rules`, then publishes hosting. Every
later push to `main` repeats it. Until step 6 is done the workflow fails on
every push, which is expected and costs nothing.

### 8. Attach the domain

Firebase console → **Hosting → Add custom domain** → `vibeployed.com`, then
again for `www.vibeployed.com`. Firebase shows the DNS records to add at your
registrar: normally two `A` records for the apex and a `CNAME` for `www`. The
certificate is issued automatically and can take up to about an hour.

---

## Reading the submissions

Firebase console → **Firestore Database → contactRequests**. Each document has
`name`, `email`, `company`, `message`, `createdAt`, plus `referrer` and
`userAgent` for triage.

The rules deny reads from the browser, so the console is the only way in. That
is deliberate: a public form collection anyone can read is a data leak.

### Email notification when someone submits

Not included, because it is the one thing here that would cost money. A
Firestore trigger needs Cloud Functions, which needs Blaze. At your volume
Blaze would bill about $0, but it needs a card on file and can in principle
charge you, so it is your call rather than mine.

Free alternative if you want alerts now: check the Firebase console, or add
the address to a phone bookmark. For a site with no traffic yet that is
genuinely fine.

## Spam, and why it matters on a free tier

The only way this ever costs you anything is somebody hammering the form and
burning through the write quota. Three defences, all already in place and all
free:

1. **`firestore.rules`** rejects anything malformed, oversized, carrying
   unexpected fields, or with a client-supplied timestamp.
2. **A honeypot field** that humans never see and bots fill in. Filled means
   the submission is dropped before it is written, and the bot is told it
   succeeded so it does not learn.
3. **A timing trap and a throttle**: submissions faster than 3 seconds after
   the form loads are refused, and one submission per browser per minute.

Those last two are client-side and a determined script can skip them. They
exist to stop casual spam eating quota, not as security. The rules are the
security.

If you ever do get hit properly, turn on **Firebase App Check** with
reCAPTCHA v3. It is free on Spark and blocks traffic that is not from your
real site.

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
npx firebase-tools deploy --project your-project-id
```

There is deliberately no `.firebaserc` in the repo: it only ever held a
placeholder project id, and the CLI silently preferred it over the real one,
which is what made the first deploys fail. The project is passed explicitly
instead, from `FIREBASE_PROJECT_ID` in CI or `--project` locally.

## Why the rewrite in firebase.json matters

Every unknown path is rewritten to `/index.html`. The app uses
`BrowserRouter`, so without that a hard refresh on `/console` returns a 404.
Hashed assets under `/assets/**` are immutable for a year; `index.html` is
`no-cache` so a deploy is picked up immediately.
