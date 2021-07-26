const Command = require("../../structures/Command");

module.exports = class Ping extends Command {
  constructor(client) {
    super(client);

    this.client = client;

    this.name = "ping";
    this.category = "Bot";
    this.description = "Comando para ver o Ping do Bot";
    this.usage = "ping";
    this.aliases = ["pong"];

    this.enabled = true;
    this.guildOnly = true;
  }
  async run({ message }) {
    message.channel.send(`Ping do Bot: **${this.client.ws.ping}**`);
  }
};
