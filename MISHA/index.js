import "dotenv/config";
import { dirname } from "path";
import { fileURLToPath } from "url";

import express from "express";
import exphbs from "express-handlebars";

import { connect } from "./src/models/db.js";
import router from "./src/routes/router.js";

/***
 *  Setup and Run Express App
 */
async function startServer() {
  const __dirname = dirname(fileURLToPath(import.meta.url)); // directory URL
  const app = express();

  // Set static folder
  app.use("/static", express.static(__dirname + "/public"));

  // Set favicon

  // Set templating engine to exphbs
  app.engine(
    "hbs",
    exphbs.engine({
      extname: "hbs",
    })
  );
  app.set("view engine", "hbs");
  app.set("views", "./views");
  app.set("view cache", false);

  // Parse body from json format
  app.use(express.json());

  app.get("/favicon.ico", (req, res) => {
    res.status(204);
  });

  // Assign router
  app.use(router);

  await connect();
  console.log("Connected to MongoDB Server.");

  app.listen(process.env.PORT, () => {
    console.log("Express app is now listening on port " + process.env.PORT);
  });
}

startServer();
