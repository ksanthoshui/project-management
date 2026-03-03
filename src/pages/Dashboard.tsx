import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/index.ts";
import { fetchProjects } from "../store/slices/projectSlice.ts";
import { fetchDashboardStats } from "../store/slices/dashboardSlice.ts";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  Calendar as CalendarIcon
} from "lucide-react";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { projects } = useSelector((state: RootState) => state.projects);
  const { user } = useSelector((state: RootState) => state.auth);
  const { stats, distribution, weeklyActivity, loading } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    dispatch(fetchProjects()).then((action) => {
      if (fetchProjects.fulfilled.match(action)) {
        console.log("Dashboard Projects fetched:", action.payload);
      }
    });
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const statCards = [
    { label: "Active Projects", value: stats?.activeProjects || 0, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Completed Tasks", value: stats?.completedTasks || 0, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Pending Tasks", value: stats?.pendingTasks || 0, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Overdue", value: stats?.overdueTasks || 0, icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  const pieData = distribution ? [
    { name: "Todo", value: distribution.todo },
    { name: "In Progress", value: distribution.inProgress },
    { name: "Completed", value: distribution.completed },
  ] : [];

  const COLORS = ["#6366f1", "#f59e0b", "#10b981"];

  if (loading && !stats) return <div className="flex items-center justify-center h-full">Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Welcome back, {user?.name}! 👋</h1>
        <p className="text-slate-500 dark:text-slate-400">Here's what's happening with your projects today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} dark:bg-slate-800 p-3 rounded-2xl`}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stats</span>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Weekly Activity</h2>
            <select className="bg-slate-50 dark:bg-slate-800 border-none text-sm font-medium text-slate-500 dark:text-slate-400 rounded-xl focus:ring-0">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                />
                <Bar dataKey="tasks" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Distribution */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-8">Task Distribution</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 mt-4">
            {pieData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {stats?.totalTasks ? Math.round((item.value / stats.totalTasks) * 100) : 0}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Recent Projects</h2>
          <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 dark:text-slate-500 text-xs uppercase tracking-wider">
                <th className="pb-4 font-bold">Project Name</th>
                <th className="pb-4 font-bold">Code</th>
                <th className="pb-4 font-bold">Deadline</th>
                <th className="pb-4 font-bold">Status</th>
                <th className="pb-4 font-bold">Progress</th>
                <th className="pb-4 font-bold text-right">Team</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {projects.slice(0, 5).map((project) => (
                <tr key={project._id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 font-semibold text-slate-900 dark:text-slate-100">{project.name}</td>
                  <td className="py-4 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">{project.projectCode}</td>
                  <td className="py-4 text-sm text-slate-500 dark:text-slate-400">
                    {project.deadline ? new Date(project.deadline).toLocaleDateString() : "No deadline"}
                  </td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                      project.status === "Active" ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: "65%" }} />
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end -space-x-2">
                      {project.members.slice(0, 3).map((member: any, idx: number) => {
                        const memberId = typeof member === 'string' ? member : member._id;
                        const memberName = typeof member === 'string' ? 'User' : member.name;
                        const memberAvatar = typeof member === 'string' ? null : member.avatar;
                        return (
                          <img 
                            key={memberId || idx}
                            src={memberAvatar || `https://ui-avatars.com/api/?name=${memberName}`}
                            className="w-8 h-8 rounded-full border-2 border-white"
                            alt={memberName}
                          />
                        );
                      })}
                      {project.members.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">
                          +{project.members.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 italic">No projects found. Create one to get started!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
