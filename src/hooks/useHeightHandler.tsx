import { useEffect, useState } from "react";

export function useHeightHandler() {
  const [height, setHeight] = useState<number>(0);

  const [handleHeightChange, setHandleHeightChange] = useState<
    ((newHeight: string) => void) | undefined
  >(undefined);

  useEffect(() => {
    const handle = (newHeight: string) => {
      setHeight(Number(newHeight));
    };
    setHandleHeightChange(() => handle);
  }, [setHeight]);

  return { height, handleHeightChange };
}
