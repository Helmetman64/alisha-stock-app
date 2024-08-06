import React, { useEffect, useState } from "react";
import supabase from "../services/supabaseClient";
import Container from "react-bootstrap/Container";
import StockCards from "./StockCards";
import AddItemModal from "./Modals/AddItemModal";
import ConfirmAddModal from "./Modals/ConfirmAddModal";
import ConfirmDeleteModal from "./Modals/ConfirmDeleteModal";
import EditItemModal from "./Modals/EditItemModal";
import "../assets/styles.css";
import ConfirmEditModal from "./Modals/ConfirmEditModal";

const StockList = () => {
  const [fetchError, setFetchError] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showEditPopupConfirm, setShowEditPopupConfirm] = useState(false);
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
    setShowEditPopupConfirm(false);
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

  const handleAddSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      setShowAddItemConfirm(true);
    }
    setValidated(true);
  };

  const handleEditSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      setShowEditPopupConfirm(true);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedItem({ ...selectedItem, [name]: value });
  };

  const incrementQuantity = () => {
    setSelectedItem((prevState) => ({
      ...prevState,
      itemQTY: validatePositiveNumber(prevState.itemQTY + 1),
    }));
  };

  const decrementQuantity = () => {
    setSelectedItem((prevState) => ({
      ...prevState,
      itemQTY: validatePositiveNumber(prevState.itemQTY - 1),
    }));
  };

  const handleQuantityChange = (value) => {
    setSelectedItem((prevState) => ({
      ...prevState,
      itemQTY: validatePositiveNumber(value),
    }));
  };

  const validatePositiveNumber = (value) => {
    return Math.max(1, value);
  };

  const handleSaveChanges = async () => {
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
  };

  const itemsWithAddNewItemCard = [
    {
      itemID: "add-new-item",
      itemName: "Add New Item",
      itemDesc: "Click here to add a new item.",
      isAddNewItemCard: true,
    },
    ...items,
  ];

  return (
    <Container fluid>
      <StockCards
        items={itemsWithAddNewItemCard}
        onCardClick={handleShowEditPopup}
        onAddNewItemClick={() => setShowAddItemPopup(true)}
      />
      <AddItemModal
        show={showAddItemPopup}
        handleClose={handleClose}
        handleAddSubmit={handleAddSubmit}
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
      <EditItemModal
        show={showEditPopup}
        handleClose={handleClose}
        handleEditSubmit={handleEditSubmit}
        validated={validated}
        selectedItem={selectedItem}
        handleEditClick={setIsEditing}
        handleInputChange={handleInputChange}
        incrementQuantity={incrementQuantity}
        decrementQuantity={decrementQuantity}
        handleQuantityChange={handleQuantityChange}
        handleSaveChanges={handleSaveChanges}
        handleDeleteButton={() => setShowDeletePopup(true)}
      />
      <ConfirmEditModal
        show={showEditPopupConfirm}
        handleClose={handleClose}
        handleSaveChanges={handleSaveChanges}
        selectedItem={selectedItem}
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
