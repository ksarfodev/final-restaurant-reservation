import React, { useEffect, useState } from "react";
import {
  unassignTable,
  listTables,
  listReservations,
} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function TablesList({ tables, setTables, setReservations, date }) {

  //detect size of device being used
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const [error, setError] = useState(null);
  const message =
    "Is this table ready to seat new guests? This cannot be undone.";

  const finishHandler = async (table_id, reservation_id, event) => {
    const abortController = new AbortController();
    try {
      event.preventDefault();
      if (window.confirm(message)) {
        //make API call
        await unassignTable(table_id);

        let update = await listTables();
        setTables(update);

        let resUpdate = await listReservations(
          { date },
          abortController.signal
        );

        setReservations(resUpdate);
      }
    } catch (error) {
      if (error.name === "AbortError") {
        // Ignore `AbortError`
        console.log("Aborted", date);
      } else {
        setError(error);
        //throw error;
      }
    }
  };

//use a table on larger devices
  const rows = tables.map(
    ({ table_name, capacity, table_id, reservation_id }) => (
      <tr key={table_id}>
        <td>{table_name}</td>
        <td>{capacity}</td>
        <td data-table-id-status={`${table_id}`}>
          {!reservation_id ? "free" : "occupied"}
        </td>
        <td>
          {reservation_id && (
            <button
              onClick={(event) =>
                finishHandler(table_id, reservation_id, event)
              }
              data-table-id-finish={table_id}
              className="btn btn-custom-color"
            >
              Finish
            </button>
          )}
        </td>
      </tr>
    )
  );

  //use an unordered list on smaller devices
  const lines = tables.map(
    ({ table_name, capacity, table_id, reservation_id }) => (
      <li key={table_id} className="list-group-item">
        <div className="row">
          <div className="col">
            <span className="badge badge-primary badge-pill">{capacity}</span>
            <div>Table name: {table_name}</div>
            Capacity: {capacity}
            <div data-table-id-status={`${table_id}`}>
              Status: {!reservation_id ? "free" : "occupied"}
            </div>
          </div>
          <div className="col d-flex align-items-center justify-content-end ">
            {reservation_id && (
              <button
                onClick={(event) =>
                  finishHandler(table_id, reservation_id, event)
                }
                data-table-id-finish={table_id}
                className="btn btn-custom-color "
              >
                Finish
              </button>
            )}
          </div>
        </div>
      </li>
    )
  );

  //larger devices use a table
  if (windowSize[0] > 767) {
    return (
      <>
        <ErrorAlert error={error} />
        <div className=" m-4 card card-body bg-white ">
          <table className="table table-responsive-sm">
            <thead>
              <tr>
                <th scope="col">Table Name</th>
                <th scope="col">Capacity</th>
                <th scope="col">Status</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        </div>
      </>
    );
  } else {
    //smaller devices use a list
    return (
      <>
        <div className="m-4 card  bg-white ">
          <ul className="list-group">{lines}</ul>
        </div>
      </>
    );
  }
}

export default TablesList;
