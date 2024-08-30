import React, { useEffect, useState, useCallback } from "react";
import supabase from "../services/supabaseClient";
import StockCards from "./StockCards";
import EditableQuantity from "./Side-Cart/EditableQty";
import { Button, Card } from "react-bootstrap";
import ConfirmSellModal from "./Modals/ConfirmSellModal";
import SoldModal from "./Modals/SoldModal";

export default function Home() {
  const [fetchError, setFetchError] = useState(null);
  const [showSellItemPopup, setShowSellItemPopup] = useState(false);
  const [showSoldPopup, setShowSoldPopup] = useState(false);
  const [items, setItems] = useState([]);
  const [clickedCards, setClickedCards] = useState({});
  const [showTotal, setShowTotal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchItemsAndVariations = async () => {
    // Fetch items
    const { data: itemsData, error: itemsError } = await supabase
      .from("Item")
      .select("*");

    if (itemsError) {
      setFetchError("Could not fetch the items");
      setItems([]);
      return;
    }

    // Fetch variations
    const { data: variationsData, error: variationsError } = await supabase
      .from("ItemVariation")
      .select("*");

    if (variationsError) {
      setFetchError("Could not fetch the variations");
      setItems([]);
      return;
    }

    // Combine items and variations
    const itemsWithVariations = itemsData.map((item) => ({
      ...item,
      variations: variationsData.filter(
        (variation) => variation.itemID === item.itemID
      ),
    }));

    setItems(itemsWithVariations);
  };

  useEffect(() => {
    fetchItemsAndVariations();
  }, []);

  const handleCloseSellItemPopup = () => {
    setShowSellItemPopup(false);
  };

  const handleCloseSoldModal = () => {
    setShowSoldPopup(false);
    fetchItemsAndVariations();
  };

  const handleCardClick = useCallback((item, variations) => {
    const id = item.itemID;
    const stock = item.itemQTY;
    setShowTotal(true);
    setErrorMessage("");

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
          updatedClickedCards[id] = { id, currentQTY: 1, variations };
        } else {
          setErrorMessage(
            `Cannot add ${item.itemName} to the cart as it is out of stock.`
          );
        }
      }
      return updatedClickedCards;
    });
  }, []);

  const handleVariationSelect = (itemID, variation) => {
    console.log(
      `Selected variation ${variation?.variationName} for item ${itemID}`
    );

    // Construct a unique key for the item + variation
    const variationKey = `${itemID}${
      variation ? `-${variation.variationID}` : ""
    }`;

    setClickedCards((prevClickedCards) => {
      const updatedClickedCards = { ...prevClickedCards };

      if (updatedClickedCards[variationKey]) {
        // If the variation is already in the cart, increment the quantity
        updatedClickedCards[variationKey].currentQTY += 1;
      } else {
        // If the variation is not in the cart, add it with a quantity of 1
        updatedClickedCards[variationKey] = {
          id: itemID,
          name: variation
            ? variation.variationName
            : items.find((item) => item.itemID === itemID)?.itemName,
          currentQTY: 1,
          variation: variation || null,
        };
      }

      return updatedClickedCards;
    });
  };

  const handleRemoveItem = (itemID, variationID = null) => {
    const updatedClickedCards = { ...clickedCards };

    if (variationID) {
      // Remove the specific item variation if variationID is provided
      delete updatedClickedCards[`${itemID}-${variationID}`];
    } else {
      // Remove all variations of the item or the item itself if no variationID is provided
      for (const key in updatedClickedCards) {
        if (key.startsWith(`${itemID}-`)) {
          delete updatedClickedCards[key];
        } else if (key === `${itemID}`) {
          delete updatedClickedCards[key];
        }
      }
    }

    setClickedCards(updatedClickedCards);
  };

  const handleQuantityChange = (itemID, variationID, newQuantity) => {
    setClickedCards((prevClickedCards) => {
      const updatedClickedCards = { ...prevClickedCards };
      const key = variationID ? `${itemID}-${variationID}` : itemID;

      if (updatedClickedCards[key]) {
        const newQty = Math.max(newQuantity, 0);
        updatedClickedCards[key] = {
          ...updatedClickedCards[key],
          currentQTY: newQty,
        };
      }

      return updatedClickedCards;
    });
  };

  const handleIncrementQuantity = (itemID, variationID = null) => {
    setClickedCards((prevClickedCards) => {
      const updatedClickedCards = { ...prevClickedCards };
      const key = variationID ? `${itemID}-${variationID}` : itemID;
      const item = items.find((item) => item.itemID === itemID);
      const variation = item?.variations?.find(
        (variation) => variation.variationID === variationID
      );

      console.log("Attempting to increment quantity for key:", key);
      console.log("Clicked Cards:", updatedClickedCards);

      if (updatedClickedCards[key]) {
        const stock = variation ? variation.variationQTY : item.itemQTY;
        if (updatedClickedCards[key].currentQTY < stock) {
          updatedClickedCards[key].currentQTY += 1;
          setErrorMessage(""); // Clear error message if quantity is updated
        } else {
          setErrorMessage(
            `Cannot add more than ${stock} items of ${
              variation ? variation.variationName : item.itemName
            } to the cart.`
          );
        }
      } else {
        console.error(
          `Item or variation with key ${key} not found in clickedCards.`
        );
      }

      return updatedClickedCards;
    });
  };

  const handleDecrementQuantity = (itemID, variationID = null) => {
    setClickedCards((prevClickedCards) => {
      const updatedClickedCards = { ...prevClickedCards };
      const key = variationID ? `${itemID}-${variationID}` : itemID;

      if (updatedClickedCards[key] && updatedClickedCards[key].currentQTY > 1) {
        updatedClickedCards[key].currentQTY -= 1;
      } else {
        const { [key]: _, ...remaining } = updatedClickedCards;
        return remaining;
      }

      return updatedClickedCards;
    });
  };

  const calculateTotal = () => {
    return Object.values(clickedCards)
      .reduce((total, { id, currentQTY, variation }) => {
        const item = items.find((item) => item.itemID === id);
        if (item) {
          // Use variation price if it exists, otherwise use item price
          const price = variation?.variationPrice || item.itemPrice;
          return total + price * currentQTY;
        }
        return total;
      }, 0)
      .toFixed(2);
  };

  const cartItems = Object.values(clickedCards).map(
    ({ id, currentQTY, variation }) => {
      const item = items.find((item) => item.itemID === id);
      const variationData = item?.variations?.find(
        (variationItem) => variationItem.variationID === variation?.variationID
      );

      return {
        itemID: id,
        itemName: variationData ? variationData.variationName : item?.itemName,
        itemPrice: variationData
          ? variationData.variationPrice
          : item?.itemPrice,
        currentQTY,
        itemQTY: variationData ? variationData.variationQTY : item?.itemQTY,
        variationID: variationData?.variationID || null,
        variationName: variationData?.variationName || null,
        variationPrice: variationData?.variationPrice || null,
      };
    }
  );

  const handleConfirmSale = async () => {
    const saleDate = new Date().toISOString();
    let totalAmount = 0;

    cartItems.forEach((item) => {
      totalAmount += item.itemPrice * item.currentQTY;
    });

    const { data: saleData, error: saleError } = await supabase
      .from("Sales")
      .insert([{ saleDate, totalAmount }])
      .select();

    if (saleError) {
      console.error("Error inserting sale:", saleError);
      return;
    }

    const saleID = saleData[0].saleID;

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

    setShowSellItemPopup(false);
    setClickedCards({});
    setShowSoldPopup(true);
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
            {Object.values(clickedCards).map(
              ({ id, name, currentQTY, variation }) => {
                const item = items.find((item) => item.itemID === id);

                return (
                  <div
                    key={id + (variation ? `-${variation.variationID}` : "")}
                  >
                    <Card style={{ width: "100%" }}>
                      <Card.Body>
                        <Card.Title>
                          <div className="cart-item-title">
                            {name || item.itemName}
                            <i
                              className="bi bi-trash clickable-icon"
                              onClick={() =>
                                handleRemoveItem(
                                  id,
                                  variation ? variation.variationID : null
                                )
                              }
                            ></i>
                          </div>
                        </Card.Title>
                        <Card.Text className="d-flex justify-content-between">
                          <EditableQuantity
                            initialQuantity={currentQTY}
                            onQuantityChange={(newQuantity) =>
                              handleQuantityChange(
                                id,
                                variation ? variation.variationID : null,
                                newQuantity
                              )
                            }
                            maxQuantity={
                              variation?.variationQTY || item?.itemQTY
                            }
                          />
                          <span className="bold-label">
                            Price:{" "}
                            <span className="normal-value">
                              $
                              {(
                                (variation?.variationPrice || item?.itemPrice) *
                                currentQTY
                              ).toFixed(2)}
                            </span>
                          </span>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </div>
                );
              }
            )}
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
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
          </>
        )}
      </div>

      <div className="home">
        <StockCards
          items={items}
          onCardClick={handleCardClick}
          onAddNewItemClick={() => {}}
          disableClick={false}
          disablePointer={false}
          showDropdown={true} // Ensure this is true when you want to show the dropdown
          onVariationSelect={handleVariationSelect}
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
