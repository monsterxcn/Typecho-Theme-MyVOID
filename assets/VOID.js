/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable no-console */
// VOID
// Author: 熊猫小A
// Link: https://blog.imalan.cn/archives/247/

var VOID_Content = {
    countWords: function () {
        if ($('#totalWordCount').length) {
            var total = 0;
            $.each($('a.archive-title'), function (i, item) {
                total += parseInt($(item).attr('data-words'));
            });
            $('#totalWordCount').html(total);
        }
    },

    // 解析文章目录
    parseTOC: function () {
        if ($('.TOC').length > 0) {
            var toc_option = {
                // Where to render the table of contents.
                tocSelector: '.TOC',
                // Where to grab the headings to build the table of contents.
                contentSelector: 'div.articleBody',
                // Which headings to grab inside of the contentSelector element.
                headingSelector: 'h2, h3, h4, h5',
                // 收缩深度
                collapseDepth: 6
            };
            tocbot.init(toc_option);
            $.each($('.toc-link'), function(i, item){
                $(item).click(function(){
                    VOID_SmoothScroller.scrollTo($(this).attr('href'), -60);
                    if(window.innerWidth < 1200) {
                        TOC.close();
                    }
                    return false;
                });
            });
            // 检查目录
            if(window.innerWidth >= 1200) {
                TOC.close();
            } 
        }
    },

    // 解析照片集
    parsePhotos: function () {
        $.each($('div.articleBody figure:not(.size-parsed)'), function (i, item){
            var img = new Image();
            img.onload = function () {
                var w = parseFloat(img.width);
                var h = parseFloat(img.height);
                $(item).addClass('size-parsed');
                $(item).css('width', w + 'px');
                $(item).css('flex-grow', w * 50 / h);
                $(item).find('a').css('padding-top', h / w * 100 + '%');
            };
            img.src = $(item).find('img').attr('data-src');
        });
    },

    // 处理友链列表
    parseBoardThumbs: function () {
        $.each($('.board-thumb'), function(i, item) {
            if (VOIDConfig.lazyload)
                $(item).html('<img class="lazyload" data-src="' +$(item).attr('data-thumb')+ '">');
            else
                $(item).html('<img src="' +$(item).attr('data-thumb')+ '">');
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
                timeout: 8000
            });
        }
    },

    highlight: function () {
        $.each($('.yue pre code'), function (i, item) {
            var classStr = $(item).attr('class');

            if (typeof(classStr) == 'undefined') {
                classStr = 'language-none';
            }

            if (classStr.indexOf('lang') == -1) {
                classStr += ' language-none';
            }

            $(item).attr('class', classStr);
        });
        
        Prism.highlightAll();
    },

    bigfoot: function () {
        // 初始化注脚
        $.bigfoot({ actionOriginalFN: 'ignore' });
    },

    pangu: function () {
        pangu.spacingElementByTagName('p');
    },

    math: function () {
        if (VOIDConfig.enableMath && typeof MathJax !== 'undefined') {
            MathJax.Hub.Config({
                tex2jax: {
                    inlineMath: [ ['$','$'], ['\\(','\\)'] ],
                    displayMath: [ ['$$','$$'], ['\\[','\\]'] ]
                },
                tex: {
                    inlineMath: [ ['$','$'], ['\\(','\\)'] ],
                    displayMath: [ ['$$','$$'], ['\\[','\\]'] ]
                }
            });
            MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
        }
    },

    mermaid: function () {
        if (VOIDConfig.enableMermaid && $('.mermaid').length > 0) {
            var mmtheme = '';
            // init https://mermaid-js.github.io/mermaid/#/mermaidAPI?id=mermaidapi-configuration-defaults
            if (VOIDConfig.colorScheme != 0) {
                mmtheme = (VOIDConfig.colorScheme == 1) ? 'default' : 'dark';
            } else if (VOID_Util.getCookie('theme_dark') == null) {
                mmtheme = ($('.theme-dark').length > 0) ? 'dark' : 'default';
            } else {
                mmtheme = (VOID_Util.getCookie('theme_dark') == 1) ? 'dark' : 'default';
            }
            VOID_Util.setCookie('theme_mermaid', mmtheme, 0);
            var config = {
                theme: mmtheme,
                startOnLoad: true,
                logLevel: 'fatal',
                flowchart: {
                    useMaxWidth: false,
                    htmlLabels: true,
                    curve: 'linear'
                },
                sequence: {
                    diagramMarginX:50,
                    diagramMarginY:10,
                    actorMargin:50,
                    width:150,
                    height:65,
                    boxMargin:10,
                    boxTextMargin:5,
                    noteMargin:10,
                    messageMargin:35,
                    messageAlign:'center',
                    mirrorActors:true,
                    bottomMarginAdj:1,
                    useMaxWidth:true,
                    rightAngles:false,
                    showSequenceNumbers: true
                }
            };
            // console.log('Initialize mermaid: theme-'+config.theme+'\n\n');
            mermaid.initialize(config);
            mermaid.init();
            // console.log('Initialize mermaid finished...\n');
        }
    },

    mermaidToggle: function () {
        // 重新渲染 Mermaid 图表，theme:default<>dark
        if (VOIDConfig.enableMermaid && $('.mermaid').length > 0) {
            // re-render 先将所有 .mermaid 恢复为 includes/footer.php L167 保存的初始状态
            $.each($('.mermaid'), function (i, item) {
                $(item).html(mmarr[i]).removeAttr('data-processed');
            });
            var mmtheme = (VOID_Util.getCookie('theme_mermaid') == 'dark') ? 'default' : 'dark';
            VOID_Util.setCookie('theme_mermaid', mmtheme, 0);
            config = {
                theme: mmtheme,
                startOnLoad: true,
                logLevel: 'fatal',
                flowchart: {
                    useMaxWidth: false,
                    htmlLabels: true,
                    curve: 'linear'
                },
                sequence: {
                    diagramMarginX:50,
                    diagramMarginY:10,
                    actorMargin:50,
                    width:150,
                    height:65,
                    boxMargin:10,
                    boxTextMargin:5,
                    noteMargin:10,
                    messageMargin:35,
                    messageAlign:'center',
                    mirrorActors:true,
                    bottomMarginAdj:1,
                    useMaxWidth:true,
                    rightAngles:false,
                    showSequenceNumbers: true
                }
            };
            // console.log('Re-render mermaid: theme-'+config.theme+'\n\n');
            mermaid.initialize(config);
            mermaid.init();
            // console.log('Re-render mermaid finished...\n');
        }
    },

    hitokoto: function () {
        if (VOIDConfig.enableHitokoto) {
            $.ajax({
                url: VOIDConfig.hitokotoApi,
                async: true,
                dataType: 'jsonp',
                jsonpCallback: 'portraitCallBack',
                scriptCharset: 'GBK',
                contentType: 'text/html; charset=GBK',
                success: function (data) {
                    $('#hitokoto').html(data['msg']);
                }
            });
        }
    },

    hyphenate: function() {
        $('div.articleBody p, div.articleBody blockquote').hyphenate('en-us');
    }
};

var VOID = {
    // 初始化单页应用
    init: function () {
        /* 初始化 UI */
        VOID_Ui.checkHeader();
        VOID_Ui.MasonryCtrler.init();
        VOID_Ui.DarkModeSwitcher.checkColorScheme();
        VOID_Ui.checkScrollTop();
        VOID_Content.parseBoardThumbs();
        VOID_Ui.lazyload();
        VOID_Ui.headroom();

        VOID_Content.countWords();
        VOID_Content.parseTOC();
        VOID_Content.parsePhotos();
        VOID_Content.highlight();
        VOID_Content.parseUrl();
        VOID_Content.pangu();
        VOID_Content.bigfoot();
        VOID_Content.hitokoto();
        VOID_Content.math();
        VOID_Content.mermaid();
        VOID_Content.hyphenate();
        
        VOID_Vote.reload();
        AjaxComment.init();

        $('body').on('click', function (e) {
            if (!VOID_Util.clickIn(e, '.mobile-search-form') && !VOID_Util.clickIn(e, '#toggle-mobile-search')) {
                if ($('.mobile-search-form').hasClass('opened')) {
                    $('.mobile-search-form').removeClass('opened');
                    return false;
                }
            }
            if (!VOID_Util.clickIn(e, '#toggle-setting-pc') && !VOID_Util.clickIn(e, '#toggle-setting')) {
                if ($('body').hasClass('setting-panel-show') && !VOID_Util.clickIn(e, '#setting-panel')) {
                    $('body').removeClass('setting-panel-show');
                    setTimeout(function () {
                        $('#setting-panel').hide();
                    }, 300);
                    return false;
                }
            }
        });
    },

    // PJAX 开始前
    beforePjax: function () {
        NProgress.start();
        VOID_Ui.reset();
    },

    // PJAX 结束后
    afterPjax: function () {
        NProgress.done();

        VOID_Content.parseBoardThumbs();

        if ($('#loggin-form').length) {
            $('#loggin-form').addClass('need-refresh');
        }

        VOID_Ui.MasonryCtrler.init();
        VOID_Ui.lazyload();
        
        VOID_Ui.checkScrollTop();
        VOID_Content.countWords();
        VOID_Content.parseTOC();
        VOID_Content.parsePhotos();
        VOID_Content.parseUrl();
        VOID_Content.highlight();
        VOID_Content.math();
        VOID_Content.mermaid();
        VOID_Content.hyphenate();
        VOID_Content.pangu();
        VOID_Content.bigfoot();
        VOID_Content.hitokoto();

        VOID_Vote.reload();

        // 重载表情
        if ($('.OwO').length > 0) {
            new OwO({
                logo: 'OωO',
                container: document.getElementsByClassName('OwO')[0],
                target: document.getElementsByClassName('input-area')[0],
                api: VOIDConfig.owoBase,
                position: 'down',
                width: '400px',
                maxHeight: '250px'
            });
        }

        // 重载 Artalk
        if ($('#ArtalkComments').length > 0) {
            new Artalk({
                el: '#ArtalkComments',
                placeholder: '来啊，快活啊 (/ω＼)',
                noComment: '快来成为第一个评论的人吧~',
                defaultAvatar: 'mp',
                pageKey: VOIDConfig.artKey,
                serverUrl: VOIDConfig.artServer,
                readMore: {
                    pageSize: 10, // 每次请求获取评论数
                    autoLoad: true // 滚动到底部自动加载
                }
            });
        }
        
        AjaxComment.init();
    },

    endPjax: function () {
        if ($('.TOC').length < 1) {	
            TOC.close();
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

    startSearch: function (item) {
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
    },
    
    enterSearch: function (item) {
        var event = window.event || arguments.callee.caller.arguments[0];
        if (event.keyCode == 13) {
            VOID.startSearch(item);
        }
    }
};

var VOID_Vote = {
    vote: function (item) {
        var type = $(item).attr('data-type');
        var id = $(item).attr('data-item-id');
        var table = $(item).attr('data-table');

        var cookieName = 'void_vote_' + table + '_' + type;
        var voted = VOID_Util.getCookie(cookieName);
        if (voted == null) voted = ',';

        // 首先检查本地 cookie
        if (voted.indexOf(',' + id + ',') != -1) {
            $(item).addClass('done');
            VOID.alert('您已经投过票了~');
            return;
        }

        // 当是评论投票时检查是否已经投过另一个选项
        if ($(item).hasClass('comment-vote')) {
            var type_2 = '';
            if (type == 'up') type_2 = 'down';
            else type_2 = 'up';
            if (VOID_Vote.checkVoted(type_2, id, table)) {
                VOID.alert('暂不支持更改投票哦～');
                return;
            }
        }

        $.ajax({
            url: VOIDConfig.votePath + table,
            type: 'POST',
            data: JSON.stringify({
                'id': parseInt(id),
                'type': type
            }),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (data) {
                if (data.code >= 200 && data.code < 400) {
                    $(item).addClass('done');
                    voted += id + ',';
                    VOID_Util.setCookie(cookieName, voted, 3600 * 24 * 90);
                }
                switch (data.code) {
                case 200:
                    var prev = parseInt($(item).find('.value').text());
                    $(item).find('.value').text(prev + 1);
                    break;
                case 302:
                    VOID.alert('您好像已经投过票了呢～');
                    break;
                case 403:
                    VOID.alert('暂不支持更改投票哦～');
                    break;
                default:
                    break;
                }
            },
            error: function () {
                VOID.alert('投票失败 o(╥﹏╥)o，请稍后重试');
            }
        });
    },

    checkVoted: function (type, id, table) {
        var cookieName = 'void_vote_' + table + '_' + type;
        var voted = VOID_Util.getCookie(cookieName);
        if (voted == null) voted = ',';
        return voted.indexOf(',' + id + ',') != -1;
    },

    reload: function () {
        // 高亮已记录的
        $.each($('.vote-button'), function (i, item) {
            var type = $(item).attr('data-type');
            var id = $(item).attr('data-item-id');
            var table = $(item).attr('data-table');

            if (VOID_Vote.checkVoted(type, id, table)) {
                $(item).addClass('done');
            }
        });
    },

    toggleFoldComment: function (coid, item) {
        var sel = '#comment-'+String(coid);
        $(sel).toggleClass('fold');
        if ($(sel).hasClass('fold')) {
            $(item).text('点击展开');
        } else {
            $(item).text('还是叠上吧');
        }
    },
};

var Share = {
    parseItem: function (item) {
        item = $(item).parent();
        return {
            url: $(item).attr('data-url'),
            site: $(item).attr('data-site'),
            title: $(item).attr('data-title'),
            excerpt: $(item).attr('data-excerpt'),
            img: $(item).attr('data-img'),
            twitter: $(item).attr('data-twitter'),
            weibo: $(item).attr('data-weibo'),
        };
    },

    toQQ: function (item) {
        var content = Share.parseItem(item);
        var url = 'http://connect.qq.com/widget/shareqq/index.html?url='+ content.url +'&title='+ content.title +'&source='+ content.site
            +'&summary='+ content.excerpt
            +'&pics='+ content.img ;
        window.open(url);
    },

    toWeibo: function (item) {
        var content = Share.parseItem(item);
        var url = 'http://service.weibo.com/share/share.php?appkey=&title=分享《'+ content.title + '》 @' + content.weibo + '%0a%0a' + content.excerpt
            +'&url='+content.url
            +'&pic='+content.img+'&searchPic=false&style=simple';
        window.open(url);
    },

    toTwitter: function (item) {
        var content = Share.parseItem(item);
        var url = 'https://twitter.com/intent/tweet?text=分享《'+ content.title + '》 @' + content.twitter + '%0a%0a' + content.excerpt
            + '%20' + content.url;
        window.open(url);
    }
};

var AjaxComment = {
    noName: '必须填写用户名',
    noMail: '必须填写电子邮箱地址',
    noUrl: '必须填写 URL',
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
            VOID_SmoothScroller.scrollTo($('#comment-' + AjaxComment.newID).offset().top, -60);
            $('#comment-' + AjaxComment.newID).fadeTo(500, 1);
        }
        $('.comment-num .num').html(parseInt($('.comment-num .num').html()) + 1);
        AjaxComment.bindClick();
        VOID_Content.highlight();
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

                if (typeof $(AjaxComment.commentForm).find('#mail').attr('required') != 'undefined') {
                    // 需要邮箱
                    if ($(AjaxComment.commentForm).find('#mail').val() == '') {
                        VOID.alert(AjaxComment.noMail);
                        AjaxComment.err();
                        return false;
                    }
                }

                if ($(AjaxComment.commentForm).find('#mail').val() != '') {
                    var filter = /^[^@\s<&>]+@([a-z0-9]+\.)+[a-z]{2,4}$/i;
                    if (!filter.test($(AjaxComment.commentForm).find('#mail').val())) {
                        VOID.alert(AjaxComment.invalidMail);
                        AjaxComment.err();
                        return false;
                    }
                }

                if ($(AjaxComment.commentForm).find('#url').val() == '' 
                    && typeof $(AjaxComment.commentForm).find('#url').attr('required') != 'undefined') {
                    VOID.alert(AjaxComment.noUrl);
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
                            var newCommentData = '<div id="comment-' + AjaxComment.newID + '" style="opacity:0" class="comment-body ' + newCommentType + '">' + $(data).find('#comment-' + AjaxComment.newID).html() + '</div>';

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

(function () {
    $(document).ready(function () {
        VOID.init();
        if (VOIDConfig.PJAX) {
            $(document).on('pjax:send', function () {
                VOID.beforePjax();
            });
    
            $(document).on('pjax:complete', function () {
                VOID.afterPjax();
            });
    
            $(document).on('pjax:end', function () {	
                VOID.endPjax();
            });
        }
    });

    window.setInterval(function () {
        var times = new Date().getTime() - Date.parse(VOIDConfig.buildTime);
        times = Math.floor(times / 1000); // convert total milliseconds into total seconds
        var days = Math.floor(times / (60 * 60 * 24)); //separate days
        times %= 60 * 60 * 24; //subtract entire days
        var hours = Math.floor(times / (60 * 60)); //separate hours
        times %= 60 * 60; //subtract entire hours
        var minutes = Math.floor(times / 60); //separate minutes
        times %= 60; //subtract entire minutes
        var seconds = Math.floor(times / 1); // remainder is seconds
        $('#uptime').html(days + ' 天 ' + hours + ' 时 ' + minutes + ' 分 ' + seconds + ' 秒 ');
    }, 1000);
})();