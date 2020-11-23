// var config = {};

var admin = require("firebase-admin");

var serviceAccount = require("./meoqi-91546-firebase-adminsdk-qpg6p-795cdd8eb0.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://meoqi-91546.firebaseio.com"
})

module.exports.admin = admin

// module.exports = config;