import React, { useEffect, useState } from "react";
import supabase from "../../services/supabaseClient";

import { Card } from "react-bootstrap";
import { BarChart } from "./BarChart";

export const Dashboard = () => {
  const [salesHistory, setSalesHistory] = useState([]);

  const fetchSalesHistory = async () => {
    const { data, error } = await supabase
      .from("SaleItems")
      .select(
        "saleID, itemName, qtySold, salePrice, Sales!inner(saleDate, totalPrice)"
      )
      .order("saleID", { ascending: true });

    if (error) {
      console.error("Error fetching sales history:", error);
      return [];
    }
  };

  useEffect(() => {
    const getSalesHistory = async () => {
      const data = await fetchSalesHistory();
      setSalesHistory(data);
    };

    getSalesHistory();
  });

  return (
    <div className="dashboard-container">
      <div className="total-sales-container">
        <Card>
          <Card.Body>
            <Card.Title>Total Sales</Card.Title>
            <Card.Text>Sales for this month</Card.Text>
          </Card.Body>
        </Card>
      </div>
      <div className="net-profit-container">
        <Card>
          <Card.Body>
            <Card.Title>Net Profit</Card.Title>
            <Card.Text>Sales for this month</Card.Text>
          </Card.Body>
        </Card>
      </div>
      <BarChart salesHistory={salesHistory} />
    </div>
  );
};
