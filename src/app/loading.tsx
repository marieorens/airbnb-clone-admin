import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="admin-route-loading fixed inset-x-0 top-0 z-[70]">
      <div className="h-1 w-full overflow-hidden bg-[#E4E7EC]">
        <div className="h-full w-1/3 animate-[route-progress_0.9s_ease-in-out_infinite] rounded-full bg-[#625BFF]" />
      </div>
      <div className="pointer-events-none fixed inset-0 z-[69] flex items-start justify-center bg-white/35 pt-24 backdrop-blur-[1px]">
        <div className="flex items-center gap-2 rounded-full border border-[#E4E7EC] bg-white px-4 py-2 text-xs font-semibold text-[#667085] shadow-lg">
          <Loader2 size={14} className="animate-spin text-[#625BFF]" />
          Chargement...
        </div>
      </div>
    </div>
  );
}
