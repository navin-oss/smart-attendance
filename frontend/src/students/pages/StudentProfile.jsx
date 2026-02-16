import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMyStudentProfile } from "../../api/auth.js";
import {
  fetchAvailableSubjects,
  addSubjectToStudent,
  removeSubjectFromStudent,
  fetchMySubjects
} from "../../api/students.js";

import {
  ArrowLeft,
  Upload,
  Plus,
  CheckCircle,
  Camera,
  Edit2,
} from "lucide-react";
import StudentNavigation from "../components/StudentNavigation";
import { uploadFaceImage } from "../../api/students";
import SubjectAttendanceCard from "../../components/SubjectAttendanceCard";

export default function StudentProfile() {
  const [open, setOpen] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["myStudentProfile"],
    queryFn: fetchMyStudentProfile,
    retry: false,
  });

  // Fetch detailed subjects
  const { data: mySubjects, isLoading: subjectsLoading } = useQuery({
    queryKey: ["mySubjects"],
    queryFn: fetchMySubjects,
  });

  const { data: availableSubjects } = useQuery({
    queryKey: ["availableSubjects"],
    queryFn: fetchAvailableSubjects,
    enabled: open,
  });

  const fileRef = useRef(null);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: uploadFaceImage,
    onSuccess: () => {
      queryClient.invalidateQueries(["myStudentProfile"]);
    },
  });

  const addSubjectMutation = useMutation({
    mutationFn: addSubjectToStudent,
    onSuccess: () => {
      queryClient.invalidateQueries(["myStudentProfile"]);
      queryClient.invalidateQueries(["mySubjects"]);
      setOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: removeSubjectFromStudent,
    onSuccess: () => {
      queryClient.invalidateQueries(["myStudentProfile"]);
      queryClient.invalidateQueries(["mySubjects"]);
    },
  });

  if (isLoading || subjectsLoading) return <div className="p-8 text-[var(--text-main)]">Loading Profile...</div>;
  if (isError) {
    return (
      <div className="p-8 text-red-500">
        Error loading profile: {error?.message || "Please login"}
      </div>
    );
  }
  if (!data) return <div className="p-8 text-[var(--text-main)]">No Profile found..</div>;

  const img = data.image_url;

  // Calculate Weighted Overall Attendance
  const subjectsData = mySubjects || [];
  const totalPresent = subjectsData.reduce((acc, sub) => acc + (sub.attended || 0), 0);
  const totalClasses = subjectsData.reduce((acc, sub) => acc + (sub.total || 0), 0);
  const overallPercentage = totalClasses > 0 ? (totalPresent / totalClasses) * 100 : 0;

  // Status check
  const isOverallOnTrack = overallPercentage >= 75;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col md:flex-row font-sans text-[var(--text-main)]">
      {/* 1. Sidebar */}
      <StudentNavigation activePage="profile" />

      {/* 2. Main Content */}
      <main className="flex-1 md:ml-64 p-6 md:p-8 pb-24 md:pb-8 animate-in fade-in duration-500">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <button className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors text-[var(--text-body)] cursor-pointer">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-main)]">Profile</h2>
              <p className="text-[var(--text-body)] text-sm">
                Upload your face image and review your details
              </p>
            </div>
          </div>

          {/* Card 1: Personal Details */}
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-sm p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <div className="relative group cursor-pointer" onClick={() => fileRef.current.click()}>
                <div className="w-24 h-24 rounded-full bg-[var(--bg-secondary)] border-4 border-[var(--bg-card)] shadow-sm overflow-hidden">
                  <img
                    src={img}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white w-6 h-6" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left space-y-2 w-full">
                <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start">
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text-main)]">
                      {data.name || "John"}
                    </h3>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                      <span className="bg-[var(--primary)] text-[var(--text-on-primary)] text-[10px] font-bold px-2 py-0.5 rounded">
                        Roll no: {data.roll || "21CS045"}
                      </span>
                    </div>
                  </div>
                  <button className="text-xs font-medium text-[var(--text-body)] hover:text-[var(--primary)] hover:bg-[var(--bg-secondary)] px-3 py-1.5 rounded-lg transition mt-3 sm:mt-0 border border-[var(--border-color)] flex items-center gap-2 cursor-not-allowed">
                    <Edit2 size={12} />
                    Edit details
                  </button>
                </div>

                <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-[var(--text-body)] pt-2">
                  <div className="flex items-center gap-1">
                    <span className="opacity-70">Year:</span>
                    <span className="font-medium text-[var(--text-main)]">
                      {data.year || "1st"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="opacity-70">Branch:</span>
                    <span className="font-medium text-[var(--text-main)]">
                      {(data.branch || "").toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="opacity-70">Email:</span>
                    <span className="font-medium text-[var(--text-main)]">
                      {data.email || "student@example.edu"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            hidden
            onChange={(e) => {
              if (e.target.files[0]) {
                uploadMutation.mutate(e.target.files[0]);
              }
            }}
          />

          {/* Card 2: Face Image Upload */}
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-sm p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-base font-bold text-[var(--text-main)]">
                  Face image for attendance
                </h4>
                <p className="text-xs text-[var(--text-body)] mt-1 max-w-md leading-relaxed">
                  Upload a clear, high-quality photo. This will be used for face
                  recognition during attendance.
                </p>
              </div>
              {img ? (
                <div className="flex flex-col items-center">
                  <img
                    src={img}
                    alt="Face preview"
                    className="w-20 h-20 object-cover border border-[var(--border-color)] shadow-sm rounded-md"
                  />

                  <button
                    onClick={() => fileRef.current.click()}
                    className="mt-2 text-xs font-medium text-[var(--primary)] underline hover:text-[var(--primary-hover)] cursor-pointer"
                  >
                    Replace photo
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current.click()}
                  className="flex items-center gap-2 px-4 py-2 border border-[var(--border-color)] rounded-xl text-xs font-bold uppercase tracking-wide hover:bg-[var(--bg-secondary)] transition shadow-sm active:scale-95 text-[var(--text-body)] cursor-pointer"
                >
                  <Upload size={14} />
                  Upload photo
                </button>
              )}
            </div>
            <div className="bg-[var(--bg-secondary)] text-[var(--text-body)] text-[10px] px-3 py-2 rounded-lg inline-block font-medium border border-[var(--border-color)]">
              Tips: Use good lighting, look straight at the camera, avoid masks,
              caps, or filters.
            </div>
          </div>

          {/* Card 3: Attendance Summary (Weighted) */}
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-sm p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-base font-bold text-[var(--text-main)]">
                Attendance summary
              </h4>
              <span className="bg-[var(--primary)] text-[var(--text-on-primary)] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                This semester
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end text-sm mb-1">
                <span className="text-[var(--text-body)] font-medium">
                  Overall percentage
                </span>
                <span className="font-bold text-[var(--text-main)] text-lg">
                  {overallPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="h-3 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    isOverallOnTrack ? "bg-emerald-500" : "bg-red-500"
                  }`}
                  style={{ width: `${Math.min(100, overallPercentage)}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-xs text-[var(--text-body)] uppercase font-bold tracking-wide">
                  Classes attended
                </p>
                <p className="text-xl font-bold text-[var(--text-main)] mt-1">
                  {totalPresent}
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-body)] uppercase font-bold tracking-wide">
                  Total conducted
                </p>
                <p className="text-xl font-bold text-[var(--text-main)] mt-1">
                  {totalClasses}
                </p>
              </div>
            </div>

            <div
              className={`px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-bold shadow-sm ${
                isOverallOnTrack
                  ? "bg-emerald-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              <CheckCircle size={18} className="text-white" />
              {isOverallOnTrack ? "On track for finals" : "Attendance low"}
            </div>
          </div>

          {/* Card 4: Subjects Grid */}
          {open && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-[var(--bg-card)] rounded-xl p-6 w-80 space-y-4 border border-[var(--border-color)]">
                <h3 className="font-bold text-lg text-[var(--text-main)]">Add Subject</h3>

                {availableSubjects?.map((sub) => (
                  <button
                    key={sub._id}
                    onClick={() => addSubjectMutation.mutate(sub._id)}
                    className="w-full text-left px-4 py-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-main)] transition-colors"
                  >
                    {sub.name}
                  </button>
                ))}

                <button
                  onClick={() => setOpen(false)}
                  className="text-sm text-[var(--text-body)] hover:text-[var(--text-main)]"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-base font-bold text-[var(--text-main)]">
                  Subjects
                </h4>
                <p className="text-xs text-[var(--text-body)] mt-1 max-w-sm leading-relaxed">
                  Keep your current subjects up to date for accurate attendance
                  reports.
                </p>
              </div>

              <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 border border-[var(--border-color)] rounded-lg text-xs font-bold hover:bg-[var(--bg-secondary)] transition uppercase tracking-wide text-[var(--text-body)] cursor-pointer"
              >
                <Plus size={14} />
                Add subject
              </button>
            </div>

            {/* Grid of Cards */}
            {subjectsData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjectsData.map((sub) => (
                  <SubjectAttendanceCard
                    key={sub.id || sub._id}
                    subject={sub}
                    onDelete={(id) => {
                         const ok = window.confirm(`Delete subject ${sub.name}?`);
                         if(ok) deleteMutation.mutate(id);
                    }}
                  />
                ))}
              </div>
            ) : (
                // Empty state
                <div className="text-center py-12 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] border-dashed">
                    <p className="text-[var(--text-body)]">No subjects enrolled yet.</p>
                    <button
                        onClick={() => setOpen(true)}
                        className="text-[var(--primary)] text-sm font-bold mt-2 hover:underline cursor-pointer"
                    >
                        Enroll in a subject
                    </button>
                </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
