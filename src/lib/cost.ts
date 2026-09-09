import { cloudById, type CloudId } from "./data";

/* Answers collected from the scaling questionnaire. */
export type Answers = {
  /** Peak requests per second the service should absorb. */
  traffic: number;
  /** Number of regions the workload is served from. */
  regions: number;
  /** Data sensitivity tier. Drives encryption, isolation and backups. */
  sensitivity: "standard" | "sensitive" | "regulated";
  /** Availability target. Drives redundancy. */
  availability: "single" | "multi-az" | "multi-region";
};

export const DEFAULT_ANSWERS: Answers = {
  traffic: 400,
  regions: 1,
  sensitivity: "sensitive",
  availability: "multi-az",
};

export type CostLine = {
  id: string;
  service: string;
  detail: string;
  qty: string;
  monthly: number;
  accent: string;
  rgb: string;
};

const SENSITIVITY_FACTOR: Record<Answers["sensitivity"], number> = {
  standard: 1,
  sensitive: 1.18,
  regulated: 1.44,
};

const AVAILABILITY_FACTOR: Record<Answers["availability"], number> = {
  single: 1,
  "multi-az": 1.55,
  "multi-region": 2.35,
};

/** Replica count the API tier needs to absorb the requested peak. */
export function replicasFor(traffic: number) {
  return Math.max(2, Math.ceil(traffic / 120));
}

/**
 * Derives a line-item monthly estimate from the questionnaire answers.
 * Deliberately transparent: every line shows the quantity it was priced on.
 */
export function estimate(cloud: CloudId, a: Answers): CostLine[] {
  const c = cloudById(cloud);
  const idx = c.priceIndex;
  const avail = AVAILABILITY_FACTOR[a.availability];
  const sens = SENSITIVITY_FACTOR[a.sensitivity];
  const replicas = replicasFor(a.traffic);
  const regions = Math.max(1, a.regions);

  // Egress: peak is not sustained, so bill against an average day at ~15% of
  // peak, 12 KB per response. Expressed in GB, then priced per GB.
  const avgRps = a.traffic * 0.15;
  const egressGb = (avgRps * 2_592_000 * 12) / 1_000_000;

  const lines: CostLine[] = [
    {
      id: "compute",
      service: c.compute,
      detail: "API containers, 1 vCPU / 2 GB",
      qty: `${replicas} replicas x ${regions} region${regions > 1 ? "s" : ""}`,
      monthly: replicas * regions * 27.4 * idx,
      accent: "#ededed",
      rgb: "237,237,237",
    },
    {
      id: "worker",
      service: "Worker pool",
      detail: "Async jobs, queue-driven",
      qty: `${Math.max(1, Math.ceil(replicas / 3))} replicas`,
      monthly: Math.max(1, Math.ceil(replicas / 3)) * 21.8 * idx,
      accent: "#d4d4d4",
      rgb: "212,212,212",
    },
    {
      id: "db",
      service: c.db,
      detail: "Primary + automated backups",
      qty: a.availability === "single" ? "1 instance" : "1 primary + standby",
      monthly: 82 * idx * avail * sens,
      accent: "#bdbdbd",
      rgb: "189,189,189",
    },
    {
      id: "cache",
      service: "Managed Redis",
      detail: "Sessions and hot keys, 2 GB",
      qty: `${regions} node${regions > 1 ? "s" : ""}`,
      monthly: 31 * regions * idx,
      accent: "#9e9e9e",
      rgb: "158,158,158",
    },
    {
      id: "cdn",
      service: c.cdn,
      detail: "Edge cache, TLS, WAF rules",
      qty: `${(egressGb / 1000).toFixed(2)} TB egress`,
      monthly: (18 + egressGb * 0.085) * idx,
      accent: "#f5f5f5",
      rgb: "245,245,245",
    },
    {
      id: "storage",
      service: "Object storage",
      detail: "Private bucket, versioned",
      qty: "250 GB + requests",
      monthly: 9.6 * idx * (a.sensitivity === "regulated" ? 1.3 : 1),
      accent: "#8a8a8a",
      rgb: "138,138,138",
    },
    {
      id: "secrets",
      service: "Secrets + KMS",
      detail: "Managed keys, rotation on",
      qty: "12 secrets",
      monthly: 7.2 * sens,
      accent: "#e5e5e5",
      rgb: "229,229,229",
    },
    {
      id: "observability",
      service: "Logs, metrics, traces",
      detail: "30-day retention",
      qty: `~${Math.round(a.traffic * 0.9)} GB / month`,
      monthly: 14 + a.traffic * 0.042,
      accent: "#6b6b6b",
      rgb: "107,107,107",
    },
  ];

  return lines.map((l) => ({ ...l, monthly: Math.round(l.monthly * 100) / 100 }));
}

export function totalOf(lines: CostLine[]) {
  return lines.reduce((sum, l) => sum + l.monthly, 0);
}

/** Cheaper-shape suggestions surfaced next to the estimate. */
export function savingsHints(a: Answers, total: number) {
  const hints: Array<{ title: string; body: string; saves: number }> = [];

  if (a.availability === "multi-region") {
    hints.push({
      title: "Start multi-AZ, not multi-region",
      body: "Multi-region doubles the data tier for a failure mode most products never hit. Multi-AZ already survives a datacentre going dark.",
      saves: total * 0.24,
    });
  }
  if (a.traffic > 900) {
    hints.push({
      title: "Cache the read path harder",
      body: "At this volume a 70% edge hit rate moves a large share of requests off the origin, and the compute tier shrinks with it.",
      saves: total * 0.13,
    });
  }
  if (a.sensitivity === "standard") {
    hints.push({
      title: "Commit to a 1-year term",
      body: "Steady baseline compute is a good fit for committed-use discounts on the always-on replicas.",
      saves: total * 0.17,
    });
  }
  hints.push({
    title: "Scale the worker pool to zero overnight",
    body: "Queue depth is near zero for roughly eight hours a day. A scheduled floor of zero replicas costs nothing while nothing is queued.",
    saves: total * 0.06,
  });
  hints.push({
    title: "Move cold objects to infrequent-access storage",
    body: "Most uploaded objects are never read again after the first week. A lifecycle rule moves them down a tier automatically.",
    saves: total * 0.04,
  });
  hints.push({
    title: "Trim log retention to 14 days",
    body: "Thirty days of full-fidelity logs is rarely what anyone actually queries. Keep metrics long, keep raw logs short.",
    saves: total * 0.05,
  });

  return hints.slice(0, 3).map((h) => ({ ...h, saves: Math.round(h.saves) }));
}

/* Provisioning log lines replayed during the deploy stage. */
export const DEPLOY_STEPS = [
  "Compiling approved plan to Terraform",
  "Validating provider credentials",
  "Creating VPC and private subnets",
  "Provisioning NAT gateway and route tables",
  "Creating least-privilege IAM roles",
  "Writing secrets to managed key store",
  "Provisioning Postgres primary and standby",
  "Provisioning Redis cache node",
  "Creating private object storage bucket",
  "Building and pushing container image",
  "Deploying API service, 4 replicas",
  "Deploying worker pool, 2 replicas",
  "Attaching load balancer and TLS certificate",
  "Publishing CDN distribution and WAF rules",
  "Wiring budget alarms and scaling ceilings",
  "Running post-deploy health checks",
];
