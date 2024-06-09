import create from "zustand";
import { persist } from "zustand/middleware";

interface ApiKeyState {
  apiKey: string;
  setApiKey: (key: string) => void;
}

const useApiKeyStore = create<ApiKeyState>()(
  persist(
    (set) => ({
      apiKey: "",
      setApiKey: (key: string) => set({ apiKey: key }),
    }),
    {
      name: "api-key-storage", // unique name
      getStorage: () => localStorage, // specify the storage type
    }
  )
);

export default useApiKeyStore;
