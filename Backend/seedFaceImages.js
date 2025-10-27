import mongoose from "mongoose";
import Image from "./src/models/images.js";

// Database connection
const connectDB = async () => {
  try {
    const mongoUrl = "mongodb+srv://doadmin:562A14wX39jHTu7h@db-mongodb-syd1-74857-37018056.mongo.ondigitalocean.com/admin?retryWrites=true&w=majority";
    await mongoose.connect(mongoUrl);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Face images data - Update CDN_ENDPOINT with your actual DigitalOcean CDN URL
const CDN_ENDPOINT = "https://aesthetiq.syd1.digitaloceanspaces.com"; // Replace with your actual CDN endpoint

const faceImages = [
  {
    uniqueCode: "face-img1",
    imageUrl: `${CDN_ENDPOINT}/face_images/img1.png`,
    spacesKey: "face_images/img1.png",
    type: "face",
    isDeleted: false,
  },
  {
    uniqueCode: "face-img2", 
    imageUrl: `${CDN_ENDPOINT}/face_images/img2.png`,
    spacesKey: "face_images/img2.png",
    type: "face",
    isDeleted: false,
  },
  {
    uniqueCode: "face-img3",
    imageUrl: `${CDN_ENDPOINT}/face_images/img3.png`, 
    spacesKey: "face_images/img3.png",
    type: "face",
    isDeleted: false,
  },
  {
    uniqueCode: "face-img4",
    imageUrl: `${CDN_ENDPOINT}/face_images/img4.png`,
    spacesKey: "face_images/img4.png", 
    type: "face",
    isDeleted: false,
  },
  {
    uniqueCode: "face-img5",
    imageUrl: `${CDN_ENDPOINT}/face_images/img5.png`,
    spacesKey: "face_images/img5.png",
    type: "face", 
    isDeleted: false,
  },
  {
    uniqueCode: "face-img6",
    imageUrl: `${CDN_ENDPOINT}/face_images/img6.png`,
    spacesKey: "face_images/img6.png",
    type: "face",
    isDeleted: false,
  },
];

const seedFaceImages = async () => {
  try {
    console.log("🌱 Starting face images seeding...");
    
    // Clear existing face images
    await Image.deleteMany({ type: "face" });
    console.log("🗑️ Cleared existing face images");
    
    // Insert new face images
    const insertedImages = await Image.insertMany(faceImages);
    console.log(`✅ Successfully seeded ${insertedImages.length} face images`);
    
    // Display inserted images
    insertedImages.forEach((img, index) => {
      console.log(`📸 Image ${index + 1}: ${img.uniqueCode} - ${img.imageUrl}`);
    });
    
    console.log("🎉 Face images seeding completed successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding face images:", error);
  } finally {
    mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
};

// Run the seeding
const runSeed = async () => {
  await connectDB();
  await seedFaceImages();
};

runSeed();
