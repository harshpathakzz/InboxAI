"use client";
import Link from "next/link";
const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-3xl font-bold mb-4">InboxAI</div>
      <div className="text-xl mb-8">classify your mails with AI</div>
      <Link
        href="https://inboxai-c6fv.onrender.com/auth/google"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Login with Google
      </Link>
    </div>
  );
};

export default Home;
