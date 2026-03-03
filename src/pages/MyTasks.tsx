import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/index.ts";
import { fetchTasksByProject } from "../store/slices/taskSlice.ts";
import { fetchProjects } from "../store/slices/projectSlice.ts";
import { 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter,
  MoreHorizontal,
  Calendar as CalendarIcon,
  MessageSquare,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import TaskDetail from "../components/TaskDetail.tsx";

const MyTasks: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { projects } = useSelector((state: RootState) => state.projects);
  const { tasks, loading } = useSelector((state: RootState) => state.tasks);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    // Fetch tasks for all projects the user is in
    projects.forEach(project => {
      dispatch(fetchTasksByProject(project._id));
    });
  }, [projects, dispatch]);

  // Filter tasks assigned to the current user
  const myTasks = tasks.filter(task => {
    const isAssigned = task.assignedTo?._id === user?._id || task.assignedTo === user?._id;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || task.status === statusFilter;
    return isAssigned && matchesSearch && matchesStatus;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400";
      case "Medium": return "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400";
      case "Low": return "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
      default: return "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Tasks</h1>
        <p className="text-slate-500 dark:text-slate-400">View and manage all tasks assigned to you across projects.</p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search your tasks..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-slate-100"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter size={18} className="text-slate-400 dark:text-slate-500" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Status</option>
            <option value="Todo">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        {myTasks.length > 0 ? (
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {myTasks.map((task) => (
              <motion.div 
                key={task._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setSelectedTask(task)}
                className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-4">
                  <div className={`mt-1 p-2 rounded-xl ${
                    task.status === "Completed" ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" : "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                  }`}>
                    {task.status === "Completed" ? <CheckCircle2 size={20} /> : <CheckSquare size={20} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {task.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-1">{task.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className="text-slate-400 dark:text-slate-500 text-xs flex items-center">
                        <Clock size={12} className="mr-1" />
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
                      </span>
                      <span className="text-slate-400 dark:text-slate-500 text-xs flex items-center">
                        <MessageSquare size={12} className="mr-1" />
                        {task.comments?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Project</p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {projects.find(p => p._id === task.project)?.name || "Unknown Project"}
                    </p>
                  </div>
                  <button className="p-2 text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400">
                    <MoreHorizontal size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 dark:text-slate-600">
              <CheckSquare size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">No tasks found</h3>
            <p className="text-slate-500 dark:text-slate-400">You don't have any tasks assigned to you matching the current filters.</p>
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      <AnimatePresence>
        {selectedTask && (
          <TaskDetail 
            task={selectedTask} 
            onClose={() => setSelectedTask(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyTasks;
