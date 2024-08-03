import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AddItemModal = ({
  show,
  handleClose,
  handleSubmit,
  validated,
  newItem,
  handleNewItemChange,
}) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add new Item</Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group controlId="formItemName">
            <Form.Label>Item Title</Form.Label>
            <Form.Control
              required
              type="text"
              name="itemName"
              placeholder="Title"
              value={newItem.itemName}
              onChange={handleNewItemChange}
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
              value={newItem.itemDesc}
              onChange={handleNewItemChange}
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
              value={newItem.itemPrice}
              onChange={handleNewItemChange}
              min="0"
            />
            <Form.Control.Feedback type="invalid">
              Please enter a price.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formItemQTY">
            <Form.Label>Item Quantity</Form.Label>
            <Form.Control
              required
              type="number"
              name="itemQTY"
              placeholder="Quantity"
              value={newItem.itemQTY}
              onChange={handleNewItemChange}
              min="0"
            />
            <Form.Control.Feedback type="invalid">
              Please enter a quantity.
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success" type="submit">
            Save changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddItemModal;
