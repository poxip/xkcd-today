/**
 * xkcd-today: Event Page
 */

'use strict';

/**
 * All stuff connected with RSS, e.g. looking for updates
 * @type {Object}
 */
var RSS = {};
/**
 * An url to the RSS feed
 * @constant {string}
 */
RSS.FEED_URL = 'http://xkcd.com/rss.xml';
/**
 * Name used to regonize the alarm
 * @constant {string}
 */
RSS.ALARM_NAME = 'rss-update';
/**
 * Chrome Alarm for RSS stuff
 * @type {Alarm}
 */
RSS.alarm = {
    when: Date.now(),
    periodInMinutes: 3 * 60 // 3h
};
/**
 * A link to the latest entry on xkcd.com
 * @type {string}
 */
RSS.latestLink = '';
// Load the latest link from storage
chrome.storage.sync.get({
    latestLink: RSS.latestLink
}, function (items) {
    RSS.latestLink = items.latestLink;
});
/**
 * Method looking for updates
 */
RSS.checkUpdates = function checkUpdates() {
    var self = this;

    $.get(this.FEED_URL, function (data) {
        var $xml = $(data);
        var item = $xml.find('item')[0];
        var link = item.children[1].innerHTML;

        // replace '' with the right link and save
        if (self.latestLink === '') {
            chrome.storage.sync.set({
                latestLink: link
            });
            self.latestLink = link;
        }

        if (link !== RSS.latestLink) {
            /* new posts */
            console.log('RSS: New posts');

            self.latestLink = link;
            chrome.storage.sync.set({
                latestLink: link
            });
            // Send notification
            chrome.notifications.create('xkcd-updates', {
                type: "basic",
                iconUrl: "images/icon128.png",
                title: "New comics arrived",
                message: "Check it out now!"
            }, function () {
            });
            chrome.browserAction.setIcon({
                path: "images/icon-notify19.png"
            });
        }
    });
};
/**
 * A callback method for the RSS Alarm
 */
RSS.alarmCallback = function alarmCallback() {
    this.checkUpdates();
};

chrome.alarms.create('rss-update', RSS.alarm);
chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name === RSS.ALARM_NAME) {
        RSS.alarmCallback();
    }
});