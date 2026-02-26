/**
 * 通用页脚一言API逻辑（复用型）
 */
function initFooter() {
    // 调用一言API
    function getHitokoto() {
        fetch('https://api-hitokoto.wely.fun/api')
            .then(response => {
                if (!response.ok) throw new Error('API请求失败');
                return response.json();
            })
            .then(data => {
                const hitokotoEl = document.querySelector('.hitokoto-text');
                if (hitokotoEl && data.hitokoto) {
                    let hitokotoText = data.hitokoto;
                    if (data.from) {
                        hitokotoText += ` —— ${data.from}`;
                    }
                    hitokotoEl.textContent = hitokotoText;
                }
            })
            .catch(error => {
                console.warn('一言API加载失败：', error);
                // 失败时显示默认文案
                const hitokotoEl = document.querySelector('.hitokoto-text');
                if (hitokotoEl) {
                    hitokotoEl.textContent = '人生如逆旅，我亦是行人。 —— 苏轼';
                }
            });
    }

    // 初始化一言
    getHitokoto();
}
