import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import React, { useEffect, useState } from "react";
import supabase from "../services/supabaseClient";

const StockList = () => {
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
    <Container fluid>
      <h1>Stock</h1>
      <div className="body">
        <Row>
          {items &&
            items.map((item) => (
              <Col
                key={item.id}
                xs={12}
                sm={6}
                md={6}
                lg={4}
                xl={3}
                className="mb-4"
              >
                <Card style={{ width: "100%" }}>
                  <Card.Body>
                    <Card.Title>{item.itemName}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {item.itemDesc}
                    </Card.Subtitle>
                    <Card.Text className="d-flex justify-content-between">
                      <span className="bold-label">
                        Stock Level:{" "}
                        <span className="normal-value">{item.itemQTY}</span>
                      </span>
                      <span className="bold-label">
                        Price:{" "}
                        <span className="normal-value">${item.itemPrice}</span>
                      </span>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>
      </div>
    </Container>
  );
};

export default StockList;
