"use client";

import React, { useState, useEffect } from "react";

interface EmailHeader {
  name: string;
  value: string;
}

interface EmailPart {
  mimeType: string;
  body: {
    size: number;
    data?: string;
  };
  parts?: EmailPart[];
}

interface Email {
  id: string;
  payload: {
    headers: EmailHeader[];
    body?: {
      data?: string;
    };
    parts?: EmailPart[];
  };
}

const Home: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/emails`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      console.log("Fetched Emails:", data);
      setEmails(data);
    } catch (error) {
      console.error("Error fetching emails:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getHeader = (headers: EmailHeader[], name: string) => {
    const header = headers.find((header) => header.name === name);
    return header ? header.value : "Unknown";
  };

  const decodeBase64 = (str: string) => {
    return decodeURIComponent(
      escape(window.atob(str.replace(/-/g, "+").replace(/_/g, "/")))
    );
  };

  const findBody = (parts: EmailPart[]): { text: string; html: string } => {
    let result = { text: "", html: "" };
    if (!parts) return result;

    for (const part of parts) {
      if (part.mimeType === "text/plain" && part.body.data) {
        result.text += decodeBase64(part.body.data);
      } else if (part.mimeType === "text/html" && part.body.data) {
        result.html += decodeBase64(part.body.data);
      } else if (part.parts) {
        const nestedResult = findBody(part.parts);
        result = {
          text: result.text + nestedResult.text,
          html: result.html + nestedResult.html,
        };
      }
    }
    return result;
  };

  return (
    <div>
      <h1>Gmail Inbox</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {emails.length > 0 ? (
            emails.map((email, index) => {
              let bodyContent = { text: "", html: "" };

              if (email.payload.parts) {
                bodyContent = findBody(email.payload.parts);
              } else if (email.payload.body?.data) {
                const decodedBody = decodeBase64(email.payload.body.data);
                // Assuming HTML content if no parts and direct body data
                bodyContent.html = decodedBody;
              }

              return (
                <div
                  key={index}
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <p>
                    <strong>From:</strong>{" "}
                    {getHeader(email.payload.headers, "From")}
                  </p>
                  <p>
                    <strong>Subject:</strong>{" "}
                    {getHeader(email.payload.headers, "Subject")}
                  </p>
                  <hr />
                  <div>
                    {bodyContent.html ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: bodyContent.html }}
                      />
                    ) : (
                      <p>{bodyContent.text}</p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p>No emails found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
