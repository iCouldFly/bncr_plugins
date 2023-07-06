/**
 * @author Yuheng | onz3v | Jusbe
 * @name 菜单
 * @origin Jusbe
 * @version 1.0.0
 * @description 汇总一下常用脚本，根据需求自己增删
 * @rule ^(菜单|京东命令|福利命令|社交命令|查询命令|影音命令|游戏命令|随机命令|系统命令|购物查券返利)$
 * @admin false
 * @public true
 * @priority 0
 * @disable true
*/
module.exports = async s => {
    // let jdgroupDB = new BncrDB('jdgroup'),
    // param1 = s.param(1),
    // param2 = s.param(2),
    // param3 = s.param(3),
    // param4 = s.param(4),
    // param5 = s.param(5),
    // userId = s.getUserId(),
    // groupId = s.getGroupId(),
    // from = s.getFrom();
    const comFn = require('./lib/functions')
    const input = s.getMsg();
    if (input == "菜单") {
        var n = ``;
        n += "请回复对应分类（发序号无效）：\n";
        var g = [
            '⒈京东命令		⒉福利命令', 
            '⒊社交命令		⒋查询命令', 
            '⒌影音命令		⒍游戏命令', 
            '⒎随机命令		⒏系统命令', 
            '⒐购物查券返利'
        ];
        g.map((item) => { n += item + "\n" });
        n += `----------------------`;
        let loading0 = await s.reply(n)
        await s.delMsg(loading0, { wait: 60 })
    } else {
        totalClass();
        //await s.delMsg(loading, { wait: 2 });
    }
    async function totalClass() {
        switch (input) {
            case '京东命令':
                var n = ``;
                n += "*注意空格，[ ] 内容自行替换\n";
                n += "----------------------\n";
                var g = [
                    '登录	-	登录/更新京东账号', 
                    '查询	-	查询京东资产', 
                    '豆豆	-	查询京豆余额/收入明细', 
                    '账号管理	-	管理绑定的账号及通知设置', 
                    '红包查询	-	查询京东红包余额', 
                    '历史收入 [7]	-	查询多少天内的京豆收入', 
                    '[pt_key;pt_pin;]	-	发送cookie上车', 
                    '[pin;wskey;]	-	发送wskey上车'
                ];
                g.map((item) => { n += item + "\n" });
                n += `----------------------`;
                let loading1 = await s.reply(n)
                await s.delMsg(loading1, { wait: 60 })
                break;
            case '福利命令':
                var n = ``;
                n += "*注意空格，[ ] 内容自行替换\n";
                n += "----------------------\n";
                var g = [
                    '小米刷步	-	小米运动刷步（管理员）', 
                    '小米运动添加账号 [账号@@密码]	-	小米运动刷步（管理员）', 
                    '小米运动删除账号 [账号]	-	小米运动刷步（管理员）', 
                    '电信查询	-	查询88元电信车位的中奖记录'
                ];
                g.map((item) => { n += item + "\n" });
                n += `----------------------`;
                let loading2 = await s.reply(n)
                await s.delMsg(loading2, { wait: 60 })
                break;
            case '社交命令':
                var n = ``;
                n += "*注意空格，[ ] 内容自行替换\n";
                n += "----------------------\n";
                var g = [
                    '打卡	-	钉钉打卡提醒', 
                    '60s	-	每天60秒读懂世界', 
                    '摸鱼	-	🐟每天都是摸鱼人。      (改自原傻妞插件)', 
                    '微博	-	微博热搜榜', 
                    '舔狗日记	-	随机舔狗语录', 
                    'ikun	-	发送IKUN语录和表情包', 
                    'ai [内容]	-	ChatGpt聊天', 
                    'bimg [内容]	-	必应搜索聊天AI机器人图片生成', 
                    'bing [内容]	-	必应搜索聊天AI机器人Sydney'
                ];
                g.map((item) => { n += item + "\n" });
                n += `----------------------`;
                let loading3 = await s.reply(n)
                await s.delMsg(loading3, { wait: 60 })
                break;
            case '查询命令':
                var n = ``;
                n += "*注意空格，[ ] 内容自行替换\n";
                n += "----------------------\n";
                var g = [
                    '[惠东县]天气	-	查询天气', 
                    '查快递	-	查快递', 
                    '[广东]油价	-	查询省份油价', 
                    '天气[惠东县]	-	查询天气', 
                    '汇总菜单	-	一些娱乐命令', 
                    '下雨	-	下雨预告', 
                    'fy[内容]	-	博天api支持28种语言翻译', 
                    '百度百科[关键词]	-	查询百度百科', 
                    '菜单	-	私人订制菜单'
                ];
                g.map((item) => { n += item + "\n" });
                n += `----------------------`;
                let loading4 = await s.reply(n)
                await s.delMsg(loading4, { wait: 60 })
                break;
            case '影音命令':
                var n = ``;
                n += "*注意空格，[ ] 内容自行替换\n";
                n += "----------------------\n";
                var g = [
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
                ];
                g.map((item) => { n += item + "\n" });
                n += `----------------------`;
                let loading5 = await s.reply(n)
                await s.delMsg(loading5, { wait: 60 })
                break;
            case '游戏命令':
                var n = ``;
                n += "*注意空格，[ ] 内容自行替换\n";
                n += "----------------------\n";
                var g = [
                    '[亚瑟]战力	-	王者荣耀国标最低战力查询，四平台可查'
                ];
                g.map((item) => { n += item + "\n" });
                n += `----------------------`;
                let loading6 = await s.reply(n)
                await s.delMsg(loading6, { wait: 60 })
                break;
            case '随机命令':
                var n = ``;
                n += "*注意空格，[ ] 内容自行替换\n";
                n += "----------------------\n";
                var g = [
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
                    '我想睡觉了	-	有声小说', 

                ];
                g.map((item) => { n += item + "\n" });
                n += `----------------------\n`;
                n += `低调使用，后果自负`;
                let loading7 = await s.reply(n)
                await s.delMsg(loading7, { wait: 60 })
                break;
            case '系统命令':
                var n = ``;
                n += "*群主专用命令\n";
                n += "----------------------\n";
                var g = [
                    '重启	bncr版本	bncr状态	启动时间', 
                    'name	time	我的id	群id', 
                    '监听该群	屏蔽该群	回复该群	不回复该群', 
                    '环境变量 状态' 
                ];
                g.map((item) => { n += item + "\n" });
                n += `----------------------\n`;
                let loading8 = await s.reply(n)
                await s.delMsg(loading8, { wait: 60 })
                break;
            case '购物查券返利':
                let img9 = await s.reply({ 
                    type: 'image', 
                    path: "http://192.168.1.13:8080/imgs/static/9aYi1sV5.jpg", 
                    msg: "添加JDGrouop购物助手，享受更多优惠\nQQ号：2677583998" })
                let loading9 = await s.reply("添加JDGrouop购物助手，享受更多优惠\nQQ号：2677583998")
                await s.delMsg(loading9, { wait: 60 })
                await s.delMsg(img9, { wait: 60 })
                break;
/*            case '购物查券返利':
                const resp = await comFn._request({ url: 'http://xiaobai.klizi.cn/API/other/sjsc.php' });
                const { content, origin, author } = JSON.parse(resp);
                const replyText = `\t《${origin}》\n\t\t\t\t${author}\n${content}`;
                s.reply(replyText);
                break;
*/
        }
    }
};
