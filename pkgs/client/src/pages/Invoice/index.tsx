import { FaChevronDown, FaPlus } from 'react-icons/fa'

import { Button } from '../../components/atoms/Button'

import './Invoice.css'
import { useState } from 'react'
import { Table } from '../../components/atoms/Table'
import { Modal } from '../../components/atoms/Modal'
import { Input } from '../../components/atoms/Input'
import Navbar from '../../components/molecules/Navbar'

type Recipient = {
    id: string;
    recipientName: string;
    phone: string;
    address: {
        StreetAddress1: string;
        StreetAddress2: string;
        city: string;
        cityArea: string;
        postalCode: string;
        country: string;
    };
};

export default function Invoice() {
    // const [recipients, setRecipients] = useState<Recipient[]>([]);
    // const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
    // const [showDropdown, setShowDropdown] = useState(false);

    // falta pedirle al back la lista de los recipients 
    // falta setear los datos del usuario que crea el invoice (address, firma, logo)
    

    const [recipients, setRecipients] = useState(mockRecipients);
    const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);

    const [data, setData] = useState([]);

    const headers = ['Quantity', 'Item', 'Price', 'Amount'];
    const tableData = data.map((row) => ({
        Quantity: row.quantity,
        Item: row.item,
        Price: `$${row.price.toFixed(2)}`,
        Amount: `$${row.amount.toFixed(2)}`,
    }));

    const [showModal, setShowModal] = useState(false);
    const [newRow, setNewRow] = useState({
        quantity: 0,
        item: '',
        price: 0
    });

    const [showTaxSelector, setShowTaxSelector] = useState(false);
    const [selectedTaxRate, setSelectedTaxRate] = useState(0);

    const taxOptions = [
        { value: 0, label: "No Tax (0%)" },
        { value: 0.05, label: "5%" },
        { value: 0.10, label: "10%" },
        { value: 0.15, label: "15%" },
        { value: 0.21, label: "21%" }
    ];

    const subtotal = data.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = subtotal * selectedTaxRate;
    const total = subtotal + taxAmount;

    return (
        <div className='invoice-layout'>
            <Navbar />

            <h2 className='h2'><FaPlus /> Create a new Invoice</h2>
            <div className='invoice-button'>

                <Button
                    className='button'
                    onClick={() => setShowDropdown(!showDropdown)}>
                    {selectedRecipient ? selectedRecipient.recipientName : "Choose Recipients"}
                    <FaChevronDown className='button-icon' />
                </Button>

                {showDropdown && (
                    <ul className='dropdown-list'>
                        {recipients.map((recipient) => (
                            <li
                                key={recipient.id}
                                className='dropdown-item'
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


                <Button
                    className='button'
                    onClick={() => setShowModal(true)}>
                    Add Row
                    <FaPlus className='button-icon' />
                </Button>
            </div>
            <div className='content-area'>
                {selectedRecipient ? (
                    <div className='recipient-details'>
                        <p><strong>Name:</strong> {selectedRecipient.recipientName}</p>
                        <p><strong>Phone:</strong> {selectedRecipient.phone}</p>
                        <p><strong>Address:</strong></p>
                        <ul>
                            <li>{selectedRecipient.address.StreetAddress1}</li>
                            {selectedRecipient.address.StreetAddress2 && (
                                <li>{selectedRecipient.address.StreetAddress2}</li>
                            )}
                            <li>{selectedRecipient.address.city}, {selectedRecipient.address.cityArea}</li>
                            <li>{selectedRecipient.address.postalCode}, {selectedRecipient.address.country}</li>
                        </ul>
                    </div>
                ) : (
                    <p>No recipient selected</p>
                )}
                <div className='invoice-table'>
                    {data.length === 0 ? (
                        <div className="empty-table-message">
                            <p>No items added yet. Click "Add Row" to start.</p>
                        </div>
                    ) : (
                        <Table headers={headers} data={tableData}></Table>
                    )}
                </div>
                <div>
                    <div className='invoice-totals'>
                        <div className='total-row'>
                            <span className='total-label'>Subtotal:</span>
                            <span className='total-value'>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className='total-row'>
                            {!showTaxSelector ? (
                                <Button
                                    className='add-tax-button'
                                    onClick={() => setShowTaxSelector(true)}>
                                    Add Tax
                                </Button>
                            ) : (
                                <div className='tax-selector'>
                                    <span className="total-label">Tax:</span>
                                    <select
                                        value={selectedTaxRate}
                                        onChange={(e) => setSelectedTaxRate(Number(e.target.value))}
                                        className='tax-select'
                                    >
                                        {taxOptions.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                        {selectedTaxRate > 0 && (
                            <div className='total-row'>
                                <span className='total-label'>Tax ({(selectedTaxRate * 100).toFixed(0)}%):</span>
                                <span className='total-value'>${(taxAmount).toFixed(2)}</span>
                            </div>
                        )}
                        <div className='total-row total-final'>
                            <span className='total-label'>Total:</span>
                            <span className='total-value'>${total.toFixed(2)}</span>

                        </div>
                    </div>
                </div>
                <div>
                    <Button
                        className='create-button'>
                        Create
                    </Button>
                </div>
                {showModal && (
                    <Modal>
                        <div className='modal-form'>
                            <h3 className='h3'>Add a new row</h3>
                            <label>
                                Quantity:
                                <Input
                                    type='number'
                                    value={newRow.quantity}
                                    onChange={(e) => setNewRow({ ...newRow, quantity: Number(e.target.value) })}
                                />
                            </label>
                            <label>
                                Item:
                                <Input
                                    type="text"
                                    value={newRow.item}
                                    onChange={(e) => setNewRow({ ...newRow, item: e.target.value })}
                                />
                            </label>
                            <label>
                                Price:
                                <Input
                                    type='number'
                                    value={newRow.price}
                                    onChange={(e) => setNewRow({ ...newRow, price: Number(e.target.value) })}
                                />
                            </label>

                            <div className='modal-buttons'>
                                <Button
                                    className='button'
                                    onClick={() => {
                                        const newId = data.length + 1;
                                        const newEntry = {
                                            id: newId,
                                            quantity: newRow.quantity,
                                            item: newRow.item,
                                            price: newRow.price,
                                            amount: newRow.quantity * newRow.price
                                        };
                                        setData([...data, newEntry]);
                                        setNewRow({ quantity: 0, item: '', price: 0 });
                                        setShowModal(false);
                                    }}>
                                    Confirm
                                </Button>
                                <Button
                                    className='button'
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        </div>
    )
}
