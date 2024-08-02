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
  const [showClickedItem, setShowClickedItem] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showAddItemPopup, setShowAddItemPopup] = useState(false);
  const [showAddItemConfirm, setShowAddItemConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(null);
  const [newItem, setNewItem] = useState({
    itemName: "",
    itemDesc: "",
    itemPrice: 0,
    itemQTY: 0,
  });
  const [errors, setErrors] = useState({
    itemName: "",
    itemDesc: "",
    itemPrice: "",
    itemQTY: "",
  });

  const handleClose = () => {
    setShowClickedItem(false);
    setShowDeletePopup(false);
    setShowAddItemPopup(false);
    setShowAddItemConfirm(false);
    setErrors({
      itemName: "",
      itemDesc: "",
      itemPrice: "",
      itemQTY: "",
    });
  };

  const handleShow = (item) => {
    setSelectedItem(item);
    setShowClickedItem(true);
  };

  const handleDeleteButton = () => {
    setShowDeletePopup(true);
  };

  const handleAddItemButton = () => {
    setShowAddItemPopup(true);
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
        fetchItems();
        handleClose();
      }
    }
  };

  const validateInputs = () => {
    let isValid = true;
    const newErrors = {
      itemName: "",
      itemDesc: "",
      itemPrice: "",
      itemQTY: "",
    };

    if (!newItem.itemName.trim()) {
      newErrors.itemName = "Item name is required.";
      isValid = false;
    }

    if (!newItem.itemDesc.trim()) {
      newErrors.itemDesc = "Item description is required.";
      isValid = false;
    }

    if (newItem.itemPrice <= 0) {
      newErrors.itemPrice = "Item price must be greater than 0.";
      isValid = false;
    }

    if (newItem.itemQTY < 0) {
      newErrors.itemQTY = "Item quantity cannot be negative.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddNewItem = async () => {
    if (!validateInputs()) return;

    const { data, error } = await supabase.from("Item").insert([newItem]);

    if (error) {
      console.error("Error adding new item:", error);
      alert("Failed to add new item.");
    } else {
      console.log("New item added successfully:", data);
      alert("New item added successfully.");
      fetchItems();
      handleClose();
    }
  };

  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const incrementQuantity = () => {
    setSelectedItem((prevState) => ({
      ...prevState,
      itemQTY: prevState.itemQTY + 1,
    }));
  };

  const decrementQuantity = () => {
    setSelectedItem((prevState) => ({
      ...prevState,
      itemQTY: prevState.itemQTY > 0 ? prevState.itemQTY - 1 : 0,
    }));
  };

  const handleQuantityChange = (e) => {
    const newValue = Number(e.target.value);
    if (!isNaN(newValue) && newValue >= 0) {
      setSelectedItem((prevState) => ({
        ...prevState,
        itemQTY: newValue,
      }));
    }
  };

  const handleEditClick = (field) => {
    setIsEditing(field);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedItem((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

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
        setShowClickedItem(false);
        fetchItems();
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
            <Col xs={12} sm={6} md={6} lg={4} xl={3} className="mb-4">
              <Card
                style={{ width: "100%" }}
                className="clickable-card"
                onClick={handleAddItemButton}
              >
                <Card.Body>
                  <Card.Title>Add New Item</Card.Title>
                  <Card.Text>Click here to add a new item.</Card.Text>
                </Card.Body>
              </Card>
            </Col>

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

      <Modal show={showClickedItem} onHide={handleClose} centered>
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
                    min="0"
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

      {/* ADD ITEM POP UP */}
      <Modal show={showAddItemPopup} onHide={handleClose} centered>
        <Modal.Header>
          <Modal.Title>Add new Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Label>Item Title</Form.Label>
            <Form.Control
              type="text"
              name="itemName"
              placeholder="Title"
              value={newItem.itemName}
              onChange={handleNewItemChange}
              isInvalid={!!errors.itemName}
            />
            <Form.Control.Feedback type="invalid">
              {errors.itemName}
            </Form.Control.Feedback>

            <Form.Label>Item Description</Form.Label>
            <Form.Control
              type="text"
              name="itemDesc"
              placeholder="Description"
              value={newItem.itemDesc}
              onChange={handleNewItemChange}
              isInvalid={!!errors.itemDesc}
            />
            <Form.Control.Feedback type="invalid">
              {errors.itemDesc}
            </Form.Control.Feedback>

            <Form.Label>Item Price</Form.Label>
            <Form.Control
              type="number"
              name="itemPrice"
              placeholder="Price"
              value={newItem.itemPrice}
              onChange={handleNewItemChange}
              isInvalid={!!errors.itemPrice}
            />
            <Form.Control.Feedback type="invalid">
              {errors.itemPrice}
            </Form.Control.Feedback>

            <Form.Label>Item Quantity</Form.Label>
            <Form.Control
              type="number"
              name="itemQTY"
              placeholder="Quantity"
              value={newItem.itemQTY}
              onChange={handleNewItemChange}
              isInvalid={!!errors.itemQTY}
            />
            <Form.Control.Feedback type="invalid">
              {errors.itemQTY}
            </Form.Control.Feedback>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success" onClick={() => setShowAddItemConfirm(true)}>
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ADD ITEM CONFIRMATION POP UP */}
      <Modal
        show={showAddItemConfirm}
        onHide={() => setShowAddItemConfirm(false)}
        centered
      >
        <Modal.Header>
          <Modal.Title>Confirm New Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to add "{newItem.itemName}"?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAddItemConfirm(false)}
          >
            Cancel
          </Button>
          <Button variant="success" onClick={handleAddNewItem}>
            Confirm Add
          </Button>
        </Modal.Footer>
      </Modal>

      {/* DELETE ITEM POP UP */}
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
