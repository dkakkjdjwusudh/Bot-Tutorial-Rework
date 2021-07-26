const GetMention = (id) => new RegExp(`^<@!?${id}>( |)$`);
const c = require("colors");
let t;

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(message) {
    try {
      if (message.author.bot == true) return;

      const server = await this.client.database.guilds.findOne({
        _id: message.guild.id,
      });
      let user = await this.client.database.users.findOne({
        _id: message.author.id,
      });
      const client = await this.client.database.clientUtils.findOne({
        _id: this.client.user.id,
      });

      const language = await this.client.getLanguage(message.guild.id);

      try {
        t = await this.client.getTranslate(message.guild.id);
      } catch (e) {
        console.log(e);
      }

      if (!user)
        await this.client.database.users.create({
          _id: message.author.id,
        });

      if (!client)
        await this.client.database.clientUtils.create({
          _id: this.client.user.id,
          reason: "",
          manutenção: false,
        });

      const prefix = server.prefix;

      if (message.content.match(GetMention(this.client.user.id))) {
        message.channel.send(
          t("clientMessages:mention", {
            prefix,
            author: message.author.id,
          })
        );
      }

      user = await this.client.database.users.findOne({
        _id: message.author.id,
      });

      if (message.content.indexOf(prefix) !== 0) return;
      const author = message.author;
      const args = message.content.slice(prefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();
      const cmd =
        this.client.commands.get(command) ||
        this.client.commands.get(this.client.aliases.get(command));

      if (!cmd) return;

      const comando = await this.client.database.commands.findOne({
        _id: cmd.name,
      });

      if (comando) {
        cmd.run({ message, args, prefix, author, language }, t);
        var num = comando.usages;
        num = num + 1;

        await this.client.database.commands.findOneAndUpdate(
          { _id: cmd.name },
          { $set: { usages: num } }
        );
      } else {
        await this.client.database.commands.create({
          _id: cmd.name,
          usages: 1,
          manutenção: false,
        });

        console.log(
          c.cyan(
            `[Novo Comando] - O comando: ( ${cmd.name} ) teve o seu Documento criado com Sucesso!`
          )
        );
      }
    } catch (err) {
      if (err) console.error(err);
    }
  }
};
