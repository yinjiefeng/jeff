/**
 * Created by jeff on 2017/4/6.
 */
"use strict";

(() => {
    const SECTION_HEIGHT = 960;

    let Index = {
        name: 111,
        section2: null,
        section3: null,
        init: function () {
            this._init().bindEvents();

            return this;
        },
        _init: function () {
            this.section2 = $('#section2');
            this.section3 = $('#section3');

            return this;
        },
        bindEvents: function () {
            this.initCustomBind();
            $(window).on('scroll', this.onScoll.bind(this));

            return this;
        },
        initCustomBind: function () {
            //解决IE10以下不支持Function.bind
            if (!Function.prototype.bind) {
                Function.prototype.bind = function(oThis) {
                    if (typeof this !== "function") {
                        throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
                    }
                    var aArgs = Array.prototype.slice.call(arguments, 1),
                        fToBind = this,
                        fNOP = function() {},
                        fBound = function() {
                            return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
                                aArgs.concat(Array.prototype.slice.call(arguments)));
                        };
                    fNOP.prototype = this.prototype;
                    fBound.prototype = new fNOP();
                    return fBound;
                };
            }
        },
        onScoll: function () {
            let scrollTop = $(document).scrollTop();
            let lazyPic = $(document).find('.lazy');
            let winHeight = $(window).height();

            $.each(lazyPic, function (index, elem) {
                let top = $(elem).offset().top;
                if(top < (scrollTop + winHeight)) {
                    let dataSrc = "images/" + $(elem).attr("data-src");
                    let src = $(elem).attr("src");
                    if(dataSrc !== src) {
                        $(elem).hide().attr("src", dataSrc).fadeIn();
                    }
                }
            });
        }
    }

    Index.init();
})();