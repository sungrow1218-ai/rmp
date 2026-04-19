import { useState, useEffect } from 'react';

import { useSize } from 'ahooks';

function useRefHeightResize(domRef: React.MutableRefObject<null>) {
  const domHeight = useSize(domRef);
  const [height, setHeight] = useState(domHeight?.height);

  useEffect(() => {
    let timer = null;
    if (domRef.current) {
      timer = setTimeout(() => {
        setHeight(domHeight?.height);
      }, 30);
    }
    return () => {
      timer && clearTimeout(timer);
    };
  }, [domHeight, domRef]);
  return height;
}

export default useRefHeightResize;
