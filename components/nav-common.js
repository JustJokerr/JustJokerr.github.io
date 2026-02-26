/**
 * 导航栏交互逻辑 - 最终稳定版
 * 解决：刷新页面样式随机异常问题
 */
function initNav() {
  // 1. 获取导航栏父容器（不变的元素，用于事件委托）
  const navContainer = document.getElementById('common-nav-container');
  if (!navContainer) return;

  // 2. 事件委托：绑定到父容器，监听所有点击
  navContainer.addEventListener('click', function(e) {
    if (e.target.id === 'headericon') {
      e.stopPropagation();
      const nav2 = document.getElementById('navigation2');
      nav2.style.display = nav2.style.display === 'flex' ? 'none' : 'flex';
      return;
    }
    const nav2 = document.getElementById('navigation2');
    if (nav2.style.display === 'flex' && !e.target.closest('#navigation2')) {
      nav2.style.display = 'none';
    }
  });

// 3. 统一的样式同步函数（强制刷新样式）
function syncNavStyle() {
  const nav1 = document.getElementById('navigation1');
  const nav2 = document.getElementById('navigation2');
  const icon = document.getElementById('headericon');
  
  // 强制触发浏览器样式重计算（核心：消除随机失效）
  const forceReflow = () => {
    if (nav1) nav1.offsetHeight; // 读取布局属性，强制重绘
    if (icon) icon.offsetHeight;
  };

  if (window.innerWidth > 800) {
    // 大屏：三重保障隐藏书本图标
    if (icon) {
      icon.style.setProperty('display', 'none', 'important');
      icon.style.visibility = 'hidden';
      icon.style.opacity = '0';
    }
    // 强制固化PC菜单样式
    if (nav1) {
      nav1.style.display = 'flex';
      nav1.style.alignItems = 'center';
      nav1.style.margin = '0 0 0 auto';
    }
    if (nav2) nav2.style.display = 'none';
  } else {
    // 移动端：强制覆盖!important，显示书本图标
    if (icon) {
      icon.style.setProperty('display', 'block', 'important');
      icon.style.visibility = 'visible';
      icon.style.opacity = '1';
    }
    if (nav1) {
      nav1.style.setProperty('display', 'none', 'important');
    }
    if (nav2) nav2.style.display = 'none';
  }
  
}


  // 4. 窗口大小变化适配
  window.addEventListener('resize', syncNavStyle);

  // 5. 初始化：双时机+安全延迟（消除随机性）
  function initResize() {
    // 200ms安全延迟：覆盖所有浏览器渲染速度
    setTimeout(() => {
      syncNavStyle();
      console.log('导航栏样式初始化完成（稳定版）');
    }, 200);
  }

  // 双监听：DOM加载完成+页面完全加载，确保必执行
  if (document.readyState === 'complete') {
    initResize();
  } else {
    document.addEventListener('DOMContentLoaded', initResize);
    window.addEventListener('load', initResize);
  }

  console.log('导航栏交互初始化完成（稳定版）');
}
