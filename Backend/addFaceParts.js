import mongoose from 'mongoose';
import Image from './src/models/images.js';

const mongoUrl = 'mongodb+srv://doadmin:562A14wX39jHTu7h@db-mongodb-syd1-74857-37018056.mongo.ondigitalocean.com/admin?retryWrites=true&w=majority';

// Standard face part coordinates (as percentages for responsive positioning)
const facePartCoordinates = [
  { partName: "Forehead", coordinates: { x: 50, y: 15 } },
  { partName: "Eyebrows", coordinates: { x: 45, y: 25 } },
  { partName: "Glabella", coordinates: { x: 50, y: 22 } },
  { partName: "Eyes", coordinates: { x: 50, y: 35 } },
  { partName: "Crows feet", coordinates: { x: 65, y: 35 } },
  { partName: "Temples", coordinates: { x: 75, y: 30 } },
  { partName: "Nose", coordinates: { x: 50, y: 50 } },
  { partName: "Cheekbones", coordinates: { x: 60, y: 45 } },
  { partName: "Cheeks", coordinates: { x: 65, y: 55 } },
  { partName: "Laser-labial folds", coordinates: { x: 58, y: 60 } },
  { partName: "Lips", coordinates: { x: 50, y: 70 } },
  { partName: "Chin", coordinates: { x: 50, y: 85 } },
  { partName: "Jaw", coordinates: { x: 60, y: 80 } },
  { partName: "Perioral (mouth)", coordinates: { x: 50, y: 75 } }
];

const addPartsToFaceImages = async () => {
  try {
    console.log('🚀 Starting to add parts to face images...');
    
    // Get all face images
    const faceImages = await Image.find({ type: 'face' });
    console.log(`📊 Found ${faceImages.length} face images`);
    
    if (faceImages.length === 0) {
      console.log('❌ No face images found');
      return;
    }
    
    // Update each face image with parts
    for (let i = 0; i < faceImages.length; i++) {
      const image = faceImages[i];
      console.log(`\n📸 Processing Image ${i + 1}: ${image.uniqueCode}`);
      
      // Clear existing parts (if any)
      image.parts = [];
      
      // Add all face parts with coordinates
      image.parts = facePartCoordinates.map(part => ({
        partName: part.partName,
        coordinates: {
          x: part.coordinates.x,
          y: part.coordinates.y
        }
      }));
      
      // Save the updated image
      await image.save();
      
      console.log(`✅ Added ${image.parts.length} parts to ${image.uniqueCode}`);
      
      // Log the parts added
      image.parts.forEach((part, index) => {
        console.log(`   ${index + 1}. ${part.partName} at (${part.coordinates.x}%, ${part.coordinates.y}%)`);
      });
    }
    
    console.log('\n🎉 Successfully added parts to all face images!');
    console.log('\n📋 Summary:');
    console.log(`   - Updated ${faceImages.length} face images`);
    console.log(`   - Added ${facePartCoordinates.length} parts to each image`);
    console.log(`   - Total parts created: ${faceImages.length * facePartCoordinates.length}`);
    
    console.log('\n🎯 Next Steps:');
    console.log('   1. Test the face page - dots should now appear!');
    console.log('   2. Create concerns that match the part names');
    console.log('   3. Verify dots show when concerns are active');
    
  } catch (error) {
    console.error('❌ Error adding parts to face images:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Connect to database and run the script
mongoose.connect(mongoUrl).then(async () => {
  console.log('✅ Connected to MongoDB');
  await addPartsToFaceImages();
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});



