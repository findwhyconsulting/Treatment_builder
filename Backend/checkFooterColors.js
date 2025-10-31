import mongoose from 'mongoose';

// Database Connection
const DB_URL = "mongodb+srv://doadmin:562A14wX39jHTu7h@db-mongodb-syd1-74857-37018056.mongo.ondigitalocean.com/admin?retryWrites=true&w=majority";

// Content Schema
const contentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  footer: {
    footerColor: String,
    footerTextColor: String,
    footerCopyRight: String,
    privacyPolicy: String,
    termsOfService: String,
    footerSocialMediaLinks: {
      facebook: String,
      instagram: String,
      youtube: String,
      threads: String,
      linkedin: String,
    }
  }
});

async function checkFooterColors() {
  let connection;
  
  try {
    console.log('📡 Connecting to database to check footer colors...\n');

    connection = await mongoose.createConnection(DB_URL, {
      retryWrites: true,
      w: 'majority',
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected successfully!\n');

    const Content = connection.model('Content', contentSchema);

    // Get all content records
    const contents = await Content.find({}).select('user footer');
    
    console.log(`📊 Found ${contents.length} content records\n`);

    contents.forEach((content, index) => {
      console.log(`🎨 Content Record ${index + 1}:`);
      console.log(`   User ID: ${content.user}`);
      console.log(`   Footer Background Color: "${content.footer?.footerColor || 'NOT SET'}"`);
      console.log(`   Footer Text Color: "${content.footer?.footerTextColor || 'NOT SET'}"`);
      console.log(`   Footer Copyright: "${content.footer?.footerCopyRight || 'NOT SET'}"`);
      console.log('');
    });

    if (contents.length === 0) {
      console.log('⚠️  No content records found in database');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (connection) {
      await connection.close();
      console.log('📴 Closed database connection');
    }
  }
}

checkFooterColors();

