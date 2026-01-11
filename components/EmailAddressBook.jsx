import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

export default function EmailAddressBook() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(null);
  const [contacts, setContacts] = useState([]);

  const fetchContacts = async () => {
    const res = await axios.get(`${API}/email-contacts`);
    setContacts(res.data);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // ✅ ADD SINGLE EMAIL (THIS WAS MISSING)
  const addEmail = async () => {
    if (!name || !email) {
      alert("Please enter name and email");
      return;
    }

    try {
      await axios.post(`${API}/email-contacts`, { name, email });
      setName("");
      setEmail("");
      fetchContacts();
    } catch (error) {
      console.error(error);
      alert("Failed to add email");
    }
  };

  // ✅ UPLOAD FILE
  const uploadFile = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file); // MUST match multer

      await axios.post(`${API}/email-contacts/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("File uploaded successfully");
      setFile(null);
      fetchContacts();
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Email Address Book</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={addEmail}>Add</button>

      <br /><br />

      <input
        type="file"
        accept=".csv,.xlsx"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={uploadFile}>Upload</button>

      <br /><br />

      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Select</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((c, i) => (
            <tr key={i}>
              <td><input type="checkbox" /></td>
              <td>{c.name}</td>
              <td>{c.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
