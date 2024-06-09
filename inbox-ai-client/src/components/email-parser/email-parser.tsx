"use client";
import React from "react";
import useEmailParser from "@/hooks/useEmailParser";

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
  email: Email;
}

const EmailParser: React.FC<EmailParserProps> = ({ email }) => {
  const { from, subject, body } = useEmailParser(email);

  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-md bg-white overflow-auto">
      <p>
        <strong>From:</strong> {from}
      </p>
      <p>
        <strong>Subject:</strong> {subject}
      </p>
      <hr />
      <div className="overflow-auto">
        <div dangerouslySetInnerHTML={{ __html: body }} />
      </div>
    </div>
  );
};

export default EmailParser;
