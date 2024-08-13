import React, { useEffect, useState, useCallback } from "react";
import supabase from "../services/supabaseClient";
import Card from "react-bootstrap/Card";
import StockCards from "./StockCards";
import EditableQuantity from "./Side-Cart/EditableQty";
import { Button } from "react-bootstrap";
import ConfirmSellModal from "./Modals/ConfirmSellModal";
import SoldModal from "./Modals/SoldModal";

export default function Home() {
  const [fetchError, setFetchError] = useState(null);
  const [showSellItemPopup, setShowSellItemPopup] = useState(false);
  const [showSoldPopup, setShowSoldPopup] = useState(false);
  const [items, setItems] = useState([]);
  const [clickedCards, setClickedCards] = useState({});
  const [showTotal, setShowTotal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Error message state

  const fetchItems = async () => {
    const { data, error } = await supabase.from("Item").select("*");

    if (error) {
      setFetchError("Could not fetch the items");
      setItems([]);
    } else {
      setItems(data);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleCloseSellItemPopup = () => {
    setShowSellItemPopup(false);
  };

  const handleCloseSoldModal = () => {
    setShowSoldPopup(false);
    fetchItems();
  };

  const handleCardClick = useCallback((item) => {
    const id = item.itemID;
    const stock = item.itemQTY;
    setShowTotal(true);
    setErrorMessage(""); // Clear previous error message

    setClickedCards((prevClickedCards) => {
      const updatedClickedCards = { ...prevClickedCards };
      if (updatedClickedCards[id]) {
        if (updatedClickedCards[id].currentQTY < stock) {
          updatedClickedCards[id].currentQTY += 1;
        } else {
          setErrorMessage(
            `Cannot add more than ${stock} items of ${item.itemName} to the cart.`
          );
        }
      } else {
        if (stock > 0) {
          updatedClickedCards[id] = { id, currentQTY: 1 };
        } else {
          setErrorMessage(
            `Cannot add ${item.itemName} to the cart as it is out of stock.`
          );
        }
      }
      return updatedClickedCards;
    });
  }, []);

  const handleQuantityChange = (id, newQuantity) => {
    const item = items.find((item) => item.itemID === id);
    const stock = item.itemQTY;

    // Cap the new quantity at the stock level
    const cappedQuantity = Math.min(newQuantity, stock);
    setClickedCards((prevClickedCards) => {
      const updatedClickedCards = { ...prevClickedCards };
      if (updatedClickedCards[id]) {
        updatedClickedCards[id].currentQTY = Math.max(0, cappedQuantity);
        if (updatedClickedCards[id].currentQTY === 0) {
          const { [id]: _, ...remaining } = updatedClickedCards;
          return remaining;
        }
      }
      return updatedClickedCards;
    });

    // Clear error message
    setErrorMessage("");
  };

  const handleRemoveItem = (id) => {
    setClickedCards((prevClickedCards) => {
      const { [id]: _, ...remainingClickedCards } = prevClickedCards;
      if (Object.keys(remainingClickedCards).length === 0) {
        setShowTotal(false);
      }
      return remainingClickedCards;
    });
  };

  const handleIncrementQuantity = (id) => {
    setClickedCards((prevClickedCards) => {
      const updatedClickedCards = { ...prevClickedCards };
      const item = items.find((item) => item.itemID === id);
      if (updatedClickedCards[id]) {
        if (updatedClickedCards[id].currentQTY < item.itemQTY) {
          updatedClickedCards[id].currentQTY += 1;
          setErrorMessage(""); // Clear error message
        } else {
          setErrorMessage(
            `Cannot add more than ${item.itemQTY} items of ${item.itemName} to the cart.`
          );
        }
      }
      return updatedClickedCards;
    });
  };

  const handleDecrementQuantity = (id) => {
    setClickedCards((prevClickedCards) => {
      const updatedClickedCards = { ...prevClickedCards };
      if (updatedClickedCards[id] && updatedClickedCards[id].currentQTY > 1) {
        updatedClickedCards[id].currentQTY -= 1;
      } else {
        const { [id]: _, ...remaining } = updatedClickedCards;
        return remaining;
      }
      return updatedClickedCards;
    });
  };

  const calculateTotal = () => {
    return Object.values(clickedCards)
      .reduce((total, { id, currentQTY }) => {
        const item = items.find((item) => item.itemID === id);
        if (item) {
          return total + item.itemPrice * currentQTY;
        }
        return total;
      }, 0)
      .toFixed(2);
  };

  const cartItems = Object.values(clickedCards).map(({ id, currentQTY }) => {
    const item = items.find((item) => item.itemID === id);
    return {
      itemID: id,
      itemName: item?.itemName,
      itemPrice: item?.itemPrice,
      currentQTY: currentQTY,
      itemQTY: item?.itemQTY,
    };
  });

  const handleConfirmSale = async () => {
    const saleDate = new Date().toISOString();
    let totalAmount = 0;

    cartItems.forEach((item) => {
      totalAmount += item.itemPrice * item.currentQTY;
    });

    // Insert into Sales table
    const { data: saleData, error: saleError } = await supabase
      .from("Sales")
      .insert([{ saleDate, totalAmount }])
      .select();

    if (saleError) {
      console.error("Error inserting sale:", saleError);
      return;
    }

    const saleID = saleData[0].saleID;

    // Insert into SaleItems table
    const saleItemsData = cartItems.map((item) => ({
      saleID,
      itemID: item.itemID,
      itemName: item.itemName,
      salePrice: item.itemPrice,
      qtySold: item.currentQTY,
    }));

    const { error: saleItemsError } = await supabase
      .from("SaleItems")
      .insert(saleItemsData);

    if (saleItemsError) {
      console.error("Error inserting sale items:", saleItemsError);
      return;
    }

    // Update stock levels
    for (const item of cartItems) {
      const { itemID, currentQTY } = item;
      const { data: itemData, error: itemError } = await supabase
        .from("Item")
        .select("itemQTY")
        .eq("itemID", itemID)
        .single();

      if (itemError) {
        console.error("Error fetching item:", itemError);
        continue;
      }

      const newStock = itemData.itemQTY - currentQTY;

      const { error: updateError } = await supabase
        .from("Item")
        .update({ itemQTY: newStock })
        .eq("itemID", itemID);

      if (updateError) {
        console.error("Error updating item stock:", updateError);
      }
    }

    setShowSellItemPopup(false); // Hide ConfirmSellModal
    setClickedCards({}); // Reset cart items
    setShowSoldPopup(true); // Show SoldModal
  };

  return (
    <div className="full-container">
      <div
        className={`side-cart ${
          Object.keys(clickedCards).length === 0 ? "empty" : ""
        }`}
      >
        {Object.keys(clickedCards).length === 0 ? (
          <h1>Cart is empty :(</h1>
        ) : (
          <>
            {Object.values(clickedCards).map(({ id, currentQTY }) => {
              const item = items.find((item) => item.itemID === id);
              return (
                <div key={id}>
                  <Card style={{ width: "100%" }}>
                    <Card.Body>
                      <Card.Title>
                        <div className="cart-item-title">
                          {item?.itemName}
                          <i
                            className="bi bi-trash clickable-icon"
                            onClick={() => handleRemoveItem(id)}
                          ></i>
                        </div>
                      </Card.Title>
                      <Card.Text className="d-flex justify-content-between">
                        <EditableQuantity
                          initialQuantity={currentQTY}
                          onQuantityChange={(newQuantity) =>
                            handleQuantityChange(id, newQuantity)
                          }
                          maxQuantity={item?.itemQTY}
                        />
                        <span className="bold-label">
                          Price:{" "}
                          <span className="normal-value">
                            ${(item?.itemPrice * currentQTY).toFixed(2)}
                          </span>
                        </span>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              );
            })}
            {showTotal && (
              <div className="total-section">
                <hr />
                <h4>Total: ${calculateTotal()}</h4>
              </div>
            )}
            <div className="checkout-section">
              <Button
                variant="success"
                style={{ width: "100%" }}
                onClick={() => setShowSellItemPopup(true)}
              >
                Sell Items
              </Button>
            </div>
          </>
        )}
      </div>
      <div className="home">
        <StockCards
          items={items}
          onCardClick={handleCardClick}
          disableClick={true}
          disablePointer={true}
        />
      </div>
      <ConfirmSellModal
        show={showSellItemPopup}
        handleClose={handleCloseSellItemPopup}
        items={cartItems}
        total={calculateTotal()}
        incrementQuantity={handleIncrementQuantity}
        decrementQuantity={handleDecrementQuantity}
        handleQuantityChange={handleQuantityChange}
        handleConfirmSale={handleConfirmSale}
        deleteItem={handleRemoveItem}
      />
      <SoldModal show={showSoldPopup} handleClose={handleCloseSoldModal} />
    </div>
  );
}

//.
