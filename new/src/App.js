import React, { useState, useEffect } from "react";
import Header from "./Components/header/header";
import Event from "./Components/events/events";
import Auth from "./Components/Auth/Auth";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <>
      <Header user={user} onLogout={logout} />
      {user ? <Event /> : <Auth onLogin={setUser} />}
    </>
  );
}

export default App;
