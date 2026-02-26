document.addEventListener('DOMContentLoaded', function() {
  // 原有导航/背景/滚动逻辑（保持不变）
  var elementToHide = document.getElementById('navigation1');
  var elementToShow = document.getElementById('navigation2');
  var elementToShow2 = document.getElementById('headericon');
  var elementToHide2 = document.getElementsByClassName('preview');
  const body = document.body;
  const backgroundAnime = document.querySelector('.backgroundanime');
  const headerBgImg = document.querySelector('.header-bg-img');
  
  function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
  }
  
  function setHeaderBg() {
    const mobileBgUrl = 'https://api.kuroko.cn/rand/ecy-img/pe.php';
    const pcBgUrl = 'https://api.mtyqx.cn/tapi/random.php';
    headerBgImg.style.backgroundImage = `url(${isMobile() ? mobileBgUrl : pcBgUrl})`;
  }
  
  setHeaderBg();
  window.addEventListener('resize', setHeaderBg);
  
  // 修复后的sizeAdapt函数（强制绑定菜单事件）
  // ========== 替换原有sizeAdapt相关代码 ==========
// 声明sizeAdapt，但初始不执行，等待导航栏加载完成
function sizeAdapt() {
  // 主动重新获取元素
  const nav1 = document.getElementById('navigation1'); 
  const headerIcon = document.getElementById('headericon'); 
  const nav2 = document.getElementById('navigation2');

  // 仅当所有元素都存在时执行逻辑（无重试，无报错）
  if (nav1 && headerIcon && nav2) {
    // 核心适配逻辑
    if (window.innerWidth < 600) {
      nav1.style.display = 'none';       
      headerIcon.style.display = 'block';
      nav2.style.display = 'none';       
    } else {
      nav1.style.display = 'block';      
      nav2.style.display = 'none';       
      headerIcon.style.display = 'none'; 
    }

    // 强制绑定书本图标点击事件
    headerIcon.onclick = function(event) {
      event.stopPropagation(); 
      nav2.style.display = nav2.style.display === 'block' ? 'none' : 'block';
    };

    if (typeof hidelist === 'function') {
      hidelist();
    }
  }
}

// ========== 新增：监听导航栏加载完成后执行sizeAdapt ==========
// 方式1：如果用fetch加载导航栏，在加载完成的回调里执行
// （找到你index.html里的fetch导航栏代码，在插入HTML后添加：）
// document.getElementById('common-nav-container').innerHTML = html;
// sizeAdapt(); // 导航栏加载完成后立即执行

// 方式2：通用监听（兜底）- 每200ms检查一次，找到元素后停止
let sizeAdaptCheckTimer = setInterval(() => {
  const nav1 = document.getElementById('navigation1'); 
  const headerIcon = document.getElementById('headericon'); 
  const nav2 = document.getElementById('navigation2');
  
  if (nav1 && headerIcon && nav2) {
    sizeAdapt(); // 执行适配
    clearInterval(sizeAdaptCheckTimer); // 停止检查，消除报错
    console.log('导航栏元素加载完成，sizeAdapt执行成功');
  }
}, 200);


  
  // 修复后的hidelist函数（核心容错）
  function hidelist() {
    // 1. 明确获取实际元素（替换占位符）
    const nav2 = document.getElementById('navigation2'); // 下拉菜单
    const headerIcon = document.getElementById('headericon'); // 书本图标

    // 容错：元素不存在直接返回，避免style报错
    if (!nav2 || !headerIcon) {
      console.warn('hidelist函数：元素未找到，跳过执行');
      return;
    }

    // 2. 保留原本的hidelist逻辑
    nav2.style.display = 'none'; 
    headerIcon.style.display = 'block'; // 恢复书本图标显示
  }
  
  // 修复后的showlist函数（增加容错）
  function showlist() {
    const nav2 = document.getElementById('navigation2');
    if (nav2) {
      nav2.style.display = 'block'; // 显示下拉菜单
    }
  }
  
  function previewtohide() {
    // 容错：避免elementToHide2为空
    if (!elementToHide2 || elementToHide2.length === 0) return;
    
    if (window.innerWidth < 800) {
      for (let i = 0; i < elementToHide2.length; i++) {
        elementToHide2[i].style.display = 'none';
      }
    } else {
      for (let i = 0; i < elementToHide2.length; i++) {
        elementToHide2[i].style.display = '';
      }
    }
  }
  
  // 修复移动端菜单点击逻辑（核心！）
  if (elementToShow2) {
    elementToShow2.addEventListener('click', function(event) {
      // 阻止事件冒泡，避免触发hidelist立即关闭菜单
      event.stopPropagation();
      showlist();
    });
    
    // 点击页面其他区域关闭菜单
    document.addEventListener('click', function(event) {
      // 仅当点击的不是下拉菜单且不是书本图标时，才关闭菜单
      const nav2 = document.getElementById('navigation2');
      if (nav2 && !elementToShow2.contains(event.target) && !nav2.contains(event.target)) {
        hidelist();
      }
    });
  }

  // 初始化执行（确保DOM加载完成）
  sizeAdapt();
  previewtohide();
  window.addEventListener('resize', sizeAdapt);
  window.addEventListener('resize', previewtohide);

  // 头部滚动动效
  const header = document.querySelector('.header');
  let scrollDistance = 0;
  let requestId = null;

  function updateHeaderClipPath() {
    const screenHeight = window.innerHeight;
    const maxScroll = screenHeight * 0.8;
    const clipPercent = scrollDistance <= maxScroll 
      ? 100 - ((scrollDistance / maxScroll) * 60) 
      : 40;
      
    header.style.clipPath = `polygon(0 0, 100% 0%, 100% ${clipPercent}%, 0 100%)`;
    const scaleValue = 1 + ((scrollDistance / maxScroll) * 0.5);
    headerBgImg.style.transform = `scale(${scaleValue})`;
    
    if (scrollDistance >= screenHeight * 0.2) {
      body.classList.add('scroll-down');
    } else {
      body.classList.remove('scroll-down');
    }
  }

  function scrollHandler(event) {
    const screenHeight = window.innerHeight;
    const maxScroll = screenHeight * 0.8;
    
    if (event.deltaY < 0) {
      scrollDistance = Math.max(0, scrollDistance + event.deltaY);
    } else {
      scrollDistance = Math.min(maxScroll, scrollDistance + event.deltaY);
    }
    if (!requestId) {
      requestId = window.requestAnimationFrame(() => {
        updateHeaderClipPath();
        requestId = null;
      });
    }
  }

  window.addEventListener('wheel', scrollHandler);
  window.addEventListener('resize', () => {
    scrollDistance = 0;
    updateHeaderClipPath();
  });

  // ========== 头像+文字+气泡核心逻辑（全量容错+强制显示） ==========
  const avatarContainer = document.getElementById('avatarContainer');
  const bubbleContainer = document.getElementById('bubbleContainer');
  const avatarTextContainer = document.getElementById('avatarTextContainer');
  const welcomeText = document.getElementById('welcomeText');
  const nameText = document.getElementById('nameText');
  
  // 强制兜底：先确保文字容器显示（优先级最高）
  if (avatarTextContainer) {
    avatarTextContainer.classList.remove('hidden');
    avatarTextContainer.style.opacity = '1';
    avatarTextContainer.style.transform = 'translateX(-50%) translateY(0)';
  }
  
  let currentBubbles = [];
  let isBubbleShow = false;
  let fadeTimer = null;

  // 容错处理：即使部分元素缺失，也不影响整体运行
  if (!avatarContainer) console.warn('头像容器未找到，请检查ID：avatarContainer');
  if (!bubbleContainer) console.warn('气泡容器未找到，请检查ID：bubbleContainer');
  if (!avatarTextContainer) console.warn('文字容器未找到，请检查ID：avatarTextContainer');
  if (!welcomeText) console.warn('欢迎语文本未找到，请检查ID：welcomeText');
  if (!nameText) console.warn('名字文本未找到，请检查ID：nameText');

  // 只有头像容器存在时，才执行后续逻辑
  if (avatarContainer) {
    const CONFIG = {
      skills: ['C', 'C++', 'Py', 'C#', 'JS', 'CSS', 'HTML', 'Vue', 'Node.js','VB','EPL'],
      bubbleCount: 12,
      bubbleSize: [20, 60],
      floatRange: [-300, 300],
      maxTilt: 25,
      bubbleOpacity: [0.7, 0.95],
      fadeDelay: 300,
      fadeDuration: 800,
      typeSpeed: 100,
      welcomeText: '欢迎来到我的个人主页',
      nameText: 'Just.Joker'
    };

    // ========== 1. 打字机动画（页面加载时执行） ==========
    function typeWriterEffect(element, text, speed, callback) {
      // 兜底：如果元素不存在，直接返回
      if (!element) {
        console.warn('打字机元素不存在，跳过动画');
        if (callback) callback();
        return;
      }
      
      // 先设置默认文本，避免动画延迟导致文字为空
      element.textContent = text;
      element.style.borderRight = '2px solid #fff';
      
      let index = 0;
      // 延迟100ms开始动画，避免DOM未完全渲染
      setTimeout(() => {
        element.textContent = '';
        const type = () => {
          if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
          } else {
            // 打字完成后移除光标
            element.style.borderRight = 'none';
            if (callback) callback();
          }
        };
        type();
      }, 100);
    }

    // 仅给欢迎语加打字特效，名字直接显示
    if (welcomeText && nameText) {
      // 执行欢迎语打字动画
      typeWriterEffect(welcomeText, CONFIG.welcomeText, CONFIG.typeSpeed);
      // 名字直接显示，无动画
      nameText.textContent = CONFIG.nameText;
      nameText.style.borderRight = 'none'; // 确保名字没有光标
    } else {
      // 终极兜底：直接设置文本
      if (welcomeText) welcomeText.textContent = CONFIG.welcomeText;
      if (nameText) nameText.textContent = CONFIG.nameText;
    }

    // ========== 2. 3D头像倾斜（常驻生效+容错） ==========
    avatarContainer.addEventListener('mousemove', (e) => {
      const rect = avatarContainer.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const offsetX = (e.clientX - centerX) / (rect.width / 3);
      const offsetY = (e.clientY - centerY) / (rect.height / 3);
      const tiltX = offsetY * CONFIG.maxTilt;
      const tiltY = -offsetX * CONFIG.maxTilt;
      
      // 避免transform覆盖导致文字定位异常
      avatarContainer.style.transform = `translate(-50%, -50%) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.05)`;
    });

    // 鼠标离开头像重置倾斜
    avatarContainer.addEventListener('mouseleave', () => {
      avatarContainer.style.transform = 'translate(-50%, -50%) rotateX(0deg) rotateY(0deg) scale(1)';
      
      if (isBubbleShow && bubbleContainer) {
        fadeTimer = setTimeout(() => {
          currentBubbles.forEach(bubble => {
            if (bubble && !bubble.classList.contains('fade-out')) {
              bubble.classList.add('fade-out');
              setTimeout(() => bubble.remove(), CONFIG.fadeDuration);
            }
          });
          // 显示文字
          if (avatarTextContainer) {
            avatarTextContainer.classList.remove('hidden');
          }
          // 恢复头像透明度
          const avatarImg = avatarContainer.querySelector('.avatar-img');
          if (avatarImg) avatarImg.style.opacity = '1';
          
          isBubbleShow = false;
          currentBubbles = [];
        }, CONFIG.fadeDelay);
      }
    });

    // ========== 3. 点击头像：生成气泡+隐藏文字 ==========
    avatarContainer.addEventListener('click', () => {
      if (isBubbleShow) return;
      
      // 隐藏文字
      if (avatarTextContainer) {
        avatarTextContainer.classList.add('hidden');
      }
      
      // 头像变淡
      const avatarImg = avatarContainer.querySelector('.avatar-img');
      if (avatarImg) avatarImg.style.opacity = '0.6';

      // 清空旧气泡
      clearBubbles();
      currentBubbles = [];
      isBubbleShow = true;

      // 生成新气泡（仅气泡容器存在时）
      if (bubbleContainer) {
        for (let i = 0; i < CONFIG.bubbleCount; i++) {
          const bubble = createBubble();
          currentBubbles.push(bubble);
        }
      }
    });

    // ========== 4. 鼠标回到头像：取消气泡渐隐 ==========
    avatarContainer.addEventListener('mouseenter', () => {
      if (fadeTimer) {
        clearTimeout(fadeTimer);
        fadeTimer = null;
        currentBubbles.forEach(bubble => {
          if (bubble) bubble.classList.remove('fade-out');
        });
      }
      // 确保文字显示
      if (!isBubbleShow && avatarTextContainer) {
        avatarTextContainer.classList.remove('hidden');
      }
    });

    // 生成单个气泡
    function createBubble() {
      const text = CONFIG.skills[Math.floor(Math.random() * CONFIG.skills.length)];
      const size = Math.floor(Math.random() * (CONFIG.bubbleSize[1] - CONFIG.bubbleSize[0])) + CONFIG.bubbleSize[0];
      const x = Math.floor(Math.random() * (CONFIG.floatRange[1] - CONFIG.floatRange[0])) + CONFIG.floatRange[0];
      const y = Math.floor(Math.random() * (CONFIG.floatRange[1] - CONFIG.floatRange[0])) + CONFIG.floatRange[0];
      const finalOpacity = Math.random() * (CONFIG.bubbleOpacity[1] - CONFIG.bubbleOpacity[0]) + CONFIG.bubbleOpacity[0];
      
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      bubble.textContent = text;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.top = '50%';
      bubble.style.left = '50%';
      bubble.style.setProperty('--x', `${x}px`);
      bubble.style.setProperty('--y', `${y}px`);
      bubble.style.setProperty('--final-opacity', finalOpacity);
      bubble.style.animationDelay = `${Math.random() * 0.5}s`;

      bubbleContainer.appendChild(bubble);
      return bubble;
    }

    // 清空气泡
    function clearBubbles() {
      if (fadeTimer) clearTimeout(fadeTimer);
      currentBubbles.forEach(bubble => bubble?.remove());
      if (bubbleContainer) bubbleContainer.innerHTML = '';
      currentBubbles = [];
    }
  }
});
