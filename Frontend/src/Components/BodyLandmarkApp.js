import React, { useRef, useState } from "react";
import { Pose } from "@mediapipe/pose";

// Mapping of landmark ranges to body parts
const BODY_PARTS = {
  head: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  leftArm: [11, 13, 15, 17, 19, 21],
  rightArm: [12, 14, 16, 18, 20, 22],
  leftLeg: [23, 25, 27, 29, 31],
  rightLeg: [24, 26, 28, 30, 32],
  torso: [11, 12, 23, 24],
};

const BodyLandmarkApp = () => {
  const canvasRef = useRef(null);
  const [points, setPoints] = useState([]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = async () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0, image.width, image.height);

        const pose = new Pose({
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
        });

        pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        pose.onResults((results) => {
          if (results.poseLandmarks) {
            const landmarks = results.poseLandmarks;
            setPoints(landmarks);
            drawLandmarks(ctx, landmarks);
          }
        });

        await pose.send({ image });
      };
    }
  };

  const drawLandmarks = (ctx, landmarks) => {
    ctx.fillStyle = "blue";
    landmarks.forEach((point) => {
      const x = point.x * canvasRef.current.width;
      const y = point.y * canvasRef.current.height;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const getBodyPart = (nearestIndex) => {
    for (const [part, indices] of Object.entries(BODY_PARTS)) {
      if (indices.includes(nearestIndex)) {
        return part; // Return the part name if the index is in the range
      }
    }
    return "unknown"; // If no match, return "unknown"
  };

  const handleCanvasClick = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    let nearestPointIndex = null;
    let minDistance = Infinity;

    points.forEach((point, index) => {
      const px = point.x * canvasRef.current.width;
      const py = point.y * canvasRef.current.height;
      const distance = Math.sqrt((px - x) ** 2 + (py - y) ** 2);

      if (distance < minDistance) {
        minDistance = distance;
        nearestPointIndex = index;
      }
    });

    if (nearestPointIndex !== null) {
      const part = getBodyPart(nearestPointIndex);
      alert(`You clicked on the ${part} of the body.`);
    }
  };

  return (
    <div>
      {/* <h1>Body Landmark Detector</h1> */}
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <canvas
        ref={canvasRef}
        style={{ border: "1px solid black", marginTop: "20px" }}
        onClick={handleCanvasClick}
      />
    </div>
  );
};

export default BodyLandmarkApp;
