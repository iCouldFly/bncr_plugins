/**
 * @author Jusbe
 * @name 群导航
 * @origin Jusbe
 * @version 1.0.0
 * @description 只用脚本
 * @rule ^(群组?)(导航)$
 * //在下面删减你的群名称
 * @rule ^(日用|捡漏|猫猫|零食|母婴|定制|啊哈|QQ测试|test)(群)$
 * @admin false
 * @public true
 * @priority 0
 * @disable false
*/
module.exports = async s => {
    const isPrivate = 1 // 1 限制私聊；2不限制私聊
    const groupList = { //在下面配置你的群信息
        "日用":{
            "chatId":"44266589552", //群号
            "im":"wx",              //平台
            "msg":"手推精选返利群",  //描述
            "shareLink":"",         //邀请链接
            "admin":0,              //仅管理员可查看/使用，0=否;1=是
        },
        "捡漏":{
            "chatId":"49408275033",
            "im":"wx",
            "msg":"捡漏🧚‍♂️撸纸 禁言群",
            "shareLink":"",
            "admin":0,
        },
        "猫猫":{
            "chatId":"49180275780",
            "im":"wx",
            "msg":"🈲言-猫咪🐱用品豪车🚗",
            "shareLink":"",
            "admin":0,
        },
        "零食":{
            "chatId":"47707269733",
            "im":"wx",
            "msg":"零食专场",
            "shareLink":"",
            "admin":0,
        },
        "母婴":{
            "chatId":"43107592682",
            "im":"wx",
            "msg":"母婴专场",
            "shareLink":"",
            "admin":0,
        },
        "定制":{
            "chatId":"-721254146",
            "im":"tg",
            "msg":"群主定制精选商品，实在！",
            "shareLink":"点击链接加入群聊：https://t.me/+JmCtnSQyxt9jMGY9",
            "admin":0,
        },
        "啊哈":{
            "chatId":"484584515",
            "im":"qq",
            "msg":"QQ全功能主群",
            "shareLink":"点击链接加入群聊【啊哈】：http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=FOn0CBkpT62u72rVRtY2ReRjVwe-7Zs9&authKey=%2FE4WC4JqnWpF67crcI%2B3aKwwYTfif7vUoYqIapmFvjOvHdB%2FVzNlvY9YfiNy5YeP&noverify=0&group_code=484584515",
            "admin":0,
        },
        "频道":{
            "chatId":"549998515",
            "im":"qb",
            "msg":"QQ频道，仅做日志通知用",
            "shareLink":"点击链接加入QQ频道【JDGroup 测试中】：https://pd.qq.com/s/4fihrs7a1",
            "admin":0,
        },
        "QQ测试":{
            "chatId":"315519023",
            "im":"qq",
            "msg":"QQ测试群",
            "shareLink":"点击链接加入群聊【testGroup】：http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=YYhpcCcCTHEBoMx0iLmb4jFE_hwmOvFF&authKey=fkH3AmVA%2Fpi6MsmnK%2BGVPhTydJ6TxH7vpbeQxuGuhHP1zYyE%2B%2BaNUQPJN%2FCuPl4U&noverify=0&group_code=315519023",
            "admin":1,
        },
    }

    /*↓↓↓↓↓↓↓↓↓↓↓↓ 此段代码来自 bncr/BncrData/Adapter/wxXyo.js ↓↓↓↓↓↓↓↓↓↓↓↓*/
    let XyoUrl = sysMethod.config.wxBot.Xyo.sendUrl;
    if (!XyoUrl) return console.log('Xyo:配置文件未设置sendUrl');
    // 包装原生require   你也可以使用其他任何请求工具 例如axios
    let request = require('util').promisify(require('request'));
    // wx数据库
    const wxDB = new BncrDB('wxXyo');
    let botId = await wxDB.get('xyo_botid', ''); //自动设置，无需更改
    let token = await wxDB.get('xyo_token', ''); //set wxXyo xyo_token xxx
    /*↑↑↑↑↑↑↑↑↑↑↑↑ 此段代码来自 bncr/BncrData/Adapter/wxXyo.js ↑↑↑↑↑↑↑↑↑↑↑↑*/

    const param1 = await s.param(1)
    const param2 = await s.param(2)
    const from = await s.getFrom()
    const isAdmin = await s.isAdmin()
    const userId = s.getUserId()
    const groupId = await s.getGroupId()

    const qopIcon = from.substring(0,2) === 'wx' ? '●' : '👥'
    const noAdmIcon = from.substring(0,2) === 'wx' ? '×' : '😰'
    //私聊限制
    if((!groupId || groupId !=='0') && isPrivate) return s.reply("请私聊使用")

    switch(param2){
        case '导航':
            return s.reply(await getGroupList())
            break;
        case '群':
            //配置检测
            let groupId
            let groupIm 
            let groupMsg
            let groupLink
            try{
                groupId = groupList[param1].chatId
                groupIm = groupList[param1].im
                groupMsg = groupList[param1].msg
                groupAdmin = groupList[param1].admin
                groupLink = groupList[param1].shareLink
            }catch(e){
                return console.log(`【群导航】\n${param1}群组信息配置错误`)
            }

            //管理员检测
            if(groupAdmin && !isAdmin) return s.reply(`${noAdmIcon} ... 被你发现了，但还是只对管理员开放`)

            //平台检测
            console.log(`【群导航】当前平台：${from}`)
            if(groupIm === 'wx'){
                if(from.substring(0,2) === 'wx'){
                    return wxInviteIn(groupId)
                }else{
                    return await sendImgMsg("https://z4a.net/images/2023/08/23/bncr--rdog.png","请添加微信好友使用")
                }
            }else{
                return s.reply(`${groupMsg}\n----------------------\n${groupLink}`)
            }
            break;
    }

    //wx邀群
    async function wxInviteIn(chatId){
        const result = await requestXyo({
            api: "InviteInGroupByLink",
            group_wxid: `${chatId}@chatroom`,
            friend_wxid: userId,
        })
        console.debug("【群导航】拉群结果：", result)
    }

    /*↓↓↓↓↓↓↓↓↓↓↓↓ 此段代码来自 bncr/BncrData/Adapter/wxXyo.js ↓↓↓↓↓↓↓↓↓↓↓↓*/
    async function requestXyo(body) {
        return (
            await request({
                url: XyoUrl,
                method: 'post',
                body: {
                    ...body, ...{
                        token, robot_wxid: botId
                    }
                },
                json: true
            })
        ).body;
    }
    /*↑↑↑↑↑↑↑↑↑↑↑↑ 此段代码来自 bncr/BncrData/Adapter/wxXyo.js ↑↑↑↑↑↑↑↑↑↑↑↑*/

    //QQ一步图文，其他先图后文
    async function sendImgMsg(img,msg){
        if(from === "qq") return s.reply(`[CQ:image,file=${img}]${msg}`)

        if(!(imgMsg = await s.reply({ 
            type: 'image', 
            path: img, 
            // msg: msg 
        }))) return await s.reply("发送失败，请联系管理员")
        return s.reply(msg)
    }

    //生成群列表
    async function getGroupList(){
        let t = "发“xx群”邀你进群\n----------------------\n"
        for(let i in groupList){
            if(!groupList[i].admin || isAdmin){
                t += `${qopIcon}${i}群：[${groupList[i]["im"]}]${groupList[i]["msg"]}\n`
            }
        }
        return t
    }
}
