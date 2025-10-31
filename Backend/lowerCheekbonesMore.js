import mongoose from 'mongoose';
import Image from './src/models/images.js';

const mongoUrl = 'mongodb+srv://doadmin:562A14wX39jHTu7h@db-mongodb-syd1-74857-37018056.mongo.ondigitalocean.com/admin?retryWrites=true&w=majority';

const lowerCheekbonesMore = async () => {
  try {
    console.log('🎯 Moving cheekbones dots a little lower...');
    
    // Get all face images
    const faceImages = await Image.find({ type: 'face' });
    console.log(`📊 Found ${faceImages.length} face images`);
    
    let updatedCount = 0;
    
    // Update each face image's cheekbones coordinates
    for (const image of faceImages) {
      console.log(`\n📸 Processing Image: ${image.uniqueCode}`);
      
      // Find the cheekbones part
      const cheekbonesPart = image.parts.find(part => part.partName === 'Cheekbones');
      
      if (cheekbonesPart) {
        console.log(`   📍 Current position: (${cheekbonesPart.coordinates.x}%, ${cheekbonesPart.coordinates.y}%)`);
        
        // Move a little lower: from y: 58% to y: 62%
        cheekbonesPart.coordinates.y = 62;
        
        console.log(`   ✅ New position: (${cheekbonesPart.coordinates.x}%, ${cheekbonesPart.coordinates.y}%)`);
        
        // Save the updated image
        await image.save();
        updatedCount++;
      } else {
        console.log('   ❌ No Cheekbones part found in this image');
      }
    }
    
    console.log('\n🎉 Successfully moved cheekbones lower!');
    console.log(`📊 Updated ${updatedCount} images`);
    
    console.log('\n📋 Position Change:');
    console.log('   Previous: Cheekbones at y: 58%');
    console.log('   New: Cheekbones at y: 62% (4% lower)');
    
    console.log('\n🎯 The cheekbones dots should now be positioned:');
    console.log('   - Even lower on the face');
    console.log('   - In the lower cheek area');
    console.log('   - More anatomically accurate');
    
  } catch (error) {
    console.error('❌ Error moving cheekbones:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Connect to database and run the script
mongoose.connect(mongoUrl).then(async () => {
  console.log('✅ Connected to MongoDB');
  await lowerCheekbonesMore();
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});


