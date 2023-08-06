import React from 'react';
import Link from 'next/link';
import ThemeSwitcher from '../Toggle';
import { signOut } from 'next-auth/react';

interface NavLinksProps {
  user: User | null;
}

const NavLinks: React.FC<NavLinksProps> = ({ user }) => {
  if (!user) {
    return (
      <>
        <li className="mb-2 lg:mb-0">
          <Link
            href="/"
            className="text-gray-800 transition-all hover:text-gray-600"
          >
            Home
          </Link>
        </li>
        <li className="mb-2 lg:mb-0">
          <Link
            href="/auth/login"
            className="text-gray-800 transition-all hover:text-gray-600"
          >
            Login
          </Link>
        </li>
        <li className="mb-2 lg:mb-0">
          <Link
            href="/auth/register"
            className="text-gray-800 transition-all hover:text-gray-600"
          >
            Register
          </Link>
        </li>
      </>
    );
  }

  return (
    <>
      <li className="mb-2 lg:mb-0">
        <Link
          href="/"
          className="text-gray-800 transition-all hover:text-gray-600"
        >
          Home
        </Link>
      </li>
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
            File Upload
          </Link>
        </li>
      )}
      <li
        className="mb-2 text-gray-800 transition-all cursor-pointer lg:mb-0 hover:text-gray-600"
        onClick={() => signOut()}
      >
        Logout
      </li>
      <ThemeSwitcher />
    </>
  );
};

export default NavLinks;
