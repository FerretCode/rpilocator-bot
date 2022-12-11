const { Client, Intents } = require("goated.js");
const { Deta } = require("deta");
const { Notification } = require("./notification");

const client = new Client({
  intents: [Intents.Guilds, Intents.DirectMessages],
  path: `${__dirname}/commands`,
});

client.env("./.env");

// recreate notification & subscribers on start
const db = Deta(process.env.PROJECT_KEY).Base("users");
const notification = new Notification(client, process.env.PROJECT_KEY);
db.fetch()
  .then((users) => {
    for (const user of users.items) {
      if (notification.users.find((u) => u === user.id)) continue;

      notification.addUser(user.id);
    }

    notification.watch();
  })
  .catch((err) => console.error(err));

global.notification = notification;

client.createCommand(
  [
    {
      name: "opt-in",
      description: "Opt-in to alerts from rpilocator.com",
    },
    {
      name: "opt-out",
      description: "Opt-out from alerts from rpilocator.com",
    },
  ],
  {
    token: process.env.TOKEN,
    id: process.env.APPLICATION_ID,
  }
);
