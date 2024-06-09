import { google } from "googleapis";
const people = google.people({ version: "v1" });
export const getUserInfo = async (auth) => {
  try {
    const response = await people.people.get({
      auth,
      resourceName: "people/me",
      personFields: "names,photos,emailAddresses",
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user information:", error);
    throw error;
  }
};
