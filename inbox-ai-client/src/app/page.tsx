"use client";

import { useState, useEffect } from "react";

interface EmailHeader {
  name: string;
  value: string;
}

interface EmailPayload {
  headers: EmailHeader[];
}

interface Email {
  id: string;
  payload: EmailPayload;
}

const Home: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokens = urlParams.get("tokens");

    if (tokens) {
      fetchEmails(tokens);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchEmails = async (tokens: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/emails?access_token=${
          JSON.parse(tokens).access_token
        }`
      );
      const data = await response.json();
      setEmails(data);
    } catch (error) {
      console.error("Error fetching emails:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Gmail Inbox</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {emails.length > 0 ? (
            emails.map((email, index) => (
              <div key={index}>
                <p>
                  From:{" "}
                  {
                    email.payload.headers.find(
                      (header) => header.name === "From"
                    )?.value
                  }
                </p>
                <p>
                  Subject:{" "}
                  {
                    email.payload.headers.find(
                      (header) => header.name === "Subject"
                    )?.value
                  }
                </p>
                <hr />
              </div>
            ))
          ) : (
            <p>No emails found.</p>
          )}
          <a href="http://localhost:5000/auth/google">Login with Google</a>
        </div>
      )}
    </div>
  );
};

export default Home;
