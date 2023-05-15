import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { readReservation, updateReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";
import ErrorAlert from "../layout/ErrorAlert";


function EditReservation() {
  const [error, setError] = useState(null);

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
      setError(null);

      //the party size should be of type number
      formData.people = Number(formData.people);

      let dateTime = `${formData.reservation_date} ${formData.reservation_time}`
      formData.dateTimeUtc = new Date(dateTime).toUTCString();

      //make API call
      await updateReservation(formData, abortController.signal);

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
