"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useSyncExternalStore } from "react";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

// Custom hook to track if component has mounted (for SSR hydration)
function useHasMounted(): boolean {
  return useSyncExternalStore(
    () => () => {}, // subscribe - no-op since mount status doesn't change
    () => true, // getSnapshot - client is always mounted
    () => false // getServerSnapshot - server is never mounted
  );
}

// Custom hook to track window width with SSR support
function useIsDesktop(): boolean {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener("resize", callback);
      return () => window.removeEventListener("resize", callback);
    },
    () => window.innerWidth >= 768,
    () => false // Default to mobile on server
  );
}

interface VideoPlayerProps {
  width: string;
  height: string;
  videoUrl: string;
  gifUrl: string;
}

const VideoPlayer: React.FunctionComponent<VideoPlayerProps> = (props) => {
  const isMounted = useHasMounted();
  const isDesktop = useIsDesktop();

  // During SSR and initial client render, show a placeholder to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div
        className="player-wrapper card video-player-wrapper my-12"
        data-video-player
        suppressHydrationWarning
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
          {/* Empty placeholder to match SSR */}
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
