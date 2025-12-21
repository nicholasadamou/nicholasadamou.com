"use client";

import { useEffect, useRef } from "react";

export default function useIsMount(): boolean {
  const isMountRef = useRef(true);

  useEffect(() => {
    isMountRef.current = false;
  }, []);

  return isMountRef.current;
}
