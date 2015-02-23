/**
 * xkcd-today: Event Page
 */

'use strict';

/**
 * All stuff connected with the backgroung, e.g. looking for updates
 * @type {Object}
 */
var BG = {};
/**
 * An url to the api
 * @constant {string}
 */
BG.API_URL = 'http://xkcd.com/info.0.json';
/**
 * Name used to regonize the alarm
 * @constant {string}
 */
BG.ALARM_NAME = 'check-update';
/**
 * Chrome Alarm for updates stuff
 * @type {Alarm}
 */
BG.alarm = {
    when: Date.now(),
    periodInMinutes: 3 * 60 // 3h
};
/**
 * An id of the latest entry on xkcd.com
 * @type {string}
 */
BG.latestEntryId = 0;
// Load the latest entry's id from storage
chrome.storage.sync.get({
    latestEntryId: BG.latestEntryId
}, function (items) {
    BG.latestEntryId = items.latestEntryId;
});
/**
 * Method looking for updates
 */
BG.checkUpdates = function checkUpdates() {
    console.log("Checking for updates..");
    var self = this;

    $.get(this.API_URL, function (data) {
        var id = data['num'];

        // replace '' with the right link and save
        if (self.latestEntryId === 0) {
            chrome.storage.sync.set({
                latestEntryId: id
            });
            self.latestEntryId = id;
        }

        if (id !== BG.latestEntryId) {
            /* new posts */
            console.log('BG: New posts');

            self.latestEntryId = id;
            chrome.storage.sync.set({
                latestEntryId: id
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
 * A callback method for the updates Alarm
 */
BG.alarmCallback = function alarmCallback() {
    this.checkUpdates();
};

chrome.alarms.create(BG.ALARM_NAME, BG.alarm);
chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name === BG.ALARM_NAME) {
        BG.alarmCallback();
    }
});