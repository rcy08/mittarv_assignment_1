const admin = require('firebase-admin');
const config = JSON.stringify(process.env.FIREBASE_ADMIN_CONFIG);
const serviceAccount = config;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_BUCKET
});

const storage = admin.storage();
const bucket = storage.bucket();

module.exports = bucket;