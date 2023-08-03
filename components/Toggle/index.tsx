import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const switchTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div>
      <button onClick={switchTheme} className="text-xl">
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </div>
  );
};

export default ThemeSwitcher;
