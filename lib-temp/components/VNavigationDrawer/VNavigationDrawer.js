// Styles
import '../../stylus/components/_navigation-drawer.styl';
// Mixins
import Applicationable from '../../mixins/applicationable';
import Dependent from '../../mixins/dependent';
import Overlayable from '../../mixins/overlayable';
import SSRBootable from '../../mixins/ssr-bootable';
import Themeable from '../../mixins/themeable';
// Directives
import ClickOutside from '../../directives/click-outside';
import Resize from '../../directives/resize';
import Touch from '../../directives/touch';
// Utilities
import { convertToUnit } from '../../util/helpers';
import mixins from '../../util/mixins';
export default mixins(Applicationable('left', [
    'miniVariant',
    'right',
    'width'
]), Dependent, Overlayable, SSRBootable, Themeable
/* @vue/component */
).extend({
    name: 'v-navigation-drawer',
    directives: {
        ClickOutside,
        Resize,
        Touch
    },
    props: {
        clipped: Boolean,
        disableRouteWatcher: Boolean,
        disableResizeWatcher: Boolean,
        height: {
            type: [Number, String],
            default: '100%'
        },
        floating: Boolean,
        miniVariant: Boolean,
        miniVariantWidth: {
            type: [Number, String],
            default: 80
        },
        mobileBreakPoint: {
            type: [Number, String],
            default: 1264
        },
        permanent: Boolean,
        right: Boolean,
        stateless: Boolean,
        temporary: Boolean,
        touchless: Boolean,
        width: {
            type: [Number, String],
            default: 300
        },
        value: { required: false }
    },
    data: () => ({
        isActive: false,
        touchArea: {
            left: 0,
            right: 0
        }
    }),
    computed: {
        /**
         * Used for setting an app value from a dynamic
         * property. Called from applicationable.js
         */
        applicationProperty() {
            return this.right ? 'right' : 'left';
        },
        calculatedTransform() {
            if (this.isActive)
                return 0;
            return this.right
                ? this.calculatedWidth
                : -this.calculatedWidth;
        },
        calculatedWidth() {
            return parseInt(this.miniVariant
                ? this.miniVariantWidth
                : this.width);
        },
        classes() {
            return {
                'v-navigation-drawer': true,
                'v-navigation-drawer--absolute': this.absolute,
                'v-navigation-drawer--clipped': this.clipped,
                'v-navigation-drawer--close': !this.isActive,
                'v-navigation-drawer--fixed': !this.absolute && (this.app || this.fixed),
                'v-navigation-drawer--floating': this.floating,
                'v-navigation-drawer--is-mobile': this.isMobile,
                'v-navigation-drawer--mini-variant': this.miniVariant,
                'v-navigation-drawer--open': this.isActive,
                'v-navigation-drawer--right': this.right,
                'v-navigation-drawer--temporary': this.temporary,
                ...this.themeClasses
            };
        },
        hasApp() {
            return this.app &&
                (!this.isMobile && !this.temporary);
        },
        isMobile() {
            return !this.stateless &&
                !this.permanent &&
                !this.temporary &&
                this.$vuetify.breakpoint.width < parseInt(this.mobileBreakPoint, 10);
        },
        marginTop() {
            if (!this.hasApp)
                return 0;
            let marginTop = this.$vuetify.application.bar;
            marginTop += this.clipped
                ? this.$vuetify.application.top
                : 0;
            return marginTop;
        },
        maxHeight() {
            if (!this.hasApp)
                return null;
            const maxHeight = (this.$vuetify.application.bottom +
                this.$vuetify.application.footer +
                this.$vuetify.application.bar);
            if (!this.clipped)
                return maxHeight;
            return maxHeight + this.$vuetify.application.top;
        },
        reactsToClick() {
            return !this.stateless &&
                !this.permanent &&
                (this.isMobile || this.temporary);
        },
        reactsToMobile() {
            return !this.disableResizeWatcher &&
                !this.stateless &&
                !this.permanent &&
                !this.temporary;
        },
        reactsToRoute() {
            return !this.disableRouteWatcher &&
                !this.stateless &&
                (this.temporary || this.isMobile);
        },
        resizeIsDisabled() {
            return this.disableResizeWatcher || this.stateless;
        },
        showOverlay() {
            return this.isActive &&
                (this.isMobile || this.temporary);
        },
        styles() {
            const styles = {
                height: convertToUnit(this.height),
                marginTop: `${this.marginTop}px`,
                maxHeight: this.maxHeight != null ? `calc(100% - ${+this.maxHeight}px)` : undefined,
                transform: `translateX(${this.calculatedTransform}px)`,
                width: `${this.calculatedWidth}px`
            };
            return styles;
        }
    },
    watch: {
        $route() {
            if (this.reactsToRoute && this.closeConditional()) {
                this.isActive = false;
            }
        },
        isActive(val) {
            this.$emit('input', val);
            this.callUpdate();
        },
        /**
         * When mobile changes, adjust the active state
         * only when there has been a previous value
         */
        isMobile(val, prev) {
            !val &&
                this.isActive &&
                !this.temporary &&
                this.removeOverlay();
            if (prev == null ||
                this.resizeIsDisabled ||
                !this.reactsToMobile)
                return;
            this.isActive = !val;
            this.callUpdate();
        },
        permanent(val) {
            // If enabling prop enable the drawer
            if (val) {
                this.isActive = true;
            }
            this.callUpdate();
        },
        showOverlay(val) {
            if (val)
                this.genOverlay();
            else
                this.removeOverlay();
        },
        temporary() {
            this.callUpdate();
        },
        value(val) {
            if (this.permanent)
                return;
            // TODO: referring to this directly causes type errors
            // all over the place for some reason
            const _this = this;
            if (val == null)
                return _this.init();
            if (val !== this.isActive)
                this.isActive = val;
        }
    },
    beforeMount() {
        this.init();
    },
    methods: {
        calculateTouchArea() {
            if (!this.$el.parentNode)
                return;
            const parentRect = this.$el.parentNode.getBoundingClientRect();
            this.touchArea = {
                left: parentRect.left + 50,
                right: parentRect.right - 50
            };
        },
        closeConditional() {
            return this.isActive && this.reactsToClick;
        },
        genDirectives() {
            const directives = [{
                    name: 'click-outside',
                    value: () => (this.isActive = false),
                    args: {
                        closeConditional: this.closeConditional,
                        include: this.getOpenDependentElements
                    }
                }];
            !this.touchless && directives.push({
                name: 'touch',
                value: {
                    parent: true,
                    left: this.swipeLeft,
                    right: this.swipeRight
                }
            });
            return directives;
        },
        /**
         * Sets state before mount to avoid
         * entry transitions in SSR
         */
        init() {
            if (this.permanent) {
                this.isActive = true;
            }
            else if (this.stateless ||
                this.value != null) {
                this.isActive = this.value;
            }
            else if (!this.temporary) {
                this.isActive = !this.isMobile;
            }
        },
        swipeRight(e) {
            if (this.isActive && !this.right)
                return;
            this.calculateTouchArea();
            if (Math.abs(e.touchendX - e.touchstartX) < 100)
                return;
            if (!this.right &&
                e.touchstartX <= this.touchArea.left)
                this.isActive = true;
            else if (this.right && this.isActive)
                this.isActive = false;
        },
        swipeLeft(e) {
            if (this.isActive && this.right)
                return;
            this.calculateTouchArea();
            if (Math.abs(e.touchendX - e.touchstartX) < 100)
                return;
            if (this.right &&
                e.touchstartX >= this.touchArea.right)
                this.isActive = true;
            else if (!this.right && this.isActive)
                this.isActive = false;
        },
        /**
         * Update the application layout
         */
        updateApplication() {
            return !this.isActive ||
                this.temporary ||
                this.isMobile
                ? 0
                : this.calculatedWidth;
        }
    },
    render(h) {
        const data = {
            'class': this.classes,
            style: this.styles,
            directives: this.genDirectives(),
            on: {
                click: () => {
                    if (!this.miniVariant)
                        return;
                    this.$emit('update:miniVariant', false);
                },
                transitionend: (e) => {
                    if (e.target !== e.currentTarget)
                        return;
                    this.$emit('transitionend', e);
                    // IE11 does not support new Event('resize')
                    const resizeEvent = document.createEvent('UIEvents');
                    resizeEvent.initUIEvent('resize', true, false, window, 0);
                    window.dispatchEvent(resizeEvent);
                }
            }
        };
        return h('aside', data, [
            this.$slots.default,
            h('div', { 'class': 'v-navigation-drawer__border' })
        ]);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVk5hdmlnYXRpb25EcmF3ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WTmF2aWdhdGlvbkRyYXdlci9WTmF2aWdhdGlvbkRyYXdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxpREFBaUQsQ0FBQTtBQUV4RCxTQUFTO0FBQ1QsT0FBTyxlQUFlLE1BQU0sOEJBQThCLENBQUE7QUFDMUQsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxXQUFXLE1BQU0sMEJBQTBCLENBQUE7QUFDbEQsT0FBTyxXQUFXLE1BQU0sMkJBQTJCLENBQUE7QUFDbkQsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFFOUMsYUFBYTtBQUNiLE9BQU8sWUFBWSxNQUFNLGdDQUFnQyxDQUFBO0FBQ3pELE9BQU8sTUFBTSxNQUFNLHlCQUF5QixDQUFBO0FBQzVDLE9BQU8sS0FBdUIsTUFBTSx3QkFBd0IsQ0FBQTtBQUU1RCxZQUFZO0FBQ1osT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQ2xELE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBTXRDLGVBQWUsTUFBTSxDQUNuQixlQUFlLENBQUMsTUFBTSxFQUFFO0lBQ3RCLGFBQWE7SUFDYixPQUFPO0lBQ1AsT0FBTztDQUNSLENBQUMsRUFDRixTQUFTLEVBQ1QsV0FBVyxFQUNYLFdBQVcsRUFDWCxTQUFTO0FBQ1gsb0JBQW9CO0NBQ25CLENBQUMsTUFBTSxDQUFDO0lBQ1AsSUFBSSxFQUFFLHFCQUFxQjtJQUUzQixVQUFVLEVBQUU7UUFDVixZQUFZO1FBQ1osTUFBTTtRQUNOLEtBQUs7S0FDTjtJQUVELEtBQUssRUFBRTtRQUNMLE9BQU8sRUFBRSxPQUFPO1FBQ2hCLG1CQUFtQixFQUFFLE9BQU87UUFDNUIsb0JBQW9CLEVBQUUsT0FBTztRQUM3QixNQUFNLEVBQUU7WUFDTixJQUFJLEVB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V0FBVyxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQTtvQkFDekQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQTtnQkFDbkMsQ0FBQzthQUNGO1NBQ0YsQ0FBQTtRQUVELE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUU7WUFDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPO1lBQ25CLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsQ0FBQztTQUNyRCxDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU3R5bGVzXHJcbmltcG9ydCAnLi4vLi4vc3R5bHVzL2NvbXBvbmVudHMvX25hdmlnYXRpb24tZHJhd2VyLnN0eWwnXHJcblxyXG4vLyBNaXhpbnNcclxuaW1wb3J0IEFwcGxpY2F0aW9uYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvYXBwbGljYXRpb25hYmxlJ1xyXG5pbXBvcnQgRGVwZW5kZW50IGZyb20gJy4uLy4uL21peGlucy9kZXBlbmRlbnQnXHJcbmltcG9ydCBPdmVybGF5YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvb3ZlcmxheWFibGUnXHJcbmltcG9ydCBTU1JCb290YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvc3NyLWJvb3RhYmxlJ1xyXG5pbXBvcnQgVGhlbWVhYmxlIGZyb20gJy4uLy4uL21peGlucy90aGVtZWFibGUnXHJcblxyXG4vLyBEaXJlY3RpdmVzXHJcbmltcG9ydCBDbGlja091dHNpZGUgZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy9jbGljay1vdXRzaWRlJ1xyXG5pbXBvcnQgUmVzaXplIGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvcmVzaXplJ1xyXG5pbXBvcnQgVG91Y2gsIHsgVG91Y2hXcmFwcGVyIH0gZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy90b3VjaCdcclxuXHJcbi8vIFV0aWxpdGllc1xyXG5pbXBvcnQgeyBjb252ZXJ0VG9Vbml0IH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xyXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xyXG5cclxuLy8gVFlwZXNcclxuaW1wb3J0IHsgVk5vZGUgfSBmcm9tICd2dWUvdHlwZXMvdm5vZGUnXHJcbmltcG9ydCB7IFByb3BWYWxpZGF0b3IgfSBmcm9tICd2dWUvdHlwZXMvb3B0aW9ucydcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1peGlucyhcclxuICBBcHBsaWNhdGlvbmFibGUoJ2xlZnQnLCBbXHJcbiAgICAnbWluaVZhcmlhbnQnLFxyXG4gICAgJ3JpZ2h0JyxcclxuICAgICd3aWR0aCdcclxuICBdKSxcclxuICBEZXBlbmRlbnQsXHJcbiAgT3ZlcmxheWFibGUsXHJcbiAgU1NSQm9vdGFibGUsXHJcbiAgVGhlbWVhYmxlXHJcbi8qIEB2dWUvY29tcG9uZW50ICovXHJcbikuZXh0ZW5kKHtcclxuICBuYW1lOiAndi1uYXZpZ2F0aW9uLWRyYXdlcicsXHJcblxyXG4gIGRpcmVjdGl2ZXM6IHtcclxuICAgIENsaWNrT3V0c2lkZSxcclxuICAgIFJlc2l6ZSxcclxuICAgIFRvdWNoXHJcbiAgfSxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIGNsaXBwZWQ6IEJvb2xlYW4sXHJcbiAgICBkaXNhYmxlUm91dGVXYXRjaGVyOiBCb29sZWFuLFxyXG4gICAgZGlzYWJsZVJlc2l6ZVdhdGNoZXI6IEJvb2xlYW4sXHJcbiAgICBoZWlnaHQ6IHtcclxuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcclxuICAgICAgZGVmYXVsdDogJzEwMCUnXHJcbiAgICB9LFxyXG4gICAgZmxvYXRpbmc6IEJvb2xlYW4sXHJcbiAgICBtaW5pVmFyaWFudDogQm9vbGVhbixcclxuICAgIG1pbmlWYXJpYW50V2lkdGg6IHtcclxuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcclxuICAgICAgZGVmYXVsdDogODBcclxuICAgIH0sXHJcbiAgICBtb2JpbGVCcmVha1BvaW50OiB7XHJcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXHJcbiAgICAgIGRlZmF1bHQ6IDEyNjRcclxuICAgIH0sXHJcbiAgICBwZXJtYW5lbnQ6IEJvb2xlYW4sXHJcbiAgICByaWdodDogQm9vbGVhbixcclxuICAgIHN0YXRlbGVzczogQm9vbGVhbixcclxuICAgIHRlbXBvcmFyeTogQm9vbGVhbixcclxuICAgIHRvdWNobGVzczogQm9vbGVhbixcclxuICAgIHdpZHRoOiB7XHJcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXHJcbiAgICAgIGRlZmF1bHQ6IDMwMFxyXG4gICAgfSxcclxuICAgIHZhbHVlOiB7IHJlcXVpcmVkOiBmYWxzZSB9IGFzIFByb3BWYWxpZGF0b3I8YW55PlxyXG4gIH0sXHJcblxyXG4gIGRhdGE6ICgpID0+ICh7XHJcbiAgICBpc0FjdGl2ZTogZmFsc2UsXHJcbiAgICB0b3VjaEFyZWE6IHtcclxuICAgICAgbGVmdDogMCxcclxuICAgICAgcmlnaHQ6IDBcclxuICAgIH1cclxuICB9KSxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIC8qKlxyXG4gICAgICogVXNlZCBmb3Igc2V0dGluZyBhbiBhcHAgdmFsdWUgZnJvbSBhIGR5bmFtaWNcclxuICAgICAqIHByb3BlcnR5LiBDYWxsZWQgZnJvbSBhcHBsaWNhdGlvbmFibGUuanNcclxuICAgICAqL1xyXG4gICAgYXBwbGljYXRpb25Qcm9wZXJ0eSAoKTogc3RyaW5nIHtcclxuICAgICAgcmV0dXJuIHRoaXMucmlnaHQgPyAncmlnaHQnIDogJ2xlZnQnXHJcbiAgICB9LFxyXG4gICAgY2FsY3VsYXRlZFRyYW5zZm9ybSAoKTogbnVtYmVyIHtcclxuICAgICAgaWYgKHRoaXMuaXNBY3RpdmUpIHJldHVybiAwXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5yaWdodFxyXG4gICAgICAgID8gdGhpcy5jYWxjdWxhdGVkV2lkdGhcclxuICAgICAgICA6IC10aGlzLmNhbGN1bGF0ZWRXaWR0aFxyXG4gICAgfSxcclxuICAgIGNhbGN1bGF0ZWRXaWR0aCAoKTogbnVtYmVyIHtcclxuICAgICAgcmV0dXJuIHBhcnNlSW50KFxyXG4gICAgICAgIHRoaXMubWluaVZhcmlhbnRcclxuICAgICAgICAgID8gdGhpcy5taW5pVmFyaWFudFdpZHRoXHJcbiAgICAgICAgICA6IHRoaXMud2lkdGhcclxuICAgICAgKVxyXG4gICAgfSxcclxuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgJ3YtbmF2aWdhdGlvbi1kcmF3ZXInOiB0cnVlLFxyXG4gICAgICAgICd2LW5hdmlnYXRpb24tZHJhd2VyLS1hYnNvbHV0ZSc6IHRoaXMuYWJzb2x1dGUsXHJcbiAgICAgICAgJ3YtbmF2aWdhdGlvbi1kcmF3ZXItLWNsaXBwZWQnOiB0aGlzLmNsaXBwZWQsXHJcbiAgICAgICAgJ3YtbmF2aWdhdGlvbi1kcmF3ZXItLWNsb3NlJzogIXRoaXMuaXNBY3RpdmUsXHJcbiAgICAgICAgJ3YtbmF2aWdhdGlvbi1kcmF3ZXItLWZpeGVkJzogIXRoaXMuYWJzb2x1dGUgJiYgKHRoaXMuYXBwIHx8IHRoaXMuZml4ZWQpLFxyXG4gICAgICAgICd2LW5hdmlnYXRpb24tZHJhd2VyLS1mbG9hdGluZyc6IHRoaXMuZmxvYXRpbmcsXHJcbiAgICAgICAgJ3YtbmF2aWdhdGlvbi1kcmF3ZXItLWlzLW1vYmlsZSc6IHRoaXMuaXNNb2JpbGUsXHJcbiAgICAgICAgJ3YtbmF2aWdhdGlvbi1kcmF3ZXItLW1pbmktdmFyaWFudCc6IHRoaXMubWluaVZhcmlhbnQsXHJcbiAgICAgICAgJ3YtbmF2aWdhdGlvbi1kcmF3ZXItLW9wZW4nOiB0aGlzLmlzQWN0aXZlLFxyXG4gICAgICAgICd2LW5hdmlnYXRpb24tZHJhd2VyLS1yaWdodCc6IHRoaXMucmlnaHQsXHJcbiAgICAgICAgJ3YtbmF2aWdhdGlvbi1kcmF3ZXItLXRlbXBvcmFyeSc6IHRoaXMudGVtcG9yYXJ5LFxyXG4gICAgICAgIC4uLnRoaXMudGhlbWVDbGFzc2VzXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBoYXNBcHAgKCk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gdGhpcy5hcHAgJiZcclxuICAgICAgICAoIXRoaXMuaXNNb2JpbGUgJiYgIXRoaXMudGVtcG9yYXJ5KVxyXG4gICAgfSxcclxuICAgIGlzTW9iaWxlICgpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuICF0aGlzLnN0YXRlbGVzcyAmJlxyXG4gICAgICAgICF0aGlzLnBlcm1hbmVudCAmJlxyXG4gICAgICAgICF0aGlzLnRlbXBvcmFyeSAmJlxyXG4gICAgICAgIHRoaXMuJHZ1ZXRpZnkuYnJlYWtwb2ludC53aWR0aCA8IHBhcnNlSW50KHRoaXMubW9iaWxlQnJlYWtQb2ludCwgMTApXHJcbiAgICB9LFxyXG4gICAgbWFyZ2luVG9wICgpOiBudW1iZXIge1xyXG4gICAgICBpZiAoIXRoaXMuaGFzQXBwKSByZXR1cm4gMFxyXG5cclxuICAgICAgbGV0IG1hcmdpblRvcCA9IHRoaXMuJHZ1ZXRpZnkuYXBwbGljYXRpb24uYmFyXHJcblxyXG4gICAgICBtYXJnaW5Ub3AgKz0gdGhpcy5jbGlwcGVkXHJcbiAgICAgICAgPyB0aGlzLiR2dWV0aWZ5LmFwcGxpY2F0aW9uLnRvcFxyXG4gICAgICAgIDogMFxyXG5cclxuICAgICAgcmV0dXJuIG1hcmdpblRvcFxyXG4gICAgfSxcclxuICAgIG1heEhlaWdodCAoKTogbnVtYmVyIHwgbnVsbCB7XHJcbiAgICAgIGlmICghdGhpcy5oYXNBcHApIHJldHVybiBudWxsXHJcblxyXG4gICAgICBjb25zdCBtYXhIZWlnaHQgPSAoXHJcbiAgICAgICAgdGhpcy4kdnVldGlmeS5hcHBsaWNhdGlvbi5ib3R0b20gK1xyXG4gICAgICAgIHRoaXMuJHZ1ZXRpZnkuYXBwbGljYXRpb24uZm9vdGVyICtcclxuICAgICAgICB0aGlzLiR2dWV0aWZ5LmFwcGxpY2F0aW9uLmJhclxyXG4gICAgICApXHJcblxyXG4gICAgICBpZiAoIXRoaXMuY2xpcHBlZCkgcmV0dXJuIG1heEhlaWdodFxyXG5cclxuICAgICAgcmV0dXJuIG1heEhlaWdodCArIHRoaXMuJHZ1ZXRpZnkuYXBwbGljYXRpb24udG9wXHJcbiAgICB9LFxyXG4gICAgcmVhY3RzVG9DbGljayAoKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiAhdGhpcy5zdGF0ZWxlc3MgJiZcclxuICAgICAgICAhdGhpcy5wZXJtYW5lbnQgJiZcclxuICAgICAgICAodGhpcy5pc01vYmlsZSB8fCB0aGlzLnRlbXBvcmFyeSlcclxuICAgIH0sXHJcbiAgICByZWFjdHNUb01vYmlsZSAoKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiAhdGhpcy5kaXNhYmxlUmVzaXplV2F0Y2hlciAmJlxyXG4gICAgICAgICF0aGlzLnN0YXRlbGVzcyAmJlxyXG4gICAgICAgICF0aGlzLnBlcm1hbmVudCAmJlxyXG4gICAgICAgICF0aGlzLnRlbXBvcmFyeVxyXG4gICAgfSxcclxuICAgIHJlYWN0c1RvUm91dGUgKCk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gIXRoaXMuZGlzYWJsZVJvdXRlV2F0Y2hlciAmJlxyXG4gICAgICAgICF0aGlzLnN0YXRlbGVzcyAmJlxyXG4gICAgICAgICh0aGlzLnRlbXBvcmFyeSB8fCB0aGlzLmlzTW9iaWxlKVxyXG4gICAgfSxcclxuICAgIHJlc2l6ZUlzRGlzYWJsZWQgKCk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlUmVzaXplV2F0Y2hlciB8fCB0aGlzLnN0YXRlbGVzc1xyXG4gICAgfSxcclxuICAgIHNob3dPdmVybGF5ICgpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaXNBY3RpdmUgJiZcclxuICAgICAgICAodGhpcy5pc01vYmlsZSB8fCB0aGlzLnRlbXBvcmFyeSlcclxuICAgIH0sXHJcbiAgICBzdHlsZXMgKCk6IG9iamVjdCB7XHJcbiAgICAgIGNvbnN0IHN0eWxlcyA9IHtcclxuICAgICAgICBoZWlnaHQ6IGNvbnZlcnRUb1VuaXQodGhpcy5oZWlnaHQpLFxyXG4gICAgICAgIG1hcmdpblRvcDogYCR7dGhpcy5tYXJnaW5Ub3B9cHhgLFxyXG4gICAgICAgIG1heEhlaWdodDogdGhpcy5tYXhIZWlnaHQgIT0gbnVsbCA/IGBjYWxjKDEwMCUgLSAkeyt0aGlzLm1heEhlaWdodH1weClgIDogdW5kZWZpbmVkLFxyXG4gICAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZVgoJHt0aGlzLmNhbGN1bGF0ZWRUcmFuc2Zvcm19cHgpYCxcclxuICAgICAgICB3aWR0aDogYCR7dGhpcy5jYWxjdWxhdGVkV2lkdGh9cHhgXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBzdHlsZXNcclxuICAgIH1cclxuICB9LFxyXG5cclxuICB3YXRjaDoge1xyXG4gICAgJHJvdXRlICgpIHtcclxuICAgICAgaWYgKHRoaXMucmVhY3RzVG9Sb3V0ZSAmJiB0aGlzLmNsb3NlQ29uZGl0aW9uYWwoKSkge1xyXG4gICAgICAgIHRoaXMuaXNBY3RpdmUgPSBmYWxzZVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgaXNBY3RpdmUgKHZhbCkge1xyXG4gICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIHZhbClcclxuICAgICAgdGhpcy5jYWxsVXBkYXRlKClcclxuICAgIH0sXHJcbiAgICAvKipcclxuICAgICAqIFdoZW4gbW9iaWxlIGNoYW5nZXMsIGFkanVzdCB0aGUgYWN0aXZlIHN0YXRlXHJcbiAgICAgKiBvbmx5IHdoZW4gdGhlcmUgaGFzIGJlZW4gYSBwcmV2aW91cyB2YWx1ZVxyXG4gICAgICovXHJcbiAgICBpc01vYmlsZSAodmFsLCBwcmV2KSB7XHJcbiAgICAgICF2YWwgJiZcclxuICAgICAgICB0aGlzLmlzQWN0aXZlICYmXHJcbiAgICAgICAgIXRoaXMudGVtcG9yYXJ5ICYmXHJcbiAgICAgICAgdGhpcy5yZW1vdmVPdmVybGF5KClcclxuXHJcbiAgICAgIGlmIChwcmV2ID09IG51bGwgfHxcclxuICAgICAgICB0aGlzLnJlc2l6ZUlzRGlzYWJsZWQgfHxcclxuICAgICAgICAhdGhpcy5yZWFjdHNUb01vYmlsZVxyXG4gICAgICApIHJldHVyblxyXG5cclxuICAgICAgdGhpcy5pc0FjdGl2ZSA9ICF2YWxcclxuICAgICAgdGhpcy5jYWxsVXBkYXRlKClcclxuICAgIH0sXHJcbiAgICBwZXJtYW5lbnQgKHZhbCkge1xyXG4gICAgICAvLyBJZiBlbmFibGluZyBwcm9wIGVuYWJsZSB0aGUgZHJhd2VyXHJcbiAgICAgIGlmICh2YWwpIHtcclxuICAgICAgICB0aGlzLmlzQWN0aXZlID0gdHJ1ZVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuY2FsbFVwZGF0ZSgpXHJcbiAgICB9LFxyXG4gICAgc2hvd092ZXJsYXkgKHZhbCkge1xyXG4gICAgICBpZiAodmFsKSB0aGlzLmdlbk92ZXJsYXkoKVxyXG4gICAgICBlbHNlIHRoaXMucmVtb3ZlT3ZlcmxheSgpXHJcbiAgICB9LFxyXG4gICAgdGVtcG9yYXJ5ICgpIHtcclxuICAgICAgdGhpcy5jYWxsVXBkYXRlKClcclxuICAgIH0sXHJcbiAgICB2YWx1ZSAodmFsKSB7XHJcbiAgICAgIGlmICh0aGlzLnBlcm1hbmVudCkgcmV0dXJuXHJcblxyXG4gICAgICAvLyBUT0RPOiByZWZlcnJpbmcgdG8gdGhpcyBkaXJlY3RseSBjYXVzZXMgdHlwZSBlcnJvcnNcclxuICAgICAgLy8gYWxsIG92ZXIgdGhlIHBsYWNlIGZvciBzb21lIHJlYXNvblxyXG4gICAgICBjb25zdCBfdGhpcyA9IHRoaXMgYXMgYW55XHJcbiAgICAgIGlmICh2YWwgPT0gbnVsbCkgcmV0dXJuIF90aGlzLmluaXQoKVxyXG5cclxuICAgICAgaWYgKHZhbCAhPT0gdGhpcy5pc0FjdGl2ZSkgdGhpcy5pc0FjdGl2ZSA9IHZhbFxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGJlZm9yZU1vdW50ICgpIHtcclxuICAgIHRoaXMuaW5pdCgpXHJcbiAgfSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgY2FsY3VsYXRlVG91Y2hBcmVhICgpIHtcclxuICAgICAgaWYgKCF0aGlzLiRlbC5wYXJlbnROb2RlKSByZXR1cm5cclxuICAgICAgY29uc3QgcGFyZW50UmVjdCA9ICh0aGlzLiRlbC5wYXJlbnROb2RlIGFzIEVsZW1lbnQpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcblxyXG4gICAgICB0aGlzLnRvdWNoQXJlYSA9IHtcclxuICAgICAgICBsZWZ0OiBwYXJlbnRSZWN0LmxlZnQgKyA1MCxcclxuICAgICAgICByaWdodDogcGFyZW50UmVjdC5yaWdodCAtIDUwXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBjbG9zZUNvbmRpdGlvbmFsICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaXNBY3RpdmUgJiYgdGhpcy5yZWFjdHNUb0NsaWNrXHJcbiAgICB9LFxyXG4gICAgZ2VuRGlyZWN0aXZlcyAoKSB7XHJcbiAgICAgIGNvbnN0IGRpcmVjdGl2ZXMgPSBbe1xyXG4gICAgICAgIG5hbWU6ICdjbGljay1vdXRzaWRlJyxcclxuICAgICAgICB2YWx1ZTogKCkgPT4gKHRoaXMuaXNBY3RpdmUgPSBmYWxzZSksXHJcbiAgICAgICAgYXJnczoge1xyXG4gICAgICAgICAgY2xvc2VDb25kaXRpb25hbDogdGhpcy5jbG9zZUNvbmRpdGlvbmFsLFxyXG4gICAgICAgICAgaW5jbHVkZTogdGhpcy5nZXRPcGVuRGVwZW5kZW50RWxlbWVudHNcclxuICAgICAgICB9XHJcbiAgICAgIH1dXHJcblxyXG4gICAgICAhdGhpcy50b3VjaGxlc3MgJiYgZGlyZWN0aXZlcy5wdXNoKHtcclxuICAgICAgICBuYW1lOiAndG91Y2gnLFxyXG4gICAgICAgIHZhbHVlOiB7XHJcbiAgICAgICAgICBwYXJlbnQ6IHRydWUsXHJcbiAgICAgICAgICBsZWZ0OiB0aGlzLnN3aXBlTGVmdCxcclxuICAgICAgICAgIHJpZ2h0OiB0aGlzLnN3aXBlUmlnaHRcclxuICAgICAgICB9XHJcbiAgICAgIH0gYXMgYW55KVxyXG5cclxuICAgICAgcmV0dXJuIGRpcmVjdGl2ZXNcclxuICAgIH0sXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgc3RhdGUgYmVmb3JlIG1vdW50IHRvIGF2b2lkXHJcbiAgICAgKiBlbnRyeSB0cmFuc2l0aW9ucyBpbiBTU1JcclxuICAgICAqL1xyXG4gICAgaW5pdCAoKSB7XHJcbiAgICAgIGlmICh0aGlzLnBlcm1hbmVudCkge1xyXG4gICAgICAgIHRoaXMuaXNBY3RpdmUgPSB0cnVlXHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZWxlc3MgfHxcclxuICAgICAgICB0aGlzLnZhbHVlICE9IG51bGxcclxuICAgICAgKSB7XHJcbiAgICAgICAgdGhpcy5pc0FjdGl2ZSA9IHRoaXMudmFsdWVcclxuICAgICAgfSBlbHNlIGlmICghdGhpcy50ZW1wb3JhcnkpIHtcclxuICAgICAgICB0aGlzLmlzQWN0aXZlID0gIXRoaXMuaXNNb2JpbGVcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHN3aXBlUmlnaHQgKGU6IFRvdWNoV3JhcHBlcikge1xyXG4gICAgICBpZiAodGhpcy5pc0FjdGl2ZSAmJiAhdGhpcy5yaWdodCkgcmV0dXJuXHJcbiAgICAgIHRoaXMuY2FsY3VsYXRlVG91Y2hBcmVhKClcclxuXHJcbiAgICAgIGlmIChNYXRoLmFicyhlLnRvdWNoZW5kWCAtIGUudG91Y2hzdGFydFgpIDwgMTAwKSByZXR1cm5cclxuICAgICAgaWYgKCF0aGlzLnJpZ2h0ICYmXHJcbiAgICAgICAgZS50b3VjaHN0YXJ0WCA8PSB0aGlzLnRvdWNoQXJlYS5sZWZ0XHJcbiAgICAgICkgdGhpcy5pc0FjdGl2ZSA9IHRydWVcclxuICAgICAgZWxzZSBpZiAodGhpcy5yaWdodCAmJiB0aGlzLmlzQWN0aXZlKSB0aGlzLmlzQWN0aXZlID0gZmFsc2VcclxuICAgIH0sXHJcbiAgICBzd2lwZUxlZnQgKGU6IFRvdWNoV3JhcHBlcikge1xyXG4gICAgICBpZiAodGhpcy5pc0FjdGl2ZSAmJiB0aGlzLnJpZ2h0KSByZXR1cm5cclxuICAgICAgdGhpcy5jYWxjdWxhdGVUb3VjaEFyZWEoKVxyXG5cclxuICAgICAgaWYgKE1hdGguYWJzKGUudG91Y2hlbmRYIC0gZS50b3VjaHN0YXJ0WCkgPCAxMDApIHJldHVyblxyXG4gICAgICBpZiAodGhpcy5yaWdodCAmJlxyXG4gICAgICAgIGUudG91Y2hzdGFydFggPj0gdGhpcy50b3VjaEFyZWEucmlnaHRcclxuICAgICAgKSB0aGlzLmlzQWN0aXZlID0gdHJ1ZVxyXG4gICAgICBlbHNlIGlmICghdGhpcy5yaWdodCAmJiB0aGlzLmlzQWN0aXZlKSB0aGlzLmlzQWN0aXZlID0gZmFsc2VcclxuICAgIH0sXHJcbiAgICAvKipcclxuICAgICAqIFVwZGF0ZSB0aGUgYXBwbGljYXRpb24gbGF5b3V0XHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZUFwcGxpY2F0aW9uICgpIHtcclxuICAgICAgcmV0dXJuICF0aGlzLmlzQWN0aXZlIHx8XHJcbiAgICAgICAgdGhpcy50ZW1wb3JhcnkgfHxcclxuICAgICAgICB0aGlzLmlzTW9iaWxlXHJcbiAgICAgICAgPyAwXHJcbiAgICAgICAgOiB0aGlzLmNhbGN1bGF0ZWRXaWR0aFxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcclxuICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgICdjbGFzcyc6IHRoaXMuY2xhc3NlcyxcclxuICAgICAgc3R5bGU6IHRoaXMuc3R5bGVzLFxyXG4gICAgICBkaXJlY3RpdmVzOiB0aGlzLmdlbkRpcmVjdGl2ZXMoKSxcclxuICAgICAgb246IHtcclxuICAgICAgICBjbGljazogKCkgPT4ge1xyXG4gICAgICAgICAgaWYgKCF0aGlzLm1pbmlWYXJpYW50KSByZXR1cm5cclxuXHJcbiAgICAgICAgICB0aGlzLiRlbWl0KCd1cGRhdGU6bWluaVZhcmlhbnQnLCBmYWxzZSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRyYW5zaXRpb25lbmQ6IChlOiBFdmVudCkgPT4ge1xyXG4gICAgICAgICAgaWYgKGUudGFyZ2V0ICE9PSBlLmN1cnJlbnRUYXJnZXQpIHJldHVyblxyXG4gICAgICAgICAgdGhpcy4kZW1pdCgndHJhbnNpdGlvbmVuZCcsIGUpXHJcblxyXG4gICAgICAgICAgLy8gSUUxMSBkb2VzIG5vdCBzdXBwb3J0IG5ldyBFdmVudCgncmVzaXplJylcclxuICAgICAgICAgIGNvbnN0IHJlc2l6ZUV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ1VJRXZlbnRzJylcclxuICAgICAgICAgIHJlc2l6ZUV2ZW50LmluaXRVSUV2ZW50KCdyZXNpemUnLCB0cnVlLCBmYWxzZSwgd2luZG93LCAwKVxyXG4gICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQocmVzaXplRXZlbnQpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGgoJ2FzaWRlJywgZGF0YSwgW1xyXG4gICAgICB0aGlzLiRzbG90cy5kZWZhdWx0LFxyXG4gICAgICBoKCdkaXYnLCB7ICdjbGFzcyc6ICd2LW5hdmlnYXRpb24tZHJhd2VyX19ib3JkZXInIH0pXHJcbiAgICBdKVxyXG4gIH1cclxufSlcclxuIl19