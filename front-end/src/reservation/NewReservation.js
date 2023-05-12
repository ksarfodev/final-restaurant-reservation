import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation } from "../utils/api";
import { today } from "../utils/date-time";
import ReservationForm from "./ReservationForm";

//route:"/reservations/new"
function NewReservation() {
  const [error, setError] = useState(null);
  const [dayError, setDayError] = useState(null);
  const [pastDateError, setPastDateError] = useState(null);
  const [wrongTimeError, setWrongTimeError] = useState(null);
  const [earlierTimeError, setEarlierTimeError] = useState(null);

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

      setEarlierTimeError(null);
      setWrongTimeError(null);
      setPastDateError(null);
      setDayError(null);
      setError(null);

      //validations
      let date = new Date(formData.reservation_date);
      let day = date.getDay();

      if (!date) {
        setDayError(new Error("The restaurant is closed on Tuesdays."));
      }

      if (day === 1) {
        setDayError(new Error("The restaurant is closed on Tuesdays."));
        return;
      }

      if (date < new Date(today())) {
        setPastDateError(new Error("Please select a current or future date."));
        return;
      }

      let reservationTimeDate = new Date(
        `${formData.reservation_date}, ${formData.reservation_time}`
      );

      let resTime = formData.reservation_time;
      let tenThirtyAMLimit = new Date("2023-4-28, 10:30");
      let nineThirtyPMLimit = new Date("2023-4-28, 21:30");
      let resTimeOnly = new Date(`2023-4-28, ${resTime}`);

      if (resTimeOnly > nineThirtyPMLimit || resTimeOnly < tenThirtyAMLimit) {
        setWrongTimeError(
          new Error("No reservations can be made at this time.")
        );
        return;
      }

      if (reservationTimeDate.getTime() < Date.now()) {
        setEarlierTimeError(
          new Error(
            "Sorry, reservations prior to the current time are not allowed."
          )
        );
        return;
      }

      formData.people = Number(formData.people);

      //make API call
      await createReservation(formData, abortController.signal);

      history.push(`/dashboard/?date=${formData.reservation_date}`);
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Aborted", formData);
      } else {
        setError(error);
        throw error;
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
      <ErrorAlert error={error} />
      <ErrorAlert className="alert alert-danger" error={dayError} />
      <ErrorAlert className="alert alert-danger" error={pastDateError} />
      <ErrorAlert className="alert alert-danger" error={wrongTimeError} />
      <ErrorAlert className="alert alert-danger" error={earlierTimeError} />
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
