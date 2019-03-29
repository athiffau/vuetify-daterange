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
        closeConditional(e) {
            return this.isActive &&
                this.closeOnClick &&
                !this.$refs.content.contains(e.target);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVk1lbnUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WTWVudS9WTWVudS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLHFDQUFxQyxDQUFBO0FBRTVDLE9BQU8sR0FBRyxNQUFNLEtBQUssQ0FBQTtBQUVyQixTQUFTO0FBQ1QsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxVQUFVLE1BQU0seUJBQXlCLENBQUE7QUFDaEQsT0FBTyxRQUFRLE1BQU0sMEJBQTBCLENBQUE7QUFDL0MsT0FBTyxVQUFVLE1BQU0seUJBQXlCLENBQUE7QUFDaEQsT0FBTyxVQUFVLE1BQU0seUJBQXlCLENBQUE7QUFDaEQsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFFOUMseUJBQXlCO0FBQ3pCLE9BQU8sU0FBUyxNQUFNLHlCQUF5QixDQUFBO0FBQy9DLE9BQU8sVUFBVSxNQUFNLDBCQUEwQixDQUFBO0FBQ2pELE9BQU8sT0FBTyxNQUFNLHVCQUF1QixDQUFBO0FBQzNDLE9BQU8sUUFBUSxNQUFNLHdCQUF3QixDQUFBO0FBRTdDLGFBQWE7QUFDYixPQUFPLFlBQVksTUFBTSxnQ0FBZ0MsQ0FBQTtBQUN6RCxPQUFPLE1BQU0sTUFBTSx5QkFBeUIsQ0FBQTtBQUU1QyxVQUFVO0FBQ1YsT0FBTyxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUMvRCxPQUFPLGFBQWEsTUFBTSwwQkFBMEIsQ0FBQTtBQUNwRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFFakQsb0JBQW9CO0FBQ3BCLGVBQWUsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUN4QixJQUFJLEVBQUUsUUFBUTtJQUVkLE9BQU87UUFDTCxPQUFPO1lBQ0wscUNBQXFDO1lBQ3JDLEtBQUssRUFBRSxJQUFJLENBQUMs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Q0YsQ0FBQTtRQUVELE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUU7WUFDcEIsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNuQixJQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsRUFBRTtnQkFDakMsS0FBSyxFQUFFO29CQUNMLElBQUksRUFBRSxJQUFJO29CQUNWLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztvQkFDakIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO2lCQUNoQjthQUNGLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztTQUMzQixDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuLi8uLi9zdHlsdXMvY29tcG9uZW50cy9fbWVudXMuc3R5bCdcclxuXHJcbmltcG9ydCBWdWUgZnJvbSAndnVlJ1xyXG5cclxuLy8gTWl4aW5zXHJcbmltcG9ydCBEZWxheWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2RlbGF5YWJsZSdcclxuaW1wb3J0IERlcGVuZGVudCBmcm9tICcuLi8uLi9taXhpbnMvZGVwZW5kZW50J1xyXG5pbXBvcnQgRGV0YWNoYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvZGV0YWNoYWJsZSdcclxuaW1wb3J0IE1lbnVhYmxlIGZyb20gJy4uLy4uL21peGlucy9tZW51YWJsZS5qcydcclxuaW1wb3J0IFJldHVybmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3JldHVybmFibGUnXHJcbmltcG9ydCBUb2dnbGVhYmxlIGZyb20gJy4uLy4uL21peGlucy90b2dnbGVhYmxlJ1xyXG5pbXBvcnQgVGhlbWVhYmxlIGZyb20gJy4uLy4uL21peGlucy90aGVtZWFibGUnXHJcblxyXG4vLyBDb21wb25lbnQgbGV2ZWwgbWl4aW5zXHJcbmltcG9ydCBBY3RpdmF0b3IgZnJvbSAnLi9taXhpbnMvbWVudS1hY3RpdmF0b3InXHJcbmltcG9ydCBHZW5lcmF0b3JzIGZyb20gJy4vbWl4aW5zL21lbnUtZ2VuZXJhdG9ycydcclxuaW1wb3J0IEtleWFibGUgZnJvbSAnLi9taXhpbnMvbWVudS1rZXlhYmxlJ1xyXG5pbXBvcnQgUG9zaXRpb24gZnJvbSAnLi9taXhpbnMvbWVudS1wb3NpdGlvbidcclxuXHJcbi8vIERpcmVjdGl2ZXNcclxuaW1wb3J0IENsaWNrT3V0c2lkZSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL2NsaWNrLW91dHNpZGUnXHJcbmltcG9ydCBSZXNpemUgZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy9yZXNpemUnXHJcblxyXG4vLyBIZWxwZXJzXHJcbmltcG9ydCB7IGNvbnZlcnRUb1VuaXQsIGdldFNsb3RUeXBlIH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xyXG5pbXBvcnQgVGhlbWVQcm92aWRlciBmcm9tICcuLi8uLi91dGlsL1RoZW1lUHJvdmlkZXInXHJcbmltcG9ydCB7IGNvbnNvbGVFcnJvciB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcclxuXHJcbi8qIEB2dWUvY29tcG9uZW50ICovXHJcbmV4cG9ydCBkZWZhdWx0IFZ1ZS5leHRlbmQoe1xyXG4gIG5hbWU6ICd2LW1lbnUnLFxyXG5cclxuICBwcm92aWRlICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIC8vIFBhc3MgdGhlbWUgdGhyb3VnaCB0byBkZWZhdWx0IHNsb3RcclxuICAgICAgdGhlbWU6IHRoaXMudGhlbWVcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBkaXJlY3RpdmVzOiB7XHJcbiAgICBDbGlja091dHNpZGUsXHJcbiAgICBSZXNpemVcclxuICB9LFxyXG5cclxuICBtaXhpbnM6IFtcclxuICAgIEFjdGl2YXRvcixcclxuICAgIERlcGVuZGVudCxcclxuICAgIERlbGF5YWJsZSxcclxuICAgIERldGFjaGFibGUsXHJcbiAgICBHZW5lcmF0b3JzLFxyXG4gICAgS2V5YWJsZSxcclxuICAgIE1lbnVhYmxlLFxyXG4gICAgUG9zaXRpb24sXHJcbiAgICBSZXR1cm5hYmxlLFxyXG4gICAgVG9nZ2xlYWJsZSxcclxuICAgIFRoZW1lYWJsZVxyXG4gIF0sXHJcblxyXG4gIHByb3BzOiB7XHJcbiAgICBhdXRvOiBCb29sZWFuLFxyXG4gICAgY2xvc2VPbkNsaWNrOiB7XHJcbiAgICAgIHR5cGU6IEJvb2xlYW4sXHJcbiAgICAgIGRlZmF1bHQ6IHRydWVcclxuICAgIH0sXHJcbiAgICBjbG9zZU9uQ29udGVudENsaWNrOiB7XHJcbiAgICAgIHR5cGU6IEJvb2xlYW4sXHJcbiAgICAgIGRlZmF1bHQ6IHRydWVcclxuICAgIH0sXHJcbiAgICBkaXNhYmxlZDogQm9vbGVhbixcclxuICAgIGZ1bGxXaWR0aDogQm9vbGVhbixcclxuICAgIG1heEhlaWdodDogeyBkZWZhdWx0OiAnYXV0bycgfSxcclxuICAgIG9wZW5PbkNsaWNrOiB7XHJcbiAgICAgIHR5cGU6IEJvb2xlYW4sXHJcbiAgICAgIGRlZmF1bHQ6IHRydWVcclxuICAgIH0sXHJcbiAgICBvZmZzZXRYOiBCb29sZWFuLFxyXG4gICAgb2Zmc2V0WTogQm9vbGVhbixcclxuICAgIG9wZW5PbkhvdmVyOiBCb29sZWFuLFxyXG4gICAgb3JpZ2luOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJ3RvcCBsZWZ0J1xyXG4gICAgfSxcclxuICAgIHRyYW5zaXRpb246IHtcclxuICAgICAgdHlwZTogW0Jvb2xlYW4sIFN0cmluZ10sXHJcbiAgICAgIGRlZmF1bHQ6ICd2LW1lbnUtdHJhbnNpdGlvbidcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBkYXRhICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGRlZmF1bHRPZmZzZXQ6IDgsXHJcbiAgICAgIGhhc0p1c3RGb2N1c2VkOiBmYWxzZSxcclxuICAgICAgcmVzaXplVGltZW91dDogbnVsbFxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICBjYWxjdWxhdGVkTGVmdCAoKSB7XHJcbiAgICAgIGNvbnN0IG1lbnVXaWR0aCA9IE1hdGgubWF4KHRoaXMuZGltZW5zaW9ucy5jb250ZW50LndpZHRoLCBwYXJzZUZsb2F0KHRoaXMuY2FsY3VsYXRlZE1pbldpZHRoKSlcclxuXHJcbiAgICAgIGlmICghdGhpcy5hdXRvKSByZXR1cm4gdGhpcy5jYWxjTGVmdChtZW51V2lkdGgpXHJcblxyXG4gICAgICByZXR1cm4gYCR7dGhpcy5jYWxjWE92ZXJmbG93KHRoaXMuY2FsY0xlZnRBdXRvKCksIG1lbnVXaWR0aCl9cHhgXHJcbiAgICB9LFxyXG4gICAgY2FsY3VsYXRlZE1heEhlaWdodCAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmF1dG8gPyAnMjAwcHgnIDogY29udmVydFRvVW5pdCh0aGlzLm1heEhlaWdodClcclxuICAgIH0sXHJcbiAgICBjYWxjdWxhdGVkTWF4V2lkdGggKCkge1xyXG4gICAgICByZXR1cm4gaXNOYU4odGhpcy5tYXhXaWR0aClcclxuICAgICAgICA/IHRoaXMubWF4V2lkdGhcclxuICAgICAgICA6IGAke3RoaXMubWF4V2lkdGh9cHhgXHJcbiAgICB9LFxyXG4gICAgY2FsY3VsYXRlZE1pbldpZHRoICgpIHtcclxuICAgICAgaWYgKHRoaXMubWluV2lkdGgpIHtcclxuICAgICAgICByZXR1cm4gaXNOYU4odGhpcy5taW5XaWR0aClcclxuICAgICAgICAgID8gdGhpcy5taW5XaWR0aFxyXG4gICAgICAgICAgOiBgJHt0aGlzLm1pbldpZHRofXB4YFxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBtaW5XaWR0aCA9IE1hdGgubWluKFxyXG4gICAgICAgIHRoaXMuZGltZW5zaW9ucy5hY3RpdmF0b3Iud2lkdGggK1xyXG4gICAgICAgIHRoaXMubnVkZ2VXaWR0aCArXHJcbiAgICAgICAgKHRoaXMuYXV0byA/IDE2IDogMCksXHJcbiAgICAgICAgTWF0aC5tYXgodGhpcy5wYWdlV2lkdGggLSAyNCwgMClcclxuICAgICAgKVxyXG5cclxuICAgICAgY29uc3QgY2FsY3VsYXRlZE1heFdpZHRoID0gaXNOYU4ocGFyc2VJbnQodGhpcy5jYWxjdWxhdGVkTWF4V2lkdGgpKVxyXG4gICAgICAgID8gbWluV2lkdGhcclxuICAgICAgICA6IHBhcnNlSW50KHRoaXMuY2FsY3VsYXRlZE1heFdpZHRoKVxyXG5cclxuICAgICAgcmV0dXJuIGAke01hdGgubWluKFxyXG4gICAgICAgIGNhbGN1bGF0ZWRNYXhXaWR0aCxcclxuICAgICAgICBtaW5XaWR0aFxyXG4gICAgICApfXB4YFxyXG4gICAgfSxcclxuICAgIGNhbGN1bGF0ZWRUb3AgKCkge1xyXG4gICAgICBpZiAoIXRoaXMuYXV0byB8fCB0aGlzLmlzQXR0YWNoZWQpIHJldHVybiB0aGlzLmNhbGNUb3AoKVxyXG5cclxuICAgICAgcmV0dXJuIGAke3RoaXMuY2FsY1lPdmVyZmxvdyh0aGlzLmNhbGN1bGF0ZWRUb3BBdXRvKX1weGBcclxuICAgIH0sXHJcbiAgICBzdHlsZXMgKCkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIG1heEhlaWdodDogdGhpcy5jYWxjdWxhdGVkTWF4SGVpZ2h0LFxyXG4gICAgICAgIG1pbldpZHRoOiB0aGlzLmNhbGN1bGF0ZWRNaW5XaWR0aCxcclxuICAgICAgICBtYXhXaWR0aDogdGhpcy5jYWxjdWxhdGVkTWF4V2lkdGgsXHJcbiAgICAgICAgdG9wOiB0aGlzLmNhbGN1bGF0ZWRUb3AsXHJcbiAgICAgICAgbGVmdDogdGhpcy5jYWxjdWxhdGVkTGVmdCxcclxuICAgICAgICB0cmFuc2Zvcm1PcmlnaW46IHRoaXMub3JpZ2luLFxyXG4gICAgICAgIHpJbmRleDogdGhpcy56SW5kZXggfHwgdGhpcy5hY3RpdmVaSW5kZXhcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHdhdGNoOiB7XHJcbiAgICBhY3RpdmF0b3IgKG5ld0FjdGl2YXRvciwgb2xkQWN0aXZhdG9yKSB7XHJcbiAgICAgIHRoaXMucmVtb3ZlQWN0aXZhdG9yRXZlbnRzKG9sZEFjdGl2YXRvcilcclxuICAgICAgdGhpcy5hZGRBY3RpdmF0b3JFdmVudHMobmV3QWN0aXZhdG9yKVxyXG4gICAgfSxcclxuICAgIGRpc2FibGVkIChkaXNhYmxlZCkge1xyXG4gICAgICBpZiAoIXRoaXMuYWN0aXZhdG9yKSByZXR1cm5cclxuXHJcbiAgICAgIGlmIChkaXNhYmxlZCkge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlQWN0aXZhdG9yRXZlbnRzKHRoaXMuYWN0aXZhdG9yKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuYWRkQWN0aXZhdG9yRXZlbnRzKHRoaXMuYWN0aXZhdG9yKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgaXNDb250ZW50QWN0aXZlICh2YWwpIHtcclxuICAgICAgdGhpcy5oYXNKdXN0Rm9jdXNlZCA9IHZhbFxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIG1vdW50ZWQgKCkge1xyXG4gICAgdGhpcy5pc0FjdGl2ZSAmJiB0aGlzLmFjdGl2YXRlKClcclxuXHJcbiAgICBpZiAoZ2V0U2xvdFR5cGUodGhpcywgJ2FjdGl2YXRvcicsIHRydWUpID09PSAndi1zbG90Jykge1xyXG4gICAgICBjb25zb2xlRXJyb3IoYHYtdG9vbHRpcCdzIGFjdGl2YXRvciBzbG90IG11c3QgYmUgYm91bmQsIHRyeSAnPHRlbXBsYXRlICNhY3RpdmF0b3I9XCJkYXRhXCI+PHYtYnRuIHYtb249XCJkYXRhLm9uPidgLCB0aGlzKVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGFjdGl2YXRlICgpIHtcclxuICAgICAgLy8gVGhpcyBleGlzdHMgcHJpbWFyaWx5IGZvciB2LXNlbGVjdFxyXG4gICAgICAvLyBoZWxwcyBkZXRlcm1pbmUgd2hpY2ggdGlsZXMgdG8gYWN0aXZhdGVcclxuICAgICAgdGhpcy5nZXRUaWxlcygpXHJcbiAgICAgIC8vIFVwZGF0ZSBjb29yZGluYXRlcyBhbmQgZGltZW5zaW9ucyBvZiBtZW51XHJcbiAgICAgIC8vIGFuZCBpdHMgYWN0aXZhdG9yXHJcbiAgICAgIHRoaXMudXBkYXRlRGltZW5zaW9ucygpXHJcbiAgICAgIC8vIFN0YXJ0IHRoZSB0cmFuc2l0aW9uXHJcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcbiAgICAgICAgLy8gT25jZSB0cmFuc2l0aW9uaW5nLCBjYWxjdWxhdGUgc2Nyb2xsIGFuZCB0b3AgcG9zaXRpb25cclxuICAgICAgICB0aGlzLnN0YXJ0VHJhbnNpdGlvbigpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgaWYgKHRoaXMuJHJlZnMuY29udGVudCkge1xyXG4gICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZWRUb3BBdXRvID0gdGhpcy5jYWxjVG9wQXV0bygpXHJcbiAgICAgICAgICAgIHRoaXMuYXV0byAmJiAodGhpcy4kcmVmcy5jb250ZW50LnNjcm9sbFRvcCA9IHRoaXMuY2FsY1Njcm9sbFBvc2l0aW9uKCkpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBjbG9zZUNvbmRpdGlvbmFsIChlKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmlzQWN0aXZlICYmXHJcbiAgICAgICAgdGhpcy5jbG9zZU9uQ2xpY2sgJiZcclxuICAgICAgICAhdGhpcy4kcmVmcy5jb250ZW50LmNvbnRhaW5zKGUudGFyZ2V0KVxyXG4gICAgfSxcclxuICAgIG9uUmVzaXplICgpIHtcclxuICAgICAgaWYgKCF0aGlzLmlzQWN0aXZlKSByZXR1cm5cclxuXHJcbiAgICAgIC8vIEFjY291bnQgZm9yIHNjcmVlbiByZXNpemVcclxuICAgICAgLy8gYW5kIG9yaWVudGF0aW9uIGNoYW5nZVxyXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLWV4cHJlc3Npb25zXHJcbiAgICAgIHRoaXMuJHJlZnMuY29udGVudC5vZmZzZXRXaWR0aFxyXG4gICAgICB0aGlzLnVwZGF0ZURpbWVuc2lvbnMoKVxyXG5cclxuICAgICAgLy8gV2hlbiByZXNpemluZyB0byBhIHNtYWxsZXIgd2lkdGhcclxuICAgICAgLy8gY29udGVudCB3aWR0aCBpcyBldmFsdWF0ZWQgYmVmb3JlXHJcbiAgICAgIC8vIHRoZSBuZXcgYWN0aXZhdG9yIHdpZHRoIGhhcyBiZWVuXHJcbiAgICAgIC8vIHNldCwgY2F1c2luZyBpdCB0byBub3Qgc2l6ZSBwcm9wZXJseVxyXG4gICAgICAvLyBoYWNreSBidXQgd2lsbCByZXZpc2l0IGluIHRoZSBmdXR1cmVcclxuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMucmVzaXplVGltZW91dClcclxuICAgICAgdGhpcy5yZXNpemVUaW1lb3V0ID0gc2V0VGltZW91dCh0aGlzLnVwZGF0ZURpbWVuc2lvbnMsIDEwMClcclxuICAgIH1cclxuICB9LFxyXG5cclxuICByZW5kZXIgKGgpIHtcclxuICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgIHN0YXRpY0NsYXNzOiAndi1tZW51JyxcclxuICAgICAgY2xhc3M6IHsgJ3YtbWVudS0taW5saW5lJzogIXRoaXMuZnVsbFdpZHRoICYmIHRoaXMuJHNsb3RzLmFjdGl2YXRvciB9LFxyXG4gICAgICBkaXJlY3RpdmVzOiBbe1xyXG4gICAgICAgIGFyZzogNTAwLFxyXG4gICAgICAgIG5hbWU6ICdyZXNpemUnLFxyXG4gICAgICAgIHZhbHVlOiB0aGlzLm9uUmVzaXplXHJcbiAgICAgIH1dLFxyXG4gICAgICBvbjogdGhpcy5kaXNhYmxlS2V5cyA/IHVuZGVmaW5lZCA6IHtcclxuICAgICAgICBrZXlkb3duOiB0aGlzLm9uS2V5RG93blxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGgoJ2RpdicsIGRhdGEsIFtcclxuICAgICAgdGhpcy5nZW5BY3RpdmF0b3IoKSxcclxuICAgICAgdGhpcy4kY3JlYXRlRWxlbWVudChUaGVtZVByb3ZpZGVyLCB7XHJcbiAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgIHJvb3Q6IHRydWUsXHJcbiAgICAgICAgICBsaWdodDogdGhpcy5saWdodCxcclxuICAgICAgICAgIGRhcms6IHRoaXMuZGFya1xyXG4gICAgICAgIH1cclxuICAgICAgfSwgW3RoaXMuZ2VuVHJhbnNpdGlvbigpXSlcclxuICAgIF0pXHJcbiAgfVxyXG59KVxyXG4iXX0=