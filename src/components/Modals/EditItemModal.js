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
  const preventMinus = (e) => {
    if (e.code === "Minus") {
      e.preventDefault();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Item</Modal.Title>
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
