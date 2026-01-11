import fs from "fs";
import xlsx from "xlsx";
import csv from "csv-parser";

let emailContacts = [];


const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};


export const addSingleEmail = (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email required" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  emailContacts.push({ name, email });
  res.status(201).json({ message: "Email added successfully" });
};

/* ---------------------------
   2. Bulk Upload Emails
---------------------------- */
export const uploadEmails = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "File required" });
  }

  const filePath = req.file.path;
  const ext = req.file.originalname.split(".").pop();

  let contacts = [];

  if (ext === "xlsx") {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    data.forEach((row) => {
      if (row.name && row.email && isValidEmail(row.email)) {
        contacts.push({ name: row.name, email: row.email });
      }
    });
  } else if (ext === "csv") {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        if (row.name && row.email && isValidEmail(row.email)) {
          contacts.push({ name: row.name, email: row.email });
        }
      })
      .on("end", () => {
        emailContacts.push(...contacts);
        fs.unlinkSync(filePath);
        return res.json({ message: "Emails uploaded successfully" });
      });

    return;
  } else {
    return res.status(400).json({ message: "Invalid file format" });
  }

  emailContacts.push(...contacts);
  fs.unlinkSync(filePath);
  res.json({ message: "Emails uploaded successfully" });
};

/* ---------------------------
   3. List Emails
---------------------------- */
export const listEmails = (req, res) => {
  res.json(emailContacts);
};
