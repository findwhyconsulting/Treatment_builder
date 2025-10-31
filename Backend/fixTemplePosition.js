import mongoose from 'mongoose';
import Image from './src/models/images.js';

const mongoUrl = 'mongodb+srv://doadmin:562A14wX39jHTu7h@db-mongodb-syd1-74857-37018056.mongo.ondigitalocean.com/admin?retryWrites=true&w=majority';

const fixTemplePosition = async () => {
  try {
    console.log('🎯 Moving Temple dots to actual temple area (side of forehead)...');
    
    // Get all face images
    const faceImages = await Image.find({ type: 'face' });
    console.log(`📊 Found ${faceImages.length} face images`);
    
    let updatedCount = 0;
    
    // Update each face image's temple coordinates
    for (const image of faceImages) {
      console.log(`\n📸 Processing Image: ${image.uniqueCode}`);
      
      // Find the temples part
      const templePart = image.parts.find(part => part.partName === 'Temples');
      
      if (templePart) {
        console.log(`   📍 Current Temples position: (${templePart.coordinates.x}%, ${templePart.coordinates.y}%)`);
        
        // Move Temple to actual temple area - side of forehead (higher up)
        templePart.coordinates.x = 85;  // Keep on side of face
        templePart.coordinates.y = 30;  // Move much higher - to forehead level, not ear level
        
        console.log(`   ✅ New Temples position: (${templePart.coordinates.x}%, ${templePart.coordinates.y}%)`);
        
        // Save the updated image
        await image.save();
        updatedCount++;
      } else {
        console.log('   ❌ No Temples part found in this image');
      }
    }
    
    console.log('\n🎉 Successfully moved Temples to actual temple area!');
    console.log(`📊 Updated ${updatedCount} images`);
    
    console.log('\n📋 Position Change:');
    console.log('   Previous: Temples too low (around ear area)');
    console.log('   New: Temples at (85%, 30%) - side of forehead');
    
    console.log('\n🎯 Temples should now be positioned:');
    console.log('   - On the actual temple area');
    console.log('   - Side of the forehead (not by ears)');
    console.log('   - Higher up where temple treatments are done');
    
  } catch (error) {
    console.error('❌ Error fixing Temples position:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Connect to database and run the script
mongoose.connect(mongoUrl).then(async () => {
  console.log('✅ Connected to MongoDB');
  await fixTemplePosition();
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});


