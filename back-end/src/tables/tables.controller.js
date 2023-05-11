const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const tableService = require("./tables.service");
const reservationService = require("../reservations/reservations.service");

async function tableExists(req, res, next) {
  let table = {};
  if (req.params.table_id) {
    table = await tableService.read(req.params.table_id);
  }

  if (table) {
    res.locals.table = table;
    return next();
  }
  next({
    status: 404,
    message: `Table cannot be found for ${req.params.table_id}.`,
  });
}

async function reservationCapacity(req, res, next) {
  let reservation = {};
  let table = {};

  if (req.body.data.reservation_id) {
    reservation = await reservationService.read(req.body.data.reservation_id);
  }

  table = res.locals.table;
  if (reservation) {
    res.locals.reservation = reservation;

    //if the people on reservation can fit and the table is not occupied
    if (reservation.people <= table.capacity && table.reservation_id === null) {
      return next();
    }
  }
  next({
    status: 400,
    message: `The table is either at capacity or is occupied reservation_id: ${req.body.data.reservation_id} : Table # ${req.params.table_id}.`,
  });
}

async function reservationIdValid(req, res, next) {
  let reservation = {};

  if (req.body.data.reservation_id) {
    reservation = await reservationService.read(req.body.data.reservation_id);
  }

  if (reservation) {
    return next();
  }

  next({
    status: 404,
    message: `The reservation_id: ${req.body.data.reservation_id} is not valid`,
  });
}

function validCapacity(req, res, next) {
  const capacity = req.body.data.capacity;
  if (typeof capacity === "number") {
    return next();
  }
  next({
    status: 400,
    message: "capacity must be a number",
  });
}
function validTableName(req, res, next) {
  const name = req.body.data.table_name;
  if (name.length > 1) {
    return next();
  }
  next({
    status: 400,
    message: "table_name length must be 2 or more characters",
  });
}

async function alreadySeated(req, res, next) {
  let tables = [];

  tables = await tableService.list();

  let resId = req.body.data.reservation_id;
  let result = tables.find(({ reservation_id }) => reservation_id === resId);

  if (result) {
    return next({
      status: 400,
      message: `Reservation ${resId} is already seated`,
    });
  }
  next();
}

//validation
function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;

    if (data[propertyName]) {
      return next();
    }
    next({ status: 400, message: `Must include a ${propertyName}` });
  };
}

/**
 * List handler for reservation resources
 */
//get all reservations unless date is specified
async function list(req, res) {
  // const date = req.query.date;
  const data = await tableService.list();
  res.json({ data });
}

//create by POST
async function create(req, res) {
  const { data: { table_name, capacity, reservation_id } = {} } = req.body;

  const newTable = {
    table_name,
    capacity,
    reservation_id,
  };

  const data = await tableService.create(newTable);

  res.status(201).json({ data });
}

//read by id using GET
function read(req, res) {
  const data = res.locals.table;
  res.json({ data });
}

async function update(req, res) {
  const updatedTable = {
    ...req.body.data,
    table_id: res.locals.table.table_id,
    reservation_id: req.body.data.reservation_id,
  };

  //perform update with no response
  await tableService.update(updatedTable);

  //get update
  const data = await tableService.read(res.locals.table.table_id);
  res.json({ data });
}

async function destroy(req, res, next) {
  const { table } = res.locals;
  if (table.reservation_id) {
    await tableService.delete(table.table_id);
    return res.status(200).json({});
  }

  next({
    status: 400,
    message: "table is not occupied",
  });
}

module.exports = {
  read: [asyncErrorBoundary(tableExists), read],
  list: asyncErrorBoundary(list),
  create: [
    bodyDataHas("table_name"),
    bodyDataHas("capacity"),
    validTableName,
    validCapacity,
    asyncErrorBoundary(create),
  ],
  update: [
    bodyDataHas("reservation_id"),
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(reservationIdValid),
    asyncErrorBoundary(alreadySeated),
    asyncErrorBoundary(reservationCapacity),
    asyncErrorBoundary(update),
  ],

  delete: [asyncErrorBoundary(tableExists), asyncErrorBoundary(destroy)],
};
