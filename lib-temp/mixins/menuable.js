import Vue from 'vue';
import Positionable from './positionable';
import Stackable from './stackable';
import { consoleError } from '../util/console';
/* eslint-disable object-property-newline */
const dimensions = {
    activator: {
        top: 0, left: 0,
        bottom: 0, right: 0,
        width: 0, height: 0,
        offsetTop: 0, scrollHeight: 0
    },
    content: {
        top: 0, left: 0,
        bottom: 0, right: 0,
        width: 0, height: 0,
        offsetTop: 0, scrollHeight: 0
    },
    hasWindow: false
};
/* eslint-enable object-property-newline */
/**
 * Menuable
 *
 * @mixin
 *
 * Used for fixed or absolutely positioning
 * elements within the DOM
 * Can calculate X and Y axis overflows
 * As well as be manually positioned
 */
/* @vue/component */
export default Vue.extend({
    name: 'menuable',
    mixins: [
        Positionable,
        Stackable
    ],
    props: {
        activator: {
            default: null,
            validator: val => {
                return ['string', 'object'].includes(typeof val);
            }
        },
        allowOverflow: Boolean,
        inputActivator: Boolean,
        light: Boolean,
        dark: Boolean,
        maxWidth: {
            type: [Number, String],
            default: 'auto'
        },
        minWidth: [Number, String],
        nudgeBottom: {
            type: [Number, String],
            default: 0
        },
        nudgeLeft: {
            type: [Number, String],
            default: 0
        },
        nudgeRight: {
            type: [Number, String],
            default: 0
        },
        nudgeTop: {
            type: [Number, String],
            default: 0
        },
        nudgeWidth: {
            type: [Number, String],
            default: 0
        },
        offsetOverflow: Boolean,
        positionX: {
            type: Number,
            default: null
        },
        positionY: {
            type: Number,
            default: null
        },
        zIndex: {
            type: [Number, String],
            default: null
        }
    },
    data: () => ({
        absoluteX: 0,
        absoluteY: 0,
        dimensions: Object.assign({}, dimensions),
        isContentActive: false,
        pageYOffset: 0,
        stackClass: 'v-menu__content--active',
        stackMinZIndex: 6
    }),
    computed: {
        computedLeft() {
            const a = this.dimensions.activator;
            const c = this.dimensions.content;
            const activatorLeft = (this.isAttached ? a.offsetLeft : a.left) || 0;
            const minWidth = Math.max(a.width, c.width);
            let left = 0;
            left += this.left ? activatorLeft - (minWidth - a.width) : activatorLeft;
            if (this.offsetX) {
                const maxWidth = isNaN(this.maxWidth)
                    ? a.width
                    : Math.min(a.width, this.maxWidth);
                left += this.left ? -maxWidth : a.width;
            }
            if (this.nudgeLeft)
                left -= parseInt(this.nudgeLeft);
            if (this.nudgeRight)
                left += parseInt(this.nudgeRight);
            return left;
        },
        computedTop() {
            const a = this.dimensions.activator;
            const c = this.dimensions.content;
            let top = 0;
            if (this.top)
                top += a.height - c.height;
            if (this.isAttached)
                top += a.offsetTop;
            else
                top += a.top + this.pageYOffset;
            if (this.offsetY)
                top += this.top ? -a.height : a.height;
            if (this.nudgeTop)
                top -= parseInt(this.nudgeTop);
            if (this.nudgeBottom)
                top += parseInt(this.nudgeBottom);
            return top;
        },
        hasActivator() {
            return !!this.$slots.activator || !!this.$scopedSlots.activator || this.activator || this.inputActivator;
        },
        isAttached() {
            return this.attach !== false;
        }
    },
    watch: {
        disabled(val) {
            val && this.callDeactivate();
        },
        isActive(val) {
            if (this.disabled)
                return;
            val ? this.callActivate() : this.callDeactivate();
        },
        positionX: 'updateDimensions',
        positionY: 'updateDimensions'
    },
    beforeMount() {
        this.checkForWindow();
    },
    methods: {
        absolutePosition() {
            return {
                offsetTop: 0,
                offsetLeft: 0,
                scrollHeight: 0,
                top: this.positionY || this.absoluteY,
                bottom: this.positionY || this.absoluteY,
                left: this.positionX || this.absoluteX,
                right: this.positionX || this.absoluteX,
                height: 0,
                width: 0
            };
        },
        activate() { },
        calcLeft() {
            return `${this.isAttached
                ? this.computedLeft
                : this.calcXOverflow(this.computedLeft)}px`;
        },
        calcTop() {
            return `${this.isAttached
                ? this.computedTop
                : this.calcYOverflow(this.computedTop)}px`;
        },
        calcXOverflow(left) {
            const parsedMaxWidth = isNaN(parseInt(this.maxWidth))
                ? 0
                : parseInt(this.maxWidth);
            const innerWidth = this.getInnerWidth();
            const maxWidth = Math.max(this.dimensions.content.width, parsedMaxWidth);
            const totalWidth = left + this.dimensions.activator.width;
            const availableWidth = totalWidth - innerWidth;
            if ((!this.left || this.right) && availableWidth > 0) {
                left = (innerWidth -
                    maxWidth -
                    (innerWidth > 600 ? 30 : 12) // Account for scrollbar
                );
            }
            if (left < 0)
                left = 12;
            return left + this.getOffsetLeft();
        },
        calcYOverflow(top) {
            const documentHeight = this.getInnerHeight();
            const toTop = this.pageYOffset + documentHeight;
            const activator = this.dimensions.activator;
            const contentHeight = this.dimensions.content.height;
            const totalHeight = top + contentHeight;
            const isOverflowing = toTop < totalHeight;
            // If overflowing bottom and offset
            // TODO: set 'bottom' position instead of 'top'
            if (isOverflowing &&
                this.offsetOverflow &&
                // If we don't have enough room to offset
                // the overflow, don't offset
                activator.top > contentHeight) {
                top = this.pageYOffset + (activator.top - contentHeight);
                // If overflowing bottom
            }
            else if (isOverflowing && !this.allowOverflow) {
                top = toTop - contentHeight - 12;
                // If overflowing top
            }
            else if (top < this.pageYOffset && !this.allowOverflow) {
                top = this.pageYOffset + 12;
            }
            return top < 12 ? 12 : top;
        },
        callActivate() {
            if (!this.hasWindow)
                return;
            this.activate();
        },
        callDeactivate() {
            this.isContentActive = false;
            this.deactivate();
        },
        checkForWindow() {
            if (!this.hasWindow) {
                this.hasWindow = typeof window !== 'undefined';
            }
        },
        checkForPageYOffset() {
            if (this.hasWindow) {
                this.pageYOffset = this.getOffsetTop();
            }
        },
        deactivate() { },
        getActivator(e) {
            if (this.inputActivator) {
                return this.$el.querySelector('.v-input__slot');
            }
            if (this.activator) {
                return typeof this.activator === 'string'
                    ? document.querySelector(this.activator)
                    : this.activator;
            }
            if (this.$refs.activator) {
                return this.$refs.activator.children.length > 0
                    ? this.$refs.activator.children[0]
                    : this.$refs.activator;
            }
            if (e) {
                this.activatedBy = e.currentTarget || e.target;
                return this.activatedBy;
            }
            if (this.activatedBy)
                return this.activatedBy;
            consoleError('No activator found');
        },
        getInnerHeight() {
            if (!this.hasWindow)
                return 0;
            return window.innerHeight ||
                document.documentElement.clientHeight;
        },
        getInnerWidth() {
            if (!this.hasWindow)
                return 0;
            return window.innerWidth;
        },
        getOffsetLeft() {
            if (!this.hasWindow)
                return 0;
            return window.pageXOffset ||
                document.documentElement.scrollLeft;
        },
        getOffsetTop() {
            if (!this.hasWindow)
                return 0;
            return window.pageYOffset ||
                document.documentElement.scrollTop;
        },
        getRoundedBoundedClientRect(el) {
            const rect = el.getBoundingClientRect();
            return {
                top: Math.round(rect.top),
                left: Math.round(rect.left),
                bottom: Math.round(rect.bottom),
                right: Math.round(rect.right),
                width: Math.round(rect.width),
                height: Math.round(rect.height)
            };
        },
        measure(el) {
            if (!el || !this.hasWindow)
                return null;
            const rect = this.getRoundedBoundedClientRect(el);
            // Account for activator margin
            if (this.isAttached) {
                const style = window.getComputedStyle(el);
                rect.left = parseInt(style.marginLeft);
                rect.top = parseInt(style.marginTop);
            }
            return rect;
        },
        sneakPeek(cb) {
            requestAnimationFrame(() => {
                const el = this.$refs.content;
                if (!el || this.isShown(el))
                    return cb();
                el.style.display = 'inline-block';
                cb();
                el.style.display = 'none';
            });
        },
        startTransition() {
            return new Promise(resolve => requestAnimationFrame(() => {
                this.isContentActive = this.hasJustFocused = this.isActive;
                resolve();
            }));
        },
        isShown(el) {
            return el.style.display !== 'none';
        },
        updateDimensions() {
            this.checkForWindow();
            this.checkForPageYOffset();
            const dimensions = {};
            // Activator should already be shown
            if (!this.hasActivator || this.absolute) {
                dimensions.activator = this.absolutePosition();
            }
            else {
                const activator = this.getActivator();
                dimensions.activator = this.measure(activator);
                dimensions.activator.offsetLeft = activator.offsetLeft;
                if (this.isAttached) {
                    // account for css padding causing things to not line up
                    // this is mostly for v-autocomplete, hopefully it won't break anything
                    dimensions.activator.offsetTop = activator.offsetTop;
                }
                else {
                    dimensions.activator.offsetTop = 0;
                }
            }
            // Display and hide to get dimensions
            this.sneakPeek(() => {
                dimensions.content = this.measure(this.$refs.content);
                this.dimensions = dimensions;
            });
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudWFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWl4aW5zL21lbnVhYmxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sR0FBRyxNQUFNLEtBQUssQ0FBQTtBQUVyQixPQUFPLFlBQVksTUFBTSxnQkFBZ0IsQ0FBQTtBQUV6QyxPQUFPLFNBQVMsTUFBTSxhQUFhLENBQUE7QUFDbkMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFBO0FBRTlDLDRDQUE0QztBQUM1QyxNQUFNLFVBQVUsR0FBRztJQUNqQixTQUFTLEVBQUU7UUFDVCxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDO1FBQ2YsTUFBTSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQztRQUNuQixLQUFLLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDO1FBQ25CLFNBQVMsRUFBRSxDQUFDLEVBQUUsWUFBWSxFQUFFLENBQUM7S0FDOUI7SUFDRCxPQUFPLEVBQUU7UUFDUCxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDO1FBQ2YsTUFBTSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQztRQUNuQixLQUFLLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDO1FBQ25CLFNBQVMsRUFBRSxDQUFDLEVBQUUsWUFBWSxFQUFFLENBQUM7S0FDOUI7SUFDRCxTQUFTLEVBQUUsS0FBSztDQUNqQixDQUFBO0FBQ0QsMkNBQTJDO0FBRTNDOzs7Ozs7Ozs7R0FTRztBQUNILG9CQUFvQjtBQUNwQixlQUFlLEdBQUcsQ0FBQyxNQUFNLENBQUM7SUFDeEIsSUFBSSxFQUFFLFVBQVU7SUFFaEIsTUFBTSxFQUFFO1FBQ04sWUFBWTtRQUNaLFNBQVM7S0FDVjtJQUVELEtBQUssRUFBRTtRQUNMLFNBQVMsRUFBRTtZQUNULE9BQU8sRUFBRSxJQUFJO1lBQ2IsU0FBUyxFQUFFLEdBQUcsQ0FBQyxFQUFF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QUFJLENBQUMsWUFBWSxFQUFFLENBQUE7Z0JBQ3JDLFVBQVUsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQTtnQkFDOUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDLFVBQVUsQ0FBQTtnQkFDdEQsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO29CQUNuQix3REFBd0Q7b0JBQ3hELHVFQUF1RTtvQkFDdkUsVUFBVSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQTtpQkFDckQ7cUJBQU07b0JBQ0wsVUFBVSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFBO2lCQUNuQzthQUNGO1lBRUQscUNBQXFDO1lBQ3JDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO2dCQUNsQixVQUFVLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtnQkFFckQsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUE7WUFDOUIsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVnVlIGZyb20gJ3Z1ZSdcclxuXHJcbmltcG9ydCBQb3NpdGlvbmFibGUgZnJvbSAnLi9wb3NpdGlvbmFibGUnXHJcblxyXG5pbXBvcnQgU3RhY2thYmxlIGZyb20gJy4vc3RhY2thYmxlJ1xyXG5pbXBvcnQgeyBjb25zb2xlRXJyb3IgfSBmcm9tICcuLi91dGlsL2NvbnNvbGUnXHJcblxyXG4vKiBlc2xpbnQtZGlzYWJsZSBvYmplY3QtcHJvcGVydHktbmV3bGluZSAqL1xyXG5jb25zdCBkaW1lbnNpb25zID0ge1xyXG4gIGFjdGl2YXRvcjoge1xyXG4gICAgdG9wOiAwLCBsZWZ0OiAwLFxyXG4gICAgYm90dG9tOiAwLCByaWdodDogMCxcclxuICAgIHdpZHRoOiAwLCBoZWlnaHQ6IDAsXHJcbiAgICBvZmZzZXRUb3A6IDAsIHNjcm9sbEhlaWdodDogMFxyXG4gIH0sXHJcbiAgY29udGVudDoge1xyXG4gICAgdG9wOiAwLCBsZWZ0OiAwLFxyXG4gICAgYm90dG9tOiAwLCByaWdodDogMCxcclxuICAgIHdpZHRoOiAwLCBoZWlnaHQ6IDAsXHJcbiAgICBvZmZzZXRUb3A6IDAsIHNjcm9sbEhlaWdodDogMFxyXG4gIH0sXHJcbiAgaGFzV2luZG93OiBmYWxzZVxyXG59XHJcbi8qIGVzbGludC1lbmFibGUgb2JqZWN0LXByb3BlcnR5LW5ld2xpbmUgKi9cclxuXHJcbi8qKlxyXG4gKiBNZW51YWJsZVxyXG4gKlxyXG4gKiBAbWl4aW5cclxuICpcclxuICogVXNlZCBmb3IgZml4ZWQgb3IgYWJzb2x1dGVseSBwb3NpdGlvbmluZ1xyXG4gKiBlbGVtZW50cyB3aXRoaW4gdGhlIERPTVxyXG4gKiBDYW4gY2FsY3VsYXRlIFggYW5kIFkgYXhpcyBvdmVyZmxvd3NcclxuICogQXMgd2VsbCBhcyBiZSBtYW51YWxseSBwb3NpdGlvbmVkXHJcbiAqL1xyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG5leHBvcnQgZGVmYXVsdCBWdWUuZXh0ZW5kKHtcclxuICBuYW1lOiAnbWVudWFibGUnLFxyXG5cclxuICBtaXhpbnM6IFtcclxuICAgIFBvc2l0aW9uYWJsZSxcclxuICAgIFN0YWNrYWJsZVxyXG4gIF0sXHJcblxyXG4gIHByb3BzOiB7XHJcbiAgICBhY3RpdmF0b3I6IHtcclxuICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgdmFsaWRhdG9yOiB2YWwgPT4ge1xyXG4gICAgICAgIHJldHVybiBbJ3N0cmluZycsICdvYmplY3QnXS5pbmNsdWRlcyh0eXBlb2YgdmFsKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgYWxsb3dPdmVyZmxvdzogQm9vbGVhbixcclxuICAgIGlucHV0QWN0aXZhdG9yOiBCb29sZWFuLFxyXG4gICAgbGlnaHQ6IEJvb2xlYW4sXHJcbiAgICBkYXJrOiBCb29sZWFuLFxyXG4gICAgbWF4V2lkdGg6IHtcclxuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcclxuICAgICAgZGVmYXVsdDogJ2F1dG8nXHJcbiAgICB9LFxyXG4gICAgbWluV2lkdGg6IFtOdW1iZXIsIFN0cmluZ10sXHJcbiAgICBudWRnZUJvdHRvbToge1xyXG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxyXG4gICAgICBkZWZhdWx0OiAwXHJcbiAgICB9LFxyXG4gICAgbnVkZ2VMZWZ0OiB7XHJcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXHJcbiAgICAgIGRlZmF1bHQ6IDBcclxuICAgIH0sXHJcbiAgICBudWRnZVJpZ2h0OiB7XHJcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXHJcbiAgICAgIGRlZmF1bHQ6IDBcclxuICAgIH0sXHJcbiAgICBudWRnZVRvcDoge1xyXG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxyXG4gICAgICBkZWZhdWx0OiAwXHJcbiAgICB9LFxyXG4gICAgbnVkZ2VXaWR0aDoge1xyXG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxyXG4gICAgICBkZWZhdWx0OiAwXHJcbiAgICB9LFxyXG4gICAgb2Zmc2V0T3ZlcmZsb3c6IEJvb2xlYW4sXHJcbiAgICBwb3NpdGlvblg6IHtcclxuICAgICAgdHlwZTogTnVtYmVyLFxyXG4gICAgICBkZWZhdWx0OiBudWxsXHJcbiAgICB9LFxyXG4gICAgcG9zaXRpb25ZOiB7XHJcbiAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgZGVmYXVsdDogbnVsbFxyXG4gICAgfSxcclxuICAgIHpJbmRleDoge1xyXG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxyXG4gICAgICBkZWZhdWx0OiBudWxsXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZGF0YTogKCkgPT4gKHtcclxuICAgIGFic29sdXRlWDogMCxcclxuICAgIGFic29sdXRlWTogMCxcclxuICAgIGRpbWVuc2lvbnM6IE9iamVjdC5hc3NpZ24oe30sIGRpbWVuc2lvbnMpLFxyXG4gICAgaXNDb250ZW50QWN0aXZlOiBmYWxzZSxcclxuICAgIHBhZ2VZT2Zmc2V0OiAwLFxyXG4gICAgc3RhY2tDbGFzczogJ3YtbWVudV9fY29udGVudC0tYWN0aXZlJyxcclxuICAgIHN0YWNrTWluWkluZGV4OiA2XHJcbiAgfSksXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICBjb21wdXRlZExlZnQgKCkge1xyXG4gICAgICBjb25zdCBhID0gdGhpcy5kaW1lbnNpb25zLmFjdGl2YXRvclxyXG4gICAgICBjb25zdCBjID0gdGhpcy5kaW1lbnNpb25zLmNvbnRlbnRcclxuICAgICAgY29uc3QgYWN0aXZhdG9yTGVmdCA9ICh0aGlzLmlzQXR0YWNoZWQgPyBhLm9mZnNldExlZnQgOiBhLmxlZnQpIHx8IDBcclxuICAgICAgY29uc3QgbWluV2lkdGggPSBNYXRoLm1heChhLndpZHRoLCBjLndpZHRoKVxyXG4gICAgICBsZXQgbGVmdCA9IDBcclxuICAgICAgbGVmdCArPSB0aGlzLmxlZnQgPyBhY3RpdmF0b3JMZWZ0IC0gKG1pbldpZHRoIC0gYS53aWR0aCkgOiBhY3RpdmF0b3JMZWZ0XHJcbiAgICAgIGlmICh0aGlzLm9mZnNldFgpIHtcclxuICAgICAgICBjb25zdCBtYXhXaWR0aCA9IGlzTmFOKHRoaXMubWF4V2lkdGgpXHJcbiAgICAgICAgICA/IGEud2lkdGhcclxuICAgICAgICAgIDogTWF0aC5taW4oYS53aWR0aCwgdGhpcy5tYXhXaWR0aClcclxuXHJcbiAgICAgICAgbGVmdCArPSB0aGlzLmxlZnQgPyAtbWF4V2lkdGggOiBhLndpZHRoXHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMubnVkZ2VMZWZ0KSBsZWZ0IC09IHBhcnNlSW50KHRoaXMubnVkZ2VMZWZ0KVxyXG4gICAgICBpZiAodGhpcy5udWRnZVJpZ2h0KSBsZWZ0ICs9IHBhcnNlSW50KHRoaXMubnVkZ2VSaWdodClcclxuXHJcbiAgICAgIHJldHVybiBsZWZ0XHJcbiAgICB9LFxyXG4gICAgY29tcHV0ZWRUb3AgKCkge1xyXG4gICAgICBjb25zdCBhID0gdGhpcy5kaW1lbnNpb25zLmFjdGl2YXRvclxyXG4gICAgICBjb25zdCBjID0gdGhpcy5kaW1lbnNpb25zLmNvbnRlbnRcclxuICAgICAgbGV0IHRvcCA9IDBcclxuXHJcbiAgICAgIGlmICh0aGlzLnRvcCkgdG9wICs9IGEuaGVpZ2h0IC0gYy5oZWlnaHRcclxuICAgICAgaWYgKHRoaXMuaXNBdHRhY2hlZCkgdG9wICs9IGEub2Zmc2V0VG9wXHJcbiAgICAgIGVsc2UgdG9wICs9IGEudG9wICsgdGhpcy5wYWdlWU9mZnNldFxyXG4gICAgICBpZiAodGhpcy5vZmZzZXRZKSB0b3AgKz0gdGhpcy50b3AgPyAtYS5oZWlnaHQgOiBhLmhlaWdodFxyXG4gICAgICBpZiAodGhpcy5udWRnZVRvcCkgdG9wIC09IHBhcnNlSW50KHRoaXMubnVkZ2VUb3ApXHJcbiAgICAgIGlmICh0aGlzLm51ZGdlQm90dG9tKSB0b3AgKz0gcGFyc2VJbnQodGhpcy5udWRnZUJvdHRvbSlcclxuXHJcbiAgICAgIHJldHVybiB0b3BcclxuICAgIH0sXHJcbiAgICBoYXNBY3RpdmF0b3IgKCkge1xyXG4gICAgICByZXR1cm4gISF0aGlzLiRzbG90cy5hY3RpdmF0b3IgfHwgISF0aGlzLiRzY29wZWRTbG90cy5hY3RpdmF0b3IgfHwgdGhpcy5hY3RpdmF0b3IgfHwgdGhpcy5pbnB1dEFjdGl2YXRvclxyXG4gICAgfSxcclxuICAgIGlzQXR0YWNoZWQgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5hdHRhY2ggIT09IGZhbHNlXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgd2F0Y2g6IHtcclxuICAgIGRpc2FibGVkICh2YWwpIHtcclxuICAgICAgdmFsICYmIHRoaXMuY2FsbERlYWN0aXZhdGUoKVxyXG4gICAgfSxcclxuICAgIGlzQWN0aXZlICh2YWwpIHtcclxuICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHJldHVyblxyXG5cclxuICAgICAgdmFsID8gdGhpcy5jYWxsQWN0aXZhdGUoKSA6IHRoaXMuY2FsbERlYWN0aXZhdGUoKVxyXG4gICAgfSxcclxuICAgIHBvc2l0aW9uWDogJ3VwZGF0ZURpbWVuc2lvbnMnLFxyXG4gICAgcG9zaXRpb25ZOiAndXBkYXRlRGltZW5zaW9ucydcclxuICB9LFxyXG5cclxuICBiZWZvcmVNb3VudCAoKSB7XHJcbiAgICB0aGlzLmNoZWNrRm9yV2luZG93KClcclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICBhYnNvbHV0ZVBvc2l0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBvZmZzZXRUb3A6IDAsXHJcbiAgICAgICAgb2Zmc2V0TGVmdDogMCxcclxuICAgICAgICBzY3JvbGxIZWlnaHQ6IDAsXHJcbiAgICAgICAgdG9wOiB0aGlzLnBvc2l0aW9uWSB8fCB0aGlzLmFic29sdXRlWSxcclxuICAgICAgICBib3R0b206IHRoaXMucG9zaXRpb25ZIHx8IHRoaXMuYWJzb2x1dGVZLFxyXG4gICAgICAgIGxlZnQ6IHRoaXMucG9zaXRpb25YIHx8IHRoaXMuYWJzb2x1dGVYLFxyXG4gICAgICAgIHJpZ2h0OiB0aGlzLnBvc2l0aW9uWCB8fCB0aGlzLmFic29sdXRlWCxcclxuICAgICAgICBoZWlnaHQ6IDAsXHJcbiAgICAgICAgd2lkdGg6IDBcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGFjdGl2YXRlICgpIHt9LFxyXG4gICAgY2FsY0xlZnQgKCkge1xyXG4gICAgICByZXR1cm4gYCR7dGhpcy5pc0F0dGFjaGVkXHJcbiAgICAgICAgPyB0aGlzLmNvbXB1dGVkTGVmdFxyXG4gICAgICAgIDogdGhpcy5jYWxjWE92ZXJmbG93KHRoaXMuY29tcHV0ZWRMZWZ0KVxyXG4gICAgICB9cHhgXHJcbiAgICB9LFxyXG4gICAgY2FsY1RvcCAoKSB7XHJcbiAgICAgIHJldHVybiBgJHt0aGlzLmlzQXR0YWNoZWRcclxuICAgICAgICA/IHRoaXMuY29tcHV0ZWRUb3BcclxuICAgICAgICA6IHRoaXMuY2FsY1lPdmVyZmxvdyh0aGlzLmNvbXB1dGVkVG9wKVxyXG4gICAgICB9cHhgXHJcbiAgICB9LFxyXG4gICAgY2FsY1hPdmVyZmxvdyAobGVmdCkge1xyXG4gICAgICBjb25zdCBwYXJzZWRNYXhXaWR0aCA9IGlzTmFOKHBhcnNlSW50KHRoaXMubWF4V2lkdGgpKVxyXG4gICAgICAgID8gMFxyXG4gICAgICAgIDogcGFyc2VJbnQodGhpcy5tYXhXaWR0aClcclxuICAgICAgY29uc3QgaW5uZXJXaWR0aCA9IHRoaXMuZ2V0SW5uZXJXaWR0aCgpXHJcbiAgICAgIGNvbnN0IG1heFdpZHRoID0gTWF0aC5tYXgoXHJcbiAgICAgICAgdGhpcy5kaW1lbnNpb25zLmNvbnRlbnQud2lkdGgsXHJcbiAgICAgICAgcGFyc2VkTWF4V2lkdGhcclxuICAgICAgKVxyXG4gICAgICBjb25zdCB0b3RhbFdpZHRoID0gbGVmdCArIHRoaXMuZGltZW5zaW9ucy5hY3RpdmF0b3Iud2lkdGhcclxuICAgICAgY29uc3QgYXZhaWxhYmxlV2lkdGggPSB0b3RhbFdpZHRoIC0gaW5uZXJXaWR0aFxyXG5cclxuICAgICAgaWYgKCghdGhpcy5sZWZ0IHx8IHRoaXMucmlnaHQpICYmIGF2YWlsYWJsZVdpZHRoID4gMCkge1xyXG4gICAgICAgIGxlZnQgPSAoXHJcbiAgICAgICAgICBpbm5lcldpZHRoIC1cclxuICAgICAgICAgIG1heFdpZHRoIC1cclxuICAgICAgICAgIChpbm5lcldpZHRoID4gNjAwID8gMzAgOiAxMikgLy8gQWNjb3VudCBmb3Igc2Nyb2xsYmFyXHJcbiAgICAgICAgKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAobGVmdCA8IDApIGxlZnQgPSAxMlxyXG5cclxuICAgICAgcmV0dXJuIGxlZnQgKyB0aGlzLmdldE9mZnNldExlZnQoKVxyXG4gICAgfSxcclxuICAgIGNhbGNZT3ZlcmZsb3cgKHRvcCkge1xyXG4gICAgICBjb25zdCBkb2N1bWVudEhlaWdodCA9IHRoaXMuZ2V0SW5uZXJIZWlnaHQoKVxyXG4gICAgICBjb25zdCB0b1RvcCA9IHRoaXMucGFnZVlPZmZzZXQgKyBkb2N1bWVudEhlaWdodFxyXG4gICAgICBjb25zdCBhY3RpdmF0b3IgPSB0aGlzLmRpbWVuc2lvbnMuYWN0aXZhdG9yXHJcbiAgICAgIGNvbnN0IGNvbnRlbnRIZWlnaHQgPSB0aGlzLmRpbWVuc2lvbnMuY29udGVudC5oZWlnaHRcclxuICAgICAgY29uc3QgdG90YWxIZWlnaHQgPSB0b3AgKyBjb250ZW50SGVpZ2h0XHJcbiAgICAgIGNvbnN0IGlzT3ZlcmZsb3dpbmcgPSB0b1RvcCA8IHRvdGFsSGVpZ2h0XHJcblxyXG4gICAgICAvLyBJZiBvdmVyZmxvd2luZyBib3R0b20gYW5kIG9mZnNldFxyXG4gICAgICAvLyBUT0RPOiBzZXQgJ2JvdHRvbScgcG9zaXRpb24gaW5zdGVhZCBvZiAndG9wJ1xyXG4gICAgICBpZiAoaXNPdmVyZmxvd2luZyAmJlxyXG4gICAgICAgIHRoaXMub2Zmc2V0T3ZlcmZsb3cgJiZcclxuICAgICAgICAvLyBJZiB3ZSBkb24ndCBoYXZlIGVub3VnaCByb29tIHRvIG9mZnNldFxyXG4gICAgICAgIC8vIHRoZSBvdmVyZmxvdywgZG9uJ3Qgb2Zmc2V0XHJcbiAgICAgICAgYWN0aXZhdG9yLnRvcCA+IGNvbnRlbnRIZWlnaHRcclxuICAgICAgKSB7XHJcbiAgICAgICAgdG9wID0gdGhpcy5wYWdlWU9mZnNldCArIChhY3RpdmF0b3IudG9wIC0gY29udGVudEhlaWdodClcclxuICAgICAgLy8gSWYgb3ZlcmZsb3dpbmcgYm90dG9tXHJcbiAgICAgIH0gZWxzZSBpZiAoaXNPdmVyZmxvd2luZyAmJiAhdGhpcy5hbGxvd092ZXJmbG93KSB7XHJcbiAgICAgICAgdG9wID0gdG9Ub3AgLSBjb250ZW50SGVpZ2h0IC0gMTJcclxuICAgICAgLy8gSWYgb3ZlcmZsb3dpbmcgdG9wXHJcbiAgICAgIH0gZWxzZSBpZiAodG9wIDwgdGhpcy5wYWdlWU9mZnNldCAmJiAhdGhpcy5hbGxvd092ZXJmbG93KSB7XHJcbiAgICAgICAgdG9wID0gdGhpcy5wYWdlWU9mZnNldCArIDEyXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0b3AgPCAxMiA/IDEyIDogdG9wXHJcbiAgICB9LFxyXG4gICAgY2FsbEFjdGl2YXRlICgpIHtcclxuICAgICAgaWYgKCF0aGlzLmhhc1dpbmRvdykgcmV0dXJuXHJcblxyXG4gICAgICB0aGlzLmFjdGl2YXRlKClcclxuICAgIH0sXHJcbiAgICBjYWxsRGVhY3RpdmF0ZSAoKSB7XHJcbiAgICAgIHRoaXMuaXNDb250ZW50QWN0aXZlID0gZmFsc2VcclxuXHJcbiAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpXHJcbiAgICB9LFxyXG4gICAgY2hlY2tGb3JXaW5kb3cgKCkge1xyXG4gICAgICBpZiAoIXRoaXMuaGFzV2luZG93KSB7XHJcbiAgICAgICAgdGhpcy5oYXNXaW5kb3cgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgY2hlY2tGb3JQYWdlWU9mZnNldCAoKSB7XHJcbiAgICAgIGlmICh0aGlzLmhhc1dpbmRvdykge1xyXG4gICAgICAgIHRoaXMucGFnZVlPZmZzZXQgPSB0aGlzLmdldE9mZnNldFRvcCgpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBkZWFjdGl2YXRlICgpIHt9LFxyXG4gICAgZ2V0QWN0aXZhdG9yIChlKSB7XHJcbiAgICAgIGlmICh0aGlzLmlucHV0QWN0aXZhdG9yKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJy52LWlucHV0X19zbG90JylcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMuYWN0aXZhdG9yKSB7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiB0aGlzLmFjdGl2YXRvciA9PT0gJ3N0cmluZydcclxuICAgICAgICAgID8gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLmFjdGl2YXRvcilcclxuICAgICAgICAgIDogdGhpcy5hY3RpdmF0b3JcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMuJHJlZnMuYWN0aXZhdG9yKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuJHJlZnMuYWN0aXZhdG9yLmNoaWxkcmVuLmxlbmd0aCA+IDBcclxuICAgICAgICAgID8gdGhpcy4kcmVmcy5hY3RpdmF0b3IuY2hpbGRyZW5bMF1cclxuICAgICAgICAgIDogdGhpcy4kcmVmcy5hY3RpdmF0b3JcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGUpIHtcclxuICAgICAgICB0aGlzLmFjdGl2YXRlZEJ5ID0gZS5jdXJyZW50VGFyZ2V0IHx8IGUudGFyZ2V0XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYWN0aXZhdGVkQnlcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMuYWN0aXZhdGVkQnkpIHJldHVybiB0aGlzLmFjdGl2YXRlZEJ5XHJcblxyXG4gICAgICBjb25zb2xlRXJyb3IoJ05vIGFjdGl2YXRvciBmb3VuZCcpXHJcbiAgICB9LFxyXG4gICAgZ2V0SW5uZXJIZWlnaHQgKCkge1xyXG4gICAgICBpZiAoIXRoaXMuaGFzV2luZG93KSByZXR1cm4gMFxyXG5cclxuICAgICAgcmV0dXJuIHdpbmRvdy5pbm5lckhlaWdodCB8fFxyXG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHRcclxuICAgIH0sXHJcbiAgICBnZXRJbm5lcldpZHRoICgpIHtcclxuICAgICAgaWYgKCF0aGlzLmhhc1dpbmRvdykgcmV0dXJuIDBcclxuXHJcbiAgICAgIHJldHVybiB3aW5kb3cuaW5uZXJXaWR0aFxyXG4gICAgfSxcclxuICAgIGdldE9mZnNldExlZnQgKCkge1xyXG4gICAgICBpZiAoIXRoaXMuaGFzV2luZG93KSByZXR1cm4gMFxyXG5cclxuICAgICAgcmV0dXJuIHdpbmRvdy5wYWdlWE9mZnNldCB8fFxyXG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0XHJcbiAgICB9LFxyXG4gICAgZ2V0T2Zmc2V0VG9wICgpIHtcclxuICAgICAgaWYgKCF0aGlzLmhhc1dpbmRvdykgcmV0dXJuIDBcclxuXHJcbiAgICAgIHJldHVybiB3aW5kb3cucGFnZVlPZmZzZXQgfHxcclxuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wXHJcbiAgICB9LFxyXG4gICAgZ2V0Um91bmRlZEJvdW5kZWRDbGllbnRSZWN0IChlbCkge1xyXG4gICAgICBjb25zdCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0b3A6IE1hdGgucm91bmQocmVjdC50b3ApLFxyXG4gICAgICAgIGxlZnQ6IE1hdGgucm91bmQocmVjdC5sZWZ0KSxcclxuICAgICAgICBib3R0b206IE1hdGgucm91bmQocmVjdC5ib3R0b20pLFxyXG4gICAgICAgIHJpZ2h0OiBNYXRoLnJvdW5kKHJlY3QucmlnaHQpLFxyXG4gICAgICAgIHdpZHRoOiBNYXRoLnJvdW5kKHJlY3Qud2lkdGgpLFxyXG4gICAgICAgIGhlaWdodDogTWF0aC5yb3VuZChyZWN0LmhlaWdodClcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIG1lYXN1cmUgKGVsKSB7XHJcbiAgICAgIGlmICghZWwgfHwgIXRoaXMuaGFzV2luZG93KSByZXR1cm4gbnVsbFxyXG5cclxuICAgICAgY29uc3QgcmVjdCA9IHRoaXMuZ2V0Um91bmRlZEJvdW5kZWRDbGllbnRSZWN0KGVsKVxyXG5cclxuICAgICAgLy8gQWNjb3VudCBmb3IgYWN0aXZhdG9yIG1hcmdpblxyXG4gICAgICBpZiAodGhpcy5pc0F0dGFjaGVkKSB7XHJcbiAgICAgICAgY29uc3Qgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbClcclxuXHJcbiAgICAgICAgcmVjdC5sZWZ0ID0gcGFyc2VJbnQoc3R5bGUubWFyZ2luTGVmdClcclxuICAgICAgICByZWN0LnRvcCA9IHBhcnNlSW50KHN0eWxlLm1hcmdpblRvcClcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHJlY3RcclxuICAgIH0sXHJcbiAgICBzbmVha1BlZWsgKGNiKSB7XHJcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZWwgPSB0aGlzLiRyZWZzLmNvbnRlbnRcclxuXHJcbiAgICAgICAgaWYgKCFlbCB8fCB0aGlzLmlzU2hvd24oZWwpKSByZXR1cm4gY2IoKVxyXG5cclxuICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZS1ibG9jaydcclxuICAgICAgICBjYigpXHJcbiAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIHN0YXJ0VHJhbnNpdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5pc0NvbnRlbnRBY3RpdmUgPSB0aGlzLmhhc0p1c3RGb2N1c2VkID0gdGhpcy5pc0FjdGl2ZVxyXG4gICAgICAgIHJlc29sdmUoKVxyXG4gICAgICB9KSlcclxuICAgIH0sXHJcbiAgICBpc1Nob3duIChlbCkge1xyXG4gICAgICByZXR1cm4gZWwuc3R5bGUuZGlzcGxheSAhPT0gJ25vbmUnXHJcbiAgICB9LFxyXG4gICAgdXBkYXRlRGltZW5zaW9ucyAoKSB7XHJcbiAgICAgIHRoaXMuY2hlY2tGb3JXaW5kb3coKVxyXG4gICAgICB0aGlzLmNoZWNrRm9yUGFnZVlPZmZzZXQoKVxyXG5cclxuICAgICAgY29uc3QgZGltZW5zaW9ucyA9IHt9XHJcblxyXG4gICAgICAvLyBBY3RpdmF0b3Igc2hvdWxkIGFscmVhZHkgYmUgc2hvd25cclxuICAgICAgaWYgKCF0aGlzLmhhc0FjdGl2YXRvciB8fCB0aGlzLmFic29sdXRlKSB7XHJcbiAgICAgICAgZGltZW5zaW9ucy5hY3RpdmF0b3IgPSB0aGlzLmFic29sdXRlUG9zaXRpb24oKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IGFjdGl2YXRvciA9IHRoaXMuZ2V0QWN0aXZhdG9yKClcclxuICAgICAgICBkaW1lbnNpb25zLmFjdGl2YXRvciA9IHRoaXMubWVhc3VyZShhY3RpdmF0b3IpXHJcbiAgICAgICAgZGltZW5zaW9ucy5hY3RpdmF0b3Iub2Zmc2V0TGVmdCA9IGFjdGl2YXRvci5vZmZzZXRMZWZ0XHJcbiAgICAgICAgaWYgKHRoaXMuaXNBdHRhY2hlZCkge1xyXG4gICAgICAgICAgLy8gYWNjb3VudCBmb3IgY3NzIHBhZGRpbmcgY2F1c2luZyB0aGluZ3MgdG8gbm90IGxpbmUgdXBcclxuICAgICAgICAgIC8vIHRoaXMgaXMgbW9zdGx5IGZvciB2LWF1dG9jb21wbGV0ZSwgaG9wZWZ1bGx5IGl0IHdvbid0IGJyZWFrIGFueXRoaW5nXHJcbiAgICAgICAgICBkaW1lbnNpb25zLmFjdGl2YXRvci5vZmZzZXRUb3AgPSBhY3RpdmF0b3Iub2Zmc2V0VG9wXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGRpbWVuc2lvbnMuYWN0aXZhdG9yLm9mZnNldFRvcCA9IDBcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIERpc3BsYXkgYW5kIGhpZGUgdG8gZ2V0IGRpbWVuc2lvbnNcclxuICAgICAgdGhpcy5zbmVha1BlZWsoKCkgPT4ge1xyXG4gICAgICAgIGRpbWVuc2lvbnMuY29udGVudCA9IHRoaXMubWVhc3VyZSh0aGlzLiRyZWZzLmNvbnRlbnQpXHJcblxyXG4gICAgICAgIHRoaXMuZGltZW5zaW9ucyA9IGRpbWVuc2lvbnNcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiJdfQ==