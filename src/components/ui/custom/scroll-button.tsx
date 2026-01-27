"use client";
import React from "react";
import { useState, useEffect } from "react";
import { ArrowUp } from "iconoir-react";

interface ScrollButtonProps {
  // Add any props you need for your ScrollButton component
  isActive?: boolean;
}

const ScrollButton: React.FC<ScrollButtonProps> = ({ isActive = true }) => {
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    const updateScroll = () => {
      if (window.scrollY > 500) {
        setIsTop(false);
      } else {
        setIsTop(true);
      }
    };
    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  const scrollUp = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    setIsTop(true);
  };

  return (
    <>
      {isTop && isActive ? (
        <></>
      ) : (
        <button
          className="elevation-2 glass-darker rounded-max fixed right-8 bottom-8 z-[49] h-[48px] w-[48px] p-2"
          onClick={scrollUp}
        >
          <ArrowUp className="text-secondary h-5 w-5" />
        </button>
      )}
    </>
  );
};

export default ScrollButton;
