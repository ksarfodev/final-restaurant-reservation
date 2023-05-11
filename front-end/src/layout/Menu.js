import React from "react";

import { Link } from "react-router-dom";

/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

function Menu() {
  return (
    <nav className="navbar navbar-expand-md navbar-dark ">
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarTogglerDemo01"
        aria-controls="navbarTogglerDemo01"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
        <Link className="navbar-brand" to="/">
          Periodic Tables
        </Link>
        <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
          <li className="nav-item active">
            <Link className="nav-link" to="/dashboard">
              Dashboard <span className="sr-only">(current)</span>
            </Link>
          </li>

          <li className="nav-item active">
            <Link className="nav-link" to="/search">
              Search
            </Link>
          </li>
          <li className="nav-item active">
            <Link className="nav-link" to="/reservations/new">
              New Reservation
            </Link>
          </li>
          <li className="nav-item active">
            <Link className="nav-link" to="/tables/new">
              New Table
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}


export default Menu;
