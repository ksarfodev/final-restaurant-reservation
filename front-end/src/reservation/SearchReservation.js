import React, { useState } from "react";
import { listReservations } from "../utils/api";
import ReservationList from "./ReservationList";
import ErrorAlert from "../layout/ErrorAlert";

function SearchReservation() {
  const abortController = new AbortController();

  const [error, setError] = useState(null);
  const [resResults, setResResults] = useState("");
  const [reservations, setReservations] = useState([]);

  const initialFormState = {
    mobile_number: "",
  };
  const [customerNumber, setCustomerNumber] = useState({ ...initialFormState });

  const handleClick = async (event) => {
    setResResults("");
    setError(null);
    try {
      event.preventDefault();
      //limit the phone number entry to numbers and dashes 
      const validNumber = /^[0-9-]/;

      if (!validNumber.test(customerNumber.mobile_number)) {
        setError(
          new Error("Please enter a numbers with or without dashes only")
        );
        return;
      }
      //Clicking on the "Find" button will submit a request to the server 
      //(e.g. GET /reservations?mobile_number=800-555-1212).
      if (customerNumber && customerNumber.mobile_number.length > 0) {
        let result = await listReservations(
          { mobile_number: customerNumber.mobile_number },
          abortController.signal
        );

        if (result.length === 0) {
          setResResults("No reservations found");
        }
        setReservations(result);
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Aborted", reservations);
      } else {
        setError(error);
        throw error;
      }
    }
  };

  const handleChange = ({ target }) => {
    const value = target.value;
    setCustomerNumber({
      ...customerNumber,
      [target.name]: value,
    });
  };

  return (
    <>
      <ErrorAlert error={error} />
      <div className="input-group  mb-3 pl-4 pr-4">
        <input
          value={customerNumber.mobile_number}
          onChange={handleChange}
          type="text"
          pattern="[0-9-]+"
          name="mobile_number"
          className="form-control"
          placeholder="Enter a customer's phone number"
          aria-label="Customer's phone number"
          aria-describedby="basic-addon2"
        />
        <div className="input-group-append">
          <button
            onClick={handleClick}
            className="btn text-white btn-outline-secondary"
            type="submit"
          >
            Find
          </button>
        </div>
      </div>
      {reservations && reservations.length > 0 && (
        <ReservationList reservations={reservations} />
      )}
      {resResults !== "" && (
        <div className="card card-body">
          <div className="p-4 m-4 display-4">{resResults}</div>
        </div>
      )}
    </>
  );
}

export default SearchReservation;
