"use strict";

const {
  db,
  models: { User, Event },
} = require("../server/db");

const users = [
  {
    username: "Mehron",
    password: "123",
    longitude: -77.1618725,
    latitude: 38.8125889,
  },

  {
    username: "Sean",
    password: "123",
    longitude: -77.1618725,
    latitude: 38.8235889,
  },

  {
    username: "Steven",
    password: "123",
    longitude: -77.18318725,
    latitude: 38.8125889,
  },

  {
    username: "Alex",
    password: "123",
    longitude: -77.1828725,
    latitude: 38.8125889,
  },
];

const events = [
  {
    name: "Fun Event",
    location: "Iowa",
  },
  {
    name: "Super Fun Event",
    location: "Virginia",
  },
  {
    name: "Soccer Game",
    location: "New York",
  },
  {
    name: "Yugioh YCS",
    location: "Vegas",
  },
  {
    name: "Football Game",
    location: "New England",
  },
  {
    name: "Marathon",
    location: "Boston",
  },
];

const messages = [];

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
async function seed() {
  await db.sync({ force: true }); // clears db and matches models to tables
  console.log("db synced!");

  // Creating Users
  await Promise.all(
    users.map((user) => {
      return User.create(user);
    }),

    events.map((event) => {
      return Event.create(event);
    })
  );

  const allUsers = await User.findAll();
  const singleUser = await User.findByPk(1);
  const secondUser = await User.findByPk(2);

  await singleUser.addFriend(allUsers);
  await secondUser.addAddresseeId(allUsers, {
    through: { specifierId: secondUser.id },
  });

  console.log(`seeded successfully`);
}

/*
 We've separated the `seed` function from the `runSeed` function.
 This way we can isolate the error handling and exit trapping.
 The `seed` function is concerned only with modifying the database.
*/
async function runSeed() {
  console.log("seeding...");
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log("closing db connection");
    await db.close();
    console.log("db connection closed");
  }
}

/*
  Execute the `seed` function, IF we ran this module directly (`node seed`).
  `Async` functions always return a promise, so we can use `catch` to handle
  any errors that might occur inside of `seed`.
*/
if (module === require.main) {
  runSeed();
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
