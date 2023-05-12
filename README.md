# Periodic Tables - Restaurant Reservation

**Note**: Node 16.20.0 was used for development

A Full-stack application created with a React.js, Bootstrap and CSS front-end. The API backend uses Node.js, Express and a PostgreSQL database. 

The intended user can visit the website using a mobile device or desktop computer and will be able to view current restaurant reservations that have been made. The number of avalilable tables to seat customers will also be displayed. Additional options are available for managing seating arrangments and existing reservations.


### Live Demo

**Note**: The Edit and Seat buttons currently do not work as intended on the Render deployed instance

The  server and client monorepo is deployed using Render  [demo](https://restaurant-reservation-p6rc.onrender.com/)


## Languages & Frameworks used:

- React.js
- Bootstrap 4.6
- Node.js
- Express.js
- Knex.js
- Elephant SQL

## Features

### Dashboard
The Dashboard displays a navigation  bar with links to the Search page, reservation entry page and table entry page for the current day. The user can use navigation buttons to advance to the next day or select a previous day.

The user can seat arrived guest, access the Edit screen or cancel a reservation from the dashboard. It is also possible to clear or finish a table that is no longer occupied.


![Pasted image 20230511212038.png](https://github.com/ksarfodev/final-restaurant-reservation/blob/main/screenshots/Pasted%20image%2020230511212038.png)

### Search
The Search page allows for searching an existing reservation by phone number. 

![Pasted image 20230511212642.png](https://github.com/ksarfodev/final-restaurant-reservation/blob/main/screenshots/Pasted%20image%2020230511212642.png)


### New Reservation
A new reservation can be created by  populating all the required fields as shown below. 

![Pasted image 20230511212857.png](https://github.com/ksarfodev/final-restaurant-reservation/blob/main/screenshots/Pasted%20image%2020230511212857.png)

#### New Table
A new table can be created by entering the a table name and the number of seats available for that table.

![Pasted image 20230511213550.png](https://github.com/ksarfodev/final-restaurant-reservation/blob/main/screenshots/Pasted%20image%2020230511213550.png)



### Edit Reservation
Reservations can be edited using a form similar to that of the New Reservation page. Only reservations with a status of "booked" can be edited.

### Cancel  Reservation
A Cancel button is displayed only when the reservation status is "booked." The status is then updated on the web page. 

### Assign Table

It is only possible to assign a reservation to a table that is available and can fit the party size.

### Finish Table
A table can be freed up by using the Finish button



### RESTful API 

#### `GET /reservations`
This route will respond with a list of all reservations.


#### `POST /reservations`
This route will allow for the creation of a new reservation

**Example payload**
```
{
    "data":
    {
        "first_name": "first",
        "last_name": "last",
        "mobile_number": "900-555-1212",
        "reservation_date": "2023-5-6",
        "reservation_time": "12:29",
        "people": 2
    }
}
```


#### `GET /reservations/:reservation_id`
Return a single reservation with a matching reservation_id


#### `PUT /reservations/:reservation_id`
Update a specified reservation with a matching reservation_id

**Example payload**
```
{
    "data": {
        "reservation_id": 23,
        "first_name": "John",
        "last_name": "Smith",
        "mobile_number": "5555555555",
        "reservation_date": "2023-05-06T04:00:00.000Z",
        "reservation_time": "10:43:00",
        "people": 1,
        "created_at": "2023-05-06T02:43:29.889Z",
        "updated_at": "2023-05-06T02:43:29.889Z",
        "status": "cancelled"
    }
}
```

#### `GET /reservations/:reservation_id/status`
Return the status of a specified reservation. A valid status is as follows: booked, seated,cancelled or finished

#### `GET /tables`
This route will respond with a list of all tables created in database.


#### `POST /tables`
This route will allow the creation of new tables

**Example payload**
```
{
    "data":{
		"table_name": "#party table",
        "capacity": 99
    }
}
```

#### `GET /tables/:table_id`
Return a single table with a matching table_id

#### `PUT /tables/:table_id/seat`
Allows for seating a reservation at a certain table. The reservation_id value in the 'tables' database table gets updated

**Example payload**
```
{
    "data":{
        "reservation_id":16
    }
}
```


#### DELETE /tables/:table_id/seat`
Delete a table by its id

## Installation

1. Install Node 16.20.0
2. Fork and clone this repository.
3. Run `cp ./back-end/.env.sample ./back-end/.env` or create a .env file as described in the [starter project](https://github.com/Thinkful-Ed/starter-restaurant-reservation).
4. Create a free ElephantSQL instance
5. Update the `./back-end/.env` file with the connection URL's to your ElephantSQL database instance.
6. Run `cp ./front-end/.env.sample ./front-end/.env`.
7. There's no need to make changes to the `./front-end/.env` file unless you want to connect to a backend at a location other than `http://localhost:5001`.
8. Cd into the front-end folder then run `npm install` to install project dependencies.
9. Cd into the back-end folder then run `npm install` to install project dependencies.
10. Run `npm start:dev` to start your server in development mode.
11. Run `npm  start` to start the React app.
12. Success was had with running `npm run test:frontend` and `npm run test:backend` respectively for the end-to-end tests




