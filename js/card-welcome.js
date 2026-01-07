window.IP_CONFIG = {
    API_KEY: 'NnBs41sEUMzUHl4x3J2Z1V1YRY', // 你的新 API 密钥
    BLOG_LOCATION: {
        lng:  113.70172693806433, // 博主经度（郑州附近）
        lat: 34.801591453017345   // 博主纬度
    },
    CACHE_DURATION: 1000 * 60 * 60, // 缓存1小时
    HOME_PAGE_ONLY: true, // 仅首页显示
};

const insertAnnouncementComponent = () => {
    const announcementCards = document.querySelectorAll('.card-widget.card-announcement');
    if (!announcementCards.length) return;

    if (IP_CONFIG.HOME_PAGE_ONLY && !isHomePage()) {
        announcementCards.forEach(card => card.remove());
        return;
    }
    
    if (!document.querySelector('#welcome-info')) return;
    fetchIpInfo();
};

const getWelcomeInfoElement = () => document.querySelector('#welcome-info');

// ✅ 使用你提供的新 API
const fetchIpData = async () => {
    const url = `https://api.nsmao.net/api/ipip/query?key=${encodeURIComponent(IP_CONFIG.API_KEY)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('网络响应异常');

    const result = await response.json();
    if (result.code !== 200) {
        throw new Error(result.msg || 'API 返回错误');
    }

    const { data } = result;
    // 注意：新 API 中字段名为 province/city，需映射为 prov/city 以兼容原逻辑
    return {
        ip: data.ip || '',
        data: {
            lng: parseFloat(data.lng) || 0,
            lat: parseFloat(data.lat) || 0,
            country: data.country || '未知',
            prov: data.province || '未知', // 原代码用 prov
            city: data.city || '未知'
        }
    };
};

const showWelcome = ({ data, ip }) => {
    if (!data) return showErrorMessage();

    const { lng, lat, country, prov, city } = data;
    const welcomeInfo = getWelcomeInfoElement();
    if (!welcomeInfo) return;

    const dist = calculateDistance(lng, lat);
    const ipDisplay = formatIpDisplay(ip);
    const pos = formatLocation(country, prov, city);

    welcomeInfo.style.display = 'block';
    welcomeInfo.style.height = 'auto';
    welcomeInfo.innerHTML = generateWelcomeMessage(pos, dist, ipDisplay, country, prov, city);
};

const calculateDistance = (lng, lat) => {
    if (!lng || !lat) return '未知';
    const R = 6371; // 地球半径(km)
    const rad = Math.PI / 180;
    const dLat = (lat - IP_CONFIG.BLOG_LOCATION.lat) * rad;
    const dLon = (lng - IP_CONFIG.BLOG_LOCATION.lng) * rad;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(IP_CONFIG.BLOG_LOCATION.lat * rad) * Math.cos(lat * rad) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const formatIpDisplay = (ip) => ip.includes(":") ? "<br>好复杂，咱看不懂~(ipv6)" : ip;

const formatLocation = (country, prov, city) => {
    if (!country) return '神秘地区';
    // 去掉省、市、自治区、特别行政区等后缀
    const cleanedProv = prov.replace(/省|市|自治区|特别行政区/g, '').trim();
    const cleanedCity = city.replace(/省|市|自治区|特别行政区/g, '').trim();
    return country === "中国" ? `${cleanedProv} ${cleanedCity}` : country;
};

const generateWelcomeMessage = (pos, dist, ipDisplay, country, prov, city) => `
    <div style="font-size: 1.1em; margin-bottom: 6px;">
        欢迎来自 <b><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mrow><mi>p</mi><mi>o</mi><mi>s</mi></mrow><mo>&lt;</mo><mi mathvariant="normal">/</mi><mi>b</mi><mo>&gt;</mo><mtext>的朋友💖</mtext></mrow><annotation encoding="application/x-tex">{pos}&lt;/b&gt; 的朋友 💖</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7335em;vertical-align:-0.1944em;"></span><span class="mord"><span class="mord mathnormal">p</span><span class="mord mathnormal">os</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">&lt;</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">/</span><span class="mord mathnormal">b</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">&gt;</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord cjk_fallback">的朋友</span><span class="mord">💖</span></span></span></span>    </div>
    <div style="margin: 4px 0; opacity: 0.9;">
        你当前距博主约 <b><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mrow><mi>d</mi><mi>i</mi><mi>s</mi><mi>t</mi></mrow><mo>&lt;</mo><mi mathvariant="normal">/</mi><mi>b</mi><mo>&gt;</mo><mtext>公里</mtext></mrow><annotation encoding="application/x-tex">{dist}&lt;/b&gt; 公里</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7335em;vertical-align:-0.0391em;"></span><span class="mord"><span class="mord mathnormal">d</span><span class="mord mathnormal">i</span><span class="mord mathnormal">s</span><span class="mord mathnormal">t</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">&lt;</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">/</span><span class="mord mathnormal">b</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">&gt;</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord cjk_fallback">公里</span></span></span></span>    </div>
    <div style="margin: 4px 0; font-size: 0.95em;">
        <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>g</mi><mi>e</mi><mi>t</mi><mi>T</mi><mi>i</mi><mi>m</mi><mi>e</mi><mi>G</mi><mi>r</mi><mi>e</mi><mi>e</mi><mi>t</mi><mi>i</mi><mi>n</mi><mi>g</mi><mo stretchy="false">(</mo><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">{getTimeGreeting()}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mord mathnormal">e</span><span class="mord mathnormal" style="margin-right:0.13889em;">tT</span><span class="mord mathnormal">im</span><span class="mord mathnormal">e</span><span class="mord mathnormal">G</span><span class="mord mathnormal">ree</span><span class="mord mathnormal">t</span><span class="mord mathnormal">in</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mopen">(</span><span class="mclose">)</span></span></span></span></span>    </div>
    <div style="margin: 8px 0; padding: 10px; background: rgba(0,0,0,0.03); border-radius: 8px; border-left: 3px solid var(--anzhiyu-main);">
        <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mrow><mi>g</mi><mi>e</mi><mi>t</mi><mi>G</mi><mi>r</mi><mi>e</mi><mi>e</mi><mi>t</mi><mi>i</mi><mi>n</mi><mi>g</mi><mo stretchy="false">(</mo><mi>c</mi><mi>o</mi><mi>u</mi><mi>n</mi><mi>t</mi><mi>r</mi><mi>y</mi><mo separator="true">,</mo><mi>p</mi><mi>r</mi><mi>o</mi><mi>v</mi><mo separator="true">,</mo><mi>c</mi><mi>i</mi><mi>t</mi><mi>y</mi><mo stretchy="false">)</mo></mrow><mtext>🍂</mtext></mrow><annotation encoding="application/x-tex">{getGreeting(country, prov, city)}🍂</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mord mathnormal">e</span><span class="mord mathnormal">tG</span><span class="mord mathnormal">ree</span><span class="mord mathnormal">t</span><span class="mord mathnormal">in</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mopen">(</span><span class="mord mathnormal">co</span><span class="mord mathnormal">u</span><span class="mord mathnormal">n</span><span class="mord mathnormal">t</span><span class="mord mathnormal" style="margin-right:0.03588em;">ry</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">p</span><span class="mord mathnormal">ro</span><span class="mord mathnormal" style="margin-right:0.03588em;">v</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">c</span><span class="mord mathnormal">i</span><span class="mord mathnormal">t</span><span class="mord mathnormal" style="margin-right:0.03588em;">y</span><span class="mclose">)</span></span><span class="mord">🍂</span></span></span></span>    </div>
    <div style="margin: 6px 0; font-size: 0.95em; opacity: 0.95; color: var(--anzhiyu-main);">
        期待分享你的城市故事~ 🏙️
    </div>
    <div style="margin-top: 8px; font-size: 0.85em; opacity: 0.7;">
        IP: <b class="ip-address"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mrow><mi>i</mi><mi>p</mi><mi>D</mi><mi>i</mi><mi>s</mi><mi>p</mi><mi>l</mi><mi>a</mi><mi>y</mi></mrow><mo>&lt;</mo><mi mathvariant="normal">/</mi><mi>b</mi><mo>&gt;</mo></mrow><annotation encoding="application/x-tex">{ipDisplay}&lt;/b&gt;</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord"><span class="mord mathnormal">i</span><span class="mord mathnormal">p</span><span class="mord mathnormal" style="margin-right:0.02778em;">D</span><span class="mord mathnormal">i</span><span class="mord mathnormal">s</span><span class="mord mathnormal" style="margin-right:0.01968em;">pl</span><span class="mord mathnormal">a</span><span class="mord mathnormal" style="margin-right:0.03588em;">y</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">&lt;</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">/</span><span class="mord mathnormal">b</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">&gt;</span></span></span></span>    </div>
`;

const addStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        #welcome-info {
            user-select: none;
            display: flex;
            justify-content: center;
            align-items: center;
            height: auto;
            min-height: 220px;
            padding: 20px;
            margin-top: 10px;
            margin-bottom: 10px;
            border-radius: 16px;
            background: linear-gradient(135deg, var(--anzhiyu-background) 0%, var(--anzhiyu-card-bg) 100%);
            border: 1px solid var(--anzhiyu-card-border);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        #welcome-info:hover {
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
            transform: translateY(-2px);
        }
        .loading-spinner {
            width: 60px;
            height: 60px;
            border: 4px solid rgba(0, 0, 0, 0.08);
            border-radius: 50%;
            border-top: 4px solid var(--anzhiyu-main);
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .ip-address {
            filter: blur(5px);
            transition: all 0.3s ease;
            border-radius: 4px;
            padding: 2px 6px;
            background-color: rgba(0, 0, 0, 0.05);
        }
        .ip-address:hover {
            filter: blur(0);
            background-color: rgba(0, 0, 0, 0.1);
        }
        .error-message {
            color: #ff6565;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .error-message p,
        .permission-dialog p {
            margin: 8px 0;
            line-height: 1.5;
        }
        .error-icon {
            font-size: 3.5rem;
            margin-bottom: 10px;
            opacity: 0.8;
        }
        #retry-button {
            margin: 0 5px;
            color: var(--anzhiyu-main);
            transition: all 0.3s ease;
            cursor: pointer;
            font-size: 1.1em;
        }
        #retry-button:hover {
            transform: rotate(180deg) scale(1.2);
            opacity: 0.9;
        }
        .permission-dialog {
            text-align: center;
            padding: 20px;
        }
        .permission-dialog button {
            margin: 15px 8px;
            padding: 8px 20px;
            border: none;
            border-radius: 20px;
            background-color: var(--anzhiyu-main);
            color: white;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        .permission-dialog button:hover {
            opacity: 0.9;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        #welcome-info b {
            color: var(--anzhiyu-main);
            font-weight: 600;
        }
        #welcome-info br {
            margin-bottom: 8px;
        }
    `;
    document.head.appendChild(style);
};

const showLoadingSpinner = () => {
    const el = document.querySelector("#welcome-info");
    if (el) el.innerHTML = '<div class="loading-spinner"></div>';
};

// 缓存
const IP_CACHE_KEY = 'ip_info_cache';
const getIpInfoFromCache = () => {
    const cached = localStorage.getItem(IP_CACHE_KEY);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > IP_CONFIG.CACHE_DURATION) {
        localStorage.removeItem(IP_CACHE_KEY);
        return null;
    }
    return data;
};
const setIpInfoCache = (data) => {
    localStorage.setItem(IP_CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
};

// 直接默认允许访问，不需要用户授权
const fetchIpInfo = async () => {
    showLoadingSpinner();
    
    try {
        // 确保greetings配置已加载
        await loadGreetings();
        
        const cached = getIpInfoFromCache();
        if (cached) {
            showWelcome(cached);
            return;
        }

        const data = await fetchIpData();
        setIpInfoCache(data);
        showWelcome(data);
    } catch (error) {
        console.error('获取IP信息失败:', error);
        showErrorMessage('获取地理位置失败，请重试');
    }
};

// 引入问候语配置文件
const loadGreetings = () => {
    return new Promise((resolve, reject) => {
        // 检查greetings是否已经加载
        if (typeof window.greetings !== 'undefined') {
            resolve();
            return;
        }
        
        // 如果script标签已存在，直接返回
        if (document.querySelector('script[src="/js/greetings.js"]')) {
            // 轮询检查greetings是否可用
            const checkInterval = setInterval(() => {
                if (typeof window.greetings !== 'undefined') {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);
            setTimeout(() => {
                clearInterval(checkInterval);
                reject(new Error('Failed to load greetings'));
            }, 5000);
            return;
        }
        
        // 创建并加载script标签
        const script = document.createElement('script');
        script.src = '/js/greetings.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
};

const getGreeting = (country, province, city) => {
    // 清理省份和城市名称，去掉省、市、自治区等后缀
    const cleanProvince = province.replace(/省|市|自治区|特别行政区/g, '').trim();
    const cleanCity = city.replace(/省|市|自治区|特别行政区/g, '').trim();
    
    // 确保window.greetings可用
    if (typeof window.greetings === 'undefined') {
        return '欢迎来到我的博客！';
    }
    
    const countryGreeting = window.greetings[country] || window.greetings["其他"];
    if (typeof countryGreeting === 'string') return countryGreeting;
    const provinceGreeting = countryGreeting[cleanProvince] || countryGreeting["其他"];
    if (typeof provinceGreeting === 'string') return provinceGreeting;
    return provinceGreeting[cleanCity] || provinceGreeting["其他"] || countryGreeting["其他"];
};

const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return "早上好🌤️ ，一日之计在于晨";
    if (hour < 13) return "中午好☀️ ，记得午休喔~";
    if (hour < 17) return "下午好🕞 ，饮茶先啦！";
    if (hour < 19) return "即将下班🚶‍♂️，记得按时吃饭~";
    return "晚上好🌙 ，夜生活嗨起来！";
};

const showErrorMessage = (message = '抱歉，无法获取信息') => {
    const el = document.getElementById("welcome-info");
    el.innerHTML = `
        <div class="error-message">
            <div class="error-icon">😕</div>
            <p><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mrow><mi>m</mi><mi>e</mi><mi>s</mi><mi>s</mi><mi>a</mi><mi>g</mi><mi>e</mi></mrow><mo>&lt;</mo><mi mathvariant="normal">/</mi><mi>p</mi><mo>&gt;</mo></mrow><annotation encoding="application/x-tex">{message}&lt;/p&gt;</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7335em;vertical-align:-0.1944em;"></span><span class="mord"><span class="mord mathnormal">m</span><span class="mord mathnormal">ess</span><span class="mord mathnormal">a</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mord mathnormal">e</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">&lt;</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">/</span><span class="mord mathnormal">p</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">&gt;</span></span></span></span>            <p>请<i id="retry-button" class="fa-solid fa-arrows-rotate"></i>重试或检查网络连接</p>
        </div>
    `;
    document.getElementById('retry-button')?.addEventListener('click', fetchIpInfo);
};

const isHomePage = () => {
    return window.location.pathname === '/' || window.location.pathname === '/index.html';
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    addStyles();
    insertAnnouncementComponent();
    document.addEventListener('pjax:complete', insertAnnouncementComponent);
});