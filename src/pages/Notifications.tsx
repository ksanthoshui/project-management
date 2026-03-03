import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/index.ts";
import { fetchNotifications, markNotificationRead } from "../store/slices/notificationSlice.ts";
import { 
  Bell, 
  CheckCircle2, 
  MessageSquare, 
  UserPlus, 
  Clock,
  MoreHorizontal,
  Check
} from "lucide-react";
import { motion } from "motion/react";

const Notifications: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, loading } = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkRead = (id: string) => {
    dispatch(markNotificationRead(id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "Task Assigned": return <CheckCircle2 className="text-blue-500" size={20} />;
      case "Comment": return <MessageSquare className="text-amber-500" size={20} />;
      case "Project Invitation": return <UserPlus className="text-indigo-500" size={20} />;
      case "Deadline Reminder": return <Clock className="text-rose-500" size={20} />;
      default: return <Bell className="text-slate-500" size={20} />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Notifications</h1>
          <p className="text-slate-500 dark:text-slate-400">Stay updated with your project activities.</p>
        </div>
        <button className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">Mark all as read</button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        {notifications.length > 0 ? (
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {notifications.map((notification) => (
              <motion.div 
                key={notification._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-6 flex items-start group transition-all ${notification.read ? "opacity-60" : "bg-indigo-50/30 dark:bg-indigo-900/10"}`}
              >
                <div className={`p-3 rounded-2xl mr-4 ${notification.read ? "bg-slate-100 dark:bg-slate-800" : "bg-white dark:bg-slate-900 shadow-sm"}`}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-bold text-slate-900 dark:text-slate-100 ${notification.read ? "font-semibold" : ""}`}>
                      {notification.type}
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{notification.message}</p>
                  {!notification.read && (
                    <button 
                      onClick={() => handleMarkRead(notification._id)}
                      className="mt-3 flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                    >
                      <Check size={14} className="mr-1" />
                      Mark as read
                    </button>
                  )}
                </div>
                <button className="p-2 text-slate-300 dark:text-slate-700 hover:text-slate-500 dark:hover:text-slate-400 opacity-0 group-hover:opacity-100 transition-all">
                  <MoreHorizontal size={18} />
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell size={32} className="text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">No notifications yet</h3>
            <p className="text-slate-500 dark:text-slate-400">We'll notify you when something important happens.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
