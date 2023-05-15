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
  };
  const [formData, setFormData] = useState({ ...initialFormState });

  const history = useHistory();

  //   //api call to create a new deck based on form data
  const handleSubmit = async (event) => {
    const abortController = new AbortController();
    try {
      event.preventDefault();

      setError(null);

      formData.people = Number(formData.people);

      // const re = /^\\b([01]?[0-9]|2[0-3]):([0-5][0-9])(?::([0-9][0-9]))?\\b$/;
      // // let re = new RegExp('\b([01]?[0-9]|2[0-3]):([0-5][0-9])(?::([0-9][0-9]))?\b');
      
    //  formData.utcDateTimeString = new Date(`${formData.reservation_date} ${formData.reservation_time}`).toUTCString();

      // var result= String(utcTime.getUTCHours()).padStart(2, '0') + ':'+ 
      // String(utcTime.getUTCMinutes()).padStart(2, '0')  +':'+ 
      // String(utcTime.getUTCSeconds()).padStart(2,'0');


      // formData.reservation_time = result


      //make API call
      await createReservation(formData, abortController.signal);

      console.log(formData.reservation_date, formData.reservation_time);

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
