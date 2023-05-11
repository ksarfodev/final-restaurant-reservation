const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationService = require("./reservations.service");

//validations
async function reservationExists(req, res, next) {
  let reservation = {};
  if (req.params.reservation_date) {
    reservation = await reservationService.list(req.params.reservation_date);
  } else {
    reservation = await reservationService.read(req.params.reservation_id);
  }

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation cannot be found for ${req.params.reservation_id}.`,
  });
}

function validPartySize(req, res, next) {
  const people = req.body.data.people;
  if (typeof people === "number" && people > 0) {
    return next();
  }
  next({
    status: 400,
    message: "Number of people in the party must be a number greater than 0",
  });
}

function validTime(req, res, next) {
  let str = req.body.data.reservation_time;

  regexp = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/;

  if (regexp.test(str)) {
    return next();
  }
  next({
    status: 400,
    message: `The reservation_time must be an valid ${str}`,
  });
}

function validDate(req, res, next) {
  const dateString = req.body.data.reservation_date;
  let timestamp = Date.parse(dateString);

  if (!isNaN(timestamp)) {
    return next();
  }
  next({
    status: 400,
    message: `The reservation_date must be today's date or a future date`,
  });
}

function isDateInPast(req, res, next) {
  let reservationDate = new Date(req.body.data.reservation_date);
  let tempDate = new Date();
  let yesterday = new Date(
    tempDate.setDate(new Date(Date.now()).getDate() - 1)
  );

  if (reservationDate > yesterday) {
    return next();
  }
  next({
    status: 400,
    message: `The reservation_date must be today's date or a future date`,
  });
}

function isRestaurantOpened(req, res, next) {
  let reservationDate = new Date(req.body.data.reservation_date);
  let dayOfWeek = reservationDate.getDay();

  if (dayOfWeek !== 1) {
    return next();
  }
  next({
    status: 400,
    message: `The restaurent is closed on this day`,
  });
}

function isNotPastTime(req, res, next) {
  let reservationTimeDate = new Date(
    `${req.body.data.reservation_date}, ${req.body.data.reservation_time}`
  );

  if (reservationTimeDate.getTime() < Date.now()) {
    return next({
      status: 400,
      message: "Sorry, reservations prior to the current time are not allowed.",
    });
  }
  next();
}

function isNotTooEarlyOrLate(req, res, next) {
  let resTime = req.body.data.reservation_time;

  let tenThirtyAMLimit = new Date("2023-4-28, 10:30");
  let nineThirtyPMLimit = new Date("2023-4-28, 21:30");
  let resTimeOnly = new Date(`2023-4-28, ${resTime}`);

  if (resTimeOnly > nineThirtyPMLimit || resTimeOnly < tenThirtyAMLimit) {
    return next({
      status: 400,
      message: "No reservations can be made at this time.",
    });
  }
  next();
}

function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;

    if (data[propertyName]) {
      return next();
    }
    next({ status: 400, message: `Must include a ${propertyName}` });
  };
}

function unknownStatus(req, res, next) {
  let status = req.body.data.status;

  let validStatusArr = ["seated", "booked", "finished", "cancelled"];

  if (validStatusArr.includes(status)) {
    return next();
  }
  next({
    status: 400,
    message: `${status} is an unknown status`,
  });
}

/**
 * List handler for reservation resources
 */
//get all reservations unless date is specified
async function list(req, res) {
  let data = {};
  const date = req.query.date;
  if (date) {
    data = await reservationService.list(date);
  }

  const number = req.query.mobile_number;

  if (number) {
    data = await reservationService.listByNumber(number);
  }

  res.json({ data });
}
//create by POST
async function create(req, res, next) {
  const {
    data: {
      first_name,
      last_name,
      mobile_number,
      reservation_date,
      reservation_time,
      people,
    } = {},
  } = req.body;

  const newReservation = {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  };

  let status = req.body.data.status;
  let invalidStatus = ["seated", "finished"];
  if (!invalidStatus.includes(status)) {
    const data = await reservationService.create(newReservation);

    return res.status(201).json({ data });
  }

  next({
    status: 400,
    message: `${status} not a valid status.`,
  });
}

//read by id using GET
function read(req, res) {
  const data = res.locals.reservation;
  res.json({ data });
}

async function update(req, res, next) {
  const updatedReservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
    status: req.body.data.status,
  };

  const currentStatus = res.locals.reservation.status;

  if (currentStatus !== "finished") {

    await reservationService.update(updatedReservation);

    //get update
    const data = await reservationService.read(
      updatedReservation.reservation_id
    );
    return res.json({ data });
  }

  next({
    status: 400,
    message: `${updatedReservation.status} finished not a valid status.`,
  });
}

async function updateReservation(req, res, next) {
  const updatedReservation = {
    ...req.body.data,
  };

  const currentStatus = res.locals.reservation.status;

  if (currentStatus !== "finished") {

    await reservationService.updateRes(updatedReservation);
    //get update
    const data = await reservationService.read(
      res.locals.reservation.reservation_id
    );
    return res.json({ data });
  }

  next({
    status: 400,
    message: `${updatedReservation.status} finished not a valid status.`,
  });
}

module.exports = {
  read: [asyncErrorBoundary(reservationExists), read],
  list: asyncErrorBoundary(list),
  create: [
    bodyDataHas("first_name"),
    bodyDataHas("last_name"),
    bodyDataHas("mobile_number"),
    bodyDataHas("reservation_date"),
    bodyDataHas("reservation_time"),
    validDate,
    validTime,
    validPartySize,
    isRestaurantOpened,
    isDateInPast,
    isNotPastTime,
    isNotTooEarlyOrLate,

    asyncErrorBoundary(create),
  ],
  update: [
    bodyDataHas("status"),
    asyncErrorBoundary(reservationExists),
    unknownStatus,
    asyncErrorBoundary(update),
  ],

  updateReservation: [
    bodyDataHas("first_name"),
    bodyDataHas("last_name"),
    bodyDataHas("mobile_number"),
    bodyDataHas("reservation_date"),
    bodyDataHas("reservation_time"),
    asyncErrorBoundary(reservationExists),
    validDate,
    validTime,
    validPartySize,
    unknownStatus,
    asyncErrorBoundary(updateReservation),
  ],
};
