import { useEffect, useState } from "react";
import { FaChevronDown, FaPlus } from "react-icons/fa";

import { Button } from "../../components/atoms/Button";
import { Table } from "../../components/atoms/Table";
import { Modal } from "../../components/atoms/Modal";
import { Input } from "../../components/atoms/Input";
import { SendInvoiceClient } from "../../services/SendInvoice";

import type { Recipient } from "../../services/SendInvoice/Invoice/RecipientClient";
import type { CreateInvoiceItemPayload, CreateInvoicePayload } from "../../services/SendInvoice/Invoice";

import "./Invoice.css";

export default function Invoice() {
  // falta setear los datos del usuario que crea el invoice (address, firma, logo)
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState("");

  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(
    null,
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [data, setData] = useState<CreateInvoiceItemPayload[]>([]);

  const handleCreateInvoice = async () => {
    if (!selectedRecipient) {
      alert("Please select a recipient.");
      return;
    }

    if (data.length === 0) {
      alert("Please add at least one item to the invoice.");
      return;
    }

    const createInvoicePayload: CreateInvoicePayload = {
      invoiceNumber: `INV-${Date.now()}`,
      subtotal,
      tax: taxAmount,
      total,
      date: new Date(),
      dueDate: new Date(),
      notes: note,
      billToAddressId: selectedRecipient.address.id,
      shipToAddressId: selectedRecipient.address.id,
      userId: "d2bf5015-cd42-410f-a4d5-05f033012e03",
      companyId: "730af3a5-f1eb-4d7b-99dd-71f5f34da524",
      recipientId: selectedRecipient.id,
      items: data.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        amount: item.amount,
      })),
    };

    try {
      const sendInvoice = new SendInvoiceClient(new URL("http://127.0.0.1:8080"));
      const createdInvoice = await sendInvoice.invoice.createInvoice(createInvoicePayload);

      console.log("Invoice created:", createdInvoice);
      alert("Invoice created successfully!");

      setSelectedRecipient(null);
      setData([]);
      setSelectedTaxRate(0);
    } catch (error) {
      console.error("Failed to create invoice:", error);
      alert("Error creating invoice. Check console for details.");
    }
  };

  useEffect(() => {
    (async () => {
      const sendInvoice = new SendInvoiceClient(new URL("http://127.0.0.1:8080"));
      const recipients = await sendInvoice.recipient.getRecipients();

      if (Array.isArray(recipients)) {
        setRecipients(recipients);
      }
    })();
  }, []);

  const headers = ["Quantity", "Item", "Price", "Amount"];
  const tableData = data.map((row) => ({
    Quantity: row.quantity,
    Item: row.description,
    Price: `$${row.unitPrice.toFixed(2)}`,
    Amount: `$${row.amount.toFixed(2)}`,
  }));

  const [showModal, setShowModal] = useState(false);
  const [newRow, setNewRow] = useState<CreateInvoiceItemPayload>({
    quantity: 0,
    description: "",
    unitPrice: 0,
    amount: 0,
  });

  const [showTaxSelector, setShowTaxSelector] = useState(false);
  const [selectedTaxRate, setSelectedTaxRate] = useState(0);

  const taxOptions = [
    { value: 0, label: "No Tax (0%)" },
    { value: 0.05, label: "5%" },
    { value: 0.1, label: "10%" },
    { value: 0.15, label: "15%" },
    { value: 0.21, label: "21%" },
  ];

  const subtotal = data.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = subtotal * selectedTaxRate;
  const total = subtotal + taxAmount;

  return (
    <div className="invoice-layout">
      <h2 className="h2">
        <FaPlus /> Create a new Invoice
      </h2>
      <div className="invoice-button">
        <Button
          className="button"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {selectedRecipient
            ? selectedRecipient.recipientName
            : "Choose Recipients"}
          <FaChevronDown className="button-icon" />
        </Button>

        {showDropdown && (
          <ul className="dropdown-list">
            {recipients.map((recipient) => (
              <li
                key={recipient.id}
                className="dropdown-item"
                onClick={() => {
                  setSelectedRecipient(recipient);
                  setShowDropdown(false);
                }}
              >
                {recipient.recipientName}
              </li>
            ))}
          </ul>
        )}

        <Button className="button" onClick={() => setShowModal(true)}>
          Add Row
          <FaPlus className="button-icon" />
        </Button>
      </div>
      <div className="content-area">
        {selectedRecipient ? (
          <div className="recipient-details">
            <p>
              <strong>Name:</strong> {selectedRecipient.recipientName}
            </p>
            <p>
              <strong>Phone:</strong> {selectedRecipient.phone}
            </p>
            <p>
              <strong>Address:</strong>
            </p>
            <ul>
              <li>{selectedRecipient.address.streetAddress1}</li>
              {selectedRecipient.address.streetAddress2 && (
                <li>{selectedRecipient.address.streetAddress2}</li>
              )}
              <li>
                {selectedRecipient.address.city},{" "}
                {selectedRecipient.address.cityArea}
              </li>
              <li>
                {selectedRecipient.address.postalCode},{" "}
                {selectedRecipient.address.country}
              </li>
            </ul>
          </div>
        ) : (
          <p>No recipient selected</p>
        )}
        <div className="invoice-table">
          {data.length === 0 ? (
            <div className="empty-table-message">
              <p>No items added yet. Click "Add Row" to start.</p>
            </div>
          ) : (
            <Table headers={headers} data={tableData}></Table>
          )}
        </div>
        <div>
          <div className="invoice-totals">
            <div className="total-row">
              <span className="total-label">Subtotal:</span>
              <span className="total-value">${subtotal.toFixed(2)}</span>
            </div>
            <div className="total-row">
              {!showTaxSelector ? (
                <Button
                  className="add-tax-button"
                  onClick={() => setShowTaxSelector(true)}
                >
                  Add Tax
                </Button>
              ) : (
                <div className="tax-selector">
                  <span className="total-label">Tax:</span>
                  <select
                    value={selectedTaxRate}
                    onChange={(e) => setSelectedTaxRate(Number(e.target.value))}
                    className="tax-select"
                  >
                    {taxOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            {selectedTaxRate > 0 && (
              <div className="total-row">
                <span className="total-label">
                  Tax ({(selectedTaxRate * 100).toFixed(0)}%):
                </span>
                <span className="total-value">${taxAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="total-row total-final">
              <span className="total-label">Total:</span>
              <span className="total-value">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className="invoice-note">
          {!showNote ? (
            <Button className="note-button" onClick={() => setShowNote(true)}>
              Add Note
            </Button>
          ) : (
            <textarea
              className="note-textarea"
              placeholder="Add note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          )}
        </div>
        <div>
          <Button
            className="create-button"
            onClick={handleCreateInvoice}>
            Create
          </Button>
        </div>
        {showModal && (
          <Modal>
            <div className="modal-form">
              <h3 className="h3">Add a new row</h3>
              <label>
                Quantity:
                <Input
                  type="number"
                  value={newRow.quantity}
                  onChange={(e) =>
                    setNewRow({ ...newRow, quantity: parseInt(e.target.value, 10) })
                  }
                />
              </label>
              <label>
                Item:
                <Input
                  type="text"
                  value={newRow.description}
                  onChange={(e) =>
                    setNewRow({ ...newRow, description: e.target.value })
                  }
                />
              </label>
              <label>
                Price:
                <Input
                  type="number"
                  value={newRow.unitPrice}
                  onChange={(e) =>
                    setNewRow({ ...newRow, unitPrice: parseFloat(e.target.value) })
                  }
                />
              </label>

              <div className="modal-buttons">
                <Button
                  className="button"
                  onClick={() => {
                    const newEntry: CreateInvoiceItemPayload = {
                      quantity: newRow.quantity,
                      description: newRow.description,
                      unitPrice: newRow.unitPrice,
                      amount: newRow.quantity * newRow.unitPrice,
                    };
                    setData([...data, newEntry]);
                    setNewRow({ quantity: 0, description: "", unitPrice: 0, amount: 0 });
                    setShowModal(false);
                  }}
                >
                  Confirm
                </Button>
                <Button className="button" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
