import { useState } from "react";

import { Input } from "../../atoms/Input";

import type { Address } from "../../../services/SendInvoice/Invoice/AddressClient";

export type AddressFormFields = Omit<Address, 'id' | 'createdAt' | 'updatedAt'>;

export type AddressFormProps = {
  address?: Address | AddressFormFields;
  onChange: (address: AddressFormFields) => void;
}

export default function AddressForm({ address: initialValues, onChange }: AddressFormProps) {
  const [address, setAddress] = useState<AddressFormFields>({
    streetAddress1: initialValues?.streetAddress1 || "",
    streetAddress2: initialValues?.streetAddress2 || "",
    city: initialValues?.city || "",
    cityArea: initialValues?.cityArea || "",
    postalCode: initialValues?.postalCode || "",
    country: initialValues?.country || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const nextAddress = {
      ...address,
      [name]: value,
    };

    setAddress(nextAddress);
    onChange(nextAddress);
  }

  return (
    <>
      <Input
        type="text"
        name="streetAddress1"
        value={address.streetAddress1}
        onChange={handleInputChange}
        placeholder="Street Address 1"
      />
      <Input
        type="text"
        name="streetAddress2"
        value={address.streetAddress2}
        onChange={handleInputChange}
        placeholder="Street Address 2"
      />
      <Input
        type="text"
        name="city"
        value={address.city}
        onChange={handleInputChange}
        placeholder="City"
      />
      <Input
        type="text"
        name="cityArea"
        value={address.cityArea}
        onChange={handleInputChange}
        placeholder="City Area"
      />
      <Input
        type="text"
        name="postalCode"
        value={address.postalCode}
        onChange={handleInputChange}
        placeholder="Postal Code"
      />
      <Input
        type="text"
        name="country"
        value={address.country}
        onChange={handleInputChange}
        placeholder="Country"
      />
    </>
  );
}
