"use strict";

// const { use } = require('chai');
const {
  db,
  models: { User, Event, Message, Channel },
} = require("../server/db");
const Friend = require("../server/db/models/Friend");

const users = [
  {
    username: "Mehron",
    password: "123",
    longitude: -77.1618725,
    latitude: 38.8125889,
    homeLongitude: -77.1618725,
    homeLatitude: 38.8125889,
    image: `https://www.awesomeinventions.com/wp-content/uploads/2018/04/photoshop-man-riding-chicken-silly-things-bored-people-do.jpg`,
  },

  {
    username: "Sean",
    password: "123",
    longitude: -77.1618725,
    latitude: 38.8235889,
    homeLongitude: -77.1618725,
    homeLatitude: 38.8235889,
    image:
      "https://tjn-blog-images.s3.amazonaws.com/wp-content/uploads/2015/11/20001006/15-most-hilarious-things-people-have-put-on-their-resume-810x539.jpg",
  },

  {
    username: "Steven",
    password: "123",
    longitude: -77.18318725,
    latitude: 38.8125889,
    homeLongitude: -77.18318725,
    homeLatitude: 38.8125889,
    image: `https://png.pngtree.com/png-clipart/20190520/original/pngtree-funny-react-png-image_3530386.jpg`,
  },

  {
    username: "Alex",
    password: "123",
    email: "anatoly.tsinker13@gmail.com",
    state: "North Carolina",
    address: "88 BearBack Court",
    longitude: -77.1828725,
    latitude: 38.8125889,
    homeLongitude: -77.1828725,
    homeLatitude: 38.8125889,
    image:
      "https://ih1.redbubble.net/image.469397349.2555/flat,750x,075,f-pad,750x1000,f8f8f8.u2.jpg",
  },
];

const events = [
  {
    name: "Fun Event",
    location: "Iowa",
    longitude: -77.1618725,
    latitude: 38.8125889,
  },
  {
    name: "Super Fun Event",
    location: "Virginia",
    longitude: -77.1618725,
    latitude: 38.8125889,
  },
  {
    name: "Soccer Game",
    location: "New York",
    longitude: -77.1828725,
    latitude: 38.8125889,
  },
  {
    name: "Yugioh YCS",
    location: "Vegas",
    longitude: -77.1618725,
    latitude: 38.8125889,
  },
  {
    name: "Football Game",
    location: "New England",
    longitude: -77.1618725,
    latitude: 38.8235889,
  },
  {
    name: "Marathon",
    location: "Boston",
    longitude: -77.1618725,
    latitude: 38.8125889,
  },
];

const channels = [
  { name: "Public_Chat" },
  { name: "Discuss Your kids favorite Toys!" },
  { name: "What your favorite Park?" },
  { name: "Great Books For Kids" },
];

const id = () => Math.round(Math.random() * (users.length - 1)) + 1;

const messages = [
  { userId: id(), content: "This is the public Channel", channelId: 1 },
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
  ).then(() =>
    Promise.all(
      channels.map((channel) => {
        return Channel.create(channel);
      })
    )
  );

  const allUsers = await User.findAll();
  const userPairs = [];
  for (let i = 1; i < allUsers.length + 1; i++) {
    for (let j = 1; j < allUsers.length + 1; j++) {
      if (i !== j) {
        userPairs.push([i, j]);
      }
    }
  }

  for (let i = 0; i < userPairs.length; i++) {
    let user1 = await User.findByPk(userPairs[i][0]);
    let user2 = await User.findByPk(userPairs[i][1]);
    await user1.addAddressee(user2);
  }

  const friendsTable = await Friend.findAll();
  await Promise.all(
    friendsTable.map((friendship) => {
      return friendship.update({ status: "accepted" });
    })
  );

  await User.create({
    username: "Chat Bot",
    image: `https://static.botsrv2.com/website/img/quriobot_favicon.1727b193.png`,
  });

  await Promise.all(
    messages.map((msg) => {
      return Message.create(msg);
    })
  );

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
