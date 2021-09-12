const { Discord, Client, MessageEmbed } = require("discord.js")
const bot = new Client({partials: ["MESSAGE", "CHANNEL"] })
const fs = require('fs')

// ODc3MjU4OTE3ODI5Mjk2MTI4.YRwBCA.szKlp5VqxaAg2nharzmJ4x3AFRY

bot.on('ready', () => {
    console.log(`O bot: ${bot.user.username}#${bot.user.discriminator} foi iniciado com sucesso!`)
    bot.user.setActivity(`pineapple.ac`, {type: 'COMPETING'})
})

const config = JSON.parse(fs.readFileSync("./config.json", "utf-8"))

function clogs(logs) {
    bot.channels.cache.get("868243701347004496").send(new MessageEmbed().setDescription(logs).setColor("#6200C7"))
  }

bot.on('message', async message => {
    
    // const config = JSON.parse(fs.readFileSync("./config.json", "utf-8"))

    let args = message.content.slice(config["prefix"].length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase()

    if (cmd === "captcha-setup") {
        if(message.deletable) message.delete
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(":x: | You can't perform this command.").then(msg => {
            msg.delete({ timeout: 2000 })
        })
        let sent = await message.channel.send(new MessageEmbed()
            .setTitle("Captcha System")
            .setAuthor('pineapple.ac', bot.user.displayAvatarURL())
            .setDescription("Unlock your access by clicking on 🔒!")
            .setFooter("pineapple.ac")
            .setColor("6200C7"))

        sent.react("🔒")
        clogs("The channel <#" + message.channel.id + "> is now the captcha channel! (@" + message.author.id + ")")
    }

})

bot.on('messageReactionAdd', async (reaction, user) => {
    if (user.partial) await user.fetch()
    if (reaction.partial) await reaction.fetch()
    if (reaction.message.partial) await reaction.message.fetch()
  
    if (user.bot) return
  
    const config = JSON.parse(fs.readFileSync("./config.json", "utf-8"))
    let channelid = config["captchachannel"]
    let roleid = "868243663355015268"

    if (reaction.message.channel.id == channelid && reaction.emoji.name == '🔒') {
      await reaction.message.guild.members.cache.get(user.id).roles.add(roleid)
    }
  })

bot.on('guildMemberAdd', member => {
    let channelid = "868243675489120276"
    let welcomeEmbed = new MessageEmbed()
    .setColor("#6200C7")
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
//    .setDescription("Welcome <@" + message.author.id + ">, any doubt contact someone from our team!")
    .setDescription("Howdy <@" + member.user.id + ">!, Welcome to pineapple.ac!\nAny question we are available to help you in our chats!")
    .setTitle("Welcome | **pineapple.ac**")
    .setFooter("User ID: " +member.user.id)
    .setImage("https://cdn.discordapp.com/attachments/789247195953758233/832306990181122066/Wel_come_proxy_2-2.png")
    .setTimestamp()
    bot.channels.cache.get(channelid).send(`<@${member.user.id}>`, welcomeEmbed);

    clogs(`<@${member.user.id}> entrou no servidor. (${member.user.id})`)

})

bot.on('messageDelete', message => {

    clogs(`<@${message.author.id}> deleted a message "${message.content}"`)
})

bot.on('guildMemberRemove', member => {
    clogs(`<@${member.user.id}> left the server. (${member.user.id})`)
})

bot.on('inviteCreate', invite => {
    clogs(`<@${invite.inviter.id}> created an invite. (${invite.url.replace("https://discord.gg/", "")})`)
})

bot.login(config["token"])