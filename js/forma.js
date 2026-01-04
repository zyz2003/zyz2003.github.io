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
    
    // 初始化通知功能
    initCodeCopy();
    // 初始化复制链接功能
    initCopyLink();
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
  }
  
  // 页面加载完成后执行初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllFeatures);
  } else {
    initAllFeatures();
  }
})();