// var config = {};

var admin = require("firebase-admin");

var serviceAccount = require("./firebase_jsonfile_name.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://firebase_project_name"
})

module.exports.admin = admin

// module.exports = config;
