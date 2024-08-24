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
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [showAddItemPopup, setShowAddItemPopup] = useState(false);
  const [showAddItemConfirm, setShowAddItemConfirm] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [newItem, setNewItem] = useState({
    itemName: "",
    itemDesc: "",
    itemPrice: "",
    itemQTY: "",
  });
  const [validated, setValidated] = useState(false);

  const fetchItemVariations = async (itemID) => {
    const { data, error } = await supabase
      .from("ItemVariation")
      .select("*")
      .eq("itemID", itemID);

    if (error) {
      console.log("Error fetching variations:", error);
      return [];
    }

    return data;
  };

  const handleShowEditPopup = async (item) => {
    // Fetch variations for the selected item
    const variations = await fetchItemVariations(item.itemID);
    setSelectedItem({ ...item, variations });
    setShowEditPopup(true);
  };

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase.from("Item").select("*");

      if (error) {
        setFetchError("Could not fetch the items");
        setItems([]);
      } else {
        // Include variations for each item
        const itemsWithVariations = await Promise.all(
          data.map(async (item) => {
            const variations = await fetchItemVariations(item.itemID);
            return { ...item, variations };
          })
        );

        setItems(itemsWithVariations);
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
    setSelectedItem(null);
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
    try {
      // Step 1: Delete related rows in SaleItems
      const { error: saleItemsError } = await supabase
        .from("SaleItems")
        .delete()
        .eq("itemID", selectedItem.itemID);

      if (saleItemsError) {
        throw saleItemsError;
      }

      // Step 2: Delete the item from Item table
      const { error: itemError } = await supabase
        .from("Item")
        .delete()
        .eq("itemID", selectedItem.itemID);

      if (itemError) {
        throw itemError;
      }

      // Update the state to remove the item from the UI
      setItems(items.filter((item) => item.itemID !== selectedItem.itemID));
    } catch (error) {
      console.log(error);
    } finally {
      handleClose();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedItem({ ...selectedItem, [name]: value });
  };

  const handleSaveChanges = async () => {
    const { error } = await supabase
      .from("Item")
      .update({
        itemName: selectedItem.itemName,
        itemDesc: selectedItem.itemDesc,
        itemPrice: selectedItem.itemPrice,
        itemQTY: selectedItem.itemQTY,
      })
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
        disableClick={false}
        disablePointer={false}
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
        handleInputChange={handleInputChange}
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
