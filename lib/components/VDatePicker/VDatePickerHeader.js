var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import '../../../src/stylus/components/_date-picker-header.styl';
// Components
import VBtn from '../VBtn';
import VIcon from '../VIcon';
// Mixins
import Colorable from '../../mixins/colorable';
import Themeable from '../../mixins/themeable';
// Utils
import { createNativeLocaleFormatter, monthChange } from './util';
import mixins from '../../util/mixins';
export default mixins(Colorable, Themeable
/* @vue/component */
).extend({
    name: 'v-date-picker-header',
    props: {
        allowDateChange: Boolean,
        disabled: Boolean,
        format: Function,
        hideDisabled: Boolean,
        locale: {
            type: String,
            default: 'en-us'
        },
        min: String,
        max: String,
        nextIcon: {
            type: String,
            default: '$vuetify.icons.next'
        },
        prevIcon: {
            type: String,
            default: '$vuetify.icons.prev'
        },
        readonly: Boolean,
        value: {
            type: [Number, String],
            required: true
        }
    },
    data: function data() {
        return {
            isReversing: false
        };
    },

    computed: {
        formatter: function formatter() {
            if (this.format) {
                return this.format;
            } else if (String(this.value).split('-')[1]) {
                return createNativeLocaleFormatter(this.locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }, { length: 7 });
            } else {
                return createNativeLocaleFormatter(this.locale, { year: 'numeric', timeZone: 'UTC' }, { length: 4 });
            }
        }
    },
    watch: {
        value: function value(newVal, oldVal) {
            this.isReversing = newVal < oldVal;
        }
    },
    methods: {
        genBtn: function genBtn(change) {
            var _this = this;

            var disabled = this.disabled || !this.allowDateChange || change < 0 && this.min && this.calculateChange(change) < this.min || change > 0 && this.max && this.calculateChange(change) > this.max;
            return this.hideDisabled && disabled ? null : this.$createElement(VBtn, {
                props: {
                    dark: this.dark,
                    disabled: disabled,
                    icon: true,
                    light: this.light
                },
                nativeOn: {
                    click: function click(e) {
                        e.stopPropagation();
                        _this.$emit('input', _this.calculateChange(change));
                    }
                }
            }, [this.$createElement(VIcon, change < 0 === !this.$vuetify.rtl ? this.prevIcon : this.nextIcon)]);
        },
        calculateChange: function calculateChange(sign) {
            var _String$split$map = String(this.value).split('-').map(Number),
                _String$split$map2 = _slicedToArray(_String$split$map, 2),
                year = _String$split$map2[0],
                month = _String$split$map2[1];

            if (month == null) {
                return '' + (year + sign);
            } else {
                return monthChange(String(this.value), sign);
            }
        },
        genHeader: function genHeader() {
            var _this2 = this;

            var color = !this.disabled && this.allowDateChange && (this.color || 'accent');
            var header = this.$createElement('div', this.setTextColor(color, {
                key: String(this.value)
            }), [this.$createElement('button', {
                attrs: {
                    type: 'button'
                },
                on: {
                    click: function click() {
                        return _this2.$emit('toggle');
                    }
                }
            }, [this.$slots.default || this.formatter(String(this.value))])]);
            var transition = this.$createElement('transition', {
                props: {
                    name: this.isReversing === !this.$vuetify.rtl ? 'tab-reverse-transition' : 'tab-transition'
                }
            }, [header]);
            return this.$createElement('div', {
                staticClass: 'v-date-picker-header__value',
                class: {
                    'v-date-picker-header__value--disabled': this.disabled || !this.allowDateChange
                }
            }, [transition]);
        }
    },
    render: function render() {
        return this.$createElement('div', {
            staticClass: 'v-date-picker-header',
            class: _extends({
                'v-date-picker-header--disabled': this.disabled || !this.allowDateChange
            }, this.themeClasses)
        }, [this.genBtn(-1), this.genHeader(), this.genBtn(+1)]);
    }
});
//# sourceMappingURL=VDatePickerHeader.js.map