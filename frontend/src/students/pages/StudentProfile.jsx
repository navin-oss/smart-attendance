import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMyStudentProfile } from "../../api/auth.js";
import { 
  ArrowLeft, 
  Upload, 
  Plus, 
  CheckCircle, 
  BookOpen, 
  Mail, 
  Phone, 
  MapPin, 
  Camera,
  Edit2,
  Home,
  TrendingUp,
  User
} from "lucide-react";
import StudentNavigation from "../components/StudentNavigation"
import { Link } from "react-router-dom";

export default function StudentProfile() {
  const {data, isLoading, isError, error} = useQuery({
    queryKey: ["myStudentProfile"],
    queryFn: fetchMyStudentProfile,
    retry: false,
  });

  if (isLoading) return <div>Loading Profile...</div>;
  if (isError){
    return <div>Error loading profile: {error?.message || "Please login"}</div>;
  }
  if(!data) return <div>No Profile found..</div>;

  const {student, class: classDoc, professor, attendance_summary} = data;
  console.log(data)


  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans text-slate-800">
      
      {/* 1. Sidebar */}
      <StudentNavigation activePage="profile" />


      {/* 2. Main Content */}
      <main className="flex-1 md:ml-64 p-6 md:p-8 pb-24 md:pb-8 animate-in fade-in duration-500">
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Profile</h2>
              <p className="text-slate-500 text-sm">Upload your face image and review your details</p>
            </div>
          </div>

          {/* Card 1: Personal Details */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-sm overflow-hidden">
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya" 
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
                    <h3 className="text-xl font-bold text-slate-900">{data.name || "John"}</h3>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                      <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">Roll no: {data.roll || "21CS045"}</span>
                      <span className="text-sm text-slate-500">Computer Science</span>
                    </div>
                  </div>
                  <button className="text-xs font-medium text-slate-500 hover:text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition mt-3 sm:mt-0 border border-gray-200 flex items-center gap-2">
                    <Edit2 size={12} />
                    Edit details
                  </button>
                </div>
                
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-slate-600 pt-2">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">Year:</span>
                    <span className="font-medium text-slate-800">{data.year || "1st"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">Branch:</span>
                    <span className="font-medium text-slate-800">{(data.branch).toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">Email:</span>
                    <span className="font-medium text-slate-800">{data.email || "ananya@example.edu"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Face Image Upload */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-base font-bold text-slate-800">Face image for attendance</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md leading-relaxed">
                  Upload a clear, high-quality photo. This will be used for face recognition during attendance.
                </p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-wide hover:bg-gray-50 transition shadow-sm active:scale-95 text-slate-600">
                <Upload size={14} />
                Upload photo
              </button>
            </div>
            <div className="bg-gray-50 text-slate-500 text-[10px] px-3 py-2 rounded-lg inline-block font-medium border border-gray-100">
              Tips: Use good lighting, look straight at the camera, avoid masks, caps, or filters.
            </div>
          </div>

          {/* Card 3: Attendance Summary */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-base font-bold text-slate-800">Attendance summary</h4>
              <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">This semester</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end text-sm mb-1">
                <span className="text-slate-500 font-medium">Overall percentage</span>
                <span className="font-bold text-slate-900 text-lg">{data.attendance.percentage}</span>
              </div>
              <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-[#10B981] rounded-full`}
                  style={{ width: `${data.attendance.percentage}%` }}
                ></div>

              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wide">Classes attended</p>
                <p className="text-xl font-bold text-slate-800 mt-1">{data.attendance.present}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wide">Total conducted</p>
                <p className="text-xl font-bold text-slate-800 mt-1">{data.attendance.present + data.attendance.absent}</p>
              </div>
            </div>

            <div className="bg-[#10B981] text-white px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-bold shadow-sm">
              <CheckCircle size={18} className="text-white" />
              On track for finals
            </div>
          </div>

          {/* Card 4: Subjects */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-base font-bold text-slate-800">Subjects</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
                  Keep your current subjects up to date for accurate attendance reports.
                </p>
              </div>
              <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold hover:bg-gray-50 transition uppercase tracking-wide text-slate-600">
                <Plus size={14} />
                Add subject
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {data.subjects.map((sub) => (
                <div key={sub} className="bg-blue-500 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm shadow-blue-200">
                  <BookOpen size={14} className="opacity-80" />
                  {sub}
                </div>
              ))}
              <button className="px-4 py-2 rounded-full text-xs font-bold text-slate-400 bg-gray-50 hover:bg-gray-100 flex items-center gap-1 transition">
                <Plus size={14} /> Add more
              </button>
            </div>
          </div>

        </div>
      </main>
      
    </div>
  );
}