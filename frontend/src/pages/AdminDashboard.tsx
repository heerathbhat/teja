import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Plus, LogOut, FileText, CheckCircle, Clock, Users, LayoutDashboard } from 'lucide-react';
import solvimateLogo from '@/assets/solvimate-logo.png';
import ParticleField from '@/components/ParticleField';
import NotificationBell from '@/components/NotificationBell';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch tasks
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data } = await api.get('/tasks');
      return data;
    },
  });

  // Fetch interns
  const { data: interns = [] } = useQuery({
    queryKey: ['interns'],
    queryFn: async () => {
      const { data } = await api.get('/auth/users');
      return data.filter((u: any) => u.role === 'intern');
    },
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (newTask: any) => {
      const formData = new FormData();
      formData.append('title', newTask.title);
      formData.append('description', newTask.description);
      formData.append('assignedTo', newTask.assignedTo);
      formData.append('dueDate', newTask.dueDate);
      if (newTask.files) {
        Array.from(newTask.files as FileList).forEach(file => {
          formData.append('attachments', file);
        });
      }
      const { data } = await api.post('/tasks', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({ title: 'Task created successfully' });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Error creating task',
        description: error.response?.data?.message || 'Something went wrong',
      });
    }
  });

  const handleCreateTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const taskData = {
      title: formData.get('title'),
      description: formData.get('description'),
      assignedTo: formData.get('assignedTo'),
      dueDate: formData.get('dueDate'),
      files: (e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement).files,
    };
    createTaskMutation.mutate(taskData);
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t: any) => t.status === 'pending' || t.status === 'in-progress').length,
    completed: tasks.filter((t: any) => t.status === 'completed').length,
  };

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
            <img src={solvimateLogo} alt="Solvimate" className="h-12 w-auto" />
          </Link>
          <div className="flex items-center gap-6">
            <NotificationBell />
            <span className="text-sm font-medium text-muted-foreground md:block hidden">Admin: <span className="text-foreground">{user?.name} ({user?.email})</span></span>
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
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
                <LayoutDashboard className="text-primary" /> Admin <span className="gradient-text">Dashboard</span>
              </h1>
              <p className="text-muted-foreground mt-2">Oversee tasks, interns, and AI system performance.</p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-accent text-white rounded-xl px-8 py-6 h-auto text-lg font-bold shadow-lg shadow-primary/20 gap-3 group transition-all">
                  <Plus className="group-hover:rotate-90 transition-transform" /> Create New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="glass backdrop-blur-2xl border-border/50 rounded-3xl max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">New Task Detail</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateTask} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Task Title</Label>
                    <Input id="title" name="title" className="bg-white/50" required placeholder="Project Alpha" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Requirement Description</Label>
                    <Input id="description" name="description" className="bg-white/50" required placeholder="Dataset labeling for NLP..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignedTo">Assign To Intern</Label>
                    <Select name="assignedTo" required>
                      <SelectTrigger className="bg-white/50">
                        <SelectValue placeholder="Select an intern" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {interns.map((intern: any) => (
                          <SelectItem key={intern._id} value={intern._id}>{intern.name} ({intern.email})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Deadline</Label>
                    <Input id="dueDate" name="dueDate" type="date" className="bg-white/50" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="files">Resource Files</Label>
                    <Input id="files" name="files" type="file" multiple className="bg-white/50 cursor-pointer" />
                  </div>
                  <Button type="submit" disabled={createTaskMutation.isPending} className="w-full bg-primary py-6 text-lg font-bold rounded-xl mt-4">
                    {createTaskMutation.isPending ? 'Publishing Task...' : 'Launch Task'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </motion.div>

          {/* Stats Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass border-none rounded-3xl shadow-xl overflow-hidden group">
              <div className="absolute inset-x-0 bottom-0 h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
              <CardHeader className="pb-2">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Active Workspace</p>
                <CardTitle className="text-4xl font-black text-foreground">{stats.total} <span className="text-lg font-medium text-muted-foreground">Tasks</span></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-primary text-sm font-bold">
                  <FileText size={16} /> Total volume of work
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass border-none rounded-3xl shadow-xl overflow-hidden group">
              <div className="absolute inset-x-0 bottom-0 h-1 bg-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
              <CardHeader className="pb-2">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">In Progress</p>
                <CardTitle className="text-4xl font-black text-foreground">{stats.pending} <span className="text-lg font-medium text-muted-foreground">Pending</span></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-yellow-600 text-sm font-bold">
                  <Clock size={16} /> Waiting for completion
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass border-none rounded-3xl shadow-xl overflow-hidden group">
              <div className="absolute inset-x-0 bottom-0 h-1 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
              <CardHeader className="pb-2">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Efficiency Metric</p>
                <CardTitle className="text-4xl font-black text-foreground">{stats.completed} <span className="text-lg font-medium text-muted-foreground">Delivered</span></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-accent text-sm font-bold">
                  <CheckCircle size={16} /> Successfully processed
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Grid: Tasks & Interns */}
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Task Table */}
            <motion.section variants={itemVariants} className="lg:col-span-3 space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold">Recent Output Pipeline</h2>
              </div>
              <Card className="glass border-none rounded-3xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-primary/10 text-primary text-xs uppercase font-extrabold tracking-widest">
                      <tr>
                        <th className="px-6 py-5">Objective</th>
                        <th className="px-6 py-5">Personnel</th>
                        <th className="px-6 py-5">System Status</th>
                        <th className="px-6 py-5">Files</th>
                        <th className="px-6 py-5">Timeline</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {tasks.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-16 text-center">
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                              <FileText size={48} className="opacity-20" />
                              <p className="text-lg font-medium italic">Pipeline Empty</p>
                              <p>Initiate a new task to begin tracking.</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        tasks.map((task: any) => (
                          <tr key={task._id} className="hover:bg-primary/5 transition-colors group">
                            <td className="px-6 py-5">
                              <div className="font-bold text-foreground group-hover:text-primary transition-colors">{task.title}</div>
                              <div className="text-xs text-muted-foreground line-clamp-1 truncate max-w-xs">{task.description}</div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                                  {task.assignedTo?.name?.charAt(0) || '?'}
                                </div>
                                <span className="font-medium text-sm">{task.assignedTo?.name || 'Unassigned'} {task.assignedTo?.email ? `(${task.assignedTo.email})` : ''}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                task.status === 'completed' ? 'bg-accent/20 text-accent border border-accent/20' : 
                                task.status === 'in-progress' ? 'bg-blue-500/20 text-blue-600 border border-blue-500/20' : 
                                'bg-yellow-500/20 text-yellow-600 border border-yellow-500/20'
                              }`}>
                                {task.status}
                              </span>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                                <FileText size={14} /> {task.attachments?.length || 0}
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="text-sm font-bold text-foreground">{new Date(task.dueDate).toLocaleDateString()}</div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.section>

            {/* Side: Interns */}
            <motion.section variants={itemVariants} className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2"><Users size={20} className="text-primary" /> Personnel</h2>
              <div className="space-y-4">
                {interns.length === 0 ? (
                  <p className="text-muted-foreground italic text-sm">No active interns detected.</p>
                ) : (
                  interns.map((intern: any) => (
                    <motion.div 
                      key={intern._id}
                      whileHover={{ x: 5 }}
                      className="glass border-none rounded-2xl p-4 flex items-center space-x-4 shadow-md transition-all hover:bg-white/90"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-hero-gradient flex items-center justify-center text-white font-black text-xl shadow-lg">
                        {intern.name.charAt(0)}
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="font-extrabold text-foreground truncate">{intern.name} ({intern.email})</h3>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.section>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;
