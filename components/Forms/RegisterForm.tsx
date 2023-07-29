'use client';

import { signIn } from 'next-auth/react';
import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toastSuccess } from '@/utils/toasts';

export const RegisterForm = () => {
  let [loading, setLoading] = useState(false);
  let [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify(formValues),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setLoading(false);
      if (res.ok) {
        toastSuccess('Account created');
      }
      if (!res.ok) {
        alert((await res.json()).message);
        return;
      }

      signIn(undefined, { callbackUrl: '/' });
    } catch (error: any) {
      setLoading(false);
      console.error(error);
      alert(error.message);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };
  const input_style =
    'form-control block w-full px-4 py-5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none';

  return (
    <form onSubmit={onSubmit}>
      {error && (
        <p className="py-4 mb-6 text-center bg-red-300 rounded">{error}</p>
      )}
      <div>
        <div className="mb-6">
          <input
            required
            type="text"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            placeholder="Full name"
            className={`${input_style}`}
          />
        </div>
        <div className="mb-6">
          <input
            required
            type="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            placeholder="Email address"
            className={`${input_style}`}
          />
        </div>
        <div className="mb-6">
          <input
            required
            type="password"
            name="password"
            value={formValues.password}
            onChange={handleChange}
            placeholder="Password"
            className={`${input_style}`}
          />
        </div>
        <button
          className="inline-block w-full py-4 text-sm font-medium leading-snug text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded shadow-md px-7 hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg"
          disabled={loading}
        >
          {loading ? 'loading...' : 'Register'}
        </button>
      </div>
      <div className="flex justify-center mt-4">
        <p className="text-gray-600">Already have an account?</p>
        <button
          className="ml-2 text-blue-600"
          onClick={() => router.push('/login')}
        >
          Sign In
        </button>
      </div>
    </form>
  );
};
