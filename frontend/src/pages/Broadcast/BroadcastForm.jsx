import React, { useState } from "react";
import { Megaphone, Send, AlertCircle, CheckCircle } from "lucide-react";

export default function BroadcastForm({ title, setTitle, message, setMessage }) {
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // success | error

  const isValid = title.trim() !== "" && message.trim() !== "" && selectedClass !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      setLoading(true);
      setStatus(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Broadcast sent:", { title, message, selectedClass });
      setStatus("success");

      // Reset form after delay
      setTimeout(() => {
        setTitle("");
        setMessage("");
        setSelectedClass("");
        setStatus(null);
      }, 3000);

    } catch (error) {
      console.error("Broadcast failed", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-[var(--bg-secondary)] rounded-full">
          <Megaphone className="text-[var(--primary)]" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[var(--text-main)]">Broadcast Message</h2>
          <p className="text-sm text-[var(--text-body)]">Send announcements to students</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Class Selection */}
        <div className="space-y-1.5">
          <label htmlFor="target-class" className="text-sm font-semibold text-[var(--text-main)]">Target Audience</label>
          <select
            id="target-class"
            className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all appearance-none cursor-pointer"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Select a class...</option>
            <option value="all">All Students</option>
            <option value="10A">Grade 10A</option>
            <option value="10B">Grade 10B</option>
            <option value="11A">Grade 11A</option>
            <option value="11C">Grade 11C</option>
          </select>
        </div>

        {/* Title Input */}
        <div className="space-y-1.5">
          <label htmlFor="broadcast-title" className="text-sm font-semibold text-[var(--text-main)]">Title</label>
          <input
            id="broadcast-title"
            type="text"
            placeholder="e.g. Exam Schedule Change"
            className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all placeholder:text-[var(--text-body)]"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Message Input */}
        <div className="space-y-1.5">
          <label htmlFor="broadcast-message" className="text-sm font-semibold text-[var(--text-main)]">Message Content</label>
          <textarea
            id="broadcast-message"
            rows={6}
            placeholder="Type your announcement here..."
            className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all placeholder:text-[var(--text-body)] resize-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {/* Status Messages */}
        {status === "success" && (
          <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2">
            <CheckCircle size={16} />
            Broadcast sent successfully!
          </div>
        )}

        {status === "error" && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            Failed to send broadcast. Please try again.
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isValid || loading}
          className="w-full py-3 px-6 rounded-xl font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] shadow-md hover:shadow-lg transform active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="flex items-center gap-2">Sending...</span>
          ) : (
            <>
              <Send size={18} />
              Send Broadcast
            </>
          )}
        </button>

      </form>
    </div>
  );
}
