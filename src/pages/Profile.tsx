import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/index.ts";
import { 
  User, 
  Mail, 
  Shield, 
  Camera, 
  Lock, 
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { motion } from "motion/react";

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState<"general" | "security">("general");

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Account Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your personal information and security preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-2">
          <button 
            onClick={() => setActiveTab("general")}
            className={`w-full flex items-center px-4 py-3 rounded-2xl font-semibold transition-all ${
              activeTab === "general" ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-100 dark:border-slate-800" : "text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50"
            }`}
          >
            <User size={18} className="mr-3" />
            General
          </button>
          <button 
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center px-4 py-3 rounded-2xl font-semibold transition-all ${
              activeTab === "security" ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-100 dark:border-slate-800" : "text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50"
            }`}
          >
            <Lock size={18} className="mr-3" />
            Security
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === "general" ? (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-8"
            >
              {/* Profile Picture */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <img 
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&size=128`} 
                    className="w-24 h-24 rounded-3xl object-cover border-4 border-slate-50 dark:border-slate-800"
                    alt="Profile"
                  />
                  <button className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-all">
                    <Camera size={16} />
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Profile Picture</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">PNG, JPG or GIF. Max 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                    <input 
                      type="text" 
                      defaultValue={user?.name}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                    <input 
                      type="email" 
                      disabled
                      defaultValue={user?.email}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400 dark:text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Role</label>
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                    <input 
                      type="text" 
                      disabled
                      defaultValue={user?.role}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400 dark:text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20 hover:bg-indigo-700 transition-all">
                  Save Changes
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-8"
            >
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Current Password</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-slate-100"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-slate-100"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Confirm New Password</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-slate-100"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20 hover:bg-indigo-700 transition-all">
                    Update Password
                  </button>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-50 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <div className="flex items-center">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg mr-4">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100">2FA is currently enabled</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Your account is extra secure.</p>
                    </div>
                  </div>
                  <button className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">Configure</button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
