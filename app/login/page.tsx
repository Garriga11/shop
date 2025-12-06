// app/login/page.tsx
'use client'

import { signIn, getSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const res = await signIn('credentials', {
      redirect: false, // Prevent automatic redirect, we'll handle it manually
      email,
      password,
    });

    if (res?.error) {
      setError('Invalid login credentials');
    } else {
      // Get the updated session to check user role
      const session = await getSession();
      const userRole = (session?.user as any)?.role;
      const userEmail = session?.user?.email;
      const roleId = (session?.user as any)?.roleId;
      
      console.log('🔍 Login Debug - Full Session:', {
        userRole,
        userEmail, 
        roleId,
        fullSession: session
      });
      
      // Primary routing: Use role name from database
      if (userRole === 'Admin User') {
        console.log('✅ Redirecting admin user to admin dashboard');
        router.push('/dashboard/admin');
      } else if (userRole === 'Tech User') {
        console.log('✅ Redirecting tech user to tech dashboard');
        router.push('/dashboard/tech');
      } 
      // Fallback: Use email-based routing if role is unclear
      else if (userEmail === 'admin@example.com' || userEmail?.includes('admin')) {
        console.log('🔄 Using email fallback for admin user');
        router.push('/dashboard/admin');
      } else if (userEmail === 'tech@example.com' || userEmail?.includes('tech')) {
        console.log('🔄 Using email fallback for tech user');
        router.push('/dashboard/tech');
      } 
      // Default for regular users
      else {
        console.log('🔄 Default routing for regular user');
        router.push('/dashboard/user');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4 p-4">Login</h2>
      
      {/* Demo Credentials Section */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-medium text-blue-800 mb-2">🚀 Demo Access</h3>
        <p className="text-sm text-blue-700 mb-3">For employers and demo purposes, use these credentials:</p>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center p-2 bg-white rounded border">
            <div>
              <strong className="text-blue-600">Admin User:</strong>
              <div className="text-gray-600">admin@example.com / adminpassword123</div>
            </div>
            <button 
              type="button"
              onClick={() => {
                setEmail('admin@example.com');
                setPassword('adminpassword123');
              }}
              className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
            >
              Use
            </button>
          </div>
          
          <div className="flex justify-between items-center p-2 bg-white rounded border">
            <div>
              <strong className="text-green-600">Tech User:</strong>
              <div className="text-gray-600">tech@example.com / techpassword123</div>
            </div>
            <button 
              type="button"
              onClick={() => {
                setEmail('tech@example.com');
                setPassword('techpassword123');
              }}
              className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
            >
              Use
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button type="submit" className="w-full p-2 bg-blue-600 p-6 text-white rounded hover:bg-blue-700">
          Login
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    );
  }
  
