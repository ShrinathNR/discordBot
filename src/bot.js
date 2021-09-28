require("dotenv").config();

const { Client, Intents, WebhookClient } = require("discord.js");

const client = new Client(
  {
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  },
  {
    partials: ["MESSAGE", "REACTION"],
  }
);
const webhookClient = new WebhookClient(
  process.env.WEBHOOK_ID,
  process.env.WEBHOOK_TOKEN
);
const PREFIX = "$";

client.on("ready", () => {
  console.log(`logged in as ${client.user.tag}`);
});
client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;
  if (msg.content.startsWith(PREFIX)) {
    const [CMD_NAME, ...ARG] = msg.content
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/);
    if (CMD_NAME === "kick") {
      if (!msg.member.hasPermission("KICK MEMBERS"))
        return msg.reply("You do not have permission to kick members");
      if (ARG.length === 0) return msg.reply(`plese provide id`);
      const member = msg.guild.members.cache.get(ARG[0]);
      if (member) {
        member
          .kick()
          .then((member) => msg.channel.send(`${member} was kicked`))
          .catch((err) => msg.channel.send("I do not have permission"));
      } else {
        msg.channel.send("tha tmember is not found");
      }
    } else if (CMD_NAME === "ban") {
      if (!msg.member.hasPermission("BAN MEMBERS"))
        return msg.reply("You do not have permission to ban members");
      if (ARG.length === 0) return msg.reply(`plese provide id`);

      try {
        const user = await msg.guild.members.ban(ARG[0]);
        msg.channel.send("user is banned successfully");
      } catch (err) {
        console.log(err);
      }
    } else if (CMD_NAME === "announce") {
      const msg = ARG.join(" ");
      webhookClient.send(msg);
    }
  }
});

client.on("messageReactionAdd", (reaction, user) => {
  const { name } = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id);
  if (reaction.message.id === "892447881083097128") {
    switch (name) {
      case "😅":
        member.roles.add("892449808659390484");
        break;
      case "😂":
        member.roles.add("892449714367266816");
        break;
      case "😎":
        member.roles.add("892449876812636180");
        break;
      case "😉":
        member.roles.add("892449930344558602");
        break;
    }
  }
});
client.on("messageReactionRemove", (reaction, user) => {
  const { name } = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id);
  if (reaction.message.id === "892447881083097128") {
    switch (name) {
      case "😅":
        member.roles.remove("892449808659390484");
        break;
      case "😂":
        member.roles.remove("892449714367266816");
        break;
      case "😎":
        member.roles.remove("892449876812636180");
        break;
      case "😉":
        member.roles.remove("892449930344558602");
        break;
    }
  }
});
client.login(process.env.DISCORDJS_TOKEN);
