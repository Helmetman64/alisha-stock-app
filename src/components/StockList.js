import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import React, { useEffect, useState } from "react";
import supabase from "../services/supabaseClient";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Form } from "react-bootstrap";
import "../assets/styles.css";

const StockList = () => {
  const [fetchError, setFetchError] = useState(null);
  const [items, setItems] = useState(null);
  const [show, setShow] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(null); // To track which field is being edited

  // Close popup modals
  const handleClose = () => {
    setShow(false);
    setShowDeletePopup(false);
  };

  // Open popup modal with item
  const handleShow = (item) => {
    setSelectedItem(item);
    setShow(true);
  };

  const handleDeleteButton = () => {
    setShowDeletePopup(true);
  };

  const handleDeleteItem = async () => {
    if (selectedItem) {
      const { itemID } = selectedItem;
      const { data, error } = await supabase
        .from("Item")
        .delete()
        .match({ itemID });

      if (error) {
        console.error("Error deleting item:", error);
        alert("Failed to delete item.");
      } else {
        console.log("Item deleted successfully:", data);
        alert("Item deleted successfully.");
        fetchItems(); // Refresh items list
        handleClose(); // Close only the delete confirmation modal
      }
    }
  };

  // Increment quantity
  const incrementQuantity = () => {
    setSelectedItem((prevState) => ({
      ...prevState,
      itemQTY: prevState.itemQTY + 1,
    }));
  };

  // Decrement quantity
  const decrementQuantity = () => {
    setSelectedItem((prevState) => ({
      ...prevState,
      itemQTY: prevState.itemQTY > 0 ? prevState.itemQTY - 1 : 0,
    }));
  };

  // Handle quantity change from Form.Control
  const handleQuantityChange = (e) => {
    const newValue = Number(e.target.value);
    if (!isNaN(newValue) && newValue >= 0) {
      setSelectedItem((prevState) => ({
        ...prevState,
        itemQTY: newValue,
      }));
    }
  };

  // Toggle editing mode for title, description, or price
  const handleEditClick = (field) => {
    setIsEditing(field);
  };

  // Handle change in title, description, or price
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedItem((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Save changes to Supabase
  const handleSaveChanges = async () => {
    if (selectedItem) {
      const { itemID, itemName, itemDesc, itemPrice, itemQTY } = selectedItem;
      const { data, error } = await supabase
        .from("Item")
        .update({ itemName, itemDesc, itemPrice, itemQTY })
        .match({ itemID });

      if (error) {
        console.error("Error updating item:", error);
        alert("Failed to save changes.");
      } else {
        console.log("Item updated successfully:", data);
        alert("Changes saved successfully.");
        setShow(false); // Close the item details modal after saving
        fetchItems(); // Refresh items list
      }

      setIsEditing(null);
    }
  };

  const fetchItems = async () => {
    const { data, error } = await supabase.from("Item").select("*");

    if (error) {
      setFetchError("Could not fetch the items");
      setItems(null);
      console.log(error);
    } else if (data) {
      setItems(data);
      setFetchError(null);
      console.log(data);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <>
      <Container fluid>
        <h1>Stock</h1>
        <div className="body">
          <Row>
            {items &&
              items.map((item) => (
                <Col
                  key={item.id}
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={3}
                  className="mb-4"
                >
                  <Card
                    style={{ width: "100%" }}
                    className="clickable-card"
                    onClick={() => handleShow(item)}
                  >
                    <Card.Body>
                      <Card.Title>{item.itemName}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        {item.itemDesc}
                      </Card.Subtitle>
                      <Card.Text className="d-flex justify-content-between">
                        <span className="bold-label">
                          Stock Level:{" "}
                          <span className="normal-value">{item.itemQTY}</span>
                        </span>
                        <span className="bold-label">
                          Price:{" "}
                          <span className="normal-value">
                            ${item.itemPrice}
                          </span>
                        </span>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
          </Row>
        </div>
      </Container>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedItem ? (
              <>
                {isEditing === "title" ? (
                  <Form.Control
                    type="text"
                    name="itemName"
                    value={selectedItem.itemName}
                    onChange={handleInputChange}
                    onBlur={() => setIsEditing(null)}
                  />
                ) : (
                  <>
                    {selectedItem.itemName}{" "}
                    <i
                      className="bi bi-pencil-square clickable-icon"
                      onClick={() => handleEditClick("title")}
                    ></i>
                  </>
                )}
              </>
            ) : (
              "Item Details"
            )}
          </Modal.Title>
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
                  onBlur={() => setIsEditing(null)}
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
              <hr className="divider" />
              {isEditing === "price" ? (
                <Form.Control
                  type="number"
                  name="itemPrice"
                  value={selectedItem.itemPrice}
                  onChange={handleInputChange}
                  onBlur={() => setIsEditing(null)}
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
                <Button className="stock-qty-btn" onClick={incrementQuantity}>
                  +
                </Button>
                <Form>
                  <Form.Control
                    type="number"
                    value={selectedItem.itemQTY}
                    className="stock-qty"
                    onChange={handleQuantityChange}
                    min="0" // Ensure the minimum value is 0
                  />
                </Form>
                <Button className="stock-qty-btn" onClick={decrementQuantity}>
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

      <Modal
        show={showDeletePopup}
        onHide={() => setShowDeletePopup(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{" "}
          {selectedItem ? selectedItem.itemName : ""}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeletePopup(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteItem}>
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default StockList;
