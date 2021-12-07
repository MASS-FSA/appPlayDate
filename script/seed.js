"use strict";

const {
  db,
  models: { User, Event, Message, Channel },
} = require("../server/db");

const users = [
  {
    username: "Mehron",
    password: "123",
    longitude: -77.1618725,
    latitude: 38.8125889,
    homeLongitude:-77.1618725,
    homeLatitude:38.8125889,
    image: `https://www.awesomeinventions.com/wp-content/uploads/2018/04/photoshop-man-riding-chicken-silly-things-bored-people-do.jpg`,
  },

  {
    username: "Sean",
    password: "123",
    longitude: -77.1618725,
    latitude: 38.8235889,
    homeLongitude: -77.1618725,
    homeLatitude: 38.8235889,
  },

  {
    username: "Steven",
    password: "123",
    longitude: -77.18318725,
    latitude: 38.8125889,
    homeLongitude: -77.18318725,
    homeLatitude: 38.8125889,
  },

  {
    username: "Alex",
    password: "123",
    longitude: -77.1828725,
    latitude: 38.8125889,
    homeLongitude: -77.1828725,
    homeLatitude: 38.8125889,
    image: 'https://ih1.redbubble.net/image.469397349.2555/flat,750x,075,f-pad,750x1000,f8f8f8.u2.jpg'
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

const channels = [
  { name: "really_random" },
  { name: "generally_speaking" },
  { name: "upcoming_birthday" },
  { name: "park_planning" },
];

const id = () => Math.round(Math.random() * (users.length - 1)) + 1;

const messages = [
  { userId: id(), content: "I like parks!", channelId: 1 },
  { userId: id(), content: "I like swings!", channelId: 1 },
  {
    userId: id(),
    content: "I like going down the slide!",
    channelId: 1,
  },
  { userId: id(), content: "I like playing tag!", channelId: 2 },
  { userId: id(), content: "Let's get together soon!", channelId: 2 },
  { userId: id(), content: "Sounds great!", channelId: 2 },
  { userId: id(), content: "Looks like it might rain!", channelId: 3 },
  { userId: 4, content: "Bring an umbrella!", channelId: 3 },
  {
    userId: id(),
    content: "Why don't we meet at the indoor basketball court?",
    channelId: 3,
  },
  { userId: id(), content: "I want to get tacos!", channelId: 4 },
  {
    userId: id(),
    content: "Salad sounds like a better option!",
    channelId: 4,
  },
  {
    userId: id(),
    content: "The kids won't stop yelling about taco salad!",
    channelId: 4,
  },
];

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
  )
    .then(() =>
      Promise.all(
        channels.map((channel) => {
          return Channel.create(channel);
        })
      )
    )
    .then(() =>
      Promise.all(
        messages.map((message) => {
          return Message.create(message);
        })
      )
    );

  const allUsers = await User.findAll();
  const singleUser = await User.findByPk(1);
  const secondUser = await User.findByPk(2);

  // await singleUser.addFriend(allUsers);
  await secondUser.addAddressee(allUsers, {
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
