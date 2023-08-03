'use client'
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import NavLinks from '@/components/NavLinks';
import MobileCloseButton from '@/components/MenuCloseButton';

const Header: React.FC = () => {
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
          {isOpen && <MobileCloseButton onClick={() => setIsOpen(false)} />}
          <NavLinks user={user} />
        </ul>
      </nav>
    </header>
  );
};

export default Header;
