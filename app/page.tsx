'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { toastSuccess, toastError } from '@/utils/toasts';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'participant';
}

export default function Home() {
  const { data: session, status, update } = useSession();
  const [selectedRole, setSelectedRole] = useState<
    'admin' | 'user' | 'participant'
  >();
  const user = session?.user as User & { role: string };
  useEffect(() => {
    setSelectedRole(user?.role);
  }, [user]);

  const updateRole = async (newRole: 'admin' | 'user' | 'participant') => {
    if (user?.role !== newRole) {
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.id,
            role: newRole,
          }),
        });

        if (response.ok) {
          toastSuccess('Role updated');
          update({
            ...session,
            user: {
              ...user,
              role: newRole,
            },
          });
        } else {
          toastError('Failed to update role');
          console.error('Failed to update role');
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('Cannot update role to current role.');
      toastError('Cannot update role to current role.');
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-purple-600">
        <p>Loading...</p>
      </div>
    );
  }

  return status === 'authenticated' ? (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
      <nav className="absolute top-0 flex items-center justify-around w-full h-16 bg-purple-700"></nav>
      <main className="flex flex-col items-center justify-center text-white">
        <h1 className="mb-4 text-3xl">{'title'}</h1>
        <pre className="mb-8 text-lg">{JSON.stringify(user?.role)}</pre>

        <h2 className="mt-8 mb-4 text-2xl">{'accountRole'}</h2>

        <select
          value={selectedRole}
          onChange={(e) =>
            setSelectedRole(e.target.value as 'admin' | 'user' | 'participant')
          }
          className="w-full px-4 py-2 mb-4 text-sm text-black bg-white border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        >
          <option disabled={user?.role === 'participant'} value="participant">
            Participant
          </option>
          <option disabled={user?.role === 'user'} value="user">
            User
          </option>
          <option disabled={user?.role === 'admin'} value="admin">
            Admin
          </option>
        </select>

        <button
          className="px-6 py-3 text-white transition-all duration-200 ease-in-out rounded-full bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600"
          onClick={() => {
            selectedRole && updateRole(selectedRole);
          }}
        >
          Update Role
        </button>
      </main>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
      <h1 className="mb-4 text-sm text-white sm:text-base md:text-lg lg:text-xl xl:text-2xl">
        {('unauthenticated')}
      </h1>
      <a
        href="/login"
        className="px-2 py-1 text-white transition-all duration-200 ease-in-out rounded-full sm:px-3 sm:py-2 md:px-4 md:py-2 lg:px-6 lg:py-3 xl:px-8 xl:py-4 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600"
      >
        Sign in
      </a>
    </div>
  );
}
