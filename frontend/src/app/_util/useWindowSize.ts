import React, { useLayoutEffect, useState } from 'react';

export type monitorSizeType = {
  width: number;
  height: number;
};

const useWindowSize = (): monitorSizeType => {
  const [monitorSize, setMonitorSize] = useState<monitorSizeType>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      const getWindowDimensions = () => {
        const { innerWidth: width, innerHeight: height } = window;
        return {
          width,
          height,
        };
      };

      const onResize = () => {
        setMonitorSize(getWindowDimensions());
      };
      window.addEventListener('resize', onResize);
      onResize();
      return () => window.removeEventListener('resize', onResize);
    } else {
      return;
    }
  }, []);
  return monitorSize;
};

export default useWindowSize;
