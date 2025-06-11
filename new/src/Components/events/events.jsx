import React, { useState, useEffect } from "react";
import axios from "axios";
import AddEvents from "./add/addEvents";
import EventList from "./list/ListEvents";

const Event = () => {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [filters, setFilters] = useState({
    title: "",
    location: "",
    from: "",
    to: "",
    status: "all",
  });

  const fetchEvents = async () => {
    try {
      const params = new URLSearchParams();

      if (filters.title) params.append("title", filters.title);
      if (filters.location) params.append("location", filters.location);
      if (filters.from && filters.to) {
        params.append("from", filters.from);
        params.append("to", filters.to);
      }
      if (filters.status && filters.status !== "all") {
        params.append("status", filters.status);
      }

      const res = await fetch(
        `http://localhost:3001/events?${params.toString()}`
      );
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  const addOrUpdateEvent = async (eventData) => {
    try {
      const method = editingEvent ? "PUT" : "POST";
      const url = editingEvent
        ? `http://localhost:3001/events/${editingEvent.id}`
        : "http://localhost:3001/events";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!res.ok) throw new Error("Failed to save event");

      await fetchEvents();
      setEditingEvent(null);
    } catch (error) {
      console.error("Failed to add/update event:", error);
    }
  };

  const deleteEvent = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/events/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete event");

      await fetchEvents();
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  const startEdit = (event) => {
    setEditingEvent(event);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <>
      <div className="card p-3 mb-4">
        <h5>Search & Filter</h5>
        <div className="row g-2 align-items-end">
          <div className="col-md-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              value={filters.title}
              onChange={(e) =>
                setFilters({ ...filters, title: e.target.value })
              }
              placeholder="Search title"
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-control"
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
              placeholder="Search location"
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">From</label>
            <input
              type="date"
              className="form-control"
              value={filters.from}
              onChange={(e) => setFilters({ ...filters, from: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">To</label>
            <input
              type="date"
              className="form-control"
              value={filters.to}
              onChange={(e) => setFilters({ ...filters, to: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="all">All</option>
              <option value="upcoming">Upcoming</option>
              <option value="attending">Attending</option>
              <option value="maybe">Maybe</option>
              <option value="declined">Declined</option>
            </select>
          </div>
          <div className="col-md-2 d-grid">
            <button className="btn btn-primary" onClick={fetchEvents}>
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="container mt-4">
        <AddEvents
          onSave={addOrUpdateEvent}
          initialData={editingEvent || {}}
          isEditing={!!editingEvent}
          onCancel={() => setEditingEvent(null)}
        />
        <EventList events={events} onEdit={startEdit} onDelete={deleteEvent} />
      </div>
    </>
  );
};

export default Event;
