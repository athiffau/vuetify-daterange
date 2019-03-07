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
            changedByDelimiters: false,
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
                    attrs: {
                        'aria-label': this.$vuetify.t(`$vuetify.carousel.${direction}`)
                    },
                    on: {
                        click: () => {
                            this.changedByDelimiters = true;
                            fn();
                        }
                    }
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
            if (this.changedByDelimiters) {
                this.changedByDelimiters = false;
                return;
            }
            VWindow.options.methods.updateReverse.call(this, val, oldVal);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkNhcm91c2VsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkNhcm91c2VsL1ZDYXJvdXNlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyx3Q0FBd0MsQ0FBQTtBQUUvQyxhQUFhO0FBQ2IsT0FBTyxPQUFPLE1BQU0sb0JBQW9CLENBQUE7QUFFeEMsYUFBYTtBQUNiLE9BQU8sSUFBSSxNQUFNLFNBQVMsQ0FBQTtBQUMxQixPQUFPLEtBQUssTUFBTSxVQUFVLENBQUE7QUFFNUIsU0FBUztBQUNULDRDQUE0QztBQUM1QyxPQUFPLFdBQVcsTUFBTSwyQkFBMkIsQ0FBQTtBQUVuRCxZQUFZO0FBQ1osT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQ2xELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQU05QyxlQUFlLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFDNUIsSUFBSSxFQUFFLFlBQVk7SUFFbEIsS0FBSyxFQUFFO1FBQ0wsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLE9BQU87WUFDYixPQUFPLEVBQUUsSUFBSTtTQUNkO1FBQ0QsYUFBYSxFQUFFO1lBQ2IsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsMEJBQTBCO1NBQ3BDO1FBQ0QsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUN0QixPQUFPLEVBQUUsR0FBRztTQUNiO1FBQ0QsWUFBWSxFQUFFLE9BQU87UUFDckIsY0FBYyxFQUFFLE9BQU87UUFDdkIsUUFBUSxFQUFFO1lBQ1IsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUN0QixPQUFPLEVBQUUsSUFBSTtZQUNiLFNBQVMsRUFBRSxDQUFDLEtBQXNCLEVBQUUsRUFBRSxDQUFDLEtBQUssR0FBRyxDQUFDO1NBQ2pEO1FBQ0QsU0FBUyxFQUFF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QyxhQUFhLEVBQUUsQ0FBQyxDQUFBO1NBQ3BDO1FBRUQsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFBO0lBQ3hELENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcclxuaW1wb3J0ICcuLi8uLi9zdHlsdXMvY29tcG9uZW50cy9fY2Fyb3VzZWwuc3R5bCdcclxuXHJcbi8vIEV4dGVuc2lvbnNcclxuaW1wb3J0IFZXaW5kb3cgZnJvbSAnLi4vVldpbmRvdy9WV2luZG93J1xyXG5cclxuLy8gQ29tcG9uZW50c1xyXG5pbXBvcnQgVkJ0biBmcm9tICcuLi9WQnRuJ1xyXG5pbXBvcnQgVkljb24gZnJvbSAnLi4vVkljb24nXHJcblxyXG4vLyBNaXhpbnNcclxuLy8gVE9ETzogTW92ZSB0aGlzIGludG8gY29yZSBjb21wb25lbnRzIHYyLjBcclxuaW1wb3J0IEJ1dHRvbkdyb3VwIGZyb20gJy4uLy4uL21peGlucy9idXR0b24tZ3JvdXAnXHJcblxyXG4vLyBVdGlsaXRpZXNcclxuaW1wb3J0IHsgY29udmVydFRvVW5pdCB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcclxuaW1wb3J0IHsgZGVwcmVjYXRlIH0gZnJvbSAnLi4vLi4vdXRpbC9jb25zb2xlJ1xyXG5cclxuLy8gVHlwZXNcclxuaW1wb3J0IHsgVk5vZGUgfSBmcm9tICd2dWUnXHJcbmltcG9ydCB7IFZOb2RlRGlyZWN0aXZlIH0gZnJvbSAndnVlL3R5cGVzL3Zub2RlJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgVldpbmRvdy5leHRlbmQoe1xyXG4gIG5hbWU6ICd2LWNhcm91c2VsJyxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIGN5Y2xlOiB7XHJcbiAgICAgIHR5cGU6IEJvb2xlYW4sXHJcbiAgICAgIGRlZmF1bHQ6IHRydWVcclxuICAgIH0sXHJcbiAgICBkZWxpbWl0ZXJJY29uOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJyR2dWV0aWZ5Lmljb25zLmRlbGltaXRlcidcclxuICAgIH0sXHJcbiAgICBoZWlnaHQ6IHtcclxuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcclxuICAgICAgZGVmYXVsdDogNTAwXHJcbiAgICB9LFxyXG4gICAgaGlkZUNvbnRyb2xzOiBCb29sZWFuLFxyXG4gICAgaGlkZURlbGltaXRlcnM6IEJvb2xlYW4sXHJcbiAgICBpbnRlcnZhbDoge1xyXG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxyXG4gICAgICBkZWZhdWx0OiA2MDAwLFxyXG4gICAgICB2YWxpZGF0b3I6ICh2YWx1ZTogc3RyaW5nIHwgbnVtYmVyKSA9PiB2YWx1ZSA+IDBcclxuICAgIH0sXHJcbiAgICBtYW5kYXRvcnk6IHtcclxuICAgICAgdHlwZTogQm9vbGVhbixcclxuICAgICAgZGVmYXVsdDogdHJ1ZVxyXG4gICAgfSxcclxuICAgIG5leHRJY29uOiB7XHJcbiAgICAgIHR5cGU6IFtCb29sZWFuLCBTdHJpbmddLFxyXG4gICAgICBkZWZhdWx0OiAnJHZ1ZXRpZnkuaWNvbnMubmV4dCdcclxuICAgIH0sXHJcbiAgICBwcmV2SWNvbjoge1xyXG4gICAgICB0eXBlOiBbQm9vbGVhbiwgU3RyaW5nXSxcclxuICAgICAgZGVmYXVsdDogJyR2dWV0aWZ5Lmljb25zLnByZXYnXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZGF0YSAoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBjaGFuZ2VkQnlEZWxpbWl0ZXJzOiBmYWxzZSxcclxuICAgICAgaW50ZXJuYWxIZWlnaHQ6IHRoaXMuaGVpZ2h0LFxyXG4gICAgICBzbGlkZVRpbWVvdXQ6IHVuZGVmaW5lZCBhcyBudW1iZXIgfCB1bmRlZmluZWRcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBjb21wdXRlZDoge1xyXG4gICAgaXNEYXJrICgpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZGFyayB8fCAhdGhpcy5saWdodFxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHdhdGNoOiB7XHJcbiAgICBpbnRlcm5hbFZhbHVlICh2YWwpIHtcclxuICAgICAgdGhpcy5yZXN0YXJ0VGltZW91dCgpXHJcbiAgICAgIC8qIEBkZXByZWNhdGUgKi9cclxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cclxuICAgICAgaWYgKCF0aGlzLiRsaXN0ZW5lcnNbJ2lucHV0J10pIHJldHVyblxyXG5cclxuICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCB2YWwpXHJcbiAgICB9LFxyXG4gICAgaW50ZXJ2YWw6ICdyZXN0YXJ0VGltZW91dCcsXHJcbiAgICBoZWlnaHQgKHZhbCwgb2xkVmFsKSB7XHJcbiAgICAgIGlmICh2YWwgPT09IG9sZFZhbCB8fCAhdmFsKSByZXR1cm5cclxuICAgICAgdGhpcy5pbnRlcm5hbEhlaWdodCA9IHZhbFxyXG4gICAgfSxcclxuICAgIGN5Y2xlICh2YWwpIHtcclxuICAgICAgaWYgKHZhbCkge1xyXG4gICAgICAgIHRoaXMucmVzdGFydFRpbWVvdXQoKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnNsaWRlVGltZW91dClcclxuICAgICAgICB0aGlzLnNsaWRlVGltZW91dCA9IHVuZGVmaW5lZFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgbW91bnRlZCAoKSB7XHJcbiAgICAvKiBAZGVwcmVjYXRlICovXHJcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG4gICAgaWYgKHRoaXMuJGxpc3RlbmVyc1snaW5wdXQnXSkge1xyXG4gICAgICBkZXByZWNhdGUoJ0BpbnB1dCcsICdAY2hhbmdlJywgdGhpcylcclxuICAgIH1cclxuICAgIHRoaXMuc3RhcnRUaW1lb3V0KClcclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICBnZW5EZWxpbWl0ZXJzICgpOiBWTm9kZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XHJcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWNhcm91c2VsX19jb250cm9scydcclxuICAgICAgfSwgW3RoaXMuZ2VuSXRlbXMoKV0pXHJcbiAgICB9LFxyXG4gICAgZ2VuSWNvbiAoXHJcbiAgICAgIGRpcmVjdGlvbjogJ3ByZXYnIHwgJ25leHQnLFxyXG4gICAgICBpY29uOiBzdHJpbmcsXHJcbiAgICAgIGZuOiAoKSA9PiB2b2lkXHJcbiAgICApOiBWTm9kZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XHJcbiAgICAgICAgc3RhdGljQ2xhc3M6IGB2LWNhcm91c2VsX18ke2RpcmVjdGlvbn1gXHJcbiAgICAgIH0sIFtcclxuICAgICAgICB0aGlzLiRjcmVhdGVFbGVtZW50KFZCdG4sIHtcclxuICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgIGljb246IHRydWVcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAnYXJpYS1sYWJlbCc6IHRoaXMuJHZ1ZXRpZnkudChgJHZ1ZXRpZnkuY2Fyb3VzZWwuJHtkaXJlY3Rpb259YClcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICBjbGljazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgIHRoaXMuY2hhbmdlZEJ5RGVsaW1pdGVycyA9IHRydWVcclxuICAgICAgICAgICAgICBmbigpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCBbXHJcbiAgICAgICAgICB0aGlzLiRjcmVhdGVFbGVtZW50KFZJY29uLCB7XHJcbiAgICAgICAgICAgIHByb3BzOiB7ICdzaXplJzogJzQ2cHgnIH1cclxuICAgICAgICAgIH0sIGljb24pXHJcbiAgICAgICAgXSlcclxuICAgICAgXSlcclxuICAgIH0sXHJcbiAgICBnZW5JY29ucyAoKTogVk5vZGVbXSB7XHJcbiAgICAgIGNvbnN0IGljb25zID0gW11cclxuXHJcbiAgICAgIGNvbnN0IHByZXZJY29uID0gdGhpcy4kdnVldGlmeS5ydGxcclxuICAgICAgICA/IHRoaXMubmV4dEljb25cclxuICAgICAgICA6IHRoaXMucHJldkljb25cclxuXHJcbiAgICAgIGlmIChwcmV2SWNvbiAmJiB0eXBlb2YgcHJldkljb24gPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgaWNvbnMucHVzaCh0aGlzLmdlbkljb24oJ3ByZXYnLCBwcmV2SWNvbiwgdGhpcy5wcmV2KSlcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgbmV4dEljb24gPSB0aGlzLiR2dWV0aWZ5LnJ0bFxyXG4gICAgICAgID8gdGhpcy5wcmV2SWNvblxyXG4gICAgICAgIDogdGhpcy5uZXh0SWNvblxyXG5cclxuICAgICAgaWYgKG5leHRJY29uICYmIHR5cGVvZiBuZXh0SWNvbiA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICBpY29ucy5wdXNoKHRoaXMuZ2VuSWNvbignbmV4dCcsIG5leHRJY29uLCB0aGlzLm5leHQpKVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gaWNvbnNcclxuICAgIH0sXHJcbiAgICBnZW5JdGVtcyAoKTogVk5vZGUge1xyXG4gICAgICBjb25zdCBsZW5ndGggPSB0aGlzLml0ZW1zLmxlbmd0aFxyXG4gICAgICBjb25zdCBjaGlsZHJlbiA9IFtdXHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgY2hpbGQgPSB0aGlzLiRjcmVhdGVFbGVtZW50KFZCdG4sIHtcclxuICAgICAgICAgIGNsYXNzOiB7XHJcbiAgICAgICAgICAgICd2LWNhcm91c2VsX19jb250cm9sc19faXRlbSc6IHRydWVcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgICBpY29uOiB0cnVlLFxyXG4gICAgICAgICAgICBzbWFsbDogdHJ1ZSxcclxuICAgICAgICAgICAgdmFsdWU6IHRoaXMuZ2V0VmFsdWUodGhpcy5pdGVtc1tpXSwgaSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCBbXHJcbiAgICAgICAgICB0aGlzLiRjcmVhdGVFbGVtZW50KFZJY29uLCB7XHJcbiAgICAgICAgICAgIHByb3BzOiB7IHNpemU6IDE4IH1cclxuICAgICAgICAgIH0sIHRoaXMuZGVsaW1pdGVySWNvbilcclxuICAgICAgICBdKVxyXG5cclxuICAgICAgICBjaGlsZHJlbi5wdXNoKGNoaWxkKVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudChCdXR0b25Hcm91cCwge1xyXG4gICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICB2YWx1ZTogdGhpcy5pbnRlcm5hbFZhbHVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbjoge1xyXG4gICAgICAgICAgY2hhbmdlOiAodmFsOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5pbnRlcm5hbFZhbHVlID0gdmFsXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCBjaGlsZHJlbilcclxuICAgIH0sXHJcbiAgICByZXN0YXJ0VGltZW91dCAoKSB7XHJcbiAgICAgIHRoaXMuc2xpZGVUaW1lb3V0ICYmIGNsZWFyVGltZW91dCh0aGlzLnNsaWRlVGltZW91dClcclxuICAgICAgdGhpcy5zbGlkZVRpbWVvdXQgPSB1bmRlZmluZWRcclxuXHJcbiAgICAgIGNvbnN0IHJhZiA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCBzZXRUaW1lb3V0XHJcbiAgICAgIHJhZih0aGlzLnN0YXJ0VGltZW91dClcclxuICAgIH0sXHJcbiAgICBzdGFydFRpbWVvdXQgKCkge1xyXG4gICAgICBpZiAoIXRoaXMuY3ljbGUpIHJldHVyblxyXG5cclxuICAgICAgdGhpcy5zbGlkZVRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dCh0aGlzLm5leHQsICt0aGlzLmludGVydmFsID4gMCA/ICt0aGlzLmludGVydmFsIDogNjAwMClcclxuICAgIH0sXHJcbiAgICB1cGRhdGVSZXZlcnNlICh2YWw6IG51bWJlciwgb2xkVmFsOiBudW1iZXIpIHtcclxuICAgICAgaWYgKHRoaXMuY2hhbmdlZEJ5RGVsaW1pdGVycykge1xyXG4gICAgICAgIHRoaXMuY2hhbmdlZEJ5RGVsaW1pdGVycyA9IGZhbHNlXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIFZXaW5kb3cub3B0aW9ucy5tZXRob2RzLnVwZGF0ZVJldmVyc2UuY2FsbCh0aGlzLCB2YWwsIG9sZFZhbClcclxuICAgIH1cclxuICB9LFxyXG5cclxuICByZW5kZXIgKGgpOiBWTm9kZSB7XHJcbiAgICBjb25zdCBjaGlsZHJlbiA9IFtdXHJcbiAgICBjb25zdCBkYXRhID0ge1xyXG4gICAgICBzdGF0aWNDbGFzczogJ3Ytd2luZG93IHYtY2Fyb3VzZWwnLFxyXG4gICAgICBzdHlsZToge1xyXG4gICAgICAgIGhlaWdodDogY29udmVydFRvVW5pdCh0aGlzLmhlaWdodClcclxuICAgICAgfSxcclxuICAgICAgZGlyZWN0aXZlczogW10gYXMgVk5vZGVEaXJlY3RpdmVbXVxyXG4gICAgfVxyXG5cclxuICAgIGlmICghdGhpcy50b3VjaGxlc3MpIHtcclxuICAgICAgZGF0YS5kaXJlY3RpdmVzLnB1c2goe1xyXG4gICAgICAgIG5hbWU6ICd0b3VjaCcsXHJcbiAgICAgICAgdmFsdWU6IHtcclxuICAgICAgICAgIGxlZnQ6IHRoaXMubmV4dCxcclxuICAgICAgICAgIHJpZ2h0OiB0aGlzLnByZXZcclxuICAgICAgICB9XHJcbiAgICAgIH0gYXMgVk5vZGVEaXJlY3RpdmUpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF0aGlzLmhpZGVDb250cm9scykge1xyXG4gICAgICBjaGlsZHJlbi5wdXNoKHRoaXMuZ2VuSWNvbnMoKSlcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXRoaXMuaGlkZURlbGltaXRlcnMpIHtcclxuICAgICAgY2hpbGRyZW4ucHVzaCh0aGlzLmdlbkRlbGltaXRlcnMoKSlcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gaCgnZGl2JywgZGF0YSwgW3RoaXMuZ2VuQ29udGFpbmVyKCksIGNoaWxkcmVuXSlcclxuICB9XHJcbn0pXHJcbiJdfQ==