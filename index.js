const dotenv = require('dotenv');
dotenv.config()
const Telegraf = require('telegraf');
const request = require('request');
const fs = require('fs');


const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply(`Welcome ${ctx.from.first_name}`));
bot.on('document', (ctx) => {
  return bot.telegram.getFileLink(ctx.message.document.file_id).then(url => {
    var file_name = ctx.message.document.file_name;
    var file_name_bot = file_name.substr(0, file_name.length - 5) + "_Bot.json";
    console.log(file_name_bot);
    if (url.endsWith(".json")) {
      request.get(url, (error, response, body) => {
        let json = JSON.parse(body);
        json.push("The bot was here!");
        fs.writeFile(file_name_bot, JSON.stringify(json, null, '    '), function (err) {
          if (err) {
            ctx.reply("An error occured processing JSON file");
            return console.log(err);
          }
          console.log("JSON file has been saved.");
        });
        ctx.replyWithDocument({source: file_name_bot}).then(hey => {
          fs.unlinkSync(file_name_bot);
        });
      });
    } else {
      ctx.reply("wrong file ending, only accepts .json file")
    }
  });
});
bot.launch();
