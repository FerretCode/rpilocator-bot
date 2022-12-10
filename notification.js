const discord = require("discord.js");
const Watcher = require("rss-watcher");

module.exports.Notification = class {
  constructor(client) {
    this.users = [];

    this.addUser = (user) => this.users.push(user);

    this.removeUser = (user) =>
      this.users.splice(
        this.users.findIndex((u) => u === user.id),
        1
      );

    this.watch = () => {
      const watcher = new Watcher("https://rpilocator.com/feed");

      watcher.set({ interval: 60 });

      watcher.on("new article", (article) => {
        console.log(article);

        this.pushNotification(article.description);
      });
    };

    this.pushNotification = async (message) => {
      for (const id of this.users) {
        try {
          const user = await client.users.fetch(id);

          await user.send(
            new discord.EmbedBuilder()
              .setColor("Green")
              .setTitle("New RPI in stock")
              .setDescription(message)
          );
        } catch (error) {
          console.error(error);

          continue;
        }
      }
    };
  }
};
