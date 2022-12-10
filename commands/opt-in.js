const { Deta } = require("deta");

module.exports.run = async (interaction) => {
  const db = Deta(process.env.PROJECT_KEY).Base("users");

  try {
    const user = await db.fetch({ id: interaction.user.id });

    if (user.count > 0)
      return interaction.reply({
        content: "You are already opted in.",
        ephemeral: true,
      });

    global.notification.addUser(interaction.user.id);

    await db.put({ id: interaction.user.id });

    return interaction.reply({
      content: "You have been opted in.",
      ephemeral: true,
    });
  } catch (error) {
    console.error(err);

    return interaction.reply({
      content: "There was an error opting you in. Please try again later.",
      ephemeral: true,
    });
  }
};
