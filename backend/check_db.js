const mongoose = require('mongoose');
require('dotenv').config();

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("CONNECTED");
    const count = await mongoose.connection.db.collection('universities').countDocuments();
    console.log("COUNT:", count);
    process.exit(0);
  } catch (err) {
    console.error("ERROR:", err);
    process.exit(1);
  }
}

check();
