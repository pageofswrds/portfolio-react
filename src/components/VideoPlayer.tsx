"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import React from "react";
import { useEffect, useState } from "react";
// import ReactPlayer from 'react-player'
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface VideoPlayerProps {
  width: string;
  height: string;
  videoUrl: string;
  gifUrl: string;
}

const VideoPlayer: React.FunctionComponent<VideoPlayerProps> = (props) => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [hasWindow, setHasWindow] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
      // Check if it's desktop based on screen width
      setIsDesktop(window.innerWidth >= 768);

      // Optional: Add resize listener for responsive behavior
      const handleResize = () => {
        setIsDesktop(window.innerWidth >= 768);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Prevent hydration mismatch by not rendering until client-side
  if (!hasWindow) {
    return (
      <div
        className="player-wrapper card video-player-wrapper my-12"
        data-video-player
      >
        <div
          style={{
            width: props.width,
            height: props.height,
            backgroundColor: "#f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div
      className="player-wrapper card video-player-wrapper my-12"
      data-video-player
    >
      {isDesktop ? (
        <ReactPlayer
          width={props.width}
          height={props.height}
          url={props.videoUrl}
          controls={false}
          muted={true}
          playing={true}
          loop={true}
          playsinline={true}
          className={""}
        />
      ) : (
        <Image
          src={props.gifUrl}
          alt=""
          height={0}
          width={0}
          sizes="225vw"
          style={{ width: "100%", height: "auto" }}
        />
      )}
    </div>
  );
};

export default VideoPlayer;

// export const VideoPlayer = ({ videoTitle, videoUrl }):
// VideoPlayerProps => {
//   const [hasWindow, setHasWindow] = useState(false);
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       setHasWindow(true);
//     }
//   }, []);

//   return (
//     <div>

//     </div>
//   );
// }

// src: https://github.com/cookpete/react-player/issues/1428
