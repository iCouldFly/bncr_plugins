/**
 * @author jusbe
 * @team none
 * @name yourls
 * @version 1.0.0
 * @description 依赖》axios, crypto<br>说明》对接自己部署的YOURLS服务, 删除功能需要安装YOURLS插件： <a href="https://github.com/claytondaley/yourls-api-delete">yourls-api-delete</a><br>命令1》yourls - 查看最新的10条记录<br>命令2》yourls 短链或关键词 - 查询短链信息<br>命令3》yourls 新的链接 - 新建短链<br>命令4》yourls 新的链接 短链关键词 - 新建短链, 使用指定后缀, 指定后缀做为标题<br>命令5》yourls 新的链接 短链关键词 标题 - 新建短链, 使用指定后缀, 指定标题
 * @rule ^yourls$
 * @rule ^YOURLS$
 * @rule ^yourls +(\S+)$
 * @rule ^YOURLS +(\S+)$
 * @rule ^yourls +(\S+) +(\S+)$
 * @rule ^YOURLS +(\S+) +(\S+)$
 * @rule ^yourls +(\S+) +(\S+) +(\S+)$
 * @rule ^YOURLS +(\S+) +(\S+) +(\S+)$
 * @admin false
 * @public true
 * @priority 1
 * @disable false
 * @classification ["工具"]
 */

/* HideStart */

const ConfigDB = new BncrPluginConfig(
    BncrCreateSchema.object({
        local: BncrCreateSchema.string().setTitle('本地URL').setDescription('如: http://127.0.0.1:19820<br>本地地址, 用于加速插件。留空时取 host'),
        host: BncrCreateSchema.string().setTitle('公网URL').setDescription('如: https://u.jusbe.com<br>安装yourls时绑定的地址'),
        signature_token: BncrCreateSchema.string().setTitle('signature token').setDescription('Tools - Your secret signature token'),
        // includeSpecialChars: BncrCreateSchema.boolean().setTitle('包含特殊符号').setDescription('密码中是否包含特殊符号（如!@#$%等），默认不包含。').setDefault(false),
        // redisURL: BncrCreateSchema.string().setTitle('Redis 地址').setDescription('如: redis://127.0.0.1:6379/0'),users: BncrCreateSchema.array(
        // users: BncrCreateSchema.array(
        //     BncrCreateSchema.object({
        //         uid: BncrCreateSchema.string().setTitle('uid'),
        //         ukey: BncrCreateSchema.string().setTitle('ukey')
        //     })
        // ).setTitle('账号信息').setDescription('uid1,ukey1 ...').setDefault([]),
        // userWhite: BncrCreateSchema.string().setTitle('用户白名单').setDescription('如: uid1,uid2,uid3, ...'),
        // groupWhite: BncrCreateSchema.string().setTitle('群组白名单').setDescription('如: groupid1,groupid2,groupid3, ...'),
        // disHidePhone: BncrCreateSchema.boolean().setTitle('禁用手机脱敏').setDescription('').setDefault(false),
    })
);

// sysMethod.testModule(['redis','crypto','axios','qs'],{ install: true });
// const redis = require('redis');
const crypto = require('crypto');
const axios = require('axios');
// const qs = require('qs');

// const isUrl = (url) => { try { const u = new URL(url); return u.origin !== 'null' } catch (_) { return false } };
const md5 = (str) => crypto.createHash('md5').update(str).digest('hex');
const randomBase64 = (size = 32) => crypto.randomBytes(size).toString('base64');
const replacerJson = (k, v) => v?.length > 2048 ? `${v?.slice(0, 25)} ...` : v;

module.exports = async s => {
    const cfgDB = await ConfigDB.get();
    const {
        host,
        local = cfgDB.host,
        signature_token
    } = cfgDB;
    if (!host) return s.reply("请设置 公网URL");
    if (!signature_token) return s.reply("请设置 signature token");
    // s.reply(JSON.stringify({ redisURL,userWhite,groupWhite }))

    // const msg = await s.getMsg();
    // const msgId = s.getMsgId();
    // const isAdmin = await s.isAdmin();
    // const platfrom = s.getFrom();
    // const userId = s.getUserId();
    // const userName = s.getUserName();
    // const groupId = s.getGroupId();
    // const groupName = s.getGroupName();
    const param1 = s.param(1);
    const param2 = s.param(2);
    const param3 = s.param(3);
    // await s.reply(JSON.stringify({ isAdmin,platfrom,userId,userName,groupId,groupName,msgId }))

    if ((await new BncrDB("jusbe.common").get("debug")) !== true) noConsole = () => { }, console = { log: noConsole, debug: noConsole, error: noConsole };
    // BncrDB.prototype.getJsonByIM = async function ({ userId,platfrom = s.getFrom() }) { const keys = await this.keys(); if (!Array.isArray(keys)) return void 0; return await new Promise(async (resolve,_) => { for (const key of keys) { try { const data = JSON.parse(await this.get(key)); if (data[platfrom] === userId.toString()) resolve({ key,data }); } catch (_) { continue; }; }; resolve({}); }); };
    // BncrDB.prototype.refreshJson = async function (key,newData) { if (typeof newData !== 'object' || obj === null) throw new InvalidObjectError('obj'); let oldData; try { oldData = JSON.parse(await this.get(key)); } catch (_) { }; await this.set(key,JSON.stringify(Object.assign(oldData || {},newData))); };
    const replyExit = (message = "") => s.reply(message).then(_ => Promise.reject('over...'));
    const input = async (message = void 0, timeout = 120) => { if (message) await s.reply(message); const data = (await s.waitInput(_ => { }, timeout)).getMsg(); if (data === "q" || data === "Q") return replyExit("退出"); return data; };

    const Yourls = requireClass();
    const $ = new Yourls(local, host, signature_token);

    await $.version().catch(error => console.error(error) || replyExit(`YOURLS 服务器连接失败: ${error?.message}`));

    const hostname = new URL(host).hostname;
    if (param1 === "恢复") {
        const links = await new BncrDB("jusbe.yourls.backup").keys();
        for (const key in links) {
            const link = JSON.parse(links[key]);
            const { shorturl, url, title } = link;
            await addShortURL(url, shorturl.split("/").pop(), title);
        }
    } else if (!!param1) {
        // 解析
        if (param1.includes(hostname)) return showUrlStats(param1.split(hostname + '/').pop());
        else if (!/.+(\..+)+/.test(param1)) return showUrlStats(param1);

        // 新建
        return addShortURL(param1, param2, param3)
    } else {
        // await commonAxios.get('/yourls-api.php', { params: { action: 'db-stats' } }) // {"db-stats":{"total_links":1,"total_clicks":"10"},"statusCode":200,"message":"success"}
        let links = await $.stats();
        links = Object.entries(links).map(([k, v]) => v);
        if (!links?.length) return replyExit("请先添加短链");

        // backup
        if (links.length) links.map(item => new BncrDB("jusbe.yourls.backup").set(item.shorturl, JSON.stringify(item)));

        const output = links.map(({ shorturl, title }, i) => `${i + 1}. ${title}\n   ${shorturl}`).join('\n-------------------------------\n');
        const fn = await input(output + "\n-------------------------------\n+》添加    -n》删除    q》退出");

        if (fn === "+") return replyExit("请给我发以下命令添加新的短链（[] 为可选参数）:\nyourls 链接 [短链关键词] [备注]");
        else if (fn.startsWith("-")) return delShortURL(links[parseInt(fn.slice(1)) - 1]);
        else return replyExit("输入有误");
    };

    function addShortURL(url, keyword, title) {
        keyword = keyword || randomBase64().slice(0, 8);
        title = title || keyword;
        console.log('handleShorturl:', url, keyword, title);
        return $.shorturl(url, keyword, title).then(replyExit);
        // .catch(({ message,name,code,response: { status,statusText,headers,config,request,data:{message} } }) => console.error({ status,statusText,data }));
    };

    function delShortURL({ title, shorturl, url }) {
        if (!title || !shorturl) return replyExit("输入有误！");
        return $.delete(shorturl.split("/").pop()).then(({ statusCode, message }) => {
            new BncrDB("jusbe.yourls.backup").del(shorturl);
            replyExit(statusCode === 200 ? `已删除短链: ${title}` : message);
        });
    }

    function showUrlStats(shorturl) {
        return $.urlStats(shorturl)
            .then(link => replyExit(link ?
                Object.entries(link).map(([k, v]) => `${k}: ${v}`).join('\n') :
                `没有找到该短链接: ${shorturl}\n请输入完整的 shorturl 或 keyword`
            ));
    };

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

    function requireClass() {
        return class yourls {
            #commonAxios;

            constructor(local, web, token) {
                this.url = web;
                this.local = local;
                this.#commonAxios = axios.create({ baseURL: (local || web).replace(/\/$/, ''), timeout: 10000 });
                this.#commonAxios.interceptors.request.use(
                    config => {
                        console.log(`📡 [YOURLS][${config.method.toLocaleUpperCase()}]`, config.url, config.params ? JSON.stringify(config.params, replacerJson) : "", config.data ? JSON.stringify(config.data, replacerJson) : "");
                        const timestamp = Date.now().toString().slice(0, -3);
                        config.params = {
                            ...config.params,
                            timestamp,
                            signature: md5(`${token}${timestamp}`),
                            format: 'json',
                        };
                        return config;
                    }
                );
                this.#commonAxios.interceptors.response.use(
                    ({ config: { url, method }, data }) => console.log(`📄 [YOURLS][${method.toLocaleUpperCase()}]`, url, data ? JSON.stringify(data, replacerJson) : "") || data,
                    error => {
                        console.error(`📄 [YOURLS][${error.config.method.toLocaleUpperCase()}]`, error?.config?.url, error?.response?.data?.error ?? error.message);
                        if (error?.response?.data?.message) return replyExit(error.response.data.message)
                        else if (error?.message) return replyExit("短链查询失败: " + error.message)
                        return Promise.reject(error);
                    }
                );
            };

            // {"version":"1.9.2"}
            version = () => this.#commonAxios.get('/yourls-api.php', { params: { action: 'version' } });

            stats = (limit = 10, filter = 'last') => this.#commonAxios.get('/yourls-api.php', { params: { action: 'stats', filter, limit } })
                .then(data => data?.links ?? {});

            // {"db-stats":{"total_links":1,"total_clicks":"10"},"statusCode":200,"message":"success"}
            dbStats = () => this.#commonAxios.get('/yourls-api.php', { params: { action: 'db-stats' } });

            // {"statusCode":200,"message":"success","link":{"shorturl":"https://u.3681537.xyz/xiuxian","url":"http://183.66.27.14:56242","title":"我的文字修仙全靠刷","timestamp":"2025-06-16 01:37:26","ip":"172.18.0.1","clicks":0}}
            urlStats = (shorturl) => this.#commonAxios.get('/yourls-api.php', { params: { action: 'url-stats', shorturl: shorturl.toLocaleLowerCase() } })
                .then(({ link, message, errorCode }) => link ? link : Promise.reject({ message: message || errorCode || `没有找到该短链接: ${shorturl}\n请输入完整的 shorturl 或 keyword` }));

            shorturl = (url, keyword, title) => this.#commonAxios.get('/yourls-api.php', { params: { action: 'shorturl', url, keyword: keyword.toLocaleLowerCase(), title } })
                .then(({ shorturl, message, errorCode }) => shorturl ? shorturl : Promise.reject({ message: message || errorCode || '未知错误' }));

            delete = (keyword) => this.#commonAxios.get('/yourls-api.php', { params: { action: 'delete', shorturl: keyword.split("/").pop().toLocaleLowerCase() } });
        };
    };
};

/* HideEnd */
