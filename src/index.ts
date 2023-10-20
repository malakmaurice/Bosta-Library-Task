import apiRoutes from "./routes/api-routes";
import bodyParser from "body-parser";
const express = require("express");
const app = express();
app.use(bodyParser.json());
app.use("/api", apiRoutes());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});

module.exports = app;
