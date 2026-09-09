import type { Answers } from "./cost";
import { DEFAULT_ANSWERS } from "./cost";
import type { CloudId, ModeId } from "./data";

export const STEPS = [
  { id: "repo", label: "Repository", hint: "Source and mode" },
  { id: "cloud", label: "Cloud", hint: "Account and region" },
  { id: "scan", label: "Scan", hint: "Code and secrets" },
  { id: "sizing", label: "Sizing", hint: "Four questions" },
  { id: "design", label: "Design", hint: "Diagram and cost" },
  { id: "deploy", label: "Deploy", hint: "Provision and verify" },
] as const;

export type StepId = (typeof STEPS)[number]["id"];

export type RunState = {
  repo: string;
  branch: string;
  mode: ModeId;
  cloud: CloudId;
  region: string;
  connected: boolean;
  scanned: boolean;
  answers: Answers;
  approved: boolean;
  deployed: boolean;
};

export const INITIAL_RUN: RunState = {
  repo: "acme/checkout-api",
  branch: "main",
  mode: "auto",
  cloud: "aws",
  region: "us-east-1",
  connected: false,
  scanned: false,
  answers: DEFAULT_ANSWERS,
  approved: false,
  deployed: false,
};

export const SAMPLE_REPOS = [
  {
    name: "acme/checkout-api",
    desc: "Next.js storefront with a Postgres order service",
    lang: "TypeScript",
    size: "1,284 files",
  },
  {
    name: "acme/ml-inference",
    desc: "FastAPI model server with a Redis job queue",
    lang: "Python",
    size: "412 files",
  },
  {
    name: "acme/events-pipeline",
    desc: "Go consumer writing to object storage",
    lang: "Go",
    size: "196 files",
  },
];
