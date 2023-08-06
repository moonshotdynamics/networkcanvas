import React from 'react';
import Link from 'next/link';
import ThemeSwitcher from '../Toggle';
import { signOut } from 'next-auth/react';

interface NavLinksProps {
  user: User | null;
  closeMenu: () => void;
}

const NavLinks: React.FC<NavLinksProps> = ({ user, closeMenu }) => {
  if (!user) {
    return (
      <>
        <li className="mb-2 lg:mb-0">
          <Link
            href="/"
            className="text-gray-800 transition-all hover:text-gray-600 dark:text-white"
            onClick={closeMenu}
          >
            Home
          </Link>
        </li>
        <li className="mb-2 lg:mb-0">
          <Link
            href="/auth/login"
            className="text-gray-800 transition-all hover:text-gray-600 dark:text-white"
            onClick={closeMenu}
          >
            Login
          </Link>
        </li>
        <li className="mb-2 lg:mb-0">
          <Link
            href="/auth/register"
            className="text-gray-800 transition-all hover:text-gray-600 dark:text-white"
            onClick={closeMenu}
          >
            Register
          </Link>
        </li>
        <ThemeSwitcher />
      </>
    );
  }

  return (
    <>
      <li className="mb-2 lg:mb-0">
        <Link
          href="/"
          className="text-gray-800 transition-all hover:text-gray-600 dark:text-white"
          onClick={closeMenu}
        >
          Home
        </Link>
      </li>
      <li className="mb-2 lg:mb-0">
        <Link
          href="/files"
          className="text-gray-800 transition-all hover:text-gray-600 dark:text-white"
          onClick={closeMenu}
        >
          Files
        </Link>
      </li>
      {user.role === 'admin' && (
        <li className="mb-2 lg:mb-0">
          <Link
            href="/upload"
            className="text-gray-800 transition-all hover:text-gray-600 dark:text-white"
            onClick={closeMenu}
          >
            File Upload
          </Link>
        </li>
      )}
      <li
        className="mb-2 text-gray-800 transition-all cursor-pointer lg:mb-0 hover:text-gray-600 dark:text-white"
        onClick={() => { signOut();  closeMenu}}
      >
        Logout
      </li>
      <ThemeSwitcher />
    </>
  );
};

export default NavLinks;
