import React, { useEffect, useState, useCallback } from "react";
import supabase from "../services/supabaseClient";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import StockCards from "./StockCards";

export default function Home() {
  const [fetchError, setFetchError] = useState(null);
  const [items, setItems] = useState([]);
  const [clickedCards, setClickedCards] = useState({});

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

  const handleCardClick = useCallback((item) => {
    const id = item.itemID;
    console.log("Card clicked:", id);

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.itemID === id
          ? { ...item, clickCount: (item.clickCount || 0) + 1 }
          : item
      )
    );

    setClickedCards((prevClickedCards) => {
      const newClickedCards = { ...prevClickedCards };
      if (newClickedCards[id]) {
        newClickedCards[id].count += 1;
      } else {
        newClickedCards[id] = { id, count: 1 };
      }
      console.log("Updated clickedCards:", newClickedCards);
      return newClickedCards;
    });
  }, []);

  console.log("Rendering Home component");

  return (
    <div className="full-container">
      <div className="side-cart">
        <h2>This is the side cart</h2>
        {Object.values(clickedCards).map(({ id, count }) => {
          const item = items.find((item) => item.itemID === id);
          return (
            <div key={id}>
              <h3>{item?.itemName}</h3>
              <p>{item?.itemDesc}</p>
              <p>Clicked {count} times</p>
            </div>
          );
        })}
      </div>
      <div className="home">
        <StockCards items={items} onCardClick={handleCardClick} />
      </div>
    </div>
  );
}
