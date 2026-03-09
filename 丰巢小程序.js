/**
 * @author jusbe
 * @team none
 * @name 丰巢小程序
 * @version 1.0.0
 * @description 查询代取件信息，需要抓包。token有效期约3个月
 * @rule ^丰巢$
 * @admin false
 * @public true
 * @priority 0
 * @disable false
 * @classification ["工具"]
 */

/* HideStart */

const ConfigDB = new BncrPluginConfig(
    BncrCreateSchema.object({
        //   passwordLength: BncrCreateSchema.number().setTitle('密码长度').setDescription('生成的密码长度').setDefault(12),
        // redisURL: BncrCreateSchema.string().setTitle('Redis 地址').setDescription('如: redis://127.0.0.1:6379/0'),
        // userWhite: BncrCreateSchema.string().setTitle('用户白名单').setDescription('如: uid1,uid2,uid3, ...'),
        // groupWhite: BncrCreateSchema.string().setTitle('群组白名单').setDescription('如: groupid1,groupid2,groupid3, ...'),
        // users: BncrCreateSchema.array(
        //     BncrCreateSchema.object({
        //         uid: BncrCreateSchema.string().setTitle('uid'),
        //         ukey: BncrCreateSchema.string().setTitle('ukey')
        //     })
        // ).setTitle('账号信息').setDescription('uid1,ukey1 ...').setDefault([]),
        disHidePhone: BncrCreateSchema.boolean().setTitle('禁用手机脱敏').setDescription('').setDefault(false),
        disHideAddr: BncrCreateSchema.boolean().setTitle('禁用地址脱敏').setDescription('').setDefault(false),
    })
);

sysMethod.testModule(['uuid', 'axios', 'qs'], { install: true });
// const redis = require('redis');
// const crypto = require('crypto');
const qs = require('qs');
const axios = require('axios');
const fs = require('fs');
// const uuid = require('uuid');

// const isUrl = (url) => { try { const u = new URL(url); return u.origin !== 'null' } catch (_) { return false } };
// const md5 = (str) => crypto.createHash('md5').update(str).digest('hex');
// const randomBase64 = (size = 32) => crypto.randomBytes(size).toString('base64');
const replacerJson = (k, v) => v?.length > 2048 ? `${v?.slice(0, 25)} ...` : v;

module.exports = async s => {
    const { disHidePhone, disHideAddr } = await ConfigDB.get();
    // if (!redisURL) return s.reply("请设置 Redis 地址");
    // s.reply(JSON.stringify({ redisURL,userWhite,groupWhite }))

    const msg = await s.getMsg();
    const msgId = s.getMsgId();
    const isAdmin = await s.isAdmin();
    const platfrom = s.getFrom();
    const userId = s.getUserId();
    // const userName = s.getUserName();
    const groupId = s.getGroupId();
    // const groupName = s.getGroupName();
    // await s.reply(JSON.stringify({ isAdmin,platfrom,userId,userName,groupId,groupName,msgId }))

    if ((await new BncrDB("jusbe.common").get("debug")) !== true) noConsole = () => { }, console = { log: noConsole, debug: noConsole, error: noConsole };
    BncrDB.prototype.getJsonByIM = async function (id = userId, im = platfrom) { const keys = await this.keys(); if (!Array.isArray(keys)) return void 0; return await new Promise(async (resolve, _) => { for (const key of keys) { try { const data = JSON.parse(await this.get(key)); if (data[im] === id.toString()) resolve({ key, data }); } catch (_) { continue; }; }; resolve({}); }); };
    BncrDB.prototype.refreshJson = async function (key, newData) { if (typeof newData !== 'object' || newData === null) throw new InvalidObjectError('object'); let oldData; try { oldData = JSON.parse(await this.get(key)); } catch (_) { }; await this.set(key, JSON.stringify(Object.assign(oldData || {}, newData))); };
    const replyExit = (message = "") => s.reply(message).then(_ => Promise.reject('over...'));
    const input = async (message = void 0, timeout = 120) => { if (message) await s.reply(message); const data = (await s.waitInput(_ => { }, timeout)).getMsg(); if (data === "q" || data === "Q") return replyExit("退出"); return data; };

    const env = requireClass();

    const usersDB = new BncrDB("jusbe.fcboxWX.users");
    const { data: udata = {} } = await usersDB.getJsonByIM();
    if (!udata?.Authorization) return seToken();

    const $ = new env(udata.Authorization);
    await $.getUserInfo()
        .then(({ code, data, msg }) => code === 300100000 ? data : replyExit(code + msg))
        .catch(({ code, status, statusText, message }) => status === 401 ? s.reply(statusText ?? message).then(_ => seToken()) : replyExit(statusText ?? message));

    const totalPage = await $.getTotalPage();
    let output = `丰巢（待取：${totalPage.data.toPickTotal} / ${totalPage.data.total}）\n=======================`;
    if (!(totalPage.data.toPickTotal > 0)) return replyExit(output += "\n暂无待取订单");

    const topickPage = await $.getTopickPage();

    let obj = getUnique(
        topickPage.data.data,
        (existItem, item) =>
            existItem.address == item.address
    ).map(v => {
        return {
            address: v.address,
            data: getUnique(
                topickPage.data.data.filter(b => { return b.address == v.address }),
                (eit, it) =>
                    eit.clientMobile == it.clientMobile
            ).map(b => {
                return {
                    clientMobile: b.clientMobile,
                    data: new Array()
                }
            })
        }
    }).map(v => {
        v.data = v.data.map(b => {
            b.data = b.data.concat(
                topickPage.data.data.filter(m => {
                    return m.address == v.address && m.clientMobile == b.clientMobile
                })
            )
            return b
        })
        // s.reply(JSON.stringify(v))
        return v
    })
    output += "\n" + obj.map((v, vi) => {
        // 地址处理
        let vm = disHideAddr ? `🏠 ${v.address.slice(-13)}\n` : `🏠 ***${v.address.slice(-10)}\n`
        vm += v.data.map((b, bi) => {
            //电话处理
            let bm = `${(bi + 1) < v.data.length ? "┣" : "┗"} 📞 ${disHidePhone ? b.clientMobile : b.clientMobile.replace(/(1\d{2})\d{4}(\d{4})/, "$1****$2")}\n`
            bm += b.data.map((n, ni) => {
                let hd = (bi + 1) < v.data.length ? "┃" : "   "
                let nm
                // s.reply(JSON.stringify(n.children))
                if (n.children) {
                    nm = n.children.map(c => {
                        return `${hd} ┃ 🎁 ${c.companyName.replace(/中国/, "").slice(0, 2)}: ${c.expressId.slice(-14)}`
                    }).join("\n")
                } else {
                    nm = `${hd} ┃ 🎁 ${n.companyName.replace(/中国/, "").slice(0, 2)}: ${n.expressId.slice(-14)}`
                }
                // console.log(JSON.stringify(n.custodyFeeInfo))
                nm += `\n${hd} ${(ni + 1) < b.data.length ? "┣" : "┗"} 🔒 取件: ${n.code}` + (n.custodyFeeInfo.needPayCustodyFee === false && n.custodyFeeInfo.freeChargeTag !== null ? `（👑）` : `(${Math.floor((Date.parse(n.retentionTm) - Date.now()) / 1000 / 60 / 60)}H）`)
                return nm
            }).join("\n")
            return bm
        }).join("\n")
        return vm
    }).join("\n")
    return s.reply(output);

    async function seToken() {
        if (groupId && groupId !== "0") return replyExit("请私聊我设置你的token");

        const Authorization = await input("请抓包微信小程序【丰巢】任意请求头中的Authorization发给我（q 退出）:");
        const $ = new env(Authorization);
        const uinfo = await $.getUserInfo()
            .then(({ code, data, msg }) => code === 300100000 ? data : replyExit(msg))
            .catch(({ statusText, message }) => replyExit(statusText ?? message));

        await usersDB.refreshJson(uinfo.userId, Object.assign(uinfo, { Authorization }, Object.fromEntries([[platfrom, userId]])));
        return s.inlineSugar("丰巢");
    }



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

function getUnique(array, condition) { return array.filter((item, index, self) => index === self.findIndex((existItem) => condition(existItem, item))); };

function requireClass() {
    return class FCBOX {
        #commonAxios;
        constructor(Authorization) {
            this.#commonAxios = axios.create({
                baseURL: "https://webchatapp.fcbox.com",
                timeout: 5000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090a13) XWEB/9105',
                    'xweb_xhr': '1',
                    'Authorization': Authorization,
                    'Sec-Fetch-Site': 'cross-site',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Dest': 'empty',
                    'Accept-Language': 'zh-CN,zh;q=0.9'
                }
            });
            this.#commonAxios.interceptors.request.use(config => console.log(`📡 [丰巢小程序][${config.method.toLocaleUpperCase()}]`, config.url, config.params ? JSON.stringify(config.params, replacerJson) : "", config.data ? JSON.stringify(config.data, replacerJson) : "") || config);
            this.#commonAxios.interceptors.response.use(
                ({ config: { url, method }, data }) => console.log(`📄 [丰巢小程序][${method.toLocaleUpperCase()}]`, url, data ? JSON.stringify(data, replacerJson) : "") || data,
                ({ config: { method, url }, response: { status, statusText, data }, message, code }) => console.error(`📄 [丰巢小程序][${method.toLocaleUpperCase()}]`, url, statusText ?? message) || Promise.reject({ code, message, status, statusText })
            );
        };

        getUserInfo = () => this.#commonAxios.post("/base/personalCenter/userInfo");

        #pageQuery4Mini = (expressStatus, pageNo = 1, pageSize = 10, expressId = null) => this.#commonAxios.post("/post/express/pageQuery4Mini", qs.stringify({ expressStatus, pageNo, pageSize, expressId }));

        getTotalPage = () => this.#pageQuery4Mini(0);

        getTopickPage = () => this.#pageQuery4Mini(1);
    };
};

/* HideEnd */
