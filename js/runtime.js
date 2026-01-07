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
            // <img class='boardsign' src='https://s1.aigei.com/src/img/png/dc/dc8ebbd3dd0345d7be3b211a676ebdf5.png?e=2051020800&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:OvNY-3WP9YXq7WBOirVBihb8cqA=' title='什么时候能够实现财富自由呀~' style='height: 20px;'>
            // <br>

        content = `
            <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 8px;">
                <img class='boardsign' src='https://s1.aigei.com/src/img/png/dc/dc8ebbd3dd0345d7be3b211a676ebdf5.png?e=2051020800&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:OvNY-3WP9YXq7WBOirVBihb8cqA=' style='height: 20px; margin-right: 8px;' title='你又来看我了呀😊~'>
                <span style="font-size:13px; font-weight:bold; color: var(--text-highlight-color);">什么时候能够实现财富自由呀~</span>
            </div>
            <div style="font-size:13px;font-weight:bold">
                本站居然运行了 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mrow><mi>d</mi><mi>a</mi><mi>y</mi><mi>s</mi></mrow><mtext>天</mtext></mrow><annotation encoding="application/x-tex">{days} 天 </annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord"><span class="mord mathnormal">d</span><span class="mord mathnormal">a</span><span class="mord mathnormal">ys</span></span><span class="mord cjk_fallback">天</span></span></span></span>{hours} 小时 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mrow><mi>m</mi><mi>i</mi><mi>n</mi><mi>u</mi><mi>t</mi><mi>e</mi><mi>s</mi></mrow><mtext>分</mtext></mrow><annotation encoding="application/x-tex">{minutes} 分 </annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord"><span class="mord mathnormal">min</span><span class="mord mathnormal">u</span><span class="mord mathnormal">t</span><span class="mord mathnormal">es</span></span><span class="mord cjk_fallback">分</span></span></span></span>{seconds} 秒 
                <i id="heartbeat" class='fas fa-heartbeat'></i>
                <br>
                旅行者 1 号当前距离地球 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mrow><mi>d</mi><mi>i</mi><mi>s</mi><mi>t</mi><mi>a</mi><mi>n</mi><mi>c</mi><mi>e</mi></mrow><mtext>千米，约为</mtext></mrow><annotation encoding="application/x-tex">{distance} 千米，约为 </annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord"><span class="mord mathnormal">d</span><span class="mord mathnormal">i</span><span class="mord mathnormal">s</span><span class="mord mathnormal">t</span><span class="mord mathnormal">an</span><span class="mord mathnormal">ce</span></span><span class="mord cjk_fallback">千米，约为</span></span></span></span>{au} 个天文单位 🚀
            </div>
        `;
    } else {
        // 休息时间
        content = `
            <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 8px;">
                <img class='boardsign' src='https://s1.aigei.com/src/img/png/dc/dc8ebbd3dd0345d7be3b211a676ebdf5.png?e=2051020800&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:OvNY-3WP9YXq7WBOirVBihb8cqA=' style='height: 20px; margin-right: 8px;'>
                <span style="font-size:13px; font-weight:bold; color: var(--text-highlight-color);">下班了就该开开心心地玩耍~</span>
            </div>
            <div style="font-size:13px;font-weight:bold">
                本站居然运行了 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mrow><mi>d</mi><mi>a</mi><mi>y</mi><mi>s</mi></mrow><mtext>天</mtext></mrow><annotation encoding="application/x-tex">{days} 天 </annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord"><span class="mord mathnormal">d</span><span class="mord mathnormal">a</span><span class="mord mathnormal">ys</span></span><span class="mord cjk_fallback">天</span></span></span></span>{hours} 小时 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mrow><mi>m</mi><mi>i</mi><mi>n</mi><mi>u</mi><mi>t</mi><mi>e</mi><mi>s</mi></mrow><mtext>分</mtext></mrow><annotation encoding="application/x-tex">{minutes} 分 </annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord"><span class="mord mathnormal">min</span><span class="mord mathnormal">u</span><span class="mord mathnormal">t</span><span class="mord mathnormal">es</span></span><span class="mord cjk_fallback">分</span></span></span></span>{seconds} 秒 
                <i id="heartbeat" class='fas fa-heartbeat'></i>
                <br>
                旅行者 1 号当前距离地球 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mrow><mi>d</mi><mi>i</mi><mi>s</mi><mi>t</mi><mi>a</mi><mi>n</mi><mi>c</mi><mi>e</mi></mrow><mtext>千米，约为</mtext></mrow><annotation encoding="application/x-tex">{distance} 千米，约为 </annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord"><span class="mord mathnormal">d</span><span class="mord mathnormal">i</span><span class="mord mathnormal">s</span><span class="mord mathnormal">t</span><span class="mord mathnormal">an</span><span class="mord mathnormal">ce</span></span><span class="mord cjk_fallback">千米，约为</span></span></span></span>{au} 个天文单位 🚀
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