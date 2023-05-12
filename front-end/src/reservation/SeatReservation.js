import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

import { listTables, readReservation, assignTable } from "../utils/api";

function SeatReservation() {
  const initialFormState = {
    table_id: "",
    reservation_id: "",
  };

  const [formData, setFormData] = useState({ ...initialFormState });

  const [error, setError] = useState(null);

  const { reservation_id } = useParams();
  const history = useHistory();

  const [tables, setTables] = useState([]);
  const [reservation, setReservation] = useState([]);


  useEffect(() => {
    loadDashboard();
  }, []);

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  function loadDashboard() {
    const abortController = new AbortController();
    listTables(abortController.signal).then(setTables).catch(setError);

    //make API call
    readReservation({ reservation_id }, abortController.signal)
      .then(setReservation)
      .catch(setError);

    return () => abortController.abort();
  }

  const handleSubmit = async (event) => {
    const abortController = new AbortController();
    try {
      event.preventDefault();
      setError(null);

      let selectedTable = tables.find(
        (table) => table.table_id === Number(formData.table_id)
      );

      if (
        reservation.people <= selectedTable.capacity &&
        !selectedTable.reservation_id
      ) {
        formData.reservation_id = reservation.reservation_id;
        //make API call
        await assignTable(formData, abortController.signal);
      } else {
        setError(new Error("Sorry, there isn't enough room at this table."));
        return;
      }

      history.push(`/dashboard`);
      
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Aborted", formData);
      } else {
        setError(error);
      }
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
    history.goBack();
  };

  const rows = tables.map((table) => (
    <option key={table.table_id} value={table.table_id}>
      {table.table_name} - {table.capacity}
    </option>
  ));
  return (
    <>
      <h2 className="ml-4">Seat Reservation</h2>
      <ErrorAlert className="alert alert-danger" error={error} />

      <div className="">
        <form className="bg-white m-4 p-3 " onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-group mb-3">
              <div className="input-group"></div>
              <select
                onChange={handleChange}
                value={formData.table_id}
                name="table_id"
                required={true}
                className="custom-select"
                id="inputGroupSelect01"
              >
                <option value="">Choose a table...</option>
                {rows}
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary float-right">
            Submit
          </button>
          <button
            onClick={handleCancel}
            type="cancel"
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </form>
      </div>
    </>
  );
}

export default SeatReservation;
