import type { ComponentType, SVGProps } from "react";
import { FaAws, FaBitbucket, FaGithub, FaGitlab } from "react-icons/fa";
import { VscAzure } from "react-icons/vsc";
import {
  SiDocker,
  SiDjango,
  SiFastapi,
  SiGo,
  SiGooglecloud,
  SiKubernetes,
  SiNextdotjs,
  SiNodedotjs,
  SiPnpm,
  SiPostgresql,
  SiPulumi,
  SiRedis,
  SiRubyonrails,
  SiSpring,
  SiTerraform,
} from "react-icons/si";

export type BrandKey =
  | "aws"
  | "gcp"
  | "azure"
  | "kubernetes"
  | "docker"
  | "terraform"
  | "pulumi"
  | "github"
  | "gitlab"
  | "bitbucket"
  | "postgresql"
  | "redis"
  | "nextjs"
  | "node"
  | "pnpm"
  | "django"
  | "fastapi"
  | "rails"
  | "go"
  | "spring";

type Brand = {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  /** Official brand colour, used where identity matters. */
  hex: string;
};

/**
 * Real vendor marks rather than abstract shapes. Sourced from react-icons
 * (Simple Icons + Font Awesome), so they ship with the bundle and need no
 * network at runtime.
 *
 * All marks are the trademarks of their respective owners and are used here
 * only to identify the platform or tool being referred to.
 */
export const BRANDS: Record<BrandKey, Brand> = {
  aws: { Icon: FaAws, label: "AWS", hex: "#FF9900" },
  gcp: { Icon: SiGooglecloud, label: "Google Cloud", hex: "#4285F4" },
  azure: { Icon: VscAzure, label: "Azure", hex: "#0089D6" },
  kubernetes: { Icon: SiKubernetes, label: "Kubernetes", hex: "#326CE5" },
  docker: { Icon: SiDocker, label: "Docker", hex: "#2496ED" },
  terraform: { Icon: SiTerraform, label: "Terraform", hex: "#844FBA" },
  pulumi: { Icon: SiPulumi, label: "Pulumi", hex: "#8A3391" },
  github: { Icon: FaGithub, label: "GitHub", hex: "#FFFFFF" },
  gitlab: { Icon: FaGitlab, label: "GitLab", hex: "#FC6D26" },
  bitbucket: { Icon: FaBitbucket, label: "Bitbucket", hex: "#2684FF" },
  postgresql: { Icon: SiPostgresql, label: "PostgreSQL", hex: "#4169E1" },
  redis: { Icon: SiRedis, label: "Redis", hex: "#FF4438" },
  nextjs: { Icon: SiNextdotjs, label: "Next.js", hex: "#FFFFFF" },
  node: { Icon: SiNodedotjs, label: "Node.js", hex: "#5FA04E" },
  pnpm: { Icon: SiPnpm, label: "pnpm", hex: "#F69220" },
  django: { Icon: SiDjango, label: "Django", hex: "#44B78B" },
  fastapi: { Icon: SiFastapi, label: "FastAPI", hex: "#009688" },
  rails: { Icon: SiRubyonrails, label: "Ruby on Rails", hex: "#D30001" },
  go: { Icon: SiGo, label: "Go", hex: "#00ADD8" },
  spring: { Icon: SiSpring, label: "Spring Boot", hex: "#6DB33F" },
};

/**
 * Renders a vendor mark. `tone` picks how much identity to show: "brand"
 * uses the official colour, "mono" keeps the page's greyscale discipline.
 */
export function BrandLogo({
  brand,
  className,
  tone = "brand",
  style,
}: {
  brand: BrandKey;
  className?: string;
  tone?: "brand" | "mono";
  style?: React.CSSProperties;
}) {
  const { Icon, label, hex } = BRANDS[brand];
  return (
    <Icon
      className={className}
      role="img"
      aria-label={label}
      style={{ color: tone === "brand" ? hex : undefined, ...style }}
    />
  );
}
