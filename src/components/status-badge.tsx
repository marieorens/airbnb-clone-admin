const styles: Record<string, string> = {
  admin: "bg-[#DCFCE7] text-[#166534]",
  host: "bg-[#E0F2FE] text-[#0369A1]",
  guest: "bg-[#F1F5F9] text-[#475569]",
  complete: "bg-[#DCFCE7] text-[#166534]",
  incomplet: "bg-[#FEE2E2] text-[#991B1B]",
  booking: "bg-[#E0F2FE] text-[#0369A1]",
  rent: "bg-[#F0EFFF] text-[#625BFF]",
  sale: "bg-[#FEF3C7] text-[#92400E]",
  lead: "bg-[#F1F5F9] text-[#475569]",
  published: "bg-[#DCFCE7] text-[#166534]",
  confirmed: "bg-[#DCFCE7] text-[#166534]",
  paid: "bg-[#DCFCE7] text-[#166534]",
  pending_review: "bg-[#FEF3C7] text-[#92400E]",
  pending_payment: "bg-[#FEF3C7] text-[#92400E]",
  draft: "bg-[#F1F5F9] text-[#475569]",
  suspended: "bg-[#FEE2E2] text-[#991B1B]",
  archived: "bg-[#E5E7EB] text-[#374151]",
  refunded: "bg-[#FFE4E6] text-[#9F1239]",
  failed: "bg-[#FEE2E2] text-[#991B1B]",
  completed: "bg-[#DBEAFE] text-[#1D4ED8]",
  cancelled_by_guest: "bg-[#FEE2E2] text-[#991B1B]",
  cancelled_by_host: "bg-[#FEE2E2] text-[#991B1B]",
};

export function StatusBadge({ value }: { value: string }) {
  return (
    <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${styles[value] ?? styles.guest}`}>
      {value}
    </span>
  );
}
