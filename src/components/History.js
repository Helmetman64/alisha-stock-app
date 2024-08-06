import React, { useEffect, useState } from "react";
import supabase from "../services/supabaseClient";
import { Table } from "react-bootstrap";

const History = () => {
  const [salesHistory, setSalesHistory] = useState([]);

  const fetchSalesHistory = async () => {
    const { data, error } = await supabase
      .from("SaleItems")
      .select(
        "saleID, itemName, qtySold, salePrice, Sales!inner(saleDate, totalAmount)"
      )
      .order("saleID", { ascending: true });

    if (error) {
      console.error("Error fetching sales history:", error);
      return [];
    }

    return countSaleID(data);
  };

  const countSaleID = (data) => {
    const saleIDCount = {};
    data.forEach((item) => {
      saleIDCount[item.saleID] = (saleIDCount[item.saleID] || 0) + 1;
    });

    return data.map((item) => ({
      ...item,
      saleIDCount: saleIDCount[item.saleID],
      rowspan: saleIDCount[item.saleID] > 1 ? saleIDCount[item.saleID] : 0,
    }));
  };

  useEffect(() => {
    const getSalesHistory = async () => {
      const data = await fetchSalesHistory();
      setSalesHistory(data);
    };

    getSalesHistory();
  }, []);

  return (
    <div>
      <h2>Sales History</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Sale ID</th>
            <th>Items</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total Price</th>
            <th>Sale Date</th>
            <th>Overall Total</th>
          </tr>
        </thead>
        <tbody>
          {salesHistory.map((item, index) => {
            const shouldRenderSaleID =
              index === 0 || item.saleID !== salesHistory[index - 1].saleID;
            return (
              <tr key={index}>
                {shouldRenderSaleID && (
                  <td rowSpan={item.saleIDCount}>{item.saleID}</td>
                )}
                <td>{item.itemName}</td>
                <td>{item.qtySold}</td>
                <td>${item.salePrice.toFixed(2)}</td>
                <td>${(item.qtySold * item.salePrice).toFixed(2)}</td>
                <td>{new Date(item.Sales.saleDate).toLocaleString()}</td>
                {shouldRenderSaleID && (
                  <td rowSpan={item.saleIDCount}>
                    ${item.Sales.totalAmount.toFixed(2)}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default History;
