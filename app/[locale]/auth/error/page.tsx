'use client';

import { useSearchParams } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';

const ErrorPage = () => {
  const searchParams = useSearchParams();

  const error = searchParams.get('error');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
      <Head>
        <title>Error Occurred</title>
      </Head>
      <div className="flex-col justify-center p-6 bg-white rounded-lg shadow-md align-center">
        <h1 className="mb-4 text-2xl font-bold text-red-200">
          An Error Occurred
        </h1>
        {error ? (
          <div className="flex flex-col items-center">
            <p className="mb-4 text-center text-red-600">{error}</p>
            <Link
              href="/auth/login"
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Try Again
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="mb-4 text-center text-gray-600">
              We're sorry, but an error has occurred. Please try again later.
            </p>
            <Link
              href="/auth/login"
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Try Again
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;

