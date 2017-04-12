/**
 * Created by jeff on 2017/4/11.
 */
"use strict";

(function () {
    var SPEED = 1*1000;
    var DURATION = "0.5s";

    var JeffSlider = {
        slider: null,
        prevBtn: null,
        nextBtn: null,
        sliderContent: null,
        sliderItem: null,
        width: 0,
        slideCount: 0,
        isAutoPlay: false,
        currentPage: 0,
        slideContentStyle: {},
        init: function () {
            this.slider = document.querySelector(".jeff-slider");
            this.prevBtn = this.slider.querySelector(".jeff-slider-prev");
            this.nextBtn = this.slider.querySelector(".jeff-slider-next");
            this.sliderContent = this.slider.querySelector(".jeff-slider-content");
            this.slideCount = this.sliderContent.children.length;
            this.sliderItemArray = this.sliderContent.querySelectorAll(".jeff-slider-item");
            this.width = this.slider.offsetWidth;
            this.sliderItemArray.forEach(function (val, index, arr) {
                val.style.width = JeffSlider.width+"px";
            });
            this.slideContentStyle.width = (this.slideCount * 100) + '%';

            var autoPlayAttr = this.slider.getAttribute("auto-play");
            this.isAutoPlay = (autoPlayAttr === "true");

            this.isAutoPlay && this.setAutoPlay();

            this.setSelectedPage(this.currentPage);

            this.bindEvents();
        },
        bindEvents: function () {
            this.prevBtn.onclick = this.onPrevClicked;
            this.nextBtn.onclick = this.onNextClicked;
        },
        onPrevClicked: function () {
            if(JeffSlider.currentPage > 0) {
                JeffSlider.currentPage--;
                JeffSlider.setSelectedPage(JeffSlider.currentPage);
            }
        },
        onNextClicked: function () {
            if(JeffSlider.currentPage < JeffSlider.slideCount-1) {
                JeffSlider.currentPage++;
                JeffSlider.setSelectedPage(JeffSlider.currentPage);
            }
        },
        setAutoPlay: function () {
            setInterval(function () {
                JeffSlider.onNextClicked();
                if(JeffSlider.currentPage === JeffSlider.slideCount-1) {
                    JeffSlider.currentPage = -1;
                }
            }, SPEED);
        },
        setSelectedPage: function (page) {
            var offsetX = -1 * page * this.width;

            this.setCompatibleStyle(this.slideContentStyle, "transition-duration", DURATION);
            this.setCompatibleStyle(this.slideContentStyle, "transform", "translate3d("+ offsetX +"px, 0px, 0px)");
            this.sliderContent.setAttribute('style', this.transferStyleObjToStr(this.slideContentStyle));

            if(page === 0) {
                //first page
                this.prevBtn.style.display = "none";
                this.nextBtn.style.display = "block";
            } else if (page === this.slideCount-1) {
                //last page
                this.prevBtn.style.display = "block";
                this.nextBtn.style.display = "none";
            } else {
                this.prevBtn.style.display = "block";
                this.nextBtn.style.display = "block";
            }
        },
        setCompatibleStyle: function (styleObj, styleName, styleValue) {
            styleObj["-webkit-"+styleName] = styleValue;
            styleObj["-moz-"+styleName] = styleValue;
            styleObj["-ms-"+styleName] = styleValue;
            styleObj["-o-"+styleName] = styleValue;
            styleObj[styleName] = styleValue;
        },
        transferStyleObjToStr: function (styleObj) {
            var cssStr = '';
            for(var key in styleObj) {
                if(styleObj.hasOwnProperty(key)) {
                    cssStr += key + ':' + styleObj[key] + ';';
                }
            }
            return cssStr;
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        JeffSlider.init();
    });
})();