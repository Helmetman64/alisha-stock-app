import React, { useEffect, useState } from "react";
import supabase from "../services/supabaseClient";
import { Table, Pagination } from "react-bootstrap";

const History = () => {
  const [salesHistory, setSalesHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Set the number of items per page

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = salesHistory.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(salesHistory.length / itemsPerPage);

  const handleFirstPage = () => setCurrentPage(1);
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handleLastPage = () => setCurrentPage(totalPages);

  return (
    <div>
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
          {currentItems.map((item, index) => {
            const shouldRenderSaleID =
              index === 0 || item.saleID !== currentItems[index - 1].saleID;
            return (
              <tr key={index}>
                {shouldRenderSaleID && (
                  <td rowSpan={item.saleIDCount}>{item.saleID}</td>
                )}
                <td>{item.itemName}</td>
                <td>{item.qtySold}</td>
                <td>${item.salePrice.toFixed(2)}</td>
                <td>${(item.qtySold * item.salePrice).toFixed(2)}</td>
                <td>
                  {new Date(item.Sales.saleDate).toLocaleString("en-AU", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </td>
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
      <Pagination>
        <Pagination.First
          onClick={handleFirstPage}
          disabled={currentPage === 1}
        />
        <Pagination.Prev
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        />
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
          <Pagination.Item
            key={number}
            active={number === currentPage}
            onClick={() => setCurrentPage(number)}
          >
            {number}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last
          onClick={handleLastPage}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </div>
  );
};

export default History;
