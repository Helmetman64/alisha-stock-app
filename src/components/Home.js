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
    setShowSellItemPopup(false);
    setShowSoldPopup(false);
  };

  const handleCardClick = useCallback((item) => {
    const id = item.itemID;
    setShowTotal(true);

    setClickedCards((prevClickedCards) => {
      const updatedClickedCards = { ...prevClickedCards };
      if (updatedClickedCards[id]) {
        updatedClickedCards[id].count += 1;
      } else {
        updatedClickedCards[id] = { id, count: 1 };
      }
      return updatedClickedCards;
    });
  }, []);

  const handleQuantityChange = (id, newQuantity) => {
    setClickedCards((prevClickedCards) => {
      const updatedClickedCards = { ...prevClickedCards };
      if (updatedClickedCards[id]) {
        updatedClickedCards[id].count = Math.max(0, newQuantity);
        if (updatedClickedCards[id].count === 0) {
          const { [id]: _, ...remaining } = updatedClickedCards;
          return remaining;
        }
      }
      return updatedClickedCards;
    });
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
      if (updatedClickedCards[id]) {
        updatedClickedCards[id].count += 1;
      }
      return updatedClickedCards;
    });
  };

  const handleDecrementQuantity = (id) => {
    setClickedCards((prevClickedCards) => {
      const updatedClickedCards = { ...prevClickedCards };
      if (updatedClickedCards[id] && updatedClickedCards[id].count > 1) {
        updatedClickedCards[id].count -= 1;
      } else {
        const { [id]: _, ...remaining } = updatedClickedCards;
        return remaining;
      }
      return updatedClickedCards;
    });
  };

  const calculateTotal = () => {
    return Object.values(clickedCards)
      .reduce((total, { id, count }) => {
        const item = items.find((item) => item.itemID === id);
        if (item) {
          return total + item.itemPrice * count;
        }
        return total;
      }, 0)
      .toFixed(2);
  };

  const cartItems = Object.values(clickedCards).map(({ id, count }) => {
    const item = items.find((item) => item.itemID === id);
    return {
      itemID: id,
      itemName: item?.itemName,
      itemPrice: item?.itemPrice,
      count: count,
    };
  });

  const handleConfirmSale = async () => {
    const saleDate = new Date().toISOString();
    let totalAmount = 0;

    cartItems.forEach((item) => {
      totalAmount += item.itemPrice * item.count;
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
      qtySold: item.count,
    }));

    const { error: saleItemsError } = await supabase
      .from("SaleItems")
      .insert(saleItemsData);

    if (saleItemsError) {
      console.error("Error inserting sale items:", saleItemsError);
      return;
    }

    // Log sale information to console
    let logMessage = `Sale Date: ${saleDate}\nItems Sold:\n`;
    cartItems.forEach((item) => {
      const total = item.itemPrice * item.count;
      logMessage += `Item: ${item.itemName}, Qty: ${
        item.count
      }, Unit Price: $${item.itemPrice.toFixed(2)}, Total: $${total.toFixed(
        2
      )}\n`;
    });
    logMessage += `Overall Total: $${totalAmount.toFixed(2)}`;
    console.log(logMessage);

    setShowSellItemPopup(false);
    setShowSoldPopup(true);
    // Reset cartItems or update UI accordingly
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
            {Object.values(clickedCards).map(({ id, count }) => {
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
                          initialQuantity={count}
                          onQuantityChange={(newQuantity) =>
                            handleQuantityChange(id, newQuantity)
                          }
                        />
                        <span className="bold-label">
                          Price:{" "}
                          <span className="normal-value">
                            ${(item?.itemPrice * count).toFixed(2)}
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
        <StockCards items={items} onCardClick={handleCardClick} />
      </div>
      <ConfirmSellModal
        show={showSellItemPopup}
        handleClose={handleClose}
        items={cartItems}
        total={calculateTotal()}
        incrementQuantity={handleIncrementQuantity}
        decrementQuantity={handleDecrementQuantity}
        handleQuantityChange={handleQuantityChange}
        handleConfirmSale={handleConfirmSale}
        deleteItem={handleRemoveItem}
      />
      <SoldModal show={showSoldPopup} handleClose={handleClose} />
    </div>
  );
}
