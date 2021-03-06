﻿//  TODO: This file kind of feels like an anti-pattern.
define(function () {
    'use strict';

    var Settings = Backbone.Model.extend({
        
        defaults: function() {
            return {
                localDebug: false,
                testing: false,
                serverURL: '',
                suggestedQuality: this.getItem('suggestedQuality') || 'default',
                userId: this.getItem('userId') || null,
                showTooltips: this.getItem('showTooltips') || true,
                remindClearStream: this.getItem('remindClearStream') || true,
                remindDeletePlaylist: this.getItem('remindDeletePlaylist') || true,
                showTimeRemaining: this.getItem('showTimeRemaining') || false,
                searchQuery: this.getItem('searchQuery') || ''
            };
        },
        
        initialize: function () {
            //  BaseURL is needed for ajax requests to the server.
            if (this.get('localDebug')) {
                this.set('serverURL', 'http://localhost:61975/');
            }
            else {
                this.set('serverURL', 'http://streamus.apphb.com/');
            }

            this.on('change:suggestedQuality', function(model, suggestedQuality) {
                localStorage.setItem('suggestedQuality', suggestedQuality);
            });
            
            this.on('change:userId', function (model, userId) {
                localStorage.setItem('userId', JSON.stringify(userId));
            });

            this.on('change:showTooltips', function(model, showTooltips) {
                localStorage.setItem('showTooltips', JSON.stringify(showTooltips));
            });

			this.on('change:remindClearStream', function (model, remindClearStream) {
                localStorage.setItem('remindClearStream', JSON.stringify(remindClearStream));
			});

            this.on('change:remindDeletePlaylist', function(model, remindDeletePlaylist) {
                localStorage.setItem('remindDeletePlaylist', JSON.stringify(remindDeletePlaylist));
            });

            this.on('change:showTimeRemaining', function(model, showTimeRemaining) {
                localStorage.setItem('showTimeRemaining', JSON.stringify(showTimeRemaining));
            });

            this.on('change:searchQuery', function(model, searchQuery) {
                localStorage.setItem('searchQuery', JSON.stringify(searchQuery));
            });

        },
        
        //  Fetch an item from localStorage, try and turn it from a string to an object literal if possible.
        //  If not, just allow the string type because its assumed to be correct.
        getItem: function(key) {
            var item = localStorage.getItem(key);

            if (item !== null) {

                try {
                    //  Make sure I don't send back 'null' or 'undefined' as string types.
                    item = JSON.parse(item);
                } catch (exception) {
                    //  Consume any exceptions because might try and parse a GUID which isn't valid JSON.
                }
            }

            return item;
        }
  
    });
    
    //  Exposed globally so that the foreground can access the same instance through chrome.extension.getBackgroundPage()
    window.Settings = new Settings();
    return window.Settings;
});