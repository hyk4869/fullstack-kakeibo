import React, { useLayoutEffect, useState } from 'react';

export type MonitorSizeType = {
  width: number;
  height: number;
};

const useWindowSize = (): MonitorSizeType => {
  const [monitorSize, setMonitorSize] = useState<MonitorSizeType>({ width: 0, height: 0 });

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
