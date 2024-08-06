import React from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmEditModal = ({
  show,
  handleClose,
  handleSaveChanges,
  selectedItem,
}) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to save changes?{" "}
        {selectedItem ? selectedItem.itemName : ""}?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleSaveChanges}>
          Confirm Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmEditModal;
