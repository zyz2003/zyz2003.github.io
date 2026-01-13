(function() {
  // DOM元素
  let modal = null;
  let mask = null;
  
  // 默认配置（作为后备值，当GLOBAL_CONFIG不可用时使用）
  // 会被GLOBAL_CONFIG中的customSetting配置覆盖
  let defaultConfig = {
    background_day: 'https://cdn.jsdelivr.net/gh/zyz2003/CDN-Respository@main/images/95B6A6A6E163D50B92295B6E65E609F5.JPG',
    background_night: 'https://cdn.jsdelivr.net/gh/zyz2003/CDN-Respository@main/images/9A60B95081CBBEC139E6B556005C5604.jpg',
    card_opacity: 0.6,
    enable_canvas_nest: true,
    global_font: 'ZihunBaiGeTianXing, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    code_font: 'consolas, ZihunBaiGeTianXing, "Microsoft YaHei", "WenQuanYi Micro Hei"',
    blog_title_font: 'ZihunBaiGeTianXing, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
  };
  
  // 从GLOBAL_CONFIG获取配置，覆盖默认值
  if (typeof GLOBAL_CONFIG !== 'undefined' && GLOBAL_CONFIG.customSetting && GLOBAL_CONFIG.customSetting.default) {
    defaultConfig = {
      ...defaultConfig,
      ...GLOBAL_CONFIG.customSetting.default
    };
  }

  // 初始化设置面板
  function initSettingPanel() {
    // 创建模态窗口结构
    const modalHTML = `
      <div id="custom-setting-modal">
        <div id="custom-setting-mask"></div>
        <div class="custom-setting-dialog">
          <div class="custom-setting-header">
            <h3><i class="fas fa-paint-brush"></i>美化设置</h3>
            <button class="close-button" onclick="toggleCustomSettingPanel()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="custom-setting-content">
            <!-- 恢复默认设置按钮 -->
            <button class="reset-default-btn">
              <i class="fas fa-sync-alt"></i> 恢复默认设置
            </button>
            
            <!-- 显示偏好设置 -->
            <div class="setting-section">
              <h4 class="setting-section-title">
                <i class="fas fa-palette"></i> 一、显示偏好
              </h4>
              
              <div class="setting-item">
                <div class="setting-item-label">
                  文章背景透明度 (0%-100%): <span class="setting-item-value">${Math.round(defaultConfig.card_opacity * 100)}%</span>
                </div>
                <input type="range" class="custom-slider" min="0" max="100" value="${Math.round(defaultConfig.card_opacity * 100)}" data-setting="card_opacity">
              </div>
              
              <div class="setting-item">
                <div class="setting-item-label">
                  全局字体选择: <span class="setting-item-value font-name">${defaultConfig.global_font.split(',')[0].trim()}</span>
                </div>
                <select class="font-select" data-setting="global_font">
                  <option value="ZihunBaiGeTianXing, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"" ${defaultConfig.global_font.includes('ZihunBaiGeTianXing') ? 'selected' : ''}>紫魂白鸽天行</option>
                  <option value="-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"" ${defaultConfig.global_font.includes('-apple-system') && !defaultConfig.global_font.includes('ZihunBaiGeTianXing') ? 'selected' : ''}>系统默认</option>
                  <option value="'Microsoft YaHei', sans-serif" ${defaultConfig.global_font.includes('Microsoft YaHei') ? 'selected' : ''}>微软雅黑</option>
                  <option value="'WenQuanYi Micro Hei', sans-serif" ${defaultConfig.global_font.includes('WenQuanYi Micro Hei') ? 'selected' : ''}>文泉驿微米黑</option>
                  <option value="'SimSun', serif" ${defaultConfig.global_font.includes('SimSun') ? 'selected' : ''}>宋体</option>
                  <option value="'SimHei', sans-serif" ${defaultConfig.global_font.includes('SimHei') ? 'selected' : ''}>黑体</option>
                  <option value="'KaiTi', serif" ${defaultConfig.global_font.includes('KaiTi') ? 'selected' : ''}>楷体</option>
                </select>
              </div>
              
              <div class="toggle-group">
                <div class="toggle-item">
                  <label class="toggle-switch">
                    <input type="checkbox" ${defaultConfig.enable_canvas_nest ? 'checked' : ''} data-setting="enable_canvas_nest">
                    <span class="toggle-slider"></span>
                  </label>
                  <span>线条背景效果</span>
                </div>
                
                <div class="toggle-item">
                  <label class="toggle-switch">
                    <input type="checkbox" checked data-setting="enable_sidebar">
                    <span class="toggle-slider"></span>
                  </label>
                  <span>侧边栏 (默认开)</span>
                </div>
              </div>
            </div>
            
            <!-- 背景设置 -->
            <div class="setting-section">
              <h4 class="setting-section-title">
                <i class="fas fa-image"></i> 二、背景设置
              </h4>
              
              <div class="notice-box">
                <i class="fas fa-info-circle"></i>
                当前网站使用一图流设计，背景图片设置会影响整体视觉效果。
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // 将模态窗口添加到body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 获取DOM元素
    modal = document.getElementById('custom-setting-modal');
    mask = document.getElementById('custom-setting-mask');
    
    // 绑定事件
    mask.addEventListener('click', toggleCustomSettingPanel);
    
    // 绑定滑块事件
    bindSliderEvents();
    
    // 绑定开关事件
    bindToggleEvents();
    
    // 绑定字体选择器事件
    bindFontSelectorEvents();
    
    // 绑定恢复默认按钮事件
    bindResetButtonEvent();
    
    // 初始化设置
    initSettings();
  }

  // 初始化设置
  function initSettings() {
    // 应用文章背景透明度
    applyCardOpacity(defaultConfig.card_opacity);
    
    // 应用默认字体设置
    applyGlobalFont(defaultConfig.global_font);
  }

  // 绑定滑块事件
  function bindSliderEvents() {
    const sliders = document.querySelectorAll('.custom-slider');
    sliders.forEach((slider) => {
      // 设置初始值
      updateSliderValue(slider);
      
      // 绑定input事件，实时更新值
      slider.addEventListener('input', () => {
        updateSliderValue(slider);
        applySetting(slider);
      });
    });
  }
  
  // 绑定字体选择器事件
  function bindFontSelectorEvents() {
    const fontSelectors = document.querySelectorAll('.font-select');
    fontSelectors.forEach((selector) => {
      // 绑定change事件
      selector.addEventListener('change', () => {
        applySetting(selector);
      });
    });
  }

  // 绑定开关事件
  function bindToggleEvents() {
    const toggles = document.querySelectorAll('.toggle-switch input');
    toggles.forEach((toggle) => {
      toggle.addEventListener('change', () => {
        applySetting(toggle);
      });
    });
  }

  // 更新滑块值
  function updateSliderValue(slider) {
    const valueDisplay = slider.parentElement.querySelector('.setting-item-value');
    const value = slider.value;
    
    // 根据滑块类型显示不同单位
    const settingName = slider.dataset.setting;
    let displayValue, unit;
    
    if (settingName === 'card_opacity') {
      displayValue = value;
      unit = '%';
    } else {
      displayValue = value;
      unit = '';
    }
    
    valueDisplay.textContent = `${displayValue}${unit}`;
    
    // 更新CSS变量，用于滑块填充效果
    slider.style.setProperty('--slider-value', `${value}%`);
  }

  // 应用设置
  function applySetting(element) {
    const settingName = element.dataset.setting;
    
    if (element.type === 'range') {
      let value = element.value;
      
      // 根据设置类型转换值
      if (settingName === 'card_opacity') {
        value = parseFloat(value) / 100;
        applyCardOpacity(value);
      }
      
    } else if (element.type === 'checkbox') {
      const value = element.checked;
      
      if (settingName === 'enable_canvas_nest') {
        toggleCanvasNest(value);
      } else if (settingName === 'enable_sidebar') {
        toggleSidebar(value);
      }
    } else if (element.tagName === 'SELECT') {
      // 字体选择器
      const value = element.value;
      
      if (settingName === 'global_font') {
        applyGlobalFont(value);
      }
    }
  }
  
  // 应用全局字体
  function applyGlobalFont(fontFamily) {
    // 保存到localStorage，下次加载时使用
    localStorage.setItem('custom_global_font', fontFamily);
    
    // 使用更强制的方式应用字体，确保覆盖CSS中的!important规则
    // 1. 创建一个style元素，添加到head中，优先级更高
    let styleElement = document.getElementById('custom-font-style');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'custom-font-style';
      document.head.appendChild(styleElement);
    }
    
    // 使用!important确保字体样式能够覆盖其他CSS规则
    styleElement.textContent = `
      /* 全局字体样式 - 使用!important确保优先级 */
      html, body, article, .article-content, .post-content, .recent-post-item, 
      h1, h2, h3, h4, h5, h6, #site-name, #site-title, #site-subtitle, 
      .menus_items, .menus_item, .menus_item a, 
      .card-widget, .card-info, .card-archives, .card-categories, .card-tags, 
      .post-meta, .post-title, .post-content, .comment-content, .footer-content {
        font-family: ${fontFamily} !important;
      }
    `;
    
    // 更新默认配置
    defaultConfig.global_font = fontFamily;
    
    // 提取主要字体名称（第一个字体）
    const mainFontName = fontFamily.split(',')[0].trim().replace(/['"]/g, '');
    
    // 更新设置面板中的显示值
    const fontNameElement = document.querySelector('.font-name');
    if (fontNameElement) {
      fontNameElement.textContent = mainFontName;
    }
    
    // 简化日志，只显示主要字体名称
    console.log(`全局字体已设置为: ${mainFontName}`);
  }

  // 应用文章背景透明度
  function applyCardOpacity(opacity) {
    // 保存到localStorage，下次加载时使用
    localStorage.setItem('custom_card_opacity', opacity);
    
    // 获取当前主题模式
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    
    // 根据主题模式计算实际的RGBA值
    // 白天模式使用白色背景，夜晚模式使用深色背景
    const backgroundColor = currentTheme === 'dark' 
      ? `rgba(31, 31, 31, ${opacity})`  // 夜晚模式使用深灰色背景
      : `rgba(255, 255, 255, ${opacity})`;  // 白天模式使用白色背景
    
    // 应用到首页文章卡片
    const recentPosts = document.querySelectorAll('.recent-post-item');
    recentPosts.forEach(post => {
      // 对于使用CSS变量的主题
      post.style.setProperty('--recent-post-bgcolor', backgroundColor);
      // 对于直接设置背景的情况
      post.style.background = backgroundColor;
    });
    
    // 应用到文章详情页容器
    const postContent = document.getElementById('post');
    if (postContent) {
      postContent.style.background = backgroundColor;
    }
    
    // 应用到目录磁贴 (catalog_magnet)
    const catalogMagnet = document.querySelector('.catalog_magnet');
    if (catalogMagnet) {
      catalogMagnet.style.background = backgroundColor;
    }
    
    // 应用到目录容器
    const catalog = document.querySelector('.catalog');
    if (catalog) {
      catalog.style.background = backgroundColor;
    }
    
    // 设置magnet_link_context容器下的span标签字体颜色
    const magnetLinkContexts = document.querySelectorAll('.magnet_link_context span');
    magnetLinkContexts.forEach(span => {
      span.style.color = currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '';
    });
    
    console.log(`文章背景透明度已设置为: ${opacity}，当前主题: ${currentTheme}`);
  }

  // 切换线条背景效果
  function toggleCanvasNest(enable) {
    // 保存到localStorage，下次加载时使用
    localStorage.setItem('custom_enable_canvas_nest', enable);
    
    // canvas_nest的实现机制：
    // 1. 通过ID为#canvas_nest的script标签加载第三方脚本
    // 2. 脚本自动创建canvas元素并绘制线条效果
    // 3. 脚本本身是不可见的，控制的是它创建的canvas元素
    
    // 查找canvas_nest脚本创建的canvas元素
    let canvasElements = document.querySelectorAll('canvas');
    let foundCanvas = false;
    
    // 遍历所有canvas元素，找到canvas_nest创建的那个
    // 它通常具有较高的z-index和特定的样式
    canvasElements.forEach((canvas, index) => {
      // canvas_nest创建的canvas通常有以下特征：
      // - 父元素是body
      // - z-index较低（默认-1）
      // - 背景透明
      // - 覆盖整个视口
      if (canvas.parentElement.tagName === 'BODY' || canvas.parentElement.id === 'body-wrap') {
        const computedStyle = window.getComputedStyle(canvas);
        const zIndex = parseInt(computedStyle.zIndex);
        
        // 判断是否为canvas_nest创建的canvas
        if (zIndex < 0 || computedStyle.background === 'rgba(0, 0, 0, 0)' || canvas.id.includes('canvas')) {
          if (enable) {
            canvas.style.display = 'block';
            canvas.style.visibility = 'visible';
            canvas.style.opacity = '1';
          } else {
            canvas.style.display = 'none';
            canvas.style.visibility = 'hidden';
            canvas.style.opacity = '0';
          }
          foundCanvas = true;
          console.log(`已控制canvas_nest创建的canvas元素(${index})的显示状态: ${enable ? '显示' : '隐藏'}`);
        }
      }
    });
    
    // 如果没找到canvas元素，可能是脚本还没加载完成或者在移动设备上被禁用了
    if (!foundCanvas) {
      console.log(`未找到canvas_nest创建的canvas元素。原因可能是：\n1. 脚本尚未加载完成\n2. 在移动设备上被禁用（配置中mobile: false）\n3. 浏览器不支持canvas`);
      
      // 尝试控制原始的canvas_nest脚本标签（虽然它本身不可见）
      const canvasNestScript = document.querySelector('#canvas_nest');
      if (canvasNestScript) {
        // 重新加载脚本以启用效果
        if (enable) {
          // 克隆脚本标签并重新插入，以重新加载脚本
          const newScript = canvasNestScript.cloneNode(true);
          canvasNestScript.parentNode.replaceChild(newScript, canvasNestScript);
          console.log('已重新加载canvas_nest脚本以启用效果');
        } else {
          // 移除脚本以禁用效果
          canvasNestScript.remove();
          console.log('已移除canvas_nest脚本以禁用效果');
        }
      }
    }
    
    // 输出最终状态
    console.log(`线条背景效果已${enable ? '开启' : '关闭'}`);
  }

  // 切换侧边栏
  function toggleSidebar(enable) {
    // 获取html元素
    const htmlDom = document.documentElement;
    
    // 框架的侧边栏控制方式：通过添加/移除hide-aside类到html元素
    if (enable) {
      // 显示侧边栏
      htmlDom.classList.remove('hide-aside');
      // 保存状态到localStorage（与框架保持一致）
      if (typeof btf !== 'undefined' && btf.saveToLocal) {
        btf.saveToLocal.set('aside-status', 'show', 2);
      } else {
        localStorage.setItem('aside-status', 'show');
      }
      console.log('侧边栏已开启');
    } else {
      // 隐藏侧边栏
      htmlDom.classList.add('hide-aside');
      // 保存状态到localStorage（与框架保持一致）
      if (typeof btf !== 'undefined' && btf.saveToLocal) {
        btf.saveToLocal.set('aside-status', 'hide', 2);
      } else {
        localStorage.setItem('aside-status', 'hide');
      }
      console.log('侧边栏已关闭');
    }
    
    // 保存到自定义localStorage键
    localStorage.setItem('custom_enable_sidebar', enable);
  }

  // 绑定恢复默认按钮事件
  function bindResetButtonEvent() {
    const resetBtn = document.querySelector('.reset-default-btn');
    resetBtn.addEventListener('click', () => {
      resetToDefaults();
    });
  }

  // 恢复默认设置
  function resetToDefaults() {
    // 从GLOBAL_CONFIG获取原始默认配置，确保恢复到最开始的设置
    let originalDefaultConfig;
    
    // 优先使用GLOBAL_CONFIG中的配置
    if (typeof GLOBAL_CONFIG !== 'undefined' && GLOBAL_CONFIG.customSetting && GLOBAL_CONFIG.customSetting.default) {
      originalDefaultConfig = GLOBAL_CONFIG.customSetting.default;
      // 确保包含enable_sidebar默认值
      if (originalDefaultConfig.enable_sidebar === undefined) {
        originalDefaultConfig.enable_sidebar = true;
      }
    } else {
      // 如果GLOBAL_CONFIG不可用，使用代码中定义的默认值
      originalDefaultConfig = {
        card_opacity: 0.6,
        enable_canvas_nest: true,
        enable_sidebar: true, // 添加侧边栏默认值
        global_font: 'ZihunBaiGeTianXing, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
      };
    }
    
    // 重置滑块
    const sliders = document.querySelectorAll('.custom-slider');
    sliders.forEach((slider) => {
      const settingName = slider.dataset.setting;
      
      if (settingName === 'card_opacity') {
        const originalValue = originalDefaultConfig.card_opacity;
        const defaultValue = Math.round(originalValue * 100);
        slider.value = defaultValue;
        updateSliderValue(slider);
        applyCardOpacity(originalValue);
        // 从localStorage移除保存的设置
        localStorage.removeItem('custom_card_opacity');
        // 更新默认配置
        defaultConfig.card_opacity = originalValue;
        console.log(`已将${settingName}重置为默认值: ${originalValue}`);
      }
    });
    
    // 重置字体选择器
    const fontSelectors = document.querySelectorAll('.font-select');
    fontSelectors.forEach((selector) => {
      const settingName = selector.dataset.setting;
      const originalDefaultValue = originalDefaultConfig[settingName];
      
      // 设置选择器值
      selector.value = originalDefaultValue;
      
      // 应用默认字体
      if (settingName === 'global_font') {
        applyGlobalFont(originalDefaultValue);
        // 从localStorage移除保存的设置
        localStorage.removeItem('custom_global_font');
        // 更新默认配置
        defaultConfig.global_font = originalDefaultValue;
        console.log(`已将${settingName}重置为默认值: ${originalDefaultValue}`);
      }
    });
    
    // 重置开关
    const toggles = document.querySelectorAll('.toggle-switch input');
    toggles.forEach((toggle) => {
      const settingName = toggle.dataset.setting;
      const originalDefaultValue = originalDefaultConfig[settingName];
      
      if (originalDefaultValue !== undefined) {
        toggle.checked = originalDefaultValue;
        
        if (settingName === 'enable_canvas_nest') {
          toggleCanvasNest(originalDefaultValue);
          // 从localStorage移除保存的设置
          localStorage.removeItem('custom_enable_canvas_nest');
        } else if (settingName === 'enable_sidebar') {
          toggleSidebar(originalDefaultValue);
          // 从localStorage移除保存的设置
          localStorage.removeItem('custom_enable_sidebar');
        }
        // 更新默认配置
        defaultConfig[settingName] = originalDefaultValue;
        console.log(`已将${settingName}重置为默认值: ${originalDefaultValue}`);
      }
    });
    
    // 显示通知
    showNotification('已恢复默认设置', 'success');
  }

  // 显示通知
  function showNotification(message, type = 'info') {
    // 这里可以实现通知功能，暂时简化处理
    console.log(`${type.toUpperCase()}: ${message}`);
    
    // 示例：可以使用现有的snackbar组件
    if (typeof Snackbar !== 'undefined') {
      Snackbar.show({
        text: message,
        backgroundColor: type === 'success' ? '#4caf50' : '#2196f3',
        duration: 3000
      });
    }
  }

  // 从localStorage加载设置
  function loadSettingsFromStorage() {
    // 加载文章背景透明度
    const savedOpacity = localStorage.getItem('custom_card_opacity');
    if (savedOpacity) {
      const opacity = parseFloat(savedOpacity);
      applyCardOpacity(opacity);
      // 更新默认配置
      defaultConfig.card_opacity = opacity;
    }
    
    // 加载线条背景效果
    const savedCanvasNest = localStorage.getItem('custom_enable_canvas_nest');
    if (savedCanvasNest !== null) {
      const enable = savedCanvasNest === 'true';
      toggleCanvasNest(enable);
      // 更新默认配置
      defaultConfig.enable_canvas_nest = enable;
    }
    
    // 加载侧边栏状态（优先使用框架的localStorage键）
    let savedSidebar = null;
    // 尝试从框架的localStorage键获取
    if (typeof btf !== 'undefined' && btf.saveToLocal) {
      savedSidebar = btf.saveToLocal.get('aside-status');
    }
    // 如果框架的localStorage键不存在，尝试从自定义键获取
    if (!savedSidebar) {
      savedSidebar = localStorage.getItem('aside-status') || localStorage.getItem('custom_enable_sidebar');
    }
    
    if (savedSidebar) {
      const enable = savedSidebar === 'true' || savedSidebar === 'show';
      // 更新默认配置
      defaultConfig.enable_sidebar = enable;
    }
    
    // 加载全局字体设置
    const savedFont = localStorage.getItem('custom_global_font');
    if (savedFont) {
      applyGlobalFont(savedFont);
      // 更新默认配置
      defaultConfig.global_font = savedFont;
    }
  }

  // 切换设置面板显示/隐藏
  function toggleCustomSettingPanel() {
    // 如果面板未初始化，则初始化
    if (!modal) {
      initSettingPanel();
    }
    
    // 切换显示状态
    if (modal.classList.contains('show')) {
      modal.classList.remove('show');
    } else {
      modal.classList.add('show');
    }
  }

  // 初始化主题设置
  function initThemeSettings() {
    // 绑定按钮事件
    const settingButton = document.getElementById('custom-setting-button');
    if (settingButton) {
      settingButton.addEventListener('click', toggleCustomSettingPanel);
    }
    
    // 从localStorage加载设置
    loadSettingsFromStorage();
    
    // 添加主题切换监听器，当主题改变时自动更新透明度设置
    if (typeof window.globalFn === 'undefined') {
      window.globalFn = {};
    }
    if (typeof window.globalFn.themeChange === 'undefined') {
      window.globalFn.themeChange = {};
    }
    
    // 添加主题切换回调函数
    window.globalFn.themeChange.customSetting = function(mode) {
      console.log(`主题已切换为: ${mode}，正在更新透明度设置...`);
      // 重新应用透明度设置，使用当前保存的透明度值
      const savedOpacity = localStorage.getItem('custom_card_opacity') || defaultConfig.card_opacity;
      applyCardOpacity(parseFloat(savedOpacity));
    };
  }

  // 监听DOM加载完成
  document.addEventListener('DOMContentLoaded', initThemeSettings);

  // ESC键关闭面板
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
      toggleCustomSettingPanel();
    }
  });

  // 暴露toggle函数到全局，方便调用
  window.toggleCustomSettingPanel = toggleCustomSettingPanel;
})();