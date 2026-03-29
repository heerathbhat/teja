import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  LogOut, 
  Activity, 
  DollarSign, 
  Zap, 
  AlertCircle, 
  Users, 
  BarChart3, 
  Search,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import tejaLogo from '@/assets/teja-logo.png';
import ParticleField from '@/components/ParticleField';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  // Redirect if not admin
  if (user && user.role !== 'admin') {
    return <Navigate to="/user" />;
  }

  // Fetch Stats
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const { data } = await api.get('/admin/stats');
      return data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-muted-foreground animate-pulse">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-96 text-center p-8 glass border-destructive/20">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Failed to load analytics</h2>
          <p className="text-muted-foreground mb-6">There was an error connecting to the admin service.</p>
          <Button onClick={() => window.location.reload()} variant="outline">Try Again</Button>
        </Card>
      </div>
    );
  }

  const { summary, dailyUsage, endpointUsage, recentLogs } = stats;

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <ParticleField />
      
      {/* Top Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50"
      >
        <div className="container mx-auto px-8 py-2 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src={tejaLogo} alt="Teja" className="h-10 w-auto" />
            <span className="font-bold text-xl tracking-tight hidden md:block">Analytics <span className="text-primary italic">Beta</span></span>
          </Link>
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-muted-foreground md:block hidden">System Admin: <span className="text-foreground">{user?.name}</span></span>
            <Button onClick={logout} variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2">
              <LogOut size={18} /> Logout
            </Button>
          </div>
        </div>
      </motion.nav>

      <main className="container mx-auto px-8 pt-24 pb-12 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Dashboard Header */}
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-primary mb-1">
                <Activity size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">Global Monitoring</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                Model <span className="gradient-text">Performance</span> Dashboard
              </h1>
            </div>
          </motion.div>

          {/* Metric Overview Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass border-none shadow-soft overflow-hidden group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Requests</CardTitle>
                <Activity className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{summary.totalRequests.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">AI usage volume</p>
              </CardContent>
            </Card>

            <Card className="glass border-none shadow-soft overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Estimated Cost</CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${summary.totalCost.toFixed(4)}</div>
                <p className="text-xs text-muted-foreground mt-1">Based on {summary.totalTokens.toLocaleString()} tokens</p>
              </CardContent>
            </Card>

            <Card className="glass border-none shadow-soft overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Success Rate</CardTitle>
                <Zap className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{summary.successRate.toFixed(1)}%</div>
                <div className="w-full bg-secondary h-1.5 rounded-full mt-3 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${summary.successRate}%` }}
                    className="bg-primary h-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-none shadow-soft overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Avg Latency</CardTitle>
                <Clock className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{summary.avgLatency.toFixed(0)} ms</div>
                <p className="text-xs text-muted-foreground mt-1">Response time per request</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div variants={itemVariants}>
              <Card className="glass border-none shadow-soft h-full">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <BarChart3 size={20} className="text-primary" />
                    Request Volume (L7D)
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyUsage}>
                      <defs>
                        <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="_id" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                      />
                      <Area type="monotone" dataKey="requests" stroke="#10b981" fillOpacity={1} fill="url(#colorRequests)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="glass border-none shadow-soft h-full">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Users size={20} className="text-primary" />
                    Tool Usage Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={endpointUsage}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="_id" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                      />
                      <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                        {endpointUsage.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Logs Table */}
          <motion.div variants={itemVariants}>
            <Card className="glass border-none shadow-soft overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Search size={20} className="text-primary" />
                  Model Interaction Logs
                </CardTitle>
                <div className="text-xs text-muted-foreground">Showing last 20 requests</div>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-secondary/50 text-xs font-bold text-muted-foreground uppercase">
                    <tr>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Tool</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Latency</th>
                      <th className="px-6 py-4">Cost</th>
                      <th className="px-6 py-4">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {recentLogs.map((log: any) => (
                      <tr key={log._id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-sm">{log.user?.name || 'Unknown'}</div>
                          <div className="text-xs text-muted-foreground">{log.user?.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase">
                            {log.endpoint}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {log.status === 'success' ? (
                            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                              <CheckCircle2 size={14} /> OK
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-medium">
                              <XCircle size={14} /> ERR
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs">{log.latency?.toLocaleString() || 0} ms</td>
                        <td className="px-6 py-4 font-mono text-xs">${log.cost?.toFixed(5) || '0.00000'}</td>
                        <td className="px-6 py-4 text-xs text-muted-foreground">
                          {new Date(log.createdAt).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))}
                    {recentLogs.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground italic">
                          No interaction logs found yet. Start chatting to see data!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;
