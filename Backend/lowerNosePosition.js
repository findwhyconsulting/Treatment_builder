import mongoose from 'mongoose';
import Image from './src/models/images.js';

const mongoUrl = 'mongodb+srv://doadmin:562A14wX39jHTu7h@db-mongodb-syd1-74857-37018056.mongo.ondigitalocean.com/admin?retryWrites=true&w=majority';

const lowerNosePosition = async () => {
  try {
    console.log('🎯 Moving nose dots a little lower...');
    
    // Get all face images
    const faceImages = await Image.find({ type: 'face' });
    console.log(`📊 Found ${faceImages.length} face images`);
    
    let updatedCount = 0;
    
    // Update each face image's nose coordinates
    for (const image of faceImages) {
      console.log(`\n📸 Processing Image: ${image.uniqueCode}`);
      
      // Find the nose part
      const nosePart = image.parts.find(part => part.partName === 'Nose');
      
      if (nosePart) {
        console.log(`   📍 Current nose position: (${nosePart.coordinates.x}%, ${nosePart.coordinates.y}%)`);
        
        // Move a little lower: from y: 52% to y: 56%
        nosePart.coordinates.y = 56;
        
        console.log(`   ✅ New nose position: (${nosePart.coordinates.x}%, ${nosePart.coordinates.y}%)`);
        
        // Save the updated image
        await image.save();
        updatedCount++;
      } else {
        console.log('   ❌ No Nose part found in this image');
      }
    }
    
    console.log('\n🎉 Successfully moved nose lower!');
    console.log(`📊 Updated ${updatedCount} images`);
    
    console.log('\n📋 Position Change:');
    console.log('   Previous: Nose at y: 52%');
    console.log('   New: Nose at y: 56% (4% lower)');
    
    console.log('\n🎯 The nose dots should now be positioned:');
    console.log('   - Lower on the nose area');
    console.log('   - More in the middle/tip of nose');
    console.log('   - Better anatomical positioning');
    
  } catch (error) {
    console.error('❌ Error moving nose:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Connect to database and run the script
mongoose.connect(mongoUrl).then(async () => {
  console.log('✅ Connected to MongoDB');
  await lowerNosePosition();
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});


