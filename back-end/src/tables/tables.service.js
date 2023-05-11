const knex = require("../db/connection");

function create(newTable) {
  return knex("tables")
    .insert(newTable)
    .returning(["table_name", "capacity", "table_id"])
    .then((createdRecords) => createdRecords[0]);
}

function list() {
  return knex("tables").select("*").orderBy("table_name", "asc");
}

function read(table_id) {
  //read by id
  return knex("tables as t")
    .select("*")
    .where({ "t.table_id": table_id })
    .first();
}

async function update(updatedTable) {
  return await knex.transaction(async (trx) => {
    await trx("tables")
      .select("*")
      .where({ table_id: updatedTable.table_id })
      .update(updatedTable, "*");

    await trx("reservations")
      .select("*")
      .where({ reservation_id: updatedTable.reservation_id })
      .update({ status: "seated" });
  });
}

async function destroy(table_id) {
  return await knex.transaction(async (trx) => {
    const result = await trx("tables")
      .select("reservation_id")
      .where({ table_id: table_id });
    const { reservation_id } = result[0];
    await trx("tables").where({ table_id }).update({ reservation_id: null });
    await trx("reservations")
      .where({ reservation_id: reservation_id })
      .update({ status: "finished" });
  });
}

module.exports = {
  create,
  read,
  list,
  update,
  delete: destroy,
};
