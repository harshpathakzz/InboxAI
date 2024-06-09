"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";

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

export interface Email {
  id: string;
  payload: {
    headers: EmailHeader[];
    body?: {
      data?: string;
    };
    parts?: EmailPart[];
  };
}

interface EmailParserProps {
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

const EmailParser: React.FC<EmailParserProps> = ({ email }) => {
  return (
    <div className="p-4 border rounded-lg shadow-md overflow-auto m-2">
      <div className="flex justify-between items-center mb-2">
        <div>
          <p className="m-1">
            <strong>From:</strong> {email.from}
          </p>
          <p className="m-1">
            <strong>Subject:</strong> {email.subject}
          </p>
        </div>
        <Badge variant="secondary">{email.classification}</Badge>
      </div>
      <hr />
      <div className="overflow-auto">
        <div dangerouslySetInnerHTML={{ __html: email.body }} />
      </div>
    </div>
  );
};

export default EmailParser;
