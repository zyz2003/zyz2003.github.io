/* 网站运行时间计时器 */
(function() {
    setInterval(() => {
        let now = new Date();
        
        // 旅行者1号距离计算
        let startDate = new Date("08/01/2022 00:00:00");
        let distance = Math.trunc(23400000000 + (now - startDate) / 1000 * 17);
        let au = (distance / 149600000).toFixed(6);
    
    // 网站运行时间计算
    let siteStartDate = new Date("08/18/2024 00:00:00");
    let totalSeconds = (now - siteStartDate) / 1000;
    let days = Math.floor(totalSeconds / 86400); // 86400 = 24*60*60
    let hours = Math.floor((totalSeconds % 86400) / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = Math.round(totalSeconds % 60);
    
    // 格式化时间（补零）
    hours = String(hours).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');
    seconds = String(seconds).padStart(2, '0');
    
    // 根据时间显示不同的状态图标
    let content = "";
    if (hours < 18 && hours >= 9) {
        // 工作时间（9:00-18:00）
        content = `
            <img class='boardsign' src='https://s1.aigei.com/src/img/png/dc/dc8ebbd3dd0345d7be3b211a676ebdf5.png?e=2051020800&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:OvNY-3WP9YXq7WBOirVBihb8cqA=' title='什么时候能够实现财富自由呀~' style='height: 20px;'>
            <br>
            <div style="font-size:13px;font-weight:bold">
                本站居然运行了 ${days} 天 ${hours} 小时 ${minutes} 分 ${seconds} 秒 
                <i id="heartbeat" class='fas fa-heartbeat'></i>
                <br>
                旅行者 1 号当前距离地球 ${distance} 千米，约为 ${au} 个天文单位 🚀
            </div>
        `;
    } else {
        // 休息时间
        content = `
            <img class='boardsign' src='https://sourcebucket.s3.ladydaily.com/badge/F小屋-下班休息啦.svg' title='下班了就该开开心心地玩耍~'>
            <br>
            <div style="font-size:13px;font-weight:bold">
                本站居然运行了 ${days} 天 ${hours} 小时 ${minutes} 分 ${seconds} 秒 
                <i id="heartbeat" class='fas fa-heartbeat'></i>
                <br>
                旅行者 1 号当前距离地球 ${distance} 千米，约为 ${au} 个天文单位 🚀
            </div>
        `;
    }
    
    // 更新页面元素
    const workboard = document.getElementById("workboard");
    if (workboard) {
        workboard.innerHTML = content;
    }
}, 1000);
})();