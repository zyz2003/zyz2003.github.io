/* 网站运行时间计时器 */
(function() {
    // 初始化DOM结构，只执行一次
    const workboard = document.getElementById("workboard");
    if (!workboard) return;
    
    // 创建基础HTML结构，包含静态元素（如图片）和动态内容的占位符
    workboard.innerHTML = `
        <div id="statusContainer" style="display: flex; align-items: center; justify-content: center; margin-bottom: 8px;">
            <img class='boardsign' src='https://s1.aigei.com/src/img/png/dc/dc8ebbd3dd0345d7be3b211a676ebdf5.png?e=2051020800&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:OvNY-3WP9YXq7WBOirVBihb8cqA=' style='height: 20px; margin-right: 8px;' title='你又来看我了呀😊~'>
            <span id="statusText" style="font-size:13px; font-weight:bold; color: var(--text-highlight-color);"></span>
        </div>
        <div id="runtimeContainer" style="font-size:13px;font-weight:bold">
            <span id="siteRuntime">本站居然运行了 0 天 00 小时 00 分 00 秒 </span>
            <i id="heartbeat" class='fas fa-heartbeat'></i>
            <br>
            <span id="voyagerDistance">旅行者 1 号当前距离地球 0 千米，约为 0.000000 个天文单位 🚀</span>
        </div>
    `;
    
    // 获取需要更新的元素引用
    const statusText = document.getElementById("statusText");
    const siteRuntime = document.getElementById("siteRuntime");
    const voyagerDistance = document.getElementById("voyagerDistance");
    
    // 每秒更新一次动态内容
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
        
        // 更新状态文本
        let status = "";
        if (hours < 18 && hours >= 9) {
            // 工作时间（9:00-18:00）
            status = "什么时候能够实现财富自由呀~";
        } else {
            // 休息时间
            status = "下班了就该开开心心地玩耍~";
        }
        statusText.textContent = status;
        
        // 更新运行时间
        siteRuntime.textContent = `本站居然运行了 ${days} 天 ${hours} 小时 ${minutes} 分 ${seconds} 秒 `;
        
        // 更新旅行者1号距离
        voyagerDistance.textContent = `旅行者 1 号当前距离地球 ${distance} 千米，约为 ${au} 个天文单位 🚀`;
    }, 1000);
})();