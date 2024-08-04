import React, { useState, useEffect } from "react";

const EditableQuantity = ({ initialQuantity, onQuantityChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [quantity, setQuantity] = useState(initialQuantity);

  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  const handleBlur = () => {
    setIsEditing(false);
    if (quantity !== initialQuantity) {
      onQuantityChange(quantity);
    }
  };

  const handleChange = (e) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setQuantity(value);
    }
  };

  return (
    <span
      className="bold-label"
      onClick={() => setIsEditing(true)}
      style={{ cursor: "pointer" }}
    >
      {/* INVISIBLE CHARACTER TO ADD A SPACE */}
      QTY: &zwnj;
      <span className="normal-value">
        {isEditing ? (
          <input
            type="number"
            value={quantity}
            onChange={handleChange}
            onBlur={handleBlur}
            autoFocus
            min="1"
            className="cart-item-qty"
          />
        ) : (
          quantity
        )}
      </span>
    </span>
  );
};

export default EditableQuantity;
