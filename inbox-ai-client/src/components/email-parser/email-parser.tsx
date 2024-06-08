import React from "react";

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

interface EmailParserProps {
  email: Email;
}

const EmailParser: React.FC<EmailParserProps> = ({ email }) => {
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

  let bodyContent = { text: "", html: "" };

  if (email.payload.parts) {
    bodyContent = findBody(email.payload.parts);
  } else if (email.payload.body?.data) {
    const decodedBody = decodeBase64(email.payload.body.data);
    bodyContent.html = decodedBody;
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-md bg-white overflow-auto">
      <p>
        <strong>From:</strong> {getHeader(email.payload.headers, "From")}
      </p>
      <p>
        <strong>Subject:</strong> {getHeader(email.payload.headers, "Subject")}
      </p>
      <hr />
      <div className="overflow-auto">
        {bodyContent.html ? (
          <div dangerouslySetInnerHTML={{ __html: bodyContent.html }} />
        ) : (
          <p>{bodyContent.text}</p>
        )}
      </div>
    </div>
  );
};

export default EmailParser;
