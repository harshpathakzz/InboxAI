"use client";

const GrantAccess: React.FC = () => {
  return (
    <div>
      <p>Grant access to read emails to login and continue</p>
      <a href="http://localhost:5000/auth/google">Login with Google</a>
    </div>
  );
};

export default GrantAccess;
