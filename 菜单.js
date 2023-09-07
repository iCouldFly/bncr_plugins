/**
 * @author Jusbe
 * @name 菜单
 * @origin Jusbe
 * @version 3.0.2
 * @description 汇总一下常用脚本，根据需求自己增删
 * @rule ^(菜单|帮助)$
 * @rule ^(京东命令|福利命令|社交命令|查询命令|影音命令|游戏命令|随机命令|管理命令|系统命令|购物查券返利)$
 * @admin false
 * @public true
 * @priority 0
 * @disable false
*/
module.exports = async s => {
    // 设置白名单：set jdgroup vip [123,456,789]
    const userId = s.getUserId()
    const from = s.getFrom();
    const vips = await new BncrDB('jdgroup').get('vip')
    const isAdmin = await s.isAdmin()
    const isVip = vips.indexOf(userId)+1
    const param1 = s.param(1)
    const waitTime = 60 // 等待输入时间。秒
    const errWaitTime = 6 //错误提示撤回时间。秒
    console.log(`【菜单】\n[${isAdmin ? '管理员' : isVip ? 'vip' : '普通'}用户]：${userId}`)

    const tag = '欢迎使用 JDGroup 助手' //主菜单标题
    const tips = '' // 主菜单底部备注
    const menuText = [
        {
            'tag':'京东命令', //子菜单标题
            'context':[ //子菜单内容
                '登录	-	登录/更新京东账号', 
                '查询	-	查询京东资产', 
                '豆豆	-	查询京豆余额/收入明细', 
                '账号管理	-	管理绑定的账号及通知设置', 
                '红包查询	-	查询京东红包余额', 
                '历史收入 [7]	-	查询多少天内的京豆收入', 
                '[pt_key;pt_pin;]	-	发送cookie上车', 
                '[pin;wskey;]	-	发送wskey上车'
            ],
            'tips':"", // 子菜单底部备注
            'img':"", // 配图url
            'admin': 0, // 限制管理员用户，1 是 / 0 否
            'vip': 0 // 限制白名单用户，1 是 / 0 否
        },{
            'tag':'福利命令',
            'context':[
                '小米刷步	-	小米运动刷步（管理员）', 
                '电信查询	-	查询88元电信车位的中奖记录'
            ],
            'tips':"",
            'admin': 0,
            'vip': 0
        },{
            'tag':'社交命令',
            'context':[
                '打卡	-	钉钉打卡提醒', 
                '60s	-	每天60秒读懂世界', 
                '摸鱼	-	🐟每天都是摸鱼人', 
                '微博	-	微博热搜榜', 
                '舔狗日记	-	随机舔狗语录', 
                'ikun	-	发送IKUN语录和表情包', 
                'ai [内容]	-	ChatGpt聊天', 
                'bimg [内容]	-	必应搜索聊天AI机器人图片生成', 
                'bing [内容]	-	必应搜索聊天AI机器人Sydney'
            ],
            'tips':"*注意空格，[ ] 及内容自行替换",
            'admin': 0,
            'vip': 0
        },{
            'tag':'查询命令',
            'context':[
                '[惠东县]天气	-	查询天气', 
                '查快递	-	查快递', 
                '[广东]油价	-	查询省份油价', 
                '天气[惠东县]	-	查询天气', 
                '汇总菜单	-	一些娱乐命令', 
                '下雨	-	下雨预告', 
                'fy[内容]	-	博天api支持28种语言翻译', 
                '百度百科[关键词]	-	查询百度百科', 
                '菜单	-	JDGroup 专属菜单'
            ],
            'tips':"*注意空格，[ ] 及内容自行替换",
            'admin': 0,
            'vip': 0
        },{
            'tag':'影音命令',
            'context':[
                'vip[天气之子]	-	搜索影视动漫', 
                '[B站链接]	-	BiliBili视频解析', 
                '电视剧[电视剧名]	-	搜索电视剧', 
                '动漫[动漫名]	-	搜索动漫', 
                '电影[电影名]	-	搜索电影', 
                'kw[歌名]	-	酷我音乐搜歌', 
                '[酷我链接]	-	酷我音乐链接解析', 
                '[海角链接]	-	海角社区链接解析', 
                '茶杯狐[剧名]	-	茶杯狐影片搜索', 
                '[皮皮虾视频链接]	-	皮皮虾视频解析', 
                '[抖音视频链接]	-	抖音视频解析', 
                '[快手视频链接]	-	快手视频解析', 
                'mv[曲名]	-	点歌MV版'
            ],
            'tips':"*注意空格，[ ] 及内容自行替换",
            'admin': 0,
            'vip': 0
        },{
            'tag':'游戏命令',
            'context':[
                '[亚瑟]战力	-	王者荣耀国标最低战力查询，四平台可查'
            ],
            'tips':"*注意空格，[ ] 及内容自行替换",
            'admin': 0,
            'vip': 0
        },{
            'tag':'随机命令',
            'context':[
                '美女	-	随机图片', 
                'mm	-	随机图片', 
                '买家秀	-	随机图片', 
                'h图	-	随机图片', 
                '[白]丝	-	黑丝白丝图片', 
                '香蕉视频	-	随机视频', 
                '盘搜 [资源名]	-	基于橘子盘搜的网盘搜索', 
                '玩偶姐姐	-	玩偶姐姐视频', 
                'sese	-	随机视频', 
                '猛男仓库	-	随机视频', 
                '看片	-	随机视频', 
                '黑料	-	黑料不打烊', 
                '番号[番号]	-	番号搜索', 
                '1024	-	随机视频', 
                '小姐姐	-	抖音小姐姐视频', 
                'lsp	-	随机视频', 
                '来个帅哥	-	发送帅哥视频', 
                '我想睡觉了	-	有声小说'
            ],
            'tips':"低调使用，分享本页任何内容将会永久拉黑",
            'admin': 0,
            'vip': 1
        },{
            'tag':'管理命令',
            'context':[
                '监听该群',
                '屏蔽该群',
                '回复该群',
                '不回复该群',
                '==== 返利狗 =====',
                '指令：用户提现，订单管理员处理用户的提现请求（权限）。',
                '指令：场所主提现，订单管理员处理场所主的提现请求（权限）。',
                '指令：今日统计，返回当日所有平台订单佣金总和，该命令非实时订单状态命令，数值仅供参考',
                '指令：[京粉/淘客/多多/京喜/唯品会]统计，返回当前平台今天收入统计',
                '指令：[京粉/淘客/多多/京喜/唯品会]明细，返回当前平台今天收入明细',
                '指令：监听场所，当全局设置-禁止监听所有群打开时生效。用于开启当前群的消息监听。',
                '指令：取消监听场所，当全局设置-禁止监听所有群打开时生效。用于关闭当前群的消息监听。',
            ],
            'tips':"返利狗文档：https://www.yuque.com/sunnysoft/fanlidog",
            'admin': 1,
            'vip': 0
        },{
            'tag':'系统命令',
            'context':[
                '重启',
                'bncr版本',
                'bncr状态',
                'bncr更新',
                '启动时间',
                'name',
                'time',
                '我的id',
                '群id',
                '环境变量 状态',
                '自动回复列表',
                '添加自动回复 [关键词] [内容]',
                '删除自动回复 [关键词]',
                '命令'
            ],
            'tips':"",
            'admin': 1,
            'vip': 0
        },{
            'tag':'购物查券返利',
            'context':[
                '☆功能：发我购物链接，查优惠。从惠链接', 
                '☆功能：分享我名片给您小伙伴用，TA下单的红包你也开', 
                '--------指令↓--------',
                '◎指令：我要买***，***代表商品名，查找最新优惠谍报（好用）。', 
                '◎指令：订阅，订阅自己感兴趣的商品关键词，对应的还有“删除订阅”“清空订阅”。', 
                '◎指令：绑定订单，手动绑定订单，绑定属于您的红包。', 
                '◎指令：绑定手机，绑定您的手机号，用于支付宝提现。', 
                '◎指令：我的积分，查询您当前的订单和积分明细。', 
                '◎指令：我要提现，通知订单管理员处理您的提现请求。', 
                '----------------------',
                '◎指令：场所积分，查询您拥有场所的订单和积分明细。', 
                '◎指令：场所提现，通知订单管理员处理您的场所提现请求。', 
                '----------------------',
                '助手QQ：2677583998\n加入 JDGrouop 群组，海量手推精选好物\n扫码加V进群，QQ群：484584515'
            ],
            'tips':"",
            'img':"https://z4a.net/images/2023/08/23/bncr--rdog.png",
            'admin': 0,
            'vip': 0
        }]

    let subMenu
    let context
    if(param1== '菜单'|| param1== '帮助'){
        let t = tag
        context = []
        menuText.forEach(e => { 
            context.push(e.tag)
        })
        t += '\n----------------------\n'
        t += dualMenu(context)
        t += '----------------------'
        if(tips) t += `\n${tips}`

        let subIndex = await pushWaitIndex(t,context.length)
        // s.reply(subIndex)
        if (!subIndex) return
        
        subMenu = menuText[subIndex-1]
        // s.reply(subMenu)
    }else{
        subMenu = menuText.find(obj => obj.tag === param1)
    }
    
    //admin 权限验证
    if (menuText[subIndex-1].admin && !isAdmin) {
        let msg = await s.reply('请努力成为我的管理员吧')
        s.delMsg(msg, { wait: waitTime });
        return
    }

    //vip 权限验证
    if (menuText[subIndex-1].vip && !isAdmin && !isVip) {
        let msg = await s.reply('仅对指定成员开放')
        s.delMsg(msg, { wait: waitTime });
        return
    }

    let t = subMenu.tag
    t += '\n----------------------\n'
    t += singleMenu(subMenu.context)
    t += '----------------------'
    if(subMenu.tips) t += `\n${subMenu.tips}`

    if(subMenu.img){ // QQ一步图文，其它分开图文
        if(from == 'qq'){
            t += `[CQ:image,file=${subMenu.img}]`
        }else{
            sendImg(subMenu.img)
        }
    }

    let msg = await s.reply(t)
    s.delMsg(msg, { wait: waitTime });

    // 单排菜单构建
    function singleMenu(g) {
        let _txt = "";
        g.map((item) => { _txt += item + "\n" });
        return _txt
    }

    // 双排菜单构建
    function dualMenu(g) {
        let num = 0;
        let _txt = "";
        g.map((item) => { _txt += ++num + "." + item + (num%2 ? "	" : "\n") });
        return _txt + (num%2 ? "\n" : "")
    }

    async function pushWaitIndex(str,max) {
        // s.reply(`pushWaitIndex(${str},${max})`)
        let msg = await s.reply(str)
        s.delMsg(msg, { wait: waitTime });

        let input = await s.waitInput(async () => { }, waitTime)
        // s.reply(input.getMsg())
        if (!input) {
            let errMsg = await s.reply(`${waitTime}秒内未回复，退出成功`)
            s.delMsg(msg)
            await s.delMsg(errMsg, { wait: errWaitTime });
            return false
        }
        // for(a in input){
        //     s.reply(`${a}：${input[a]}`)
        // }
        n = input.getMsg()
        Number(n) ? subIndex = n : subIndex = context.indexOf(n) + 1
        console.log(`输入：${n}，序号：${subIndex}`)
        if (subIndex < 1 || subIndex > max) {
            let errMsg = await s.reply("输入有误,退出成功")
            s.delMsg(msg)
            await s.delMsg(errMsg, { wait: errWaitTime });
            return false
        }
        await s.delMsg(msg)
        return subIndex
    }

    async function sendImg(url){
        let imgMsg = await s.reply({ 
            type: 'image', 
            path: url, 
            msg: "" })
        s.delMsg(imgMsg, { wait: waitTime })
    }
}
