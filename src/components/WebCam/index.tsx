import Webcam from "react-webcam";
import React from "react";
import { extractColors } from "extract-colors";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
};

const WebcamCapture = () => {
  const webcamRef = React.useRef(null);
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = "capture.jpeg";
    link.click();
    extractColors(imageSrc).then(console.log).catch(console.error);
  }, [webcamRef]);
  return (
    <>
      <Webcam
        audio={false}
        height={360}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={640}
        videoConstraints={videoConstraints}
      />
      <button onClick={capture}>Capture photo</button>
    </>
  );
};
export default WebcamCapture;
