import React from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const StockCards = ({
  items,
  onCardClick,
  onAddNewItemClick,
  disableClick,
  disablePointer,
}) => {
  return (
    <Row>
      {items &&
        items.map((item) =>
          item.isAddNewItemCard ? (
            <Col
              key={item.itemID}
              xs={12}
              sm={6}
              md={6}
              lg={4}
              xl={3}
              className="mb-4"
            >
              <Card
                style={{ width: "100%" }}
                className="clickable-card"
                onClick={onAddNewItemClick}
              >
                <Card.Body>
                  <Card.Title>{item.itemName}</Card.Title>
                  <Card.Text>{item.itemDesc}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ) : (
            <Col
              key={item.itemID}
              xs={12}
              sm={6}
              md={6}
              lg={4}
              xl={3}
              className="mb-4"
            >
              <Card
                style={{
                  width: "100%",
                  backgroundColor: item.itemQTY === 0 ? "#dbd9d9" : "inherit",
                }}
                className={
                  item.itemQTY !== 0 || !disablePointer ? "clickable-card" : " "
                }
                onClick={
                  item.itemQTY !== 0 || !disableClick
                    ? () => onCardClick(item, item.variations || [])
                    : null
                }
              >
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
                      <span className="normal-value">
                        ${item.itemPrice || "Varies"}
                      </span>
                    </span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          )
        )}
    </Row>
  );
};

export default StockCards;
