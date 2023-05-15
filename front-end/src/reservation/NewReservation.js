import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";

//route:"/reservations/new"
function NewReservation() {
  const [error, setError] = useState(null);

  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "1",
    dateTimeUtc:""
  };
  const [formData, setFormData] = useState({ ...initialFormState });

  const history = useHistory();

  //api call to create a new deck based on form data
  const handleSubmit = async (event) => {
    const abortController = new AbortController();
    try {
      event.preventDefault();

      setError(null);

      formData.people = Number(formData.people);

      let dateTime = `${formData.reservation_date} ${formData.reservation_time}`
      formData.dateTimeUtc = new Date(dateTime).toUTCString();

      //make API call
      await createReservation(formData, abortController.signal);

      history.push(`/dashboard/?date=${formData.reservation_date}`);
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Aborted", formData);
      } else {
        setError(error);
      }
    }
  };

  //cancel and return to Home screen
  const handleCancel = (event) => {
    event.preventDefault();
    history.goBack();
  };

  const handleChange = ({ target }) => {
    const value = target.value;
    setFormData({
      ...formData,
      [target.name]: value,
    });
  };

  return (
    <>
      <h2 className="m-4">New Reservation</h2>
      <ErrorAlert className="alert alert-danger" error={error} />
      <ReservationForm
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        formData={formData}
        handleCancel={handleCancel}
      />
    </>
  );
}

export default NewReservation;
