// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  // ========== 新增：调用一言API ==========
    function getHitokoto() {
    // 调用免费一言API
    fetch('https://api-hitokoto.wely.fun/api')
        .then(response => {
        // 检查响应是否成功
        if (!response.ok) {
          throw new Error('API请求失败');
        }
        return response.json();
        })
        .then(data => {
        // 获取页尾元素
        const footer = document.querySelector('.showcase-footer');
        if (footer && data.hitokoto) {
          // 拼接一言内容+来源（如果有）
            let hitokotoText = data.hitokoto;
            if (data.from) {
            hitokotoText += ` —— ${data.from}`;
            }
            
          // 修改页尾内容，保留版权信息
            footer.innerHTML = `
            <p style="margin-bottom: 8px;">${hitokotoText}</p>
            <p>© 2026 Just.Joker | 个人项目展示区</p>
            `;
        }
        })
        .catch(error => {
        // 请求失败时显示默认文案
        console.warn('一言API加载失败：', error);
        const footer = document.querySelector('.showcase-footer');
        if (footer) {
            footer.innerHTML = `
            <p style="margin-bottom: 8px;">人生如逆旅，我亦是行人。 —— 苏轼</p>
            <p>© 2026 Just.Joker | 个人项目展示区</p>
            `;
        }
        });
    }

  // 初始化加载一言
    getHitokoto();

  // ========== 原有逻辑保持不变 ==========
  // 1. 背景图片加载容错
    const bgElement = document.querySelector('.page-background');
    const bgImg = new Image();
    bgImg.src = '../images/background.png';
    
    bgImg.onerror = function() {
    bgElement.style.background = 'linear-gradient(135deg, #1a2a6c, #b21f1f, #1a2a6c) no-repeat center center';
    bgElement.style.backgroundSize = 'cover';
    console.warn('背景图片加载失败，已启用备用背景');
    };

  // 2. 项目卡片进入视口时的渐入动效
    const projectCards = document.querySelectorAll('.project-card');
    const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        }
    });
    }, { threshold: 0.1 });

    projectCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(card);
    });

  // 3. 页面滚动时头部渐变效果
    const header = document.querySelector('.showcase-header');
    window.addEventListener('scroll', function() {
    const scrollY = window.scrollY;
    const opacity = 1 - (scrollY / 300);
    header.style.opacity = opacity > 0.7 ? opacity : 0.7;
    header.style.transform = `translateY(${scrollY * 0.1}px)`;
    });

  // 4. 点击项目链接时的反馈
    const projectLinks = document.querySelectorAll('.project-link');
    projectLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
        this.style.transform = 'scale(1.05)';
        }, 100);
    });
    });

// 5. 项目图片加载容错（最终稳定版：黑背景+文字都显示）
const projectImgs = document.querySelectorAll('.project-img');
projectImgs.forEach(img => {
    // 获取对应的兜底文字层
    const placeholder = img.parentElement.querySelector('.img-placeholder');
    
    // 同步检查图片是否已加载失败
    if (img.complete && !img.naturalWidth) {
        img.style.display = 'none'; // 隐藏图片
        placeholder.style.zIndex = 2; // 显示兜底文字
        return;
    }

    // 监听error事件：图片加载失败
    img.addEventListener('error', function() {
        this.style.display = 'none'; // 隐藏失效的图片
        placeholder.style.zIndex = 2; // 显示兜底文字
        placeholder.style.color = '#fff'; // 确保文字白色
        // 清空无效src，避免反复请求
        this.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    });

    // 监听load事件：图片加载成功（恢复显示）
    img.addEventListener('load', function() {
        this.style.display = 'block'; // 显示图片
        placeholder.style.zIndex = 0; // 隐藏兜底文字
    });
});



});
