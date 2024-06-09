"use client";

import React, { useState, useEffect, useCallback } from "react";
import EmailListItem from "@/components/email-list-item/email-list-item";
import { SelectEmailNumber } from "@/components/select-email-number/select-email-number";
import parseEmail from "@/hooks/ParseEmail";
import useEmailStore from "@/stores/useEmailStore";
import ClassificationButton from "@/components/classification-button/classification-button";
import ApiKeyInput from "@/components/api-key-input/api-key-input";
import axios from "axios";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const fetchEmails = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/emails?maxResults=${maxEmailsToDisplay}`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 401) {
        router.push("/");
        return;
      }

      const data = response.data;
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
  }, [maxEmailsToDisplay, setEmailStore, router]);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails, maxEmailsToDisplay]);

  const handleValueChange = (value: number) => {
    setMaxEmailsToDisplay(value);
    console.log("Maximum Emails to Display:", value);
  };

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/auth/logout", {
        withCredentials: true,
      });
      router.push("/");
      console.log("Logged out successfully.");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-4xl font-bold text-center mb-8">InboxAI</h1>
      <div className="flex justify-between mb-6">
        <div>
          <p className="font-bold">Deadpool</p>
          <p>peterparker@marvel.com</p>
        </div>
        <div className="flex items-center gap-4">
          <ApiKeyInput />
          <button
            onClick={handleLogout}
            className="py-2 px-4 border border-white rounded"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex justify-between mb-6">
        <SelectEmailNumber defaultValue={2} onChange={handleValueChange} />
        <ClassificationButton />
      </div>
      {isLoading ? (
        <p className="text-center text-lg">Loading...</p>
      ) : (
        <div className="flex flex-col items-center gap-6">
          <div className="w-full max-w-4xl flex flex-col items-center gap-4 ">
            {emailStore.length > 0 ? (
              emailStore.map((email) => (
                <EmailListItem key={email.id} email={email} />
              ))
            ) : (
              <p className="text-center text-lg">No emails found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
