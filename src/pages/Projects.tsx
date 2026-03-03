import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/index.ts";
import { fetchProjects, createProject, joinProject } from "../store/slices/projectSlice.ts";
import { 
  Plus, 
  Users, 
  Calendar, 
  ChevronRight, 
  Search,
  Filter,
  MoreVertical,
  LayoutGrid,
  List as ListIcon,
  Link as LinkIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router-dom";

const Projects: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { projects, loading } = useSelector((state: RootState) => state.projects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [newProject, setNewProject] = useState({ name: "", description: "", deadline: "" });
  const [joinCode, setJoinCode] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    dispatch(fetchProjects()).then((action) => {
      if (fetchProjects.fulfilled.match(action)) {
        console.log("Projects fetched:", action.payload);
      }
    });
  }, [dispatch]);

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating project with data:", newProject);
    const resultAction = await dispatch(createProject(newProject));
    if (createProject.fulfilled.match(resultAction)) {
      console.log("Project created successfully:", resultAction.payload);
    } else {
      console.error("Failed to create project:", resultAction.payload);
    }
    setIsModalOpen(false);
    setNewProject({ name: "", description: "", deadline: "" });
  };

  const handleJoinProject = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(joinProject(joinCode));
    setIsJoinModalOpen(false);
    setJoinCode("");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Projects</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage and track all your active projects.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1">
            <button 
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`}
            >
              <ListIcon size={18} />
            </button>
          </div>
          <button 
            onClick={() => setIsJoinModalOpen(true)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 px-4 py-2.5 rounded-xl font-bold flex items-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            <LinkIcon size={18} className="mr-2" />
            Join
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center shadow-lg shadow-indigo-100 transition-all"
          >
            <Plus size={20} className="mr-2" />
            New Project
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-slate-100"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter size={18} className="text-slate-400" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Link to={`/projects/${project._id}`} key={project._id}>
              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group"
              >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xl">
                  {project.name.charAt(0)}
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg mb-1">
                    {project.projectCode}
                  </span>
                  <button className="p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {project.name}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-6">
                {project.description || "No description provided for this project."}
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400 dark:text-slate-500 font-medium">Progress</span>
                  <span className="text-slate-900 dark:text-slate-100 font-bold">65%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: "65%" }} />
                </div>
              </div>

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-50 dark:border-slate-800">
                <div className="flex -space-x-2">
                  {project.members.slice(0, 3).map((member: any, idx: number) => {
                    const memberId = typeof member === 'string' ? member : member._id;
                    const memberName = typeof member === 'string' ? 'User' : member.name;
                    const memberAvatar = typeof member === 'string' ? null : member.avatar;
                    return (
                      <img 
                        key={memberId || idx}
                        src={memberAvatar || `https://ui-avatars.com/api/?name=${memberName}`}
                        className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900"
                        alt={memberName}
                      />
                    );
                  })}
                  {project.members.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      +{project.members.length - 3}
                    </div>
                  )}
                </div>
                <div className="flex items-center text-slate-400 dark:text-slate-500 text-xs font-bold">
                  <Calendar size={14} className="mr-1" />
                  {project.deadline ? new Date(project.deadline).toLocaleDateString() : "No date"}
                </div>
              </div>
            </motion.div>
          </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <tr className="text-slate-400 dark:text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-8 py-4 font-bold">Project Name</th>
                <th className="px-8 py-4 font-bold">Code</th>
                <th className="px-8 py-4 font-bold">Status</th>
                <th className="px-8 py-4 font-bold">Deadline</th>
                <th className="px-8 py-4 font-bold">Progress</th>
                <th className="px-8 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredProjects.map((project) => (
                <tr 
                  key={project._id} 
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/projects/${project._id}`)}
                >
                  <td className="px-8 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold mr-4">
                        {project.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-slate-100">{project.name}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{project.members.length} members</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {project.projectCode}
                  </td>
                  <td className="px-8 py-4">
                    <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-bold uppercase">
                      {project.status}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-sm text-slate-500 dark:text-slate-400">
                    {project.deadline ? new Date(project.deadline).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: "45%" }} />
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">45%</span>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-indigo-600">
                      <ChevronRight size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div key="create-project-modal-root" className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              key="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              key="modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Create New Project</h2>
              <form onSubmit={handleCreateProject} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Project Name</label>
                  <input 
                    type="text" 
                    required
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-slate-100"
                    placeholder="e.g. Website Redesign"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Description</label>
                  <textarea 
                    rows={3}
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-slate-900 dark:text-slate-100"
                    placeholder="Briefly describe the project goals..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Deadline</label>
                  <input 
                    type="date" 
                    value={newProject.deadline}
                    onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div className="flex space-x-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
                  >
                    Create Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Join Project Modal */}
      <AnimatePresence>
        {isJoinModalOpen && (
          <div key="join-project-modal-root" className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              key="join-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsJoinModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              key="join-modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Join Project</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Enter the unique code shared by the project owner.</p>
              <form onSubmit={handleJoinProject} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Project Code</label>
                  <input 
                    type="text" 
                    required
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-center text-xl font-bold tracking-widest uppercase text-slate-900 dark:text-slate-100"
                    placeholder="E.G. PRJ-123456"
                  />
                </div>
                <div className="flex space-x-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsJoinModalOpen(false)}
                    className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
                  >
                    Join Now
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
