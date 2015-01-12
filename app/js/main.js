/**
 * xkcd-today - main javascript file
 *
 * @author poxip
 *
 */

// Setup Semantic UI
$(function () {
    $('.accordion').accordion();
});

var APP = {};
/**
 * A API url to the latest post.
 * @type {string}
 */
APP.XKCD_TODAY = 'http://xkcd.com/info.0.json';

/**
 * Shows loading error
 */
APP.onLoadingError = function () {
    // @TODO: @poxip
    console.error("Error while loading a post")
    $('#xkcd-content').removeClass('loading');
};

/**
 * Polls xkcd.com/info.0.json, gets the latest post and then show it.
 */
APP.getLatest = function () {
    $.get(this.XKCD_TODAY, function (data) {
        if (!data['img']) {
            this.onLoadingError();
        }

        $('#xkcd-title').text(data['safe_title']);
        $('#xkcd-alt').text(
            (data['alt'] !== "") ? data['alt'] : "No description"
        );

        var img = $('#xkcd-img')[0];
        img.src = data['img'];
        img.addEventListener('load', function() {
            $('#xkcd-content').removeClass('loading');
        });

        var postDate = new Date(data['year'], data['month'], data['day']);
        $('#xkcd-date').text(postDate.toLocaleDateString());

    }).fail(this.onLoadingError);
};

APP.getLatest();