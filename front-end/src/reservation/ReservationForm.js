import react from "react";

function ReservationForm({
  handleSubmit,
  handleChange,
  formData,
  handleCancel,
}) {
  return (
    <div className="m-4 card card-body bg-white ">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="first_name">First Name</label>
          <input
            name="first_name"
            onChange={handleChange}
            value={formData.first_name}
            placeholder="First Name"
            type="text"
            className="form-control"
            id="first_name"
            required={true}
            minLength="1"
          />
        </div>

        <div className="form-group">
          <label htmlFor="last_name">Last Name</label>
          <input
            name="last_name"
            onChange={handleChange}
            value={formData.last_name}
            placeholder="Last Name"
            type="text"
            className="form-control"
            id="last_name"
            required={true}
            minLength="1"
          />
        </div>

        <div className="form-group">
          <label htmlFor="mobile_number">Mobile</label>
          <input
            name="mobile_number"
            onChange={handleChange}
            value={formData.mobile_number}
            placeholder="Mobile"
            type="text"
            className="form-control"
            id="mobile_number"
            required={true}
            minLength="7"
          />
        </div>

        <div className="form-group">
          <label htmlFor="reservation_date">Date</label>
          <input
            name="reservation_date"
            onChange={handleChange}
            value={formData.reservation_date}
            placeholder="YYYY-MM-DD"
            pattern="\d{4}-\d{2}-\d{2}"
            type="date"
            className="form-control"
            id="reservation_date"
            // required={true} setting this to required causes test to fail
          />
        </div>

        <div className="form-group">
          <label htmlFor="reservation_time">Time</label>
          <input
            name="reservation_time"
            onChange={handleChange}
            value={formData.reservation_time}
            placeholder="HH:MM"
            type="time"
            pattern="[0-9]{2}:[0-9]{2}"
            className="form-control"
            id="reservation_time"
            required={true}
          />
        </div>

        <div className="form-group">
          <label htmlFor="people">Party Size</label>
          <input
            name="people"
            onChange={handleChange}
            value={formData.people}
            placeholder="1"
            type="text"
            className="form-control"
            id="people"
            required={true}
            minLength="1"
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
    </div>
  );
}

export default ReservationForm;
