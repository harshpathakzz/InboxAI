"use client";

import React, { useState, useEffect, useCallback } from "react";
import EmailListItem from "@/components/email-list-item/email-list-item";
import { SelectEmailNumber } from "@/components/select-email-number/select-email-number";
import parseEmail from "@/hooks/ParseEmail";
import useEmailStore from "@/stores/useEmailStore";

interface Email {
  id: string;
  payload: {
    headers: EmailHeader[];
    body?: {
      data?: string;
    };
    parts?: EmailPart[];
  };
  snippet: string;
}

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

const Home: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [maxEmailsToDisplay, setMaxEmailsToDisplay] = useState<number>(2);
  const { setEmails: setEmailStore } = useEmailStore();
  const { emails: emailStore } = useEmailStore();

  const fetchEmails = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/emails?maxResults=${maxEmailsToDisplay}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      console.log("Fetched Emails:", data);
      setEmails(data);
      const parsedEmails = data.map((email: Email) => {
        const { id, from, subject, body, snippet } = parseEmail(email);
        return {
          id: email.id,
          from,
          subject,
          body,
          snippet,
          classification: "unknown",
        };
      });
      console.log("Parsed Emails:", parsedEmails);
      setEmailStore(parsedEmails);
    } catch (error) {
      console.error("Error fetching emails:", error);
    } finally {
      setIsLoading(false);
    }
  }, [maxEmailsToDisplay, setEmailStore]);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails, maxEmailsToDisplay]);

  const handleValueChange = (value: number) => {
    setMaxEmailsToDisplay(value);
    console.log("Maximum Emails to Display:", value);
  };

  return (
    <div>
      <h1>Gmail Inbox</h1>
      <div>
        <SelectEmailNumber defaultValue={2} onChange={handleValueChange} />
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col items-center gap-4 m-4">
          {emailStore.length > 0 ? (
            emailStore.map((email, index) => (
              <EmailListItem key={email.id} email={email} />
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
