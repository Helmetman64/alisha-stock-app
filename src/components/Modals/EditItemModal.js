import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EditItemModal = ({
  show,
  handleClose,
  handleEditSubmit,
  validated,
  selectedItem,
  handleInputChange,
  handleDeleteButton,
  handleVariationChange, // Make sure this is passed
}) => {
  const [selectedVariation, setSelectedVariation] = useState(null);

  useEffect(() => {
    // When selectedItem changes, update selectedVariation to match the variation if available
    if (
      selectedItem &&
      selectedItem.variations &&
      selectedItem.variations.length > 0
    ) {
      // Default to first variation if none is selected
      setSelectedVariation(selectedItem.variations[0]);
    } else {
      setSelectedVariation(null);
    }
  }, [selectedItem]);

  const preventMinus = (e) => {
    if (e.code === "Minus") {
      e.preventDefault();
    }
  };

  // Make sure handleVariationChange updates selectedVariation correctly
  const onVariationChange = (e) => {
    const variationID = e.target.value;
    handleVariationChange(e); // Call parent function to update selectedVariation
    const variation = selectedItem.variations.find(
      (v) => v.variationID.toString() === variationID.toString()
    );
    setSelectedVariation(variation);
  };

  if (!selectedItem) {
    return null; // Return null if selectedItem is null
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit {selectedItem.itemName}</Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleEditSubmit}>
        <Modal.Body>
          <Form.Group controlId="formItemName">
            <Form.Label>Item Title</Form.Label>
            <Form.Control
              required
              type="text"
              name="itemName"
              placeholder="Title"
              value={selectedItem.itemName}
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a name.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formItemDesc">
            <Form.Label>Item Description</Form.Label>
            <Form.Control
              required
              type="text"
              name="itemDesc"
              placeholder="Description"
              value={selectedItem.itemDesc}
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a description.
            </Form.Control.Feedback>
          </Form.Group>

          {/* Display dropdown if item has variations */}
          {selectedItem.variations && selectedItem.variations.length > 0 && (
            <Form.Group controlId="formItemVariations">
              <Form.Label>Select Variation</Form.Label>
              <Form.Control
                as="select"
                onChange={onVariationChange}
                value={selectedVariation ? selectedVariation.variationID : ""}
              >
                <option value="">Choose a variation...</option>
                {selectedItem.variations.map((variation) => (
                  <option
                    key={variation.variationID}
                    value={variation.variationID}
                  >
                    {variation.variationName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          )}

          <Form.Group controlId="formItemPrice">
            <Form.Label>Item Price</Form.Label>
            <Form.Control
              required
              type="number"
              name="itemPrice"
              placeholder="Price"
              defaultValue={
                selectedVariation
                  ? selectedVariation.variationPrice
                  : selectedItem.itemPrice
              }
              onChange={handleInputChange}
              onKeyDown={preventMinus}
              min="1"
            />
            <Form.Control.Feedback type="invalid">
              Price must be greater than 0.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formItemQTY">
            <Form.Label>Item Quantity</Form.Label>
            <Form.Control
              required
              type="number"
              name="itemQTY"
              placeholder="Quantity"
              defaultValue={
                selectedVariation
                  ? selectedVariation.variationQTY
                  : selectedItem.itemQTY
              }
              onChange={handleInputChange}
              onKeyDown={preventMinus}
              min="1"
            />
            <Form.Control.Feedback type="invalid">
              Quantity must be greater than 0.
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDeleteButton}>
            Delete
          </Button>
          <Button variant="success" type="submit">
            Save changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditItemModal;
