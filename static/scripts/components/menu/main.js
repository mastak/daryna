define(function (require) {
	'use strict';
	var SLIDER_HEIGHT = 40,
		Marionette = require('marionette'),
		Analytics = require('shared/analytics'),
		$ = require('jquery');
	require('jquery.backgroundXY');

	return Marionette.View.extend({

		initialize: function () {
			this.isMoving = false;
			this.isInside = false;
			this.on('startedmove', this.onStartedMove);
		},

		render: function () {
			this.bindUIElements();
			this.triggerMethod('render', this);
			return this;
		},

		ui: {
			buttons: '.bn'
		},

		events: {
			'mouseenter': 'setInside',
			'mousemove': 'onMouseMove',
			'mouseleave': 'onLeaveEvent',
			'click .bn_follow_user': 'gaTrack'
		},

		onRender: function () {
			if (!this.$el.length) {
				return this;
			}
			$('.addition_panel').on('hide', this.onLeaveEvent.bind(this));
			return this.slideToStart();
		},

		gaTrack: function () {
			Analytics.trackEvent({
				category: 'Follow',
				action: 'User'
			});
			return this;
		},

		setInside: function () {
			this.isInside = true;
			return this;
		},

		onMouseMove: function (event) {
			var $currentTarget = $(event.currentTarget),
				sliderOffsetY = $currentTarget.offset().top,
				maxTopPosition = $currentTarget.height() - SLIDER_HEIGHT / 2;

			this.positionY = event.pageY - sliderOffsetY - SLIDER_HEIGHT / 2;
			if (this.positionY < 0) {
				this.positionY = 0;
			}
			if (this.positionY > maxTopPosition) {
				this.positionY = maxTopPosition;
			}
			if (!this.isMoving) {
				this.trigger('startedmove');
				this.isMoving = true;
			}
			return this;
		},

		onStartedMove: function () {
			if ($('.addition_panel').is(':visible')) {
				this.isMoving = false;
				return this;
			}
			window.setTimeout(function () {
				this.isMoving = false;
				if (!this.isInside) {
					return;
				}
				var $bn = this.findNearestBn(this.positionY);
				if ($bn) {
					this.animateToBn($bn);
				} else {
					this.animateToPosition(this.positionY);
				}
			}.bind(this), 400);
			return this;
		},

		animateToPosition: function (positionY, completeFunction) {
			var $el = this.$el;
			if (parseInt($el.css('backgroundPositionY'), 10) !== positionY) {
				$el.animate({
					backgroundPositionY: positionY
				}, {
					duration: 'fast',
					complete: completeFunction || $.noop
				});
			}
			return this;
		},

		slideToStart: function () {
			var $buttons = this.ui.buttons,
				$buttonsActive = $buttons.filter('.active'),
				activeExists = false;

			if ($buttonsActive.length) {
				this.animateToBn($buttonsActive);
				return this;
			}
			$buttons.each(function (bn) {
				if ($(bn).prop('pathname') === window.location.pathname) {
					activeExists = true;
					this.animateToBn($(this));
					return false;
				}
				return true;
			}, this);
			if (!activeExists) {
				this.animateToBn(this.ui.buttons.filter(':first'));
			}
			return this;
		},

		animateToBn: function ($bn) {
			var $el = this.$el,
				sliderOffset = $el.offset().top,
				bnHeight = $bn.height(),
				bnOffset = $bn.offset().top - sliderOffset - bnHeight / 4 - 1;

			window.setTimeout(function () {
				$bn.siblings().removeClass('hover');
			}, 50);
			this.animateToPosition(bnOffset, function () {
				$bn.addClass('hover');
			});
			return this;
		},

		onLeaveEvent: function () {
			this.isInside = false;
			if ($('.addition_panel').is(':visible')) {
				this.isMoving = false;
				return this;
			}
			this.slideToStart();
			return this;
		},

		findNearestBn: function (positionY) {
			var sliderCenter = positionY + SLIDER_HEIGHT / 2,
				$bn = null,
				sliderOffset = this.$el.offset().top;

			this.ui.buttons.each(function () {
				var currentBnOffset = $(this).offset().top - sliderOffset,
					bnHeight = $(this).height(),
					bnMargin = parseInt($(this).css('marginBottom'), 10);
				if (sliderCenter >= currentBnOffset && sliderCenter <= currentBnOffset + bnHeight + bnMargin) {
					$bn = $(this);
					return false;
				}
				return true;
			});
			return $bn;
		}
	});
});
