import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { setReservationStatus } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function ReservationList({ reservations }) {

  //detect if smaller devices are being used
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
  const history = useHistory();
  const message =
    "Do you want to cancel this reservation? This cannot be undone.";

  const handleClick = async (reservation_id, event) => {
    const abortController = new AbortController();
    try {
      event.preventDefault();

      if (window.confirm(message)) {
        // API call sets the reservation status to cancelled,
        //and the results on the page are refreshed.
        await setReservationStatus(
          { reservation_id, status: "cancelled" },
          abortController.signal
        );

        history.go(0);
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Aborted", reservation_id);
      } else {
        setError(error);
      }
    }
  };

//use an table for larger devices
  const rows = reservations.map(
    ({ first_name, last_name, reservation_time, reservation_id, status }) => (
      <tr key={reservation_id}>
        <td>{first_name}</td>
        <td>{last_name}</td>
        <td>{reservation_time}</td>
        <td>
          {status === "booked" && (
            <a className="button" href={`/reservations/${reservation_id}/seat`}>
              Seat
            </a>
          )}
        </td>
        <td>
          <div data-reservation-id-status={reservation_id}>{status}</div>
        </td>
        <td>
          <a href={`/reservations/${reservation_id}/edit`}>Edit</a>
        </td>
        <td>
          {status !== "cancelled" && (
            <button
              className="btn btn-danger"
              data-reservation-id-cancel={reservation_id}
              onClick={(event) => handleClick(reservation_id, event)}
            >
              Cancel
            </button>
          )}
        </td>
      </tr>
    )
  );
//use an unordered list for smaller devices
  const lines = reservations.map(
    ({ first_name, last_name, reservation_time, reservation_id, status }) => (
      <li key={reservation_id} className="list-group-item">
        <div className="row">
          <div className="col">
            {first_name} {last_name}
            <div>{reservation_time}</div>
          </div>
          <div className="col ">
            <div>
              {status === "booked" && (
                <a
                  className="button"
                  href={`/reservations/${reservation_id}/seat`}
                >
                  Seat
                </a>
              )}
            </div>
            <div data-reservation-id-status={reservation_id}>
              Status: {status}
            </div>
            <a href={`/reservations/${reservation_id}/edit`}>Edit</a>
            </div>
            <div className="col d-flex align-items-center justify-content-end ">
            <div>
              {status !== "cancelled" && (
                <button
                  className="btn btn-danger float-right"
                  data-reservation-id-cancel={reservation_id}
                  onClick={(event) => handleClick(reservation_id, event)}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
          </div>
      </li>
    )
  );

  //display a table on tablets and desktop
  if (windowSize[0] > 767) {
    return (
      <>
        <ErrorAlert error={error} />
        <div className="m-4 card card-body bg-white">
          <table className="table table-hover table-responsive-sm">
            <thead>
              <tr>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Time</th>
                <th scope="col">Seat</th>
                <th scope="col">Status</th>
                <th scope="col"></th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        </div>
      </>
    );
  } else {
      //display a list on smaller devices
    return (
      <>
        <div className="m-4 card  bg-white ">
          <ul className="list-group">{lines}</ul>
        </div>
      </>
    );
  }
}


export default ReservationList;
