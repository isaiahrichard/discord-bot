var data = require('./quotes.json')
const fs = require('fs')
module.exports = {
  minArgs: 1,
  syntaxError: "Incorrect syntax, please use !quote 'message' @user or !quote @user",
  callback: ({ message }) => {
    const { mentions } = message;
    const target = mentions.users.first();
    if(!target){
      message.channel.send('Please @ a user')
      return;
    }
    const stringMsg = message.toString();
    const userId = message.guild.members.get(target.id)
    let msg = stringMsg.substring(stringMsg.indexOf('"')+1, stringMsg.lastIndexOf('"'));
    if(!data[userId]) {
      data[userId] = {"numOfQuotes": 0}
    }
    let quotes = data[userId]
    if(msg) {
      quotes.numOfQuotes += 1;
      quotes[quotes.numOfQuotes] = msg;
      message.channel.send(`<@${target.id}> Got caught lacking`);
      data[userId] = quotes;
      fs.writeFile('quotes.json', JSON.stringify(data), function(err) {
        (err) && console.log(err)
      })
    } else {
      let quoteCount = 1;
      const quotesArray = Object.keys(quotes)
      message.channel.send(target.username)
      quotesArray.forEach(element => {
      if(element !== 'numOfQuotes')
      message.channel.send(`\`\`\`${quoteCount}. ${quotes[element]}\`\`\``);
      quoteCount++;
      })
    }
  },
};