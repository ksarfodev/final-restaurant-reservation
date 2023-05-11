import React from "react";
import { Link, useLocation } from "react-router-dom";
import { today, previous, next } from "../utils/date-time";

function NavigationButtons(){
    const { search } = useLocation();
    const query = React.useMemo(() => new URLSearchParams(search), [search]);
  
    return(
    <>
<nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center mt-3">
          <li className="page-item">
            <Link
              className="page-link text-secondary"
              tabIndex="-1"
              to={`/dashboard?date=${previous(query.get("date") || today())}`}
            >
              Previous
            </Link>
          </li>
          <li className="page-item">
            <Link
              className="page-link text-secondary"
              tabIndex="0"
              to={`/dashboard?date=${today()}`}
            >
              Today
            </Link>
          </li>
          <li className="page-item">
            <Link
              className="page-link text-secondary"
              tabIndex="1"
              to={`/dashboard?date=${next(query.get("date") || today())}`}
            >
              Next
            </Link>
          </li>
        </ul>
      </nav>
    </>
    );
}

export default NavigationButtons;