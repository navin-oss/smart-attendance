import React from "react";
import { Megaphone } from "lucide-react";

export default function BroadcastPreview({ title, message }) {
  if (!title && !message) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 shadow-sm h-full flex flex-col items-center justify-center text-center opacity-60">
        <Megaphone size={48} className="text-[var(--text-body)] mb-4 opacity-20" />
        <p className="text-[var(--text-body)] text-sm">Preview will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 shadow-sm h-full">
      <h3 className="text-lg font-bold text-[var(--text-main)] mb-4 border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
        <Megaphone size={20} className="text-[var(--primary)]" />
        Preview
      </h3>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-[var(--text-body)] uppercase tracking-wide">Title</label>
          <div className="font-semibold text-[var(--text-main)] text-xl mt-1 break-words">
            {title || <span className="text-[var(--text-body)] italic opacity-50">No title...</span>}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-[var(--text-body)] uppercase tracking-wide">Message</label>
          <div className="text-[var(--text-body)] whitespace-pre-wrap mt-1 break-words leading-relaxed">
            {message || <span className="italic opacity-50">No content...</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
