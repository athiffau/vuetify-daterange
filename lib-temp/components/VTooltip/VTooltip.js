import '../../stylus/components/_tooltips.styl';
// Mixins
import Colorable from '../../mixins/colorable';
import Delayable from '../../mixins/delayable';
import Dependent from '../../mixins/dependent';
import Detachable from '../../mixins/detachable';
import Menuable from '../../mixins/menuable';
import Toggleable from '../../mixins/toggleable';
// Helpers
import { convertToUnit, getSlotType } from '../../util/helpers';
import { consoleError } from '../../util/console';
/* @vue/component */
export default {
    name: 'v-tooltip',
    mixins: [Colorable, Delayable, Dependent, Detachable, Menuable, Toggleable],
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
    data: () => ({
        calculatedMinWidth: 0,
        closeDependents: false
    }),
    computed: {
        calculatedLeft() {
            const { activator, content } = this.dimensions;
            const unknown = !this.bottom && !this.left && !this.top && !this.right;
            const activatorLeft = this.isAttached ? activator.offsetLeft : activator.left;
            let left = 0;
            if (this.top || this.bottom || unknown) {
                left = (activatorLeft +
                    (activator.width / 2) -
                    (content.width / 2));
            }
            else if (this.left || this.right) {
                left = (activatorLeft +
                    (this.right ? activator.width : -content.width) +
                    (this.right ? 10 : -10));
            }
            if (this.nudgeLeft)
                left -= parseInt(this.nudgeLeft);
            if (this.nudgeRight)
                left += parseInt(this.nudgeRight);
            return `${this.calcXOverflow(left, this.dimensions.content.width)}px`;
        },
        calculatedTop() {
            const { activator, content } = this.dimensions;
            const activatorTop = this.isAttached ? activator.offsetTop : activator.top;
            let top = 0;
            if (this.top || this.bottom) {
                top = (activatorTop +
                    (this.bottom ? activator.height : -content.height) +
                    (this.bottom ? 10 : -10));
            }
            else if (this.left || this.right) {
                top = (activatorTop +
                    (activator.height / 2) -
                    (content.height / 2));
            }
            if (this.nudgeTop)
                top -= parseInt(this.nudgeTop);
            if (this.nudgeBottom)
                top += parseInt(this.nudgeBottom);
            return `${this.calcYOverflow(top + this.pageYOffset)}px`;
        },
        classes() {
            return {
                'v-tooltip--top': this.top,
                'v-tooltip--right': this.right,
                'v-tooltip--bottom': this.bottom,
                'v-tooltip--left': this.left
            };
        },
        computedTransition() {
            if (this.transition)
                return this.transition;
            if (this.top)
                return 'slide-y-reverse-transition';
            if (this.right)
                return 'slide-x-transition';
            if (this.bottom)
                return 'slide-y-transition';
            if (this.left)
                return 'slide-x-reverse-transition';
            return '';
        },
        offsetY() {
            return this.top || this.bottom;
        },
        offsetX() {
            return this.left || this.right;
        },
        styles() {
            return {
                left: this.calculatedLeft,
                maxWidth: convertToUnit(this.maxWidth),
                minWidth: convertToUnit(this.minWidth),
                opacity: this.isActive ? 0.9 : 0,
                top: this.calculatedTop,
                zIndex: this.zIndex || this.activeZIndex
            };
        }
    },
    beforeMount() {
        this.$nextTick(() => {
            this.value && this.callActivate();
        });
    },
    mounted() {
        if (getSlotType(this, 'activator', true) === 'v-slot') {
            consoleError(`v-tooltip's activator slot must be bound, try '<template #activator="data"><v-btn v-on="data.on>'`, this);
        }
    },
    methods: {
        activate() {
            // Update coordinates and dimensions of menu
            // and its activator
            this.updateDimensions();
            // Start the transition
            requestAnimationFrame(this.startTransition);
        },
        genActivator() {
            const listeners = this.disabled ? {} : {
                mouseenter: e => {
                    this.getActivator(e);
                    this.runDelay('open');
                },
                mouseleave: e => {
                    this.getActivator(e);
                    this.runDelay('close');
                }
            };
            if (getSlotType(this, 'activator') === 'scoped') {
                const activator = this.$scopedSlots.activator({ on: listeners });
                this.activatorNode = activator;
                return activator;
            }
            return this.$createElement('span', {
                on: listeners,
                ref: 'activator'
            }, this.$slots.activator);
        }
    },
    render(h) {
        const tooltip = h('div', this.setBackgroundColor(this.color, {
            staticClass: 'v-tooltip__content',
            'class': {
                [this.contentClass]: true,
                'menuable__content__active': this.isActive
            },
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
        }, [
            h('transition', {
                props: {
                    name: this.computedTransition
                }
            }, [tooltip]),
            this.genActivator()
        ]);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlRvb2x0aXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WVG9vbHRpcC9WVG9vbHRpcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLHdDQUF3QyxDQUFBO0FBRS9DLFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUNoRCxPQUFPLFFBQVEsTUFBTSx1QkFBdUIsQ0FBQTtBQUM1QyxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUVoRCxVQUFVO0FBQ1YsT0FBTyxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUMvRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFFakQsb0JBQW9CO0FBQ3BCLGVBQWU7SUFDYixJQUFJLEVBQUUsV0FBVztJQUVqQixNQUFNLEVBQUUsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLFVBQVUsQ0FBQztJQUUzRSxLQUFLLEVBQUU7UUFDTCxVQUFVLEVBQUU7WUFDVixJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxHQUFHO1NBQ2I7UUFDRCxRQUFRLEVBQUU7WUFDUixJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxDQUFDO1NBQ1g7UUFDRCxRQUFRLEVBQUUsT0FBTztRQUNqQixLQUFLLEVBQUU7WUFDTCxJQUFJLEVBQUUsT0FBTztZQUNiLE9BQU8sRUFBRSxJQUFJO1NBQ2Q7UUFDRCxTQUFTLEVBQUU7WUFDVCxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFB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SUFBSSxDQUFDLGVBQWUsRUFBRTtZQUM3QixVQUFVLEVBQUUsQ0FBQztvQkFDWCxJQUFJLEVBQUUsTUFBTTtvQkFDWixLQUFLLEVBQUUsSUFBSSxDQUFDLGVBQWU7aUJBQzVCLENBQUM7WUFDRixHQUFHLEVBQUUsU0FBUztTQUNmLENBQUMsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtRQUU5QyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ2pCLFdBQVcsRUFBRSxXQUFXO1lBQ3hCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztTQUN0QixFQUFFO1lBQ0QsQ0FBQyxDQUFDLFlBQVksRUFBRTtnQkFDZCxLQUFLLEVBQUU7b0JBQ0wsSUFBSSxFQUFFLElBQUksQ0FBQyxrQkFBa0I7aUJBQzlCO2FBQ0YsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2IsSUFBSSxDQUFDLFlBQVksRUFBRTtTQUNwQixDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi4vLi4vc3R5bHVzL2NvbXBvbmVudHMvX3Rvb2x0aXBzLnN0eWwnXHJcblxyXG4vLyBNaXhpbnNcclxuaW1wb3J0IENvbG9yYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvY29sb3JhYmxlJ1xyXG5pbXBvcnQgRGVsYXlhYmxlIGZyb20gJy4uLy4uL21peGlucy9kZWxheWFibGUnXHJcbmltcG9ydCBEZXBlbmRlbnQgZnJvbSAnLi4vLi4vbWl4aW5zL2RlcGVuZGVudCdcclxuaW1wb3J0IERldGFjaGFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2RldGFjaGFibGUnXHJcbmltcG9ydCBNZW51YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvbWVudWFibGUnXHJcbmltcG9ydCBUb2dnbGVhYmxlIGZyb20gJy4uLy4uL21peGlucy90b2dnbGVhYmxlJ1xyXG5cclxuLy8gSGVscGVyc1xyXG5pbXBvcnQgeyBjb252ZXJ0VG9Vbml0LCBnZXRTbG90VHlwZSB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcclxuaW1wb3J0IHsgY29uc29sZUVycm9yIH0gZnJvbSAnLi4vLi4vdXRpbC9jb25zb2xlJ1xyXG5cclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIG5hbWU6ICd2LXRvb2x0aXAnLFxyXG5cclxuICBtaXhpbnM6IFtDb2xvcmFibGUsIERlbGF5YWJsZSwgRGVwZW5kZW50LCBEZXRhY2hhYmxlLCBNZW51YWJsZSwgVG9nZ2xlYWJsZV0sXHJcblxyXG4gIHByb3BzOiB7XHJcbiAgICBjbG9zZURlbGF5OiB7XHJcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXHJcbiAgICAgIGRlZmF1bHQ6IDIwMFxyXG4gICAgfSxcclxuICAgIGRlYm91bmNlOiB7XHJcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXHJcbiAgICAgIGRlZmF1bHQ6IDBcclxuICAgIH0sXHJcbiAgICBkaXNhYmxlZDogQm9vbGVhbixcclxuICAgIGZpeGVkOiB7XHJcbiAgICAgIHR5cGU6IEJvb2xlYW4sXHJcbiAgICAgIGRlZmF1bHQ6IHRydWVcclxuICAgIH0sXHJcbiAgICBvcGVuRGVsYXk6IHtcclxuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcclxuICAgICAgZGVmYXVsdDogMjAwXHJcbiAgICB9LFxyXG4gICAgdGFnOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJ3NwYW4nXHJcbiAgICB9LFxyXG4gICAgdHJhbnNpdGlvbjogU3RyaW5nLFxyXG4gICAgekluZGV4OiB7XHJcbiAgICAgIGRlZmF1bHQ6IG51bGxcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBkYXRhOiAoKSA9PiAoe1xyXG4gICAgY2FsY3VsYXRlZE1pbldpZHRoOiAwLFxyXG4gICAgY2xvc2VEZXBlbmRlbnRzOiBmYWxzZVxyXG4gIH0pLFxyXG5cclxuICBjb21wdXRlZDoge1xyXG4gICAgY2FsY3VsYXRlZExlZnQgKCkge1xyXG4gICAgICBjb25zdCB7IGFjdGl2YXRvciwgY29udGVudCB9ID0gdGhpcy5kaW1lbnNpb25zXHJcbiAgICAgIGNvbnN0IHVua25vd24gPSAhdGhpcy5ib3R0b20gJiYgIXRoaXMubGVmdCAmJiAhdGhpcy50b3AgJiYgIXRoaXMucmlnaHRcclxuICAgICAgY29uc3QgYWN0aXZhdG9yTGVmdCA9IHRoaXMuaXNBdHRhY2hlZCA/IGFjdGl2YXRvci5vZmZzZXRMZWZ0IDogYWN0aXZhdG9yLmxlZnRcclxuICAgICAgbGV0IGxlZnQgPSAwXHJcblxyXG4gICAgICBpZiAodGhpcy50b3AgfHwgdGhpcy5ib3R0b20gfHwgdW5rbm93bikge1xyXG4gICAgICAgIGxlZnQgPSAoXHJcbiAgICAgICAgICBhY3RpdmF0b3JMZWZ0ICtcclxuICAgICAgICAgIChhY3RpdmF0b3Iud2lkdGggLyAyKSAtXHJcbiAgICAgICAgICAoY29udGVudC53aWR0aCAvIDIpXHJcbiAgICAgICAgKVxyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMubGVmdCB8fCB0aGlzLnJpZ2h0KSB7XHJcbiAgICAgICAgbGVmdCA9IChcclxuICAgICAgICAgIGFjdGl2YXRvckxlZnQgK1xyXG4gICAgICAgICAgKHRoaXMucmlnaHQgPyBhY3RpdmF0b3Iud2lkdGggOiAtY29udGVudC53aWR0aCkgK1xyXG4gICAgICAgICAgKHRoaXMucmlnaHQgPyAxMCA6IC0xMClcclxuICAgICAgICApXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLm51ZGdlTGVmdCkgbGVmdCAtPSBwYXJzZUludCh0aGlzLm51ZGdlTGVmdClcclxuICAgICAgaWYgKHRoaXMubnVkZ2VSaWdodCkgbGVmdCArPSBwYXJzZUludCh0aGlzLm51ZGdlUmlnaHQpXHJcblxyXG4gICAgICByZXR1cm4gYCR7dGhpcy5jYWxjWE92ZXJmbG93KGxlZnQsIHRoaXMuZGltZW5zaW9ucy5jb250ZW50LndpZHRoKX1weGBcclxuICAgIH0sXHJcbiAgICBjYWxjdWxhdGVkVG9wICgpIHtcclxuICAgICAgY29uc3QgeyBhY3RpdmF0b3IsIGNvbnRlbnQgfSA9IHRoaXMuZGltZW5zaW9uc1xyXG4gICAgICBjb25zdCBhY3RpdmF0b3JUb3AgPSB0aGlzLmlzQXR0YWNoZWQgPyBhY3RpdmF0b3Iub2Zmc2V0VG9wIDogYWN0aXZhdG9yLnRvcFxyXG4gICAgICBsZXQgdG9wID0gMFxyXG5cclxuICAgICAgaWYgKHRoaXMudG9wIHx8IHRoaXMuYm90dG9tKSB7XHJcbiAgICAgICAgdG9wID0gKFxyXG4gICAgICAgICAgYWN0aXZhdG9yVG9wICtcclxuICAgICAgICAgICh0aGlzLmJvdHRvbSA/IGFjdGl2YXRvci5oZWlnaHQgOiAtY29udGVudC5oZWlnaHQpICtcclxuICAgICAgICAgICh0aGlzLmJvdHRvbSA/IDEwIDogLTEwKVxyXG4gICAgICAgIClcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLmxlZnQgfHwgdGhpcy5yaWdodCkge1xyXG4gICAgICAgIHRvcCA9IChcclxuICAgICAgICAgIGFjdGl2YXRvclRvcCArXHJcbiAgICAgICAgICAoYWN0aXZhdG9yLmhlaWdodCAvIDIpIC1cclxuICAgICAgICAgIChjb250ZW50LmhlaWdodCAvIDIpXHJcbiAgICAgICAgKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5udWRnZVRvcCkgdG9wIC09IHBhcnNlSW50KHRoaXMubnVkZ2VUb3ApXHJcbiAgICAgIGlmICh0aGlzLm51ZGdlQm90dG9tKSB0b3AgKz0gcGFyc2VJbnQodGhpcy5udWRnZUJvdHRvbSlcclxuXHJcbiAgICAgIHJldHVybiBgJHt0aGlzLmNhbGNZT3ZlcmZsb3codG9wICsgdGhpcy5wYWdlWU9mZnNldCl9cHhgXHJcbiAgICB9LFxyXG4gICAgY2xhc3NlcyAoKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgJ3YtdG9vbHRpcC0tdG9wJzogdGhpcy50b3AsXHJcbiAgICAgICAgJ3YtdG9vbHRpcC0tcmlnaHQnOiB0aGlzLnJpZ2h0LFxyXG4gICAgICAgICd2LXRvb2x0aXAtLWJvdHRvbSc6IHRoaXMuYm90dG9tLFxyXG4gICAgICAgICd2LXRvb2x0aXAtLWxlZnQnOiB0aGlzLmxlZnRcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGNvbXB1dGVkVHJhbnNpdGlvbiAoKSB7XHJcbiAgICAgIGlmICh0aGlzLnRyYW5zaXRpb24pIHJldHVybiB0aGlzLnRyYW5zaXRpb25cclxuICAgICAgaWYgKHRoaXMudG9wKSByZXR1cm4gJ3NsaWRlLXktcmV2ZXJzZS10cmFuc2l0aW9uJ1xyXG4gICAgICBpZiAodGhpcy5yaWdodCkgcmV0dXJuICdzbGlkZS14LXRyYW5zaXRpb24nXHJcbiAgICAgIGlmICh0aGlzLmJvdHRvbSkgcmV0dXJuICdzbGlkZS15LXRyYW5zaXRpb24nXHJcbiAgICAgIGlmICh0aGlzLmxlZnQpIHJldHVybiAnc2xpZGUteC1yZXZlcnNlLXRyYW5zaXRpb24nXHJcbiAgICAgIHJldHVybiAnJ1xyXG4gICAgfSxcclxuICAgIG9mZnNldFkgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy50b3AgfHwgdGhpcy5ib3R0b21cclxuICAgIH0sXHJcbiAgICBvZmZzZXRYICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMubGVmdCB8fCB0aGlzLnJpZ2h0XHJcbiAgICB9LFxyXG4gICAgc3R5bGVzICgpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBsZWZ0OiB0aGlzLmNhbGN1bGF0ZWRMZWZ0LFxyXG4gICAgICAgIG1heFdpZHRoOiBjb252ZXJ0VG9Vbml0KHRoaXMubWF4V2lkdGgpLFxyXG4gICAgICAgIG1pbldpZHRoOiBjb252ZXJ0VG9Vbml0KHRoaXMubWluV2lkdGgpLFxyXG4gICAgICAgIG9wYWNpdHk6IHRoaXMuaXNBY3RpdmUgPyAwLjkgOiAwLFxyXG4gICAgICAgIHRvcDogdGhpcy5jYWxjdWxhdGVkVG9wLFxyXG4gICAgICAgIHpJbmRleDogdGhpcy56SW5kZXggfHwgdGhpcy5hY3RpdmVaSW5kZXhcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGJlZm9yZU1vdW50ICgpIHtcclxuICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcclxuICAgICAgdGhpcy52YWx1ZSAmJiB0aGlzLmNhbGxBY3RpdmF0ZSgpXHJcbiAgICB9KVxyXG4gIH0sXHJcblxyXG4gIG1vdW50ZWQgKCkge1xyXG4gICAgaWYgKGdldFNsb3RUeXBlKHRoaXMsICdhY3RpdmF0b3InLCB0cnVlKSA9PT0gJ3Ytc2xvdCcpIHtcclxuICAgICAgY29uc29sZUVycm9yKGB2LXRvb2x0aXAncyBhY3RpdmF0b3Igc2xvdCBtdXN0IGJlIGJvdW5kLCB0cnkgJzx0ZW1wbGF0ZSAjYWN0aXZhdG9yPVwiZGF0YVwiPjx2LWJ0biB2LW9uPVwiZGF0YS5vbj4nYCwgdGhpcylcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICBhY3RpdmF0ZSAoKSB7XHJcbiAgICAgIC8vIFVwZGF0ZSBjb29yZGluYXRlcyBhbmQgZGltZW5zaW9ucyBvZiBtZW51XHJcbiAgICAgIC8vIGFuZCBpdHMgYWN0aXZhdG9yXHJcbiAgICAgIHRoaXMudXBkYXRlRGltZW5zaW9ucygpXHJcbiAgICAgIC8vIFN0YXJ0IHRoZSB0cmFuc2l0aW9uXHJcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnN0YXJ0VHJhbnNpdGlvbilcclxuICAgIH0sXHJcbiAgICBnZW5BY3RpdmF0b3IgKCkge1xyXG4gICAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLmRpc2FibGVkID8ge30gOiB7XHJcbiAgICAgICAgbW91c2VlbnRlcjogZSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmdldEFjdGl2YXRvcihlKVxyXG4gICAgICAgICAgdGhpcy5ydW5EZWxheSgnb3BlbicpXHJcbiAgICAgICAgfSxcclxuICAgICAgICBtb3VzZWxlYXZlOiBlID0+IHtcclxuICAgICAgICAgIHRoaXMuZ2V0QWN0aXZhdG9yKGUpXHJcbiAgICAgICAgICB0aGlzLnJ1bkRlbGF5KCdjbG9zZScpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZ2V0U2xvdFR5cGUodGhpcywgJ2FjdGl2YXRvcicpID09PSAnc2NvcGVkJykge1xyXG4gICAgICAgIGNvbnN0IGFjdGl2YXRvciA9IHRoaXMuJHNjb3BlZFNsb3RzLmFjdGl2YXRvcih7IG9uOiBsaXN0ZW5lcnMgfSlcclxuICAgICAgICB0aGlzLmFjdGl2YXRvck5vZGUgPSBhY3RpdmF0b3JcclxuICAgICAgICByZXR1cm4gYWN0aXZhdG9yXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdzcGFuJywge1xyXG4gICAgICAgIG9uOiBsaXN0ZW5lcnMsXHJcbiAgICAgICAgcmVmOiAnYWN0aXZhdG9yJ1xyXG4gICAgICB9LCB0aGlzLiRzbG90cy5hY3RpdmF0b3IpXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgcmVuZGVyIChoKSB7XHJcbiAgICBjb25zdCB0b29sdGlwID0gaCgnZGl2JywgdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IodGhpcy5jb2xvciwge1xyXG4gICAgICBzdGF0aWNDbGFzczogJ3YtdG9vbHRpcF9fY29udGVudCcsXHJcbiAgICAgICdjbGFzcyc6IHtcclxuICAgICAgICBbdGhpcy5jb250ZW50Q2xhc3NdOiB0cnVlLFxyXG4gICAgICAgICdtZW51YWJsZV9fY29udGVudF9fYWN0aXZlJzogdGhpcy5pc0FjdGl2ZVxyXG4gICAgICB9LFxyXG4gICAgICBzdHlsZTogdGhpcy5zdHlsZXMsXHJcbiAgICAgIGF0dHJzOiB0aGlzLmdldFNjb3BlSWRBdHRycygpLFxyXG4gICAgICBkaXJlY3RpdmVzOiBbe1xyXG4gICAgICAgIG5hbWU6ICdzaG93JyxcclxuICAgICAgICB2YWx1ZTogdGhpcy5pc0NvbnRlbnRBY3RpdmVcclxuICAgICAgfV0sXHJcbiAgICAgIHJlZjogJ2NvbnRlbnQnXHJcbiAgICB9KSwgdGhpcy5zaG93TGF6eUNvbnRlbnQodGhpcy4kc2xvdHMuZGVmYXVsdCkpXHJcblxyXG4gICAgcmV0dXJuIGgodGhpcy50YWcsIHtcclxuICAgICAgc3RhdGljQ2xhc3M6ICd2LXRvb2x0aXAnLFxyXG4gICAgICAnY2xhc3MnOiB0aGlzLmNsYXNzZXNcclxuICAgIH0sIFtcclxuICAgICAgaCgndHJhbnNpdGlvbicsIHtcclxuICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgbmFtZTogdGhpcy5jb21wdXRlZFRyYW5zaXRpb25cclxuICAgICAgICB9XHJcbiAgICAgIH0sIFt0b29sdGlwXSksXHJcbiAgICAgIHRoaXMuZ2VuQWN0aXZhdG9yKClcclxuICAgIF0pXHJcbiAgfVxyXG59XHJcbiJdfQ==