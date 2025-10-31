import mongoose from 'mongoose';

// Database Connection
const DB_URL = "mongodb+srv://doadmin:562A14wX39jHTu7h@db-mongodb-syd1-74857-37018056.mongo.ondigitalocean.com/admin?retryWrites=true&w=majority";

// Image Schema
const imageSchema = new mongoose.Schema({
  uniqueCode: String,
  type: String,
  parts: [{
    partName: String,
    coordinates: {
      x: Number,
      y: Number
    }
  }],
  isDeleted: { type: Boolean, default: false }
});

async function addMissingCheekbones() {
  let connection;
  
  try {
    console.log('➕ Adding missing Cheekbones coordinates to all images...\n');

    connection = await mongoose.createConnection(DB_URL, {
      retryWrites: true,
      w: 'majority',
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected successfully!\n');

    const Image = connection.model('Image', imageSchema);

    // Get all face images
    const images = await Image.find({ 
      type: "face", 
      isDeleted: { $ne: true } 
    });

    // Reasonable cheekbones coordinates for different face types
    const cheekbonesCoordinates = {
      "face-img1": { x: 68, y: 62 }, // Already exists - keep current
      "face-img2": { x: 70, y: 60 }, // Slightly different positioning
      "face-img3": { x: 65, y: 58 }, // Adjusted for face shape
      "face-img4": { x: 68, y: 60 }, // Standard positioning
      "face-img5": { x: 70, y: 58 }, // Higher cheekbones
      "face-img6": { x: 67, y: 62 }  // Similar to img1
    };

    let addedCount = 0;

    for (const image of images) {
      const existingCheekbones = image.parts.find(p => p.partName === "Cheekbones");
      
      if (!existingCheekbones) {
        const coords = cheekbonesCoordinates[image.uniqueCode];
        if (coords) {
          console.log(`➕ Adding Cheekbones to ${image.uniqueCode}: (${coords.x}%, ${coords.y}%)`);
          
          image.parts.push({
            partName: "Cheekbones",
            coordinates: coords
          });
          
          await image.save();
          addedCount++;
        }
      } else {
        console.log(`✅ ${image.uniqueCode}: Cheekbones already exists (${existingCheekbones.coordinates.x}%, ${existingCheekbones.coordinates.y}%)`);
      }
    }

    console.log(`\n🎉 Successfully added Cheekbones to ${addedCount} images!`);
    
    // Verify all images now have Cheekbones
    console.log('\n🔍 VERIFICATION:');
    console.log('=' .repeat(40));
    
    const updatedImages = await Image.find({ type: "face", isDeleted: { $ne: true } });
    updatedImages.forEach(image => {
      const cheekbones = image.parts.find(p => p.partName === "Cheekbones");
      if (cheekbones) {
        console.log(`✅ ${image.uniqueCode}: (${cheekbones.coordinates.x}%, ${cheekbones.coordinates.y}%)`);
      } else {
        console.log(`❌ ${image.uniqueCode}: STILL MISSING`);
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (connection) {
      await connection.close();
      console.log('\n📴 Closed database connection');
    }
  }
}

addMissingCheekbones();

