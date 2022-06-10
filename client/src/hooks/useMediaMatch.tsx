import { useEffect, useMemo, useState } from 'react';

const useMediaMatch = () => {
  const isDark = useMemo(() => matchMedia('(prefers-color-scheme:dark)'), []);
  const [dark, setDark] = useState<boolean>(() => isDark.matches);
  useEffect(() => {
    const callOnChange = (e: MediaQueryListEvent) => {
      setDark(e.matches);
    };
    isDark.addEventListener('change', callOnChange);

    return () => {
      isDark.removeEventListener('change', callOnChange, true);
    };
  }, [isDark]);
  return dark;
};

export default useMediaMatch;
