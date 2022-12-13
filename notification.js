const discord = require("discord.js");
const Parser = require("rss-parser");
const { Deta } = require("deta");

module.exports.Notification = class {
  constructor(client, projectKey) {
    this.users = [];

    this.addUser = (user) => this.users.push(user);

    this.removeUser = (user) =>
      this.users.splice(
        this.users.findIndex((u) => u === user.id),
        1
      );

    this.watch = () => {
      const parser = new Parser();
      const db = Deta(projectKey).Base("feed");

      try {
        setInterval(async () => {
          const feed = await parser.parseURL("https://rpilocator.com/feed/");

          const item = feed.items[0];

          const lastAlert = await db.get("last_alert");

          if (!lastAlert) await db.put(item, "last_alert");
          if (item.guid === lastAlert.guid) return;

          this.pushNotification(item.content);

          await db.put(item, "last_alert");
        }, 60000);
      } catch (error) {
        console.log(error);
      }
    };

    this.pushNotification = async (message) => {
      for (const id of this.users) {
        try {
          const user = await client.users.fetch(id);

          await user.send({
            embeds: [
              new discord.EmbedBuilder()
                .setColor("Green")
                .setTitle("New RPI in stock")
                .setDescription(message),
            ],
          });
        } catch (error) {
          console.error(error);

          continue;
        }
      }
    };
  }
};
