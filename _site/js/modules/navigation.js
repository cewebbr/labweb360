/*global $*/
define(['trap'], function () {

	'use strict';

	var navigation = {},
		body = $('#js-body'),
		navigationWrapper = $('#js-navigation-wrapper'),
		navigationList = $('#js-navigation-list'),
		mobileNavigationToggler = $('#js-navigation-toogler'),
		hamburguerButton = mobileNavigationToggler.find('.navigation-toogler__burguer:first'),
		documentHooks = $('html, body'),
		acessibilityMenuContainer = $('#js-acessibility-menu');

	navigation.options = {};
	navigation.options.oppened = false;

	navigation.methods = {

		init : function () {

			navigation.methods.bindMobileBehaviours();


			navigationList.on('click', 'a', function (evt) {

				var _this = $(this);

                navigation.selectedAnchorId = _this.attr('href');

                //Get the hash of the anchor
                navigation.selectedAnchorId = navigation.selectedAnchorId.substring(navigation.selectedAnchorId.indexOf("#") + 1);

                if ($('#' + navigation.selectedAnchorId).length) {

                	evt.preventDefault();

                	navigation.methods.goToSelectedAnchor('#' + navigation.selectedAnchorId);

                }

			});

		},

		bindMobileBehaviours : function () {

			mobileNavigationToggler.on('click', function () {

				navigation.methods.toogleNavigation();

			});

	        //Closes the menu window with the keyboard 'escape' key
	        $(document).keyup(function (evt) {

	            if (evt.keyCode === 27 && navigation.options.oppened) {

	                navigation.methods.toogleNavigation();

	            }

	        });

		},

		toogleNavigation : function () {

			if (navigation.options.oppened) {

				body.off('click.openMenu');
				body.off('touchmove');

				navigation.options.oppened = false;

				navigationWrapper.untrap();

			} else {

				navigation.options.oppened = true;

				navigation.methods.outsideClickCloseMenu();

		        //We stop the touch event to prevent iOS from scrolling the content behind the menu
		        body.on('touchmove', function (evt) {
					evt.preventDefault();
		        });

		        navigationWrapper.trap();

			}

			navigationWrapper.toggleClass('is-open');
			body.toggleClass('navigation-is-open');

		},

		goToSelectedAnchor : function (anchorID) {

			if (navigation.options.oppened) {

				navigation.methods.toogleNavigation();

			}

            navigation.anchorContainer = $(anchorID);

            documentHooks.animate({

                scrollTop: navigation.anchorContainer.offset().top - 80

            }, 700, function () {

                navigation.anchorContainer.attr('tabindex', 0);
            	navigation.anchorContainer.focus();

            });

		},

        outsideClickCloseMenu : function () {

            //We need the setTimeout
            setTimeout(function () {

                body.on('click.openMenu', function (evt) {

                    if ($(evt.target).is(navigationWrapper) && navigation.options.oppened) {

                        navigation.methods.toogleNavigation();

                    }

                });

            }, 0);

        }

	}

	return navigation.methods.init();

});