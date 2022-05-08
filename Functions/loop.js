const { MessageEmbed } = require('discord.js')
const { guildId } = require('../config.json')
const fs = require('fs');
const msg = require('../Functions/msg.js')

var stock_per, stock_time

let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

var stcnt = 1

module.exports = {
    async updateloop(client) {
        stcnt = 0
        while(true)
        {
            //Settings.json 파일 불러오기
            var jsonBuffer = fs.readFileSync('./lib/Settings.json')
            var dataJson = jsonBuffer.toString();
            const data2 = JSON.parse(dataJson);
            stock_per = data2.stock_per
            stock_time = data2.stock_time

            let now = new Date()
            //코인스테이킹
            if(data2.staking_expect === now.getHours())
            {
                console.log('Coin_staking Worked')
                now.setHours(now.getHours() + data2.staking_time)
                data2.staking_expect = now.getHours()

                datastr = JSON.stringify(data2, null, '\t')
				fs.writeFileSync('./lib/Settings.json', datastr)

                //Data.json 파일 다시 불러오기
                jsonBuffer = fs.readFileSync('./lib/UserData.json')
                dataJson = jsonBuffer.toString();
                const data = JSON.parse(dataJson);
                for(const id of Object.keys(data.Users))
                {
                    const guild = await client.guilds.cache.get('952044141871783977')
                    const user = await guild.members.fetch(id)
                    if(user.roles.cache.some(role => role.id === data2.coin_staking))
                    {
                        data.Users[id].NormalAccount += data2.staking_value

                        msg.moneyalart(client, id, data2.staking_value, '코인스테이킹', 1)

                        const datastr = JSON.stringify(data, null, '\t');
                        fs.writeFileSync('./lib/UserData.json', datastr);
                    }
                }
            }
            //주식 주가 업데이트
            if(stcnt >= stock_time)
            {
                //Companys.json 파일 불러오기
                var jsonBuffer = fs.readFileSync('./lib/Companys.json')
                var dataJson = jsonBuffer.toString();
                const data = JSON.parse(dataJson);

                function minTwoDigits(n) {
                    return (n < 10 ? '0' : '') + n;
                }

                for(const company of Object.keys(data.Companys))
                {
                    const date = new Date()
                    const i  = ((data.Companys[company].buy / data.buycnt) * 10)
                    const newprice = priceCel(data.Companys[company].price, i)
                    const historyTmp = {
                        "price" : newprice, //정규분포를 통한 변동치 계산
                        "time" : `${minTwoDigits(date.getHours())}:${minTwoDigits(date.getMinutes())}:${minTwoDigits(date.getSeconds())}`,
                        "date" : date.getDate()
                    }
                    data.Companys[company].price_history.unshift(historyTmp)
                    data.Companys[company].price = newprice
                    data.Companys[company].buy = 0

                    if(data.Companys[company].price_history.length > 100)
                    {
                        data.Companys[company].price_history.pop()
                    }

                    const datastr = JSON.stringify(data, null, '\t');
                    fs.writeFileSync('./lib/Companys.json', datastr);
                }
                //UserData.json 파일 불러오기
                jsonBuffer = fs.readFileSync('./lib/UserData.json')
                dataJson = jsonBuffer.toString();
                const data2 = JSON.parse(dataJson);

                //Settings.json 파일 불러오기
                jsonBuffer = fs.readFileSync('./lib/Settings.json')
                dataJson = jsonBuffer.toString();
                const data3 = JSON.parse(dataJson);

                if(data2.ft.length)
                {
                    for(const id of data2.ft)
                    {
                        for(const cn of Object.keys(data2.Users[id].StockAccount.ftstock))
                        {
                            const ftstock = data2.Users[id].StockAccount.ftstock[cn]
                            if(data2.Users[id].StockAccount.ftstock[cn].position == 'long')
                            {
                                if((100 - (Math.floor((((((ftstock.cnt * data.Companys[cn].price) - ftstock.principal) * ftstock.drain) + ftstock.principal) / ftstock.principal) * 100))) > (100 / ftstock.drain))
                                {
                                    //청산
                                    const proceed = ((((ftstock.cnt * data2.Companys[cn].price) - ftstock.principal) * ftstock.drain) + ftstock.principal) * (1-data3.t)

                                    delete data.Users[id].StockAccount.ftstock[cn]
                                    data.Users[id].StockAccount.deposit += proceed

                                    msg.moneyalart(client, id, proceed, '선물거래 자동 청산', 1)

                                    const datastr = JSON.stringify(data, null, '\t');
                                    fs.writeFileSync('./lib/UserData.json', datastr);
                                }
                            }
                            else
                            {
                                if(((Math.floor((((((ftstock.cnt * data.Companys[cn].price) - ftstock.principal) * ftstock.drain) + ftstock.principal) / ftstock.principal) * 100)) - 100) > (100 / ftstock.drain))
                                {
                                    //청산
                                    const proceed = (-(((ftstock.cnt * data2.Companys[cn].price) - ftstock.principal) * ftstock.drain) + ftstock.principal) * (1-data3.t)

                                    delete data.Users[id].StockAccount.ftstock[cn]
                                    data.Users[id].StockAccount.deposit += proceed

                                    msg.moneyalart(client, id, proceed, '선물거래 자동 청산', 1)

                                    const datastr = JSON.stringify(data, null, '\t');
                                    fs.writeFileSync('./lib/UserData.json', datastr)
                                }
                            }
                        }
                    }
                }

                console.log('StockUpdated')
                stcnt = 0
            }
            //로또 추첨
            if(now.getDay() === 6 && now.getHours() === 16 && now.getMinutes() === 45 && now.getSeconds() === 0)
            {
                function shuffle(array) { array.sort(() => Math.random() - 0.5); }
                var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
                var rand = []

                shuffle(arr)

                var a = 0
                while(a < 6)
                {
                rand.push(arr[a])
                a += 1
                }
                var bonus = arr[7]

                rand = [3, 12, 14, 2, 4, 7]

                //Lotto.json 파일 불러오기
                jsonBuffer = fs.readFileSync('./lib/Lotto.json')
                dataJson = jsonBuffer.toString();
                const data = JSON.parse(dataJson);

                //UserData.json 파일 불러오기
                jsonBuffer = fs.readFileSync('./lib/UserData.json')
                dataJson = jsonBuffer.toString();
                const data2 = JSON.parse(dataJson);

                for(const item of data.Participants)
                {
                    var cnt = 0
                    for(const x of rand)
                    {
                        for(const y of item.lotto)
                        {
                            if(x === y)
                            {
                                cnt += 1
                            }
                        }
                    }
                    console.log(cnt)
                    if(cnt == 5)
                    {
                        for(const z of item.lotto)
                        {
                            if(z == bonus)
                            {
                                cnt = 7
                            }
                        }
                    }
                    var datastr = JSON.stringify(data, null, '\t')
                    switch(cnt){
                        case 7:
                            //2등
                            data.result.nd.push(item.owner)
                            datastr = JSON.stringify(data, null, '\t')
                            fs.writeFileSync('./lib/Lotto.json', datastr)
                            break
                        case 6:
                            //1등
                            data.result.st.push(item.owner)
                            datastr = JSON.stringify(data, null, '\t')
                            fs.writeFileSync('./lib/Lotto.json', datastr)
                            break
                        case 5:
                            //3등
                            data.result.rd.push(item.owner)
                            datastr = JSON.stringify(data, null, '\t')
                            fs.writeFileSync('./lib/Lotto.json', datastr)
                            break
                        case 4:
                            //4등
                            data2.Users[item.owner].NormalAccount += 50000
                            datastr = JSON.stringify(data2, null, '\t')
                            fs.writeFileSync('./lib/UserData.json', datastr)
                            msg.moneyalart(client, item.owner, 50000, '복권 4등 당첨금', 1)

                            break
                        case 3:
                            //5등
                            //UserData에서 돈 이동
                            data2.Users[item.owner].NormalAccount += 5000
                            datastr = JSON.stringify(data2, null, '\t')
                            fs.writeFileSync('./lib/UserData.json', datastr)
                            msg.moneyalart(client, item.owner, 5000, '복권 5등 당첨금', 1)

                            break
                    }
                }

                var m = 0
                if(data.st.length > 0)
                {
                    var strwd = ((data.Money * 0.75) / data.st.length)
                    for(const i of data.st)
                    {
                        //UserData에서 돈 이동
                        data2.Users[i].NormalAccount += strwd
                        datastr = JSON.stringify(data2, null, '\t')
                        fs.writeFileSync('./lib/UserData.json', datastr)
                        msg.moneyalart(client, i, strwd, '복권 1등 당첨금', 1)
                    }
                    m += (data.Money * 0.75)
                }
                if(data.nd.length > 0)
                {
                    var ndrwd = ((data.Money * 0.125) / data.nd.length)
                    for(const i of data.nd)
                    {
                        //UserData에서 돈 이동
                        data2.Users[i].NormalAccount += ndrwd
                        datastr = JSON.stringify(data2, null, '\t')
                        fs.writeFileSync('./lib/UserData.json', datastr)
                        msg.moneyalart(client, i, ndrwd, '복권 2등 당첨금', 1)
                    }
                    m += (data.Money * 0.125)
                }
                if(data.rd.length > 0)
                {
                    var rdrwd = ((data.Money * 0.125) / data.rd.length)         
                    for(const i of data.nd)
                    {
                        //UserData에서 돈 이동
                        data2.Users[i].NormalAccount += rdrwd
                        datastr = JSON.stringify(data2, null, '\t')
                        fs.writeFileSync('./lib/UserData.json', datastr)
                        msg.moneyalart(client, i, rdrwd, '복권 3등 당첨금', 1)
                    }
                    m += (data.Money * 0.125)
                }

                data.Participants = []
                data.result.st = []
                data.result.nd = []
                data.result.rd = []
                data.Money -= m

                datastr = JSON.stringify(data, null, '\t')
                fs.writeFileSync('./lib/Lotto.json', datastr)
            }

            stcnt += 1
            await sleep(1000)
        }
    },
    async stocktimeleft(){
        // 다음 주식 변동시간 조회
        return new Promise(resolve => {
            resolve(stock_time - stcnt)
        })
    }
}

function priceCel(price, i){
    var standard = gaussian(0 + stock_per + i, 7);
    const per = standard()
    if(price + price * (Math.floor(per) / 100) <= 0)
    {
        priceCel(price, i)
    }
    else
    {
        price += price * (Math.floor(per) / 100)
        return Math.round(price)
    }
}

// 정규분포 난수 계산
function gaussian(mean, stdev) {
    var y2;
    var use_last = false;
    return function() {
      var y1;
      if (use_last) {
        y1 = y2;
        use_last = false;
      } else {
        var x1, x2, w;
        do {
          x1 = 2.0 * Math.random() - 1.0;
          x2 = 2.0 * Math.random() - 1.0;
          w = x1 * x1 + x2 * x2;
        } while (w >= 1.0);
        w = Math.sqrt((-2.0 * Math.log(w)) / w);
        y1 = x1 * w;
        y2 = x2 * w;
        use_last = true;
      }
  
      var retval = mean + stdev * y1;
      return retval;
    }
}