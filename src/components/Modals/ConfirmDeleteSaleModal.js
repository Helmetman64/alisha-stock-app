import React from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmDeleteSaleModal = ({
  show,
  handleClose,
  handleDeleteSale,
  selectedSale,
}) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Sale Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedSale ? (
          <>
            <p>Are you sure you want to delete the following sale?</p>
            <p>
              <strong>Sale ID:</strong> {selectedSale.saleID}
            </p>
            <p>
              <strong>Items:</strong> {selectedSale.items}
            </p>
            <p>
              <strong>Sale Date:</strong>{" "}
              {new Date(selectedSale.saleDate).toLocaleString("en-AU", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </p>
            <p>
              <strong>Total Amount:</strong> $
              {selectedSale.totalPrice.toFixed(2)}
            </p>
          </>
        ) : (
          <p>Loading sale information...</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={() => handleDeleteSale(selectedSale.saleID)}
        >
          Confirm Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDeleteSaleModal;
