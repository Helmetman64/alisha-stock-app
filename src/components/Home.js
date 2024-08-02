import React, { useEffect, useState } from "react";
import supabase from "../services/supabaseClient";

export default function Home() {
  const [fetchError, setFetchError] = useState(null);
  const [items, setItems] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase.from("Item").select("*");

      if (error) {
        setFetchError("Could not fetch the items");
        setItems(null);
        console.log(error);
      }

      if (data) {
        setItems(data);
        setFetchError(null);
        console.log(data);
      }
    };

    fetchItems();
  }, []);

  return (
    <div>
      <h1>All items</h1>
      {fetchError && <p>{fetchError}</p>}
      {items && (
        <div className="items">
          {items.map((item) => (
            <div>
              <p>{item.itemName}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
