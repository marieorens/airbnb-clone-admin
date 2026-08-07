export function ErrorBanner({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <div className="mb-5 rounded-[12px] border border-[#FCA5A5] bg-[#FEF2F2] p-4 text-sm font-semibold text-[#991B1B]">
      {message}
    </div>
  );
}
