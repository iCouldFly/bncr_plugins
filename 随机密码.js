/**
 * @author jusbe
 * @team none
 * @name 随机密码
 * @version 1.0.0
 * @description 命令》随机密码：生成一个符合指定规则的随机密码<br>说明》可自定义密码长度和是否包含特殊符号。
 * @rule ^随机密码$
 * @admin false
 * @public true
 * @priority 1
 * @disable false
 * @classification ["工具"]
 */

/* HideStart */

const ConfigDB = new BncrPluginConfig(
    BncrCreateSchema.object({
        length: BncrCreateSchema.string().setTitle('密码长度').setDescription('固定长度(如8)、范围(如6-10)、可选长度(如6,8,10)').setDefault("8"),
        includeSpecialChars: BncrCreateSchema.boolean().setTitle('包含特殊符号').setDescription('密码中是否包含特殊符号（如!@#$%等），默认不包含。').setDefault(false),
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
// const crypto = require('crypto');
// const axios = require('axios');
// const qs = require('qs');

// const isUrl = (url) => { try { const u = new URL(url); return u.origin !== 'null' } catch (_) { return false } };
// const md5 = (str) => crypto.createHash('md5').update(str).digest('hex');

module.exports = async s => {
    const { length: lengthSpec = "8",includeSpecialChars = false } = await ConfigDB.get();
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

    let actualLength = 0;

    // 1. Fixed length (e.g., "8")
    if (/^\d+$/.test(lengthSpec)) {
        actualLength = parseInt(lengthSpec,10);
        console.log(`固定长度模式: ${actualLength}`);
    }
    // 2. Range length (e.g., "6-10")
    else if (/^(\d+)-(\d+)$/.test(lengthSpec)) {
        const parts = lengthSpec.match(/^(\d+)-(\d+)$/);
        let min = parseInt(parts[1],10);
        let max = parseInt(parts[2],10);
        if (min > max) { // Swap if min is greater than max
            [min,max] = [max,min];
        }
        if (min === max) {
            actualLength = min;
        } else {
            actualLength = Math.floor(Math.random() * (max - min + 1)) + min;
        }
        console.log(`范围长度模式 (${min}-${max}): ${actualLength}`);
    }
    // 3. List of lengths (e.g., "6,8,10")
    else if (/^(\d+)(,\s*\d+)*$/.test(lengthSpec)) {
        const lengths = lengthSpec.split(',')
            .map(s => parseInt(s.trim(),10))
            .filter(n => !isNaN(n) && n > 0);
        if (lengths.length > 0) {
            actualLength = lengths[Math.floor(Math.random() * lengths.length)];
            console.log(`可选长度模式 (${lengths.join(',')}): ${actualLength}`);
        } else {
            return s.reply(`错误：密码长度参数 "${lengthSpec}" 格式无效或未包含有效长度。`);
        }
    }
    // Invalid format
    else {
        return s.reply(`错误：密码长度参数 "${lengthSpec}" 格式无法识别。请使用如 "8", "6-10", 或 "6,8,10" 的格式。`);
    };

    if (actualLength <= 0) {
        return s.reply(`错误：计算得到的密码长度为 ${actualLength}，必须为正数。请检查长度配置。`);
    }
    if (actualLength > 128) { // Arbitrary upper limit to prevent abuse
        console.log(`警告：请求的密码长度 ${actualLength} 过长，限制为128。`);
        actualLength = 128;
    };


    const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
    const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numericChars = "0123456789";
    const specialCharsSet = "!@#$%^&*()_+-=[]{}|;:,.<>?"; // You can customize this set

    let charPool = lowerCaseChars + upperCaseChars + numericChars;
    if (includeSpecialChars) {
        charPool += specialCharsSet;
        console.log("包含特殊字符");
    } else {
        console.log("不包含特殊字符");
    }

    if (charPool.length === 0) { // Should not happen with default sets
        return s.reply("错误：字符池为空，无法生成密码。");
    }

    let password = "";
    // Ensure at least one of each selected type if length allows and types are selected
    // This makes passwords slightly less random but often more "compliant"
    let guaranteedChars = [];
    if (actualLength >= 1) guaranteedChars.push(lowerCaseChars[Math.floor(Math.random() * lowerCaseChars.length)]);
    if (actualLength >= 2) guaranteedChars.push(upperCaseChars[Math.floor(Math.random() * upperCaseChars.length)]);
    if (actualLength >= 3) guaranteedChars.push(numericChars[Math.floor(Math.random() * numericChars.length)]);
    if (includeSpecialChars && actualLength >= guaranteedChars.length + 1) {
        guaranteedChars.push(specialCharsSet[Math.floor(Math.random() * specialCharsSet.length)]);
    }

    // Fill remaining length with random characters from the pool
    const remainingLength = actualLength - guaranteedChars.length;
    for (let i = 0; i < remainingLength; i++) {
        password += charPool.charAt(Math.floor(Math.random() * charPool.length));
    }

    // Combine guaranteed characters with the rest and shuffle
    password = (password + guaranteedChars.join('')).split('');

    // Fisher-Yates (Knuth) Shuffle
    for (let i = password.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [password[i],password[j]] = [password[j],password[i]];
    }
    password = password.join('');

    // If the initial fill made the password too short due to many guaranteed types and small length
    // (e.g. length 2, but 3 guaranteed types selected), pad it out again
    // This case is mostly handled by the `actualLength >= X` checks above for guaranteedChars
    if (password.length < actualLength) {
        let passArray = password.split('');
        for (let i = password.length; i < actualLength; i++) {
            passArray.push(charPool.charAt(Math.floor(Math.random() * charPool.length)));
        }
        // Re-shuffle if padded
        for (let i = passArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [passArray[i],passArray[j]] = [passArray[j],passArray[i]];
        }
        password = passArray.join('');
    }


    s.reply(password);
    console.log(`生成密码: ${password}`);


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
