import type { Risk as RiskLevel } from "@/data/types";

export const RISK_LABEL: Record<RiskLevel, string> = {
  low: "Mostly reads",
  med: "Can edit your data",
  high: "Can send, pay, or change live systems",
};

export function Risk({ level }: { level: RiskLevel }) {
  return (
    <span className="risk">
      <i className="dot" data-r={level} />
      {RISK_LABEL[level]}
    </span>
  );
}
