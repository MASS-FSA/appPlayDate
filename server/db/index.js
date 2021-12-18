//this is the access point for all things database related!

const db = require("./db");

const User = require("./models/User");
const Channel = require("./models/Channel");
const Message = require("./models/Message");
const Review = require("./models/Review");
const Event = require("./models/Event");
const Friend = require("./models/Friend");
const Intake = require("./models/Intake");
const UserEvents = require("./models/UserEvents");


//associations


Channel.hasMany(Message, {
  onDelete: "cascade",
  hooks: true,
});

User.hasMany(Message);

Message.belongsTo(Channel);
Message.belongsTo(User);

User.belongsToMany(Event, {
  through: UserEvents,
});
Event.belongsToMany(User, {
  through: UserEvents,
});

User.hasMany(Review);
Review.belongsTo(User);

User.belongsToMany(User, {
  through: Friend,
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
    Friend,
    Intake,
    UserEvents
  },
};
