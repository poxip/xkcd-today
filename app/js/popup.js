/**
 * xkcd-today: Logic for popup
 */

var POPUP = {};
/**
 * A API url to the latest post.
 * @constant {string}
 */
POPUP.XKCD_TODAY = 'http://xkcd.com/info.0.json';

/**
 * Shows loading error
 */
POPUP.onLoadingError = function () {
    $('#xkcd-content').removeClass('loading');
    var errorMessage =
        '<div class="ui negative message"> \
        <div class="header"> \
        Sorry, this post cannot be loaded..:( \
        </div> \
        <p>Try <a href="#reload">reloading.</a>\
        </p></div>';
    $('#xkcd-content').html(errorMessage);
    $('[href=#reload]').click(function () {
        location.reload();
    });
};

/**
 * Polls xkcd.com/info.0.json, gets the latest post and then shows it.
 */
POPUP.getLatest = function () {
    var self = this;
    $.get(this.XKCD_TODAY, function (data) {
        if (!data['img']) {
            this.onLoadingError();
        }

        $('.xkcd-title').text(data['safe_title']);
        $('.xkcd-alt').text(
            (data['alt'] !== "") ? data['alt'] : "No description"
        );

        var img = $('#xkcd-img')[0];
        img.src = data['img'];
        img.addEventListener('load', function() {
            var $xkcdContent = $('#xkcd-content');
            $xkcdContent.parent().removeClass('loading');
            $xkcdContent.transition('fade');
            
            $('.xkcd-url').click(function () {
                chrome.tabs.create({ url: 'http://xkcd.com/'+data['num'] });
            });
        });

        var postDate = new Date(data['year'], data['month'], data['day']);
        $('.xkcd-date').text(postDate.toLocaleDateString());

        // Change icon to default (mark the notification as read)
        chrome.browserAction.setIcon({
            path: "images/icon19.png"
        });

    }).fail(this.onLoadingError);
};

// Setup Semantic UI
$(function () {
    $('.accordion').accordion();

    $('.main.segment')
        .mouseenter(function () {
            $(this).dimmer('show');
        })
        .mouseleave(function () {
            $(this).dimmer('hide');
        });
});

POPUP.getLatest();
