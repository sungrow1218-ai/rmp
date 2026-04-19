import { useState, useEffect } from 'react';
import useWindowResize from './useWindowResize';

function useHeightResize(domRef: React.MutableRefObject<unknown>) {
  const windowHeight = useWindowResize();
  const [height, setHeight] = useState(
    domRef.current ? (domRef.current as HTMLElement).offsetHeight : 0
  );

  useEffect(() => {
    let timer = null;
    if (domRef.current) {
      timer = setInterval(() => {
        setHeight((domRef.current as HTMLElement).offsetHeight);
      }, 50);
    }
    return () => {
      timer && clearInterval(timer);
    };
  }, [windowHeight, domRef]);
  return height;
}

export default useHeightResize;
