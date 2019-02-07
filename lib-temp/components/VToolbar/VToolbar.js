// Styles
import '../../stylus/components/_toolbar.styl';
// Mixins
import Applicationable from '../../mixins/applicationable';
import Colorable from '../../mixins/colorable';
import Themeable from '../../mixins/themeable';
import SSRBootable from '../../mixins/ssr-bootable';
// Directives
import Scroll from '../../directives/scroll';
import { deprecate } from '../../util/console';
// Types
import mixins from '../../util/mixins';
export default mixins(Applicationable('top', [
    'clippedLeft',
    'clippedRight',
    'computedHeight',
    'invertedScroll',
    'manualScroll'
]), Colorable, SSRBootable, Themeable
/* @vue/component */
).extend({
    name: 'v-toolbar',
    directives: { Scroll },
    props: {
        card: Boolean,
        clippedLeft: Boolean,
        clippedRight: Boolean,
        dense: Boolean,
        extended: Boolean,
        extensionHeight: {
            type: [Number, String],
            validator: (v) => !isNaN(parseInt(v))
        },
        flat: Boolean,
        floating: Boolean,
        height: {
            type: [Number, String],
            validator: (v) => !isNaN(parseInt(v))
        },
        invertedScroll: Boolean,
        manualScroll: Boolean,
        prominent: Boolean,
        scrollOffScreen: Boolean,
        /* @deprecated */
        scrollToolbarOffScreen: Boolean,
        scrollTarget: String,
        scrollThreshold: {
            type: Number,
            default: 300
        },
        tabs: Boolean
    },
    data: () => ({
        activeTimeout: null,
        currentScroll: 0,
        heights: {
            mobileLandscape: 48,
            mobile: 56,
            desktop: 64,
            dense: 48
        },
        isActive: true,
        isExtended: false,
        isScrollingUp: false,
        previousScroll: 0,
        savedScroll: 0,
        target: null
    }),
    computed: {
        canScroll() {
            // TODO: remove
            if (this.scrollToolbarOffScreen) {
                deprecate('scrollToolbarOffScreen', 'scrollOffScreen', this);
                return true;
            }
            return this.scrollOffScreen || this.invertedScroll;
        },
        computedContentHeight() {
            if (this.height)
                return parseInt(this.height);
            if (this.dense)
                return this.heights.dense;
            if (this.prominent ||
                this.$vuetify.breakpoint.mdAndUp)
                return this.heights.desktop;
            if (this.$vuetify.breakpoint.smAndDown &&
                this.$vuetify.breakpoint.width >
                    this.$vuetify.breakpoint.height)
                return this.heights.mobileLandscape;
            return this.heights.mobile;
        },
        computedExtensionHeight() {
            if (this.tabs)
                return 48;
            if (this.extensionHeight)
                return parseInt(this.extensionHeight);
            return this.computedContentHeight;
        },
        computedHeight() {
            if (!this.isExtended)
                return this.computedContentHeight;
            return this.computedContentHeight + this.computedExtensionHeight;
        },
        computedMarginTop() {
            if (!this.app)
                return 0;
            return this.$vuetify.application.bar;
        },
        classes() {
            return {
                'v-toolbar': true,
                'elevation-0': this.flat || (!this.isActive &&
                    !this.tabs &&
                    this.canScroll),
                'v-toolbar--absolute': this.absolute,
                'v-toolbar--card': this.card,
                'v-toolbar--clipped': this.clippedLeft || this.clippedRight,
                'v-toolbar--dense': this.dense,
                'v-toolbar--extended': this.isExtended,
                'v-toolbar--fixed': !this.absolute && (this.app || this.fixed),
                'v-toolbar--floating': this.floating,
                'v-toolbar--prominent': this.prominent,
                ...this.themeClasses
            };
        },
        computedPaddingLeft() {
            if (!this.app || this.clippedLeft)
                return 0;
            return this.$vuetify.application.left;
        },
        computedPaddingRight() {
            if (!this.app || this.clippedRight)
                return 0;
            return this.$vuetify.application.right;
        },
        computedTransform() {
            return !this.isActive
                ? this.canScroll
                    ? -this.computedContentHeight
                    : -this.computedHeight
                : 0;
        },
        currentThreshold() {
            return Math.abs(this.currentScroll - this.savedScroll);
        },
        styles() {
            return {
                marginTop: `${this.computedMarginTop}px`,
                paddingRight: `${this.computedPaddingRight}px`,
                paddingLeft: `${this.computedPaddingLeft}px`,
                transform: `translateY(${this.computedTransform}px)`
            };
        }
    },
    watch: {
        currentThreshold(val) {
            if (this.invertedScroll) {
                this.isActive = this.currentScroll > this.scrollThreshold;
                return;
            }
            if (val < this.scrollThreshold ||
                !this.isBooted)
                return;
            this.isActive = this.isScrollingUp;
            this.savedScroll = this.currentScroll;
        },
        isActive() {
            this.savedScroll = 0;
        },
        invertedScroll(val) {
            this.isActive = !val;
        },
        manualScroll(val) {
            this.isActive = !val;
        },
        isScrollingUp() {
            this.savedScroll = this.savedScroll || this.currentScroll;
        }
    },
    created() {
        if (this.invertedScroll ||
            this.manualScroll)
            this.isActive = false;
    },
    mounted() {
        if (this.scrollTarget) {
            this.target = document.querySelector(this.scrollTarget);
        }
    },
    methods: {
        onScroll() {
            if (!this.canScroll ||
                this.manualScroll ||
                typeof window === 'undefined')
                return;
            this.currentScroll = this.target
                ? this.target.scrollTop
                : window.pageYOffset;
            this.isScrollingUp = this.currentScroll < this.previousScroll;
            this.previousScroll = this.currentScroll;
        },
        updateApplication() {
            return this.invertedScroll || this.manualScroll
                ? 0
                : this.computedHeight;
        }
    },
    render(h) {
        this.isExtended = this.extended || !!this.$slots.extension;
        const children = [];
        const data = this.setBackgroundColor(this.color, {
            'class': this.classes,
            style: this.styles,
            on: this.$listeners
        });
        data.directives = [{
                arg: this.scrollTarget,
                name: 'scroll',
                value: this.onScroll
            }];
        children.push(h('div', {
            staticClass: 'v-toolbar__content',
            style: { height: `${this.computedContentHeight}px` },
            ref: 'content'
        }, this.$slots.default));
        if (this.isExtended) {
            children.push(h('div', {
                staticClass: 'v-toolbar__extension',
                style: { height: `${this.computedExtensionHeight}px` }
            }, this.$slots.extension));
        }
        return h('nav', data, children);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlRvb2xiYXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WVG9vbGJhci9WVG9vbGJhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyx1Q0FBdUMsQ0FBQTtBQUU5QyxTQUFTO0FBQ1QsT0FBTyxlQUFlLE1BQU0sOEJBQThCLENBQUE7QUFDMUQsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxXQUFXLE1BQU0sMkJBQTJCLENBQUE7QUFFbkQsYUFBYTtBQUNiLE9BQU8sTUFBTSxNQUFNLHlCQUF5QixDQUFBO0FBQzVDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUU5QyxRQUFRO0FBQ1IsT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFHdEMsZUFBZSxNQUFNLENBQ25CLGVBQWUsQ0FBQyxLQUFLLEVBQUU7SUFDckIsYUFBYTtJQUNiLGNBQWM7SUFDZCxnQkFBZ0I7SUFDaEIsZ0JBQWdCO0lBQ2hCLGNBQWM7Q0FDZixDQUFDLEVBQ0YsU0FBUyxFQUNULFdBQVcsRUFDWCxTQUFTO0FBQ1gsb0JBQW9CO0NBQ25CLENBQUMsTUFBTSxDQUFDO0lBQ1AsSUFBSSxFQUFFLFdBQVc7SUFFakIsVUFBVSxFQUFFLEVBQUUsTUFBTSxFQUFFO0lBRXRCLEtBQUssRUFBRTtRQUNMLElBQUksRUFBRSxPQUFPO1FBQ2IsV0FBVyxFQUFFLE9BQU87UUFDcEIsWUFBWSxFQUFFLE9BQU87UUFDckIsS0FBSyxFQUFFLE9BQU87UUFDZCxRQUFRLEVBQUUsT0FBTztRQUNqQixlQUFlLEVBQUU7WUFDZixJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1lBQ3RCLFNBQVMsRUFBRSxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENB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UyxDQUFDLENBQUMsQ0FBQTtTQUMzQjtRQUVELE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUE7SUFDakMsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlc1xyXG5pbXBvcnQgJy4uLy4uL3N0eWx1cy9jb21wb25lbnRzL190b29sYmFyLnN0eWwnXHJcblxyXG4vLyBNaXhpbnNcclxuaW1wb3J0IEFwcGxpY2F0aW9uYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvYXBwbGljYXRpb25hYmxlJ1xyXG5pbXBvcnQgQ29sb3JhYmxlIGZyb20gJy4uLy4uL21peGlucy9jb2xvcmFibGUnXHJcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RoZW1lYWJsZSdcclxuaW1wb3J0IFNTUkJvb3RhYmxlIGZyb20gJy4uLy4uL21peGlucy9zc3ItYm9vdGFibGUnXHJcblxyXG4vLyBEaXJlY3RpdmVzXHJcbmltcG9ydCBTY3JvbGwgZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy9zY3JvbGwnXHJcbmltcG9ydCB7IGRlcHJlY2F0ZSB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcclxuXHJcbi8vIFR5cGVzXHJcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXHJcbmltcG9ydCB7IFZOb2RlIH0gZnJvbSAndnVlJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKFxyXG4gIEFwcGxpY2F0aW9uYWJsZSgndG9wJywgW1xyXG4gICAgJ2NsaXBwZWRMZWZ0JyxcclxuICAgICdjbGlwcGVkUmlnaHQnLFxyXG4gICAgJ2NvbXB1dGVkSGVpZ2h0JyxcclxuICAgICdpbnZlcnRlZFNjcm9sbCcsXHJcbiAgICAnbWFudWFsU2Nyb2xsJ1xyXG4gIF0pLFxyXG4gIENvbG9yYWJsZSxcclxuICBTU1JCb290YWJsZSxcclxuICBUaGVtZWFibGVcclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuKS5leHRlbmQoe1xyXG4gIG5hbWU6ICd2LXRvb2xiYXInLFxyXG5cclxuICBkaXJlY3RpdmVzOiB7IFNjcm9sbCB9LFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgY2FyZDogQm9vbGVhbixcclxuICAgIGNsaXBwZWRMZWZ0OiBCb29sZWFuLFxyXG4gICAgY2xpcHBlZFJpZ2h0OiBCb29sZWFuLFxyXG4gICAgZGVuc2U6IEJvb2xlYW4sXHJcbiAgICBleHRlbmRlZDogQm9vbGVhbixcclxuICAgIGV4dGVuc2lvbkhlaWdodDoge1xyXG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxyXG4gICAgICB2YWxpZGF0b3I6ICh2OiBhbnkpID0+ICFpc05hTihwYXJzZUludCh2KSlcclxuICAgIH0sXHJcbiAgICBmbGF0OiBCb29sZWFuLFxyXG4gICAgZmxvYXRpbmc6IEJvb2xlYW4sXHJcbiAgICBoZWlnaHQ6IHtcclxuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcclxuICAgICAgdmFsaWRhdG9yOiAodjogYW55KSA9PiAhaXNOYU4ocGFyc2VJbnQodikpXHJcbiAgICB9LFxyXG4gICAgaW52ZXJ0ZWRTY3JvbGw6IEJvb2xlYW4sXHJcbiAgICBtYW51YWxTY3JvbGw6IEJvb2xlYW4sXHJcbiAgICBwcm9taW5lbnQ6IEJvb2xlYW4sXHJcbiAgICBzY3JvbGxPZmZTY3JlZW46IEJvb2xlYW4sXHJcbiAgICAvKiBAZGVwcmVjYXRlZCAqL1xyXG4gICAgc2Nyb2xsVG9vbGJhck9mZlNjcmVlbjogQm9vbGVhbixcclxuICAgIHNjcm9sbFRhcmdldDogU3RyaW5nLFxyXG4gICAgc2Nyb2xsVGhyZXNob2xkOiB7XHJcbiAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgZGVmYXVsdDogMzAwXHJcbiAgICB9LFxyXG4gICAgdGFiczogQm9vbGVhblxyXG4gIH0sXHJcblxyXG4gIGRhdGE6ICgpID0+ICh7XHJcbiAgICBhY3RpdmVUaW1lb3V0OiBudWxsLFxyXG4gICAgY3VycmVudFNjcm9sbDogMCxcclxuICAgIGhlaWdodHM6IHtcclxuICAgICAgbW9iaWxlTGFuZHNjYXBlOiA0OCxcclxuICAgICAgbW9iaWxlOiA1NixcclxuICAgICAgZGVza3RvcDogNjQsXHJcbiAgICAgIGRlbnNlOiA0OFxyXG4gICAgfSxcclxuICAgIGlzQWN0aXZlOiB0cnVlLFxyXG4gICAgaXNFeHRlbmRlZDogZmFsc2UsXHJcbiAgICBpc1Njcm9sbGluZ1VwOiBmYWxzZSxcclxuICAgIHByZXZpb3VzU2Nyb2xsOiAwLFxyXG4gICAgc2F2ZWRTY3JvbGw6IDAsXHJcbiAgICB0YXJnZXQ6IG51bGwgYXMgRWxlbWVudCB8IG51bGxcclxuICB9KSxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIGNhblNjcm9sbCAoKTogYm9vbGVhbiB7XHJcbiAgICAgIC8vIFRPRE86IHJlbW92ZVxyXG4gICAgICBpZiAodGhpcy5zY3JvbGxUb29sYmFyT2ZmU2NyZWVuKSB7XHJcbiAgICAgICAgZGVwcmVjYXRlKCdzY3JvbGxUb29sYmFyT2ZmU2NyZWVuJywgJ3Njcm9sbE9mZlNjcmVlbicsIHRoaXMpXHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLnNjcm9sbE9mZlNjcmVlbiB8fCB0aGlzLmludmVydGVkU2Nyb2xsXHJcbiAgICB9LFxyXG4gICAgY29tcHV0ZWRDb250ZW50SGVpZ2h0ICgpOiBudW1iZXIge1xyXG4gICAgICBpZiAodGhpcy5oZWlnaHQpIHJldHVybiBwYXJzZUludCh0aGlzLmhlaWdodClcclxuICAgICAgaWYgKHRoaXMuZGVuc2UpIHJldHVybiB0aGlzLmhlaWdodHMuZGVuc2VcclxuXHJcbiAgICAgIGlmICh0aGlzLnByb21pbmVudCB8fFxyXG4gICAgICAgIHRoaXMuJHZ1ZXRpZnkuYnJlYWtwb2ludC5tZEFuZFVwXHJcbiAgICAgICkgcmV0dXJuIHRoaXMuaGVpZ2h0cy5kZXNrdG9wXHJcblxyXG4gICAgICBpZiAodGhpcy4kdnVldGlmeS5icmVha3BvaW50LnNtQW5kRG93biAmJlxyXG4gICAgICAgIHRoaXMuJHZ1ZXRpZnkuYnJlYWtwb2ludC53aWR0aCA+XHJcbiAgICAgICAgdGhpcy4kdnVldGlmeS5icmVha3BvaW50LmhlaWdodFxyXG4gICAgICApIHJldHVybiB0aGlzLmhlaWdodHMubW9iaWxlTGFuZHNjYXBlXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5oZWlnaHRzLm1vYmlsZVxyXG4gICAgfSxcclxuICAgIGNvbXB1dGVkRXh0ZW5zaW9uSGVpZ2h0ICgpOiBudW1iZXIge1xyXG4gICAgICBpZiAodGhpcy50YWJzKSByZXR1cm4gNDhcclxuICAgICAgaWYgKHRoaXMuZXh0ZW5zaW9uSGVpZ2h0KSByZXR1cm4gcGFyc2VJbnQodGhpcy5leHRlbnNpb25IZWlnaHQpXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5jb21wdXRlZENvbnRlbnRIZWlnaHRcclxuICAgIH0sXHJcbiAgICBjb21wdXRlZEhlaWdodCAoKTogbnVtYmVyIHtcclxuICAgICAgaWYgKCF0aGlzLmlzRXh0ZW5kZWQpIHJldHVybiB0aGlzLmNvbXB1dGVkQ29udGVudEhlaWdodFxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuY29tcHV0ZWRDb250ZW50SGVpZ2h0ICsgdGhpcy5jb21wdXRlZEV4dGVuc2lvbkhlaWdodFxyXG4gICAgfSxcclxuICAgIGNvbXB1dGVkTWFyZ2luVG9wICgpOiBudW1iZXIge1xyXG4gICAgICBpZiAoIXRoaXMuYXBwKSByZXR1cm4gMFxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuJHZ1ZXRpZnkuYXBwbGljYXRpb24uYmFyXHJcbiAgICB9LFxyXG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAndi10b29sYmFyJzogdHJ1ZSxcclxuICAgICAgICAnZWxldmF0aW9uLTAnOiB0aGlzLmZsYXQgfHwgKFxyXG4gICAgICAgICAgIXRoaXMuaXNBY3RpdmUgJiZcclxuICAgICAgICAgICF0aGlzLnRhYnMgJiZcclxuICAgICAgICAgIHRoaXMuY2FuU2Nyb2xsXHJcbiAgICAgICAgKSxcclxuICAgICAgICAndi10b29sYmFyLS1hYnNvbHV0ZSc6IHRoaXMuYWJzb2x1dGUsXHJcbiAgICAgICAgJ3YtdG9vbGJhci0tY2FyZCc6IHRoaXMuY2FyZCxcclxuICAgICAgICAndi10b29sYmFyLS1jbGlwcGVkJzogdGhpcy5jbGlwcGVkTGVmdCB8fCB0aGlzLmNsaXBwZWRSaWdodCxcclxuICAgICAgICAndi10b29sYmFyLS1kZW5zZSc6IHRoaXMuZGVuc2UsXHJcbiAgICAgICAgJ3YtdG9vbGJhci0tZXh0ZW5kZWQnOiB0aGlzLmlzRXh0ZW5kZWQsXHJcbiAgICAgICAgJ3YtdG9vbGJhci0tZml4ZWQnOiAhdGhpcy5hYnNvbHV0ZSAmJiAodGhpcy5hcHAgfHwgdGhpcy5maXhlZCksXHJcbiAgICAgICAgJ3YtdG9vbGJhci0tZmxvYXRpbmcnOiB0aGlzLmZsb2F0aW5nLFxyXG4gICAgICAgICd2LXRvb2xiYXItLXByb21pbmVudCc6IHRoaXMucHJvbWluZW50LFxyXG4gICAgICAgIC4uLnRoaXMudGhlbWVDbGFzc2VzXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBjb21wdXRlZFBhZGRpbmdMZWZ0ICgpOiBudW1iZXIge1xyXG4gICAgICBpZiAoIXRoaXMuYXBwIHx8IHRoaXMuY2xpcHBlZExlZnQpIHJldHVybiAwXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kdnVldGlmeS5hcHBsaWNhdGlvbi5sZWZ0XHJcbiAgICB9LFxyXG4gICAgY29tcHV0ZWRQYWRkaW5nUmlnaHQgKCk6IG51bWJlciB7XHJcbiAgICAgIGlmICghdGhpcy5hcHAgfHwgdGhpcy5jbGlwcGVkUmlnaHQpIHJldHVybiAwXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kdnVldGlmeS5hcHBsaWNhdGlvbi5yaWdodFxyXG4gICAgfSxcclxuICAgIGNvbXB1dGVkVHJhbnNmb3JtICgpOiBudW1iZXIge1xyXG4gICAgICByZXR1cm4gIXRoaXMuaXNBY3RpdmVcclxuICAgICAgICA/IHRoaXMuY2FuU2Nyb2xsXHJcbiAgICAgICAgICA/IC10aGlzLmNvbXB1dGVkQ29udGVudEhlaWdodFxyXG4gICAgICAgICAgOiAtdGhpcy5jb21wdXRlZEhlaWdodFxyXG4gICAgICAgIDogMFxyXG4gICAgfSxcclxuICAgIGN1cnJlbnRUaHJlc2hvbGQgKCk6IG51bWJlciB7XHJcbiAgICAgIHJldHVybiBNYXRoLmFicyh0aGlzLmN1cnJlbnRTY3JvbGwgLSB0aGlzLnNhdmVkU2Nyb2xsKVxyXG4gICAgfSxcclxuICAgIHN0eWxlcyAoKTogb2JqZWN0IHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBtYXJnaW5Ub3A6IGAke3RoaXMuY29tcHV0ZWRNYXJnaW5Ub3B9cHhgLFxyXG4gICAgICAgIHBhZGRpbmdSaWdodDogYCR7dGhpcy5jb21wdXRlZFBhZGRpbmdSaWdodH1weGAsXHJcbiAgICAgICAgcGFkZGluZ0xlZnQ6IGAke3RoaXMuY29tcHV0ZWRQYWRkaW5nTGVmdH1weGAsXHJcbiAgICAgICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlWSgke3RoaXMuY29tcHV0ZWRUcmFuc2Zvcm19cHgpYFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgd2F0Y2g6IHtcclxuICAgIGN1cnJlbnRUaHJlc2hvbGQgKHZhbDogbnVtYmVyKSB7XHJcbiAgICAgIGlmICh0aGlzLmludmVydGVkU2Nyb2xsKSB7XHJcbiAgICAgICAgdGhpcy5pc0FjdGl2ZSA9IHRoaXMuY3VycmVudFNjcm9sbCA+IHRoaXMuc2Nyb2xsVGhyZXNob2xkXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh2YWwgPCB0aGlzLnNjcm9sbFRocmVzaG9sZCB8fFxyXG4gICAgICAgICF0aGlzLmlzQm9vdGVkXHJcbiAgICAgICkgcmV0dXJuXHJcblxyXG4gICAgICB0aGlzLmlzQWN0aXZlID0gdGhpcy5pc1Njcm9sbGluZ1VwXHJcbiAgICAgIHRoaXMuc2F2ZWRTY3JvbGwgPSB0aGlzLmN1cnJlbnRTY3JvbGxcclxuICAgIH0sXHJcbiAgICBpc0FjdGl2ZSAoKSB7XHJcbiAgICAgIHRoaXMuc2F2ZWRTY3JvbGwgPSAwXHJcbiAgICB9LFxyXG4gICAgaW52ZXJ0ZWRTY3JvbGwgKHZhbDogYm9vbGVhbikge1xyXG4gICAgICB0aGlzLmlzQWN0aXZlID0gIXZhbFxyXG4gICAgfSxcclxuICAgIG1hbnVhbFNjcm9sbCAodmFsOiBib29sZWFuKSB7XHJcbiAgICAgIHRoaXMuaXNBY3RpdmUgPSAhdmFsXHJcbiAgICB9LFxyXG4gICAgaXNTY3JvbGxpbmdVcCAoKSB7XHJcbiAgICAgIHRoaXMuc2F2ZWRTY3JvbGwgPSB0aGlzLnNhdmVkU2Nyb2xsIHx8IHRoaXMuY3VycmVudFNjcm9sbFxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGNyZWF0ZWQgKCkge1xyXG4gICAgaWYgKHRoaXMuaW52ZXJ0ZWRTY3JvbGwgfHxcclxuICAgICAgdGhpcy5tYW51YWxTY3JvbGxcclxuICAgICkgdGhpcy5pc0FjdGl2ZSA9IGZhbHNlXHJcbiAgfSxcclxuXHJcbiAgbW91bnRlZCAoKSB7XHJcbiAgICBpZiAodGhpcy5zY3JvbGxUYXJnZXQpIHtcclxuICAgICAgdGhpcy50YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuc2Nyb2xsVGFyZ2V0KVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIG1ldGhvZHM6IHtcclxuICAgIG9uU2Nyb2xsICgpIHtcclxuICAgICAgaWYgKCF0aGlzLmNhblNjcm9sbCB8fFxyXG4gICAgICAgIHRoaXMubWFudWFsU2Nyb2xsIHx8XHJcbiAgICAgICAgdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCdcclxuICAgICAgKSByZXR1cm5cclxuXHJcbiAgICAgIHRoaXMuY3VycmVudFNjcm9sbCA9IHRoaXMudGFyZ2V0XHJcbiAgICAgICAgPyB0aGlzLnRhcmdldC5zY3JvbGxUb3BcclxuICAgICAgICA6IHdpbmRvdy5wYWdlWU9mZnNldFxyXG5cclxuICAgICAgdGhpcy5pc1Njcm9sbGluZ1VwID0gdGhpcy5jdXJyZW50U2Nyb2xsIDwgdGhpcy5wcmV2aW91c1Njcm9sbFxyXG5cclxuICAgICAgdGhpcy5wcmV2aW91c1Njcm9sbCA9IHRoaXMuY3VycmVudFNjcm9sbFxyXG4gICAgfSxcclxuICAgIHVwZGF0ZUFwcGxpY2F0aW9uICgpOiBudW1iZXIge1xyXG4gICAgICByZXR1cm4gdGhpcy5pbnZlcnRlZFNjcm9sbCB8fCB0aGlzLm1hbnVhbFNjcm9sbFxyXG4gICAgICAgID8gMFxyXG4gICAgICAgIDogdGhpcy5jb21wdXRlZEhlaWdodFxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcclxuICAgIHRoaXMuaXNFeHRlbmRlZCA9IHRoaXMuZXh0ZW5kZWQgfHwgISF0aGlzLiRzbG90cy5leHRlbnNpb25cclxuXHJcbiAgICBjb25zdCBjaGlsZHJlbiA9IFtdXHJcbiAgICBjb25zdCBkYXRhID0gdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IodGhpcy5jb2xvciwge1xyXG4gICAgICAnY2xhc3MnOiB0aGlzLmNsYXNzZXMsXHJcbiAgICAgIHN0eWxlOiB0aGlzLnN0eWxlcyxcclxuICAgICAgb246IHRoaXMuJGxpc3RlbmVyc1xyXG4gICAgfSlcclxuXHJcbiAgICBkYXRhLmRpcmVjdGl2ZXMgPSBbe1xyXG4gICAgICBhcmc6IHRoaXMuc2Nyb2xsVGFyZ2V0LFxyXG4gICAgICBuYW1lOiAnc2Nyb2xsJyxcclxuICAgICAgdmFsdWU6IHRoaXMub25TY3JvbGxcclxuICAgIH1dXHJcblxyXG4gICAgY2hpbGRyZW4ucHVzaChoKCdkaXYnLCB7XHJcbiAgICAgIHN0YXRpY0NsYXNzOiAndi10b29sYmFyX19jb250ZW50JyxcclxuICAgICAgc3R5bGU6IHsgaGVpZ2h0OiBgJHt0aGlzLmNvbXB1dGVkQ29udGVudEhlaWdodH1weGAgfSxcclxuICAgICAgcmVmOiAnY29udGVudCdcclxuICAgIH0sIHRoaXMuJHNsb3RzLmRlZmF1bHQpKVxyXG5cclxuICAgIGlmICh0aGlzLmlzRXh0ZW5kZWQpIHtcclxuICAgICAgY2hpbGRyZW4ucHVzaChoKCdkaXYnLCB7XHJcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LXRvb2xiYXJfX2V4dGVuc2lvbicsXHJcbiAgICAgICAgc3R5bGU6IHsgaGVpZ2h0OiBgJHt0aGlzLmNvbXB1dGVkRXh0ZW5zaW9uSGVpZ2h0fXB4YCB9XHJcbiAgICAgIH0sIHRoaXMuJHNsb3RzLmV4dGVuc2lvbikpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGgoJ25hdicsIGRhdGEsIGNoaWxkcmVuKVxyXG4gIH1cclxufSlcclxuIl19