/**
 * Created by jeff on 2017/4/11.
 */
"use strict";

(function () {
    var SPEED = 2*1000;
    var duration = 0.5;
    var DURATION = duration + "s";
    var CLS_ACTIVE = 'active';

    function JeffSlider(elemId) {
        var context = this;

        this.slider = null;
        this.prevBtn = null;
        this.nextBtn = null;
        this.sliderContent = null;
        this.sliderItem = null;
        this.sliderControl = null;
        this.width = 0;
        this.slideCount = 0;
        this.isAutoPlay = false;
        this.currentPage = 1;
        this.sliderControlItem = null;
        this.slideContentStyle = {};

        this.init = function () {
            //this.slider = document.querySelector(".jeff-slider");
            this.slider = document.getElementById(elemId);
            this.prevBtn = this.slider.querySelector(".jeff-slider-prev");
            this.nextBtn = this.slider.querySelector(".jeff-slider-next");
            this.sliderContent = this.slider.querySelector(".jeff-slider-content");
            this.sliderControl = this.slider.querySelector(".jeff-slider-controls");
            this.slideCount = this.sliderContent.children.length;
            this.sliderItemArray = this.sliderContent.querySelectorAll(".jeff-slider-item");
            this.width = this.slider.offsetWidth;
            this.sliderItemArray.forEach(function (val, index, arr) {
                val.style.width = context.width+"px";
            });
            this.slideContentStyle.width = (this.slideCount * 100) + '%';

            var autoPlayAttr = this.slider.getAttribute("auto-play");
            this.isAutoPlay = (autoPlayAttr === "true");

            this.isAutoPlay && this.setAutoPlay();

            var isHidePrevNextButton = this.slider.getAttribute("is-hide-prev-next-button");
            if(isHidePrevNextButton === "true") {
                this.prevBtn.style.display = "none";
                this.nextBtn.style.display = "none";
            }

            var isShowControlButton = this.slider.getAttribute("is-show-control-button");
            if(isShowControlButton === "true") {
                this.sliderControl.style.display = "block";
            }

            this.initControls().bindEvents();

            this.setSelectedPage(this.currentPage);
        },
        this.initControls = function () {
            var html = '';
            for(var i=0; i<this.slideCount -2;i++) {
                html += '<div class="jeff-slider-controls-item" slider-index="'+ (i+1) +'"></div>';
            }
            this.sliderControl.innerHTML = html;

            return this;
        },
        this.bindEvents = function () {
            var self = this;

            this.prevBtn.onclick = this.onPrevClicked;
            this.nextBtn.onclick = this.onNextClicked;

            this.sliderControlItem = this.slider.querySelectorAll(".jeff-slider-controls-item");
            this.sliderControlItem.forEach(function (value, index, array) {
                if(value.attachEvent) {
                    value.attachEvent('onclick', function () {
                        var index = this.getAttribute("slider-index");
                        self.currentPage = index;
                        self.setSelectedPage(self.currentPage);
                    });
                } else {
                    value.addEventListener('click', function () {
                        var index = this.getAttribute("slider-index");
                        self.currentPage = index;
                        self.setSelectedPage(self.currentPage);
                    });
                }
            });
        },
        this.setActiveControlItem = function (selectedIndex) {
            var self = this;

            this.sliderControlItem.forEach(function (value, index, array) {
                var index = value.getAttribute("slider-index");
                if(index == selectedIndex) {
                    if(!self.hasClass(value, CLS_ACTIVE)) {
                        self.addClass(value, CLS_ACTIVE);
                    }
                } else {
                    if(self.hasClass(value, CLS_ACTIVE)) {
                        self.removeClass(value, CLS_ACTIVE);
                    }
                }
            });
        },
        this.onPrevClicked = function () {
            if(context.currentPage > 0) {
                context.currentPage--;
                context.setSelectedPage(context.currentPage);
            } else {
                context.currentPage = context.slideCount - 2;
                context.setSelectedPage(context.currentPage, true);
                setTimeout(function () {
                    context.currentPage --;
                    context.setSelectedPage(context.currentPage);
                }, duration*100);
            }
        },
        this.onNextClicked = function () {
            if(context.currentPage < context.slideCount-1) {
                context.currentPage++;
                context.setSelectedPage(context.currentPage);
            } else {
                context.currentPage = 1;
                context.setSelectedPage(context.currentPage, true);
                setTimeout(function () {
                    context.currentPage ++;
                    context.setSelectedPage(context.currentPage);
                }, duration*100);
            }
        },
        this.setAutoPlay = function () {
            setInterval(function () {
                context.onNextClicked();
            }, SPEED);
        },
        this.setSelectedPage = function (page, isStopAnimation) {
            var offsetX = -1 * page * this.width;

            if(isStopAnimation) {
                this.setCompatibleStyle(this.slideContentStyle, "transition-duration", 0);
            } else {
                this.setCompatibleStyle(this.slideContentStyle, "transition-duration", DURATION);
            }

            if(page === this.slideCount-1) {
                this.setActiveControlItem(1);
            } else if(page === 0) {
                this.setActiveControlItem(this.slideCount-2);
            } else {
                this.setActiveControlItem(page);
            }

            this.setCompatibleStyle(this.slideContentStyle, "transform", "translate3d("+ offsetX +"px, 0px, 0px)");
            this.sliderContent.setAttribute('style', this.transferStyleObjToStr(this.slideContentStyle));
        },
        this.setCompatibleStyle = function (styleObj, styleName, styleValue) {
            styleObj["-webkit-"+styleName] = styleValue;
            styleObj["-moz-"+styleName] = styleValue;
            styleObj["-ms-"+styleName] = styleValue;
            styleObj["-o-"+styleName] = styleValue;
            styleObj[styleName] = styleValue;
        },
        this.transferStyleObjToStr = function (styleObj) {
            var cssStr = '';
            for(var key in styleObj) {
                if(styleObj.hasOwnProperty(key)) {
                    cssStr += key + ':' + styleObj[key] + ';';
                }
            }
            return cssStr;
        },
        this.addClass = function(obj, cls){
            var obj_class = obj.className,//获取 class 内容.
                blank = (obj_class != '') ? ' ' : '',//判断获取到的 class 是否为空, 如果不为空在前面加个'空格'.
                added = obj_class + blank + cls;//组合原来的 class 和需要添加的 class.
            obj.className = added;//替换原来的 class.
        },
        this.removeClass = function(obj, cls){
            var obj_class = ' '+obj.className+' ',//获取 class 内容, 并在首尾各加一个空格. ex) 'abc    bcd' -> ' abc    bcd '
                obj_class = obj_class.replace(/(\s+)/gi, ' '),//将多余的空字符替换成一个空格. ex) ' abc    bcd ' -> ' abc bcd '
                removed = obj_class.replace(' '+cls+' ', ' ');//在原来的 class 替换掉首尾加了空格的 class. ex) ' abc bcd ' -> 'bcd '
            removed = removed.replace(/(^\s+)|(\s+$)/g, '');//去掉首尾空格. ex) 'bcd ' -> 'bcd'
            obj.className = removed;//替换原来的 class.
        },
        this.hasClass = function(obj, cls){
            var obj_class = obj.className,//获取 class 内容.
                obj_class_lst = obj_class.split(/\s+/);//通过split空字符将cls转换成数组.
            var x = 0;
            for(x in obj_class_lst) {
                if(obj_class_lst[x] == cls) {//循环数组, 判断是否包含cls
                    return true;
                }
            }
            return false;
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        new JeffSlider("slider1").init();
        new JeffSlider("slider2").init();
    });
})();