import mongoose from 'mongoose';
import Image from './src/models/images.js';

const mongoUrl = 'mongodb+srv://doadmin:562A14wX39jHTu7h@db-mongodb-syd1-74857-37018056.mongo.ondigitalocean.com/admin?retryWrites=true&w=majority';

// Improved baseline coordinates that should work across different face types
const improvedBaselineCoordinates = {
  // UPPER FACE - Based on our testing and adjustments
  "Forehead": { x: 50, y: 20 },        // Center forehead, not too high
  "Eyebrows": { x: 50, y: 40 },        // Above eyes, eyebrow level
  "Glabella": { x: 50, y: 38 },        // Between eyebrows, slightly above eyes
  "Eyes": { x: 65, y: 50 },            // Right eye area (tested and working)
  "Crows feet": { x: 75, y: 50 },      // Outer eye corner (aligned with eyes)
  "Temples": { x: 75, y: 45 },         // Just above eye level, temple area
  
  // MID FACE - Based on our testing
  "Nose": { x: 50, y: 56 },            // Nose tip area (tested and working)
  "Cheekbones": { x: 70, y: 62 },      // Lower cheek area (tested and working)
  "Cheeks": { x: 75, y: 65 },          // Lower cheeks, below cheekbones
  "Laser-labial folds": { x: 60, y: 68 }, // Nasolabial folds area
  
  // LOWER FACE - Estimated based on face proportions
  "Lips": { x: 50, y: 75 },            // Lip area
  "Perioral (mouth)": { x: 50, y: 73 }, // Around mouth area
  "Chin": { x: 50, y: 88 },            // Chin area
  "Jaw": { x: 65, y: 82 },             // Jawline area
};

const setImprovedBaselineCoordinates = async () => {
  try {
    console.log('🎯 Setting improved baseline coordinates for all face images...');
    
    // Get all face images
    const faceImages = await Image.find({ type: 'face' });
    console.log(`📊 Found ${faceImages.length} face images`);
    
    let totalUpdated = 0;
    
    // Update each face image with improved baseline coordinates
    for (const image of faceImages) {
      console.log(`\n📸 Processing Image: ${image.uniqueCode}`);
      let imageUpdated = 0;
      
      // Update each part with improved coordinates
      for (const [partName, newCoords] of Object.entries(improvedBaselineCoordinates)) {
        const part = image.parts.find(p => p.partName === partName);
        
        if (part) {
          const oldCoords = `(${part.coordinates.x}%, ${part.coordinates.y}%)`;
          
          // Update coordinates
          part.coordinates.x = newCoords.x;
          part.coordinates.y = newCoords.y;
          
          const newCoordsStr = `(${part.coordinates.x}%, ${part.coordinates.y}%)`;
          console.log(`   ✅ ${partName}: ${oldCoords} → ${newCoordsStr}`);
          imageUpdated++;
        } else {
          console.log(`   ❌ ${partName} not found`);
        }
      }
      
      // Save the updated image
      if (imageUpdated > 0) {
        await image.save();
        totalUpdated++;
        console.log(`   💾 Saved ${imageUpdated} coordinate updates`);
      }
    }
    
    console.log('\n🎉 Successfully set improved baseline coordinates!');
    console.log(`📊 Updated ${totalUpdated} images with baseline coordinates`);
    
    console.log('\n📋 Improved Baseline Coordinate System:');
    console.log('   🔸 UPPER FACE:');
    console.log('     - Forehead: (50%, 20%) - Center, moderate height');
    console.log('     - Eyebrows: (50%, 40%) - Above eyes');
    console.log('     - Glabella: (50%, 38%) - Between eyebrows');
    console.log('     - Eyes: (65%, 50%) - Right eye area');
    console.log('     - Crows feet: (75%, 50%) - Outer eye corner');
    console.log('     - Temples: (75%, 45%) - Above eye level');
    
    console.log('   🔸 MID FACE:');
    console.log('     - Nose: (50%, 56%) - Nose tip');
    console.log('     - Cheekbones: (70%, 62%) - Lower cheek');
    console.log('     - Cheeks: (75%, 65%) - Lower cheeks');
    console.log('     - Nasolabial folds: (60%, 68%)');
    
    console.log('   🔸 LOWER FACE:');
    console.log('     - Lips: (50%, 75%) - Lip area');
    console.log('     - Mouth area: (50%, 73%)');
    console.log('     - Chin: (50%, 88%) - Chin area');
    console.log('     - Jaw: (65%, 82%) - Jawline');
    
    console.log('\n🎯 These coordinates should work reasonably well across different face types!');
    console.log('💡 New uploaded images will automatically get these improved coordinates.');
    
  } catch (error) {
    console.error('❌ Error setting baseline coordinates:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Connect to database and run the script
mongoose.connect(mongoUrl).then(async () => {
  console.log('✅ Connected to MongoDB');
  await setImprovedBaselineCoordinates();
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});


