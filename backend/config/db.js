const mongoose = require('mongoose');

const connectDB = async () => {
  const uris = [
    process.env.MONGODB_URI,
    process.env.MONGODB_URI_ALT
  ].filter(Boolean);

  let connected = false;

  for (const uri of uris) {
    try {
      const sanitizedUri = uri.replace(/:([^:@]+)@/, ':****@');
      console.log(`Connecting to MongoDB Atlas: ${sanitizedUri}`);
      
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000
      });

      console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host} / ${conn.connection.name}`);
      connected = true;
      break;
    } catch (err) {
      console.warn(`⚠️ Failed connecting with URI: ${err.message}`);
    }
  }

  if (!connected) {
    console.error('❌ Could not connect to any MongoDB Atlas instance.');
  }
};

module.exports = connectDB;
