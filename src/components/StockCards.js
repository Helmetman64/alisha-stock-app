import React from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

const StockCards = ({
  items,
  onCardClick,
  onAddNewItemClick,
  disableClick,
  disablePointer,
  showDropdown,
  onVariationSelect,
}) => {
  return (
    <Row>
      {items &&
        items.map((item) => {
          const hasStock = item.itemQTY > 0;
          const hasNoVariations =
            !item.variations || item.variations.length === 0;
          const isClickable = hasStock && hasNoVariations && !disablePointer;

          return item.isAddNewItemCard ? (
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
                className={isClickable ? "clickable-card" : ""}
                onClick={isClickable ? () => onCardClick(item) : null}
              >
                <Card.Body>
                  <Card.Title>{item.itemName}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {item.itemDesc}
                  </Card.Subtitle>
                  <Card.Text className="d-flex justify-content-between">
                    {hasNoVariations ? (
                      <>
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
                      </>
                    ) : null}
                  </Card.Text>
                  {showDropdown &&
                    item.variations &&
                    item.variations.length > 0 && (
                      <Dropdown>
                        <DropdownButton
                          id="dropdown-basic-button"
                          title="Select Variation"
                        >
                          {item.variations.map((variation) => (
                            <Dropdown.Item
                              key={variation.variationID}
                              onClick={() =>
                                onVariationSelect(item.itemID, variation)
                              }
                            >
                              {variation.variationName}
                            </Dropdown.Item>
                          ))}
                        </DropdownButton>
                      </Dropdown>
                    )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
    </Row>
  );
};

export default StockCards;
