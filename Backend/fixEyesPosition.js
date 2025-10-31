import mongoose from 'mongoose';
import Image from './src/models/images.js';

const mongoUrl = 'mongodb+srv://doadmin:562A14wX39jHTu7h@db-mongodb-syd1-74857-37018056.mongo.ondigitalocean.com/admin?retryWrites=true&w=majority';

const fixEyesPosition = async () => {
  try {
    console.log('🎯 Moving Eyes dots to actual eye area...');
    
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
        
        // Move much lower: from y: 38% to y: 30% (on actual eyes, not forehead)
        eyesPart.coordinates.y = 30;
        
        console.log(`   ✅ New Eyes position: (${eyesPart.coordinates.x}%, ${eyesPart.coordinates.y}%)`);
        
        // Save the updated image
        await image.save();
        updatedCount++;
      } else {
        console.log('   ❌ No Eyes part found in this image');
      }
    }
    
    console.log('\n🎉 Successfully moved Eyes to correct position!');
    console.log(`📊 Updated ${updatedCount} images`);
    
    console.log('\n📋 Position Change:');
    console.log('   Previous: Eyes at y: 38% (too high, on forehead)');
    console.log('   New: Eyes at y: 30% (on actual eye area)');
    
    console.log('\n🎯 The Eyes dots should now be positioned:');
    console.log('   - On the actual eye area');
    console.log('   - Around the eyelids/pupils');
    console.log('   - Not on the forehead');
    
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
  await fixEyesPosition();
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});


