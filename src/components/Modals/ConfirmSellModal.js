import React from "react";
import { Modal, Button, Table } from "react-bootstrap";

const ConfirmSellModal = ({
  show,
  handleClose,
  items,
  total,
  deleteItem,
  incrementQuantity,
  decrementQuantity,
  handleQuantityChange,
  handleConfirmSale,
}) => {
  if (items.length === 0) {
    handleClose();
    return null;
  }

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Sell Items</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
                <tr key={item.itemID}>
                  <td>{item.itemName}</td>
                  <td>${item.itemPrice.toFixed(2)}</td>
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
                        value={item.count}
                        className="stock-qty"
                        onChange={(e) =>
                          handleQuantityChange(item.itemID, e.target.value)
                        }
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
                  <td>${(item.itemPrice * item.count).toFixed(2)}</td>
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
