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

  const summarizeEmail = async () => {
    setLoading(true);
    setError("");
    setSummary("");

    try {
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      const tab = tabs[0];

      if (!tab.id) {
        throw new Error("No Active tab found.");
      }

      chrome.tabs.sendMessage(
        tab.id,
        {action: "extractEmail"},
        async (response) => {
          if (chrome.runtime.lastError) {
            setError("Could not connect to Gmail.");
            setLoading(false);
            return;
          }

          if (!response || !response.success) {
            setError("Failed to extract email.")
            setLoading(false);
            return;
          }

          const extractedEmail: Email = response.email;

          setEmail(extractedEmail);

          try {
            const apiResponse = await fetch(
              "http://localhost:5000/api/summarize",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(extractedEmail),
              }
            );

            const data = await apiResponse.json();

            if (!apiResponse.ok) {
              throw new Error(data.message || "Failed to summarize email");
            }

            setSummary(data.summary);

          } catch (error) {
            console.error(error);
            setError("Could not summarize the email.");
          } finally {
            setLoading(false);
          }
        }
      );

    } catch (error) {
      console.error(error);
      setError("An error occurred while processing the email.");
      setLoading(false);
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

      {email && summary &&(
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
        <div className="summary-card">
          {summary || "No Summary"}
        </div>
      </div>
      )}

      {error && (
        <div className="error">
          {error}
        </div>
      )}
    
      <button className="summarize-button" onClick={summarizeEmail} disabled={loading}>
        {loading ? "Loading..." : "Summarize Email"}
      </button>
      <div className="hint">
        Open an email in Gmail and click this button.
      </div>
    </div>
  );
}

export default App;