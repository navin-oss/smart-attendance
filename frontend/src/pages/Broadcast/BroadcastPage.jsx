import React, { useState } from "react";
import BroadcastForm from "./BroadcastForm";
import BroadcastPreview from "./BroadcastPreview";

export default function BroadcastPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="w-full max-w-7xl mx-auto p-6 md:p-8 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-main)]">Broadcast Messaging</h1>
        <p className="text-[var(--text-body)] mt-1">Send announcements to specific classes or the entire school.</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* Left: Form */}
        <div className="w-full">
          <BroadcastForm
            title={title}
            setTitle={setTitle}
            message={message}
            setMessage={setMessage}
          />
        </div>

        {/* Right: Preview (Sticky on desktop for better UX) */}
        <div className="w-full lg:sticky lg:top-24 h-auto">
          <BroadcastPreview
            title={title}
            message={message}
          />
        </div>

      </div>
    </div>
  );
}
