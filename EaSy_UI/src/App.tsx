import { useState } from "react";
import "./App.css";

interface Email {
  subject: string;
  sender: string;
  body: string;
}

function App() {
  const [email, setEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");

  const getEmail = async () => {
    setLoading(true);
    setError("");

    try {
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      const tab = tabs[0];

      if (!tab.id) {
        throw new Error("No active tab found.");
      }

      chrome.tabs.sendMessage(
        tab.id,
        {action: "extractEmail"},
        (response) => {
          if (chrome.runtime.lastError) {
            setError("Could not connect to Gmail.");
            setLoading(false);
            return;
          }
          if (!response || !response.success) {
            setError("Failed to extract email.");
            setLoading(false);
            return;
          }
          setEmail(response.email);
          setLoading(false);
        }
      );
    } catch (error) {
      console.error(error);
      setError("An error occurred while extracting the email.");
      setLoading(false);
    }
  };

  const summarizeEmail = async () => {
    if (!email) return;

    setLoading(true);
    setError("");
    setSummary("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/summarize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(email),
        }
      );
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to summarize email");
      }

      setSummary(data.summary);

    } catch (error) {
      console.error(error);
      setError("Could not summarize the email.");
    } finally {
      setLoading(false);
    }
  };

  const testBackend = async () => {
    try {
      const response = await fetch("http://localhost:5000");

      const data = await response.json();

      console.log("Backend response:", data);

      alert(data.message);
    } catch (error) {
      console.error("Backend connection failed:", error);
      alert("Backend connection failed");
    }
  };
  
  return (
    <div className="container">
      <div className="header">
        <div className="logo">ES</div>
        <div>
          <h1>EaSy - Email Summarizer</h1>
          <p>AI-powered email summarization</p>
        </div>
      </div>
      {!email && (
        <div className="empty-state">
          <div className="empty-icon">
            📧
          </div>
          <h2>Ready to Summarize</h2>
          <p>Open an email in Gmail and click the button below to summarize it.</p>
        </div>
      )}

      {email && (
        <div className="email-card">
        <div className="email-header">
          <div className="avatar">
            {email.sender
              ? email.sender.charAt(0).toUpperCase()
              : "ES"}
          </div>
          <div className="email-info">
            <h2>{email.sender || "Unknown Sender"}</h2>
            <p>{email.sender}</p>
          </div>
        </div>
        <div className="subject">
          {email.subject || "No Subject"}
        </div>
        <div className="body-preview">
          {email.body || "No body content"}
        </div>
      </div>
      )}

      {summary && (
        <div className="summary-card">
          <h2>Summary</h2>
          <p>{summary}</p>
        </div>
      )}

      {error && (
        <div className="error">
          {error}
        </div>
      )}
    
      <button className="summarize-button" onClick={getEmail} disabled={loading}>
        {loading ? "Reading..." : "Get Email"}
      </button>
      <button className="summarize-button" onClick={summarizeEmail} disabled={loading}>
        {loading ? "Loading..." : "Summarize Email"}
      </button>
      <button onClick={testBackend}>
        Test Backend
      </button>
      <div className="hint">
        Open an email in Gmail and click this button.
      </div>
    </div>
  );
}

export default App;