/**
 * Where contact form submissions go.
 *
 * The whole thing is a static site plus one Firestore collection, chosen
 * because it is the only shape that costs nothing at this scale: no server,
 * no Cloud Run instance, no Cloud SQL. The browser writes straight to
 * Firestore and security rules do the validation, so there is no backend to
 * pay for or maintain.
 *
 * The Firebase SDK is loaded with a dynamic import inside `submit`, so it is
 * a separate chunk that only downloads when somebody actually sends the form.
 * It never touches the initial page load.
 *
 * If the env vars are absent the form stays in demo mode and reports that,
 * rather than silently pretending to have saved something.
 */

export type ContactRequest = {
  name: string;
  email: string;
  company: string;
  message: string;
  /** Hidden honeypot. Humans leave it empty; bots fill every field. */
  website?: string;
  /** When the form was mounted, used to catch instant bot submissions. */
  startedAt?: number;
};

export type SubmitResult =
  | { ok: true; stored: true }
  | { ok: true; stored: false; reason: "not-configured" | "rejected" }
  | { ok: false; error: string };

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isConfigured = Boolean(cfg.apiKey && cfg.projectId && cfg.appId);

/** One submission per minute per browser. */
const THROTTLE_MS = 60_000;
/** A human takes longer than this to fill in four fields. */
const MIN_FILL_MS = 3_000;
const THROTTLE_KEY = "vp:lastContactSubmit";

function clean(v: string, max: number) {
  return v.trim().slice(0, max);
}

function lastSubmitAt(): number {
  try {
    return Number(localStorage.getItem(THROTTLE_KEY)) || 0;
  } catch {
    return 0;
  }
}

function markSubmitted() {
  try {
    localStorage.setItem(THROTTLE_KEY, String(Date.now()));
  } catch {
    /* private mode: throttling is a nicety, not a control */
  }
}

export async function submitContactRequest(
  input: ContactRequest,
): Promise<SubmitResult> {
  /*
   * Three cheap bot filters before anything is written. None of them are
   * security, since a determined script can skip the page entirely. They
   * exist to keep casual spam from eating the free Firestore write quota,
   * which is the only thing here that could ever cost money. The real
   * controls are in firestore.rules.
   */
  if (input.website && input.website.trim()) {
    // Honeypot filled. Report success so the bot does not learn anything.
    return { ok: true, stored: false, reason: "rejected" };
  }

  if (input.startedAt && Date.now() - input.startedAt < MIN_FILL_MS) {
    return { ok: false, error: "That was too quick. Give it another go." };
  }

  const since = Date.now() - lastSubmitAt();
  if (since < THROTTLE_MS) {
    const wait = Math.ceil((THROTTLE_MS - since) / 1000);
    return { ok: false, error: `Please wait ${wait}s before sending again.` };
  }

  const payload = {
    name: clean(input.name, 120),
    email: clean(input.email, 200),
    company: clean(input.company, 160),
    message: clean(input.message, 4000),
  };

  if (!payload.name || !payload.email || !payload.message) {
    return { ok: false, error: "Name, email and message are required." };
  }

  if (!isConfigured) {
    return { ok: true, stored: false, reason: "not-configured" };
  }

  try {
    const [{ initializeApp, getApps }, firestore] = await Promise.all([
      import("firebase/app"),
      import("firebase/firestore"),
    ]);

    const app = getApps()[0] ?? initializeApp(cfg);
    const db = firestore.getFirestore(app);

    await firestore.addDoc(firestore.collection(db, "contactRequests"), {
      ...payload,
      createdAt: firestore.serverTimestamp(),
      // Handy for triage, and not personally identifying on its own.
      referrer: document.referrer.slice(0, 300) || null,
      userAgent: navigator.userAgent.slice(0, 300),
    });

    markSubmitted();
    return { ok: true, stored: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: message };
  }
}
