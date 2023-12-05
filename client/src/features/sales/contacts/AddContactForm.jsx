import React, { useState } from "react";

const AddContactForm = ({ onAddContact }) => {
  const [name, setName] = useState("");

  const handleAddContact = () => {
    onAddContact({ name });
    setName("");
  };

  return (
    <div>
      <label>Name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleAddContact}>Add Contact</button>
    </div>
  );
};
export default AddContactForm;
