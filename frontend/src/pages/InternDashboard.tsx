import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { LogOut, CheckCircle, Clock, AlertCircle, Sparkles, LayoutDashboard } from 'lucide-react';
import tejaLogo from '@/assets/teja-logo.png';
import ParticleField from '@/components/ParticleField';
import NotificationBell from '@/components/NotificationBell';

const InternDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch only assigned tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['my-tasks'],
    queryFn: async () => {
      const { data } = await api.get('/tasks');
      return data;
    },
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string, status: string }) => {
      const { data } = await api.patch(`/tasks/${taskId}`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
      toast({ title: 'Task status updated' });
    },
  });

  const pendingTasks = tasks.filter((t: any) => t.status === 'pending' || t.status === 'in-progress').length;
  const completedTasks = tasks.filter((t: any) => t.status === 'completed').length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

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
            <img src={tejaLogo} alt="Teja" className="h-12 w-auto" />
          </Link>
          <div className="flex items-center gap-6">
            <NotificationBell />
            <span className="text-sm font-medium text-muted-foreground md:block hidden">Intern: <span className="text-foreground">{user?.name} ({user?.email})</span></span>
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
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
              <LayoutDashboard className="text-primary" /> My <span className="gradient-text">Workspace</span>
            </h1>
            <p className="text-muted-foreground mt-2">Manage your assigned AI labeling and development tasks.</p>
          </motion.div>
          
          {/* Welcome Card */}
          <motion.div variants={itemVariants}>
            <Card className="glass border-none rounded-3xl shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Sparkles size={120} className="text-primary" />
              </div>
              <CardContent className="pt-8 pb-10 flex flex-col items-start gap-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-primary">
                  Welcome aboard
                </div>
                <h2 className="text-3xl font-black text-foreground">Hello, {user?.name}!</h2>
                <p className="text-muted-foreground max-w-2xl leading-relaxed">
                  You are currently handling <span className="text-primary font-bold">{pendingTasks} active tasks</span>. 
                  Ensure your progress is logged accurately to maintain the highest system standard.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass border-none rounded-3xl shadow-xl overflow-hidden group">
              <div className="absolute inset-x-0 bottom-0 h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
              <CardHeader className="pb-2">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Awaiting Completion</p>
                <CardTitle className="text-4xl font-black text-foreground">{pendingTasks} <span className="text-lg font-medium text-muted-foreground">Pending</span></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-primary text-sm font-bold">
                  <Clock size={16} /> Current active pipeline
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass border-none rounded-3xl shadow-xl overflow-hidden group bg-accent/5">
              <div className="absolute inset-x-0 bottom-0 h-1 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
              <CardHeader className="pb-2">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Monthly Productivity</p>
                <CardTitle className="text-4xl font-black text-foreground">{completedTasks} <span className="text-lg font-medium text-muted-foreground">Completed</span></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-accent text-sm font-bold">
                  <CheckCircle size={16} /> Successfully verified
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Task List */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              Personal Task Queue <span className="text-xs px-2 py-0.5 bg-border/50 rounded-md font-mono">{tasks.length}</span>
            </h3>
            
            {tasks.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="glass rounded-3xl p-20 text-center space-y-4"
              >
                <AlertCircle size={64} className="mx-auto text-muted-foreground opacity-20" />
                <div className="space-y-1">
                  <p className="text-xl font-bold text-muted-foreground">Queue Initialized</p>
                  <p className="text-sm text-muted-foreground">No tasks assigned to your node yet. Contact admin for distribution.</p>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {tasks.map((task: any) => (
                  <motion.div
                    key={task._id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.01 }}
                    className="glass border-none rounded-3xl overflow-hidden transition-all hover:shadow-2xl hover:shadow-primary/5"
                  >
                    <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-hero-gradient opacity-50" />
                      
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="text-2xl font-black text-foreground tracking-tight">{task.title}</h4>
                          <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            task.status === 'completed' ? 'bg-accent/20 text-accent border border-accent/20' : 
                            task.status === 'in-progress' ? 'bg-blue-500/20 text-blue-600 border border-blue-500/20' : 
                            'bg-yellow-500/20 text-yellow-600 border border-yellow-500/20'
                          }`}>
                            {task.status}
                          </span>
                        </div>
                        
                        <p className="text-muted-foreground leading-relaxed text-lg max-w-3xl">{task.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-6 pt-2">
                          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                            <Clock size={16} className="text-primary" /> 
                            <span>Timeline: <span className="text-foreground">{new Date(task.dueDate).toLocaleDateString()}</span></span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                            <AlertCircle size={16} className="text-accent" />
                            <span>Resources: <span className="text-foreground font-black">{task.attachments?.length || 0} Files</span></span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-48">
                          <Select 
                            defaultValue={task.status} 
                            onValueChange={(val) => updateStatusMutation.mutate({ taskId: task._id, status: val })}
                            disabled={updateStatusMutation.isPending}
                          >
                            <SelectTrigger className="bg-white/50 border-border/50 py-6 h-auto text-sm font-black uppercase tracking-widest rounded-2xl group transition-all hover:bg-white hover:border-primary">
                              <SelectValue placeholder="STATUS" />
                            </SelectTrigger>
                            <SelectContent className="glass backdrop-blur-3xl border-border/50 rounded-2xl">
                              <SelectItem value="pending" className="focus:bg-yellow-500/10 focus:text-yellow-600 font-bold">PENDING</SelectItem>
                              <SelectItem value="in-progress" className="focus:bg-blue-500/10 focus:text-blue-600 font-bold">IN PROGRESS</SelectItem>
                              <SelectItem value="completed" className="focus:bg-accent/10 focus:text-accent font-bold">COMPLETED</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default InternDashboard;
