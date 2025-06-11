import React, { useState, useEffect } from "react";

const AddEvent = ({ onSave, initialData = {}, isEditing = false, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    datetime: "",
    location: "",
    description: "",
    status: "upcoming"
  });

  useEffect(() => {
    if (initialData.id) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    if (!isEditing) {
      setFormData({
        title: "",
        datetime: "",
        location: "",
        description: "",
        status: "upcoming"
      });
    }
  };

  return (
    <form className="mb-4 p-4 border rounded bg-light" onSubmit={handleSubmit}>
      <h4>{isEditing ? "Edit Event" : "Add Event"}</h4>
      <input name="title" className="form-control mb-2" placeholder="Title" value={formData.title} onChange={handleChange} required />
      <input type="datetime-local" name="datetime" className="form-control mb-2" value={formData.datetime} onChange={handleChange} required />
      <input name="location" className="form-control mb-2" placeholder="Location" value={formData.location} onChange={handleChange} required />
      <textarea name="description" className="form-control mb-2" placeholder="Description" value={formData.description} onChange={handleChange} />
      <select name="status" className="form-control mb-3" value={formData.status} onChange={handleChange}>
        <option value="upcoming">Upcoming</option>
        <option value="attending">Attending</option>
        <option value="maybe">Maybe</option>
        <option value="declined">Declined</option>
      </select>
      <button className="btn btn-primary me-2" type="submit">{isEditing ? "Update" : "Add"} Event</button>
      {isEditing && <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>}
    </form>
  );
};

export default AddEvent;
