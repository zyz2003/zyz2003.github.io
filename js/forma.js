// 博客增强功能集合 - forma.js
// 包含功能：
// 1. 表情包放大功能
// 2. 评论输入框placeholder修改
// 3. 用户操作Snackbar通知

(function() {
  // ===========================
  // 1. 表情包放大功能
  // ===========================
  function initOwoBig() {
    // 检查是否存在评论区
    if (!document.getElementById('post-comment')) return;
    
    let flag = 1, // 设置节流阀
        owo_time = '', // 设置计时器
        m = 3; // 设置放大倍数
    
    // 创建盒子
    let div = document.createElement('div'),
        body = document.querySelector('body');
    
    // 设置ID
    div.id = 'owo-big';
    // 插入盒子
    body.appendChild(div);

    // 构造observer
    let observer = new MutationObserver(mutations => {
      for (let i = 0; i < mutations.length; i++) {
        let dom = mutations[i].addedNodes,
            owo_body = '';
        
        if (dom.length == 2 && dom[1].className == 'OwO-body') {
          owo_body = dom[1];
        } else if (dom.length == 1 && dom[0].className == 'tk-comment') {
          owo_body = dom[0];
        } else {
          continue;
        }
        
        // 禁用右键（手机端长按会出现右键菜单，为了体验给禁用掉）
        if (document.body.clientWidth <= 768) {
          owo_body.addEventListener('contextmenu', e => e.preventDefault());
        }
        
        // 鼠标移入
        owo_body.onmouseover = (e) => {
          if (flag && e.target.tagName == 'IMG') {
            flag = 0;
            // 移入300毫秒后显示盒子
            owo_time = setTimeout(() => {
              let height = e.target.clientHeight * m, // 盒子高
                  width = e.target.clientWidth * m, // 盒子宽
                  left = (e.clientX - e.offsetX) - (width - e.target.clientWidth) / 2, // 盒子与屏幕左边距离
                  top = e.clientY - e.offsetY; // 盒子与屏幕顶部距离

              // 右边缘检测，防止超出屏幕
              if ((left + width) > body.clientWidth) {
                left -= ((left + width) - body.clientWidth + 10);
              }
              // 左边缘检测，防止超出屏幕
              if (left < 0) {
                left = 10;
              }
              
              // 设置盒子样式
              div.style.cssText = `display:flex; height:${height}px; width:${width}px; left:${left}px; top:${top}px;`;
              // 在盒子中插入图片
              div.innerHTML = `<img src="${e.target.src}">`;
            }, 300);
          }
        };
        
        // 鼠标移出隐藏盒子
        owo_body.onmouseout = () => {
          div.style.display = 'none';
          flag = 1;
          clearTimeout(owo_time);
        };
      }
    });
    
    // 监听的 元素 和 配置项
    observer.observe(document.getElementById('post-comment'), { subtree: true, childList: true });
  }
  
  // ===========================
  // 2. 评论输入框placeholder修改
  // ===========================
  function initCommentPlaceholder() {
    // 定义目标placeholder文本
    const customPlaceholder = '📧 本站已开启邮件通知，收到回复后将会给您发送邮件。\n 🐧如果不方便留言说明可以添加博主的QQ或者微信细聊。';
    
    // 修改评论输入框placeholder的函数
    function updateCommentPlaceholder() {
      // 查找所有Twikoo评论输入框
      const textareas = document.querySelectorAll('.twikoo .el-textarea__inner');
      
      textareas.forEach(textarea => {
        // 只修改未被修改过的输入框
        if (textarea.placeholder !== customPlaceholder) {
          textarea.placeholder = customPlaceholder;
        }
      });
    }
    
    // 执行修改
    updateCommentPlaceholder();
    
    // 监听Twikoo加载完成事件
    window.addEventListener('twikoo:loaded', updateCommentPlaceholder);
    
    // 监听DOM变化，处理动态加载的评论框
    const observer = new MutationObserver(updateCommentPlaceholder);
    observer.observe(document.body, { subtree: true, childList: true });
  }
  
  // ===========================
  // 3. 用户操作Snackbar通知
  // ===========================
  function initSnackbarNotifications() {
    // 检查是否启用了Snackbar
    if (typeof GLOBAL_CONFIG === 'undefined' || typeof GLOBAL_CONFIG.Snackbar === 'undefined') {
      return;
    }
    
    // 显示Snackbar通知的函数
    function showNotification(message) {
      if (typeof btf !== 'undefined' && typeof btf.snackbarShow === 'function') {
        btf.snackbarShow(message);
      }
    }
    
    // 添加代码复制成功的通知
    function initCodeCopy() {
      // 防抖计时器
      let copyTimer = null;
      
      // 监听复制事件，处理代码块复制
      document.addEventListener('copy', (e) => {
        // 检查是否在代码块内
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        
        if (selectedText && selection.anchorNode) {
          let parent = selection.anchorNode.parentNode;
          while (parent && parent.tagName) {
            if (parent.tagName.toLowerCase() === 'pre' || parent.classList.contains('highlight')) {
              // 清除之前的计时器，实现防抖
              if (copyTimer) {
                clearTimeout(copyTimer);
              }
              
              // 延迟显示通知，确保复制操作完成
              copyTimer = setTimeout(() => {
                // 更丰富的通知内容，包含emoji和额外提示
                showNotification('📋 代码已复制到剪贴板！\n✨ 若转载请注明出处哦~');
              }, 100);
              break;
            }
            parent = parent.parentNode;
          }
        }
      });
    }
    
    // 添加复制链接功能
    function initCopyLink() {
      // 监听复制按钮点击事件
      document.addEventListener('click', (e) => {
        if (e.target.closest('.copy-btn')) {
          // 查找当前文章的链接
          const postCopyright = e.target.closest('.post-copyright');
          if (postCopyright) {
            // 获取当前页面URL作为复制内容
            const url = window.location.href;
            
            // 复制到剪贴板
            navigator.clipboard.writeText(url).then(() => {
              // 显示复制成功通知
              showNotification('📋 链接已复制到剪贴板！');
            }).catch(err => {
              console.error('复制失败:', err);
              showNotification('复制失败，请手动复制链接');
            });
          }
        }
      });
    }
    
    // 添加分享功能到版权容器 - 独立实现
    function initCopyrightShare() {
      // 等待DOM加载完成
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCopyrightShare);
        return;
      }
      
      // 查找所有分享按钮
      const shareBtns = document.querySelectorAll('.post-copyright .share-btn');
      
      // 获取当前页面信息
      const url = window.location.href;
      const title = document.title;
      
      // 为每个微信分享按钮添加悬浮事件
      shareBtns.forEach(btn => {
        // 检查是哪个分享按钮
        const hasWeixin = btn.querySelector('.fab.fa-weixin');
        const hasWeibo = btn.querySelector('.fab.fa-weibo');
        
        if (hasWeixin) {
          // 确保按钮是相对定位
          btn.style.position = 'relative';
          
          // 创建二维码容器
          let qrContainer = null;
          
          // 监听鼠标进入事件
          btn.addEventListener('mouseenter', (e) => {
            // 如果二维码容器已存在，直接显示
            if (qrContainer) {
              qrContainer.style.display = 'block';
              return;
            }
            
            // 创建二维码容器
            qrContainer = document.createElement('div');
            qrContainer.className = 'wechat-qr-container';
            qrContainer.style.cssText = `
              position: absolute;
              left: 50%;
              bottom: calc(100% + 5px);
              transform: translateX(-50%);
              z-index: 9999;
              margin-bottom: 8px;
              padding: 10px;
              background: #fff;
              border-radius: 6px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
              text-align: center;
              display: block;
              border: 1px solid #ebeef5;
            `;
            
            // 创建二维码标题
            const qrTitle = document.createElement('div');
            qrTitle.textContent = '微信扫一扫';
            qrTitle.style.cssText = `
              font-size: 13px;
              color: #606266;
              margin-bottom: 10px;
              font-weight: normal;
            `;
            qrContainer.appendChild(qrTitle);
            
            // 创建二维码图片
            const qrImg = document.createElement('img');
            qrImg.alt = '微信分享二维码';
            qrImg.style.cssText = `
              width: 130px;
              height: 130px;
              display: block;
              margin: 0 auto 8px;
              background: #fff;
              padding: 4px;
              border: 1px solid #ebeef5;
              border-radius: 4px;
            `;
            
            // 使用更可靠的二维码生成API，与sharejs保持一致
            const wxShareUrl = encodeURIComponent(url);
            const wxQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${wxShareUrl}`;
            
            // 设置二维码图片
            qrImg.src = wxQrUrl;
            qrContainer.appendChild(qrImg);
            
            // 添加分享提示文字
            const qrTip = document.createElement('div');
            qrTip.textContent = '扫码分享到微信';
            qrTip.style.cssText = `
              font-size: 12px;
              color: #909399;
              text-align: center;
            `;
            qrContainer.appendChild(qrTip);
            
            // 添加到按钮中
            btn.appendChild(qrContainer);
          });
          
          // 监听鼠标离开事件
          btn.addEventListener('mouseleave', (e) => {
            // 隐藏二维码容器
            if (qrContainer) {
              qrContainer.style.display = 'none';
            }
          });
        } else if (hasWeibo) {
          // 微博分享 - 跳转到微博分享页面
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const weiboUrl = `http://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
            window.open(weiboUrl, '_blank', 'width=600,height=400');
            showNotification('正在打开微博分享...');
          });
        }
      });
    }
    
    // 初始化通知功能
    initCodeCopy();
    // 初始化复制链接功能
    initCopyLink();
    // 初始化版权容器分享功能
    initCopyrightShare();
  }
  
  // ===========================
  // 4. AI摘要打字机效果
  // ===========================
  function initAISummaryTypewriter() {
    // 简单直接的打字机效果实现
    function typeWriterEffect() {
      // 立即执行，不等待
      const summaryElements = document.querySelectorAll('.ai-summary .ai-explanation');
      
      summaryElements.forEach((element, index) => {
        // 跳过已处理的元素
        if (element.hasAttribute('data-typed')) {
          return;
        }
        
        element.setAttribute('data-typed', 'true');
        
        const summaryText = element.getAttribute('data-summary');
        if (!summaryText) return;
        
        // 立即清除加载文本
        element.textContent = '';
        
        // 开始打字效果
        let i = 0;
        const typingSpeed = 50; // 打字速度（毫秒/字符）
        
        function type() {
          if (i < summaryText.length) {
            element.textContent += summaryText.charAt(i);
            i++;
            setTimeout(type, typingSpeed);
          }
        }
        
        // 立即开始打字
        type();
      });
    }
    
    // 使用多种方式确保触发
    
    // 1. 立即执行一次，解决DOM已加载的情况
    typeWriterEffect();
    
    // 2. 监听DOMContentLoaded，确保DOM加载完成
    document.addEventListener('DOMContentLoaded', typeWriterEffect);
    
    // 3. 监听pjax完成事件
    document.addEventListener('pjax:complete', typeWriterEffect);
    
    // 4. 使用MutationObserver，监听动态添加的摘要元素
    const observer = new MutationObserver(typeWriterEffect);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // ===========================
  // 初始化所有功能
  // ===========================
  function initAllFeatures() {
    // 初始化表情包放大功能
    initOwoBig();
    
    // 初始化评论输入框placeholder修改
    initCommentPlaceholder();
    
    // 初始化用户操作Snackbar通知
    initSnackbarNotifications();
    
    // 初始化AI摘要打字机效果
    initAISummaryTypewriter();
  }
  
  // 页面加载完成后执行初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllFeatures);
  } else {
    initAllFeatures();
  }
})();