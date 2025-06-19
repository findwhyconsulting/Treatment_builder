import React, { useRef, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";

// Mapping of landmark ranges to face parts
const FACE_PARTS = {
  nose: [
    6, 197, 195, 5, 4, 1, 19, 2, 3, 98, 327, 49, 279, 97, 331, 220, 281, 440,
    196, 419, 188, 309, 274, 51, 363, 248, 236,
  ],
  forehead: [
    10, 151, 9, 8, 168, 336, 296, 334, 293, 300, 337, 383, 67, 338, 69, 108,
  ],
  jaw: [
    152, 148, 176, 149, 150, 136, 172, 400, 379, 378, 395, 396, 397, 367, 364,
    365, 366,
  ],
  chin: [152, 177, 200, 199, 400, 152, 175, 396],
  lips: [
    0, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 13, 78, 81, 14, 87,
    91, 267, 269, 270, 409, 415, 310,
  ],
  leftCheek: [50, 101, 118, 117, 111, 222],
  rightCheek: [280, 375, 394, 393, 391, 436],
  leftEye: [
    33, 133, 246, 161, 160, 159, 158, 157, 173, 155, 154, 153, 145, 144, 163,468
  ],
  rightEye: [
    362, 263, 466, 388, 387, 386, 385, 384, 398, 373, 374, 380, 381, 382, 362,
  ],
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
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
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
      // console.log("index :- ", index, "poiiiii", point);
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
      // console.log("part", part, "nearestPointIndex", nearestPointIndex);

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
