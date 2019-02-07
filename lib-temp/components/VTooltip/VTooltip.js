import '../../stylus/components/_tooltips.styl';
// Mixins
import Colorable from '../../mixins/colorable';
import Delayable from '../../mixins/delayable';
import Dependent from '../../mixins/dependent';
import Detachable from '../../mixins/detachable';
import Menuable from '../../mixins/menuable';
import Toggleable from '../../mixins/toggleable';
// Helpers
import { convertToUnit } from '../../util/helpers';
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
            return `${this.calcXOverflow(left)}px`;
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
            if (this.$scopedSlots.activator && this.$scopedSlots.activator.length) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlRvb2x0aXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WVG9vbHRpcC9WVG9vbHRpcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLHdDQUF3QyxDQUFBO0FBRS9DLFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUNoRCxPQUFPLFFBQVEsTUFBTSx1QkFBdUIsQ0FBQTtBQUM1QyxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUVoRCxVQUFVO0FBQ1YsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBRWxELG9CQUFvQjtBQUNwQixlQUFlO0lBQ2IsSUFBSSxFQUFFLFdBQVc7SUFFakIsTUFBTSxFQUFFLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxVQUFVLENBQUM7SUFFM0UsS0FBSyxFQUFFO1FBQ0wsVUFBVSxFQUFFO1lBQ1YsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUN0QixPQUFPLEVBQUUsR0FBRztTQUNiO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUN0QixPQUFPLEVBQUUsQ0FBQztTQUNYO1FBQ0QsUUFBUSxFQUFFLE9BQU87UUFDakIsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLE9BQU87WUFDYixPQUFPLEVBQUUsSUFBSTtTQUNkO1FBQ0QsU0FBUyxFQUFFO1lBQ1QsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUN0QixPQUFPLEVBQUUsR0FBRztTQUNiO1FBQ0QsR0FBRyxFQUFFO1lBQ0gs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QVcsRUFBRSxXQUFXO1lBQ3hCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztTQUN0QixFQUFFO1lBQ0QsQ0FBQyxDQUFDLFlBQVksRUFBRTtnQkFDZCxLQUFLLEVBQUU7b0JBQ0wsSUFBSSxFQUFFLElBQUksQ0FBQyxrQkFBa0I7aUJBQzlCO2FBQ0YsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2IsSUFBSSxDQUFDLFlBQVksRUFBRTtTQUNwQixDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi4vLi4vc3R5bHVzL2NvbXBvbmVudHMvX3Rvb2x0aXBzLnN0eWwnXHJcblxyXG4vLyBNaXhpbnNcclxuaW1wb3J0IENvbG9yYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvY29sb3JhYmxlJ1xyXG5pbXBvcnQgRGVsYXlhYmxlIGZyb20gJy4uLy4uL21peGlucy9kZWxheWFibGUnXHJcbmltcG9ydCBEZXBlbmRlbnQgZnJvbSAnLi4vLi4vbWl4aW5zL2RlcGVuZGVudCdcclxuaW1wb3J0IERldGFjaGFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2RldGFjaGFibGUnXHJcbmltcG9ydCBNZW51YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvbWVudWFibGUnXHJcbmltcG9ydCBUb2dnbGVhYmxlIGZyb20gJy4uLy4uL21peGlucy90b2dnbGVhYmxlJ1xyXG5cclxuLy8gSGVscGVyc1xyXG5pbXBvcnQgeyBjb252ZXJ0VG9Vbml0IH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xyXG5cclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIG5hbWU6ICd2LXRvb2x0aXAnLFxyXG5cclxuICBtaXhpbnM6IFtDb2xvcmFibGUsIERlbGF5YWJsZSwgRGVwZW5kZW50LCBEZXRhY2hhYmxlLCBNZW51YWJsZSwgVG9nZ2xlYWJsZV0sXHJcblxyXG4gIHByb3BzOiB7XHJcbiAgICBjbG9zZURlbGF5OiB7XHJcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXHJcbiAgICAgIGRlZmF1bHQ6IDIwMFxyXG4gICAgfSxcclxuICAgIGRlYm91bmNlOiB7XHJcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXHJcbiAgICAgIGRlZmF1bHQ6IDBcclxuICAgIH0sXHJcbiAgICBkaXNhYmxlZDogQm9vbGVhbixcclxuICAgIGZpeGVkOiB7XHJcbiAgICAgIHR5cGU6IEJvb2xlYW4sXHJcbiAgICAgIGRlZmF1bHQ6IHRydWVcclxuICAgIH0sXHJcbiAgICBvcGVuRGVsYXk6IHtcclxuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcclxuICAgICAgZGVmYXVsdDogMjAwXHJcbiAgICB9LFxyXG4gICAgdGFnOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJ3NwYW4nXHJcbiAgICB9LFxyXG4gICAgdHJhbnNpdGlvbjogU3RyaW5nLFxyXG4gICAgekluZGV4OiB7XHJcbiAgICAgIGRlZmF1bHQ6IG51bGxcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBkYXRhOiAoKSA9PiAoe1xyXG4gICAgY2FsY3VsYXRlZE1pbldpZHRoOiAwLFxyXG4gICAgY2xvc2VEZXBlbmRlbnRzOiBmYWxzZVxyXG4gIH0pLFxyXG5cclxuICBjb21wdXRlZDoge1xyXG4gICAgY2FsY3VsYXRlZExlZnQgKCkge1xyXG4gICAgICBjb25zdCB7IGFjdGl2YXRvciwgY29udGVudCB9ID0gdGhpcy5kaW1lbnNpb25zXHJcbiAgICAgIGNvbnN0IHVua25vd24gPSAhdGhpcy5ib3R0b20gJiYgIXRoaXMubGVmdCAmJiAhdGhpcy50b3AgJiYgIXRoaXMucmlnaHRcclxuICAgICAgY29uc3QgYWN0aXZhdG9yTGVmdCA9IHRoaXMuaXNBdHRhY2hlZCA/IGFjdGl2YXRvci5vZmZzZXRMZWZ0IDogYWN0aXZhdG9yLmxlZnRcclxuICAgICAgbGV0IGxlZnQgPSAwXHJcblxyXG4gICAgICBpZiAodGhpcy50b3AgfHwgdGhpcy5ib3R0b20gfHwgdW5rbm93bikge1xyXG4gICAgICAgIGxlZnQgPSAoXHJcbiAgICAgICAgICBhY3RpdmF0b3JMZWZ0ICtcclxuICAgICAgICAgIChhY3RpdmF0b3Iud2lkdGggLyAyKSAtXHJcbiAgICAgICAgICAoY29udGVudC53aWR0aCAvIDIpXHJcbiAgICAgICAgKVxyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMubGVmdCB8fCB0aGlzLnJpZ2h0KSB7XHJcbiAgICAgICAgbGVmdCA9IChcclxuICAgICAgICAgIGFjdGl2YXRvckxlZnQgK1xyXG4gICAgICAgICAgKHRoaXMucmlnaHQgPyBhY3RpdmF0b3Iud2lkdGggOiAtY29udGVudC53aWR0aCkgK1xyXG4gICAgICAgICAgKHRoaXMucmlnaHQgPyAxMCA6IC0xMClcclxuICAgICAgICApXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLm51ZGdlTGVmdCkgbGVmdCAtPSBwYXJzZUludCh0aGlzLm51ZGdlTGVmdClcclxuICAgICAgaWYgKHRoaXMubnVkZ2VSaWdodCkgbGVmdCArPSBwYXJzZUludCh0aGlzLm51ZGdlUmlnaHQpXHJcblxyXG4gICAgICByZXR1cm4gYCR7dGhpcy5jYWxjWE92ZXJmbG93KGxlZnQpfXB4YFxyXG4gICAgfSxcclxuICAgIGNhbGN1bGF0ZWRUb3AgKCkge1xyXG4gICAgICBjb25zdCB7IGFjdGl2YXRvciwgY29udGVudCB9ID0gdGhpcy5kaW1lbnNpb25zXHJcbiAgICAgIGNvbnN0IGFjdGl2YXRvclRvcCA9IHRoaXMuaXNBdHRhY2hlZCA/IGFjdGl2YXRvci5vZmZzZXRUb3AgOiBhY3RpdmF0b3IudG9wXHJcbiAgICAgIGxldCB0b3AgPSAwXHJcblxyXG4gICAgICBpZiAodGhpcy50b3AgfHwgdGhpcy5ib3R0b20pIHtcclxuICAgICAgICB0b3AgPSAoXHJcbiAgICAgICAgICBhY3RpdmF0b3JUb3AgK1xyXG4gICAgICAgICAgKHRoaXMuYm90dG9tID8gYWN0aXZhdG9yLmhlaWdodCA6IC1jb250ZW50LmhlaWdodCkgK1xyXG4gICAgICAgICAgKHRoaXMuYm90dG9tID8gMTAgOiAtMTApXHJcbiAgICAgICAgKVxyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMubGVmdCB8fCB0aGlzLnJpZ2h0KSB7XHJcbiAgICAgICAgdG9wID0gKFxyXG4gICAgICAgICAgYWN0aXZhdG9yVG9wICtcclxuICAgICAgICAgIChhY3RpdmF0b3IuaGVpZ2h0IC8gMikgLVxyXG4gICAgICAgICAgKGNvbnRlbnQuaGVpZ2h0IC8gMilcclxuICAgICAgICApXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLm51ZGdlVG9wKSB0b3AgLT0gcGFyc2VJbnQodGhpcy5udWRnZVRvcClcclxuICAgICAgaWYgKHRoaXMubnVkZ2VCb3R0b20pIHRvcCArPSBwYXJzZUludCh0aGlzLm51ZGdlQm90dG9tKVxyXG5cclxuICAgICAgcmV0dXJuIGAke3RoaXMuY2FsY1lPdmVyZmxvdyh0b3AgKyB0aGlzLnBhZ2VZT2Zmc2V0KX1weGBcclxuICAgIH0sXHJcbiAgICBjbGFzc2VzICgpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAndi10b29sdGlwLS10b3AnOiB0aGlzLnRvcCxcclxuICAgICAgICAndi10b29sdGlwLS1yaWdodCc6IHRoaXMucmlnaHQsXHJcbiAgICAgICAgJ3YtdG9vbHRpcC0tYm90dG9tJzogdGhpcy5ib3R0b20sXHJcbiAgICAgICAgJ3YtdG9vbHRpcC0tbGVmdCc6IHRoaXMubGVmdFxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgY29tcHV0ZWRUcmFuc2l0aW9uICgpIHtcclxuICAgICAgaWYgKHRoaXMudHJhbnNpdGlvbikgcmV0dXJuIHRoaXMudHJhbnNpdGlvblxyXG4gICAgICBpZiAodGhpcy50b3ApIHJldHVybiAnc2xpZGUteS1yZXZlcnNlLXRyYW5zaXRpb24nXHJcbiAgICAgIGlmICh0aGlzLnJpZ2h0KSByZXR1cm4gJ3NsaWRlLXgtdHJhbnNpdGlvbidcclxuICAgICAgaWYgKHRoaXMuYm90dG9tKSByZXR1cm4gJ3NsaWRlLXktdHJhbnNpdGlvbidcclxuICAgICAgaWYgKHRoaXMubGVmdCkgcmV0dXJuICdzbGlkZS14LXJldmVyc2UtdHJhbnNpdGlvbidcclxuICAgICAgcmV0dXJuICcnXHJcbiAgICB9LFxyXG4gICAgb2Zmc2V0WSAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnRvcCB8fCB0aGlzLmJvdHRvbVxyXG4gICAgfSxcclxuICAgIG9mZnNldFggKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5sZWZ0IHx8IHRoaXMucmlnaHRcclxuICAgIH0sXHJcbiAgICBzdHlsZXMgKCkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGxlZnQ6IHRoaXMuY2FsY3VsYXRlZExlZnQsXHJcbiAgICAgICAgbWF4V2lkdGg6IGNvbnZlcnRUb1VuaXQodGhpcy5tYXhXaWR0aCksXHJcbiAgICAgICAgb3BhY2l0eTogdGhpcy5pc0FjdGl2ZSA/IDAuOSA6IDAsXHJcbiAgICAgICAgdG9wOiB0aGlzLmNhbGN1bGF0ZWRUb3AsXHJcbiAgICAgICAgekluZGV4OiB0aGlzLnpJbmRleCB8fCB0aGlzLmFjdGl2ZVpJbmRleFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgYmVmb3JlTW91bnQgKCkge1xyXG4gICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xyXG4gICAgICB0aGlzLnZhbHVlICYmIHRoaXMuY2FsbEFjdGl2YXRlKClcclxuICAgIH0pXHJcbiAgfSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgYWN0aXZhdGUgKCkge1xyXG4gICAgICAvLyBVcGRhdGUgY29vcmRpbmF0ZXMgYW5kIGRpbWVuc2lvbnMgb2YgbWVudVxyXG4gICAgICAvLyBhbmQgaXRzIGFjdGl2YXRvclxyXG4gICAgICB0aGlzLnVwZGF0ZURpbWVuc2lvbnMoKVxyXG4gICAgICAvLyBTdGFydCB0aGUgdHJhbnNpdGlvblxyXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5zdGFydFRyYW5zaXRpb24pXHJcbiAgICB9LFxyXG4gICAgZ2VuQWN0aXZhdG9yICgpIHtcclxuICAgICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5kaXNhYmxlZCA/IHt9IDoge1xyXG4gICAgICAgIG1vdXNlZW50ZXI6IGUgPT4ge1xyXG4gICAgICAgICAgdGhpcy5nZXRBY3RpdmF0b3IoZSlcclxuICAgICAgICAgIHRoaXMucnVuRGVsYXkoJ29wZW4nKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbW91c2VsZWF2ZTogZSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmdldEFjdGl2YXRvcihlKVxyXG4gICAgICAgICAgdGhpcy5ydW5EZWxheSgnY2xvc2UnKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMuJHNjb3BlZFNsb3RzLmFjdGl2YXRvciAmJiB0aGlzLiRzY29wZWRTbG90cy5hY3RpdmF0b3IubGVuZ3RoKSB7XHJcbiAgICAgICAgY29uc3QgYWN0aXZhdG9yID0gdGhpcy4kc2NvcGVkU2xvdHMuYWN0aXZhdG9yKHsgb246IGxpc3RlbmVycyB9KVxyXG4gICAgICAgIHRoaXMuYWN0aXZhdG9yTm9kZSA9IGFjdGl2YXRvclxyXG4gICAgICAgIHJldHVybiBhY3RpdmF0b3JcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7XHJcbiAgICAgICAgb246IGxpc3RlbmVycyxcclxuICAgICAgICByZWY6ICdhY3RpdmF0b3InXHJcbiAgICAgIH0sIHRoaXMuJHNsb3RzLmFjdGl2YXRvcilcclxuICAgIH1cclxuICB9LFxyXG5cclxuICByZW5kZXIgKGgpIHtcclxuICAgIGNvbnN0IHRvb2x0aXAgPSBoKCdkaXYnLCB0aGlzLnNldEJhY2tncm91bmRDb2xvcih0aGlzLmNvbG9yLCB7XHJcbiAgICAgIHN0YXRpY0NsYXNzOiAndi10b29sdGlwX19jb250ZW50JyxcclxuICAgICAgJ2NsYXNzJzoge1xyXG4gICAgICAgIFt0aGlzLmNvbnRlbnRDbGFzc106IHRydWUsXHJcbiAgICAgICAgJ21lbnVhYmxlX19jb250ZW50X19hY3RpdmUnOiB0aGlzLmlzQWN0aXZlXHJcbiAgICAgIH0sXHJcbiAgICAgIHN0eWxlOiB0aGlzLnN0eWxlcyxcclxuICAgICAgYXR0cnM6IHRoaXMuZ2V0U2NvcGVJZEF0dHJzKCksXHJcbiAgICAgIGRpcmVjdGl2ZXM6IFt7XHJcbiAgICAgICAgbmFtZTogJ3Nob3cnLFxyXG4gICAgICAgIHZhbHVlOiB0aGlzLmlzQ29udGVudEFjdGl2ZVxyXG4gICAgICB9XSxcclxuICAgICAgcmVmOiAnY29udGVudCdcclxuICAgIH0pLCB0aGlzLnNob3dMYXp5Q29udGVudCh0aGlzLiRzbG90cy5kZWZhdWx0KSlcclxuXHJcbiAgICByZXR1cm4gaCh0aGlzLnRhZywge1xyXG4gICAgICBzdGF0aWNDbGFzczogJ3YtdG9vbHRpcCcsXHJcbiAgICAgICdjbGFzcyc6IHRoaXMuY2xhc3Nlc1xyXG4gICAgfSwgW1xyXG4gICAgICBoKCd0cmFuc2l0aW9uJywge1xyXG4gICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICBuYW1lOiB0aGlzLmNvbXB1dGVkVHJhbnNpdGlvblxyXG4gICAgICAgIH1cclxuICAgICAgfSwgW3Rvb2x0aXBdKSxcclxuICAgICAgdGhpcy5nZW5BY3RpdmF0b3IoKVxyXG4gICAgXSlcclxuICB9XHJcbn1cclxuIl19