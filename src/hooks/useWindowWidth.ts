import { useState, useEffect } from 'react';

export const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial window width on mount
    setWindowWidth(window.innerWidth);

    // Add event listener to update window width on resize
    window.addEventListener('resize', handleResize);

    // Remove event listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowWidth as number;
};

