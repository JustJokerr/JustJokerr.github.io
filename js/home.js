//检测窗口宽度并隐藏文字式导航
document.addEventListener('DOMContentLoaded', function() {//确保dom完全加载,不知道为什么不这么写就找不到...
    var elementToHide = document.getElementById('navigation1');
    var elementToShow = document.getElementById('navigation2');//这两个navigation不知道为什么classname取不到
    var elementToShow2 = document.getElementById('headericon');
    var elementToHide2 = document.getElementsByClassName('preview');
    function sizeAdapt() {
      if (window.innerWidth < 600) {
        elementToHide.style.display = 'none';
        elementToShow.style.display=  'none';
        elementToShow2.style.display=  '';
      } else {
        elementToHide.style.display = '';
        elementToShow2.style.display=  'none';
      }
      hidelist();
    }
    function previewtohide() {
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
    function showlist(){
        elementToShow.style.display = '';
    }
    function hidelist(){
        elementToShow.style.display = 'none';
    }
    
    elementToShow2.addEventListener('click',function(){
        showlist();
    });
    
    document.addEventListener('click',function(event){
        if(!elementToShow2.contains(event.target)){
            hidelist();
        }
    });
  
    sizeAdapt();
    hidelist();
    previewtohide();
    window.addEventListener('resize', sizeAdapt); //监听窗口大小变化
    window.addEventListener('resize', previewtohide);
  });
 //这段用css的@media会不会更快点? 不过首页css太乱了懒得再加了,后续维护起来也不好,就用js好了



