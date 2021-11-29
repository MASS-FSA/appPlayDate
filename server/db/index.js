//this is the access point for all things database related!

const db = require("./db");

const User = require("./models/User");
const Channel = require("./models/Channel");
const Message = require("./models/Message");
const Review = require("./models/Review");
const Event = require("./models/Event");
const FriendsRequest = require("./models/FriendsRequest");
const Intake = require("./models/Intake");

//associations could go here!
User.belongsToMany(Channel, {
  through: Message,
});
Channel.belongsToMany(User, {
  through: Message,
});

User.belongsToMany(Event, {
  through: "UserEvents",
});
Event.belongsToMany(User, {
  through: "UserEvents",
});

User.hasMany(Review);
Review.belongsTo(User);

User.belongsToMany(User, {
  through: "Friends",
  as: "friend",
});

// User.belongsToMany(User, {
//   through: FriendsRequest,
//   as: "Requester",
// });

User.belongsToMany(User, {
  through: FriendsRequest,
  as: "Addressee",
});

Event.hasMany(Review);
Review.belongsTo(Event);

Intake.hasMany(User);
User.belongsTo(Intake);

module.exports = {
  db,
  models: {
    User,
    Channel,
    Message,
    Review,
    Event,
    FriendsRequest,
    Intake,
  },
};
