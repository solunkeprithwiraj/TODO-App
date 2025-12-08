'use client'

import React from "react";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

interface LoadMoreProps {
  onLoadMore: () => void;
  loading: boolean;
}

export default function LoadMore({ onLoadMore, loading }: LoadMoreProps) {
  const { ref, inView } = useInView({
    threshold: 0.5, 
  });

  useEffect(() => {
    if (inView && !loading) {
      onLoadMore(); 
    }
  }, [inView, loading, onLoadMore]);

  return <div ref={ref}>{loading && <p>Loading more...</p>}</div>;
}

