import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { isBlackWeek } from '@/lib/blackWeek';
export function useBlackWeek() {
  const location = useLocation();
  const [active, setActive] = useState(isBlackWeek);
  useEffect(() => {
    const update = () => {
      const enabled = isBlackWeek();
      setActive(enabled);
      document.documentElement.classList.toggle('black-week-active', enabled);
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [location.search, location.pathname]);
  return active;
}