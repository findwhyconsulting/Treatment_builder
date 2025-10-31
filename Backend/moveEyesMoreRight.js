import mongoose from 'mongoose';
import Image from './src/models/images.js';

const mongoUrl = 'mongodb+srv://doadmin:562A14wX39jHTu7h@db-mongodb-syd1-74857-37018056.mongo.ondigitalocean.com/admin?retryWrites=true&w=majority';

const moveEyesMoreRight = async () => {
  try {
    console.log('🎯 Moving Eyes dots a little bit more to the right...');
    
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
        
        // Move a little bit more to the right
        eyesPart.coordinates.x = 65;  // Move from 60% to 65% (a bit more right)
        
        console.log(`   ✅ New Eyes position: (${eyesPart.coordinates.x}%, ${eyesPart.coordinates.y}%)`);
        
        // Save the updated image
        await image.save();
        updatedCount++;
      } else {
        console.log('   ❌ No Eyes part found in this image');
      }
    }
    
    console.log('\n🎉 Successfully moved Eyes a bit more to the right!');
    console.log(`📊 Updated ${updatedCount} images`);
    
    console.log('\n📋 Position Change:');
    console.log('   Previous: Eyes at (60%, 50%)');
    console.log('   New: Eyes at (65%, 50%) - a little bit more right');
    
  } catch (error) {
    console.error('❌ Error moving Eyes:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Connect to database and run the script
mongoose.connect(mongoUrl).then(async () => {
  console.log('✅ Connected to MongoDB');
  await moveEyesMoreRight();
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});


