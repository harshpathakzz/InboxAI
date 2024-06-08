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
import { SelectEmailNumber } from "@/components/select-email-number/select-email-number";

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
  const [maxEmailsToDisplay, setMaxEmailsToDisplay] = useState<number>(15);

  useEffect(() => {
    fetchEmails();
  }, [maxEmailsToDisplay]);

  const fetchEmails = async () => {
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

  const handleValueChange = (value: number) => {
    setMaxEmailsToDisplay(value);
    console.log("Maximum Emails to Display:", value);
  };

  return (
    <div>
      <h1>Gmail Inbox</h1>
      <div>
        <SelectEmailNumber defaultValue={15} onChange={handleValueChange} />
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col items-center gap-4 m-4">
          {emails.length > 0 ? (
            emails.map((email, index) => (
              <Sheet key={index}>
                <SheetTrigger asChild>
                  <div className="p-4 border-l-4 border cursor-pointer w-3/4">
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
                <SheetContent className="overflow-y-auto  xl:w-[1000px] xl:max-w-none sm:w-[400px] sm:max-w-[540px] ">
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
