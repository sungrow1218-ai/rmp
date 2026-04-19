import { useState, useEffect } from 'react';
import { debounce } from 'lodash';

function useWindowResize() {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    const debouncedHandleResize = debounce(() => {
      setWindowHeight(window.innerHeight);
    }, 1000);

    window.addEventListener('resize', debouncedHandleResize);

    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
    };
  }, [windowHeight]);

  return windowHeight;
}

export default useWindowResize;
