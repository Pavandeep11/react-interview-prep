
import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email.trim()) {
      setError("Email is required");
      setMessage("");
      return;
    }

    setError("");
    setMessage("Login successful");
  };

  return (
    <div>
      <h1>Login</h1>

      <input
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={handleLogin}>
        Submit
      </button>

      {email && <p>Email: {email}</p>}

      {error && <p>{error}</p>}
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
