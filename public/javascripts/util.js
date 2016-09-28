function isPhone(phone) {
    var phoneRe = /^\d{11}$/;
    return phoneRe.test(phone);
}
function isEmail(str){ 
    var reg = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/;
    return reg.test(str); 
}

var config= {
    entry: ["", "接力机器人竞赛（本科院校组）","接力机器人竞赛（高职高专组）","创意机器人竞赛","无人驾驶车竞赛（基础竞速）","无人驾驶车竞赛（高级竞速）","无人驾驶车竞赛（跟车）","无人驾驶车竞赛（超车）"]
};
