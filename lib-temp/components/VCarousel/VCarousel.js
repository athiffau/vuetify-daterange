// Styles
import '../../stylus/components/_carousel.styl';
// Extensions
import VWindow from '../VWindow/VWindow';
// Components
import VBtn from '../VBtn';
import VIcon from '../VIcon';
// Mixins
// TODO: Move this into core components v2.0
import ButtonGroup from '../../mixins/button-group';
// Utilities
import { convertToUnit } from '../../util/helpers';
import { deprecate } from '../../util/console';
export default VWindow.extend({
    name: 'v-carousel',
    props: {
        cycle: {
            type: Boolean,
            default: true
        },
        delimiterIcon: {
            type: String,
            default: '$vuetify.icons.delimiter'
        },
        height: {
            type: [Number, String],
            default: 500
        },
        hideControls: Boolean,
        hideDelimiters: Boolean,
        interval: {
            type: [Number, String],
            default: 6000,
            validator: (value) => value > 0
        },
        mandatory: {
            type: Boolean,
            default: true
        },
        nextIcon: {
            type: [Boolean, String],
            default: '$vuetify.icons.next'
        },
        prevIcon: {
            type: [Boolean, String],
            default: '$vuetify.icons.prev'
        }
    },
    data() {
        return {
            changedByControls: false,
            internalHeight: this.height,
            slideTimeout: undefined
        };
    },
    computed: {
        isDark() {
            return this.dark || !this.light;
        }
    },
    watch: {
        internalValue(val) {
            this.restartTimeout();
            /* @deprecate */
            /* istanbul ignore else */
            if (!this.$listeners['input'])
                return;
            this.$emit('input', val);
        },
        interval: 'restartTimeout',
        height(val, oldVal) {
            if (val === oldVal || !val)
                return;
            this.internalHeight = val;
        },
        cycle(val) {
            if (val) {
                this.restartTimeout();
            }
            else {
                clearTimeout(this.slideTimeout);
                this.slideTimeout = undefined;
            }
        }
    },
    mounted() {
        /* @deprecate */
        /* istanbul ignore next */
        if (this.$listeners['input']) {
            deprecate('@input', '@change', this);
        }
        this.startTimeout();
    },
    methods: {
        genDelimiters() {
            return this.$createElement('div', {
                staticClass: 'v-carousel__controls'
            }, [this.genItems()]);
        },
        genIcon(direction, icon, fn) {
            return this.$createElement('div', {
                staticClass: `v-carousel__${direction}`
            }, [
                this.$createElement(VBtn, {
                    props: {
                        icon: true
                    },
                    on: { click: fn }
                }, [
                    this.$createElement(VIcon, {
                        props: { 'size': '46px' }
                    }, icon)
                ])
            ]);
        },
        genIcons() {
            const icons = [];
            const prevIcon = this.$vuetify.rtl
                ? this.nextIcon
                : this.prevIcon;
            if (prevIcon && typeof prevIcon === 'string') {
                icons.push(this.genIcon('prev', prevIcon, this.prev));
            }
            const nextIcon = this.$vuetify.rtl
                ? this.prevIcon
                : this.nextIcon;
            if (nextIcon && typeof nextIcon === 'string') {
                icons.push(this.genIcon('next', nextIcon, this.next));
            }
            return icons;
        },
        genItems() {
            const length = this.items.length;
            const children = [];
            for (let i = 0; i < length; i++) {
                const child = this.$createElement(VBtn, {
                    class: {
                        'v-carousel__controls__item': true
                    },
                    props: {
                        icon: true,
                        small: true,
                        value: this.getValue(this.items[i], i)
                    }
                }, [
                    this.$createElement(VIcon, {
                        props: { size: 18 }
                    }, this.delimiterIcon)
                ]);
                children.push(child);
            }
            return this.$createElement(ButtonGroup, {
                props: {
                    value: this.internalValue
                },
                on: {
                    change: (val) => {
                        this.changedByControls = true;
                        this.internalValue = val;
                    }
                }
            }, children);
        },
        restartTimeout() {
            this.slideTimeout && clearTimeout(this.slideTimeout);
            this.slideTimeout = undefined;
            const raf = requestAnimationFrame || setTimeout;
            raf(this.startTimeout);
        },
        startTimeout() {
            if (!this.cycle)
                return;
            this.slideTimeout = window.setTimeout(this.next, +this.interval > 0 ? +this.interval : 6000);
        },
        updateReverse(val, oldVal) {
            if (this.changedByControls) {
                this.changedByControls = false;
                VWindow.options.methods.updateReverse.call(this, val, oldVal);
            }
        }
    },
    render(h) {
        const children = [];
        const data = {
            staticClass: 'v-window v-carousel',
            style: {
                height: convertToUnit(this.height)
            },
            directives: []
        };
        if (!this.touchless) {
            data.directives.push({
                name: 'touch',
                value: {
                    left: this.next,
                    right: this.prev
                }
            });
        }
        if (!this.hideControls) {
            children.push(this.genIcons());
        }
        if (!this.hideDelimiters) {
            children.push(this.genDelimiters());
        }
        return h('div', data, [this.genContainer(), children]);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkNhcm91c2VsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkNhcm91c2VsL1ZDYXJvdXNlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyx3Q0FBd0MsQ0FBQTtBQUUvQyxhQUFhO0FBQ2IsT0FBTyxPQUFPLE1BQU0sb0JBQW9CLENBQUE7QUFFeEMsYUFBYTtBQUNiLE9BQU8sSUFBSSxNQUFNLFNBQVMsQ0FBQTtBQUMxQixPQUFPLEtBQUssTUFBTSxVQUFVLENBQUE7QUFFNUIsU0FBUztBQUNULDRDQUE0QztBQUM1QyxPQUFPLFdBQVcsTUFBTSwyQkFBMkIsQ0FBQTtBQUVuRCxZQUFZO0FBQ1osT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQ2xELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQU05QyxlQUFlLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFDNUIsSUFBSSxFQUFFLFlBQVk7SUFFbEIsS0FBSyxFQUFFO1FBQ0wsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLE9BQU87WUFDYixPQUFPLEVBQUUsSUFBSTtTQUNkO1FBQ0QsYUFBYSxFQUFFO1lBQ2IsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsMEJBQTBCO1NBQ3BDO1FBQ0QsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUN0QixPQUFPLEVBQUUsR0FBRztTQUNiO1FBQ0QsWUFBWSxFQUFFLE9BQU87UUFDckIsY0FBYyxFQUFFLE9BQU87UUFDdkIsUUFBUSxFQUFFO1lBQ1IsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUN0QixPQUFPLEVBQUUsSUFBSTtZQUNiLFNBQVMsRUFBRSxDQUFDLEtBQXNCLEVBQUUsRUFBRSxDQUFDLEtBQUssR0FBRyxDQUFDO1NBQ2pEO1FBQ0QsU0FBUyxFQUFF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Q0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlc1xyXG5pbXBvcnQgJy4uLy4uL3N0eWx1cy9jb21wb25lbnRzL19jYXJvdXNlbC5zdHlsJ1xyXG5cclxuLy8gRXh0ZW5zaW9uc1xyXG5pbXBvcnQgVldpbmRvdyBmcm9tICcuLi9WV2luZG93L1ZXaW5kb3cnXHJcblxyXG4vLyBDb21wb25lbnRzXHJcbmltcG9ydCBWQnRuIGZyb20gJy4uL1ZCdG4nXHJcbmltcG9ydCBWSWNvbiBmcm9tICcuLi9WSWNvbidcclxuXHJcbi8vIE1peGluc1xyXG4vLyBUT0RPOiBNb3ZlIHRoaXMgaW50byBjb3JlIGNvbXBvbmVudHMgdjIuMFxyXG5pbXBvcnQgQnV0dG9uR3JvdXAgZnJvbSAnLi4vLi4vbWl4aW5zL2J1dHRvbi1ncm91cCdcclxuXHJcbi8vIFV0aWxpdGllc1xyXG5pbXBvcnQgeyBjb252ZXJ0VG9Vbml0IH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xyXG5pbXBvcnQgeyBkZXByZWNhdGUgfSBmcm9tICcuLi8uLi91dGlsL2NvbnNvbGUnXHJcblxyXG4vLyBUeXBlc1xyXG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gJ3Z1ZSdcclxuaW1wb3J0IHsgVk5vZGVEaXJlY3RpdmUgfSBmcm9tICd2dWUvdHlwZXMvdm5vZGUnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBWV2luZG93LmV4dGVuZCh7XHJcbiAgbmFtZTogJ3YtY2Fyb3VzZWwnLFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgY3ljbGU6IHtcclxuICAgICAgdHlwZTogQm9vbGVhbixcclxuICAgICAgZGVmYXVsdDogdHJ1ZVxyXG4gICAgfSxcclxuICAgIGRlbGltaXRlckljb246IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAnJHZ1ZXRpZnkuaWNvbnMuZGVsaW1pdGVyJ1xyXG4gICAgfSxcclxuICAgIGhlaWdodDoge1xyXG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxyXG4gICAgICBkZWZhdWx0OiA1MDBcclxuICAgIH0sXHJcbiAgICBoaWRlQ29udHJvbHM6IEJvb2xlYW4sXHJcbiAgICBoaWRlRGVsaW1pdGVyczogQm9vbGVhbixcclxuICAgIGludGVydmFsOiB7XHJcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXHJcbiAgICAgIGRlZmF1bHQ6IDYwMDAsXHJcbiAgICAgIHZhbGlkYXRvcjogKHZhbHVlOiBzdHJpbmcgfCBudW1iZXIpID0+IHZhbHVlID4gMFxyXG4gICAgfSxcclxuICAgIG1hbmRhdG9yeToge1xyXG4gICAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgICBkZWZhdWx0OiB0cnVlXHJcbiAgICB9LFxyXG4gICAgbmV4dEljb246IHtcclxuICAgICAgdHlwZTogW0Jvb2xlYW4sIFN0cmluZ10sXHJcbiAgICAgIGRlZmF1bHQ6ICckdnVldGlmeS5pY29ucy5uZXh0J1xyXG4gICAgfSxcclxuICAgIHByZXZJY29uOiB7XHJcbiAgICAgIHR5cGU6IFtCb29sZWFuLCBTdHJpbmddLFxyXG4gICAgICBkZWZhdWx0OiAnJHZ1ZXRpZnkuaWNvbnMucHJldidcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBkYXRhICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGNoYW5nZWRCeUNvbnRyb2xzOiBmYWxzZSxcclxuICAgICAgaW50ZXJuYWxIZWlnaHQ6IHRoaXMuaGVpZ2h0LFxyXG4gICAgICBzbGlkZVRpbWVvdXQ6IHVuZGVmaW5lZCBhcyBudW1iZXIgfCB1bmRlZmluZWRcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBjb21wdXRlZDoge1xyXG4gICAgaXNEYXJrICgpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZGFyayB8fCAhdGhpcy5saWdodFxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHdhdGNoOiB7XHJcbiAgICBpbnRlcm5hbFZhbHVlICh2YWwpIHtcclxuICAgICAgdGhpcy5yZXN0YXJ0VGltZW91dCgpXHJcbiAgICAgIC8qIEBkZXByZWNhdGUgKi9cclxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cclxuICAgICAgaWYgKCF0aGlzLiRsaXN0ZW5lcnNbJ2lucHV0J10pIHJldHVyblxyXG5cclxuICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCB2YWwpXHJcbiAgICB9LFxyXG4gICAgaW50ZXJ2YWw6ICdyZXN0YXJ0VGltZW91dCcsXHJcbiAgICBoZWlnaHQgKHZhbCwgb2xkVmFsKSB7XHJcbiAgICAgIGlmICh2YWwgPT09IG9sZFZhbCB8fCAhdmFsKSByZXR1cm5cclxuICAgICAgdGhpcy5pbnRlcm5hbEhlaWdodCA9IHZhbFxyXG4gICAgfSxcclxuICAgIGN5Y2xlICh2YWwpIHtcclxuICAgICAgaWYgKHZhbCkge1xyXG4gICAgICAgIHRoaXMucmVzdGFydFRpbWVvdXQoKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnNsaWRlVGltZW91dClcclxuICAgICAgICB0aGlzLnNsaWRlVGltZW91dCA9IHVuZGVmaW5lZFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgbW91bnRlZCAoKSB7XHJcbiAgICAvKiBAZGVwcmVjYXRlICovXHJcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG4gICAgaWYgKHRoaXMuJGxpc3RlbmVyc1snaW5wdXQnXSkge1xyXG4gICAgICBkZXByZWNhdGUoJ0BpbnB1dCcsICdAY2hhbmdlJywgdGhpcylcclxuICAgIH1cclxuICAgIHRoaXMuc3RhcnRUaW1lb3V0KClcclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICBnZW5EZWxpbWl0ZXJzICgpOiBWTm9kZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XHJcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWNhcm91c2VsX19jb250cm9scydcclxuICAgICAgfSwgW3RoaXMuZ2VuSXRlbXMoKV0pXHJcbiAgICB9LFxyXG4gICAgZ2VuSWNvbiAoXHJcbiAgICAgIGRpcmVjdGlvbjogJ3ByZXYnIHwgJ25leHQnLFxyXG4gICAgICBpY29uOiBzdHJpbmcsXHJcbiAgICAgIGZuOiAoKSA9PiB2b2lkXHJcbiAgICApOiBWTm9kZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XHJcbiAgICAgICAgc3RhdGljQ2xhc3M6IGB2LWNhcm91c2VsX18ke2RpcmVjdGlvbn1gXHJcbiAgICAgIH0sIFtcclxuICAgICAgICB0aGlzLiRjcmVhdGVFbGVtZW50KFZCdG4sIHtcclxuICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgIGljb246IHRydWVcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBvbjogeyBjbGljazogZm4gfVxyXG4gICAgICAgIH0sIFtcclxuICAgICAgICAgIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkljb24sIHtcclxuICAgICAgICAgICAgcHJvcHM6IHsgJ3NpemUnOiAnNDZweCcgfVxyXG4gICAgICAgICAgfSwgaWNvbilcclxuICAgICAgICBdKVxyXG4gICAgICBdKVxyXG4gICAgfSxcclxuICAgIGdlbkljb25zICgpOiBWTm9kZVtdIHtcclxuICAgICAgY29uc3QgaWNvbnMgPSBbXVxyXG5cclxuICAgICAgY29uc3QgcHJldkljb24gPSB0aGlzLiR2dWV0aWZ5LnJ0bFxyXG4gICAgICAgID8gdGhpcy5uZXh0SWNvblxyXG4gICAgICAgIDogdGhpcy5wcmV2SWNvblxyXG5cclxuICAgICAgaWYgKHByZXZJY29uICYmIHR5cGVvZiBwcmV2SWNvbiA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICBpY29ucy5wdXNoKHRoaXMuZ2VuSWNvbigncHJldicsIHByZXZJY29uLCB0aGlzLnByZXYpKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBuZXh0SWNvbiA9IHRoaXMuJHZ1ZXRpZnkucnRsXHJcbiAgICAgICAgPyB0aGlzLnByZXZJY29uXHJcbiAgICAgICAgOiB0aGlzLm5leHRJY29uXHJcblxyXG4gICAgICBpZiAobmV4dEljb24gJiYgdHlwZW9mIG5leHRJY29uID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIGljb25zLnB1c2godGhpcy5nZW5JY29uKCduZXh0JywgbmV4dEljb24sIHRoaXMubmV4dCkpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBpY29uc1xyXG4gICAgfSxcclxuICAgIGdlbkl0ZW1zICgpOiBWTm9kZSB7XHJcbiAgICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMuaXRlbXMubGVuZ3RoXHJcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gW11cclxuXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBjaGlsZCA9IHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkJ0biwge1xyXG4gICAgICAgICAgY2xhc3M6IHtcclxuICAgICAgICAgICAgJ3YtY2Fyb3VzZWxfX2NvbnRyb2xzX19pdGVtJzogdHJ1ZVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgIGljb246IHRydWUsXHJcbiAgICAgICAgICAgIHNtYWxsOiB0cnVlLFxyXG4gICAgICAgICAgICB2YWx1ZTogdGhpcy5nZXRWYWx1ZSh0aGlzLml0ZW1zW2ldLCBpKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIFtcclxuICAgICAgICAgIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkljb24sIHtcclxuICAgICAgICAgICAgcHJvcHM6IHsgc2l6ZTogMTggfVxyXG4gICAgICAgICAgfSwgdGhpcy5kZWxpbWl0ZXJJY29uKVxyXG4gICAgICAgIF0pXHJcblxyXG4gICAgICAgIGNoaWxkcmVuLnB1c2goY2hpbGQpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KEJ1dHRvbkdyb3VwLCB7XHJcbiAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgIHZhbHVlOiB0aGlzLmludGVybmFsVmFsdWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uOiB7XHJcbiAgICAgICAgICBjaGFuZ2U6ICh2YWw6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZWRCeUNvbnRyb2xzID0gdHJ1ZVxyXG4gICAgICAgICAgICB0aGlzLmludGVybmFsVmFsdWUgPSB2YWxcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sIGNoaWxkcmVuKVxyXG4gICAgfSxcclxuICAgIHJlc3RhcnRUaW1lb3V0ICgpIHtcclxuICAgICAgdGhpcy5zbGlkZVRpbWVvdXQgJiYgY2xlYXJUaW1lb3V0KHRoaXMuc2xpZGVUaW1lb3V0KVxyXG4gICAgICB0aGlzLnNsaWRlVGltZW91dCA9IHVuZGVmaW5lZFxyXG5cclxuICAgICAgY29uc3QgcmFmID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHNldFRpbWVvdXRcclxuICAgICAgcmFmKHRoaXMuc3RhcnRUaW1lb3V0KVxyXG4gICAgfSxcclxuICAgIHN0YXJ0VGltZW91dCAoKSB7XHJcbiAgICAgIGlmICghdGhpcy5jeWNsZSkgcmV0dXJuXHJcblxyXG4gICAgICB0aGlzLnNsaWRlVGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KHRoaXMubmV4dCwgK3RoaXMuaW50ZXJ2YWwgPiAwID8gK3RoaXMuaW50ZXJ2YWwgOiA2MDAwKVxyXG4gICAgfSxcclxuICAgIHVwZGF0ZVJldmVyc2UgKHZhbDogbnVtYmVyLCBvbGRWYWw6IG51bWJlcikge1xyXG4gICAgICBpZiAodGhpcy5jaGFuZ2VkQnlDb250cm9scykge1xyXG4gICAgICAgIHRoaXMuY2hhbmdlZEJ5Q29udHJvbHMgPSBmYWxzZVxyXG5cclxuICAgICAgICBWV2luZG93Lm9wdGlvbnMubWV0aG9kcy51cGRhdGVSZXZlcnNlLmNhbGwodGhpcywgdmFsLCBvbGRWYWwpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG5cclxuICByZW5kZXIgKGgpOiBWTm9kZSB7XHJcbiAgICBjb25zdCBjaGlsZHJlbiA9IFtdXHJcbiAgICBjb25zdCBkYXRhID0ge1xyXG4gICAgICBzdGF0aWNDbGFzczogJ3Ytd2luZG93IHYtY2Fyb3VzZWwnLFxyXG4gICAgICBzdHlsZToge1xyXG4gICAgICAgIGhlaWdodDogY29udmVydFRvVW5pdCh0aGlzLmhlaWdodClcclxuICAgICAgfSxcclxuICAgICAgZGlyZWN0aXZlczogW10gYXMgVk5vZGVEaXJlY3RpdmVbXVxyXG4gICAgfVxyXG5cclxuICAgIGlmICghdGhpcy50b3VjaGxlc3MpIHtcclxuICAgICAgZGF0YS5kaXJlY3RpdmVzLnB1c2goe1xyXG4gICAgICAgIG5hbWU6ICd0b3VjaCcsXHJcbiAgICAgICAgdmFsdWU6IHtcclxuICAgICAgICAgIGxlZnQ6IHRoaXMubmV4dCxcclxuICAgICAgICAgIHJpZ2h0OiB0aGlzLnByZXZcclxuICAgICAgICB9XHJcbiAgICAgIH0gYXMgVk5vZGVEaXJlY3RpdmUpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF0aGlzLmhpZGVDb250cm9scykge1xyXG4gICAgICBjaGlsZHJlbi5wdXNoKHRoaXMuZ2VuSWNvbnMoKSlcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXRoaXMuaGlkZURlbGltaXRlcnMpIHtcclxuICAgICAgY2hpbGRyZW4ucHVzaCh0aGlzLmdlbkRlbGltaXRlcnMoKSlcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gaCgnZGl2JywgZGF0YSwgW3RoaXMuZ2VuQ29udGFpbmVyKCksIGNoaWxkcmVuXSlcclxuICB9XHJcbn0pXHJcbiJdfQ==