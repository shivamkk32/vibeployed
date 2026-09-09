import type { LucideIcon } from "lucide-react";
import type { BrandKey } from "../components/ui/BrandLogo";
import {
  Boxes,
  Cloud,
  Container,
  Database,
  Gauge,
  GitBranch,
  Globe,
  HardDrive,
  KeyRound,
  Layers,
  Network,
  Radar,
  ScanLine,
  Server,
  Shield,
  Sparkles,
  Wallet,
  Workflow,
  Zap,
} from "lucide-react";

/* ============================ Cloud providers =========================== */

export type CloudId = "aws" | "gcp" | "azure";

export type CloudProvider = {
  id: CloudId;
  name: string;
  short: string;
  /** Vendor mark shown on selection cards. */
  brand: BrandKey;
  /** Brand-ish accent used for gradients and glows. */
  accent: string;
  rgb: string;
  regions: string[];
  /** Rough multiplier applied to the baseline estimate. */
  priceIndex: number;
  compute: string;
  db: string;
  cdn: string;
};

export const CLOUDS: CloudProvider[] = [
  {
    id: "aws",
    name: "Amazon Web Services",
    short: "AWS",
    brand: "aws",
    accent: "#d4d4d4",
    rgb: "212,212,212",
    regions: ["us-east-1", "eu-west-1", "ap-south-1", "ap-southeast-2"],
    priceIndex: 1,
    compute: "ECS Fargate",
    db: "Aurora Serverless v2",
    cdn: "CloudFront",
  },
  {
    id: "gcp",
    name: "Google Cloud Platform",
    short: "GCP",
    brand: "gcp",
    accent: "#a3a3a3",
    rgb: "163,163,163",
    regions: [
      "us-central1",
      "europe-west1",
      "asia-south1",
      "australia-southeast1",
    ],
    priceIndex: 0.93,
    compute: "Cloud Run",
    db: "Cloud SQL (Postgres)",
    cdn: "Cloud CDN",
  },
  {
    id: "azure",
    name: "Microsoft Azure",
    short: "Azure",
    brand: "azure",
    accent: "#7a7a7a",
    rgb: "122,122,122",
    regions: ["eastus", "westeurope", "centralindia", "australiaeast"],
    priceIndex: 1.06,
    compute: "Container Apps",
    db: "Azure DB for Postgres",
    cdn: "Azure Front Door",
  },
];

export const cloudById = (id: CloudId) =>
  CLOUDS.find((c) => c.id === id) ?? CLOUDS[0];

/* =============================== Modes ================================= */

export type ModeId = "auto" | "manual" | "audit";

export type Mode = {
  id: ModeId;
  name: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  rgb: string;
  bullets: string[];
};

export const MODES: Mode[] = [
  {
    id: "auto",
    name: "Auto",
    tagline: "Point at a repo. Walk away.",
    description:
      "Vibeployed reads the codebase, picks the service topology, sizes it against your answers on traffic and budget, then provisions the whole stack behind a single reviewed plan.",
    icon: Sparkles,
    accent: "#e5e5e5",
    rgb: "229,229,229",
    bullets: [
      "Framework and runtime detected from source",
      "Topology and instance sizing chosen for you",
      "Secure-by-default network, IAM and secrets",
      "One approval gate before anything is created",
    ],
  },
  {
    id: "manual",
    name: "Manual",
    tagline: "Every knob, still guard-railed.",
    description:
      "You drive the architecture. Vibeployed keeps validating each choice against security policy and the live cost model, and blocks the shapes that quietly become incidents.",
    icon: Workflow,
    accent: "#f5f5f5",
    rgb: "245,245,245",
    bullets: [
      "Swap any service in the generated topology",
      "Pin regions, instance classes and scaling floors",
      "Policy violations surface inline, before apply",
      "Export the finished plan as Terraform or Pulumi",
    ],
  },
  {
    id: "audit",
    name: "Audit",
    tagline: "Connect only. Deploy nothing.",
    description:
      "Attach a read-only role to an account you already run. Vibeployed maps what exists, flags the misconfigurations that lead to breaches, and finds the spend nobody approved.",
    icon: Radar,
    accent: "#bdbdbd",
    rgb: "189,189,189",
    bullets: [
      "Read-only credentials, zero write permissions",
      "Public buckets, open ports, over-broad IAM",
      "Idle and orphaned resources still being billed",
      "Anomaly alerts before the invoice arrives",
    ],
  },
];

/* ============================== Pipeline =============================== */

export type PipelineStep = {
  n: string;
  title: string;
  blurb: string;
  icon: LucideIcon;
  accent: string;
  rgb: string;
  detail: string[];
};

export const PIPELINE: PipelineStep[] = [
  {
    n: "01",
    title: "Connect the repository",
    blurb:
      "Link GitHub, GitLab or Bitbucket, or paste a URL. Read access to one repo is all it takes.",
    icon: GitBranch,
    accent: "#e5e5e5",
    rgb: "229,229,229",
    detail: [
      "OAuth or a deploy key scoped to a single repo",
      "Monorepos supported, choose the package to ship",
      "Branch and build command inferred, always editable",
    ],
  },
  {
    n: "02",
    title: "Attach the cloud account",
    blurb:
      "A short role-assumption handshake. Scope it read-only for an audit, or grant provisioning rights for a deploy.",
    icon: Cloud,
    accent: "#f5f5f5",
    rgb: "245,245,245",
    detail: [
      "Cross-account role, no long-lived keys stored",
      "Permission set shown in full before you approve",
      "Revoke from your own console at any moment",
    ],
  },
  {
    n: "03",
    title: "Scan the code",
    blurb:
      "Static analysis maps your runtime, dependencies, data layer and every secret that should never have been committed.",
    icon: ScanLine,
    accent: "#bdbdbd",
    rgb: "189,189,189",
    detail: [
      "Runtime, framework and build graph detection",
      "Dependency CVEs and licence conflicts",
      "Hardcoded credentials and unsafe defaults",
    ],
  },
  {
    n: "04",
    title: "Answer four questions",
    blurb:
      "Expected traffic, regions, data sensitivity, monthly ceiling. That is the entire questionnaire.",
    icon: Gauge,
    accent: "#9e9e9e",
    rgb: "158,158,158",
    detail: [
      "Plain-language questions, no cloud jargon",
      "Answers drive sizing, redundancy and tiering",
      "Change an answer and the design re-renders live",
    ],
  },
  {
    n: "05",
    title: "Review design and cost",
    blurb:
      "A high-level and a low-level diagram of exactly what will exist, with a line-item monthly estimate beside it.",
    icon: Layers,
    accent: "#c4c4c4",
    rgb: "196,196,196",
    detail: [
      "HLD for the shape, LLD for every resource",
      "Per-service cost with the assumptions shown",
      "Cheaper alternatives suggested where they fit",
    ],
  },
  {
    n: "06",
    title: "Approve, then ship",
    blurb:
      "Nothing is created until you press the button. Then it provisions, with a rollback that actually works.",
    icon: Zap,
    accent: "#ededed",
    rgb: "237,237,237",
    detail: [
      "Infrastructure-as-code generated and version-pinned",
      "Live provisioning log, resource by resource",
      "One-click rollback to the previous known-good state",
    ],
  },
];

/* ============================== Guardrails ============================= */

export const GUARDRAILS = [
  {
    icon: Shield,
    title: "Secure by construction",
    body: "Private subnets, least-privilege roles, encryption at rest and in transit, and no publicly reachable database. That is the default, not a checklist item you forgot.",
    accent: "#bdbdbd",
    rgb: "189,189,189",
  },
  {
    icon: Wallet,
    title: "Bill shock, prevented",
    body: "Every plan carries a ceiling. Autoscaling gets an upper bound, budget alarms are wired at creation, and a runaway service trips a circuit breaker.",
    accent: "#9e9e9e",
    rgb: "158,158,158",
  },
  {
    icon: KeyRound,
    title: "Secrets stay secret",
    body: "Committed keys are caught during the scan, moved into a managed secret store, and injected at runtime. They never land in an image layer or an env file.",
    accent: "#e5e5e5",
    rgb: "229,229,229",
  },
  {
    icon: Radar,
    title: "Drift caught early",
    body: "The account is re-checked continuously. When live infrastructure wanders away from the approved plan, you hear about it, with the diff attached.",
    accent: "#f5f5f5",
    rgb: "245,245,245",
  },
] as const;

/* ========================= Architecture services ======================= */

export type ServiceNode = {
  id: string;
  label: string;
  sub: string;
  icon: LucideIcon;
  accent: string;
  rgb: string;
  /** Position in the HLD lattice. */
  col: number;
  row: number;
};

export const ARCH_NODES: ServiceNode[] = [
  { id: "users", label: "Users", sub: "Global traffic", icon: Globe, accent: "#6b6b6b", rgb: "107,107,107", col: 0, row: 1 },
  { id: "cdn", label: "CDN + WAF", sub: "Edge cache, rules", icon: Network, accent: "#f5f5f5", rgb: "245,245,245", col: 1, row: 1 },
  { id: "lb", label: "Load balancer", sub: "TLS termination", icon: Boxes, accent: "#e5e5e5", rgb: "229,229,229", col: 2, row: 1 },
  { id: "api", label: "API service", sub: "Containers, autoscaled", icon: Container, accent: "#ededed", rgb: "237,237,237", col: 3, row: 0 },
  { id: "worker", label: "Worker pool", sub: "Async jobs, queue-fed", icon: Server, accent: "#d4d4d4", rgb: "212,212,212", col: 3, row: 2 },
  { id: "db", label: "Postgres", sub: "Multi-AZ, encrypted", icon: Database, accent: "#bdbdbd", rgb: "189,189,189", col: 4, row: 0 },
  { id: "cache", label: "Redis", sub: "Sessions, hot keys", icon: Zap, accent: "#9e9e9e", rgb: "158,158,158", col: 4, row: 1 },
  { id: "bucket", label: "Object store", sub: "Private, versioned", icon: HardDrive, accent: "#8a8a8a", rgb: "138,138,138", col: 4, row: 2 },
];

export const ARCH_EDGES: Array<[string, string]> = [
  ["users", "cdn"],
  ["cdn", "lb"],
  ["lb", "api"],
  ["lb", "worker"],
  ["api", "db"],
  ["api", "cache"],
  ["worker", "db"],
  ["worker", "bucket"],
];

/* ============================== Scan model ============================= */

export type Severity = "critical" | "high" | "medium" | "info";

export type ScanFinding = {
  id: string;
  severity: Severity;
  title: string;
  file: string;
  fix: string;
};

export const SCAN_FINDINGS: ScanFinding[] = [
  {
    id: "f1",
    severity: "critical",
    title: "Database URL committed to source control",
    file: ".env.production:14",
    fix: "Move to a managed secret store, inject at runtime",
  },
  {
    id: "f2",
    severity: "high",
    title: "Container image runs as root",
    file: "Dockerfile:22",
    fix: "Add a non-root USER directive before CMD",
  },
  {
    id: "f3",
    severity: "high",
    title: "Object storage bucket would be world-readable",
    file: "infra/storage.tf:8",
    fix: "Block public access, serve through signed URLs",
  },
  {
    id: "f4",
    severity: "medium",
    title: "No upper bound on autoscaling",
    file: "detected from runtime config",
    fix: "Cap replicas at 12 and wire a budget alarm",
  },
  {
    id: "f5",
    severity: "medium",
    title: "Dependency with a known CVE",
    file: "package-lock.json",
    fix: "Bump to the patched minor release",
  },
  {
    id: "f6",
    severity: "info",
    title: "No health endpoint detected",
    file: "src/server.ts",
    fix: "Expose /healthz so the balancer can drain safely",
  },
];

export const SEVERITY_STYLE: Record<
  Severity,
  { label: string; text: string; ring: string; bg: string; dot: string }
> = {
  critical: {
    label: "Critical",
    text: "text-clay-200",
    ring: "ring-clay-400/30",
    bg: "bg-clay-500/10",
    dot: "bg-clay-400",
  },
  high: {
    label: "High",
    text: "text-bronze-200",
    ring: "ring-bronze-400/30",
    bg: "bg-bronze-500/10",
    dot: "bg-bronze-400",
  },
  medium: {
    label: "Medium",
    text: "text-gold-200",
    ring: "ring-gold-400/30",
    bg: "bg-gold-500/10",
    dot: "bg-gold-400",
  },
  info: {
    label: "Info",
    text: "text-white/60",
    ring: "ring-white/15",
    bg: "bg-white/5",
    dot: "bg-white/50",
  },
};

/* ============================ Detected stack =========================== */

export const DETECTED_STACK: Array<{
  label: string;
  value: string;
  brand: BrandKey;
}> = [
  { label: "Runtime", value: "Node 22", brand: "node" },
  { label: "Framework", value: "Next.js 15", brand: "nextjs" },
  { label: "Database", value: "PostgreSQL", brand: "postgresql" },
  { label: "Cache", value: "Redis", brand: "redis" },
  { label: "Packages", value: "pnpm", brand: "pnpm" },
  { label: "Container", value: "Dockerfile", brand: "docker" },
];

/* =============================== FAQ =================================== */

export const FAQ = [
  {
    q: "Do you need write access to my cloud account?",
    a: "Only if you ask us to deploy. Audit mode runs entirely on a read-only role. When you do grant provisioning rights, the exact permission set is shown in full before you approve it, and you revoke it from your own console, not from ours.",
  },
  {
    q: "Where does my source code go?",
    a: "The scan runs in an ephemeral, isolated sandbox and the checkout is destroyed when it finishes. We keep the resulting metadata (languages, dependency graph, findings) and never the source itself.",
  },
  {
    q: "How accurate is the cost estimate?",
    a: "It is built from current provider price lists against the exact resources in the plan, and every assumption behind a line item is shown beside it. Real bills move with real traffic, so treat it as a well-founded projection rather than a quote. The budget ceiling in the plan is enforced either way.",
  },
  {
    q: "Am I locked in to Vibeployed?",
    a: "No. Every plan compiles to standard Terraform or Pulumi that you can export at any point and run yourself. If you walk away, the infrastructure keeps running and the code to manage it is already yours.",
  },
  {
    q: "What happens if a deployment fails midway?",
    a: "Provisioning is transactional per stage. A failed stage halts the run, the log names the resource and the provider error, and rollback returns the account to the previous known-good state rather than leaving half a stack behind.",
  },
  {
    q: "Can I use it on infrastructure I already run?",
    a: "That is exactly what Audit mode is for. Connect an existing account and Vibeployed maps what is live, flags the misconfigurations worth acting on, and surfaces the resources quietly costing you money, without changing a thing.",
  },
];

/* ============================== Pricing ================================ */

export const PRICING = [
  {
    name: "Solo",
    price: 0,
    cadence: "forever",
    blurb: "For the side project that might turn into something.",
    features: [
      "1 connected cloud account",
      "3 deployments per month",
      "Full code scan and design diagrams",
      "Cost estimates and budget alarms",
      "Community support",
    ],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Team",
    price: 49,
    cadence: "per month",
    blurb: "For teams shipping to production on a real schedule.",
    features: [
      "Unlimited cloud accounts",
      "Unlimited deployments",
      "Manual mode with full topology control",
      "Continuous drift and security monitoring",
      "Terraform / Pulumi export",
      "Rollback and deployment history",
    ],
    cta: "Start 14-day trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: null,
    cadence: "talk to us",
    blurb: "For organisations with auditors and a compliance calendar.",
    features: [
      "SSO, SCIM and granular RBAC",
      "Private deployment in your own VPC",
      "Audit evidence export",
      "Custom policy packs",
      "Dedicated support channel",
    ],
    cta: "Book a walkthrough",
    featured: false,
  },
];
