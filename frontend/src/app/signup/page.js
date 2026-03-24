'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '@/redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'intern',
  });
  
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/intern');
      }
    }
  }, [user, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signup(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f9f1] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full p-10 bg-white rounded-[2.5rem] shadow-xl border border-white/50">
        <div>
          <h2 className="mt-2 text-center text-4xl font-black text-[#006e3b]">
            Create your account
          </h2>
        </div>
        <form className="mt-10 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <input
                name="name"
                type="text"
                required
                className="block w-full px-4 py-3 bg-white border border-green-100 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00a859] focus:border-transparent transition"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                name="email"
                type="email"
                required
                className="block w-full px-4 py-3 bg-white border border-green-100 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00a859] focus:border-transparent transition"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                required
                className="block w-full px-4 py-3 bg-white border border-green-100 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00a859] focus:border-transparent transition"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <select
                name="role"
                className="block appearance-none w-full px-4 py-3 bg-white border border-green-100 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00a859] focus:border-transparent transition"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="intern">Intern</option>
                <option value="admin">Admin</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-xs text-center font-bold mt-2 uppercase tracking-tight">{error}</p>}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 rounded-xl text-white font-black bg-[#00a859] hover:bg-[#008f4c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00a859] transition shadow-lg disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>
        </form>
        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="font-extrabold text-[#00a859] hover:text-[#008f4c] underline decoration-2 underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
