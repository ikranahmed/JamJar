import db from "../config/connection.js";
// import {Playlistmodel, User} from "../models/index.js";
import cleanDB from "./cleanDB.js";



db.once('open', async () => {
  await cleanDB();



  process.exit(0);
});
