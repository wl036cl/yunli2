/**
 * 域名，接口配置
 * Created by ll36 on 2017/8/16.
 */
const Prefix="/api";
const Suffix="JsonP";
const Config = {
    vue: {
        debug:true,
        devtools: true
    },
    apiUrl: 'http://yl.ll36.cn',
    //apiUrl:'http://localhost:22723',
    imgUrl:'http://yl.ll36.cn',
    videoUrl:'http://yl.ll36.cn',
    urlsEnum: {
        loginIn:Prefix+'/user/loginin'+Suffix,
        loginOut:Prefix+'/user/loginOut'+Suffix,
        register:Prefix+'/user/register'+Suffix,
        getUser:Prefix+'/user/getUser'+Suffix,
        //getWords:Prefix+'/word/getWords'+Suffix,
        getSport:Prefix+'/sport/getSport'+Suffix,
        editSport:Prefix+'/sport/addOrEditSport'+Suffix,
        deleteSport:Prefix+'/sport/deleteSport'+Suffix,
        getSports:Prefix+'/sport/getSports'+Suffix,
        getSportRecords:Prefix+'/sport/getRecords'+Suffix,
        getSportRecord:Prefix+'/sport/getRecord'+Suffix,
        editSportRecord:Prefix+'/sport/addOrEditRecord'+Suffix,
        deleteSportRecord:Prefix+'/sport/deleteRecord'+Suffix,
    }
};
module.exports = Config;