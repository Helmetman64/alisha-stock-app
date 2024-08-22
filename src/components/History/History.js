import React, { useEffect, useState } from "react";
import supabase from "../../services/supabaseClient";
import { Table, Pagination } from "react-bootstrap";
import Piechart from "./Piechart";
import EditSaleModal from "../Modals/EditSaleModal";
import ConfirmDeleteSaleModal from "../Modals/ConfirmDeleteSaleModal";

const History = () => {
  const [salesHistory, setSalesHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [showDeleteSalePopup, setShowDeleteSalePopup] = useState(false);
  const [showEditSalePopup, setShowEditSalePopup] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

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

  const handleSaveChanges = async (saleID, newSaleDate) => {
    try {
      const { data, error } = await supabase
        .from("Sales")
        .update({ saleDate: newSaleDate })
        .eq("saleID", saleID);

      if (error) {
        throw error;
      }

      // Refresh the sales history after saving changes
      const updatedSalesHistory = await fetchSalesHistory();
      setSalesHistory(updatedSalesHistory);
    } catch (error) {
      console.error("Error saving changes: ", error);
    } finally {
      handleClose();
    }
  };

  const handleDeleteSale = async (saleID) => {
    try {
      // Delete items from SaleItems table
      const { error: saleItemsError } = await supabase
        .from("SaleItems")
        .delete()
        .eq("saleID", saleID);

      if (saleItemsError) {
        throw saleItemsError;
      }

      // Delete the sale from Sales table
      const { error: salesError } = await supabase
        .from("Sales")
        .delete()
        .eq("saleID", saleID);

      if (salesError) {
        throw salesError;
      }

      // Refresh the sales history after deletion
      const updatedSalesHistory = await fetchSalesHistory();
      setSalesHistory(updatedSalesHistory);
    } catch (error) {
      console.error("Error deleting sale:", error);
    } finally {
      handleClose();
    }
  };

  const handleShowEditPopup = (saleID) => {
    const saleItems = salesHistory.filter((item) => item.saleID === saleID);
    const saleDetails = {
      saleID: saleID,
      saleDate: saleItems[0].Sales.saleDate,
      totalPrice: saleItems[0].Sales.totalPrice,
      items: saleItems.map((item) => item.itemName).join(", "),
    };
    setSelectedSale(saleDetails);
    setShowEditSalePopup(true);
  };

  const handleClose = () => {
    setShowDeleteSalePopup(false);
    setShowEditSalePopup(false);
    setSelectedSale(null);
  };

  const handleShowDeletePopup = (saleID) => {
    setShowDeleteSalePopup(true);
  };

  useEffect(() => {
    const getSalesHistory = async () => {
      const data = await fetchSalesHistory();
      setSalesHistory(data);
    };

    getSalesHistory();
  });

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
    <div className="history-container">
      <div className="history-table">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Sale ID</th>
              <th>Items</th>
              <th>QTY</th>
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
                <tr
                  key={index}
                  onClick={() => handleShowEditPopup(item.saleID)} // Add onClick to the row
                  style={{ cursor: "pointer" }} // Optional: Change cursor style to indicate row is clickable
                >
                  {shouldRenderSaleID && (
                    <td rowSpan={item.saleIDCount}>{item.saleID}</td>
                  )}
                  <td>{item.itemName}</td>
                  <td>{item.qtySold}</td>
                  <td>${item.salePrice.toFixed(2)}</td>
                  <td>${(item.qtySold * item.salePrice).toFixed(2)}</td>
                  <td>
                    {new Date(item.Sales.saleDate).toLocaleString("en-US", {
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
                      ${item.Sales.totalPrice.toFixed(2)}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </Table>
        <EditSaleModal
          show={showEditSalePopup}
          handleClose={handleClose}
          selectedSale={selectedSale}
          handleDeleteButton={handleShowDeletePopup}
          handleSaveChanges={handleSaveChanges}
        />
        <ConfirmDeleteSaleModal
          show={showDeleteSalePopup}
          handleClose={handleClose}
          handleDeleteSale={handleDeleteSale}
          selectedSale={selectedSale}
        />
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
      <Piechart salesHistory={salesHistory} />
    </div>
  );
};

export default History;
