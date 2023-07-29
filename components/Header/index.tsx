'use client';
import { useState, useEffect, useRef } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

interface User {
  name: string;
  email: string;
  role: 'admin' | 'user' | 'participant';
}
const Header = () => {
  const { data: session } = useSession();
  const user = session?.user as User;
  const [isOpen, setIsOpen] = useState(false);
  const node = useRef<HTMLUListElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (node.current && node.current.contains(e.target as Node)) {
      return;
    }
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <header className="relative z-10 h-20 bg-white shadow-md">
      <nav className="container flex items-center justify-between h-full px-6 mx-auto lg:px-0">
        <div>
          <Link
            href="/"
            className="text-2xl font-semibold text-gray-800 transition-all hover:text-gray-600"
          >
            Network Canvas
          </Link>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6 text-purple-500"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
        <ul
          ref={node}
          className={`fixed right-0 top-0 h-full w-full p-6 bg-white transform transition-transform duration-300 ease-in-out overflow-y-auto ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          } lg:translate-x-0 lg:static lg:flex lg:bg-transparent lg:h-auto lg:items-center lg:gap-4 lg:overflow-visible lg:p-0 lg:w-auto`}
        >
          {isOpen && (
            <div className="flex justify-end lg:hidden">
              <button onClick={() => setIsOpen(false)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6 text-purple-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
          <li className="mb-2 lg:mb-0">
            <Link
              href="/"
              className="text-gray-800 transition-all hover:text-gray-600"
            >
              Home
            </Link>
          </li>
          {!user && (
            <>
              <li className="mb-2 lg:mb-0">
                <Link
                  href="/login"
                  className="text-gray-800 transition-all hover:text-gray-600"
                >
                  Login
                </Link>
              </li>
              <li className="mb-2 lg:mb-0">
                <Link
                  href="/register"
                  className="text-gray-800 transition-all hover:text-gray-600"
                >
                  Register
                </Link>
              </li>
            </>
          )}
          {user && (
            <>
              <li className="mb-2 lg:mb-0">
                <Link
                  href="/files"
                  className="text-gray-800 transition-all hover:text-gray-600"
                >
                  Files
                </Link>
              </li>
              {user.role === 'admin' && (
                <li className="mb-2 lg:mb-0">
                  <Link
                    href="/upload"
                    className="text-gray-800 transition-all hover:text-gray-600"
                  >
                    Admin Upload
                  </Link>
                </li>
              )}
              <li
                className="mb-2 text-gray-800 transition-all cursor-pointer lg:mb-0 hover:text-gray-600"
                onClick={() => signOut()}
              >
                Logout
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
