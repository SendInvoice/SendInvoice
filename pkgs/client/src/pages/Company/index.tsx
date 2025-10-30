import { useState } from "react";

import { ImageInput } from "../../components/atoms/ImageInput";
import { Input } from "../../components/atoms/Input";
import AddressForm from "../../components/molecules/AddressForm";
import { SendInvoiceClient } from "../../services/SendInvoice";
import { useToken, useUser } from "../../hooks/user";

import type { AddressFormFields } from "../../components/molecules/AddressForm";

import "./Company.css";

export default function Company() {
  const token = useToken();
  const user = useUser();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    logoId: "",
    signatureId: "",
    address: {
      streetAddress1: "",
      streetAddress2: "",
      city: "",
      cityArea: "",
      postalCode: "",
      country: "",
    },
  });

  const handleSubmit = async () => {
    const sendInvoiceClient = new SendInvoiceClient(
      new URL("http://127.0.0.1:8080"),
    );

    const { id: addressId } = await sendInvoiceClient.address.createAddress(form.address);

    await sendInvoiceClient.company.createCompany(token as string, {
      name: form.name,
      phone: form.phone,
      logoId: form.logoId,
      userId: user?.id as string,
      signatureId: form.signatureId,
      addressId: addressId,
    })
  }

  const handleFileChosen = async (name: string, file: File) => {
    const sendInvoiceClient = new SendInvoiceClient(
      new URL("http://127.0.0.1:8080"),
    );
    const { id: imageId } = await sendInvoiceClient.image.uploadImage(
      token as string,
      file,
    );

    setForm((prevForm) => ({
      ...prevForm,
      [name]: imageId,
    }));
  };

  const handleAddressChange = (address: AddressFormFields) => {
    setForm((prevForm) => ({
      ...prevForm,
      address,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

return (
    <div className="company-layout">
      <h1>Create Company</h1>
      
      <div className="company-form-container">
        <div className="company-form-section">
          <h2>Basic Information</h2>
          
          <div className="company-input-group">
            <label htmlFor="name">Company Name</label>
            <Input
              type="text"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              placeholder="Enter company name"
            />
          </div>

          <div className="company-input-group">
            <label htmlFor="phone">Phone Number</label>
            <Input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
            />
          </div>
        </div>

        <div className="company-form-section">
          <h2>Company Address</h2>
          <div className="company-address-section">
            <AddressForm onChange={handleAddressChange} />
          </div>
        </div>

        <div className="company-form-section">
          <h2>Images & Branding</h2>
          <div className="company-images-section">
            <ImageInput
              name="logoId"
              label="Company Logo"
              onFileChosen={handleFileChosen}
            />
            <ImageInput
              name="signatureId"
              label="Signature"
              onFileChosen={handleFileChosen}
            />
          </div>
        </div>

        <div className="company-submit-container">
          <button 
            type="button" 
            className="company-cancel-button"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className="company-submit-button"
            onClick={handleSubmit}
          >
            Create Company
          </button>
        </div>
      </div>
    </div>
  );
}