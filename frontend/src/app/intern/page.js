'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getTasks, updateTask, reset } from '@/redux/slices/taskSlice';
import toast from 'react-hot-toast';

export default function InternDashboard() {
  const { user } = useSelector((state) => state.auth);
  const { tasks, isLoading, isError, message } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'intern') {
      router.push('/login');
    } else {
      dispatch(getTasks());
    }
  }, [user, router, dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
  }, [isError, message, dispatch]);

  const onStatusChange = (id, status) => {
    toast.promise(
      dispatch(updateTask({ id, taskData: { status } })).unwrap(),
      {
        loading: 'Updating status...',
        success: 'Task status updated!',
        error: (err) => `Failed: ${err}`
      }
    );
  };

  if (!user || user.role !== 'intern') return null;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Intern Dashboard</h1>
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Welcome, {user.name}!</h2>
        <p className="text-gray-600">Here are your current tasks. Keep your progress updated for the admin to track.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-green-50 p-6 rounded-xl border border-green-100">
          <h3 className="text-lg font-bold text-green-800 mb-2">Pending Tasks</h3>
          <p className="text-3xl font-bold text-green-700">
            {tasks.filter(t => t.status !== 'completed').length}
          </p>
        </div>
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <h3 className="text-lg font-bold text-blue-800 mb-2">Completed Tasks</h3>
          <p className="text-3xl font-bold text-blue-700">
            {tasks.filter(t => t.status === 'completed').length}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task._id} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold mb-1">{task.title}</h3>
              <p className="text-gray-600 mb-2">{task.description}</p>
              <div className="flex gap-4 text-sm text-gray-500 mt-1">
                <span>Created by: {task.createdBy?.name || 'Admin'}</span>
                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
              {task.attachments?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {task.attachments.map((file, idx) => (
                    <a 
                      key={idx} href={file.url} target="_blank" rel="noopener noreferrer"
                      className="text-xs bg-gray-100 text-blue-600 px-2 py-1 rounded flex items-center gap-1 hover:bg-gray-200"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                      {file.fileName || 'Attachment'}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold text-center ${
                task.status === 'completed' ? 'bg-green-100 text-green-800' : 
                task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {task.status.toUpperCase()}
              </span>
              {task.status !== 'completed' && (
                <button 
                  onClick={() => onStatusChange(task._id, task.status === 'pending' ? 'in-progress' : 'completed')}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition"
                >
                  {task.status === 'pending' ? 'Start Task' : 'Complete Task'}
                </button>
              )}
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <p className="text-center text-gray-500 italic">No tasks assigned yet.</p>
        )}
      </div>
    </div>
  );
}
