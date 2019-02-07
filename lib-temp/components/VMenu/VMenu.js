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
import { convertToUnit } from '../../util/helpers';
import ThemeProvider from '../../util/ThemeProvider';
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
            if (!this.auto)
                return this.calcLeft();
            return `${this.calcXOverflow(this.calcLeftAuto())}px`;
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
            const minWidth = (this.dimensions.activator.width +
                this.nudgeWidth +
                (this.auto ? 16 : 0));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVk1lbnUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WTWVudS9WTWVudS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLHFDQUFxQyxDQUFBO0FBRTVDLE9BQU8sR0FBRyxNQUFNLEtBQUssQ0FBQTtBQUVyQixTQUFTO0FBQ1QsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxVQUFVLE1BQU0seUJBQXlCLENBQUE7QUFDaEQsT0FBTyxRQUFRLE1BQU0sMEJBQTBCLENBQUE7QUFDL0MsT0FBTyxVQUFVLE1BQU0seUJBQXlCLENBQUE7QUFDaEQsT0FBTyxVQUFVLE1BQU0seUJBQXlCLENBQUE7QUFDaEQsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFFOUMseUJBQXlCO0FBQ3pCLE9BQU8sU0FBUyxNQUFNLHlCQUF5QixDQUFBO0FBQy9DLE9BQU8sVUFBVSxNQUFNLDBCQUEwQixDQUFBO0FBQ2pELE9BQU8sT0FBTyxNQUFNLHVCQUF1QixDQUFBO0FBQzNDLE9BQU8sUUFBUSxNQUFNLHdCQUF3QixDQUFBO0FBRTdDLGFBQWE7QUFDYixPQUFPLFlBQVksTUFBTSxnQ0FBZ0MsQ0FBQTtBQUN6RCxPQUFPLE1BQU0sTUFBTSx5QkFBeUIsQ0FBQTtBQUU1QyxVQUFVO0FBQ1YsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQ2xELE9BQU8sYUFBYSxNQUFNLDBCQUEwQixDQUFBO0FBRXBELG9CQUFvQjtBQUNwQixlQUFlLEdBQUcsQ0FBQyxNQUFNLENBQUM7SUFDeEIsSUFBSSxFQUFFLFFBQVE7SUFFZCxPQUFPO1FBQ0wsT0FBTztZQUNMLHFDQUFxQztZQUNyQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7U0FDbEIsQ0FBQTtJQUNILENBQUM7SUFFRCxVQUFVLEVBQUU7UUFDVixZQUFZO1FB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LFVBQVUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLENBQUE7UUFDN0QsQ0FBQztLQUNGO0lBRUQsTUFBTSxDQUFFLENBQUM7UUFDUCxNQUFNLElBQUksR0FBRztZQUNYLFdBQVcsRUFBRSxRQUFRO1lBQ3JCLEtBQUssRUFBRSxFQUFFLGdCQUFnQixFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTtZQUNyRSxVQUFVLEVBQUUsQ0FBQztvQkFDWCxHQUFHLEVBQUUsR0FBRztvQkFDUixJQUFJLEVBQUUsUUFBUTtvQkFDZCxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVE7aUJBQ3JCLENBQUM7WUFDRixFQUFFLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDakMsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTO2FBQ3hCO1NBQ0YsQ0FBQTtRQUVELE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUU7WUFDcEIsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNuQixJQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsRUFBRTtnQkFDakMsS0FBSyxFQUFFO29CQUNMLElBQUksRUFBRSxJQUFJO29CQUNWLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztvQkFDakIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO2lCQUNoQjthQUNGLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztTQUMzQixDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuLi8uLi9zdHlsdXMvY29tcG9uZW50cy9fbWVudXMuc3R5bCdcclxuXHJcbmltcG9ydCBWdWUgZnJvbSAndnVlJ1xyXG5cclxuLy8gTWl4aW5zXHJcbmltcG9ydCBEZWxheWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2RlbGF5YWJsZSdcclxuaW1wb3J0IERlcGVuZGVudCBmcm9tICcuLi8uLi9taXhpbnMvZGVwZW5kZW50J1xyXG5pbXBvcnQgRGV0YWNoYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvZGV0YWNoYWJsZSdcclxuaW1wb3J0IE1lbnVhYmxlIGZyb20gJy4uLy4uL21peGlucy9tZW51YWJsZS5qcydcclxuaW1wb3J0IFJldHVybmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3JldHVybmFibGUnXHJcbmltcG9ydCBUb2dnbGVhYmxlIGZyb20gJy4uLy4uL21peGlucy90b2dnbGVhYmxlJ1xyXG5pbXBvcnQgVGhlbWVhYmxlIGZyb20gJy4uLy4uL21peGlucy90aGVtZWFibGUnXHJcblxyXG4vLyBDb21wb25lbnQgbGV2ZWwgbWl4aW5zXHJcbmltcG9ydCBBY3RpdmF0b3IgZnJvbSAnLi9taXhpbnMvbWVudS1hY3RpdmF0b3InXHJcbmltcG9ydCBHZW5lcmF0b3JzIGZyb20gJy4vbWl4aW5zL21lbnUtZ2VuZXJhdG9ycydcclxuaW1wb3J0IEtleWFibGUgZnJvbSAnLi9taXhpbnMvbWVudS1rZXlhYmxlJ1xyXG5pbXBvcnQgUG9zaXRpb24gZnJvbSAnLi9taXhpbnMvbWVudS1wb3NpdGlvbidcclxuXHJcbi8vIERpcmVjdGl2ZXNcclxuaW1wb3J0IENsaWNrT3V0c2lkZSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL2NsaWNrLW91dHNpZGUnXHJcbmltcG9ydCBSZXNpemUgZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy9yZXNpemUnXHJcblxyXG4vLyBIZWxwZXJzXHJcbmltcG9ydCB7IGNvbnZlcnRUb1VuaXQgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXHJcbmltcG9ydCBUaGVtZVByb3ZpZGVyIGZyb20gJy4uLy4uL3V0aWwvVGhlbWVQcm92aWRlcidcclxuXHJcbi8qIEB2dWUvY29tcG9uZW50ICovXHJcbmV4cG9ydCBkZWZhdWx0IFZ1ZS5leHRlbmQoe1xyXG4gIG5hbWU6ICd2LW1lbnUnLFxyXG5cclxuICBwcm92aWRlICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIC8vIFBhc3MgdGhlbWUgdGhyb3VnaCB0byBkZWZhdWx0IHNsb3RcclxuICAgICAgdGhlbWU6IHRoaXMudGhlbWVcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBkaXJlY3RpdmVzOiB7XHJcbiAgICBDbGlja091dHNpZGUsXHJcbiAgICBSZXNpemVcclxuICB9LFxyXG5cclxuICBtaXhpbnM6IFtcclxuICAgIEFjdGl2YXRvcixcclxuICAgIERlcGVuZGVudCxcclxuICAgIERlbGF5YWJsZSxcclxuICAgIERldGFjaGFibGUsXHJcbiAgICBHZW5lcmF0b3JzLFxyXG4gICAgS2V5YWJsZSxcclxuICAgIE1lbnVhYmxlLFxyXG4gICAgUG9zaXRpb24sXHJcbiAgICBSZXR1cm5hYmxlLFxyXG4gICAgVG9nZ2xlYWJsZSxcclxuICAgIFRoZW1lYWJsZVxyXG4gIF0sXHJcblxyXG4gIHByb3BzOiB7XHJcbiAgICBhdXRvOiBCb29sZWFuLFxyXG4gICAgY2xvc2VPbkNsaWNrOiB7XHJcbiAgICAgIHR5cGU6IEJvb2xlYW4sXHJcbiAgICAgIGRlZmF1bHQ6IHRydWVcclxuICAgIH0sXHJcbiAgICBjbG9zZU9uQ29udGVudENsaWNrOiB7XHJcbiAgICAgIHR5cGU6IEJvb2xlYW4sXHJcbiAgICAgIGRlZmF1bHQ6IHRydWVcclxuICAgIH0sXHJcbiAgICBkaXNhYmxlZDogQm9vbGVhbixcclxuICAgIGZ1bGxXaWR0aDogQm9vbGVhbixcclxuICAgIG1heEhlaWdodDogeyBkZWZhdWx0OiAnYXV0bycgfSxcclxuICAgIG9wZW5PbkNsaWNrOiB7XHJcbiAgICAgIHR5cGU6IEJvb2xlYW4sXHJcbiAgICAgIGRlZmF1bHQ6IHRydWVcclxuICAgIH0sXHJcbiAgICBvZmZzZXRYOiBCb29sZWFuLFxyXG4gICAgb2Zmc2V0WTogQm9vbGVhbixcclxuICAgIG9wZW5PbkhvdmVyOiBCb29sZWFuLFxyXG4gICAgb3JpZ2luOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJ3RvcCBsZWZ0J1xyXG4gICAgfSxcclxuICAgIHRyYW5zaXRpb246IHtcclxuICAgICAgdHlwZTogW0Jvb2xlYW4sIFN0cmluZ10sXHJcbiAgICAgIGRlZmF1bHQ6ICd2LW1lbnUtdHJhbnNpdGlvbidcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBkYXRhICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGRlZmF1bHRPZmZzZXQ6IDgsXHJcbiAgICAgIGhhc0p1c3RGb2N1c2VkOiBmYWxzZSxcclxuICAgICAgcmVzaXplVGltZW91dDogbnVsbFxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICBjYWxjdWxhdGVkTGVmdCAoKSB7XHJcbiAgICAgIGlmICghdGhpcy5hdXRvKSByZXR1cm4gdGhpcy5jYWxjTGVmdCgpXHJcblxyXG4gICAgICByZXR1cm4gYCR7dGhpcy5jYWxjWE92ZXJmbG93KHRoaXMuY2FsY0xlZnRBdXRvKCkpfXB4YFxyXG4gICAgfSxcclxuICAgIGNhbGN1bGF0ZWRNYXhIZWlnaHQgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5hdXRvID8gJzIwMHB4JyA6IGNvbnZlcnRUb1VuaXQodGhpcy5tYXhIZWlnaHQpXHJcbiAgICB9LFxyXG4gICAgY2FsY3VsYXRlZE1heFdpZHRoICgpIHtcclxuICAgICAgcmV0dXJuIGlzTmFOKHRoaXMubWF4V2lkdGgpXHJcbiAgICAgICAgPyB0aGlzLm1heFdpZHRoXHJcbiAgICAgICAgOiBgJHt0aGlzLm1heFdpZHRofXB4YFxyXG4gICAgfSxcclxuICAgIGNhbGN1bGF0ZWRNaW5XaWR0aCAoKSB7XHJcbiAgICAgIGlmICh0aGlzLm1pbldpZHRoKSB7XHJcbiAgICAgICAgcmV0dXJuIGlzTmFOKHRoaXMubWluV2lkdGgpXHJcbiAgICAgICAgICA/IHRoaXMubWluV2lkdGhcclxuICAgICAgICAgIDogYCR7dGhpcy5taW5XaWR0aH1weGBcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgbWluV2lkdGggPSAoXHJcbiAgICAgICAgdGhpcy5kaW1lbnNpb25zLmFjdGl2YXRvci53aWR0aCArXHJcbiAgICAgICAgdGhpcy5udWRnZVdpZHRoICtcclxuICAgICAgICAodGhpcy5hdXRvID8gMTYgOiAwKVxyXG4gICAgICApXHJcblxyXG4gICAgICBjb25zdCBjYWxjdWxhdGVkTWF4V2lkdGggPSBpc05hTihwYXJzZUludCh0aGlzLmNhbGN1bGF0ZWRNYXhXaWR0aCkpXHJcbiAgICAgICAgPyBtaW5XaWR0aFxyXG4gICAgICAgIDogcGFyc2VJbnQodGhpcy5jYWxjdWxhdGVkTWF4V2lkdGgpXHJcblxyXG4gICAgICByZXR1cm4gYCR7TWF0aC5taW4oXHJcbiAgICAgICAgY2FsY3VsYXRlZE1heFdpZHRoLFxyXG4gICAgICAgIG1pbldpZHRoXHJcbiAgICAgICl9cHhgXHJcbiAgICB9LFxyXG4gICAgY2FsY3VsYXRlZFRvcCAoKSB7XHJcbiAgICAgIGlmICghdGhpcy5hdXRvIHx8IHRoaXMuaXNBdHRhY2hlZCkgcmV0dXJuIHRoaXMuY2FsY1RvcCgpXHJcblxyXG4gICAgICByZXR1cm4gYCR7dGhpcy5jYWxjWU92ZXJmbG93KHRoaXMuY2FsY3VsYXRlZFRvcEF1dG8pfXB4YFxyXG4gICAgfSxcclxuICAgIHN0eWxlcyAoKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgbWF4SGVpZ2h0OiB0aGlzLmNhbGN1bGF0ZWRNYXhIZWlnaHQsXHJcbiAgICAgICAgbWluV2lkdGg6IHRoaXMuY2FsY3VsYXRlZE1pbldpZHRoLFxyXG4gICAgICAgIG1heFdpZHRoOiB0aGlzLmNhbGN1bGF0ZWRNYXhXaWR0aCxcclxuICAgICAgICB0b3A6IHRoaXMuY2FsY3VsYXRlZFRvcCxcclxuICAgICAgICBsZWZ0OiB0aGlzLmNhbGN1bGF0ZWRMZWZ0LFxyXG4gICAgICAgIHRyYW5zZm9ybU9yaWdpbjogdGhpcy5vcmlnaW4sXHJcbiAgICAgICAgekluZGV4OiB0aGlzLnpJbmRleCB8fCB0aGlzLmFjdGl2ZVpJbmRleFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgd2F0Y2g6IHtcclxuICAgIGFjdGl2YXRvciAobmV3QWN0aXZhdG9yLCBvbGRBY3RpdmF0b3IpIHtcclxuICAgICAgdGhpcy5yZW1vdmVBY3RpdmF0b3JFdmVudHMob2xkQWN0aXZhdG9yKVxyXG4gICAgICB0aGlzLmFkZEFjdGl2YXRvckV2ZW50cyhuZXdBY3RpdmF0b3IpXHJcbiAgICB9LFxyXG4gICAgZGlzYWJsZWQgKGRpc2FibGVkKSB7XHJcbiAgICAgIGlmICghdGhpcy5hY3RpdmF0b3IpIHJldHVyblxyXG5cclxuICAgICAgaWYgKGRpc2FibGVkKSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVBY3RpdmF0b3JFdmVudHModGhpcy5hY3RpdmF0b3IpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5hZGRBY3RpdmF0b3JFdmVudHModGhpcy5hY3RpdmF0b3IpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBpc0NvbnRlbnRBY3RpdmUgKHZhbCkge1xyXG4gICAgICB0aGlzLmhhc0p1c3RGb2N1c2VkID0gdmFsXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgbW91bnRlZCAoKSB7XHJcbiAgICB0aGlzLmlzQWN0aXZlICYmIHRoaXMuYWN0aXZhdGUoKVxyXG4gIH0sXHJcblxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGFjdGl2YXRlICgpIHtcclxuICAgICAgLy8gVGhpcyBleGlzdHMgcHJpbWFyaWx5IGZvciB2LXNlbGVjdFxyXG4gICAgICAvLyBoZWxwcyBkZXRlcm1pbmUgd2hpY2ggdGlsZXMgdG8gYWN0aXZhdGVcclxuICAgICAgdGhpcy5nZXRUaWxlcygpXHJcbiAgICAgIC8vIFVwZGF0ZSBjb29yZGluYXRlcyBhbmQgZGltZW5zaW9ucyBvZiBtZW51XHJcbiAgICAgIC8vIGFuZCBpdHMgYWN0aXZhdG9yXHJcbiAgICAgIHRoaXMudXBkYXRlRGltZW5zaW9ucygpXHJcbiAgICAgIC8vIFN0YXJ0IHRoZSB0cmFuc2l0aW9uXHJcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcbiAgICAgICAgLy8gT25jZSB0cmFuc2l0aW9uaW5nLCBjYWxjdWxhdGUgc2Nyb2xsIGFuZCB0b3AgcG9zaXRpb25cclxuICAgICAgICB0aGlzLnN0YXJ0VHJhbnNpdGlvbigpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgaWYgKHRoaXMuJHJlZnMuY29udGVudCkge1xyXG4gICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZWRUb3BBdXRvID0gdGhpcy5jYWxjVG9wQXV0bygpXHJcbiAgICAgICAgICAgIHRoaXMuYXV0byAmJiAodGhpcy4kcmVmcy5jb250ZW50LnNjcm9sbFRvcCA9IHRoaXMuY2FsY1Njcm9sbFBvc2l0aW9uKCkpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBjbG9zZUNvbmRpdGlvbmFsICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaXNBY3RpdmUgJiYgdGhpcy5jbG9zZU9uQ2xpY2tcclxuICAgIH0sXHJcbiAgICBvblJlc2l6ZSAoKSB7XHJcbiAgICAgIGlmICghdGhpcy5pc0FjdGl2ZSkgcmV0dXJuXHJcblxyXG4gICAgICAvLyBBY2NvdW50IGZvciBzY3JlZW4gcmVzaXplXHJcbiAgICAgIC8vIGFuZCBvcmllbnRhdGlvbiBjaGFuZ2VcclxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC1leHByZXNzaW9uc1xyXG4gICAgICB0aGlzLiRyZWZzLmNvbnRlbnQub2Zmc2V0V2lkdGhcclxuICAgICAgdGhpcy51cGRhdGVEaW1lbnNpb25zKClcclxuXHJcbiAgICAgIC8vIFdoZW4gcmVzaXppbmcgdG8gYSBzbWFsbGVyIHdpZHRoXHJcbiAgICAgIC8vIGNvbnRlbnQgd2lkdGggaXMgZXZhbHVhdGVkIGJlZm9yZVxyXG4gICAgICAvLyB0aGUgbmV3IGFjdGl2YXRvciB3aWR0aCBoYXMgYmVlblxyXG4gICAgICAvLyBzZXQsIGNhdXNpbmcgaXQgdG8gbm90IHNpemUgcHJvcGVybHlcclxuICAgICAgLy8gaGFja3kgYnV0IHdpbGwgcmV2aXNpdCBpbiB0aGUgZnV0dXJlXHJcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnJlc2l6ZVRpbWVvdXQpXHJcbiAgICAgIHRoaXMucmVzaXplVGltZW91dCA9IHNldFRpbWVvdXQodGhpcy51cGRhdGVEaW1lbnNpb25zLCAxMDApXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgcmVuZGVyIChoKSB7XHJcbiAgICBjb25zdCBkYXRhID0ge1xyXG4gICAgICBzdGF0aWNDbGFzczogJ3YtbWVudScsXHJcbiAgICAgIGNsYXNzOiB7ICd2LW1lbnUtLWlubGluZSc6ICF0aGlzLmZ1bGxXaWR0aCAmJiB0aGlzLiRzbG90cy5hY3RpdmF0b3IgfSxcclxuICAgICAgZGlyZWN0aXZlczogW3tcclxuICAgICAgICBhcmc6IDUwMCxcclxuICAgICAgICBuYW1lOiAncmVzaXplJyxcclxuICAgICAgICB2YWx1ZTogdGhpcy5vblJlc2l6ZVxyXG4gICAgICB9XSxcclxuICAgICAgb246IHRoaXMuZGlzYWJsZUtleXMgPyB1bmRlZmluZWQgOiB7XHJcbiAgICAgICAga2V5ZG93bjogdGhpcy5vbktleURvd25cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBoKCdkaXYnLCBkYXRhLCBbXHJcbiAgICAgIHRoaXMuZ2VuQWN0aXZhdG9yKCksXHJcbiAgICAgIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVGhlbWVQcm92aWRlciwge1xyXG4gICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICByb290OiB0cnVlLFxyXG4gICAgICAgICAgbGlnaHQ6IHRoaXMubGlnaHQsXHJcbiAgICAgICAgICBkYXJrOiB0aGlzLmRhcmtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIFt0aGlzLmdlblRyYW5zaXRpb24oKV0pXHJcbiAgICBdKVxyXG4gIH1cclxufSlcclxuIl19