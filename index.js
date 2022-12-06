import mongoose from "mongoose";
import app from "./App";
import config from "./config/index";

//IIFEE function
// (async()=>{} )()

(async () => {
  try {
    await mongoose.connect(config.MONGODB_URL);
    console.log("DB CONNECTED, YOU can use the schema");

    //express event listiner like get post delete put, ( all on listiner)
    app.on("error", (err) => {
      console.log("error", err);
      throw err;
    });
    const onListening = () => {
      console.log(`Listening on  ${config.PORT}`);
    };

    app.listen(config.PORT, onListening);
  } catch (error) {
    console.log("Error", error);
    throw err;
  }
})();
