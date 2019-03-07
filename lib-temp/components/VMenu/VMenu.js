import '../../stylus/components/_menus.styl';
import Vue from 'vue';
// Mixins
import Delayable from '../../mixins/delayable';
import Dependent from '../../mixins/dependent';
import Detachable from '../../mixins/detachable';
import Menuable from '../../mixins/menuable.js';
import Returnable from '../../mixins/returnable';
import Toggleable from '../../mixins/toggleable';
import Themeable from '../../mixins/themeable';
// Component level mixins
import Activator from './mixins/menu-activator';
import Generators from './mixins/menu-generators';
import Keyable from './mixins/menu-keyable';
import Position from './mixins/menu-position';
// Directives
import ClickOutside from '../../directives/click-outside';
import Resize from '../../directives/resize';
// Helpers
import { convertToUnit, getSlotType } from '../../util/helpers';
import ThemeProvider from '../../util/ThemeProvider';
import { consoleError } from '../../util/console';
/* @vue/component */
export default Vue.extend({
    name: 'v-menu',
    provide() {
        return {
            // Pass theme through to default slot
            theme: this.theme
        };
    },
    directives: {
        ClickOutside,
        Resize
    },
    mixins: [
        Activator,
        Dependent,
        Delayable,
        Detachable,
        Generators,
        Keyable,
        Menuable,
        Position,
        Returnable,
        Toggleable,
        Themeable
    ],
    props: {
        auto: Boolean,
        closeOnClick: {
            type: Boolean,
            default: true
        },
        closeOnContentClick: {
            type: Boolean,
            default: true
        },
        disabled: Boolean,
        fullWidth: Boolean,
        maxHeight: { default: 'auto' },
        openOnClick: {
            type: Boolean,
            default: true
        },
        offsetX: Boolean,
        offsetY: Boolean,
        openOnHover: Boolean,
        origin: {
            type: String,
            default: 'top left'
        },
        transition: {
            type: [Boolean, String],
            default: 'v-menu-transition'
        }
    },
    data() {
        return {
            defaultOffset: 8,
            hasJustFocused: false,
            resizeTimeout: null
        };
    },
    computed: {
        calculatedLeft() {
            const menuWidth = Math.max(this.dimensions.content.width, parseFloat(this.calculatedMinWidth));
            if (!this.auto)
                return this.calcLeft(menuWidth);
            return `${this.calcXOverflow(this.calcLeftAuto(), menuWidth)}px`;
        },
        calculatedMaxHeight() {
            return this.auto ? '200px' : convertToUnit(this.maxHeight);
        },
        calculatedMaxWidth() {
            return isNaN(this.maxWidth)
                ? this.maxWidth
                : `${this.maxWidth}px`;
        },
        calculatedMinWidth() {
            if (this.minWidth) {
                return isNaN(this.minWidth)
                    ? this.minWidth
                    : `${this.minWidth}px`;
            }
            const minWidth = Math.min(this.dimensions.activator.width +
                this.nudgeWidth +
                (this.auto ? 16 : 0), Math.max(this.pageWidth - 24, 0));
            const calculatedMaxWidth = isNaN(parseInt(this.calculatedMaxWidth))
                ? minWidth
                : parseInt(this.calculatedMaxWidth);
            return `${Math.min(calculatedMaxWidth, minWidth)}px`;
        },
        calculatedTop() {
            if (!this.auto || this.isAttached)
                return this.calcTop();
            return `${this.calcYOverflow(this.calculatedTopAuto)}px`;
        },
        styles() {
            return {
                maxHeight: this.calculatedMaxHeight,
                minWidth: this.calculatedMinWidth,
                maxWidth: this.calculatedMaxWidth,
                top: this.calculatedTop,
                left: this.calculatedLeft,
                transformOrigin: this.origin,
                zIndex: this.zIndex || this.activeZIndex
            };
        }
    },
    watch: {
        activator(newActivator, oldActivator) {
            this.removeActivatorEvents(oldActivator);
            this.addActivatorEvents(newActivator);
        },
        disabled(disabled) {
            if (!this.activator)
                return;
            if (disabled) {
                this.removeActivatorEvents(this.activator);
            }
            else {
                this.addActivatorEvents(this.activator);
            }
        },
        isContentActive(val) {
            this.hasJustFocused = val;
        }
    },
    mounted() {
        this.isActive && this.activate();
        if (getSlotType(this, 'activator', true) === 'v-slot') {
            consoleError(`v-tooltip's activator slot must be bound, try '<template #activator="data"><v-btn v-on="data.on>'`, this);
        }
    },
    methods: {
        activate() {
            // This exists primarily for v-select
            // helps determine which tiles to activate
            this.getTiles();
            // Update coordinates and dimensions of menu
            // and its activator
            this.updateDimensions();
            // Start the transition
            requestAnimationFrame(() => {
                // Once transitioning, calculate scroll and top position
                this.startTransition().then(() => {
                    if (this.$refs.content) {
                        this.calculatedTopAuto = this.calcTopAuto();
                        this.auto && (this.$refs.content.scrollTop = this.calcScrollPosition());
                    }
                });
            });
        },
        closeConditional() {
            return this.isActive && this.closeOnClick;
        },
        onResize() {
            if (!this.isActive)
                return;
            // Account for screen resize
            // and orientation change
            // eslint-disable-next-line no-unused-expressions
            this.$refs.content.offsetWidth;
            this.updateDimensions();
            // When resizing to a smaller width
            // content width is evaluated before
            // the new activator width has been
            // set, causing it to not size properly
            // hacky but will revisit in the future
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(this.updateDimensions, 100);
        }
    },
    render(h) {
        const data = {
            staticClass: 'v-menu',
            class: { 'v-menu--inline': !this.fullWidth && this.$slots.activator },
            directives: [{
                    arg: 500,
                    name: 'resize',
                    value: this.onResize
                }],
            on: this.disableKeys ? undefined : {
                keydown: this.onKeyDown
            }
        };
        return h('div', data, [
            this.genActivator(),
            this.$createElement(ThemeProvider, {
                props: {
                    root: true,
                    light: this.light,
                    dark: this.dark
                }
            }, [this.genTransition()])
        ]);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVk1lbnUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WTWVudS9WTWVudS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLHFDQUFxQyxDQUFBO0FBRTVDLE9BQU8sR0FBRyxNQUFNLEtBQUssQ0FBQTtBQUVyQixTQUFTO0FBQ1QsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxVQUFVLE1BQU0seUJBQXlCLENBQUE7QUFDaEQsT0FBTyxRQUFRLE1BQU0sMEJBQTBCLENBQUE7QUFDL0MsT0FBTyxVQUFVLE1BQU0seUJBQXlCLENBQUE7QUFDaEQsT0FBTyxVQUFVLE1BQU0seUJBQXlCLENBQUE7QUFDaEQsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFFOUMseUJBQXlCO0FBQ3pCLE9BQU8sU0FBUyxNQUFNLHlCQUF5QixDQUFBO0FBQy9DLE9BQU8sVUFBVSxNQUFNLDBCQUEwQixDQUFBO0FBQ2pELE9BQU8sT0FBTyxNQUFNLHVCQUF1QixDQUFBO0FBQzNDLE9BQU8sUUFBUSxNQUFNLHdCQUF3QixDQUFBO0FBRTdDLGFBQWE7QUFDYixPQUFPLFlBQVksTUFBTSxnQ0FBZ0MsQ0FBQTtBQUN6RCxPQUFPLE1BQU0sTUFBTSx5QkFBeUIsQ0FBQTtBQUU1QyxVQUFVO0FBQ1YsT0FBTyxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUMvRCxPQUFPLGFBQWEsTUFBTSwwQkFBMEIsQ0FBQTtBQUNwRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFFakQsb0JBQW9CO0FBQ3BCLGVBQWUsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUN4QixJQUFJLEVBQUUsUUFBUTtJQUVkLE9BQU87UUFDTCxPQUFPO1lBQ0wscUNBQXFDO1lBQ3JDLEtBQUssRUFBRSxJQUFJLENBQUMs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Q0FBQyxjQUFjLENBQUMsYUFBYSxFQUFFO2dCQUNqQyxLQUFLLEVBQUU7b0JBQ0wsSUFBSSxFQUFFLElBQUk7b0JBQ1YsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO29CQUNqQixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7aUJBQ2hCO2FBQ0YsRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO1NBQzNCLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4uLy4uL3N0eWx1cy9jb21wb25lbnRzL19tZW51cy5zdHlsJ1xyXG5cclxuaW1wb3J0IFZ1ZSBmcm9tICd2dWUnXHJcblxyXG4vLyBNaXhpbnNcclxuaW1wb3J0IERlbGF5YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvZGVsYXlhYmxlJ1xyXG5pbXBvcnQgRGVwZW5kZW50IGZyb20gJy4uLy4uL21peGlucy9kZXBlbmRlbnQnXHJcbmltcG9ydCBEZXRhY2hhYmxlIGZyb20gJy4uLy4uL21peGlucy9kZXRhY2hhYmxlJ1xyXG5pbXBvcnQgTWVudWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL21lbnVhYmxlLmpzJ1xyXG5pbXBvcnQgUmV0dXJuYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvcmV0dXJuYWJsZSdcclxuaW1wb3J0IFRvZ2dsZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RvZ2dsZWFibGUnXHJcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RoZW1lYWJsZSdcclxuXHJcbi8vIENvbXBvbmVudCBsZXZlbCBtaXhpbnNcclxuaW1wb3J0IEFjdGl2YXRvciBmcm9tICcuL21peGlucy9tZW51LWFjdGl2YXRvcidcclxuaW1wb3J0IEdlbmVyYXRvcnMgZnJvbSAnLi9taXhpbnMvbWVudS1nZW5lcmF0b3JzJ1xyXG5pbXBvcnQgS2V5YWJsZSBmcm9tICcuL21peGlucy9tZW51LWtleWFibGUnXHJcbmltcG9ydCBQb3NpdGlvbiBmcm9tICcuL21peGlucy9tZW51LXBvc2l0aW9uJ1xyXG5cclxuLy8gRGlyZWN0aXZlc1xyXG5pbXBvcnQgQ2xpY2tPdXRzaWRlIGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvY2xpY2stb3V0c2lkZSdcclxuaW1wb3J0IFJlc2l6ZSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL3Jlc2l6ZSdcclxuXHJcbi8vIEhlbHBlcnNcclxuaW1wb3J0IHsgY29udmVydFRvVW5pdCwgZ2V0U2xvdFR5cGUgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXHJcbmltcG9ydCBUaGVtZVByb3ZpZGVyIGZyb20gJy4uLy4uL3V0aWwvVGhlbWVQcm92aWRlcidcclxuaW1wb3J0IHsgY29uc29sZUVycm9yIH0gZnJvbSAnLi4vLi4vdXRpbC9jb25zb2xlJ1xyXG5cclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuZXhwb3J0IGRlZmF1bHQgVnVlLmV4dGVuZCh7XHJcbiAgbmFtZTogJ3YtbWVudScsXHJcblxyXG4gIHByb3ZpZGUgKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgLy8gUGFzcyB0aGVtZSB0aHJvdWdoIHRvIGRlZmF1bHQgc2xvdFxyXG4gICAgICB0aGVtZTogdGhpcy50aGVtZVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGRpcmVjdGl2ZXM6IHtcclxuICAgIENsaWNrT3V0c2lkZSxcclxuICAgIFJlc2l6ZVxyXG4gIH0sXHJcblxyXG4gIG1peGluczogW1xyXG4gICAgQWN0aXZhdG9yLFxyXG4gICAgRGVwZW5kZW50LFxyXG4gICAgRGVsYXlhYmxlLFxyXG4gICAgRGV0YWNoYWJsZSxcclxuICAgIEdlbmVyYXRvcnMsXHJcbiAgICBLZXlhYmxlLFxyXG4gICAgTWVudWFibGUsXHJcbiAgICBQb3NpdGlvbixcclxuICAgIFJldHVybmFibGUsXHJcbiAgICBUb2dnbGVhYmxlLFxyXG4gICAgVGhlbWVhYmxlXHJcbiAgXSxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIGF1dG86IEJvb2xlYW4sXHJcbiAgICBjbG9zZU9uQ2xpY2s6IHtcclxuICAgICAgdHlwZTogQm9vbGVhbixcclxuICAgICAgZGVmYXVsdDogdHJ1ZVxyXG4gICAgfSxcclxuICAgIGNsb3NlT25Db250ZW50Q2xpY2s6IHtcclxuICAgICAgdHlwZTogQm9vbGVhbixcclxuICAgICAgZGVmYXVsdDogdHJ1ZVxyXG4gICAgfSxcclxuICAgIGRpc2FibGVkOiBCb29sZWFuLFxyXG4gICAgZnVsbFdpZHRoOiBCb29sZWFuLFxyXG4gICAgbWF4SGVpZ2h0OiB7IGRlZmF1bHQ6ICdhdXRvJyB9LFxyXG4gICAgb3Blbk9uQ2xpY2s6IHtcclxuICAgICAgdHlwZTogQm9vbGVhbixcclxuICAgICAgZGVmYXVsdDogdHJ1ZVxyXG4gICAgfSxcclxuICAgIG9mZnNldFg6IEJvb2xlYW4sXHJcbiAgICBvZmZzZXRZOiBCb29sZWFuLFxyXG4gICAgb3Blbk9uSG92ZXI6IEJvb2xlYW4sXHJcbiAgICBvcmlnaW46IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAndG9wIGxlZnQnXHJcbiAgICB9LFxyXG4gICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICB0eXBlOiBbQm9vbGVhbiwgU3RyaW5nXSxcclxuICAgICAgZGVmYXVsdDogJ3YtbWVudS10cmFuc2l0aW9uJ1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGRhdGEgKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZGVmYXVsdE9mZnNldDogOCxcclxuICAgICAgaGFzSnVzdEZvY3VzZWQ6IGZhbHNlLFxyXG4gICAgICByZXNpemVUaW1lb3V0OiBudWxsXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIGNhbGN1bGF0ZWRMZWZ0ICgpIHtcclxuICAgICAgY29uc3QgbWVudVdpZHRoID0gTWF0aC5tYXgodGhpcy5kaW1lbnNpb25zLmNvbnRlbnQud2lkdGgsIHBhcnNlRmxvYXQodGhpcy5jYWxjdWxhdGVkTWluV2lkdGgpKVxyXG5cclxuICAgICAgaWYgKCF0aGlzLmF1dG8pIHJldHVybiB0aGlzLmNhbGNMZWZ0KG1lbnVXaWR0aClcclxuXHJcbiAgICAgIHJldHVybiBgJHt0aGlzLmNhbGNYT3ZlcmZsb3codGhpcy5jYWxjTGVmdEF1dG8oKSwgbWVudVdpZHRoKX1weGBcclxuICAgIH0sXHJcbiAgICBjYWxjdWxhdGVkTWF4SGVpZ2h0ICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuYXV0byA/ICcyMDBweCcgOiBjb252ZXJ0VG9Vbml0KHRoaXMubWF4SGVpZ2h0KVxyXG4gICAgfSxcclxuICAgIGNhbGN1bGF0ZWRNYXhXaWR0aCAoKSB7XHJcbiAgICAgIHJldHVybiBpc05hTih0aGlzLm1heFdpZHRoKVxyXG4gICAgICAgID8gdGhpcy5tYXhXaWR0aFxyXG4gICAgICAgIDogYCR7dGhpcy5tYXhXaWR0aH1weGBcclxuICAgIH0sXHJcbiAgICBjYWxjdWxhdGVkTWluV2lkdGggKCkge1xyXG4gICAgICBpZiAodGhpcy5taW5XaWR0aCkge1xyXG4gICAgICAgIHJldHVybiBpc05hTih0aGlzLm1pbldpZHRoKVxyXG4gICAgICAgICAgPyB0aGlzLm1pbldpZHRoXHJcbiAgICAgICAgICA6IGAke3RoaXMubWluV2lkdGh9cHhgXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IG1pbldpZHRoID0gTWF0aC5taW4oXHJcbiAgICAgICAgdGhpcy5kaW1lbnNpb25zLmFjdGl2YXRvci53aWR0aCArXHJcbiAgICAgICAgdGhpcy5udWRnZVdpZHRoICtcclxuICAgICAgICAodGhpcy5hdXRvID8gMTYgOiAwKSxcclxuICAgICAgICBNYXRoLm1heCh0aGlzLnBhZ2VXaWR0aCAtIDI0LCAwKVxyXG4gICAgICApXHJcblxyXG4gICAgICBjb25zdCBjYWxjdWxhdGVkTWF4V2lkdGggPSBpc05hTihwYXJzZUludCh0aGlzLmNhbGN1bGF0ZWRNYXhXaWR0aCkpXHJcbiAgICAgICAgPyBtaW5XaWR0aFxyXG4gICAgICAgIDogcGFyc2VJbnQodGhpcy5jYWxjdWxhdGVkTWF4V2lkdGgpXHJcblxyXG4gICAgICByZXR1cm4gYCR7TWF0aC5taW4oXHJcbiAgICAgICAgY2FsY3VsYXRlZE1heFdpZHRoLFxyXG4gICAgICAgIG1pbldpZHRoXHJcbiAgICAgICl9cHhgXHJcbiAgICB9LFxyXG4gICAgY2FsY3VsYXRlZFRvcCAoKSB7XHJcbiAgICAgIGlmICghdGhpcy5hdXRvIHx8IHRoaXMuaXNBdHRhY2hlZCkgcmV0dXJuIHRoaXMuY2FsY1RvcCgpXHJcblxyXG4gICAgICByZXR1cm4gYCR7dGhpcy5jYWxjWU92ZXJmbG93KHRoaXMuY2FsY3VsYXRlZFRvcEF1dG8pfXB4YFxyXG4gICAgfSxcclxuICAgIHN0eWxlcyAoKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgbWF4SGVpZ2h0OiB0aGlzLmNhbGN1bGF0ZWRNYXhIZWlnaHQsXHJcbiAgICAgICAgbWluV2lkdGg6IHRoaXMuY2FsY3VsYXRlZE1pbldpZHRoLFxyXG4gICAgICAgIG1heFdpZHRoOiB0aGlzLmNhbGN1bGF0ZWRNYXhXaWR0aCxcclxuICAgICAgICB0b3A6IHRoaXMuY2FsY3VsYXRlZFRvcCxcclxuICAgICAgICBsZWZ0OiB0aGlzLmNhbGN1bGF0ZWRMZWZ0LFxyXG4gICAgICAgIHRyYW5zZm9ybU9yaWdpbjogdGhpcy5vcmlnaW4sXHJcbiAgICAgICAgekluZGV4OiB0aGlzLnpJbmRleCB8fCB0aGlzLmFjdGl2ZVpJbmRleFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgd2F0Y2g6IHtcclxuICAgIGFjdGl2YXRvciAobmV3QWN0aXZhdG9yLCBvbGRBY3RpdmF0b3IpIHtcclxuICAgICAgdGhpcy5yZW1vdmVBY3RpdmF0b3JFdmVudHMob2xkQWN0aXZhdG9yKVxyXG4gICAgICB0aGlzLmFkZEFjdGl2YXRvckV2ZW50cyhuZXdBY3RpdmF0b3IpXHJcbiAgICB9LFxyXG4gICAgZGlzYWJsZWQgKGRpc2FibGVkKSB7XHJcbiAgICAgIGlmICghdGhpcy5hY3RpdmF0b3IpIHJldHVyblxyXG5cclxuICAgICAgaWYgKGRpc2FibGVkKSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVBY3RpdmF0b3JFdmVudHModGhpcy5hY3RpdmF0b3IpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5hZGRBY3RpdmF0b3JFdmVudHModGhpcy5hY3RpdmF0b3IpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBpc0NvbnRlbnRBY3RpdmUgKHZhbCkge1xyXG4gICAgICB0aGlzLmhhc0p1c3RGb2N1c2VkID0gdmFsXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgbW91bnRlZCAoKSB7XHJcbiAgICB0aGlzLmlzQWN0aXZlICYmIHRoaXMuYWN0aXZhdGUoKVxyXG5cclxuICAgIGlmIChnZXRTbG90VHlwZSh0aGlzLCAnYWN0aXZhdG9yJywgdHJ1ZSkgPT09ICd2LXNsb3QnKSB7XHJcbiAgICAgIGNvbnNvbGVFcnJvcihgdi10b29sdGlwJ3MgYWN0aXZhdG9yIHNsb3QgbXVzdCBiZSBib3VuZCwgdHJ5ICc8dGVtcGxhdGUgI2FjdGl2YXRvcj1cImRhdGFcIj48di1idG4gdi1vbj1cImRhdGEub24+J2AsIHRoaXMpXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgYWN0aXZhdGUgKCkge1xyXG4gICAgICAvLyBUaGlzIGV4aXN0cyBwcmltYXJpbHkgZm9yIHYtc2VsZWN0XHJcbiAgICAgIC8vIGhlbHBzIGRldGVybWluZSB3aGljaCB0aWxlcyB0byBhY3RpdmF0ZVxyXG4gICAgICB0aGlzLmdldFRpbGVzKClcclxuICAgICAgLy8gVXBkYXRlIGNvb3JkaW5hdGVzIGFuZCBkaW1lbnNpb25zIG9mIG1lbnVcclxuICAgICAgLy8gYW5kIGl0cyBhY3RpdmF0b3JcclxuICAgICAgdGhpcy51cGRhdGVEaW1lbnNpb25zKClcclxuICAgICAgLy8gU3RhcnQgdGhlIHRyYW5zaXRpb25cclxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgICAvLyBPbmNlIHRyYW5zaXRpb25pbmcsIGNhbGN1bGF0ZSBzY3JvbGwgYW5kIHRvcCBwb3NpdGlvblxyXG4gICAgICAgIHRoaXMuc3RhcnRUcmFuc2l0aW9uKCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICBpZiAodGhpcy4kcmVmcy5jb250ZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlZFRvcEF1dG8gPSB0aGlzLmNhbGNUb3BBdXRvKClcclxuICAgICAgICAgICAgdGhpcy5hdXRvICYmICh0aGlzLiRyZWZzLmNvbnRlbnQuc2Nyb2xsVG9wID0gdGhpcy5jYWxjU2Nyb2xsUG9zaXRpb24oKSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIGNsb3NlQ29uZGl0aW9uYWwgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5pc0FjdGl2ZSAmJiB0aGlzLmNsb3NlT25DbGlja1xyXG4gICAgfSxcclxuICAgIG9uUmVzaXplICgpIHtcclxuICAgICAgaWYgKCF0aGlzLmlzQWN0aXZlKSByZXR1cm5cclxuXHJcbiAgICAgIC8vIEFjY291bnQgZm9yIHNjcmVlbiByZXNpemVcclxuICAgICAgLy8gYW5kIG9yaWVudGF0aW9uIGNoYW5nZVxyXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLWV4cHJlc3Npb25zXHJcbiAgICAgIHRoaXMuJHJlZnMuY29udGVudC5vZmZzZXRXaWR0aFxyXG4gICAgICB0aGlzLnVwZGF0ZURpbWVuc2lvbnMoKVxyXG5cclxuICAgICAgLy8gV2hlbiByZXNpemluZyB0byBhIHNtYWxsZXIgd2lkdGhcclxuICAgICAgLy8gY29udGVudCB3aWR0aCBpcyBldmFsdWF0ZWQgYmVmb3JlXHJcbiAgICAgIC8vIHRoZSBuZXcgYWN0aXZhdG9yIHdpZHRoIGhhcyBiZWVuXHJcbiAgICAgIC8vIHNldCwgY2F1c2luZyBpdCB0byBub3Qgc2l6ZSBwcm9wZXJseVxyXG4gICAgICAvLyBoYWNreSBidXQgd2lsbCByZXZpc2l0IGluIHRoZSBmdXR1cmVcclxuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMucmVzaXplVGltZW91dClcclxuICAgICAgdGhpcy5yZXNpemVUaW1lb3V0ID0gc2V0VGltZW91dCh0aGlzLnVwZGF0ZURpbWVuc2lvbnMsIDEwMClcclxuICAgIH1cclxuICB9LFxyXG5cclxuICByZW5kZXIgKGgpIHtcclxuICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgIHN0YXRpY0NsYXNzOiAndi1tZW51JyxcclxuICAgICAgY2xhc3M6IHsgJ3YtbWVudS0taW5saW5lJzogIXRoaXMuZnVsbFdpZHRoICYmIHRoaXMuJHNsb3RzLmFjdGl2YXRvciB9LFxyXG4gICAgICBkaXJlY3RpdmVzOiBbe1xyXG4gICAgICAgIGFyZzogNTAwLFxyXG4gICAgICAgIG5hbWU6ICdyZXNpemUnLFxyXG4gICAgICAgIHZhbHVlOiB0aGlzLm9uUmVzaXplXHJcbiAgICAgIH1dLFxyXG4gICAgICBvbjogdGhpcy5kaXNhYmxlS2V5cyA/IHVuZGVmaW5lZCA6IHtcclxuICAgICAgICBrZXlkb3duOiB0aGlzLm9uS2V5RG93blxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGgoJ2RpdicsIGRhdGEsIFtcclxuICAgICAgdGhpcy5nZW5BY3RpdmF0b3IoKSxcclxuICAgICAgdGhpcy4kY3JlYXRlRWxlbWVudChUaGVtZVByb3ZpZGVyLCB7XHJcbiAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgIHJvb3Q6IHRydWUsXHJcbiAgICAgICAgICBsaWdodDogdGhpcy5saWdodCxcclxuICAgICAgICAgIGRhcms6IHRoaXMuZGFya1xyXG4gICAgICAgIH1cclxuICAgICAgfSwgW3RoaXMuZ2VuVHJhbnNpdGlvbigpXSlcclxuICAgIF0pXHJcbiAgfVxyXG59KVxyXG4iXX0=