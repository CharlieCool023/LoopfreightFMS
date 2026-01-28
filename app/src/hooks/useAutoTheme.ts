import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export function useAutoTheme(): Theme {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const updateTheme = () => {
      const hour = new Date().getHours();
      // Light mode from 6 AM to 6 PM (6-18)
      // Dark mode from 6 PM to 6 AM
      const isDaytime = hour >= 6 && hour < 18;
      setTheme(isDaytime ? 'light' : 'dark');
    };

    // Initial check
    updateTheme();

    // Update every minute to catch time changes
    const interval = setInterval(updateTheme, 60000);

    return () => clearInterval(interval);
  }, []);

  return theme;
}

export default useAutoTheme;
