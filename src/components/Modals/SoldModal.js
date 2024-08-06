import React from "react";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const SoldModal = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Sold!</Modal.Title>
      </Modal.Header>
      <Modal.Body>YAY YOU SOLD ITEMS</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Link to="/history">
          <Button variant="primary" type="submit">
            History
          </Button>
        </Link>
      </Modal.Footer>
    </Modal>
  );
};

export default SoldModal;
