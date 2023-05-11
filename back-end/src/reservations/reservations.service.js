const knex = require("../db/connection");

function create(newReservation) {
  return knex("reservations")
    .insert(newReservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function list(reservation_date) {
  //filter by date
  if (reservation_date) {
    return knex("reservations as r")
      .select("*")
      .where({ "r.reservation_date": reservation_date })
      .whereNot({ "r.status": "finished" })
      .orderBy("reservation_time", "asc");
  } else {
    return knex("reservations as r")
      .select("*")
      .orderBy("reservation_time", "asc");
  }
}

function listByNumber(mobile_number) {
  return knex("reservations as r")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

async function update(updatedRes) {
  return await knex.transaction(async (trx) => {
    await trx("reservations")
      .where({ reservation_id: updatedRes.reservation_id })
      .update({ status: updatedRes.status });
  });
}

async function updateRes(updatedRes) {
  return await knex.transaction(async (trx) => {
    await trx("reservations")
      .where({ reservation_id: updatedRes.reservation_id })
      .update(updatedRes, "*");
  });
}

function read(reservation_id) {
  //read by id
  return knex("reservations as r")
    .select("*")
    .where({ "r.reservation_id": reservation_id })
    .first();
}

module.exports = {
  create,
  read,
  list,
  listByNumber,
  update,
  updateRes,
};
