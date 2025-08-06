import React, { useState } from "react";
import axios from "axios";

function App() {
  const [recipients, setRecipients] = useState("");
  const [prompt, setPrompt] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const generateEmail = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/generate-email", {
        prompt,
      });
      setEmail(response.data.email);
    } catch (error) {
      alert("Failed to generate email");
    }
    setLoading(false);
  };

  const sendEmail = async () => {
    try {
      const response = await axios.post("http://localhost:5000/send-email", {
        recipients: recipients.split(",").map((r) => r.trim()),
        subject: "AI Generated Email",
        content: email,
      });
      alert(response.data.message);
    } catch (error) {
      alert("Failed to send email");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h2>AI Email Sender</h2>
      <input
        type="text"
        placeholder="Recipients (comma separated)"
        value={recipients}
        onChange={(e) => setRecipients(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <textarea
        placeholder="Enter email prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows="4"
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <button onClick={generateEmail} disabled={loading}>
        {loading ? "Generating..." : "Generate Email"}
      </button>
      <textarea
        placeholder="Generated email will appear here..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        rows="6"
        style={{ width: "100%", marginTop: "10px" }}
      />
      <button onClick={sendEmail} style={{ marginTop: "10px" }}>
        Send Email
      </button>
    </div>
  );
}

export default App;
