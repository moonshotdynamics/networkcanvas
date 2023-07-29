'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';

export const LoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const callbackUrl = '/';

  const handleRegister = () => {
    router.push('/register');
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setFormValues({ email: '', password: '' });

      const res = await signIn('credentials', {
        redirect: true,
        email: formValues.email,
        password: formValues.password,
        callbackUrl,
      });

      setLoading(false);

      if (!res?.error) {
        router.push(callbackUrl);
      } else {
        setError('invalid email or password');
      }
    } catch (error: any) {
      setLoading(false);
      setError(error);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const input_style =
    'form-control block w-full px-4 py-5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none';

  return (
    <>
      <form onSubmit={onSubmit}>
        {error && (
          <p className="py-4 mb-6 text-center bg-red-300 rounded">{error}</p>
        )}
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
          type="submit"
          style={{ backgroundColor: `${loading ? '#ccc' : '#3446eb'}` }}
          className="inline-block w-full py-4 text-sm font-medium leading-snug text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded shadow-md px-7 hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg"
          disabled={loading}
        >
          {loading ? 'loading...' : 'Sign In'}
        </button>

        <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
          <p className="mx-4 mb-0 font-semibold text-center">OR</p>
        </div>

        <a
          className="flex items-center justify-center w-full py-2 text-sm font-medium leading-snug text-white uppercase transition duration-150 ease-in-out rounded shadow-md px-7 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg"
          style={{ backgroundColor: '#55acee' }}
          onClick={() => signIn('github', { callbackUrl })}
          role="button"
        >
          <img
            className="pr-2"
            src="/images/github.svg"
            alt=""
            style={{ height: '2.2rem' }}
          />
          Continue with GitHub
        </a>
      </form>
      <div className="flex justify-center mt-4">
        <p className="text-gray-600">Don&apos;t have an account?</p>
        <button className="ml-2 text-blue-600" onClick={handleRegister}>
          Register
        </button>
      </div>
    </>
  );
};
