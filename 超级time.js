/**
 * @author jusbe
 * @team none
 * @name 超级time
 * @version 1.0.0
 * @description 超超超超级time
 * @rule ^time$
 * @admin false
 * @public true
 * @priority 10000
 * @disable false
 * @classification ["工具"]
 */

/* HideStart */

// const ConfigDB = new BncrPluginConfig(
//     BncrCreateSchema.object({
//         length: BncrCreateSchema.string().setTitle('密码长度').setDescription('固定长度(如8)、范围(如6-10)、可选长度(如6,8,10)').setDefault("8"),
//         includeSpecialChars: BncrCreateSchema.boolean().setTitle('包含特殊符号').setDescription('密码中是否包含特殊符号（如!@#$%等），默认不包含。').setDefault(false),
//         // redisURL: BncrCreateSchema.string().setTitle('Redis 地址').setDescription('如: redis://127.0.0.1:6379/0'),users: BncrCreateSchema.array(
//         // users: BncrCreateSchema.array(
//         //     BncrCreateSchema.object({
//         //         uid: BncrCreateSchema.string().setTitle('uid'),
//         //         ukey: BncrCreateSchema.string().setTitle('ukey')
//         //     })
//         // ).setTitle('账号信息').setDescription('uid1,ukey1 ...').setDefault([]),
//         // userWhite: BncrCreateSchema.string().setTitle('用户白名单').setDescription('如: uid1,uid2,uid3, ...'),
//         // groupWhite: BncrCreateSchema.string().setTitle('群组白名单').setDescription('如: groupid1,groupid2,groupid3, ...'),
//         // disHidePhone: BncrCreateSchema.boolean().setTitle('禁用手机脱敏').setDescription('').setDefault(false),
//     })
// );

// sysMethod.testModule(['redis','crypto','axios','qs'],{ install: true });
// const redis = require('redis');
// const crypto = require('crypto');
// const axios = require('axios');
// const qs = require('qs');

// const isUrl = (url) => { try { const u = new URL(url); return u.origin !== 'null' } catch (_) { return false } };
// const md5 = (str) => crypto.createHash('md5').update(str).digest('hex');

module.exports = async s => {
    // const { length: lengthSpec = "8",includeSpecialChars = false } = await ConfigDB.get();
    // if (!redisURL) return s.reply("请设置 Redis 地址");
    // s.reply(JSON.stringify({ redisURL,userWhite,groupWhite }))

    // const msg = await s.getMsg();
    // const msgId = s.getMsgId();
    // const isAdmin = await s.isAdmin();
    // const platfrom = s.getFrom();
    // const userId = s.getUserId();
    // const userName = s.getUserName();
    // const groupId = s.getGroupId();
    // const groupName = s.getGroupName();
    // await s.reply(JSON.stringify({ isAdmin,platfrom,userId,userName,groupId,groupName,msgId }))

    if ((await new BncrDB("jusbe.common").get("debug")) !== true) noConsole = () => { },console = { log: noConsole,debug: noConsole,error: noConsole };
    // BncrDB.prototype.getJsonByIM = async function ({ userId,platfrom = s.getFrom() }) { const keys = await this.keys(); if (!Array.isArray(keys)) return void 0; return await new Promise(async (resolve,_) => { for (const key of keys) { try { const data = JSON.parse(await this.get(key)); if (data[platfrom] === userId.toString()) resolve({ key,data }); } catch (_) { continue; }; }; resolve({}); }); };
    // BncrDB.prototype.refreshJson = async function (key,newData) { if (typeof newData !== 'object' || obj === null) throw new InvalidObjectError('obj'); let oldData; try { oldData = JSON.parse(await this.get(key)); } catch (_) { }; await this.set(key,JSON.stringify(Object.assign(oldData || {},newData))); };
    // const replyExit = (message = "") => s.reply(message).then(_ => Promise.reject('over...'));
    // const input = async (message = void 0,timeout = 120) => { if (message) await s.reply(message); const data = (await s.waitInput(_ => { },timeout)).getMsg(); if (data === "q" || data === "Q") return replyExit("退出"); return data; };

    function getCurrentTimeWithNano() {
        const now = new Date();
        now.setHours(now.getHours()+8)
        const hrtime = process.hrtime();
        const nanoseconds = hrtime[1].toString().padStart(9,'0');

        return `${now.toISOString().replace('Z','')}.${nanoseconds}Z`;
    }

    s.reply(getCurrentTimeWithNano().replace(/[A-Z]/g,' ').trim());

    // await sysMethod.sleep(param2); // 秒
    // await s.inlineSugar('重启'); //以触发者的身份向系统内部发送消息
    // sender.delMsg('id1', 'id2');
    // await sender.delMsg('id1', 'id2', { wait: 2 });
    // let newMsg = await sender.waitInput(() => { }, 30); //超时未发送 newMsg = null
    // newMsg.getMsg(); //获取监听到的信息
    // getAllForm() // 读取所有 form(表)名 返回一个 Array
    // keys() // 读取所有 key 返回一个 Array
    // sysMethod.getTime('hh:mm:ss'); //18:19:20
    // sysMethod.getTime('yyyy-MM-dd'); //2023-02-24
    // sysMethod.getTime('yyyy-MM-dd hh:mm:ss'); //2023-02-24 18:19:20
    // sysMethod.cron.isCron('0 0 8 * * *'); //true
    // sysMethod.cron.isCron('* * *'); //false
    // await sysMethod.npmInstall('request'); //会返回执行信息String
    // await sysMethod.npmInstall('request', { outConsole: true }); // 将会在控制台实时打印安装情况，返回结果为null
    // await sysMethod.testModule(['telegram', 'input']); //将只测试，返回结果
    // await sysMethod.testModule(['telegram', 'input'], { install: true }); //发现少模块自动安装

    // return 'next'  //继续向下匹配插件
};

/* HideEnd */
