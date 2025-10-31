import mongoose from 'mongoose';
import Image from './src/models/images.js';

const mongoUrl = 'mongodb+srv://doadmin:562A14wX39jHTu7h@db-mongodb-syd1-74857-37018056.mongo.ondigitalocean.com/admin?retryWrites=true&w=majority';

const fixCheekbonesCoordinates = async () => {
  try {
    console.log('🎯 Starting to fix cheekbones coordinates...');
    
    // Get all face images
    const faceImages = await Image.find({ type: 'face' });
    console.log(`📊 Found ${faceImages.length} face images`);
    
    if (faceImages.length === 0) {
      console.log('❌ No face images found');
      return;
    }
    
    let updatedCount = 0;
    
    // Update each face image's cheekbones coordinates
    for (const image of faceImages) {
      console.log(`\n📸 Processing Image: ${image.uniqueCode}`);
      
      // Find the cheekbones part
      const cheekbonesPart = image.parts.find(part => part.partName === 'Cheekbones');
      
      if (cheekbonesPart) {
        console.log(`   📍 Current Cheekbones position: (${cheekbonesPart.coordinates.x}%, ${cheekbonesPart.coordinates.y}%)`);
        
        // Update coordinates to proper cheekbone position
        cheekbonesPart.coordinates.x = 65;  // Slightly more to the side
        cheekbonesPart.coordinates.y = 58;  // Lower on the face (actual cheekbone area)
        
        console.log(`   ✅ Updated Cheekbones position: (${cheekbonesPart.coordinates.x}%, ${cheekbonesPart.coordinates.y}%)`);
        
        // Save the updated image
        await image.save();
        updatedCount++;
      } else {
        console.log('   ❌ No Cheekbones part found in this image');
      }
    }
    
    console.log('\n🎉 Successfully updated cheekbones coordinates!');
    console.log(`📊 Updated ${updatedCount} images`);
    
    console.log('\n📋 Coordinate Changes:');
    console.log('   Old: Cheekbones at (60%, 45%) - Too high, near eyebrow area');
    console.log('   New: Cheekbones at (65%, 58%) - Proper cheekbone position');
    
    console.log('\n🎯 Next Steps:');
    console.log('   1. Refresh the face page');
    console.log('   2. Select "Cheekbones" concern again');
    console.log('   3. Dots should now appear on actual cheekbones!');
    
  } catch (error) {
    console.error('❌ Error fixing cheekbones coordinates:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Connect to database and run the script
mongoose.connect(mongoUrl).then(async () => {
  console.log('✅ Connected to MongoDB');
  await fixCheekbonesCoordinates();
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});


