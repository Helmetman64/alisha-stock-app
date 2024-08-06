import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EditItemModal = ({
  show,
  handleClose,
  selectedItem,
  isEditing,
  handleEditClick,
  handleInputChange,
  incrementQuantity,
  decrementQuantity,
  handleQuantityChange,
  handleSaveChanges,
  handleDeleteButton,
}) => {
  // Helper function to validate non-negative values
  const validatePositiveNumber = (value) => {
    if (isNaN(value) || value <= 0) {
      alert("Please enter a positive number greater than zero.");
      return 1;
    }
    return value;
  };

  // Validation for item price on blur
  const handlePriceBlur = () => {
    const price = parseFloat(selectedItem.itemPrice);
    const validatedPrice = validatePositiveNumber(price);
    if (!isNaN(validatedPrice)) {
      handleInputChange({
        target: { name: "itemPrice", value: validatedPrice },
      });
    }
  };

  // Validation for item quantity on blur
  const handleQuantityBlur = () => {
    const quantity = parseInt(selectedItem.itemQTY);
    const validatedQuantity = validatePositiveNumber(quantity);
    if (!isNaN(validatedQuantity)) {
      handleInputChange({
        target: { name: "itemQTY", value: validatedQuantity },
      });
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedItem ? (
            <>
              {isEditing === "title" ? (
                <Form.Control
                  type="text"
                  name="itemName"
                  value={selectedItem.itemName}
                  onChange={handleInputChange}
                  onBlur={() => handleEditClick(null)}
                />
              ) : (
                <>
                  {selectedItem.itemName}{" "}
                  <i
                    className="bi bi-pencil-square clickable-icon"
                    onClick={() => handleEditClick("title")}
                  ></i>
                </>
              )}
            </>
          ) : (
            "Item Details"
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedItem ? (
          <>
            {isEditing === "description" ? (
              <Form.Control
                as="textarea"
                name="itemDesc"
                value={selectedItem.itemDesc}
                onChange={handleInputChange}
                onBlur={() => handleEditClick(null)}
              />
            ) : (
              <>
                <p>
                  {selectedItem.itemDesc}{" "}
                  <i
                    className="bi bi-pencil-square clickable-icon"
                    onClick={() => handleEditClick("description")}
                  ></i>
                </p>
              </>
            )}
            {isEditing === "price" ? (
              <Form.Control
                type="number"
                name="itemPrice"
                value={selectedItem.itemPrice}
                onChange={handleInputChange}
                onBlur={handlePriceBlur}
                min="0"
              />
            ) : (
              <>
                <span className="bold-label">
                  Price:{" "}
                  <span className="normal-value">
                    ${selectedItem.itemPrice}{" "}
                  </span>
                  <i
                    className="bi bi-pencil-square clickable-icon"
                    onClick={() => handleEditClick("price")}
                  ></i>
                </span>
              </>
            )}
            <div className="stock-quantity">
              <h5>Quantity:</h5>
              <Button className="qty-btn" onClick={() => incrementQuantity()}>
                +
              </Button>
              <Form.Control
                type="number"
                name="itemQTY"
                value={selectedItem.itemQTY}
                className="stock-qty"
                onChange={handleInputChange}
                onBlur={handleQuantityBlur}
                min="0"
              />
              <Button className="qty-btn" onClick={() => decrementQuantity()}>
                -
              </Button>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleDeleteButton}>
          Delete
        </Button>
        <Button variant="success" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditItemModal;
