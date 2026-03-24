'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getTasks, createTask, reset } from '@/redux/slices/taskSlice';
import { getUsers } from '@/redux/slices/authSlice';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { user, users } = useSelector((state) => state.auth);
  const { tasks, isLoading, isError, isSuccess, message } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();
  const router = useRouter();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: ''
  });
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
    } else {
      dispatch(getTasks());
      dispatch(getUsers());
    }
  }, [user, router, dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
    if (isSuccess && !isLoading) {
      toast.success('Task updated/created successfully!');
      dispatch(reset());
    }
  }, [isError, isSuccess, isLoading, message, dispatch]);

  const onChange = (e) => {
    if (e.target.name === 'attachments') {
      setFiles(Array.from(e.target.files));
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('assignedTo', formData.assignedTo);
    data.append('dueDate', formData.dueDate);
    
    files.forEach((file) => {
      data.append('attachments', file);
    });

    toast.promise(
      dispatch(createTask(data)).unwrap(),
      {
        loading: 'Publishing task...',
        success: 'Task published!',
        error: (err) => `Failed: ${err}`
      }
    );
    
    setShowForm(false);
    setFormData({ title: '', description: '', assignedTo: '', dueDate: '' });
    setFiles([]);
  };

  const interns = users.filter(u => u.role === 'intern');

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-[#f0f9f1] pt-24 pb-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-black text-[#006e3b]">Admin Dashboard</h1>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-[#1e66f5] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#1554d1] transition shadow-md"
          >
            {showForm ? 'Cancel' : 'Create Task'}
          </button>
        </div>

        {showForm && (
          <div className="mb-12 bg-white p-8 rounded-3xl shadow-sm border border-green-100 animate-in fade-in slide-in-from-top-4 duration-300">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Assign New Task</h2>
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600 ml-1">Task Title</label>
                  <input 
                    type="text" name="title" value={formData.title} onChange={onChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#00a859] outline-none transition" required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600 ml-1">Due Date</label>
                  <input 
                    type="date" name="dueDate" value={formData.dueDate} onChange={onChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#00a859] outline-none transition" required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 ml-1">Description</label>
                <textarea 
                  name="description" value={formData.description} onChange={onChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#00a859] outline-none transition" rows="3" required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600 ml-1">Assign Intern</label>
                  <select 
                    name="assignedTo" value={formData.assignedTo} onChange={onChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#00a859] outline-none transition" required
                  >
                    <option value="">Select an Intern</option>
                    {interns.map(intern => (
                      <option key={intern._id} value={intern._id}>{intern.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600 ml-1">Attachments</label>
                  <input 
                    type="file" name="attachments" multiple onChange={onChange}
                    className="w-full p-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-green-100 file:text-green-700 hover:file:bg-green-200 transition file:cursor-pointer"
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-[#00a859] text-white py-4 rounded-2xl font-bold hover:bg-[#008f4c] transition shadow-lg mt-4">
                Publish Task
              </button>
            </form>
          </div>
        )}

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-white/50 relative overflow-hidden group hover:shadow-md transition">
            <h2 className="text-lg font-bold text-gray-700 mb-4">Total Tasks</h2>
            <p className="text-6xl font-black text-[#00a859] tabular-nums">{tasks.length}</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-white/50 relative overflow-hidden group hover:shadow-md transition">
            <h2 className="text-lg font-bold text-gray-700 mb-4">Pending</h2>
            <p className="text-6xl font-black text-[#1e66f5] tabular-nums">
              {tasks.filter(t => t.status === 'pending' || t.status === 'in-progress').length}
            </p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-white/50 relative overflow-hidden group hover:shadow-md transition">
            <h2 className="text-lg font-bold text-gray-700 mb-4">Completed</h2>
            <p className="text-6xl font-black text-[#a132ff] tabular-nums">
              {tasks.filter(t => t.status === 'completed').length}
            </p>
          </div>
        </div>
        
        {/* RECENT TASKS */}
        <div className="mb-12">
          <h2 className="text-2xl font-black text-[#006e3b] mb-6 ml-2">Recent Tasks</h2>
          <div className="bg-white rounded-[2rem] shadow-sm border border-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-5 text-sm font-bold text-[#00a859] uppercase tracking-wider">Task Name</th>
                    <th className="px-8 py-5 text-sm font-bold text-[#00a859] uppercase tracking-wider">Assigned To</th>
                    <th className="px-8 py-5 text-sm font-bold text-[#00a859] uppercase tracking-wider">Status</th>
                    <th className="px-8 py-5 text-sm font-bold text-[#00a859] uppercase tracking-wider">Files</th>
                    <th className="px-8 py-5 text-sm font-bold text-[#00a859] uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {tasks.length > 0 ? tasks.map((task) => (
                    <tr key={task._id} className="hover:bg-green-50/30 transition group">
                      <td className="px-8 py-5 font-bold text-gray-800">{task.title}</td>
                      <td className="px-8 py-5 text-gray-600 font-medium">{task.assignedTo?.name || 'Unknown'}</td>
                      <td className="px-8 py-5">
                        <span className={`px-4 py-1.5 rounded-2xl text-xs font-black tracking-tight ${
                          task.status === 'completed' ? 'bg-green-100 text-green-700' : 
                          task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {task.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        {task.attachments?.length > 0 ? (
                          <div className="flex -space-x-2">
                            {task.attachments.map((file, i) => (
                              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-600 shadow-sm">
                                doc
                              </div>
                            ))}
                          </div>
                        ) : <span className="text-gray-300">-</span>}
                      </td>
                      <td className="px-8 py-5 text-gray-500 font-medium">{new Date(task.dueDate).toLocaleDateString()}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td className="px-8 py-10 text-gray-400 font-medium italic text-center" colSpan="5">No tasks found. Click "Create Task" to begin.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* AVAILABLE INTERNS */}
        <div>
          <h2 className="text-2xl font-black text-[#006e3b] mb-6 ml-2">Available Interns</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {interns.map((intern) => (
              <div key={intern._id} className="bg-white p-5 rounded-3xl shadow-sm border border-white hover:shadow-md transition flex items-center gap-4 group">
                <div className="w-14 h-14 bg-green-100 text-[#00a859] rounded-full flex items-center justify-center text-xl font-black transition group-hover:scale-110">
                  {intern.name[0]}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-gray-800 truncate">{intern.name}</p>
                  <p className="text-xs text-gray-400 truncate">{intern.email}</p>
                </div>
              </div>
            ))}
            {interns.length === 0 && (
              <p className="text-gray-400 font-medium italic col-span-full ml-2 uppercase tracking-widest opacity-60">No interns registered yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
