import React, { useRef, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";

// Mapping of landmark ranges to face parts
const FACE_PARTS = {
  eyes: [33, 133, 362, 263], // Key points of both eyes
  nose: [1, 2, 98, 327],     // Nose key points
  mouth: [61, 291],          // Key points around the mouth
  ears: [234, 454],          // Key points for ears
  forehead: [10],            // Approximate forehead landmark
};

const FaceLandmarkApp = () => {
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

        const faceMesh = new FaceMesh({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        faceMesh.onResults((results) => {
          if (results.multiFaceLandmarks) {
            const landmarks = results.multiFaceLandmarks[0];
            setPoints(landmarks);
            drawLandmarks(ctx, landmarks);
          }
        });

        await faceMesh.send({ image });
      };
    }
  };

  const drawLandmarks = (ctx, landmarks) => {
    ctx.fillStyle = "red";
    landmarks.forEach((point) => {
      const x = point.x * canvasRef.current.width;
      const y = point.y * canvasRef.current.height;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const getFacePart = (nearestIndex) => {
    for (const [part, indices] of Object.entries(FACE_PARTS)) {
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
      const part = getFacePart(nearestPointIndex);
      // console.log('part',part, 'nearestPointIndex',nearestPointIndex);
      
      alert(`You clicked on the ${part} of the face.`);
    }
  };

  return (
    <div>
      <h1>Face Landmark Detector</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <canvas
        ref={canvasRef}
        style={{ border: "1px solid black", marginTop: "20px" }}
        onClick={handleCanvasClick}
      />
    </div>
  );
};

export default FaceLandmarkApp;
