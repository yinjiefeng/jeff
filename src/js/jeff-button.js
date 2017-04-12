/**
 * Created by jeff on 2017/4/11.
 */
"use strict";

(function () {
    var duration = 750;
    var DURATION_STYLE = duration + "ms";
    var TIMING_FUNCTION = "cubic-bezier(0.250, 0.460, 0.450, 0.940)";
    var ANIMATION_CLASS = " jeff-button-animation";

    var JeffButton = {
        name: 'jeff',
        init: function () {
            this.bindEvents();
        },
        bindEvents: function () {
            document.querySelector('.jeff-button').addEventListener('click', this.onButtonClicked);
        },
        onButtonClicked: function (evt) {
            var button = evt.target,
                waveDiv = document.createElement('div');

            button.appendChild(waveDiv);

            var posObj = JeffButton.getButtonPos(button),
                mouseX = evt.pageX,
                mouseY = evt.pageY,
                offsetX = (mouseX - posObj.left) + 'px',
                offsetY = (mouseY - posObj.top) + 'px',
                startStyle = {
                    top: offsetY,
                    left: offsetX
                },
                scale = 'scale(' + button.clientWidth/10 + ')';

            waveDiv.className += ANIMATION_CLASS;

            JeffButton.setOpacityStyle(startStyle, 1);
            JeffButton.setCompatibleStyle(startStyle, "transform", scale);
            JeffButton.setCompatibleStyle(startStyle, "transition-duration", DURATION_STYLE);
            JeffButton.setCompatibleStyle(startStyle, "transition-timing-function", TIMING_FUNCTION);

            waveDiv.setAttribute('style', JeffButton.transferStyleObjToStr(startStyle));

            var finishStyle = {
                top: offsetY,
                left: offsetX
            };
            JeffButton.setOpacityStyle(finishStyle, 0);
            JeffButton.setCompatibleStyle(finishStyle, "transform", scale);
            JeffButton.setCompatibleStyle(finishStyle, "transition-duration", DURATION_STYLE);
            JeffButton.setCompatibleStyle(finishStyle, "transition-timing-function", TIMING_FUNCTION);

            setTimeout(function () {
                waveDiv.setAttribute("style", JeffButton.transferStyleObjToStr(finishStyle));
                //remove wave div
                setTimeout(function () {
                    button.removeChild(waveDiv);
                }, duration);

            }, 200);
        },
        setCompatibleStyle: function (styleObj, styleName, styleValue) {
            styleObj["-webkit-"+styleName] = styleValue;
            styleObj["-moz-"+styleName] = styleValue;
            styleObj["-ms-"+styleName] = styleValue;
            styleObj["-o-"+styleName] = styleValue;
            styleObj[styleName] = styleValue;
        },
        setOpacityStyle: function (styleObj, opacity) {
            styleObj["filter"] = "Alpha(opacity="+ opacity*100 +")";
            styleObj["-moz-opacity"] = opacity;
            styleObj["opacity"] = opacity;
        },
        transferStyleObjToStr: function (styleObj) {
            var cssStr = '';
            for(var key in styleObj) {
                if(styleObj.hasOwnProperty(key)) {
                    cssStr += key + ':' + styleObj[key] + ';';
                }
            }
            return cssStr;
        },
        //获取按钮起始位置
        getButtonPos: function (target) {
            var position = {
                top:0,
                left:0
            };
            var ele = document.documentElement;
            'undefined' !== typeof target.getBoundingClientRect && (position = target.getBoundingClientRect());
            return {
                top:position.top + window.pageXOffset - ele.clientTop,
                left:position.left + window.pageYOffset - ele.clientLeft
            }
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        JeffButton.init();
    });
})();