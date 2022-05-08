const { MessageEmbed } = require('discord.js')
const fs = require('fs');

module.exports = {
    async CreateNewUserData(targetId, client){
        //Data.json 파일 불러오기
        const jsonBuffer = fs.readFileSync('./lib/UserData.json')
        const dataJson = jsonBuffer.toString();
        const data = JSON.parse(dataJson);

        const user = client.users.cache.find(user => user.id === targetId)
        //신규 유저 생성
        data.Users[targetId] = {
            UserName : user.username,
            UserProfileUrl : user.displayAvatarURL(),
            NormalAccount : 0,
            StockAccount : {
                "deposit" : 0,
                "stock" : {
                    
                },
				"ftstock" : {
                    
                }
            }
        }
        const datastr = JSON.stringify(data, null, '\t');
        fs.writeFileSync('./lib/UserData.json', datastr);
    }
}