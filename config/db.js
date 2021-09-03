const mongoose = require("mongoose");

// Replace this with your MONGOURI.
const MONGOURI = "mongodb+srv://register:iitbijir4@bijirgiribasumatary.rcazv.mongodb.net/node-tuts?retryWrites=true&w=majority";

const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(MONGOURI, {
      useNewUrlParser: true
    });
    console.log("Connected to DB !!");
  } catch (e) {
    console.log(error);
    throw e;
  }
};

module.exports = InitiateMongoServer;