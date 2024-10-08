import React, { useState } from "react";
import { Modal, Button, Table, Alert } from "react-bootstrap";

const ConfirmSellModal = ({
  show,
  handleClose,
  items,
  total,
  incrementQuantity,
  decrementQuantity,
  handleQuantityChange,
  handleConfirmSale,
  deleteItem,
}) => {
  const [errorMessage, setErrorMessage] = useState("");
  console.log(items);

  const handleInputChange = (id, value) => {
    const item = items.find((item) => item.itemID === id);
    const newQuantity = parseInt(value, 10);

    if (!isNaN(newQuantity) && newQuantity <= item.itemQTY) {
      setErrorMessage("");
      handleQuantityChange(id, newQuantity);
    } else if (newQuantity > item.itemQTY) {
      setErrorMessage(
        `Cannot add more than ${item.itemQTY} items of ${
          item.itemName || item.variationName
        } to the cart!`
      );
    }
  };

  const handleBlur = (id, value) => {
    const newQuantity = value === "" ? 0 : parseInt(value, 10);

    handleQuantityChange(id, newQuantity);
    setErrorMessage(""); // Clear any error message when the input loses focus
  };

  if (!show) {
    return null; // Return null to avoid rendering when not visible
  }

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Sell Items</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && (
          <Alert
            variant="danger"
            onClose={() => setErrorMessage("")}
            dismissible
          >
            {errorMessage}
          </Alert>
        )}
        {items.length === 0 ? (
          <p>No items to display.</p>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Price</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={`${item.itemID}-${item.variationID}`}>
                  <td>{item.variationName || item.itemName}</td>
                  <td>${item.variationPrice || item.itemPrice}</td>
                  <td>
                    <div className="stock-quantity">
                      <Button
                        className="qty-btn"
                        onClick={() => decrementQuantity(item.itemID)}
                      >
                        -
                      </Button>
                      <input
                        type="number"
                        value={item.currentQTY}
                        className="stock-qty"
                        onChange={(e) =>
                          handleInputChange(item.itemID, e.target.value)
                        }
                        onBlur={(e) => handleBlur(item.itemID, e.target.value)}
                        min="0"
                      />
                      <Button
                        className="qty-btn"
                        onClick={() => incrementQuantity(item.itemID)}
                      >
                        +
                      </Button>
                    </div>
                  </td>
                  <td>
                    $
                    {(
                      (item.variationPrice || item.itemPrice) * item.currentQTY
                    ).toFixed(2)}
                  </td>
                  <td>
                    <i
                      className="bi bi-trash clickable-icon"
                      onClick={() => deleteItem(item.itemID)}
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <div className="total-section">
          <h4>Total: ${total}</h4>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleConfirmSale}>
          Confirm Sale
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmSellModal;
