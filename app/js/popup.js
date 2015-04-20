/**
 * xkcd-today: Logic for popup
 */

var POPUP = {};
/**
 * An url to the api domain
 * @constant {string}
 */
POPUP.XKCD_API_MAIN = 'http://xkcd.com/';
/**
 * A path to the main file of api
 * @constant {string}
 */
POPUP.XKCD_API_PATH = 'info.0.json';
/**
 * Id of the latest entry
 * @type {number} [latestEntryId=-1]
 */
POPUP.latestEntryId = -1;
/**
 * Last loaded entry's id
 * @type {number} [lastEntryId=-1]
 */
POPUP.lastEntryId = -1;
/**
 * Shows loading error
 */
POPUP.onLoadingError = function () {
    $xkcdContent.removeClass('loading');
    var errorMessage =
        '<div class="ui negative message"> \
        <div class="header"> \
        Sorry, this post cannot be loaded..:( \
        </div> \
        <p>Try <a href="#">reloading.</a>\
        </p></div>';
    $xkcdContent.html(errorMessage);
    $('[href=#reload]').click(function () {
        location.reload();
    });
};
/**
 * Fetches specified entry and shows it.
 * @param {number} [id=-1] Id of the entry to work with, if 0 (1 is the oldest)
 *                         the latest post is fetched.
 * @param {function} [callback=null] A function to be called after
 *                                   the entry has been loaded.
 */
POPUP.getEntryById = function getEntryById(id, callback) {
    entryLoading();

    if (typeof id !== 'number' || id < 0) {
        id = 0;
    }

    var apiUrl = this.XKCD_API_MAIN + this.XKCD_API_PATH;
    if (id > 0) {
        apiUrl = this.XKCD_API_MAIN + id + '/' + this.XKCD_API_PATH;
    }

    $.get(apiUrl, function (data) {
        if (!data['img']) {
            POPUP.onLoadingError();
        }

        $('.xkcd-title').text(data['safe_title']);
        $('.xkcd-alt').text(
            (data['alt'] !== "") ? data['alt'] : "No description"
        );

        var $img = $('#xkcd-img');
        $img.attr('src', data['img']);
        $img.on('load', function () {
            entryReady();
            $('.xkcd-url').on('click', function () {
                chrome.tabs.create({ url: 'http://xkcd.com/'+data['num'] });
            });
        });

        var postDate = new Date(data['year'], data['month'], data['day']);
        $('.xkcd-date').text(postDate.toLocaleDateString());

        // Update lastEntryId
        POPUP.lastEntryId = data['num'];

        // Change icon to default (mark the notification as read)
        chrome.browserAction.setIcon({
            path: "images/icon19.png"
        });
        // Call the callback
        if (typeof callback === 'function') {
            callback();
        }

    }).fail(this.onLoadingError);
};
/**
 * Polls xkcd.com/info.0.json, gets the latest post and then shows it.
 */
POPUP.getLatestEntry = function getLatestEntry() {
    this.getEntryById(0, function () {
        $('.main.segment')
            .mouseenter(function () {
                $(this).dimmer('show');
            })
            .mouseleave(function () {
                $(this).dimmer('hide');
            });

        POPUP.latestEntryId = POPUP.lastEntryId;
        enableButton($btnPrev);
    });
};

/**
 * Enables button by removing .disabled class
 * @param {*|jQuery|HTMLElement} $button a JQuery element
 */
function enableButton($button) {
    $button.removeClass('disabled');
}
/**
 * Disables button by adding .disabled class
 * @param {*|jQuery|HTMLElement} $button a JQuery element
 */
function disableButton($button) {
    $button.addClass('disabled');
}
/**
 * Shows spinner, that indicates something is in progress.
 */
function entryLoading() {
    $xkcdContent.parent().addClass('loading');
}
/**
 * Hides spinner, indicates that content has been loaded
 */
function entryReady() {
    $xkcdContent.parent().removeClass('loading');
}

var $btnPrev = $('.btn-prev');
var $btnNext = $('.btn-next');

var $xkcdContent = $('#xkcd-content');

// Setup ui
$(function () {
    $btnPrev.click(function () {
        if ($btnPrev.hasClass('disabled')) {
            return;
        }

        POPUP.getEntryById(POPUP.lastEntryId - 1, function () {
            if (POPUP.lastEntryId < POPUP.latestEntryId) {
                enableButton($btnNext);
            }

            if (POPUP.lastEntryId <= 0) {
                disableButton($btnPrev);
            }
        });

        $('.xkcd-url').detach('click');
    });
    $btnNext.click(function () {
        if ($btnNext.hasClass('disabled')) {
            return;
        }

        POPUP.getEntryById(POPUP.lastEntryId + 1, function () {
            if (POPUP.lastEntryId >= POPUP.latestEntryId) {
                disableButton($btnNext);
            }

            if (POPUP.lastEntryId > 0) {
                enableButton($btnPrev);
            }
        });
    });
});

POPUP.getLatestEntry();
