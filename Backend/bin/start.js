/* Used to work with ES6 feature */
require("@babel/register");
require("babel-polyfill");
require("dotenv/config");


/* Create Server */
const config = require("../Server");

/* Use Application */
const app = require("../App");

/* Connet to Database */
require("../config/Database").mongoconnection();
