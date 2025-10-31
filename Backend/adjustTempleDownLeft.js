import mongoose from 'mongoose';
import Image from './src/models/images.js';

const mongoUrl = 'mongodb+srv://doadmin:562A14wX39jHTu7h@db-mongodb-syd1-74857-37018056.mongo.ondigitalocean.com/admin?retryWrites=true&w=majority';

const adjustTempleDownLeft = async () => {
  try {
    console.log('🎯 Moving Temple dots down and towards left (above eyebrows area)...');
    
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
        
        // Move Temple down and towards left - above eyebrows area
        templePart.coordinates.x = 75;  // Move left from 85% to 75%
        templePart.coordinates.y = 35;  // Move down from 30% to 35% (above eyebrows)
        
        console.log(`   ✅ New Temples position: (${templePart.coordinates.x}%, ${templePart.coordinates.y}%)`);
        
        // Save the updated image
        await image.save();
        updatedCount++;
      } else {
        console.log('   ❌ No Temples part found in this image');
      }
    }
    
    console.log('\n🎉 Successfully moved Temples down and left!');
    console.log(`📊 Updated ${updatedCount} images`);
    
    console.log('\n📋 Position Change:');
    console.log('   Previous: Temples at (85%, 30%) - too high and right');
    console.log('   New: Temples at (75%, 35%) - above eyebrows, more left');
    
    console.log('\n🎯 Temples should now be positioned:');
    console.log('   - Above the eyebrows area');
    console.log('   - More towards the left');
    console.log('   - In the proper temple region');
    
  } catch (error) {
    console.error('❌ Error adjusting Temples position:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Connect to database and run the script
mongoose.connect(mongoUrl).then(async () => {
  console.log('✅ Connected to MongoDB');
  await adjustTempleDownLeft();
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});


