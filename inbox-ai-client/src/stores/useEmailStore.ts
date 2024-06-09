import create from "zustand";

interface EmailData {
  id: string;
  from: string;
  subject: string;
  body: string;
  classification: string;
}

interface EmailStore {
  emails: EmailData[];
  setEmails: (emails: EmailData[]) => void;
  addEmail: (email: any) => void;
}

const useEmailStore = create<EmailStore>((set) => ({
  emails: [],
  setEmails: (emails) => set({ emails }),
  addEmail: (email) => set((state) => ({ emails: [...state.emails, email] })),
}));

export default useEmailStore;
