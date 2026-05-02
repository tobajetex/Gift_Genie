import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { checkEnvironment } from "./checkEnvironment.js";
import { giftController } from "./controllers/giftController.js";

import cors from "cors";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
//End of added code
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
checkEnvironment();

app.post("/api/gift", giftController);
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
