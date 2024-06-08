import { google } from "googleapis";

export const getGmailService = (auth) => {
  return google.gmail({ version: "v1", auth });
};

export const getEmails = async (gmail, maxResults) => {
  const response = await gmail.users.messages.list({
    userId: "me",
    maxResults: maxResults,
  });

  const messages = response.data.messages || [];
  const emailPromises = messages.map(async (msg) => {
    try {
      const message = await gmail.users.messages.get({
        userId: "me",
        id: msg.id,
      });
      return message.data;
    } catch (err) {
      console.error(`Failed to retrieve email ${msg.id}:`, err);
      return null;
    }
  });

  return Promise.all(emailPromises);
};
