"use client";

import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import EmailParser from "@/components/email-parser/email-parser";

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

  return (
    <div>
      <h1>Gmail Inbox</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {emails.length > 0 ? (
            emails.map((email, index) => (
              <Sheet key={index}>
                <SheetTrigger asChild>
                  <div className="p-4 border border-gray-200 cursor-pointer">
                    <p>
                      <strong>From:</strong>{" "}
                      {getHeader(email.payload.headers, "From")}
                    </p>
                    <p>
                      <strong>Subject:</strong>{" "}
                      {getHeader(email.payload.headers, "Subject")}
                    </p>
                  </div>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto  xl:w-[1000px] xl:max-w-none sm:w-[400px] sm:max-w-[540px] bg-red-400">
                  <SheetHeader>
                    <SheetTitle>Email Details</SheetTitle>
                  </SheetHeader>
                  <SheetDescription className="overflow-y-auto">
                    <EmailParser email={email} />
                  </SheetDescription>
                </SheetContent>
              </Sheet>
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
