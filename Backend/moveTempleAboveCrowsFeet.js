import mongoose from 'mongoose';
import Image from './src/models/images.js';

const mongoUrl = 'mongodb+srv://doadmin:562A14wX39jHTu7h@db-mongodb-syd1-74857-37018056.mongo.ondigitalocean.com/admin?retryWrites=true&w=majority';

const moveTempleAboveCrowsFeet = async () => {
  try {
    console.log('🎯 Moving Temple dots just a little above Crows feet level...');
    
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
        
        // Move Temple down to just above Crows feet level
        // Crows feet are at y: 50%, so Temple should be at y: 45%
        templePart.coordinates.y = 45;  // Just above Crows feet (50%)
        
        console.log(`   ✅ New Temples position: (${templePart.coordinates.x}%, ${templePart.coordinates.y}%)`);
        
        // Save the updated image
        await image.save();
        updatedCount++;
      } else {
        console.log('   ❌ No Temples part found in this image');
      }
    }
    
    console.log('\n🎉 Successfully moved Temples just above Crows feet level!');
    console.log(`📊 Updated ${updatedCount} images`);
    
    console.log('\n📋 Position Reference:');
    console.log('   Crows feet: (75%, 50%)');
    console.log('   Temples: (75%, 45%) - just above Crows feet');
    
    console.log('\n🎯 Temples should now be positioned:');
    console.log('   - Just a little above Crows feet');
    console.log('   - At the proper temple level');
    console.log('   - Close to eye area but slightly higher');
    
  } catch (error) {
    console.error('❌ Error moving Temples:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Connect to database and run the script
mongoose.connect(mongoUrl).then(async () => {
  console.log('✅ Connected to MongoDB');
  await moveTempleAboveCrowsFeet();
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});


