import mongoose from 'mongoose';
import Image from './src/models/images.js';

const mongoUrl = 'mongodb+srv://doadmin:562A14wX39jHTu7h@db-mongodb-syd1-74857-37018056.mongo.ondigitalocean.com/admin?retryWrites=true&w=majority';

const adjustCheekbonesPosition = async () => {
  try {
    console.log('🎯 Adjusting cheekbones position to be lower...');
    
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
        
        // Update coordinates to lower cheekbone position
        cheekbonesPart.coordinates.x = 70;  // Slightly more to the side for better cheekbone placement
        cheekbonesPart.coordinates.y = 58;  // Lower position - actual cheekbone area
        
        console.log(`   ✅ New Cheekbones position: (${cheekbonesPart.coordinates.x}%, ${cheekbonesPart.coordinates.y}%)`);
        
        // Save the updated image
        await image.save();
        updatedCount++;
      } else {
        console.log('   ❌ No Cheekbones part found in this image');
      }
    }
    
    console.log('\n🎉 Successfully adjusted cheekbones position!');
    console.log(`📊 Updated ${updatedCount} images`);
    
    console.log('\n📋 Position Change:');
    console.log('   Old: Cheekbones at (68%, 48%) - Too high, near eyes');
    console.log('   New: Cheekbones at (70%, 58%) - Lower, on actual cheekbones');
    
    console.log('\n🎯 The cheekbones dots should now appear:');
    console.log('   - Lower on the face (around mid-cheek area)');
    console.log('   - Slightly more to the sides');
    console.log('   - On the actual cheekbone prominence');
    
  } catch (error) {
    console.error('❌ Error adjusting cheekbones position:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Connect to database and run the script
mongoose.connect(mongoUrl).then(async () => {
  console.log('✅ Connected to MongoDB');
  await adjustCheekbonesPosition();
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});


