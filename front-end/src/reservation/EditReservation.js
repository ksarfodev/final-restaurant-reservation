import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { readReservation, updateReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";
import ErrorAlert from "../layout/ErrorAlert";
import { today } from "../utils/date-time";

function EditReservation() {
  const [error, setError] = useState(null);
  const [dayError, setDayError] = useState(null);
  const [pastDateError, setPastDateError] = useState(null);
  const [wrongTimeError, setWrongTimeError] = useState(null);
  const [earlierTimeError, setEarlierTimeError] = useState(null);

  const history = useHistory();
  const { reservation_id } = useParams();

  const [formData, setFormData] = useState({});

  useEffect(async () => {
    const abortController = new AbortController();

    async function loadReservation() {
      try {
        let result = await readReservation(
          { reservation_id },
          abortController.signal
        );

        if (result.status !== "booked") {
          setResResults('Only reservations with a status of "booked" can be edited.');
        }
        setFormData(result);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Aborted", reservation_id);
        } else {
          throw error;
        }
      }
    }

    loadReservation();

    return () => {
      console.log("cleanup", reservation_id);
      abortController.abort(); 
    };
  }, []);

  const [resResults, setResResults] = useState("");

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

      //1 represents Tuesday
      if (day === 1) {
        setDayError(new Error("The restaurant is closed on Tuesdays."));
        return;
      }
      // validate selected day
      if (date < new Date(today())) {
        setPastDateError(new Error("Please select a current or future date."));
        return;
      }
      //validate time

      let reservationTimeDate = new Date(
        `${formData.reservation_date}, ${formData.reservation_time}`
      );

      let resTime = formData.reservation_time;
      let tenThirtyAMLimit = new Date("2023-4-28, 10:30"); //no reservations can be made before 10:30 am
      let nineThirtyPMLimit = new Date("2023-4-28, 21:30"); //no reservations can be made after 9:30 pm
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

      //the party size should be of type number
      formData.people = Number(formData.people);

      //make API call
      await updateReservation(formData, abortController.signal);

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

  //process form data per user input
  const handleChange = ({ target }) => {
    const value = target.value;
    setFormData({
      ...formData,
      [target.name]: value,
    });
  };

  if (formData && formData.status === "booked") {
    return (
      <>
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
  } else if(resResults !== "") {
    return (
      <div className="card card-body">
        <div className="p-4 m-4 display-4 ">
         {resResults}
        </div>
        <div>
          <button
            onClick={handleCancel}
            type="cancel"
            className="mr-2 btn btn-secondary float-right"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }else{
    return null;
  }
}

export default EditReservation;
