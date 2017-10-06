/*global $, require, FastClick*/
(function () {

	'use strict';

    var PUBLIC = {},
        PRIVATE = {}

    PRIVATE.init = function () {

        //configure our requireJS paths
        require.config({
            paths: {
                'skipLinks': 'modules/skip-links',
                'navigation': 'modules/navigation',
                'trap': 'plugins/trap',
                'highlight': 'plugins/highlight.min'
            }
        });

        PUBLIC.init();

    };

	PUBLIC.init = function () {

		PUBLIC.skipLinks();

        PUBLIC.navigation();

        PUBLIC.highlightJS();



	};

    PUBLIC.skipLinks = function () {

        var skipLinksContainer = document.getElementById('js-skip-links');

        if (skipLinksContainer) {

            require(['skipLinks']);

        }

    };

    PUBLIC.navigation = function () {

        var navigationContainer = document.getElementById('js-navigation-wrapper');

        if (navigationContainer) {

            require(['navigation']);

        }

    };

    PUBLIC.highlightJS = function () {

        var highlightJSContainer = document.querySelectorAll('.highlight-js');

        if (highlightJSContainer.length) {

            require(['highlight'], function () {

                for (var i = 0; i < highlightJSContainer.length; i = i + 1) {

                    hljs.highlightBlock(highlightJSContainer[i]);

                }

            });

        }

    };

    return PRIVATE.init();

})();