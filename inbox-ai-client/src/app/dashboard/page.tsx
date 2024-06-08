"use client";

import React, { useState, useEffect } from "react";

interface EmailHeader {
  name: string;
  value: string;
}

interface Email {
  id: string;
  payload: {
    headers: EmailHeader[];
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
        </div>
      )}
    </div>
  );
};

export default Home;
