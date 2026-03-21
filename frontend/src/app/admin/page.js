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
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {showForm ? 'Cancel' : 'Create Task'}
        </button>
      </div>

      {showForm && (
        <div className="mb-10 bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Assign New Task</h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input 
                type="text" name="title" value={formData.title} onChange={onChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                name="description" value={formData.description} onChange={onChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" rows="3" required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign Intern</label>
                <select 
                  name="assignedTo" value={formData.assignedTo} onChange={onChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required
                >
                  <option value="">Select an Intern</option>
                  {interns.map(intern => (
                    <option key={intern._id} value={intern._id}>{intern.name} ({intern.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input 
                  type="date" name="dueDate" value={formData.dueDate} onChange={onChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attachments (Max 5)</label>
              <input 
                type="file" name="attachments" multiple onChange={onChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {files.length > 0 && <p className="mt-1 text-xs text-blue-600">{files.length} file(s) selected</p>}
            </div>
            <button type="submit" className="w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700">
              Publish Task
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold mb-2">Total Tasks</h2>
          <p className="text-4xl font-bold text-green-600">{tasks.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold mb-2">Pending</h2>
          <p className="text-4xl font-bold text-blue-600">
            {tasks.filter(t => t.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold mb-2">Completed</h2>
          <p className="text-4xl font-bold text-purple-600">
            {tasks.filter(t => t.status === 'completed').length}
          </p>
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Tasks</h2>
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Task Name</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Assigned To</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Files</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tasks.length > 0 ? tasks.map((task) => (
                <tr key={task._id}>
                  <td className="px-6 py-4 font-medium">{task.title}</td>
                  <td className="px-6 py-4">{task.assignedTo?.name || 'Unknown'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      task.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {task.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {task.attachments?.length > 0 ? (
                      <span className="flex items-center gap-1 text-blue-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                        {task.attachments.length}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{new Date(task.dueDate).toLocaleDateString()}</td>
                </tr>
              )) : (
                <tr>
                  <td className="px-6 py-4 text-gray-400 italic" colSpan="4">No tasks found. Click "Create Task" to begin.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Available Interns</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {interns.map((intern) => (
            <div key={intern._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                {intern.name[0]}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{intern.name}</p>
                <p className="text-xs text-gray-500 truncate">{intern.email}</p>
              </div>
            </div>
          ))}
          {interns.length === 0 && (
            <p className="text-gray-400 italic">No interns registered yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
