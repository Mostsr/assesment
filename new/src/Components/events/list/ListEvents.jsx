import React from "react";

const EventList = ({ events, onEdit, onDelete }) => {
  return (
    <div>
      <h4>Event List</h4>
      {events.length === 0 && <p>No events found.</p>}
      {events.map((event) => (
        <div key={event.id} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">{event.title}</h5>
            <p className="card-text"><strong>Date/Time:</strong> {new Date(event.datetime).toLocaleString()}</p>
            <p className="card-text"><strong>Location:</strong> {event.location}</p>
            <p className="card-text"><strong>Status:</strong> {event.status}</p>
            <p className="card-text">{event.description}</p>
            <button className="btn btn-warning btn-sm me-2" onClick={() => onEdit(event)}>Edit</button>
            <button className="btn btn-danger btn-sm" onClick={() => onDelete(event.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;
