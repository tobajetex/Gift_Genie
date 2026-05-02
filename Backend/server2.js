import express from "express";

import { checkEnvironment } from "./checkEnvironment.js";
import { giftController } from "./controllers/giftController.js";

import cors from "cors";

//End of added code
const app = express();
app.use(cors());
app.use(express.json());
checkEnvironment();

app.post("/api/gift", giftController);
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
