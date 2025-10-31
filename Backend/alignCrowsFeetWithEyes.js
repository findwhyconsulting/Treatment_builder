import mongoose from 'mongoose';
import Image from './src/models/images.js';

const mongoUrl = 'mongodb+srv://doadmin:562A14wX39jHTu7h@db-mongodb-syd1-74857-37018056.mongo.ondigitalocean.com/admin?retryWrites=true&w=majority';

const alignCrowsFeetWithEyes = async () => {
  try {
    console.log('🎯 Aligning Crows feet with Eyes on same horizontal line...');
    
    // Get all face images
    const faceImages = await Image.find({ type: 'face' });
    console.log(`📊 Found ${faceImages.length} face images`);
    
    let updatedCount = 0;
    
    // Update each face image's crows feet coordinates
    for (const image of faceImages) {
      console.log(`\n📸 Processing Image: ${image.uniqueCode}`);
      
      // Find the crows feet part
      const crowsFeetPart = image.parts.find(part => part.partName === 'Crows feet');
      
      if (crowsFeetPart) {
        console.log(`   📍 Current Crows feet position: (${crowsFeetPart.coordinates.x}%, ${crowsFeetPart.coordinates.y}%)`);
        
        // Keep x position (side of face) but align y with Eyes
        // Eyes are at y: 50%, so Crows feet should also be at y: 50%
        crowsFeetPart.coordinates.y = 50;  // Same horizontal line as Eyes
        
        console.log(`   ✅ New Crows feet position: (${crowsFeetPart.coordinates.x}%, ${crowsFeetPart.coordinates.y}%)`);
        
        // Save the updated image
        await image.save();
        updatedCount++;
      } else {
        console.log('   ❌ No Crows feet part found in this image');
      }
    }
    
    console.log('\n🎉 Successfully aligned Crows feet with Eyes!');
    console.log(`📊 Updated ${updatedCount} images`);
    
    console.log('\n📋 Position Change:');
    console.log('   Eyes position: (65%, 50%)');
    console.log('   Crows feet: Moved to same horizontal line (y: 50%)');
    console.log('   Result: Both Eyes and Crows feet on same level');
    
    console.log('\n🎯 Crows feet should now be:');
    console.log('   - On the same horizontal line as Eyes');
    console.log('   - At the outer corner of eye area');
    console.log('   - Properly aligned for eye treatments');
    
  } catch (error) {
    console.error('❌ Error aligning Crows feet:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Connect to database and run the script
mongoose.connect(mongoUrl).then(async () => {
  console.log('✅ Connected to MongoDB');
  await alignCrowsFeetWithEyes();
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});


