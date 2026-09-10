# Deploying vibeployed.com, step by step

Written to be followed top to bottom without prior GCP knowledge. Roughly 20
minutes. **Total cost: $0.** Nothing in here needs a card.

After each step there is a **✅ Check** that tells you whether it worked. Do
not move on until it passes, or you will be debugging three steps too late.

---

## Before you start

### You will use two different Google consoles

This trips everyone up. One project, two web UIs:

| Console | Address | Used for |
| --- | --- | --- |
| **Firebase** | console.firebase.google.com | Hosting, Firestore, the web app config |
| **Google Cloud** | console.cloud.google.com | The service account and its key |

They are the same project underneath. When a step says which console to use,
it matters.

### The one rule that keeps this free

**Never click "Upgrade" or accept the Blaze plan.** Spark is the free plan,
it has no billing account, and when you hit a quota the service pauses until
tomorrow instead of charging you. Blaze is pay-as-you-go and needs a card.

Firebase will occasionally suggest upgrading. Decline every time. Nothing in
this project needs it.

### What you need open

- The repo: <https://github.com/shivamkk32/vibeployed>
- A terminal in the project folder
- Your domain registrar login, for the last step only

---

## Step 1 · Create the Firebase project

1. Go to <https://console.firebase.google.com>
2. Click **Create a project** (or **Add project**)
3. Project name: `vibeployed`
   - Below the name Firebase shows the **project ID**. If `vibeployed` is
     free you get it exactly; otherwise Firebase appends a suffix such as
     `vibeployed-a1b2c`. **Write down whatever it shows.** It is not
     necessarily the same as the name, it cannot be changed later, and you
     will need it repeatedly. You can always read it back off the console
     URL: `console.firebase.google.com/project/<THIS-BIT>/overview`
4. **Google Analytics: turn it off.** You do not need it, and it adds a second
   linked account to manage
5. Click **Create project**, wait, then **Continue**

> **✅ Check:** you land on the project dashboard, the project ID appears in
> the URL, and there is a **Spark plan** badge next to the project name. If it
> says Blaze, you upgraded by mistake: downgrade under Settings → Usage and
> billing before going any further.

---

## Step 2 · Turn on Hosting

Left sidebar → **Hosting & Serverless**. That opens a list of four products.

> ⚠️ **Pick `Hosting`, not `App Hosting`.**
>
> They are different products with similar names. **App Hosting** is the newer
> one for server-rendered apps and it **requires the paid Blaze plan** — click
> it and you will be asked for a card. **Hosting** is the classic static one,
> free on Spark, and it is what this project uses.

1. **Hosting & Serverless** → **Hosting**
2. Click **Get started**
3. It shows CLI instructions (`npm install -g firebase-tools`, `firebase init`
   and so on). **Skip all of it** — click **Next** through the screens and then
   **Continue to console**. The GitHub workflow in this repo does that job

> **✅ Check:** the Hosting page shows a default domain, which for you will be
> `vibeployed.web.app`. Your site appears there before you attach the real
> domain.

---

## Step 3 · Create the database

1. Left sidebar → **Databases & Storage** → **Firestore Database**
   (not Realtime Database, not Data Connect)
2. Click **Create database**
3. **Location:** pick a single region near your users, for example
   `us-east1` (South Carolina) or `europe-west1`. Do **not** pick a
   multi-region option like `nam5` — it costs more and gives you nothing here.
   **This cannot be changed later.**
4. **Rules / mode:** choose **Start in production mode**

> ⚠️ **Do not pick test mode.** Test mode makes your database readable and
> writable by anyone on the internet for 30 days. Production mode starts
> locked, and the `firestore.rules` file in this repo opens exactly the one
> thing that needs opening: creating a contact request.

5. Click **Create**

> **✅ Check:** you see an empty database view with a **Start collection**
> link. Do not create a collection by hand — the form creates
> `contactRequests` on the first real submission.

---

## Step 4 · Register the web app and copy its config

1. Left sidebar → **Settings** (the gear, just under Project Overview) →
   **Project settings**
2. Stay on the **General** tab, scroll to the bottom: **Your apps**
3. Click the **web icon**, which looks like `</>`. On the project overview
   page the same thing is behind the **+ Add app** button
4. App nickname: `vibeployed-web`
5. **Leave "Also set up Firebase Hosting" unticked** — already done in step 2
6. Click **Register app**

It now shows a code block like this:

```js
const firebaseConfig = {
  apiKey: "AIzaSyD-EXAMPLE-xxxxxxxxxxxxxxxxxxxxx",
  authDomain: "vibeployed.firebaseapp.com",
  projectId: "vibeployed",
  storageBucket: "vibeployed.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};
```

**Copy four of those values.** You can ignore `storageBucket` and
`messagingSenderId`:

- `apiKey`
- `authDomain`
- `projectId`
- `appId`

> **These four are not secrets.** Firebase web config is public by design and
> ships inside the JavaScript bundle — anyone can read it with View Source on
> any Firebase site. What protects your database is `firestore.rules`, which
> permits creating a contact request and denies every read. Do not waste time
> trying to hide them.

If you close this box, get the values back any time from the same page:
**Project settings → General → Your apps → Config**.

> **✅ Check:** you have four values written down, and `projectId` matches
> what you noted in step 1.

---

## Step 5 · Create the deploy credential

This is the one credential that **is** secret. It lets GitHub Actions publish
to your project.

1. Go to <https://console.cloud.google.com/iam-admin/serviceaccounts>
2. **Top of the page, check the project picker** — it must show your
   `vibeployed-...` project. If not, click it and select yours
3. Click **+ Create service account**
4. **Service account name:** `github-deployer` → **Create and continue**
5. **Grant this service account access to project.** Add **two** roles, using
   **+ Add another role** between them:
   - `Firebase Hosting Admin`
   - `Firebase Rules Admin`

   Type into the filter box to find them. Both must be present.
6. **Continue** → **Done**
7. You are back on the list. Click the `github-deployer` row
8. **Keys** tab → **Add key** → **Create new key** → **JSON** → **Create**

A `.json` file downloads, probably to your Downloads folder. It looks like
`vibeployed-1234abcd.json`.

> **✅ Check:** open the file in a text editor. It should contain
> `"type": "service_account"` and a long `"private_key"`. That is the right
> file.

> ⚠️ **Treat this like a password.** Anyone with it can deploy to your
> project. You will delete it in the next step. Never commit it — your repo is
> public.

---

## Step 6 · Give GitHub the credential

In a terminal, `cd` to wherever the JSON downloaded:

```bash
cd ~/Downloads

gh secret set FIREBASE_SERVICE_ACCOUNT \
  --repo shivamkk32/vibeployed \
  < vibeployed-1234abcd.json     # your actual filename
```

Then **delete the file**:

```bash
rm vibeployed-1234abcd.json
```

If you would rather use the website: repo → **Settings** → **Secrets and
variables** → **Actions** → **New repository secret**. Name it exactly
`FIREBASE_SERVICE_ACCOUNT`, and paste the entire file contents including the
opening and closing braces.

> **✅ Check:**
> ```bash
> gh secret list --repo shivamkk32/vibeployed
> ```
> It should list `FIREBASE_SERVICE_ACCOUNT`.

---

## Step 7 · Add the four config values

These are the public ones from step 4. They go in as **variables**, not
secrets, because the build needs them and they are not sensitive.

```bash
gh variable set FIREBASE_PROJECT_ID  --repo shivamkk32/vibeployed --body "vibeployed"
gh variable set FIREBASE_API_KEY     --repo shivamkk32/vibeployed --body "AIzaSyD-EXAMPLE-xxxxx"
gh variable set FIREBASE_AUTH_DOMAIN --repo shivamkk32/vibeployed --body "vibeployed.firebaseapp.com"
gh variable set FIREBASE_APP_ID      --repo shivamkk32/vibeployed --body "1:123456789012:web:abc123def456"
```

Website alternative: same page as above, but the **Variables** tab.

**Or just send me the four values and I will do this step for you.**

> **✅ Check:**
> ```bash
> gh variable list --repo shivamkk32/vibeployed
> ```
> All four should be listed, with the right values.

---

## Step 8 · Deploy

```bash
gh workflow run deploy.yml --repo shivamkk32/vibeployed
gh run watch --repo shivamkk32/vibeployed
```

`gh run watch` follows it live. It takes about two minutes and does three
things: builds the site, deploys `firestore.rules`, publishes hosting.

> **✅ Check:** the run finishes green, and your site is live at
> `https://vibeployed.web.app`. Open it. Click through to `/console`,
> then hit refresh on that page — it should still work, not 404.

Every future push to `main` deploys automatically. You will not run this by
hand again.

---

## Step 9 · Test the contact form

1. Open the `.web.app` URL, scroll to **Contact**
2. Fill it in and send. Wait a few seconds after the page loads before
   submitting — anything faster than 3 seconds is treated as a bot
3. You should see **"Thank you. We answer every message within one business
   day."**
4. Firebase console → **Firestore Database**. A `contactRequests` collection
   now exists with your submission in it

> **✅ Check:** the document is there with `name`, `email`, `message` and a
> `createdAt` timestamp.

**If it says "Missing or insufficient permissions"** the rules did not deploy.
Check the workflow log for the "Deploy Firestore rules" step, and confirm the
service account has the **Firebase Rules Admin** role from step 5.

---

## Step 10 · Attach vibeployed.com

1. Firebase console → **Hosting** → **Add custom domain**
2. Enter `vibeployed.com` → **Continue**
3. Firebase gives you records to add at your registrar. Usually:

   | Type | Name | Value |
   | --- | --- | --- |
   | A | `@` | `151.101.1.195` |
   | A | `@` | `151.101.65.195` |

   **Use the values Firebase actually shows you**, not these. They vary.

4. Add them at your registrar, in its DNS or Nameservers section
5. Back in Firebase, click **Verify**
6. Repeat the whole thing for `www.vibeployed.com`. That one is normally a
   single `CNAME` pointing at `vibeployed.com`

> **✅ Check:** Hosting shows the domain as **Connected**. The certificate is
> issued automatically.

**Timing:** DNS changes take anywhere from a few minutes to a few hours to
spread. The certificate can take up to 24 hours after that. A "needs setup"
warning during this window is normal — leave it alone and check back.

Check propagation with:
```bash
nslookup vibeployed.com
```

---

## Afterwards

### Reading submissions

Firebase console → **Firestore Database** → `contactRequests`. Click any
document to read it. Sort by `createdAt` to get newest first.

The rules block reads from browsers, so the console is the only way in. That
is deliberate — a public collection anyone can read is a data leak.

### Getting emailed when someone submits

Deliberately not included: it is the one piece here that would cost money. A
Firestore trigger needs Cloud Functions, which needs Blaze, which needs a
card. At your volume it would bill roughly $0, but "roughly $0" is not "$0",
and you said the budget is tight.

Free option for now: bookmark the Firestore page on your phone. With no
traffic yet, that is genuinely enough.

### If you get spammed

Three defences are already active: the rules reject malformed submissions, a
hidden honeypot field catches bots that fill in everything, and there is a
3-second timing trap plus a one-per-minute throttle.

If real spam gets through, turn on **App Check** (Firebase console → Build →
App Check) with reCAPTCHA v3. Free on Spark, and it blocks anything not
coming from your actual site.

---

## Troubleshooting

**Workflow fails at "Deploy Firestore rules" with `Invalid project id`**
`FIREBASE_PROJECT_ID` is missing or wrong. Re-check step 7.

**Workflow fails with `Failed to authenticate`**
The `FIREBASE_SERVICE_ACCOUNT` secret is missing or truncated. Re-run step 6
and make sure the whole JSON went in, braces included.

**Workflow fails at "Deploy hosting" with a permissions error**
The service account is missing the **Firebase Hosting Admin** role. Add it at
console.cloud.google.com/iam-admin/iam.

**Form says "Missing or insufficient permissions"**
Rules did not deploy, or Firestore was created in a different project. Confirm
the project id matches everywhere.

**`/console` 404s after a refresh**
Hosting did not pick up `firebase.json`. It rewrites unknown paths to
`index.html`, which is what makes client-side routing survive a refresh.

**Firebase asks for a credit card**
You clicked **App Hosting** rather than **Hosting**, or a Blaze-only product
such as Functions. Back out. Nothing in this project needs Blaze.

**Site loads but shows an old version**
Hard refresh: Ctrl+Shift+R. `index.html` is served `no-cache`, so this should
be rare.

---

## What this costs, and what it would have cost

| Piece | Free allowance | Runs out at |
| --- | --- | --- |
| Hosting | 360 MB/day transfer | ~1,900 visits/day (page is 187 KB gzipped) |
| Firestore | 20k writes/day | far beyond any contact form |
| TLS + custom domain | included | never |
| GitHub Actions | unlimited on public repos | never |

If you ever pass ~1,900 visits a day, put Cloudflare's free tier in front and
the limit disappears.

**What I avoided, and why:**

| Option | Would cost | Why not |
| --- | --- | --- |
| Cloud SQL | **~$9/month** | Runs whether or not anyone visits. Would eat most of your budget, monthly, forever |
| Cloud Run | ~$5-15/month | Bills per request; a custom domain wants a load balancer at ~$18/month |
| Cloud Functions | needs Blaze | The browser writes to Firestore directly, so there is nothing for it to do |

There is no server in this design. Nothing runs when nobody is visiting, which
is why it is free rather than merely cheap.

---

## Local development

```bash
cp .env.example .env.local     # paste the same four values in
npm run dev
```

Without those the form stays in demo mode and says so, rather than pretending
to save. `.env.local` is gitignored.

## Deploying by hand, if you ever need to

```bash
npm ci && npm run build
npx firebase-tools login
npx firebase-tools deploy --project vibeployed
```

There is intentionally no `.firebaserc`. It previously held a placeholder
project id, and the Firebase CLI silently preferred it over `--project`, which
is what made the early deploys fail. The project is always passed explicitly
now: from `FIREBASE_PROJECT_ID` in CI, or `--project` locally.
