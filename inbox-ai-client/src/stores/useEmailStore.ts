import create from "zustand";

interface EmailData {
  id: string;
  from: string;
  subject: string;
  body: string;
  snippet: string;
  classification: string;
}

interface EmailStore {
  emails: EmailData[];
  setEmails: (emails: EmailData[]) => void;
  addEmail: (email: any) => void;
  updateClassification: (id: string, newClassification: string) => void;
}

const useEmailStore = create<EmailStore>((set) => ({
  emails: [],
  setEmails: (emails) => set({ emails }),
  addEmail: (email) => set((state) => ({ emails: [...state.emails, email] })),
  updateClassification: (id, newClassification) =>
    set((state) => ({
      emails: state.emails.map((email) =>
        email.id === id
          ? { ...email, classification: newClassification }
          : email
      ),
    })),
}));

export default useEmailStore;
