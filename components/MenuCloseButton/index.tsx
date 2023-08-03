// MobileCloseButton.tsx
import React from 'react';

interface MobileCloseButtonProps {
  onClick: () => void;
}

const MobileCloseButton: React.FC<MobileCloseButtonProps> = ({ onClick }) => (
  <div className="flex justify-end lg:hidden">
    <button onClick={onClick}>
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
);

export default MobileCloseButton;
