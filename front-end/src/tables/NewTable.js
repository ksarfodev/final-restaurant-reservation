import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";

function NewTable() {
  const [error, setError] = useState(null);

  const initialFormState = {
    table_name: "",
    capacity: 0,
  };
  const [formData, setFormData] = useState({ ...initialFormState });

  const history = useHistory();

  const handleChange = ({ target }) => {
    const value = target.value;
    setFormData({
      ...formData,
      [target.name]: value,
    });
  };

  const handleSubmit = async (event) => {
    const abortController = new AbortController();
    try {
      event.preventDefault();
      setError(null);

      if (!formData.capacity || !formData.table_name) {
        setError(
          new Error("There's an issue with the capacity or table name.")
        );
        return;
      }

      formData.capacity = Number(formData.capacity);

      //make API call
      await createTable(formData, abortController.signal);

      history.push(`/dashboard`);
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
  return (
    <>
    <h2 className="m-4">New Table</h2>
      <ErrorAlert error={error} />
      <form className="m-3 bg-white p-3" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="table_name">Table Name</label>
          <input
            name="table_name"
            onChange={handleChange}
            value={formData.table_name}
            placeholder=""
            type="text"
            className="form-control"
            id="table_name"
            required={true}
            minLength="2"
          />
        </div>

        <div className="form-group">
          <label htmlFor="capacity">Capacity</label>
          <input
            name="capacity"
            onChange={handleChange}
            value={formData.capacity}
            placeholder="1"
            type="number"
            className="form-control"
            id="capacity"
            required={true}
            min="1"
          />
        </div>

        <button
          onClick={handleCancel}
          type="cancel"
          className="mr-2 btn btn-danger"
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-custom-color float-right">
          Submit
        </button>
      </form>
    </>
  );
}

export default NewTable;
