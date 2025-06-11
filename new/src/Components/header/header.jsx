import React from "react";

const Header = ({ user, onLogout }) => {
  return (
    <div className="container">
      <header className="d-flex flex-wrap align-items-center justify-content-between py-3 mb-4 border-bottom">
        <div className="d-flex align-items-center">
          <h4 className="mb-0">Event Manager</h4>
        </div>

        {user ? (
          <div className="text-end">
            <span className="me-3">👋 {user.username}</span>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        ) : null}
      </header>
    </div>
  );
};

export default Header;
