import express from "express";
import multer from "multer";
import {
  addSingleEmail,
  uploadEmails,
  listEmails,
} from "../controllers/emailController.js";

const router = express.Router();

/* Multer setup */
const upload = multer({ dest: "uploads/" });

router.post("/email-contacts", addSingleEmail);
router.post("/email-contacts/upload", upload.single("file"), uploadEmails);
router.get("/email-contacts", listEmails);

export default router;
