'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

require('../../../src/stylus/components/_tooltips.styl');

var _colorable = require('../../mixins/colorable');

var _colorable2 = _interopRequireDefault(_colorable);

var _delayable = require('../../mixins/delayable');

var _delayable2 = _interopRequireDefault(_delayable);

var _dependent = require('../../mixins/dependent');

var _dependent2 = _interopRequireDefault(_dependent);

var _detachable = require('../../mixins/detachable');

var _detachable2 = _interopRequireDefault(_detachable);

var _menuable = require('../../mixins/menuable');

var _menuable2 = _interopRequireDefault(_menuable);

var _toggleable = require('../../mixins/toggleable');

var _toggleable2 = _interopRequireDefault(_toggleable);

var _helpers = require('../../util/helpers');

var _console = require('../../util/console');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
// Mixins

// Helpers


/* @vue/component */
exports.default = {
    name: 'v-tooltip',
    mixins: [_colorable2.default, _delayable2.default, _dependent2.default, _detachable2.default, _menuable2.default, _toggleable2.default],
    props: {
        closeDelay: {
            type: [Number, String],
            default: 200
        },
        debounce: {
            type: [Number, String],
            default: 0
        },
        disabled: Boolean,
        fixed: {
            type: Boolean,
            default: true
        },
        openDelay: {
            type: [Number, String],
            default: 200
        },
        tag: {
            type: String,
            default: 'span'
        },
        transition: String,
        zIndex: {
            default: null
        }
    },
    data: function data() {
        return {
            calculatedMinWidth: 0,
            closeDependents: false
        };
    },
    computed: {
        calculatedLeft: function calculatedLeft() {
            var _dimensions = this.dimensions,
                activator = _dimensions.activator,
                content = _dimensions.content;

            var unknown = !this.bottom && !this.left && !this.top && !this.right;
            var activatorLeft = this.isAttached ? activator.offsetLeft : activator.left;
            var left = 0;
            if (this.top || this.bottom || unknown) {
                left = activatorLeft + activator.width / 2 - content.width / 2;
            } else if (this.left || this.right) {
                left = activatorLeft + (this.right ? activator.width : -content.width) + (this.right ? 10 : -10);
            }
            if (this.nudgeLeft) left -= parseInt(this.nudgeLeft);
            if (this.nudgeRight) left += parseInt(this.nudgeRight);
            return this.calcXOverflow(left, this.dimensions.content.width) + 'px';
        },
        calculatedTop: function calculatedTop() {
            var _dimensions2 = this.dimensions,
                activator = _dimensions2.activator,
                content = _dimensions2.content;

            var activatorTop = this.isAttached ? activator.offsetTop : activator.top;
            var top = 0;
            if (this.top || this.bottom) {
                top = activatorTop + (this.bottom ? activator.height : -content.height) + (this.bottom ? 10 : -10);
            } else if (this.left || this.right) {
                top = activatorTop + activator.height / 2 - content.height / 2;
            }
            if (this.nudgeTop) top -= parseInt(this.nudgeTop);
            if (this.nudgeBottom) top += parseInt(this.nudgeBottom);
            return this.calcYOverflow(top + this.pageYOffset) + 'px';
        },
        classes: function classes() {
            return {
                'v-tooltip--top': this.top,
                'v-tooltip--right': this.right,
                'v-tooltip--bottom': this.bottom,
                'v-tooltip--left': this.left
            };
        },
        computedTransition: function computedTransition() {
            if (this.transition) return this.transition;
            if (this.top) return 'slide-y-reverse-transition';
            if (this.right) return 'slide-x-transition';
            if (this.bottom) return 'slide-y-transition';
            if (this.left) return 'slide-x-reverse-transition';
            return '';
        },
        offsetY: function offsetY() {
            return this.top || this.bottom;
        },
        offsetX: function offsetX() {
            return this.left || this.right;
        },
        styles: function styles() {
            return {
                left: this.calculatedLeft,
                maxWidth: (0, _helpers.convertToUnit)(this.maxWidth),
                minWidth: (0, _helpers.convertToUnit)(this.minWidth),
                opacity: this.isActive ? 0.9 : 0,
                top: this.calculatedTop,
                zIndex: this.zIndex || this.activeZIndex
            };
        }
    },
    beforeMount: function beforeMount() {
        var _this = this;

        this.$nextTick(function () {
            _this.value && _this.callActivate();
        });
    },
    mounted: function mounted() {
        if ((0, _helpers.getSlotType)(this, 'activator', true) === 'v-slot') {
            (0, _console.consoleError)('v-tooltip\'s activator slot must be bound, try \'<template #activator="data"><v-btn v-on="data.on>\'', this);
        }
    },

    methods: {
        activate: function activate() {
            // Update coordinates and dimensions of menu
            // and its activator
            this.updateDimensions();
            // Start the transition
            requestAnimationFrame(this.startTransition);
        },
        genActivator: function genActivator() {
            var _this2 = this;

            var listeners = this.disabled ? {} : {
                mouseenter: function mouseenter(e) {
                    _this2.getActivator(e);
                    _this2.runDelay('open');
                },
                mouseleave: function mouseleave(e) {
                    _this2.getActivator(e);
                    _this2.runDelay('close');
                }
            };
            if ((0, _helpers.getSlotType)(this, 'activator') === 'scoped') {
                var activator = this.$scopedSlots.activator({ on: listeners });
                this.activatorNode = activator;
                return activator;
            }
            return this.$createElement('span', {
                on: listeners,
                ref: 'activator'
            }, this.$slots.activator);
        }
    },
    render: function render(h) {
        var _class;

        var tooltip = h('div', this.setBackgroundColor(this.color, {
            staticClass: 'v-tooltip__content',
            'class': (_class = {}, _defineProperty(_class, this.contentClass, true), _defineProperty(_class, 'menuable__content__active', this.isActive), _defineProperty(_class, 'v-tooltip__content--fixed', this.activatorFixed), _class),
            style: this.styles,
            attrs: this.getScopeIdAttrs(),
            directives: [{
                name: 'show',
                value: this.isContentActive
            }],
            ref: 'content'
        }), this.showLazyContent(this.$slots.default));
        return h(this.tag, {
            staticClass: 'v-tooltip',
            'class': this.classes
        }, [h('transition', {
            props: {
                name: this.computedTransition
            }
        }, [tooltip]), this.genActivator()]);
    }
};
//# sourceMappingURL=VTooltip.js.map