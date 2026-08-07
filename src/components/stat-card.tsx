import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-[8px] border border-[#E2E8F0] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#64748B]">{label}</span>
        <Icon className="text-[#0EA5E9]" size={20} />
      </div>
      <div className="mt-3 text-2xl font-bold">{value}</div>
    </div>
  );
}
