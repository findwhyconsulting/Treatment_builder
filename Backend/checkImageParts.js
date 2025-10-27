import mongoose from 'mongoose';
import Image from './src/models/images.js';

const mongoUrl = 'mongodb+srv://doadmin:562A14wX39jHTu7h@db-mongodb-syd1-74857-37018056.mongo.ondigitalocean.com/admin?retryWrites=true&w=majority';

mongoose.connect(mongoUrl).then(async () => {
  console.log('✅ Connected to MongoDB');
  
  const faceImages = await Image.find({ type: 'face' });
  console.log('📊 Number of face images:', faceImages.length);
  
  faceImages.forEach((img, index) => {
    console.log(`📸 Image ${index + 1}: ${img.uniqueCode}`);
    console.log(`   Parts: ${img.parts.length}`);
    if (img.parts.length > 0) {
      img.parts.forEach((part, pIndex) => {
        console.log(`   Part ${pIndex + 1}: ${part.partName} at (${part.coordinates?.x}, ${part.coordinates?.y})`);
      });
    } else {
      console.log('   ❌ NO PARTS DEFINED');
    }
    console.log('---');
  });
  
  mongoose.connection.close();
}).catch(err => {
  console.error('❌ MongoDB error:', err);
  process.exit(1);
});
