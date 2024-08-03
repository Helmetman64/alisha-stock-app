import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import React, { useEffect, useState } from "react";
import supabase from "../services/supabaseClient";
import AddItemModal from "./Modals/AddItemModal";
import ConfirmAddModal from "./Modals/ConfirmAddModal";
import DeleteItemModal from "./Modals/DeleteItemModal";
import ConfirmDeleteModal from "./Modals/ConfirmDeleteModal";
import EditItemModal from "./Modals/EditItemModal";
import "../assets/styles.css";

const StockList = () => {
  const [fetchError, setFetchError] = useState(null);
  const [items, setItems] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showAddItemPopup, setShowAddItemPopup] = useState(false);
  const [showAddItemConfirm, setShowAddItemConfirm] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [newItem, setNewItem] = useState({
    itemName: "",
    itemDesc: "",
    itemPrice: "",
    itemQTY: "",
  });
  const [isEditing, setIsEditing] = useState(null);
  const [validated, setValidated] = useState(false);

  const handleShowEditPopup = (item) => {
    setSelectedItem(item);
    setShowEditPopup(true);
  };

  const handleClose = () => {
    setShowEditPopup(false);
    setShowAddItemPopup(false);
    setShowAddItemConfirm(false);
    setShowDeletePopup(false);
  };

  const fetchItems = async () => {
    const { data, error } = await supabase.from("Item").select();

    if (error) {
      setFetchError("Could not fetch the stock list");
      setItems(null);
    }

    if (data) {
      setItems(data);
      setFetchError(null);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedItem((prevItem) => ({
      ...prevItem,
      [name]:
        name === "itemPrice" || name === "itemQTY"
          ? Math.max(0, Number(value))
          : value,
    }));
  };

  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prevItem) => ({
      ...prevItem,
      [name]:
        name === "itemPrice" || name === "itemQTY"
          ? Math.max(0, Number(value))
          : value,
    }));
  };

  const handleEditClick = (field) => {
    setIsEditing(field);
  };

  const handleSaveChanges = async () => {
    const { data, error } = await supabase
      .from("stock")
      .update({
        itemName: selectedItem.itemName,
        itemDesc: selectedItem.itemDesc,
        itemPrice: selectedItem.itemPrice,
        itemQTY: selectedItem.itemQTY,
      })
      .eq("id", selectedItem.id)
      .select();

    if (error) {
      console.log(error);
    }

    if (data) {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === selectedItem.id ? selectedItem : item
        )
      );
    }
    handleClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      setShowAddItemConfirm(true);
    }
    setValidated(true);
  };

  const addNewItem = async () => {
    const { data, error } = await supabase
      .from("stock")
      .insert([
        {
          itemName: newItem.itemName,
          itemDesc: newItem.itemDesc,
          itemPrice: newItem.itemPrice,
          itemQTY: newItem.itemQTY,
        },
      ])
      .select();

    if (error) {
      console.log(error);
    }

    if (data) {
      setItems([...items, ...data]);
    }

    handleClose();
  };

  const handleDeleteButton = () => {
    setShowDeletePopup(true);
  };

  const handleDeleteItem = async () => {
    const { error } = await supabase
      .from("stock")
      .delete()
      .eq("id", selectedItem.id);

    if (error) {
      console.log(error);
    }

    setItems(items.filter((item) => item.id !== selectedItem.id));
    handleClose();
  };

  const incrementQuantity = () => {
    setSelectedItem((prevItem) => ({
      ...prevItem,
      itemQTY: Math.max(0, Number(prevItem.itemQTY) + 1),
    }));
  };

  const decrementQuantity = () => {
    setSelectedItem((prevItem) => ({
      ...prevItem,
      itemQTY: Math.max(0, Number(prevItem.itemQTY) - 1),
    }));
  };

  const handleQuantityChange = (e) => {
    const { value } = e.target;
    setSelectedItem((prevItem) => ({
      ...prevItem,
      itemQTY: Math.max(0, Number(value)),
    }));
  };

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
                onClick={() => setShowAddItemPopup(true)}
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
                    onClick={() => handleShowEditPopup(item)}
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

      <AddItemModal
        show={showAddItemPopup}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        validated={validated}
        newItem={newItem}
        handleNewItemChange={handleNewItemChange}
      />
      <ConfirmAddModal
        show={showAddItemConfirm}
        handleClose={handleClose}
        handleConfirm={addNewItem}
        newItem={newItem}
      />
      <DeleteItemModal
        show={showDeletePopup}
        handleClose={handleClose}
        handleDelete={handleDeleteItem}
        selectedItem={selectedItem}
      />
      <EditItemModal
        show={showEditPopup}
        handleClose={handleClose}
        selectedItem={selectedItem}
        isEditing={isEditing}
        handleEditClick={handleEditClick}
        handleInputChange={handleInputChange}
        incrementQuantity={incrementQuantity}
        decrementQuantity={decrementQuantity}
        handleQuantityChange={handleQuantityChange}
        handleSaveChanges={handleSaveChanges}
        handleDeleteButton={handleDeleteButton}
      />
      <ConfirmDeleteModal
        show={showDeletePopup}
        handleClose={handleClose}
        handleDeleteItem={handleDeleteItem}
        selectedItem={selectedItem}
      />
    </>
  );
};

export default StockList;
