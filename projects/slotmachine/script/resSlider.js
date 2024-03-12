var Slider = function(id, Web, Tab, Mobile, spacing){
    var containerWidth = 0;
    var sliderItemWidth = 0;
    var totalCount = 0;
    var spacing = spacing || 10;
    var display = Web;
    var left = 0;
    var interval;
  
    var DOM = {
      container: function(id){
        var dom = document.querySelector(`#${id}`);
        dom.className = 'container';
        dom.style.position = 'relative';
        dom.style.overflow = 'hidden';
        return dom;
      },
      slider: function(container){
        totalCount = container.children.length;
  
        var dom = document.createElement('div');
        dom.className = 'slider'
        dom.style.position = 'relative';
        dom.style.overflow = 'hidden';
        dom.style.height = '100%';
        dom.style.left = 0;
        dom.style.transition = 'left .5s';
        return dom;
      }
    }
  
    // DOM 만들기
    var container = DOM.container(id);
    var slider = DOM.slider(container);
    var temp = container.innerHTML;
    container.innerHTML = '';
    slider.innerHTML = temp;
    container.appendChild(slider);
    var items = document.querySelector(`#${id} .slider`).children;
    for(var i=0; i<items.length; i++){
      items[i].style.float = 'left';
      items[i].style.height = '100%';
      items[i].style.width = (sliderItemWidth-spacing)+ 'px';
      items[i].style.marginRight = spacing+'px'; // 간격
    }
  
    // 화면 사이즈 수정시 발생하는 이벤트
    function resize(){
      left = 0;
      document.querySelector(`#${id} .slider`).style.left = left + 'px';
  
      var innerWidth = window.innerWidth;
      if(innerWidth >= 1000){
        setDisplayCount(Web);
      }else if(innerWidth < 1000 && innerWidth >= 768) {
        setDisplayCount(Tab);
      }else if (innerWidth < 768) {
        setDisplayCount(Mobile);
      }
      
      if(display === 1){
        spacing = 0;
        var items = document.querySelector(`#${id} .slider`).children;
        for(var i=0; i<items.length; i++){
          items[i].style.width = sliderItemWidth + 'px';
          items[i].style.marginRight = 0 + 'px';
        }
      }
    }
  
    // 디스플레이 갯수 설정 함수
    function setDisplayCount(count) {
      display = count;
  
      containerWidth = container.offsetWidth + spacing;
      sliderItemWidth = containerWidth / display;
  
      document.querySelector(`#${id} .slider`).style.width = totalCount * sliderItemWidth + spacing * totalCount + 'px';
      var items = document.querySelector(`#${id} .slider`).children;
      for(var i=0; i<items.length; i++){
        items[i].style.width = (sliderItemWidth-spacing)+ 'px';
      }
    }
  
    // 반응형 디스플레이 갯수 조절
    var isResponsive = Tab != undefined && Mobile != undefined;
    if(isResponsive){
      window.onresize = resize;
    }
    resize();
  
  
    return {
      setDisplayCount: setDisplayCount,
      move: function(index){
        left = (-1) * sliderItemWidth * index;
        document.querySelector(`#${id} .slider`).style.left = left + 'px';
      },
      prev: function(){
        left += sliderItemWidth;
        var limit = 0;
        if(left > limit){
          left = limit;
        }
        document.querySelector(`#${id} .slider`).style.left = left + 'px';
      },
      next: function(){
        left -= sliderItemWidth;
        var limits = (-1) * sliderItemWidth * (totalCount - display);
        if(left < limits){
          left = limits;
        }
        document.querySelector(`#${id} .slider`).style.left = left + 'px';
      },
      auto: function(){
        clearInterval(interval);
        interval = setInterval(function(){
          left -= sliderItemWidth;
          var limits = (-1) * sliderItemWidth * (totalCount - display);
          if(left < limits){
            left = 0;
          }
          document.querySelector(`#${id} .slider`).style.left = left + 'px';
        }, 2000)
      },
      stop: function(){
        clearInterval(interval);
      }
    }
  }
  
  var slider = new Slider('slider', 3, 2, 1, 20);
  slider.auto();