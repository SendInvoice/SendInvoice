import { useEffect, useMemo, useState } from "react";

import { FaPlus } from "react-icons/fa";
import { Button } from "../../../components/atoms/Button";
import { Form } from "../../../components/atoms/Form";
import { Input } from "../../../components/atoms/Input";

import "./newRecipients.css";
import { Modal } from "../../../components/atoms/Modal";
import { SendInvoiceClient } from "../../../services/SendInvoice";
import Navbar from "../../../components/molecules/Navbar";

export default function NewRecipients() {
  const [message, setMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);

  const [name, setName] = useState(
    () => localStorage.getItem("recipient_name") || "",
  );
  const [phone, setPhone] = useState(
    () => localStorage.getItem("recipient_phone") || "",
  );
  const [email, setEmail] = useState(
    () => localStorage.getItem("recipient_email") || "",
  );
  const [address, setAddress] = useState({
    streetAddress1: "",
    streetAddress2: "",
    city: "",
    cityArea: "",
    postalCode: "",
    country: "",
  });

  const createRecipient = async () => {
    try {
      // setLoading(true);
      setMessage(null);
      const sendInvoiceClient = new SendInvoiceClient(new URL("http://127.0.0.1:8080"));
      const newAddress = await sendInvoiceClient.address.createAddress(address);
      const recipient = await sendInvoiceClient.recipient.createRecipient({
        addressId: newAddress.id,
        recipientName: name,
        phone,
        email,
      });

      setShowModal(false);
      localStorage.clear();
    } catch (err) {
      // setError(err.toString());
    } finally {
      // setLoading(false);
    }
  };

  const canGoToNextStep = name.trim() !== "" && phone.trim() !== "" && email.trim() !== "";
  const goToNextStep = () => {
    if (!canGoToNextStep) {
      setMessage("Please fill in Name, Phone and Email first");
      return;
    }
    setMessage(null);
    setStep(2);
  };

  const isSubmitEnable = useMemo(() => {
    return (
      address.streetAddress1 &&
      address.streetAddress2 &&
      address.city &&
      address.postalCode &&
      address.country
    );
  }, [
    address.streetAddress1,
    address.streetAddress2,
    address.city,
    address.postalCode,
    address.country,
  ]);

  useEffect(() => {
    localStorage.setItem("recipient_name", name);
  }, [name]);

  useEffect(() => {
    localStorage.setItem("recipient_phone", phone);
  }, [phone]);

    useEffect(() => {
    localStorage.setItem("recipient_email", email);
  }, [email]);

  return (
    <div>
      <Navbar />
      <h2 className="h2">
        <FaPlus /> Add a new Recipient
      </h2>
      <Form>
        {step === 1 && (
          <>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />
            <Input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
            />
            <Input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            {message && <p className="error-message">{message}</p>}
            <Button
              className="button_form"
              type="button"
              onClick={goToNextStep}
              disabled={!canGoToNextStep}
            >
              Next
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <label>Address</label>
            <Input
              type="text"
              value={address.streetAddress1}
              onChange={(e) =>
                setAddress({ ...address, streetAddress1: e.target.value })
              }
              placeholder="Street Address 1"
            />

            <Input
              type="text"
              value={address.streetAddress2}
              onChange={(e) =>
                setAddress({ ...address, streetAddress2: e.target.value })
              }
              placeholder="Street Address 2"
            />
            <Input
              type="text"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              placeholder="City"
            />
            <Input
              type="text"
              value={address.cityArea}
              onChange={(e) =>
                setAddress({ ...address, cityArea: e.target.value })
              }
              placeholder="City Area"
            />
            <Input
              type="text"
              value={address.postalCode}
              onChange={(e) =>
                setAddress({ ...address, postalCode: e.target.value })
              }
              placeholder="Postal Code"
            />
            <Input
              type="text"
              value={address.country}
              onChange={(e) =>
                setAddress({ ...address, country: e.target.value })
              }
              placeholder="Country"
            />
            {message && <p className="error-message">{message}</p>}
            <div className="div-button_form">
              <Button onClick={() => setStep(1)} className="button_form">
                Preview
              </Button>

              <Button
                className="button_form"
                onClick={() => setShowModal(true)}
                disabled={!isSubmitEnable}
              >
                Create New Recipient
              </Button>
            </div>
          </>
        )}
      </Form>
      {showModal && (
        <Modal>
          <h3>Confirm Recipient Information</h3>
          <p>
            <strong>Name:</strong> {name}
          </p>
          <p>
            <strong>Phone:</strong> {phone}
          </p>
          <p>
            <strong>Email:</strong> {email}
          </p>
          <p>
            <strong>Street Address 1:</strong> {address.streetAddress1}
          </p>
          <p>
            <strong>Street Address 2:</strong> {address.streetAddress2}
          </p>
          <p>
            <strong>City:</strong> {address.city}
          </p>
          <p>
            <strong>City Area:</strong> {address.cityArea}
          </p>
          <p>
            <strong>Postal Code:</strong> {address.postalCode}
          </p>
          <p>
            <strong>Country:</strong> {address.country}
          </p>

          <div className="div-button_form">
            <Button onClick={() => setShowModal(false)} className="button_form">
              Cancel
            </Button>

            <Button onClick={createRecipient} className="button_form">
              Confirm
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
