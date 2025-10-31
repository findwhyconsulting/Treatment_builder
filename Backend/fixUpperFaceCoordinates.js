import mongoose from 'mongoose';
import Image from './src/models/images.js';

const mongoUrl = 'mongodb+srv://doadmin:562A14wX39jHTu7h@db-mongodb-syd1-74857-37018056.mongo.ondigitalocean.com/admin?retryWrites=true&w=majority';

// Corrected Upper Face coordinates based on actual anatomy
const upperFaceCoordinates = {
  "Forehead": { x: 50, y: 18 },        // Center of forehead
  "Eyebrows": { x: 50, y: 28 },        // Above eyes, eyebrow area
  "Glabella": { x: 50, y: 26 },        // Between eyebrows
  "Eyes": { x: 50, y: 35 },            // On actual eyes (pupils/eyelids)
  "Crows feet": { x: 75, y: 35 },      // Side of eyes (outer corners)
  "Temples": { x: 85, y: 25 },         // Temple area (sides of forehead)
};

const fixUpperFaceCoordinates = async () => {
  try {
    console.log('🎯 Fixing ALL Upper Face coordinates...');
    
    // Get all face images
    const faceImages = await Image.find({ type: 'face' });
    console.log(`📊 Found ${faceImages.length} face images`);
    
    let totalUpdated = 0;
    
    // Update each face image's upper face coordinates
    for (const image of faceImages) {
      console.log(`\n📸 Processing Image: ${image.uniqueCode}`);
      let imageUpdated = 0;
      
      // Update each upper face part
      for (const [partName, newCoords] of Object.entries(upperFaceCoordinates)) {
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
    
    console.log('\n🎉 Successfully fixed Upper Face coordinates!');
    console.log(`📊 Updated ${totalUpdated} images`);
    
    console.log('\n📋 New Upper Face Positions:');
    console.log('   🔸 Forehead: Center of forehead (50%, 18%)');
    console.log('   🔸 Eyebrows: Above eyes (50%, 28%)');
    console.log('   🔸 Glabella: Between eyebrows (50%, 26%)');
    console.log('   🔸 Eyes: On actual eyes (50%, 35%)');
    console.log('   🔸 Crows feet: Outer eye corners (75%, 35%)');
    console.log('   🔸 Temples: Side of forehead (85%, 25%)');
    
    console.log('\n🎯 All Upper Face dots should now be correctly positioned!');
    
  } catch (error) {
    console.error('❌ Error fixing Upper Face coordinates:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Connect to database and run the script
mongoose.connect(mongoUrl).then(async () => {
  console.log('✅ Connected to MongoDB');
  await fixUpperFaceCoordinates();
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});


