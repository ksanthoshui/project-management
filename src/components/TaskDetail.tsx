import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/index.ts";
import { 
  addComment, 
  addSubtask, 
  toggleSubtask, 
  uploadAttachment,
  updateTaskStatus
} from "../store/slices/taskSlice.ts";
import { 
  X, 
  MessageSquare, 
  CheckSquare, 
  Paperclip, 
  Plus, 
  Send,
  Download,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import { motion } from "motion/react";

interface TaskDetailProps {
  task: any;
  onClose: () => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ task, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [comment, setComment] = useState("");
  const [subtaskTitle, setSubtaskTitle] = useState("");

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      dispatch(addComment({ id: task._id, text: comment }));
      setComment("");
    }
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (subtaskTitle.trim()) {
      dispatch(addSubtask({ id: task._id, title: subtaskTitle }));
      setSubtaskTitle("");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      dispatch(uploadAttachment({ id: task._id, file }));
    }
  };

  const handleStatusChange = (status: string) => {
    dispatch(updateTaskStatus({ id: task._id, status }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-xl ${
              task.status === "Completed" ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" : 
              task.status === "In Progress" ? "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            }`}>
              {task.status === "Completed" ? <CheckCircle2 size={24} /> : 
               task.status === "In Progress" ? <Clock size={24} /> : <AlertCircle size={24} />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{task.title}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">In Project: {task.project.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={24} className="text-slate-400 dark:text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <section>
              <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Description</h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                {task.description || "No description provided."}
              </p>
            </section>

            {/* Subtasks / Checklist */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Subtasks</h3>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">
                  {task.progress}% Done
                </span>
              </div>
              <div className="space-y-3">
                {task.subtasks?.map((sub: any) => (
                  <div 
                    key={sub._id} 
                    className="flex items-center p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-indigo-200 dark:hover:border-indigo-900 transition-all group"
                  >
                    <button 
                      onClick={() => dispatch(toggleSubtask({ id: task._id, subtaskId: sub._id }))}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        sub.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-200 dark:border-slate-700 text-transparent"
                      }`}
                    >
                      <CheckSquare size={14} />
                    </button>
                    <span className={`ml-4 text-sm font-medium ${sub.completed ? "text-slate-400 dark:text-slate-500 line-through" : "text-slate-700 dark:text-slate-200"}`}>
                      {sub.title}
                    </span>
                  </div>
                ))}
                <form onSubmit={handleAddSubtask} className="flex items-center mt-4">
                  <input 
                    type="text"
                    value={subtaskTitle}
                    onChange={(e) => setSubtaskTitle(e.target.value)}
                    placeholder="Add a subtask..."
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                  />
                  <button type="submit" className="ml-2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all">
                    <Plus size={20} />
                  </button>
                </form>
              </div>
            </section>

            {/* Comments */}
            <section>
              <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-6">Comments</h3>
              <div className="space-y-6 mb-8">
                {task.comments?.map((c: any) => (
                  <div key={c._id} className="flex space-x-4">
                    <img 
                      src={c.user.avatar || `https://ui-avatars.com/api/?name=${c.user.name}`} 
                      className="w-10 h-10 rounded-full border border-slate-100 dark:border-slate-800"
                      alt={c.user.name}
                    />
                    <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{c.user.name}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">{new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleAddComment} className="flex items-start space-x-4">
                <img 
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}`} 
                  className="w-10 h-10 rounded-full border border-slate-100 dark:border-slate-800"
                  alt="My Avatar"
                />
                <div className="flex-1 relative">
                  <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    rows={2}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-slate-900 dark:text-slate-100"
                  />
                  <button 
                    type="submit" 
                    className="absolute right-3 bottom-3 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </section>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-10">
            {/* Status Selector */}
            <section>
              <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Status</h3>
              <div className="grid grid-cols-1 gap-2">
                {["Todo", "In Progress", "Completed"].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={`px-4 py-3 rounded-2xl text-sm font-bold border transition-all text-left flex items-center justify-between ${
                      task.status === s 
                        ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400" 
                        : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {s}
                    {task.status === s && <CheckCircle2 size={16} />}
                  </button>
                ))}
              </div>
            </section>

            {/* Assignee */}
            <section>
              <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Assignee</h3>
              <div className="flex items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <img 
                  src={task.assignedTo?.avatar || `https://ui-avatars.com/api/?name=${task.assignedTo?.name || "Unassigned"}`} 
                  className="w-10 h-10 rounded-full border border-white dark:border-slate-900 shadow-sm"
                  alt="Assignee"
                />
                <div className="ml-4">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{task.assignedTo?.name || "Unassigned"}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{task.assignedTo?.role || "Team Member"}</p>
                </div>
              </div>
            </section>

            {/* Attachments */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Attachments</h3>
                <label className="p-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-800 transition-all">
                  <Plus size={18} />
                  <input type="file" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
              <div className="space-y-3">
                {task.attachments?.map((file: any) => (
                  <div key={file._id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl group">
                    <div className="flex items-center min-w-0">
                      <Paperclip size={16} className="text-slate-400 dark:text-slate-500 mr-3 shrink-0" />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{file.name}</span>
                    </div>
                    <a 
                      href={file.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Download size={16} />
                    </a>
                  </div>
                ))}
                {(!task.attachments || task.attachments.length === 0) && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 italic text-center py-4">No attachments yet</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskDetail;
