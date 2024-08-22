import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const EditSaleModal = ({
  show,
  handleClose,
  selectedSale,
  handleDeleteButton,
  handleSaveChanges,
}) => {
  const [newSaleDate, setNewSaleDate] = useState(
    selectedSale ? selectedSale.saleDate : ""
  );

  const handleDateChange = (event) => {
    setNewSaleDate(event.target.value);
    console.log(event.target.value);
  };

  const handleSaveClick = () => {
    handleSaveChanges(selectedSale.saleID, newSaleDate);
    console.log();
  };

  const formatDateForInput = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hour = String(d.getHours()).padStart(2, "0");
    const minute = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hour}:${minute}`;
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Sale</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedSale ? (
          <>
            <p>
              <strong>Sale ID:</strong> {selectedSale.saleID}
            </p>
            <p>
              <strong>Items:</strong> {selectedSale.items}
            </p>
            <p>
              <strong>Sale Date: </strong>{" "}
              <input
                type="datetime-local"
                defaultValue={formatDateForInput(selectedSale.saleDate)}
                onChange={handleDateChange}
              />
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
        <Button variant="danger" onClick={handleDeleteButton}>
          Delete
        </Button>
        <Button variant="success" onClick={handleSaveClick}>
          Save changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditSaleModal;
