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
                'menuable__content__active': this.isActive,
                'v-tooltip__content--fixed': this.activatorFixed
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlRvb2x0aXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WVG9vbHRpcC9WVG9vbHRpcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLHdDQUF3QyxDQUFBO0FBRS9DLFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUNoRCxPQUFPLFFBQVEsTUFBTSx1QkFBdUIsQ0FBQTtBQUM1QyxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUVoRCxVQUFVO0FBQ1YsT0FBTyxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUMvRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFFakQsb0JBQW9CO0FBQ3BCLGVBQWU7SUFDYixJQUFJLEVBQUUsV0FBVztJQUVqQixNQUFNLEVBQUUsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLFVBQVUsQ0FBQztJQUUzRSxLQUFLLEVBQUU7UUFDTCxVQUFVLEVBQUU7WUFDVixJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxHQUFHO1NBQ2I7UUFDRCxRQUFRLEVBQUU7WUFDUixJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxDQUFDO1NBQ1g7UUFDRCxRQUFRLEVBQUUsT0FBTztRQUNqQixLQUFLLEVBQUU7WUFDTCxJQUFJLEVBQUUsT0FBTztZQUNiLE9BQU8sRUFBRSxJQUFJO1NBQ2Q7UUFDRCxTQUFTLEVBQUU7WUFDVCxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFB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QUUsSUFBSSxDQUFDLE1BQU07WUFDbEIsS0FBSyxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDN0IsVUFBVSxFQUFFLENBQUM7b0JBQ1gsSUFBSSxFQUFFLE1BQU07b0JBQ1osS0FBSyxFQUFFLElBQUksQ0FBQyxlQUFlO2lCQUM1QixDQUFDO1lBQ0YsR0FBRyxFQUFFLFNBQVM7U0FDZixDQUFDLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUE7UUFFOUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNqQixXQUFXLEVBQUUsV0FBVztZQUN4QixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87U0FDdEIsRUFBRTtZQUNELENBQUMsQ0FBQyxZQUFZLEVBQUU7Z0JBQ2QsS0FBSyxFQUFFO29CQUNMLElBQUksRUFBRSxJQUFJLENBQUMsa0JBQWtCO2lCQUM5QjthQUNGLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNiLElBQUksQ0FBQyxZQUFZLEVBQUU7U0FDcEIsQ0FBQyxDQUFBO0lBQ0osQ0FBQztDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4uLy4uL3N0eWx1cy9jb21wb25lbnRzL190b29sdGlwcy5zdHlsJ1xyXG5cclxuLy8gTWl4aW5zXHJcbmltcG9ydCBDb2xvcmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2NvbG9yYWJsZSdcclxuaW1wb3J0IERlbGF5YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvZGVsYXlhYmxlJ1xyXG5pbXBvcnQgRGVwZW5kZW50IGZyb20gJy4uLy4uL21peGlucy9kZXBlbmRlbnQnXHJcbmltcG9ydCBEZXRhY2hhYmxlIGZyb20gJy4uLy4uL21peGlucy9kZXRhY2hhYmxlJ1xyXG5pbXBvcnQgTWVudWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL21lbnVhYmxlJ1xyXG5pbXBvcnQgVG9nZ2xlYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdG9nZ2xlYWJsZSdcclxuXHJcbi8vIEhlbHBlcnNcclxuaW1wb3J0IHsgY29udmVydFRvVW5pdCwgZ2V0U2xvdFR5cGUgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXHJcbmltcG9ydCB7IGNvbnNvbGVFcnJvciB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcclxuXHJcbi8qIEB2dWUvY29tcG9uZW50ICovXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBuYW1lOiAndi10b29sdGlwJyxcclxuXHJcbiAgbWl4aW5zOiBbQ29sb3JhYmxlLCBEZWxheWFibGUsIERlcGVuZGVudCwgRGV0YWNoYWJsZSwgTWVudWFibGUsIFRvZ2dsZWFibGVdLFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgY2xvc2VEZWxheToge1xyXG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxyXG4gICAgICBkZWZhdWx0OiAyMDBcclxuICAgIH0sXHJcbiAgICBkZWJvdW5jZToge1xyXG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxyXG4gICAgICBkZWZhdWx0OiAwXHJcbiAgICB9LFxyXG4gICAgZGlzYWJsZWQ6IEJvb2xlYW4sXHJcbiAgICBmaXhlZDoge1xyXG4gICAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgICBkZWZhdWx0OiB0cnVlXHJcbiAgICB9LFxyXG4gICAgb3BlbkRlbGF5OiB7XHJcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXHJcbiAgICAgIGRlZmF1bHQ6IDIwMFxyXG4gICAgfSxcclxuICAgIHRhZzoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICdzcGFuJ1xyXG4gICAgfSxcclxuICAgIHRyYW5zaXRpb246IFN0cmluZyxcclxuICAgIHpJbmRleDoge1xyXG4gICAgICBkZWZhdWx0OiBudWxsXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZGF0YTogKCkgPT4gKHtcclxuICAgIGNhbGN1bGF0ZWRNaW5XaWR0aDogMCxcclxuICAgIGNsb3NlRGVwZW5kZW50czogZmFsc2VcclxuICB9KSxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIGNhbGN1bGF0ZWRMZWZ0ICgpIHtcclxuICAgICAgY29uc3QgeyBhY3RpdmF0b3IsIGNvbnRlbnQgfSA9IHRoaXMuZGltZW5zaW9uc1xyXG4gICAgICBjb25zdCB1bmtub3duID0gIXRoaXMuYm90dG9tICYmICF0aGlzLmxlZnQgJiYgIXRoaXMudG9wICYmICF0aGlzLnJpZ2h0XHJcbiAgICAgIGNvbnN0IGFjdGl2YXRvckxlZnQgPSB0aGlzLmlzQXR0YWNoZWQgPyBhY3RpdmF0b3Iub2Zmc2V0TGVmdCA6IGFjdGl2YXRvci5sZWZ0XHJcbiAgICAgIGxldCBsZWZ0ID0gMFxyXG5cclxuICAgICAgaWYgKHRoaXMudG9wIHx8IHRoaXMuYm90dG9tIHx8IHVua25vd24pIHtcclxuICAgICAgICBsZWZ0ID0gKFxyXG4gICAgICAgICAgYWN0aXZhdG9yTGVmdCArXHJcbiAgICAgICAgICAoYWN0aXZhdG9yLndpZHRoIC8gMikgLVxyXG4gICAgICAgICAgKGNvbnRlbnQud2lkdGggLyAyKVxyXG4gICAgICAgIClcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLmxlZnQgfHwgdGhpcy5yaWdodCkge1xyXG4gICAgICAgIGxlZnQgPSAoXHJcbiAgICAgICAgICBhY3RpdmF0b3JMZWZ0ICtcclxuICAgICAgICAgICh0aGlzLnJpZ2h0ID8gYWN0aXZhdG9yLndpZHRoIDogLWNvbnRlbnQud2lkdGgpICtcclxuICAgICAgICAgICh0aGlzLnJpZ2h0ID8gMTAgOiAtMTApXHJcbiAgICAgICAgKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5udWRnZUxlZnQpIGxlZnQgLT0gcGFyc2VJbnQodGhpcy5udWRnZUxlZnQpXHJcbiAgICAgIGlmICh0aGlzLm51ZGdlUmlnaHQpIGxlZnQgKz0gcGFyc2VJbnQodGhpcy5udWRnZVJpZ2h0KVxyXG5cclxuICAgICAgcmV0dXJuIGAke3RoaXMuY2FsY1hPdmVyZmxvdyhsZWZ0LCB0aGlzLmRpbWVuc2lvbnMuY29udGVudC53aWR0aCl9cHhgXHJcbiAgICB9LFxyXG4gICAgY2FsY3VsYXRlZFRvcCAoKSB7XHJcbiAgICAgIGNvbnN0IHsgYWN0aXZhdG9yLCBjb250ZW50IH0gPSB0aGlzLmRpbWVuc2lvbnNcclxuICAgICAgY29uc3QgYWN0aXZhdG9yVG9wID0gdGhpcy5pc0F0dGFjaGVkID8gYWN0aXZhdG9yLm9mZnNldFRvcCA6IGFjdGl2YXRvci50b3BcclxuICAgICAgbGV0IHRvcCA9IDBcclxuXHJcbiAgICAgIGlmICh0aGlzLnRvcCB8fCB0aGlzLmJvdHRvbSkge1xyXG4gICAgICAgIHRvcCA9IChcclxuICAgICAgICAgIGFjdGl2YXRvclRvcCArXHJcbiAgICAgICAgICAodGhpcy5ib3R0b20gPyBhY3RpdmF0b3IuaGVpZ2h0IDogLWNvbnRlbnQuaGVpZ2h0KSArXHJcbiAgICAgICAgICAodGhpcy5ib3R0b20gPyAxMCA6IC0xMClcclxuICAgICAgICApXHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5sZWZ0IHx8IHRoaXMucmlnaHQpIHtcclxuICAgICAgICB0b3AgPSAoXHJcbiAgICAgICAgICBhY3RpdmF0b3JUb3AgK1xyXG4gICAgICAgICAgKGFjdGl2YXRvci5oZWlnaHQgLyAyKSAtXHJcbiAgICAgICAgICAoY29udGVudC5oZWlnaHQgLyAyKVxyXG4gICAgICAgIClcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMubnVkZ2VUb3ApIHRvcCAtPSBwYXJzZUludCh0aGlzLm51ZGdlVG9wKVxyXG4gICAgICBpZiAodGhpcy5udWRnZUJvdHRvbSkgdG9wICs9IHBhcnNlSW50KHRoaXMubnVkZ2VCb3R0b20pXHJcblxyXG4gICAgICByZXR1cm4gYCR7dGhpcy5jYWxjWU92ZXJmbG93KHRvcCArIHRoaXMucGFnZVlPZmZzZXQpfXB4YFxyXG4gICAgfSxcclxuICAgIGNsYXNzZXMgKCkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgICd2LXRvb2x0aXAtLXRvcCc6IHRoaXMudG9wLFxyXG4gICAgICAgICd2LXRvb2x0aXAtLXJpZ2h0JzogdGhpcy5yaWdodCxcclxuICAgICAgICAndi10b29sdGlwLS1ib3R0b20nOiB0aGlzLmJvdHRvbSxcclxuICAgICAgICAndi10b29sdGlwLS1sZWZ0JzogdGhpcy5sZWZ0XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBjb21wdXRlZFRyYW5zaXRpb24gKCkge1xyXG4gICAgICBpZiAodGhpcy50cmFuc2l0aW9uKSByZXR1cm4gdGhpcy50cmFuc2l0aW9uXHJcbiAgICAgIGlmICh0aGlzLnRvcCkgcmV0dXJuICdzbGlkZS15LXJldmVyc2UtdHJhbnNpdGlvbidcclxuICAgICAgaWYgKHRoaXMucmlnaHQpIHJldHVybiAnc2xpZGUteC10cmFuc2l0aW9uJ1xyXG4gICAgICBpZiAodGhpcy5ib3R0b20pIHJldHVybiAnc2xpZGUteS10cmFuc2l0aW9uJ1xyXG4gICAgICBpZiAodGhpcy5sZWZ0KSByZXR1cm4gJ3NsaWRlLXgtcmV2ZXJzZS10cmFuc2l0aW9uJ1xyXG4gICAgICByZXR1cm4gJydcclxuICAgIH0sXHJcbiAgICBvZmZzZXRZICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMudG9wIHx8IHRoaXMuYm90dG9tXHJcbiAgICB9LFxyXG4gICAgb2Zmc2V0WCAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmxlZnQgfHwgdGhpcy5yaWdodFxyXG4gICAgfSxcclxuICAgIHN0eWxlcyAoKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgbGVmdDogdGhpcy5jYWxjdWxhdGVkTGVmdCxcclxuICAgICAgICBtYXhXaWR0aDogY29udmVydFRvVW5pdCh0aGlzLm1heFdpZHRoKSxcclxuICAgICAgICBtaW5XaWR0aDogY29udmVydFRvVW5pdCh0aGlzLm1pbldpZHRoKSxcclxuICAgICAgICBvcGFjaXR5OiB0aGlzLmlzQWN0aXZlID8gMC45IDogMCxcclxuICAgICAgICB0b3A6IHRoaXMuY2FsY3VsYXRlZFRvcCxcclxuICAgICAgICB6SW5kZXg6IHRoaXMuekluZGV4IHx8IHRoaXMuYWN0aXZlWkluZGV4XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG5cclxuICBiZWZvcmVNb3VudCAoKSB7XHJcbiAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XHJcbiAgICAgIHRoaXMudmFsdWUgJiYgdGhpcy5jYWxsQWN0aXZhdGUoKVxyXG4gICAgfSlcclxuICB9LFxyXG5cclxuICBtb3VudGVkICgpIHtcclxuICAgIGlmIChnZXRTbG90VHlwZSh0aGlzLCAnYWN0aXZhdG9yJywgdHJ1ZSkgPT09ICd2LXNsb3QnKSB7XHJcbiAgICAgIGNvbnNvbGVFcnJvcihgdi10b29sdGlwJ3MgYWN0aXZhdG9yIHNsb3QgbXVzdCBiZSBib3VuZCwgdHJ5ICc8dGVtcGxhdGUgI2FjdGl2YXRvcj1cImRhdGFcIj48di1idG4gdi1vbj1cImRhdGEub24+J2AsIHRoaXMpXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgYWN0aXZhdGUgKCkge1xyXG4gICAgICAvLyBVcGRhdGUgY29vcmRpbmF0ZXMgYW5kIGRpbWVuc2lvbnMgb2YgbWVudVxyXG4gICAgICAvLyBhbmQgaXRzIGFjdGl2YXRvclxyXG4gICAgICB0aGlzLnVwZGF0ZURpbWVuc2lvbnMoKVxyXG4gICAgICAvLyBTdGFydCB0aGUgdHJhbnNpdGlvblxyXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5zdGFydFRyYW5zaXRpb24pXHJcbiAgICB9LFxyXG4gICAgZ2VuQWN0aXZhdG9yICgpIHtcclxuICAgICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5kaXNhYmxlZCA/IHt9IDoge1xyXG4gICAgICAgIG1vdXNlZW50ZXI6IGUgPT4ge1xyXG4gICAgICAgICAgdGhpcy5nZXRBY3RpdmF0b3IoZSlcclxuICAgICAgICAgIHRoaXMucnVuRGVsYXkoJ29wZW4nKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbW91c2VsZWF2ZTogZSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmdldEFjdGl2YXRvcihlKVxyXG4gICAgICAgICAgdGhpcy5ydW5EZWxheSgnY2xvc2UnKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGdldFNsb3RUeXBlKHRoaXMsICdhY3RpdmF0b3InKSA9PT0gJ3Njb3BlZCcpIHtcclxuICAgICAgICBjb25zdCBhY3RpdmF0b3IgPSB0aGlzLiRzY29wZWRTbG90cy5hY3RpdmF0b3IoeyBvbjogbGlzdGVuZXJzIH0pXHJcbiAgICAgICAgdGhpcy5hY3RpdmF0b3JOb2RlID0gYWN0aXZhdG9yXHJcbiAgICAgICAgcmV0dXJuIGFjdGl2YXRvclxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnc3BhbicsIHtcclxuICAgICAgICBvbjogbGlzdGVuZXJzLFxyXG4gICAgICAgIHJlZjogJ2FjdGl2YXRvcidcclxuICAgICAgfSwgdGhpcy4kc2xvdHMuYWN0aXZhdG9yKVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlbmRlciAoaCkge1xyXG4gICAgY29uc3QgdG9vbHRpcCA9IGgoJ2RpdicsIHRoaXMuc2V0QmFja2dyb3VuZENvbG9yKHRoaXMuY29sb3IsIHtcclxuICAgICAgc3RhdGljQ2xhc3M6ICd2LXRvb2x0aXBfX2NvbnRlbnQnLFxyXG4gICAgICAnY2xhc3MnOiB7XHJcbiAgICAgICAgW3RoaXMuY29udGVudENsYXNzXTogdHJ1ZSxcclxuICAgICAgICAnbWVudWFibGVfX2NvbnRlbnRfX2FjdGl2ZSc6IHRoaXMuaXNBY3RpdmUsXHJcbiAgICAgICAgJ3YtdG9vbHRpcF9fY29udGVudC0tZml4ZWQnOiB0aGlzLmFjdGl2YXRvckZpeGVkXHJcbiAgICAgIH0sXHJcbiAgICAgIHN0eWxlOiB0aGlzLnN0eWxlcyxcclxuICAgICAgYXR0cnM6IHRoaXMuZ2V0U2NvcGVJZEF0dHJzKCksXHJcbiAgICAgIGRpcmVjdGl2ZXM6IFt7XHJcbiAgICAgICAgbmFtZTogJ3Nob3cnLFxyXG4gICAgICAgIHZhbHVlOiB0aGlzLmlzQ29udGVudEFjdGl2ZVxyXG4gICAgICB9XSxcclxuICAgICAgcmVmOiAnY29udGVudCdcclxuICAgIH0pLCB0aGlzLnNob3dMYXp5Q29udGVudCh0aGlzLiRzbG90cy5kZWZhdWx0KSlcclxuXHJcbiAgICByZXR1cm4gaCh0aGlzLnRhZywge1xyXG4gICAgICBzdGF0aWNDbGFzczogJ3YtdG9vbHRpcCcsXHJcbiAgICAgICdjbGFzcyc6IHRoaXMuY2xhc3Nlc1xyXG4gICAgfSwgW1xyXG4gICAgICBoKCd0cmFuc2l0aW9uJywge1xyXG4gICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICBuYW1lOiB0aGlzLmNvbXB1dGVkVHJhbnNpdGlvblxyXG4gICAgICAgIH1cclxuICAgICAgfSwgW3Rvb2x0aXBdKSxcclxuICAgICAgdGhpcy5nZW5BY3RpdmF0b3IoKVxyXG4gICAgXSlcclxuICB9XHJcbn1cclxuIl19