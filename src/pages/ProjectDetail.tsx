import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/index.ts";
import { fetchProjectById, updateProject, deleteProject, inviteMember } from "../store/slices/projectSlice.ts";
import { fetchTasksByProject, createTask, updateTaskStatus } from "../store/slices/taskSlice.ts";
import { 
  Plus, 
  MoreHorizontal, 
  Calendar as CalendarIcon, 
  MessageSquare, 
  Paperclip, 
  CheckSquare,
  ChevronLeft,
  Users,
  Settings,
  Clock,
  AlertCircle,
  LayoutGrid,
  Trello,
  Calendar as CalendarLucide,
  GanttChartSquare,
  UserPlus,
  Copy,
  Check,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import TaskDetail from "../components/TaskDetail.tsx";

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentProject } = useSelector((state: RootState) => state.projects);
  const { tasks, loading } = useSelector((state: RootState) => state.tasks);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<"kanban" | "calendar" | "timeline">("kanban");
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "Medium", dueDate: "" });
  const [editProject, setEditProject] = useState({ name: "", description: "", status: "", deadline: "" });
  const [inviteEmail, setInviteEmail] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id)).then((action) => {
        if (fetchProjectById.fulfilled.match(action)) {
          console.log("Project fetched by ID:", action.payload);
        }
      });
      dispatch(fetchTasksByProject(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (currentProject) {
      setEditProject({
        name: currentProject.name,
        description: currentProject.description || "",
        status: currentProject.status,
        deadline: currentProject.deadline ? new Date(currentProject.deadline).toISOString().split('T')[0] : ""
      });
    }
  }, [currentProject]);

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      await dispatch(updateProject({ id, data: editProject }));
      setIsSettingsModalOpen(false);
    }
  };

  const handleDeleteProject = async () => {
    if (id) {
      await dispatch(deleteProject(id));
      navigate("/projects");
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id && inviteEmail) {
      await dispatch(inviteMember({ projectId: id, email: inviteEmail }));
      setIsInviteModalOpen(false);
      setInviteEmail("");
    }
  };

  const copyToClipboard = () => {
    if (currentProject?.projectCode) {
      navigator.clipboard.writeText(currentProject.projectCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      await dispatch(createTask({ ...newTask, project: id }));
      setIsTaskModalOpen(false);
      setNewTask({ title: "", description: "", priority: "Medium", dueDate: "" });
    }
  };

  const handleStatusChange = (taskId: string, newStatus: string) => {
    dispatch(updateTaskStatus({ id: taskId, status: newStatus }));
  };

  const columns = [
    { id: "Todo", title: "To Do", color: "bg-slate-100 text-slate-600" },
    { id: "In Progress", title: "In Progress", color: "bg-amber-50 text-amber-600" },
    { id: "Completed", title: "Completed", color: "bg-emerald-50 text-emerald-600" },
  ];

  const getTasksByStatus = (status: string) => tasks.filter((t) => t.status === status);

  if (!currentProject) return <div className="p-8 text-center">Loading project...</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <Link to="/projects" className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-indigo-600 border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
            <ChevronLeft size={24} />
          </Link>
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{currentProject.name}</h1>
              <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
                {currentProject.status}
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center">
              <Users size={14} className="mr-1" />
              {currentProject.members.length} members • Created by {currentProject.owner.name}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 mr-4">
            <button 
              onClick={() => setViewMode("kanban")}
              className={`p-2 rounded-lg transition-all ${viewMode === "kanban" ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`}
              title="Kanban Board"
            >
              <Trello size={18} />
            </button>
            <button 
              onClick={() => setViewMode("calendar")}
              className={`p-2 rounded-lg transition-all ${viewMode === "calendar" ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`}
              title="Calendar View"
            >
              <CalendarLucide size={18} />
            </button>
            <button 
              onClick={() => setViewMode("timeline")}
              className={`p-2 rounded-lg transition-all ${viewMode === "timeline" ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`}
              title="Timeline View"
            >
              <GanttChartSquare size={18} />
            </button>
          </div>
          <div className="flex -space-x-2 mr-4">
            {currentProject.members.slice(0, 4).map((member: any, idx: number) => {
              const memberId = typeof member === 'string' ? member : member._id;
              const memberName = typeof member === 'string' ? 'User' : member.name;
              const memberAvatar = typeof member === 'string' ? null : member.avatar;
              return (
                <img 
                  key={memberId || idx}
                  src={memberAvatar || `https://ui-avatars.com/api/?name=${memberName}`}
                  className="w-9 h-9 rounded-full border-2 border-white dark:border-slate-900 shadow-sm"
                  title={memberName}
                />
              );
            })}
            {currentProject.members.length > 4 && (
              <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400">
                +{currentProject.members.length - 4}
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsInviteModalOpen(true)}
            className="p-2.5 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all"
            title="Invite Member"
          >
            <UserPlus size={20} />
          </button>
          <button 
            onClick={() => setIsSettingsModalOpen(true)}
            className="p-2.5 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all"
            title="Project Settings"
          >
            <Settings size={20} />
          </button>
          <button 
            onClick={() => setIsTaskModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center shadow-lg shadow-indigo-100 transition-all"
          >
            <Plus size={20} className="mr-2" />
            Add Task
          </button>
        </div>
      </div>

      {/* Content based on View Mode */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full min-h-[600px]">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center space-x-3">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">{column.title}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${column.color} dark:bg-slate-800`}>
                    {getTasksByStatus(column.id).length}
                  </span>
                </div>
                <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <Plus size={18} />
                </button>
              </div>

              <div className="flex-1 bg-slate-100/50 dark:bg-slate-900/50 rounded-3xl p-4 space-y-4 min-h-[200px]">
                {getTasksByStatus(column.id).map((task) => (
                  <motion.div
                    key={task._id}
                    layoutId={task._id}
                    whileHover={{ y: -2 }}
                    onClick={() => setSelectedTask(task)}
                    className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 group cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        task.priority === "High" ? "bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400" : 
                        task.priority === "Medium" ? "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" : "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      }`}>
                        {task.priority}
                      </span>
                      <button className="p-1 text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 opacity-0 group-hover:opacity-100 transition-all">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">{task.title}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 mb-4">{task.description}</p>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                      <div className="flex items-center space-x-3 text-slate-400 dark:text-slate-500">
                        <div className="flex items-center text-[10px] font-bold">
                          <MessageSquare size={12} className="mr-1" />
                          {task.comments?.length || 0}
                        </div>
                        <div className="flex items-center text-[10px] font-bold">
                          <CheckSquare size={12} className="mr-1" />
                          {task.subtasks?.filter((s: any) => s.completed).length || 0}/{task.subtasks?.length || 0}
                        </div>
                      </div>
                      <img 
                        src={task.assignedTo?.avatar || `https://ui-avatars.com/api/?name=${task.assignedTo?.name || "Unassigned"}`}
                        className="w-6 h-6 rounded-full border border-white dark:border-slate-800"
                        alt="Assignee"
                      />
                    </div>
                  </motion.div>
                ))}
                {getTasksByStatus(column.id).length === 0 && (
                  <div className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-600 text-sm italic">
                    No tasks here
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === "calendar" && (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <Calendar 
            className="w-full border-none font-sans"
            tileContent={({ date, view }) => {
              if (view === 'month') {
                const dayTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate).toDateString() === date.toDateString());
                return (
                  <div className="flex flex-col space-y-1 mt-1">
                    {dayTasks.map(t => (
                      <div 
                        key={t._id} 
                        onClick={() => setSelectedTask(t)}
                        className="text-[8px] px-1 py-0.5 bg-indigo-50 text-indigo-600 rounded truncate font-bold cursor-pointer"
                      >
                        {t.title}
                      </div>
                    ))}
                  </div>
                );
              }
            }}
          />
        </div>
      )}

      {viewMode === "timeline" && (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm overflow-x-auto">
          <div className="min-w-[800px] space-y-4">
            {tasks.map((task) => (
              <div key={task._id} className="flex items-center cursor-pointer" onClick={() => setSelectedTask(task)}>
                <div className="w-48 pr-4 text-sm font-bold text-slate-700 truncate">{task.title}</div>
                <div className="flex-1 h-8 bg-slate-50 rounded-lg relative">
                  {task.dueDate && (
                    <div 
                      className={`absolute h-full rounded-lg flex items-center px-3 text-[10px] font-bold text-white ${
                        task.status === "Completed" ? "bg-emerald-500" : "bg-indigo-500"
                      }`}
                      style={{ 
                        left: "10%", // Simplified for demo
                        width: "40%" 
                      }}
                    >
                      {task.status}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      <AnimatePresence>
        {selectedTask && (
          <TaskDetail 
            task={selectedTask} 
            onClose={() => setSelectedTask(null)} 
          />
        )}
      </AnimatePresence>

      {/* Task Modal */}
      <AnimatePresence>
        {isTaskModalOpen && (
          <div key="task-modal-root" className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              key="task-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTaskModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              key="task-modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Create New Task</h2>
              <form onSubmit={handleCreateTask} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Task Title</label>
                  <input 
                    type="text" 
                    required
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-slate-100"
                    placeholder="e.g. Design Landing Page"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Description</label>
                  <textarea 
                    rows={3}
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-slate-900 dark:text-slate-100"
                    placeholder="Describe what needs to be done..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Priority</label>
                    <select 
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-slate-100"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Due Date</label>
                    <input 
                      type="date" 
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
                <div className="flex space-x-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsTaskModalOpen(false)}
                    className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Invite Member Modal */}
      <AnimatePresence>
        {isInviteModalOpen && (
          <div key="invite-modal-root" className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              key="invite-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInviteModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              key="invite-modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Invite Member</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Share the project code or invite via email.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Project Code</label>
                  <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
                    <span className="flex-1 font-mono font-bold text-indigo-600 dark:text-indigo-400 text-lg tracking-wider">
                      {currentProject.projectCode}
                    </span>
                    <button 
                      onClick={copyToClipboard}
                      className="p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                    >
                      {copied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-slate-900 px-2 text-slate-400 dark:text-slate-500 font-bold">Or invite via email</span>
                  </div>
                </div>

                <form onSubmit={handleInvite} className="space-y-4">
                  <input 
                    type="email" 
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-slate-100"
                    placeholder="colleague@example.com"
                  />
                  <button 
                    type="submit"
                    className="w-full px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
                  >
                    Send Invitation
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Project Settings Modal */}
      <AnimatePresence>
        {isSettingsModalOpen && (
          <div key="settings-modal-root" className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              key="settings-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              key="settings-modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Project Settings</h2>
                <button onClick={() => setIsSettingsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleUpdateProject} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Project Name</label>
                  <input 
                    type="text" 
                    required
                    value={editProject.name}
                    onChange={(e) => setEditProject({ ...editProject, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Description</label>
                  <textarea 
                    rows={3}
                    value={editProject.description}
                    onChange={(e) => setEditProject({ ...editProject, description: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Status</label>
                    <select 
                      value={editProject.status}
                      onChange={(e) => setEditProject({ ...editProject, status: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-slate-100"
                    >
                      <option value="Active">Active</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Deadline</label>
                    <input 
                      type="date" 
                      value={editProject.deadline}
                      onChange={(e) => setEditProject({ ...editProject, deadline: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col space-y-4">
                  <button 
                    type="submit"
                    className="w-full px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
                  >
                    Save Changes
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsDeleteConfirmOpen(true)}
                    className="w-full px-6 py-3 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 font-bold rounded-2xl hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-all flex items-center justify-center"
                  >
                    <AlertCircle size={18} className="mr-2" />
                    Delete Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <div key="delete-confirm-modal-root" className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              key="delete-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              key="delete-content"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Delete Project?</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8">This action is permanent and will delete all tasks and data associated with this project.</p>
              <div className="flex space-x-4">
                <button 
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteProject}
                  className="flex-1 px-6 py-3 bg-rose-600 text-white font-bold rounded-2xl hover:bg-rose-700 shadow-lg shadow-rose-100 dark:shadow-rose-900/20 transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetail;
