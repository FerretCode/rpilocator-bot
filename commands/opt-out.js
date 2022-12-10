const { Deta } = require("deta");

module.exports.run = async (interaction) => {
  const db = Deta(process.env.PROJECT_KEY).Base("users");

  try {
    const user = await db.fetch({ id: interaction.user.id });

    if (user.count === 0)
      return interaction.reply({
        content: "You are not opted in!",
        ephemeral: true,
      });

    global.notification.removeUser(interaction.user.id);

    await db.delete(user.items[0].key);

    return interaction.reply({
      content: "You have been opted out.",
      ephemeral: true,
    });
  } catch (error) {
    console.error(err);

    interaction.reply({
      content: "There was an error opting you out. Please try again later.",
      ephemeral: true,
    });
  }
};
