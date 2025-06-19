import app from "./App";
// import https from "https";
import http from "http";

import fs from "fs";
const config = require("./config/Config");


// const options = {
//   key: fs.readFileSync("/home/jenkins/SSL/ss.key"),
//   cert: fs.readFileSync("/home/jenkins/SSL/ss.crt") 
// };

const env = process.env.NODE_ENV || "local"; 
const configValue = config.get(env);
const port = configValue?.PORT || 3000; 


// const server = https.createServer(options, app);
const server = http.createServer( app);


server.listen(port, () => {
  console.log(`Server running on HTTPS in ${env} environment at port ${port}`);
});
