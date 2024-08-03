import React from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmAddModal = ({ show, handleClose, handleConfirm, newItem }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm New Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to add "{newItem.itemName}"?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleConfirm}>
          Confirm Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmAddModal;
