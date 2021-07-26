module.exports = class Command {
  constructor(client) {
    this.client = client;

    this.name = "None";
    this.category = "None";
    this.description = "None";
    this.usage = "None";
    this.aliases = [];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run() {}
};
