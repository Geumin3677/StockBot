const { Client, Intents, Collection, MessageEmbed } = require('discord.js');
const { token } = require('./config.json');
const fs = require('fs')

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_INTEGRATIONS ] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

const lop = require('./Functions/loop.js')
const msg = require('./Functions/msg.js')

//커맨드 로딩
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

//부팅시 로그
client.on('ready', () => {
	console.log('로그인 성공!')
	lop.updateloop(client)
});

async function writing(message, data){
	//UserData.json 파일 불러오기
	const jsonBuffer = fs.readFileSync('./lib/UserData.json')
	const dataJson = jsonBuffer.toString();
	const data2 = JSON.parse(dataJson)
	//가입 되어있는지 확인
	if(message.author.id in data2.Users)
	{
		data2.Users[message.author.id].NormalAccount += data.writingReward
		const datastr = JSON.stringify(data2, null, '\t');
		fs.writeFileSync('./lib/UserData.json', datastr);                     

		const name = `관리자`
		msg.moneyalart(client, message.author.id, data.writingReward, name, 1)

		const embed2 = new MessageEmbed()
			.setTitle('글작성 보상 지급 성공 ✅')
			.setDescription(`보상으로 ${data.writingReward}원 을 송금했습니다`)
			.addField('금액', `${data.writingReward}원`, true)
			.setColor('#20E86A')
		message.reply({ embeds: [embed2] })
	}
}

//글작성 채널 메시지 감지
client.on("messageCreate", (message) => {
	//봇인경우 반응하지 않음
	if (message.author.bot) return false; 

	//Settings.json 파일 불러오기
	const jsonBuffer = fs.readFileSync('./lib/Settings.json')
	const dataJson = jsonBuffer.toString();
	const data = JSON.parse(dataJson);

	//글작성 채널이 맞는지 확인
	if(message.channel.id == data.channel.writing)
	{
		writing(message, data)
	}
	
});


//명령어 이밴트 발생
client.on('interactionCreate', async interaction => {
    //커맨드가 아닐시 리턴
    if (!interaction.isCommand()) return;
    //커맨드 불러오기
	const command = client.commands.get(interaction.commandName);
    //존재하지 않는 커맨드일시 리턴
	if (!command) return;
	//봇일시 리턴
	if(interaction.user.bot) return;
    //커맨드 실행
	try{
		command.execute(interaction, client);
	}
	catch(error){
		console.log(error)
	}
});

client.login(token);	