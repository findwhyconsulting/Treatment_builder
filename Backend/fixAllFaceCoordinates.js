import mongoose from 'mongoose';
import Image from './src/models/images.js';

const mongoUrl = 'mongodb+srv://doadmin:562A14wX39jHTu7h@db-mongodb-syd1-74857-37018056.mongo.ondigitalocean.com/admin?retryWrites=true&w=majority';

// Corrected face part coordinates based on actual face anatomy
const correctedFacePartCoordinates = [
  // UPPER FACE (15% - 40% from top)
  { partName: "Forehead", coordinates: { x: 50, y: 20 } },        // Center forehead
  { partName: "Eyebrows", coordinates: { x: 50, y: 32 } },        // Above eyes
  { partName: "Glabella", coordinates: { x: 50, y: 30 } },        // Between eyebrows
  { partName: "Eyes", coordinates: { x: 50, y: 38 } },            // Eye area
  { partName: "Crows feet", coordinates: { x: 70, y: 38 } },      // Side of eyes
  { partName: "Temples", coordinates: { x: 80, y: 35 } },         // Temple area
  
  // MID FACE (40% - 65% from top)
  { partName: "Nose", coordinates: { x: 50, y: 52 } },            // Center nose
  { partName: "Cheekbones", coordinates: { x: 68, y: 48 } },      // High cheekbones
  { partName: "Cheeks", coordinates: { x: 72, y: 58 } },          // Lower cheeks
  { partName: "Laser-labial folds", coordinates: { x: 60, y: 62 } }, // Nasolabial folds
  
  // LOWER FACE (65% - 90% from top)
  { partName: "Lips", coordinates: { x: 50, y: 72 } },            // Lip area
  { partName: "Perioral (mouth)", coordinates: { x: 50, y: 70 } }, // Around mouth
  { partName: "Chin", coordinates: { x: 50, y: 85 } },            // Chin area
  { partName: "Jaw", coordinates: { x: 65, y: 78 } },             // Jawline
];

const fixAllFaceCoordinates = async () => {
  try {
    console.log('🎯 Starting to fix ALL face part coordinates...');
    
    // Get all face images
    const faceImages = await Image.find({ type: 'face' });
    console.log(`📊 Found ${faceImages.length} face images`);
    
    if (faceImages.length === 0) {
      console.log('❌ No face images found');
      return;
    }
    
    let totalUpdated = 0;
    
    // Update each face image's coordinates
    for (const image of faceImages) {
      console.log(`\n📸 Processing Image: ${image.uniqueCode}`);
      let imageUpdated = 0;
      
      // Update each part's coordinates
      for (const correctedPart of correctedFacePartCoordinates) {
        const existingPart = image.parts.find(part => part.partName === correctedPart.partName);
        
        if (existingPart) {
          const oldCoords = `(${existingPart.coordinates.x}%, ${existingPart.coordinates.y}%)`;
          
          // Update coordinates
          existingPart.coordinates.x = correctedPart.coordinates.x;
          existingPart.coordinates.y = correctedPart.coordinates.y;
          
          const newCoords = `(${existingPart.coordinates.x}%, ${existingPart.coordinates.y}%)`;
          console.log(`   ✅ ${correctedPart.partName}: ${oldCoords} → ${newCoords}`);
          imageUpdated++;
        } else {
          console.log(`   ❌ Part "${correctedPart.partName}" not found`);
        }
      }
      
      // Save the updated image
      if (imageUpdated > 0) {
        await image.save();
        totalUpdated++;
        console.log(`   💾 Saved ${imageUpdated} coordinate updates`);
      }
    }
    
    console.log('\n🎉 Successfully updated all face coordinates!');
    console.log(`📊 Updated ${totalUpdated} images with corrected coordinates`);
    
    console.log('\n📋 Coordinate System:');
    console.log('   🔸 UPPER FACE (15%-40%): Forehead, Eyebrows, Glabella, Eyes, Crows feet, Temples');
    console.log('   🔸 MID FACE (40%-65%): Nose, Cheekbones, Cheeks, Nasolabial folds');
    console.log('   🔸 LOWER FACE (65%-90%): Lips, Mouth area, Chin, Jaw');
    
    console.log('\n🎯 Next Steps:');
    console.log('   1. Fix the filtering logic in frontend');
    console.log('   2. Test that only concern-matched dots appear');
    console.log('   3. Verify dots are in correct anatomical positions');
    
  } catch (error) {
    console.error('❌ Error fixing face coordinates:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Connect to database and run the script
mongoose.connect(mongoUrl).then(async () => {
  console.log('✅ Connected to MongoDB');
  await fixAllFaceCoordinates();
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});


