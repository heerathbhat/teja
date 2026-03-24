'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
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

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f9f1] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full p-10 bg-white rounded-[2.5rem] shadow-xl border border-white/50">
        <div>
          <h2 className="mt-2 text-center text-4xl font-black text-[#006e3b]">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-10 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <input
                type="email"
                required
                className="block w-full px-4 py-3 bg-[#f0f7ff] border border-blue-50 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00a859] focus:border-transparent transition"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="block w-full px-4 py-3 bg-[#f0f7ff] border border-blue-50 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00a859] focus:border-transparent transition"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs text-center font-bold mt-2 uppercase tracking-tight">{error}</p>}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 rounded-xl text-white font-black bg-[#00a859] hover:bg-[#008f4c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00a859] transition shadow-lg disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-gray-500">
            Don't have an account?{' '}
            <Link href="/signup" className="font-extrabold text-[#00a859] hover:text-[#008f4c] underline decoration-2 underline-offset-4">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
