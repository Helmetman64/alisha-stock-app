import React, { useEffect, useState } from "react";
import supabase from "../services/supabaseClient";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import StockCards from "./StockCards";
import AddItemModal from "./Modals/AddItemModal";
import ConfirmAddModal from "./Modals/ConfirmAddModal";
import DeleteItemModal from "./Modals/DeleteItemModal";
import ConfirmDeleteModal from "./Modals/ConfirmDeleteModal";
import EditItemModal from "./Modals/EditItemModal";
import "../assets/styles.css";

const StockList = () => {
  const [fetchError, setFetchError] = useState(null);
  const [items, setItems] = useState([]);
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

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase.from("Item").select("*");

      if (error) {
        setFetchError("Could not fetch the items");
        setItems([]);
      } else {
        setItems(data);
      }
    };

    fetchItems();
  }, []);

  const handleClose = () => {
    setShowEditPopup(false);
    setShowAddItemPopup(false);
    setShowAddItemConfirm(false);
    setShowDeletePopup(false);
    setNewItem({
      itemName: "",
      itemDesc: "",
      itemPrice: "",
      itemQTY: "",
    });
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
      .from("Item")
      .insert([newItem])
      .select();

    if (error) {
      console.log(error);
    } else {
      setItems([...items, ...data]);
    }

    handleClose();
  };

  const handleDeleteItem = async () => {
    const { error } = await supabase
      .from("Item")
      .delete()
      .eq("itemID", selectedItem.itemID);

    if (error) {
      console.log(error);
    } else {
      setItems(items.filter((item) => item.itemID !== selectedItem.itemID));
    }

    handleClose();
  };

  return (
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
        </Row>
        <StockCards items={items} onCardClick={handleShowEditPopup} />
      </div>

      <AddItemModal
        show={showAddItemPopup}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        validated={validated}
        newItem={newItem}
        handleNewItemChange={(e) =>
          setNewItem({ ...newItem, [e.target.name]: e.target.value })
        }
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
        handleEditClick={setIsEditing}
        handleInputChange={(e) =>
          setSelectedItem({ ...selectedItem, [e.target.name]: e.target.value })
        }
        incrementQuantity={() =>
          setSelectedItem({
            ...selectedItem,
            itemQTY: selectedItem.itemQTY + 1,
          })
        }
        decrementQuantity={() =>
          setSelectedItem({
            ...selectedItem,
            itemQTY: selectedItem.itemQTY - 1,
          })
        }
        handleSaveChanges={async () => {
          const { data, error } = await supabase
            .from("Item")
            .update(selectedItem)
            .eq("itemID", selectedItem.itemID);

          if (error) {
            console.log(error);
          } else {
            setItems((prevItems) =>
              prevItems.map((item) =>
                item.itemID === selectedItem.itemID ? selectedItem : item
              )
            );
            handleClose();
          }
        }}
        handleDeleteButton={() => setShowDeletePopup(true)}
      />
      <ConfirmDeleteModal
        show={showDeletePopup}
        handleClose={handleClose}
        handleDeleteItem={handleDeleteItem}
        selectedItem={selectedItem}
      />
    </Container>
  );
};

export default StockList;
