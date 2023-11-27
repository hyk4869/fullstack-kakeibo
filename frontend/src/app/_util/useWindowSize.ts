import React, { useLayoutEffect, useState } from 'react';

export type monitorSizeType = {
  width: number;
  height: number;
};

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
};

const useWindowSize = (): monitorSizeType => {
  const [monitorSize, setMonitorSize] = useState<monitorSizeType>(getWindowDimensions());

  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
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

//https://saunabouya.com/2022/10/29/react-hooks-window-size-dynamic/
