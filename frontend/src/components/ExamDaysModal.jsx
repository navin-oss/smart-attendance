import React, { useState, useEffect } from "react";
import { X, Calendar, Plus, Edit2, Trash2, Save, Loader2 } from "lucide-react";
import { getExams, addExam, updateExam, deleteExam } from "../api/schedule";

export default function ExamDaysModal({ onClose }) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ date: "", name: "" });
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const data = await getExams();
      // Sort by date descending
      const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setExams(sorted);
    } catch (err) {
      console.error("Failed to fetch exams:", err);
      setError("Failed to load exam days.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date || !formData.name) return;

    try {
      setSubmitting(true);
      setError(null);

      if (editingId) {
        // Update existing
        const updated = await updateExam(editingId, formData);
        setExams((prev) =>
          prev.map((exam) => (exam.id === editingId ? updated : exam)).sort((a, b) => new Date(b.date) - new Date(a.date))
        );
      } else {
        // Add new
        const newExam = await addExam(formData);
        setExams((prev) => [...prev, newExam].sort((a, b) => new Date(b.date) - new Date(a.date)));
      }

      // Reset form
      setFormData({ date: "", name: "" });
      setEditingId(null);
    } catch (err) {
      console.error("Failed to save exam:", err);
      setError("Failed to save exam. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (exam) => {
    setFormData({
      date: exam.date ? exam.date.split("T")[0] : "",
      name: exam.name || "",
    });
    setEditingId(exam.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exam day?")) return;

    try {
      await deleteExam(id);
      setExams((prev) => prev.filter((exam) => exam.id !== id));
    } catch (err) {
      console.error("Failed to delete exam:", err);
      alert("Failed to delete exam.");
    }
  };

  const handleCancelEdit = () => {
    setFormData({ date: "", name: "" });
    setEditingId(null);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-[var(--border-color)]">
          <div>
            <h2 className="text-xl font-bold text-[var(--text-main)]">Exam Days</h2>
            <p className="text-sm text-[var(--text-body)]">Manage exam schedule and holidays</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[var(--text-body)] hover:text-[var(--text-main)] hover:bg-[var(--bg-secondary)] rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-[var(--bg-secondary)] p-4 rounded-xl space-y-4 border border-[var(--border-color)]">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-sm text-[var(--text-main)]">
                {editingId ? "Edit Exam Day" : "Add New Exam Day"}
              </h3>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-xs text-[var(--text-body)] hover:underline"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-body)]">Date</label>
                <div className="relative">
                  <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 ring-[var(--primary)] pl-9"
                  />
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-body)]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-body)]">Exam Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Midterm Physics"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 ring-[var(--primary)]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition flex items-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : editingId ? (
                  <Save size={16} />
                ) : (
                  <Plus size={16} />
                )}
                {editingId ? "Update Exam" : "Add Exam"}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}

          {/* List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-[var(--text-main)]">Upcoming Exams</h3>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 size={24} className="animate-spin text-[var(--primary)]" />
              </div>
            ) : exams.length === 0 ? (
              <div className="text-center py-8 text-[var(--text-body)] border-2 border-dashed border-[var(--border-color)] rounded-xl">
                <Calendar size={24} className="mx-auto mb-2 opacity-50" />
                <p>No exams scheduled yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {exams.map((exam) => (
                  <div
                    key={exam.id}
                    className={`flex items-center justify-between p-3 rounded-xl border border-[var(--border-color)] transition group ${
                      editingId === exam.id ? "bg-[var(--primary)]/5 border-[var(--primary)]" : "bg-[var(--bg-card)] hover:border-[var(--primary)]/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-[var(--bg-secondary)] w-12 h-12 rounded-lg flex flex-col items-center justify-center text-[var(--text-main)] border border-[var(--border-color)]">
                        <span className="text-[10px] font-bold uppercase text-[var(--text-body)]">
                          {new Date(exam.date).toLocaleString('default', { month: 'short' })}
                        </span>
                        <span className="text-lg font-bold leading-none">
                          {new Date(exam.date).getDate()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-[var(--text-main)]">{exam.name}</h4>
                        <p className="text-xs text-[var(--text-body)]">
                          {new Date(exam.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(exam)}
                        className="p-2 text-[var(--text-body)] hover:text-[var(--primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(exam.id)}
                        className="p-2 text-[var(--text-body)] hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]/30 rounded-b-2xl">
          <p className="text-xs text-[var(--text-body)] text-center">
            Classes on these days will be automatically hidden from the schedule.
          </p>
        </div>

      </div>
    </div>
  );
}
