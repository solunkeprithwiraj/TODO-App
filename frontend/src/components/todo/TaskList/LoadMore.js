import React from "react";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export default function LoadMore({ onLoadMore, loading }) {
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
