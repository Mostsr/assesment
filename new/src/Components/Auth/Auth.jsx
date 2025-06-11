import React, { useState } from "react";

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "login" : "signup";
    const res = await fetch(`http://localhost:3001/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Something went wrong.");
      return;
    }

    setMessage(data.message);
    if (isLogin && onLogin) {
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h3>{isLogin ? "Login" : "Sign Up"}</h3>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="form-control mb-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn btn-primary w-100" type="submit">
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>
      <div className="text-center mt-2">
        <small>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className="btn btn-link btn-sm p-0"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </small>
      </div>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
};

export default Auth;
