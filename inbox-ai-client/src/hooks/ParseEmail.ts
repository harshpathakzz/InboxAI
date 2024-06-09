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
  snippet: string;
  payload: {
    headers: EmailHeader[];
    body?: {
      data?: string;
    };
    parts?: EmailPart[];
  };
}

interface ParsedEmail {
  id: string;
  from: string;
  subject: string;
  body: string;
  snippet: string;
}

// Window scope detection
const decodeBase64 = (str: string) => {
  if (typeof window !== "undefined") {
    // Window object is available, use the existing implementation
    return decodeURIComponent(
      escape(window.atob(str.replace(/-/g, "+").replace(/_/g, "/")))
    );
  } else {
    // Window object is not available (server-side rendering)
    // You can provide a fallback implementation here, or simply return the input string
    return str;
  }
};

const getHeader = (headers: EmailHeader[], name: string) => {
  const header = headers.find((header) => header.name === name);
  return header ? header.value : "Unknown";
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

const parseEmail = (email: Email): ParsedEmail => {
  let bodyContent = { text: "", html: "" };
  if (email.payload.parts) {
    bodyContent = findBody(email.payload.parts);
  } else if (email.payload.body?.data) {
    const decodedBody = decodeBase64(email.payload.body.data);
    bodyContent.html = decodedBody;
  }
  return {
    id: email.id,
    from: getHeader(email.payload.headers, "From"),
    subject: getHeader(email.payload.headers, "Subject"),
    body: bodyContent.html || bodyContent.text,
    snippet: email.snippet,
  };
};

export default parseEmail;
