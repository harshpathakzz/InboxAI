"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import EmailParser from "@/components/email-parser/email-parser";
import useEmailParser from "@/hooks/useEmailParser";

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

interface EmailListItemProps {
  email: EmailData;
}
interface EmailData {
  id: string;
  from: string;
  subject: string;
  body: string;
  snippet: string;
  classification: string;
}

const EmailListItem: React.FC<EmailListItemProps> = ({ email }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="p-4 border-l-4 border cursor-pointer w-3/4">
          <p>
            <strong>From:</strong> {email.from}
          </p>
          <p>
            <strong>Subject:</strong> {email.subject}
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
  );
};

export default EmailListItem;
