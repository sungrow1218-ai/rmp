import { useState, useEffect } from 'react';
import useWindowResize from './useWindowResize';

function useHeightResize(domRef: React.MutableRefObject<unknown>) {
  const windowResize = useWindowResize();
  const [width, setWidth] = useState(
    domRef.current ? (domRef.current as HTMLElement).offsetWidth : 0
  );

  useEffect(() => {
    let timer = null;
    if (domRef.current) {
      timer = setTimeout(() => {
        setWidth((domRef.current as HTMLElement).offsetWidth);
      }, 30);
    }
    return () => {
      timer && clearTimeout(timer);
    };
  }, [windowResize, domRef]);
  return width;
}

export default useHeightResize;
