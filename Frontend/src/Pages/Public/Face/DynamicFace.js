// import React, { useRef, useState, useEffect } from "react";
// import { FaceMesh } from "@mediapipe/face_mesh";
// import axios from "axios";
// import PublicContentManagementService from "../../../Services/PublicServices/ContentServices";
// import showToast from "../../../Utils/Toast/ToastNotification";
// import { useParams } from "react-router-dom";
// import ConsultationService from "../../../Services/ConsultationServices/ConsultationService";

// const FACE_PARTS = {
//   Eyebrows: [70, 300],
//   Eyes: [159, 386],
//   Ears: [234, 454],
//   Forehead: [10],
//   Nose: [1],
//   Lips: [13],
//   Cheeks: [50, 280],
//   Jaw: [365],
//   Chin: [152],
// };

// const selectedParts = Object.keys(FACE_PARTS);

// const DynamicFace = ({ onNextStep }) => {
//   const canvasRef = useRef(null);
//   const [points, setPoints] = useState([]);
//   const [selectedPartsList, setSelectedPartsList] = useState([]);
//   const [activeParts, setActiveParts] = useState([]);
//   //   console.log(activeParts,"activeParts--------------------------------")
//   const { username, part } = useParams();
//   const [isServiceAvailable, setIsServiceAvailable] = useState(true);
//   const [selectedQuestions, setSelectedQuestions] = useState({});
//   const [expandedPart, setExpandedPart] = useState(null);
//   const [selectedPart, setSelectedParts] = useState([]);
//     const [imageParts, setImageParts] = useState([]);
  
//   const [actualSelectedImage, setActualSelectedImage] = useState(null);
//     const [filteredParts, setFilteredParts] = useState([]);
//     const { activepParts } = [];
  
  

//   // Function to toggle accordion state
//   const togglePart = (part) => {
//     setExpandedPart((prev) => (prev === part ? null : part));
//   };

//   const fetchActiveParts = async () => {
//     try {
//       const getContent = await PublicContentManagementService.getPublicContent({
//         userName: username,
//         part: part,
//       });

//       if (getContent?.data?.statusCode === 200) {
//         // ✅ Ensure activeParts is an array before processing
//         const activePartsArray = Array.isArray(
//           getContent?.data?.data?.activepParts
//         )
//           ? getContent.data.data.activepParts
//           : [];

//         // ✅ Store the full activeParts array in state
//         setActiveParts(activePartsArray);

//         // ✅ Check if activeParts contains valid objects
//         if (activePartsArray.length > 0) {
//           activePartsArray.forEach((partObj, index) => {
//             // console.log(`Index: ${index}, Part: ${partObj?.part}, Image Type: ${partObj?.imagePartType}`);
//           });
//         } else {
//           //   console.log("activeParts array is empty or not available");
//         }

//         setIsServiceAvailable(true);
//       } else {
//         setIsServiceAvailable(false);
//         showToast("error", getContent?.data?.message);
//       }
//     } catch (error) {
//       setIsServiceAvailable(false);
//       showToast("error", "Something went wrong while fetching active parts");
//     }
//   };

//   useEffect(() => {
//     fetchActiveParts();
//   }, [username, part]);

//   const [selectedImage, setSelectedImage] = useState("");
//   // console.log(SelectedImage, "path of image------------------------");

//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setSelectedImage(imageUrl);
//     setActualSelectedImage(imageUrl);


//       const image = new Image();
//       image.src = imageUrl;
//       image.onload = async () => {
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext("2d");
//         canvas.width = image.width;
//         canvas.height = image.height;
//         ctx.drawImage(image, 0, 0, image.width, image.height);

//         const faceMesh = new FaceMesh({
//           locateFile: (file) =>
//             `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
//         });

//         faceMesh.setOptions({
//           maxNumFaces: 1,
//           refineLandmarks: true,
//           minDetectionConfidence: 0.5,
//           minTrackingConfidence: 0.5,
//         });

//         faceMesh.onResults((results) => {
//           if (results.multiFaceLandmarks) {
//             const landmarks = results.multiFaceLandmarks[0];
//             setPoints(landmarks);
//             drawSelectedLandmarks(ctx, landmarks);
//           }
//         });

//         await faceMesh.send({ image });
//       };
//     }
//   };

//   const drawSelectedLandmarks = (ctx, landmarks) => {
//     ctx.fillStyle = "black";
//     selectedParts.forEach((part) => {
//       FACE_PARTS[part].forEach((index) => {
//         const point = landmarks[index];
//         if (point) {
//           const x = point.x * canvasRef.current.width;
//           const y = point.y * canvasRef.current.height;
//           ctx.beginPath();
//           ctx.arc(x, y, 4, 0, 2 * Math.PI);
//           ctx.fill();
//         }
//       });
//     });
//   };

//   const handleImageClick = (image) => {
//     setSelectedParts([]);
//     const parts = image?.parts || [];
//     setSelectedImage(image?.imageUrl);
//     setActualSelectedImage(image);
//     setImageParts(parts);
//     const filtered = filterActiveParts(parts, activepParts);

//     setFilteredParts(filtered);
//   };

//   const getFacePart = (nearestIndex) => {
//     for (const [part, indices] of Object.entries(FACE_PARTS)) {
//       if (indices.includes(nearestIndex)) {
//         return part;
//       }
//     }
//     return "unknown";
//   };

//   const filterActiveParts = (imageParts, activeParts) => {
//     if (!Array.isArray(imageParts) || !Array.isArray(activeParts)) {
//       return [];
//     }

//     return imageParts
//       .map((partName) => {
//         // Find a matching active part based on the part name
//         const matchingActivePart = activeParts.find(
//           (activePart) => activePart.part === partName.partName
//         );

//         // If a matching part is found, include the questions and other data
//         if (matchingActivePart) {
//           return {
//             ...partName, // Retain the coordinates and partName from imageParts
//             imagePartType: matchingActivePart.imagePartType,
//             question: matchingActivePart.question || [], // Include questions from activeParts
//           };
//         }

//         // If no match is found, return the original imagePart without questions
//         return {
//           ...partName,
//           question: [], // Empty questions if no active part matches
//         };
//       })
//       .filter((part) => part.question.length > 0); // Optionally filter to keep only parts with questions
//   };

//   const handleCanvasClick = (event) => {
//     const rect = canvasRef.current.getBoundingClientRect();
//     const x = event.clientX - rect.left;
//     const y = event.clientY - rect.top;

//     let nearestPointIndex = null;
//     let minDistance = Infinity;
//     let nearestPointCoords = null;

//     selectedParts.forEach((part) => {
//       FACE_PARTS[part].forEach((index) => {
//         const point = points[index];
//         if (point) {
//           const px = point.x * canvasRef.current.width;
//           const py = point.y * canvasRef.current.height;
//           const distance = Math.sqrt((px - x) ** 2 + (py - y) ** 2);

//           if (distance < minDistance) {
//             minDistance = distance;
//             nearestPointIndex = index;
//             nearestPointCoords = { x: px, y: py };
//           }
//         }
//       });
//     });

//     if (nearestPointIndex !== null && nearestPointCoords) {
//       const part = getFacePart(nearestPointIndex);
//       console.log("Extracted part:", part);

//       // Ensure activeParts is an array before using find()
//       const matchedActivePart = Array.isArray(activeParts)
//         ? activeParts.find((item) => item.part === part) // ✅ Matching part correctly
//         : null;

//       console.log("activeParts Array:", activeParts);
//       console.log("Matched Active Part:", matchedActivePart);

//       setSelectedPartsList((prevList) => {
//         if (prevList.some((item) => item.part === part)) {
//           return prevList.filter((item) => item.part !== part);
//         } else {
//           return [
//             ...prevList,
//             {
//               part,
//               coords: nearestPointCoords,
//               imagePartType: matchedActivePart
//                 ? matchedActivePart.imagePartType
//                 : "Unknown",
//               questions: matchedActivePart?.question?.map((q) => q.text) || [],

//               // ✅ Extract packageIds from question array
//               packageIds:
//                 matchedActivePart?.question
//                   ?.map((q) => q.packageIds)
//                   .filter((id) => id) || [],
//             },
//           ];
//         }
//       });
//     }
//   };

//   const handleNextStep = async () => {
//     if (selectedPartsList.length === 0) {
//       showToast(
//         "error",
//         "Please select at least one face part before proceeding."
//       );
//       return;
//     }

//     const formattedData = {
//       data: {
//         selectedFaceParts: selectedPartsList
//           .map((item) => {
//             const checkedQuestions = (
//               selectedQuestions[item.text] || []
//             ).filter((q) => q.isChecked);
//             if (checkedQuestions.length === 0) return null;

//             return {
//               part: item.part,
//               selectedQuestions: checkedQuestions.map((q) => q.text),
//             };
//           })
//           .filter(Boolean),
//       },
//     };
//   };

//   // const handleProceedToNextStep = () => {
//   //     const savedData = selectedPartsList
//   //       .map((item) => ({
//   //         part: item.part,
//   //         selectedQuestions: Array.from(selectedQuestions[item.part] || []),
//   //       }))
//   //       .filter((item) => item.selectedQuestions.length > 0); // Only keep selected ones

//   //     handleNextStep(savedData);
//   //     console.log("Sending Data to handle next step:", savedData);
//   //   };

//   const [stepper, setStepper] = useState(null);
//   const [currentPackage, setCurrentPackage] = useState({});

// //   const handleProceedToNextStep = async () => {
// //     try {
// //       const savedData = selectedPartsList
// //         .map((item) => {
// //           const questionString = Array.from(
// //             selectedQuestions[item.part] || []
// //           ).join(", ");

// //           const packageIdsArray = item.packageIds
// //             ? [].concat(...item.packageIds)
// //             : [];

// //           return {
// //             partName: item.part,
// //             question: questionString,
// //             packageIds: packageIdsArray,
// //           };
// //         })
// //         .filter((item) => item.question.length > 0);

// //       console.log(
// //         "Final Data Sent to Backend:",
// //         JSON.stringify(savedData, null, 2)
// //       ); // Debugging log

// //       if (!savedData.length) {
// //         showToast(
// //           "error",
// //           "Please select at least one body part and question."
// //         );
// //         return;
// //       }

// //       // ✅ Send the correct request format
// //       const submitSelection = await ConsultationService.getRecommendation({
// //         data: savedData,
// //       });

// //       if (submitSelection?.data?.statusCode === 200) {
// //         setCurrentPackage(submitSelection?.data?.data);
// //         if (stepper) {
// //           stepper.next();
// //         }
// //       } else {
// //         showToast("error", "Failed to get package for questions");
// //       }
// //     } catch (error) {
// //       console.error("Error while submitting data:", error);
// //       showToast("error", "An error occurred while submitting your data");
// //     }
// //   };

// const handleProceedToNextStep = async () => {
//     try {
//         const savedData = selectedPartsList
//             .map((item) => {
//                 const questionString = Array.from(selectedQuestions[item.part] || []).join(", ");

//                 const packageIdsArray = item.packageIds ? [].concat(...item.packageIds) : [];

//                 return {
//                     partName: item.part,
//                     question: questionString,
//                     packageIds: packageIdsArray,
//                     selectedImage: selectedImage, // ✅ Added SelectedImage here
//                 };
//             })
//             .filter((item) => item.question.length > 0);

//         console.log("Final Data Sent to Backend:", JSON.stringify(savedData, null, 2)); // Debugging log

//         if (!savedData.length) {
//             showToast("error", "Please select at least one body part and question.");
//             return;
//         }

//         // ✅ Send the updated savedData directly
//         const submitSelection = await ConsultationService.getRecommendation({ data: savedData });

//         if (submitSelection?.data?.statusCode === 200) {
//             setCurrentPackage(submitSelection?.data?.data);
//             if (stepper) {
//                 stepper.next();
                
//             }
//         } else {
//             showToast("error", "Failed to get package for questions");
//         }
//     } catch (error) {
//         console.error("Error while submitting data:", error);
//         showToast("error", "An error occurred while submitting your data");
//     }
// };


//   const handleCheckboxChange = (part, question) => {
//     setSelectedQuestions((prev) => {
//       const updatedQuestions = { ...prev };

//       if (!updatedQuestions[part]) {
//         updatedQuestions[part] = new Set(); // Initialize set if it doesn't exist
//       }

//       if (updatedQuestions[part].has(question)) {
//         updatedQuestions[part].delete(question); // Unselect
//       } else {
//         updatedQuestions[part].add(question); // Select
//       }

//       return { ...updatedQuestions };
//     });
//   };

//   return (
//     <div style={{ display: "flex", gap: "20px" }}>
//       {/* Left Side - Face Selection */}
//       <div>
//         <input type="file" accept="image/*" onChange={handleImageUpload} />
//         <canvas
//           ref={canvasRef}
//           style={{ border: "1px solid black", marginTop: "20px" }}
//           onClick={handleCanvasClick}
//         />
//       </div>

//       {/* Right Side - Selected Parts */}
//       <div style={{ marginTop: "20px", width: "300px" }}>
//         <h3>Selected Face Parts:</h3>
//         <div>
//           {selectedPartsList.map((item, index) => (
//             <div
//               key={index}
//               style={{ borderBottom: "1px solid #ddd", paddingBottom: "10px" }}
//             >
//               {/* Accordion Header */}
//               <div
//                 onClick={() => togglePart(item.part)}
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   cursor: "pointer",
//                   fontWeight: "bold",
//                   padding: "10px",
//                   background: "#f8f9fa",
//                   borderRadius: "5px",
//                 }}
//               >
//                 <span>{item.part}</span>
//                 <span>{expandedPart === item.part ? "▲" : "▼"}</span>
//               </div>

//               {/* Accordion Content (Only show if expanded) */}
//               {expandedPart === item.part && (
//                 <ul
//                   style={{
//                     listStyleType: "none",
//                     paddingLeft: "10px",
//                     marginTop: "5px",
//                   }}
//                 >
//                   {item.questions.map((text, idx) => (
//                     <li key={idx}>
//                       <input
//                         type="checkbox"
//                         id={`q-${index}-${idx}`}
//                         checked={
//                           selectedQuestions[item.part]?.has(text) || false
//                         }
//                         onChange={() => handleCheckboxChange(item.part, text)}
//                       />
//                       <label
//                         htmlFor={`q-${index}-${idx}`}
//                         style={{ marginLeft: "5px" }}
//                       >
//                         {text}
//                       </label>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Next Step Button (Automatically saves and sends selected data) */}
//         <button
//           onClick={handleProceedToNextStep}
//           disabled={selectedPartsList.length === 0}
//           style={{
//             marginTop: "10px",
//             padding: "10px",
//             backgroundColor: selectedPartsList.length > 0 ? "#007bff" : "gray",
//             color: "white",
//             border: "none",
//             cursor: selectedPartsList.length > 0 ? "pointer" : "not-allowed",
//             width: "100%",
//           }}
//         >
//           Next Step
//         </button>
//       </div>
//     </div>
//   );
// };

// export default DynamicFace;
