/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable no-console */
// VOID
// Author: 熊猫小A
// Link: https://blog.imalan.cn/archives/247/

console.log(' %c Theme VOID %c https://blog.imalan.cn/archives/247/ ', 'color: #fadfa3; background: #23b7e5; padding:5px;', 'background: #1c2b36; padding:5px;');

// 节流函数
function throttle(fun, delay, time) {
    var timeout,
        startTime = new Date();

    return function () {
        var context = this,
            args = arguments,
            curTime = new Date();

        clearTimeout(timeout);
        // 如果达到了规定的触发时间间隔，触发 handler
        if (curTime - startTime >= time) {
            fun.apply(context, args);
            startTime = curTime;
            // 没达到触发间隔，重新设定定时器
        } else {
            timeout = setTimeout(fun, delay);
        }
    };
}

var getDeviceState = function (element) {
    var zIndex;
    if (window.getComputedStyle) {
        // 现代浏览器
        zIndex = window.getComputedStyle(element).getPropertyValue('z-index');
    } else if (element.currentStyle) {
        // ie8-
        zIndex = element.currentStyle['z-index'];
    }
    return parseInt(zIndex, 10);
};

var getPrefersDarkModeState = function () {
    var indicator = document.createElement('div');
    indicator.className = 'dark-mode-state-indicator';
    document.body.appendChild(indicator);
    return getDeviceState(indicator) === 11;
};

function setCookie(name, value, time) {
    if (time > 0) {
        document.cookie = name + '=' + escape(value) + ';max-age=' + String(time) + ';path=/';
    } else {
        // session
        document.cookie = name + '=' + escape(value) + ';path=/';
    }   
}

function getCookie(name) {
    var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
    var arr = document.cookie.match(reg);
    if (arr)
        return unescape(arr[2]);
    else
        return null;
}

function checkGoTop() {
    if($(document).scrollTop() > window.innerHeight) {
        $('#go-top').addClass('show');
    } else {
        $('#go-top').removeClass('show');
    }
}

function checkHeader () {
    var tr = $(window).width() > 767 ? 150 : 60;
    if ($(document).scrollTop() > tr) {
        $('body>header').addClass('pull-up');
    } else {
        $('body>header').removeClass('pull-up');
    }
}

var TOC = {
    toggle: function() {
        if($('.TOC').length) {
            $('.TOC').toggleClass('show');
            $('#ctrler-panel').toggleClass('pull-left');
            $('body').toggleClass('sidebar-show');
        }
        $('#setting-panel').removeClass('show');
    },

    close: function() {
        if($('.TOC').length) {
            $('.TOC').removeClass('show');
            $('#ctrler-panel').removeClass('pull-left');
            $('body').removeClass('sidebar-show');
        }
    },

    open: function() {
        if($('.TOC').length) {
            $('.TOC').addClass('show');
            $('#ctrler-panel').addClass('pull-left');
            $('body').addClass('sidebar-show');
        }
    }
};

var VOID = {
    // 初始化单页应用
    init: function () {
        checkHeader();
        reloadMasonry();
        VOID.countWords();
        VOID.parseTOC();
        VOID.parsePhotos();
        VOID.parseUrl();
        VOID.initCopyLink();
        VOID.handleLike();
        pangu.spacingElementByTagName('p');
        // 高亮
        VOID.highlight();
        // 初始化注脚
        $.bigfoot({ actionOriginalFN: 'ignore' });
        // 初始化 touch 事件，移动端设备
        $('.board-item').on('touchstart', function () {
            $(this).addClass('hover');
        });
        $('.board-item').on('touchend', function () {
            $(this).removeClass('hover');
        });
        // 监听滚动事件，实现懒加载
        if (VOIDConfig.lazyload) {
            window.addEventListener('scroll', throttle(VOID.lazyLoad, 100, 1000));
        }
        // headroom
        if (VOIDConfig.headerMode == 0) {
            var header = document.querySelector('body>header');
            var headroom = new Headroom(header, { offset: 60 });
            // initialise
            headroom.init();
        }
        // Mathjax
        if (VOIDConfig.enableMath) {
            MathJax.Hub.Config({
                tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}
            });
            MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
        }
        // hyphen
        VOID.hyphenate();
        AjaxComment.init();
    },

    hyphenate: function() {
        $('div[itemprop=articleBody] p, div[itemprop=articleBody] blockquote').hyphenate('en-us');
    },

    // 解析照片集
    parsePhotos: function () {
        var base = 50;
        $.each($('.photos'), function (i, photoSet) {
            $.each($(photoSet).children(), function (j, item) {
                var img = new Image();
                img.src = $(item).find('img').attr('data-src');
                img.onload = function () {
                    var w = parseFloat(img.width);
                    var h = parseFloat(img.height);
                    $(item).css('width', w * base / h + 'px');
                    $(item).css('flex-grow', w * base / h);
                    $(item).find('a').css('padding-top', h / w * 100 + '%');
                };
            });
        });
    },

    // 解析URL
    parseUrl: function () {
        var domain = document.domain;
        $('a:not(a[href^="#"]):not(".post-like")').each(function (i, item) {
            if ((!$(item).attr('target') || (!$(item).attr('target') == '' && !$(item).attr('target') == '_self'))) {
                if (item.host != domain) {
                    $(item).attr('target', '_blank');
                }
            }
        });

        if (VOIDConfig.PJAX) {
            $.each($('a:not(a[target="_blank"], a[no-pjax])'), function (i, item) {
                if (item.host == domain) {
                    $(item).addClass('pjax');
                }
            });
            $(document).pjax('a.pjax', {
                container: '#pjax-container',
                fragment: '#pjax-container',
                timeout: 8000,
                scrollTo: false
            });
        }
    },

    // PJAX 开始前
    beforePjax: function () {
        NProgress.start();
        $('.toggle').removeClass('pushed');
        $('.mobile-search').removeClass('opened');
        $('header').removeClass('opened');
        $('#setting-panel').removeClass('show');
        if ($('body').hasClass('modal-open')) VOID.closeModal();
        $('#nav-mobile').fadeOut(200);
        TOC.close();
        if ($('.TOC').length > 0) {
            tocbot.destroy();
        }
    },

    alert: function (content, time) {
        var errTemplate = '<div class="msg" id="msg{id}">{Text}</div>';
        var id = new Date().getTime();
        $('body').prepend(errTemplate.replace('{Text}', content).replace('{id}', id));
        $.each($('.msg'), function (i, item) {
            if ($(item).attr('id') != 'msg' + id) {
                $(item).css('top', $(item).offset().top - $(document).scrollTop() + $('.msg#msg' + id).outerHeight() + 20 + 'px');
            }
        });
        $('.msg#msg' + id).addClass('show');
        var t = time;
        if (typeof (t) != 'number') {
            t = 2500;
        }
        setTimeout(function () {
            $('.msg#msg' + id).addClass('hide');
            setTimeout(function () {
                $('.msg#msg' + id).remove();
            }, 1000);
        }, t);
    },

    // 点赞事件处理
    handleLike: function () {
        var liked = getCookie('void_likes');
        if (liked == null) return;
        // 已点赞高亮
        $.each($('.post-like'), function (i, item) {
            var cid = String($(item).attr('data-cid'));
            if (liked.indexOf(',' + String(cid) + ',') != -1) {
                $(item).addClass('done');
            }
        });
    },

    // PJAX 结束后
    afterPjax: function () {
        NProgress.done();
        if ($('#banner').length) {
            $('body>header').removeClass('no-banner');
        } else {
            $('body>header').addClass('no-banner');
        }
        if ($('#loggin-form').length) {
            $('#loggin-form').addClass('need-refresh');
        }

        setTimeout(function () {
            var hash = new URL(window.location.href).hash;
            if (hash != '') {
                $.scrollTo($(hash).offset().top - 80, 500);
            } else {
                VOID.goTop();
            }
        }, 50);
        reloadMasonry();
        VOID.countWords();
        VOID.parseTOC();
        VOID.parsePhotos();
        VOID.parseUrl();
        VOID.initCopyLink();
        VOID.reload();
        VOID.handleLike();
        // hyphen
        VOID.hyphenate();
        AjaxComment.init();
    },

    // 重载与事件绑定
    reload: function () {
        // 重载代码高亮
        VOID.highlight();
        // 重载 MathJax
        if (VOIDConfig.enableMath && typeof MathJax !== 'undefined') {
            MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
        }
        // 重载百度统计
        if (typeof _hmt !== 'undefined') {
            _hmt.push(['_trackPageview', location.pathname + location.search]);
        }
        // 重载 pangu.js
        pangu.spacingElementByTagName('p');
        // 重载社交分享
        getSocial();
        // 重新绑定 touch 事件，移动端设备
        $('.board-item').on('touchstart', function () {
            $(this).addClass('hover');
        });
        $('.board-item').on('touchend', function () {
            $(this).removeClass('hover');
        });
        // 重载注脚
        $.bigfoot({ actionOriginalFN: 'ignore' });
        // 重载表情
        if ($('.OwO').length > 0) {
            new OwO({
                logo: 'OωO',
                container: document.getElementsByClassName('OwO')[0],
                target: document.getElementsByClassName('input-area')[0],
                api: '/usr/themes/VOID/assets/libs/owo/OwO_01.json',
                position: 'down',
                width: '400px',
                maxHeight: '250px'
            });
        }
    },

    scrollTop: 0,

    // 开启模态框
    openModal: function () {
        VOID.scrollTop = document.scrollingElement.scrollTop;
        document.body.classList.add('modal-open');
        document.body.style.top = -VOID.scrollTop + 'px';
    },

    // 关闭模态框
    closeModal: function () {
        document.body.classList.remove('modal-open');
        document.scrollingElement.scrollTop = VOID.scrollTop;
    },

    toggleArchive: function (item) {
        var year = '#year-' + $(item).attr('data-year');
        if ($(year).hasClass('shrink')) {
            $(item).html('-');
            $(year).removeClass('shrink');
            var num = parseInt($(item).attr('data-num'));
            $(year).css('max-height',  num * 49 + 'px');
        }
        else {
            $(item).html('+');
            $(year).addClass('shrink');
            $(year).css('max-height', '0');
        }
    },

    // 解析文章目录
    parseTOC: function () {
        if ($('.TOC').length > 0) {
            var toc_option = {
                // Where to render the table of contents.
                tocSelector: '.TOC',
                // Where to grab the headings to build the table of contents.
                contentSelector: 'div[itemprop=articleBody]',
                // Which headings to grab inside of the contentSelector element.
                headingSelector: 'h2, h3, h4, h5',
                // 收缩深度
                collapseDepth: 6
            };
            tocbot.init(toc_option);
            $.each($('.toc-link'), function(i, item){
                $(item).click(function(){
                    var target = $(document.getElementById($(this).attr('href').replace('#', '')));
                    var posi = target.offset().top - 60;
                    $.scrollTo(posi, 300);
                    if(window.innerWidth < 1200) {
                        TOC.close();
                    }
                    return false;
                });
            });
            // 检查目录
            if(window.innerWidth >= 1200) {
                TOC.open();
            } 
        }
    },

    highlight: function () {
        $.each($('pre code'), function(i, item){
            var lang = '';
            if ($(item).attr('class') != undefined && $(item).attr('class') !== '') {
                lang = $(item).attr('class').toLowerCase().replace('lang-', '').replace('language-', '');
            } else {
                //lang = 'plaintext';
            }
            $(item).parent().attr('data-lang', lang);
            hljs.highlightBlock(item);
            if (VOIDConfig.lineNumbers) {
                hljs.lineNumbersBlock(item, {
                    singleLine: true
                });   
            }
        });
    },

    lazyLoad: function () {
        var viewPortHeight = document.documentElement.clientHeight; //可见区域高度
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop; //滚动条距离顶部高度
        $.each($('img.lazyload'), function (i, item) {
            if ($(item).offset().top < viewPortHeight + scrollTop && $(item).offset().top + $(item).height() > scrollTop) {
                if (!$(item).hasClass('loaded') && !$(item).hasClass('error')) {
                    var img = new Image();
                    img.src = $(item).attr('data-src');
                    img.onload = function () {
                        $(item).animate({ opacity: 0 }, 150);
                        setTimeout(function () {
                            $(item).attr('src', $(item).attr('data-src'));
                            $(item).addClass('loaded');
                            $(item).animate({ opacity: 1 }, 180);
                        }, 180);
                    };
                    img.onerror = function () {
                        $(item).addClass('error');
                    };
                }
            }
        });
    },

    countWords: function () {
        if ($('#totalWordCount').length) {
            var total = 0;
            $.each($('a.archive-title'), function (i, item) {
                total += parseInt($(item).attr('data-words'));
            });
            $('#totalWordCount').html(total);
        }
    },

    goTop: function () {
        $.scrollTo(0, 500);
    },

    like: function (sel) {
        var cid = parseInt($(sel).attr('data-cid'));

        // 首先检查该 cid 是否已经点过赞了
        var liked = getCookie('void_likes');
        if (liked == null) liked = ',';

        if (liked.indexOf(',' + String(cid) + ',') != -1) {
            VOID.alert('您已经点过赞了~');
        } else {
            $.post(VOIDConfig.likePath, {
                cid: cid
            }, function (data) {
                $(sel).addClass('done');
                var num = $(sel).find('.like-num').text();
                $(sel).find('.like-num').text(parseInt(num) + 1);
                // 设置 cookie，一周有效
                liked = liked + String(cid) + ',';
                setCookie('void_likes', liked, 3600 * 24 * 7);
            }, 'json');
        }
    },

    clipboards : [],
    initCopyLink: function() {
        for(i = 0; i<VOID.clipboards.length; i++) {
            VOID.clipboards.pop().destroy();
        }

        $.each($('h2 .copy-link, h3 .copy-link, h4 .copy-link'), function(i, item){
            loc = encodeURI(window.location.origin 
                + window.location.pathname 
                + '#' 
                + $(item).parent().attr('id'));
            $(item).attr('data-clipboard-text', loc);
            $(item).addClass('loaded').html('¶');
        });

        if($('.copy-link').length) {
            var clipboard = new ClipboardJS('.copy-link');
            clipboard.on('success', function(e) {
                VOID.alert('章节链接已复制');
            });
            clipboard.on('error', function(e) {
                VOID.alert('抱歉，无法复制章节链接。请联系站长。');
            });
            VOID.clipboards.push(clipboard);
        }
    },

    rememberPos: function () {
        setCookie('void_pos', String($(document).scrollTop()));
    }
};

var DarkModeSwitcher = {
    checkColorScheme: function () {
        // 非自动模式
        if (VOIDConfig.colorScheme != 0) return;

        if (VOIDConfig.followSystemColorScheme && getPrefersDarkModeState()) { // 自动模式跟随系统
            document.body.classList.add('theme-dark');
            var night = getCookie('theme_dark');
            if (night != '1') {
                VOID.alert('已为您开启深色模式。');
            }
            setCookie('theme_dark', '1', 7200);
        } else { // 自动模式，定时            
            // 全部转换至当天
            sunset = new Date(new Date().setHours(
                Math.floor(VOIDConfig.darkModeTime.start), 
                60 * (VOIDConfig.darkModeTime.start - Math.floor(VOIDConfig.darkModeTime.start)), 0));
            sunrise = new Date(new Date().setHours(
                Math.floor(VOIDConfig.darkModeTime.end), 
                60 * (VOIDConfig.darkModeTime.end - Math.floor(VOIDConfig.darkModeTime.end)), 0));

            var current = new Date();
            // 格式化为小时
            var sunset_s = VOIDConfig.darkModeTime.start;
            var sunrise_s = VOIDConfig.darkModeTime.end;
            var current_s = current.getHours() + current.getMinutes() / 60;
            // 若不存在 cookie，根据时间判断，并设置 cookie
            if (getCookie('theme_dark') == null) {
                if (current_s > sunset_s || current_s < sunrise_s) {
                    document.body.classList.add('theme-dark');
                    if (current_s > sunset_s) // 如果当前为夜晚，日出时间应该切换至第二日
                        sunrise = new Date(sunrise.getTime() + 3600000 * 24);
                    // 现在距日出还有 (s)
                    var toSunrise = (sunrise.getTime() - current.getTime()) / 1000;
                    // 设置 cookie
                    setCookie('theme_dark', '1', parseInt(toSunrise));
                    VOID.alert('日落了，夜间模式已开启。');
                } else {
                    document.body.classList.remove('theme-dark');
                }
            } else {
                // 若存在 cookie，根据 cookie 判断
                night = getCookie('theme_dark');
                if (night == '0') {
                    document.body.classList.remove('theme-dark');
                } else if (night == '1') {
                    document.body.classList.add('theme-dark');
                }
            }
        }
    },

    tuneBg: function() {
        if ($('body').hasClass('theme-dark') && $('#bg-style').attr('data-darkBg') != '') {
            $('body').addClass('with-bg');
            $('#bg-style').html('main::before{background-image: url('+ $('#bg-style').attr('data-darkBg') +')}');
        } else if (!$('body').hasClass('theme-dark') && $('#bg-style').attr('data-lightBg') != '') {
            $('body').addClass('with-bg');
            $('#bg-style').html('main::before{background-image: url('+ $('#bg-style').attr('data-lightBg') +')}');
        } else {
            $('body').removeClass('with-bg');
            $('#bg-style').html('');
        }
    },

    toggleByHand: function () {
        $('#toggle-night').addClass('switching');
        setTimeout(function(){
            $('body').toggleClass('theme-dark');
            DarkModeSwitcher.tuneBg();
            if($('body').hasClass('theme-dark')) {
                setCookie('theme_dark', '1', 0);
            } else {
                setCookie('theme_dark', '0', 0);
            }
            setTimeout(function () {
                $('#toggle-night').removeClass('switching'); 
            }, 1000);
        }, 600);
    }
};

DarkModeSwitcher.checkColorScheme();
DarkModeSwitcher.tuneBg();

var AjaxComment = {
    noName: '必须填写用户名',
    noMail: '必须填写电子邮箱地址',
    noContent: '必须填写评论内容',
    invalidMail: '邮箱地址不合法',
    commentsOrder: 'DESC',
    commentList: '.comment-list',
    comments: '#comments .comments-title',
    commentReply: '.comment-reply',
    commentForm: '#comment-form',
    respond: '.respond',
    textarea: '#textarea',
    submitBtn: '#comment-submit-button',
    newID: '',
    parentID: '',

    bindClick: function () {
        $(AjaxComment.commentReply + ' a, #cancel-comment-reply-link').unbind('click');
        $(AjaxComment.commentReply + ' a').click(function () { // 回复
            AjaxComment.parentID = $(this).parent().parent().parent().attr('id');
            $(AjaxComment.textarea).focus();
        });
        $('#cancel-comment-reply-link').click(function () { // 取消
            AjaxComment.parentID = '';
        });
    },

    err: function () {
        $(AjaxComment.submitBtn).attr('disabled', false);
        AjaxComment.newID = '';
    },

    finish: function () {
        TypechoComment.cancelReply();
        $(AjaxComment.submitBtn).html('提交评论');
        $(AjaxComment.textarea).val('');
        $(AjaxComment.submitBtn).attr('disabled', false);
        if ($('#comment-' + AjaxComment.newID).length > 0) {
            $.scrollTo($('#comment-' + AjaxComment.newID).offset().top - 50, 500);
            $('#comment-' + AjaxComment.newID).fadeTo(500, 1);
        }
        $('.comment-num .num').html(parseInt($('.comment-num .num').html()) + 1);
        AjaxComment.bindClick();
        VOID.highlight();
    },

    init: function () {
        AjaxComment.bindClick();
        $(AjaxComment.commentForm).submit(function () { // 提交事件
            $(AjaxComment.submitBtn).attr('disabled', true);

            /* 检查 */
            if ($(AjaxComment.commentForm).find('#author')[0]) {
                if ($(AjaxComment.commentForm).find('#author').val() == '') {
                    VOID.alert(AjaxComment.noName);
                    AjaxComment.err();
                    return false;
                }

                if ($(AjaxComment.commentForm).find('#mail').val() == '') {
                    VOID.alert(AjaxComment.noMail);
                    AjaxComment.err();
                    return false;
                }

                var filter = /^[^@\s<&>]+@([a-z0-9]+\.)+[a-z]{2,4}$/i;
                if (!filter.test($(AjaxComment.commentForm).find('#mail').val())) {
                    VOID.alert(AjaxComment.invalidMail);
                    AjaxComment.err();
                    return false;
                }
            }

            var textValue = $(AjaxComment.commentForm).find(AjaxComment.textarea).val().replace(/(^\s*)|(\s*$)/g, '');//检查空格信息
            if (textValue == null || textValue == '') {
                VOID.alert(AjaxComment.noContent);
                AjaxComment.err();
                return false;
            }
            $(AjaxComment.submitBtn).html('提交中');
            $.ajax({
                url: $(AjaxComment.commentForm).attr('action'),
                type: $(AjaxComment.commentForm).attr('method'),
                data: $(AjaxComment.commentForm).serializeArray(),
                error: function () {
                    VOID.alert('提交失败！请重试。');
                    $(AjaxComment.submitBtn).html('提交评论');
                    AjaxComment.err();
                    return false;
                },
                success: function (data) { //成功取到数据
                    try {
                        if (!$(AjaxComment.commentList, data).length) {
                            var msg = '提交失败！请重试。' + $($(data)[7]).text();
                            VOID.alert(msg);
                            $(AjaxComment.submitBtn).html('提交评论');
                            AjaxComment.err();
                            return false;
                        } else {
                            AjaxComment.newID = $(AjaxComment.commentList, data).html().match(/id="?comment-\d+/g).join().match(/\d+/g).sort(function (a, b) {
                                return a - b;
                            }).pop();

                            if ($('.pager .prev').length && AjaxComment.parentID == '') {
                                // 在分页对文章发表评论，无法取得最新评论内容
                                VOID.alert('评论成功！请回到评论第一页查看。');
                                AjaxComment.newID = '';
                                AjaxComment.parentID = '';
                                AjaxComment.finish();
                                return false;
                            }

                            var newCommentType = AjaxComment.parentID == '' ? 'comment-parent' : 'comment-child';
                            var newCommentData = '<div itemscope itemtype="http://schema.org/UserComments" id="comment-' + AjaxComment.newID + '" style="opacity:0" class="comment-body ' + newCommentType + '">' + $(data).find('#comment-' + AjaxComment.newID).html() + '</div>';

                            // 当页面无评论，先添加一个评论容器
                            if ($(AjaxComment.commentList).length <= 0) {
                                $('#comments').append('<h3 class="comment-separator"><div class="comment-tab-current"><span class="comment-num">已有 <span class="num">0</span> 条评论</span></div></h3>')
                                    .append('<div class="comment-list"></div>');
                            }

                            if (AjaxComment.parentID == '') {
                                // 无父 id，直接对文章评论，插入到第一个 comment-list 头部
                                $('#comments>.comment-list').prepend(newCommentData);
                                VOID.alert('评论成功！');
                                AjaxComment.finish();
                                AjaxComment.newID = '';
                                return false;
                            } else {
                                if ($('#' + AjaxComment.parentID).hasClass('comment-parent')) {
                                    // 父评论是母评论
                                    if ($('#' + AjaxComment.parentID + ' > .comment-children').length > 0) {
                                        // 父评论已有子评论，插入到子评论列表头部
                                        $('#' + AjaxComment.parentID + ' > .comment-children > .comment-list').prepend(newCommentData);
                                    }
                                    else {
                                        // 父评论没有子评论，新建一层包裹
                                        newCommentData = '<div class="comment-children"><div class="comment-list">' + newCommentData + '</div></div>';
                                        $('#' + AjaxComment.parentID).append(newCommentData);
                                    }
                                } else {
                                    // 父评论是子评论，与父评论平级，并放在后面
                                    $('#' + AjaxComment.parentID).after(newCommentData);
                                }
                                VOID.alert('评论成功！');
                                AjaxComment.finish();
                                AjaxComment.parentID = '';
                                AjaxComment.newID = '';
                                return false;
                            }
                        }
                    } catch (e) {
                        window.location.reload();
                    }
                } // end success()
            }); // end ajax()
            return false;
        }); // end submit()
    }
};

$(document).ready(function () {
    VOID.init();
    if(getCookie('void_pos') != null && parseFloat(getCookie('void_pos')) != -1) {
        $(document).scrollTop(parseFloat(getCookie('void_pos')));
        setCookie('void_pos', -1);
    } 
});

function clickIn(e, el) {
    return $(el).has(e.target).length || $(el).get(0) === e.target;
}

$('body').on('click', function(e) {
    if (!clickIn(e, '.mobile-search-form') && !clickIn(e, '#toggle-mobile-search')) {
        if ($('.mobile-search-form').hasClass('opened')) {
            $('.mobile-search-form').removeClass('opened');
            return false;
        }
    }

    if (!clickIn(e, '#toggle-setting-pc') && !clickIn(e, '#toggle-setting')) {
        if ($('#setting-panel').hasClass('show') && !clickIn(e, '#setting-panel')) {
            $('#setting-panel').removeClass('show');
            if($('#login-panel').length)
                $('#login-panel').removeClass('show');
            return false;
        }
    }
});

if (VOIDConfig.PJAX) {
    $(document).on('pjax:send', function () {
        VOID.beforePjax();
    });

    $(document).on('pjax:complete', function () {
        VOID.afterPjax();
    });

    $(document).on('pjax:end', function () {	
        if ($('.TOC').length < 1) {	
            $('#ctrler-panel').removeClass('pull-left');	
            $('body').removeClass('sidebar-show');	
        }	
    });
}

setInterval(function () {
    var times = new Date().getTime() - Date.parse(VOIDConfig.buildTime);
    times = Math.floor(times / 1000); // convert total milliseconds into total seconds
    var days = Math.floor(times / (60 * 60 * 24)); //separate days
    times %= 60 * 60 * 24; //subtract entire days
    var hours = Math.floor(times / (60 * 60)); //separate hours
    times %= 60 * 60; //subtract entire hours
    var minutes = Math.floor(times / 60); //separate minutes
    times %= 60; //subtract entire minutes
    var seconds = Math.floor(times / 1); // remainder is seconds
    $('#uptime').html(days + ' 天 ' + hours + ' 小时 ' + minutes + ' 分 ' + seconds + ' 秒 ');
}, 1000);

window.addEventListener('scroll', function () {
    checkGoTop();
    checkHeader();
});

function startSearch(item) {
    var c = $(item).val();
    $(item).val('');
    $(item).blur();
    if (!c || c == '') {
        $(item).attr('placeholder', '你还没有输入任何信息');
        return;
    }
    var t = VOIDConfig.searchBase + c;
    if (VOIDConfig.PJAX) {
        $.pjax({
            url: t,
            container: '#pjax-container',
            fragment: '#pjax-container',
            timeout: 8000,
        });
    } else {
        window.open(t, '_self');
    }
}

function enterSearch(item) {
    var event = window.event || arguments.callee.caller.arguments[0];
    if (event.keyCode == 13) {
        startSearch(item);
    }
}

function toggleSearch() {
    $('.mobile-search-form').toggleClass('opened');
    setTimeout(function () {
        if ($('.mobile-search-form').hasClass('opened')) {
            $('.mobile-search-form input').focus();
        } else {
            $('.mobile-search-form input').blur();
        }
    }, 400);
}

function toggleNav(item) {
    $(item).toggleClass('pushed');
    $('header').toggleClass('opened');
    TOC.close();
    if ($(item).hasClass('pushed')) {
        $('#nav-mobile').fadeIn(200);
        VOID.openModal();
    }
    else {
        VOID.closeModal();
        $('#nav-mobile').fadeOut(200);
    }
}

function toggleSettingPanel(item, direction) {
    if ($('#setting-panel').hasClass('show')) {
        $('#setting-panel').removeClass('show');
        if($('#login-panel').length)
            $('#login-panel').removeClass('show');
    } else {
        var w = $('#setting-panel').outerWidth();
        var left, top, bottom;

        $('#setting-panel').css('top', 'unset');
        $('#setting-panel').css('bottom', 'unset');

        if (direction) { // 左向上，使用 bottom 定位
            left =  $(item).offset().left - w - 10;
            bottom = $(document).scrollTop() + window.innerHeight - $(item).offset().top - $(item).outerHeight();
            $('#setting-panel').css('left', left + 'px');
            $('#setting-panel').css('bottom', bottom + 'px');
        } else { // 左向下
            left =  $(item).offset().left - w + $(item).width();
            top = $(item).offset().top - $(document).scrollTop() + $(item).outerHeight();
            $('#setting-panel').css('left', left + 'px');
            $('#setting-panel').css('top', top + 'px');
        }

        $('#setting-panel').addClass('show');
    }
}

function toggleSerif (item, serif) {
    $('.font-indicator').removeClass('checked');
    $(item).addClass('checked');
    if (serif) {
        if ($('#stylesheet_noto').length < 1)
            $('body').append('<link id="stylesheet_noto" href="https://fonts.googleapis.com/css?family=Noto+Serif+SC:400,700&amp;subset=chinese-simplified" rel="stylesheet">');
        $('body').addClass('serif');
        setCookie('serif', '1', 604800);
    } else {
        if ($('#stylesheet_droid').length < 1)
            $('body').append('<link id="stylesheet_droid" href="https://fonts.googleapis.com/css?family=Droid+Serif:400,700" rel="stylesheet">');
        $('body').removeClass('serif');
        setCookie('serif', '0', 604800);
    }
}

function adjustTextsize(up) {
    var current = parseInt($('body').attr('fontsize'));
    
    if (up) {
        if (current >= 5) {
            VOID.alert('已经是最大了！');
            return;
        }
        $('body').attr('fontsize', String(current + 1));
    } else {
        if (current <= 1) {
            VOID.alert('已经是最小了！');
            return;
        }
        $('body').attr('fontsize', String(current - 1));
    }

    reloadMasonry();
    setCookie('textsize', $('body').attr('fontsize'), 604800);
}

function toggleLoginForm() {
    $('#login-panel').toggleClass('show');
    $('#login-panel input[name=referer]').val(window.location.href);

    if ($('#loggin-form').hasClass('need-refresh') && $('#login-panel').hasClass('show')) {
        $.get({
            url: location.href,
            success: function (data) {
                $('form#loggin-form').attr('action', $(data).find('form#loggin-form').attr('action'));
                $('#loggin-form').removeClass('need-refresh');
            },
            error: function () {
                VOID.alert('请求登陆参数错误。请在刷新后尝试登陆。');
                setTimeout(function () {
                    location.reload();
                }, 1000);
            }
        });
    }
}