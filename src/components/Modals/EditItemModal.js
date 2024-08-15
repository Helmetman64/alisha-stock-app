import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EditItemModal = ({
  show,
  handleClose,
  handleEditSubmit,
  validated,
  selectedItem,
  handleInputChange,
  handleDeleteButton,
}) => {
  const preventMinus = (e) => {
    if (e.code === "Minus") {
      e.preventDefault();
    }
  };

  if (!selectedItem) {
    return null; // Return null if selectedItem is null
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit {selectedItem.itemName}</Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleEditSubmit}>
        <Modal.Body>
          <Form.Group controlId="formItemName">
            <Form.Label>Item Title</Form.Label>
            <Form.Control
              required
              type="text"
              name="itemName"
              placeholder="Title"
              value={selectedItem.itemName}
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a name.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formItemDesc">
            <Form.Label>Item Description</Form.Label>
            <Form.Control
              required
              type="text"
              name="itemDesc"
              placeholder="Description"
              value={selectedItem.itemDesc}
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a description.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formItemPrice">
            <Form.Label>Item Price</Form.Label>
            <Form.Control
              required
              type="number"
              name="itemPrice"
              placeholder="Price"
              value={selectedItem.itemPrice}
              onChange={handleInputChange}
              onKeyDown={preventMinus}
              min="1"
            />
            <Form.Control.Feedback type="invalid">
              Price must be greater than 0.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formItemQTY">
            <Form.Label>Item Quantity</Form.Label>
            <Form.Control
              required
              type="number"
              name="itemQTY"
              placeholder="Quantity"
              value={selectedItem.itemQTY}
              onChange={handleInputChange}
              onKeyDown={preventMinus}
              min="1"
            />
            <Form.Control.Feedback type="invalid">
              Quantity must be greater than 0.
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDeleteButton}>
            Delete
          </Button>
          <Button variant="success" type="submit">
            Save changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditItemModal;
