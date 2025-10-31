import mongoose from 'mongoose';
import Image from './src/models/images.js';

const mongoUrl = 'mongodb+srv://doadmin:562A14wX39jHTu7h@db-mongodb-syd1-74857-37018056.mongo.ondigitalocean.com/admin?retryWrites=true&w=majority';

const fixEyesExactPosition = async () => {
  try {
    console.log('🎯 Positioning Eyes dots on actual eye location...');
    
    // Get all face images
    const faceImages = await Image.find({ type: 'face' });
    console.log(`📊 Found ${faceImages.length} face images`);
    
    let updatedCount = 0;
    
    // Update each face image's eyes coordinates
    for (const image of faceImages) {
      console.log(`\n📸 Processing Image: ${image.uniqueCode}`);
      
      // Find the eyes part
      const eyesPart = image.parts.find(part => part.partName === 'Eyes');
      
      if (eyesPart) {
        console.log(`   📍 Current Eyes position: (${eyesPart.coordinates.x}%, ${eyesPart.coordinates.y}%)`);
        
        // Position exactly on the eyes based on your image
        eyesPart.coordinates.x = 50;  // Center horizontally
        eyesPart.coordinates.y = 50;  // Middle of face where eyes actually are
        
        console.log(`   ✅ New Eyes position: (${eyesPart.coordinates.x}%, ${eyesPart.coordinates.y}%)`);
        
        // Save the updated image
        await image.save();
        updatedCount++;
      } else {
        console.log('   ❌ No Eyes part found in this image');
      }
    }
    
    console.log('\n🎉 Successfully positioned Eyes on actual eye location!');
    console.log(`📊 Updated ${updatedCount} images`);
    
    console.log('\n📋 Position Change:');
    console.log('   Previous: Eyes at y: 35% (too high)');
    console.log('   New: Eyes at y: 50% (on actual eyes in middle of face)');
    
    console.log('\n🎯 The Eyes dots should now appear:');
    console.log('   - Right on the eye area');
    console.log('   - Around the pupils/eyelids');
    console.log('   - In the middle of the face where eyes actually are');
    
  } catch (error) {
    console.error('❌ Error positioning Eyes:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Connect to database and run the script
mongoose.connect(mongoUrl).then(async () => {
  console.log('✅ Connected to MongoDB');
  await fixEyesExactPosition();
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});


