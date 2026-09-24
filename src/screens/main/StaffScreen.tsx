import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  UserPlus,
  Clock,
  Calendar,
  Shield,
  Star,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Briefcase,
  ChevronRight,
  Sparkles,
  Plus,
  Mail,
  Award,
} from 'lucide-react';

export const StaffScreen: React.FC = () => {
  const { showToast } = useApp();

  const [teamMembers, setTeamMembers] = useState([
    {
      id: 'staff-1',
      name: 'Ramesh Patel',
      role: 'Head Chef & Kitchen Lead',
      rating: 4.9,
      attendance: '100%',
      isOnline: true,
      email: 'ramesh.chef@luckfoods.com',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=120&h=120&q=80',
      shifts: 'Morning Shift',
    },
    {
      id: 'staff-2',
      name: 'Anjali Sharma',
      role: 'Operations & Dispatch Manager',
      rating: 4.9,
      attendance: '98%',
      isOnline: true,
      email: 'anjali.ops@luckfoods.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
      shifts: 'Evening Shift',
    },
    {
      id: 'staff-3',
      name: 'Deepak Kumar',
      role: 'Biryani Master & Tandoor Specialist',
      rating: 4.8,
      attendance: '96%',
      isOnline: true,
      email: 'deepak.k@luckfoods.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
      shifts: 'Morning Shift',
    },
    {
      id: 'staff-4',
      name: 'Kavita Roy',
      role: 'Order Packing & QA Lead',
      rating: 4.7,
      attendance: '100%',
      isOnline: false,
      email: 'kavita.qa@luckfoods.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80',
      shifts: 'Evening Shift',
    },
  ]);

  const handleAddMember = () => {
    showToast('Add Team Member invitation form opened', 'info');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Staff & Operations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage kitchen crew, shifts, attendance, POS access roles, and payroll schedules.
          </p>
        </div>

        <button
          onClick={handleAddMember}
          className="py-2.5 px-4 bg-gradient-to-r from-feedo-500 to-feedo-600 hover:from-feedo-600 hover:to-feedo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-feedo-500/20 flex items-center gap-2 self-start sm:self-auto transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Add Team Member</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Active Staff</span>
          <h3 className="text-3xl font-black text-slate-900">24</h3>
          <span className="text-xs font-bold text-emerald-600">+2 onboarded this week</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Punctuality Rate</span>
          <h3 className="text-3xl font-black text-emerald-600">98.4%</h3>
          <span className="text-xs text-slate-400">On-time biometric clock-in</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Open Shift Requests</span>
          <h3 className="text-3xl font-black text-amber-600">6</h3>
          <span className="text-xs font-bold text-amber-600">Requires Kitchen Action</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly Payroll</span>
          <h3 className="text-3xl font-black text-slate-900">₹1,24,000</h3>
          <span className="text-xs text-slate-400">Processing in 4 days</span>
        </div>
      </div>

      {/* Team Members List & Weekly Work Schedules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Members (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Active Crew & Supervisors</h3>
              <p className="text-xs text-slate-500">Live attendance and performance scores</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {teamMembers.map((member) => (
              <div key={member.id} className="py-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-11 h-11 rounded-2xl object-cover border border-slate-200"
                    />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        member.isOnline ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{member.name}</h4>
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded">
                        ★ {member.rating}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{member.role}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] text-slate-400 uppercase block">Attendance</span>
                    <span className="text-xs font-bold text-emerald-600">{member.attendance}</span>
                  </div>
                  <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-xl">
                    {member.shifts}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hiring Queue Dark Card (1 col) */}
        <div className="bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Hiring Queue
              </h3>
              <span className="text-xs font-bold text-feedo-400 bg-feedo-950 px-2 py-0.5 rounded-full border border-feedo-800">
                2 Candidates
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-feedo-500/20 text-feedo-400 font-bold flex items-center justify-center text-xs">
                    SK
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Suresh Kumar</h4>
                    <p className="text-[11px] text-slate-400">Assistant Tandoor Chef</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
                    PN
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Pooja Nair</h4>
                    <p className="text-[11px] text-slate-400">Front Desk & Dispatch</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          <button
            onClick={() => showToast('Hiring portal opened', 'info')}
            className="w-full py-2.5 bg-feedo-500 hover:bg-feedo-600 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Review Applications →
          </button>
        </div>
      </div>

      {/* Weekly Work Schedules Calendar Grid & Roles Hierarchy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Calendar (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Weekly Shift Schedule</h3>
              <p className="text-xs text-slate-500">Morning (08:00 - 16:00) & Evening (16:00 - 00:00)</p>
            </div>
            <span className="text-xs font-bold text-feedo-600 bg-feedo-50 px-3 py-1 rounded-xl">
              Week 38 • Sep 2026
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {['Mon (14)', 'Tue (15)', 'Wed (16)', 'Thu (17)', 'Fri (18)', 'Sat (19)', 'Sun (20)'].map((day) => (
              <div key={day} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-700 block text-[11px]">{day}</span>
                <div className="bg-amber-100 text-amber-900 text-[10px] font-bold py-1 px-1 rounded-md">
                  M: 12 Crew
                </div>
                <div className="bg-indigo-100 text-indigo-900 text-[10px] font-bold py-1 px-1 rounded-md">
                  E: 14 Crew
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Roles & Hierarchy + Team Bulletin */}
        <div className="space-y-6">
          {/* Roles & Hierarchy */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Roles & POS Access Permissions
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 flex justify-between items-center">
                <span className="font-bold text-slate-800">Management (Full Access)</span>
                <span className="text-slate-500 font-mono">3 Staff</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 flex justify-between items-center">
                <span className="font-bold text-slate-800">Kitchen Team (Orders & Menu)</span>
                <span className="text-slate-500 font-mono">12 Staff</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 flex justify-between items-center">
                <span className="font-bold text-slate-800">Dispatch & Front Desk</span>
                <span className="text-slate-500 font-mono">9 Staff</span>
              </div>
            </div>
          </div>

          {/* Team Bulletin Gradient Card */}
          <div className="bg-gradient-to-br from-feedo-500 to-rose-500 rounded-3xl p-6 text-white shadow-lg space-y-2">
            <h3 className="text-base font-black">📢 Kitchen Announcement</h3>
            <p className="text-xs text-rose-100 leading-relaxed">
              Weekend rush preparation starts Friday 4:00 PM. Extra biryani dum pots prep assigned to Morning shift.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
