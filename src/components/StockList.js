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
          {items && (
            <div className="container">
              {items.map((item) => (
                <Col xs={12} sm={6} md={6} lg={4} xl={3}>
                  <Card style={{ width: "20rem" }}>
                    <Card.Body>
                      <div>
                        <Card.Title>{item.itemName}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                          {item.itemDesc}
                        </Card.Subtitle>
                        <Card.Text>
                          Stock Level: {item.itemQTY}
                          <span> Price: ${item.itemPrice}</span>
                        </Card.Text>
                        <Card.Text></Card.Text>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </div>
          )}
        </Row>
      </div>
    </Container>
  );
};

export default StockList;
