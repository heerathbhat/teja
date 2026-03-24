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
    <div className="min-h-screen bg-[#f0f9f1] pt-24 pb-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-[#006e3b] mb-2">Intern Dashboard</h1>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white/50">
            <h2 className="text-3xl font-black mb-2 text-gray-800">Welcome, {user.name}!</h2>
            <p className="text-gray-500 font-medium">Here are your current tasks. Keep your progress updated for the admin to track.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-white/50 group hover:shadow-md transition">
            <h3 className="text-xl font-bold text-[#00a859] mb-4">Pending Tasks</h3>
            <p className="text-7xl font-black text-[#00a859] tabular-nums">
              {tasks.filter(t => t.status !== 'completed').length}
            </p>
          </div>
          <div className="bg-[#f0f7ff] p-8 rounded-[2rem] shadow-sm border border-blue-50 group hover:shadow-md transition">
            <h3 className="text-xl font-bold text-[#1e66f5] mb-4">Completed Tasks</h3>
            <p className="text-7xl font-black text-[#1e66f5] tabular-nums">
              {tasks.filter(t => t.status === 'completed').length}
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-black text-[#006e3b] mb-6 ml-2">My Tasks</h2>
        <div className="grid grid-cols-1 gap-6">
          {tasks.map((task) => (
            <div key={task._id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:shadow-md transition">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-gray-800">{task.title}</h3>
                  <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black tracking-tight ${
                    task.status === 'completed' ? 'bg-green-100 text-green-700' : 
                    task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {task.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-600 font-medium mb-4 leading-relaxed max-w-2xl">{task.description}</p>
                <div className="flex flex-wrap gap-4 text-sm font-bold text-gray-400">
                  <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg">
                    <span className="text-[#00a859]">●</span> Assigned by: {task.createdBy?.name || 'Admin'}
                  </span>
                  <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg">
                    <span className="text-[#1e66f5]">●</span> Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
                
                {task.attachments?.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    {task.attachments.map((file, idx) => (
                      <a 
                        key={idx} href={file.url} target="_blank" rel="noopener noreferrer"
                        className="text-xs bg-green-50 text-green-700 px-4 py-2 rounded-xl flex items-center gap-2 font-bold hover:bg-green-100 transition shadow-sm border border-green-100"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                        {file.fileName || 'Attachment'}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <div className="w-full md:w-auto">
                {task.status !== 'completed' && (
                  <button 
                    onClick={() => onStatusChange(task._id, task.status === 'pending' ? 'in-progress' : 'completed')}
                    className="w-full md:w-auto bg-[#1e66f5] text-white px-8 py-4 rounded-2xl font-black hover:bg-[#1554d1] transition shadow-lg text-lg flex items-center justify-center gap-2"
                  >
                    {task.status === 'pending' ? (
                      <>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                        Start Task
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        Done
                      </>
                    )}
                  </button>
                )}
                {task.status === 'completed' && (
                    <div className="flex items-center gap-2 text-green-600 font-black text-xl">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        SUCCESS
                    </div>
                )}
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="bg-white p-20 rounded-[3rem] shadow-sm border border-white text-center">
                <p className="text-2xl font-black text-gray-300 uppercase tracking-widest">No tasks assigned yet</p>
                <p className="text-gray-400 font-medium mt-2">Check back later for updates from the admin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
