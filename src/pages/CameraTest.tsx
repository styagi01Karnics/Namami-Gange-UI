import { useEffect, useRef } from "react";
 
const CameraTest = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
 
  useEffect(() => {
    let stream: MediaStream | null = null;
 
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
 
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Camera Error:", error);
      }
    };
 
    startCamera();
 
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);
 
  return (
<div>
<h2>CCTV Live Camera</h2>
 
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: "800px",
          height: "450px",
          backgroundColor: "black",
          objectFit: "contain",
        }}
      />
</div>
  );
};
 
export default CameraTest;