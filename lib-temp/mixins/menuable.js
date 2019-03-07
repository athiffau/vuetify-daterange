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
        pageWidth: 0,
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
        calcLeft(menuWidth) {
            return `${this.isAttached
                ? this.computedLeft
                : this.calcXOverflow(this.computedLeft, menuWidth)}px`;
        },
        calcTop() {
            return `${this.isAttached
                ? this.computedTop
                : this.calcYOverflow(this.computedTop)}px`;
        },
        calcXOverflow(left, menuWidth) {
            const xOverflow = left + menuWidth - this.pageWidth + 12;
            if ((!this.left || this.right) && xOverflow > 0) {
                left = Math.max(left - xOverflow, 0);
            }
            else {
                left = Math.max(left, 12);
            }
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
            if (this.activatorNode) {
                const activator = Array.isArray(this.activatorNode) ? this.activatorNode[0] : this.activatorNode;
                const el = activator && activator.elm;
                if (el)
                    return el;
            }
            consoleError('No activator found');
        },
        getInnerHeight() {
            if (!this.hasWindow)
                return 0;
            return window.innerHeight ||
                document.documentElement.clientHeight;
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
            this.pageWidth = document.documentElement.clientWidth;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudWFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWl4aW5zL21lbnVhYmxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sR0FBRyxNQUFNLEtBQUssQ0FBQTtBQUVyQixPQUFPLFlBQVksTUFBTSxnQkFBZ0IsQ0FBQTtBQUV6QyxPQUFPLFNBQVMsTUFBTSxhQUFhLENBQUE7QUFDbkMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFBO0FBRTlDLDRDQUE0QztBQUM1QyxNQUFNLFVBQVUsR0FBRztJQUNqQixTQUFTLEVBQUU7UUFDVCxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDO1FBQ2YsTUFBTSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQztRQUNuQixLQUFLLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDO1FBQ25CLFNBQVMsRUFBRSxDQUFDLEVBQUUsWUFBWSxFQUFFLENBQUM7S0FDOUI7SUFDRCxPQUFPLEVBQUU7UUFDUCxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDO1FBQ2YsTUFBTSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQztRQUNuQixLQUFLLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDO1FBQ25CLFNBQVMsRUFBRSxDQUFDLEVBQUUsWUFBWSxFQUFFLENBQUM7S0FDOUI7SUFDRCxTQUFTLEVBQUUsS0FBSztDQUNqQixDQUFBO0FBQ0QsMkNBQTJDO0FBRTNDOzs7Ozs7Ozs7R0FTRztBQUNILG9CQUFvQjtBQUNwQixlQUFlLEdBQUcsQ0FBQyxNQUFNLENBQUM7SUFDeEIsSUFBSSxFQUFFLFVBQVU7SUFFaEIsTUFBTSxFQUFFO1FBQ04sWUFBWTtRQUNaLFNBQVM7S0FDVjtJQUVELEtBQUssRUFBRTtRQUNMLFNBQVMsRUFBRTtZQUNULE9BQU8sRUFBRSxJQUFJO1lBQ2IsU0FBUyxFQUFFLEdBQUcsQ0FBQyxFQUFF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OUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDLFVBQVUsQ0FBQTtnQkFDdEQsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO29CQUNuQix3REFBd0Q7b0JBQ3hELHVFQUF1RTtvQkFDdkUsVUFBVSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQTtpQkFDckQ7cUJBQU07b0JBQ0wsVUFBVSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFBO2lCQUNuQzthQUNGO1lBRUQscUNBQXFDO1lBQ3JDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO2dCQUNsQixVQUFVLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtnQkFFckQsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUE7WUFDOUIsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVnVlIGZyb20gJ3Z1ZSdcclxuXHJcbmltcG9ydCBQb3NpdGlvbmFibGUgZnJvbSAnLi9wb3NpdGlvbmFibGUnXHJcblxyXG5pbXBvcnQgU3RhY2thYmxlIGZyb20gJy4vc3RhY2thYmxlJ1xyXG5pbXBvcnQgeyBjb25zb2xlRXJyb3IgfSBmcm9tICcuLi91dGlsL2NvbnNvbGUnXHJcblxyXG4vKiBlc2xpbnQtZGlzYWJsZSBvYmplY3QtcHJvcGVydHktbmV3bGluZSAqL1xyXG5jb25zdCBkaW1lbnNpb25zID0ge1xyXG4gIGFjdGl2YXRvcjoge1xyXG4gICAgdG9wOiAwLCBsZWZ0OiAwLFxyXG4gICAgYm90dG9tOiAwLCByaWdodDogMCxcclxuICAgIHdpZHRoOiAwLCBoZWlnaHQ6IDAsXHJcbiAgICBvZmZzZXRUb3A6IDAsIHNjcm9sbEhlaWdodDogMFxyXG4gIH0sXHJcbiAgY29udGVudDoge1xyXG4gICAgdG9wOiAwLCBsZWZ0OiAwLFxyXG4gICAgYm90dG9tOiAwLCByaWdodDogMCxcclxuICAgIHdpZHRoOiAwLCBoZWlnaHQ6IDAsXHJcbiAgICBvZmZzZXRUb3A6IDAsIHNjcm9sbEhlaWdodDogMFxyXG4gIH0sXHJcbiAgaGFzV2luZG93OiBmYWxzZVxyXG59XHJcbi8qIGVzbGludC1lbmFibGUgb2JqZWN0LXByb3BlcnR5LW5ld2xpbmUgKi9cclxuXHJcbi8qKlxyXG4gKiBNZW51YWJsZVxyXG4gKlxyXG4gKiBAbWl4aW5cclxuICpcclxuICogVXNlZCBmb3IgZml4ZWQgb3IgYWJzb2x1dGVseSBwb3NpdGlvbmluZ1xyXG4gKiBlbGVtZW50cyB3aXRoaW4gdGhlIERPTVxyXG4gKiBDYW4gY2FsY3VsYXRlIFggYW5kIFkgYXhpcyBvdmVyZmxvd3NcclxuICogQXMgd2VsbCBhcyBiZSBtYW51YWxseSBwb3NpdGlvbmVkXHJcbiAqL1xyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG5leHBvcnQgZGVmYXVsdCBWdWUuZXh0ZW5kKHtcclxuICBuYW1lOiAnbWVudWFibGUnLFxyXG5cclxuICBtaXhpbnM6IFtcclxuICAgIFBvc2l0aW9uYWJsZSxcclxuICAgIFN0YWNrYWJsZVxyXG4gIF0sXHJcblxyXG4gIHByb3BzOiB7XHJcbiAgICBhY3RpdmF0b3I6IHtcclxuICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgdmFsaWRhdG9yOiB2YWwgPT4ge1xyXG4gICAgICAgIHJldHVybiBbJ3N0cmluZycsICdvYmplY3QnXS5pbmNsdWRlcyh0eXBlb2YgdmFsKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgYWxsb3dPdmVyZmxvdzogQm9vbGVhbixcclxuICAgIGlucHV0QWN0aXZhdG9yOiBCb29sZWFuLFxyXG4gICAgbGlnaHQ6IEJvb2xlYW4sXHJcbiAgICBkYXJrOiBCb29sZWFuLFxyXG4gICAgbWF4V2lkdGg6IHtcclxuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcclxuICAgICAgZGVmYXVsdDogJ2F1dG8nXHJcbiAgICB9LFxyXG4gICAgbWluV2lkdGg6IFtOdW1iZXIsIFN0cmluZ10sXHJcbiAgICBudWRnZUJvdHRvbToge1xyXG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxyXG4gICAgICBkZWZhdWx0OiAwXHJcbiAgICB9LFxyXG4gICAgbnVkZ2VMZWZ0OiB7XHJcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXHJcbiAgICAgIGRlZmF1bHQ6IDBcclxuICAgIH0sXHJcbiAgICBudWRnZVJpZ2h0OiB7XHJcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXHJcbiAgICAgIGRlZmF1bHQ6IDBcclxuICAgIH0sXHJcbiAgICBudWRnZVRvcDoge1xyXG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxyXG4gICAgICBkZWZhdWx0OiAwXHJcbiAgICB9LFxyXG4gICAgbnVkZ2VXaWR0aDoge1xyXG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxyXG4gICAgICBkZWZhdWx0OiAwXHJcbiAgICB9LFxyXG4gICAgb2Zmc2V0T3ZlcmZsb3c6IEJvb2xlYW4sXHJcbiAgICBwb3NpdGlvblg6IHtcclxuICAgICAgdHlwZTogTnVtYmVyLFxyXG4gICAgICBkZWZhdWx0OiBudWxsXHJcbiAgICB9LFxyXG4gICAgcG9zaXRpb25ZOiB7XHJcbiAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgZGVmYXVsdDogbnVsbFxyXG4gICAgfSxcclxuICAgIHpJbmRleDoge1xyXG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxyXG4gICAgICBkZWZhdWx0OiBudWxsXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZGF0YTogKCkgPT4gKHtcclxuICAgIGFic29sdXRlWDogMCxcclxuICAgIGFic29sdXRlWTogMCxcclxuICAgIGRpbWVuc2lvbnM6IE9iamVjdC5hc3NpZ24oe30sIGRpbWVuc2lvbnMpLFxyXG4gICAgaXNDb250ZW50QWN0aXZlOiBmYWxzZSxcclxuICAgIHBhZ2VXaWR0aDogMCxcclxuICAgIHBhZ2VZT2Zmc2V0OiAwLFxyXG4gICAgc3RhY2tDbGFzczogJ3YtbWVudV9fY29udGVudC0tYWN0aXZlJyxcclxuICAgIHN0YWNrTWluWkluZGV4OiA2XHJcbiAgfSksXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICBjb21wdXRlZExlZnQgKCkge1xyXG4gICAgICBjb25zdCBhID0gdGhpcy5kaW1lbnNpb25zLmFjdGl2YXRvclxyXG4gICAgICBjb25zdCBjID0gdGhpcy5kaW1lbnNpb25zLmNvbnRlbnRcclxuICAgICAgY29uc3QgYWN0aXZhdG9yTGVmdCA9ICh0aGlzLmlzQXR0YWNoZWQgPyBhLm9mZnNldExlZnQgOiBhLmxlZnQpIHx8IDBcclxuICAgICAgY29uc3QgbWluV2lkdGggPSBNYXRoLm1heChhLndpZHRoLCBjLndpZHRoKVxyXG4gICAgICBsZXQgbGVmdCA9IDBcclxuICAgICAgbGVmdCArPSB0aGlzLmxlZnQgPyBhY3RpdmF0b3JMZWZ0IC0gKG1pbldpZHRoIC0gYS53aWR0aCkgOiBhY3RpdmF0b3JMZWZ0XHJcbiAgICAgIGlmICh0aGlzLm9mZnNldFgpIHtcclxuICAgICAgICBjb25zdCBtYXhXaWR0aCA9IGlzTmFOKHRoaXMubWF4V2lkdGgpXHJcbiAgICAgICAgICA/IGEud2lkdGhcclxuICAgICAgICAgIDogTWF0aC5taW4oYS53aWR0aCwgdGhpcy5tYXhXaWR0aClcclxuXHJcbiAgICAgICAgbGVmdCArPSB0aGlzLmxlZnQgPyAtbWF4V2lkdGggOiBhLndpZHRoXHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMubnVkZ2VMZWZ0KSBsZWZ0IC09IHBhcnNlSW50KHRoaXMubnVkZ2VMZWZ0KVxyXG4gICAgICBpZiAodGhpcy5udWRnZVJpZ2h0KSBsZWZ0ICs9IHBhcnNlSW50KHRoaXMubnVkZ2VSaWdodClcclxuXHJcbiAgICAgIHJldHVybiBsZWZ0XHJcbiAgICB9LFxyXG4gICAgY29tcHV0ZWRUb3AgKCkge1xyXG4gICAgICBjb25zdCBhID0gdGhpcy5kaW1lbnNpb25zLmFjdGl2YXRvclxyXG4gICAgICBjb25zdCBjID0gdGhpcy5kaW1lbnNpb25zLmNvbnRlbnRcclxuICAgICAgbGV0IHRvcCA9IDBcclxuXHJcbiAgICAgIGlmICh0aGlzLnRvcCkgdG9wICs9IGEuaGVpZ2h0IC0gYy5oZWlnaHRcclxuICAgICAgaWYgKHRoaXMuaXNBdHRhY2hlZCkgdG9wICs9IGEub2Zmc2V0VG9wXHJcbiAgICAgIGVsc2UgdG9wICs9IGEudG9wICsgdGhpcy5wYWdlWU9mZnNldFxyXG4gICAgICBpZiAodGhpcy5vZmZzZXRZKSB0b3AgKz0gdGhpcy50b3AgPyAtYS5oZWlnaHQgOiBhLmhlaWdodFxyXG4gICAgICBpZiAodGhpcy5udWRnZVRvcCkgdG9wIC09IHBhcnNlSW50KHRoaXMubnVkZ2VUb3ApXHJcbiAgICAgIGlmICh0aGlzLm51ZGdlQm90dG9tKSB0b3AgKz0gcGFyc2VJbnQodGhpcy5udWRnZUJvdHRvbSlcclxuXHJcbiAgICAgIHJldHVybiB0b3BcclxuICAgIH0sXHJcbiAgICBoYXNBY3RpdmF0b3IgKCkge1xyXG4gICAgICByZXR1cm4gISF0aGlzLiRzbG90cy5hY3RpdmF0b3IgfHwgISF0aGlzLiRzY29wZWRTbG90cy5hY3RpdmF0b3IgfHwgdGhpcy5hY3RpdmF0b3IgfHwgdGhpcy5pbnB1dEFjdGl2YXRvclxyXG4gICAgfSxcclxuICAgIGlzQXR0YWNoZWQgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5hdHRhY2ggIT09IGZhbHNlXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgd2F0Y2g6IHtcclxuICAgIGRpc2FibGVkICh2YWwpIHtcclxuICAgICAgdmFsICYmIHRoaXMuY2FsbERlYWN0aXZhdGUoKVxyXG4gICAgfSxcclxuICAgIGlzQWN0aXZlICh2YWwpIHtcclxuICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHJldHVyblxyXG5cclxuICAgICAgdmFsID8gdGhpcy5jYWxsQWN0aXZhdGUoKSA6IHRoaXMuY2FsbERlYWN0aXZhdGUoKVxyXG4gICAgfSxcclxuICAgIHBvc2l0aW9uWDogJ3VwZGF0ZURpbWVuc2lvbnMnLFxyXG4gICAgcG9zaXRpb25ZOiAndXBkYXRlRGltZW5zaW9ucydcclxuICB9LFxyXG5cclxuICBiZWZvcmVNb3VudCAoKSB7XHJcbiAgICB0aGlzLmNoZWNrRm9yV2luZG93KClcclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICBhYnNvbHV0ZVBvc2l0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBvZmZzZXRUb3A6IDAsXHJcbiAgICAgICAgb2Zmc2V0TGVmdDogMCxcclxuICAgICAgICBzY3JvbGxIZWlnaHQ6IDAsXHJcbiAgICAgICAgdG9wOiB0aGlzLnBvc2l0aW9uWSB8fCB0aGlzLmFic29sdXRlWSxcclxuICAgICAgICBib3R0b206IHRoaXMucG9zaXRpb25ZIHx8IHRoaXMuYWJzb2x1dGVZLFxyXG4gICAgICAgIGxlZnQ6IHRoaXMucG9zaXRpb25YIHx8IHRoaXMuYWJzb2x1dGVYLFxyXG4gICAgICAgIHJpZ2h0OiB0aGlzLnBvc2l0aW9uWCB8fCB0aGlzLmFic29sdXRlWCxcclxuICAgICAgICBoZWlnaHQ6IDAsXHJcbiAgICAgICAgd2lkdGg6IDBcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGFjdGl2YXRlICgpIHt9LFxyXG4gICAgY2FsY0xlZnQgKG1lbnVXaWR0aCkge1xyXG4gICAgICByZXR1cm4gYCR7dGhpcy5pc0F0dGFjaGVkXHJcbiAgICAgICAgPyB0aGlzLmNvbXB1dGVkTGVmdFxyXG4gICAgICAgIDogdGhpcy5jYWxjWE92ZXJmbG93KHRoaXMuY29tcHV0ZWRMZWZ0LCBtZW51V2lkdGgpXHJcbiAgICAgIH1weGBcclxuICAgIH0sXHJcbiAgICBjYWxjVG9wICgpIHtcclxuICAgICAgcmV0dXJuIGAke3RoaXMuaXNBdHRhY2hlZFxyXG4gICAgICAgID8gdGhpcy5jb21wdXRlZFRvcFxyXG4gICAgICAgIDogdGhpcy5jYWxjWU92ZXJmbG93KHRoaXMuY29tcHV0ZWRUb3ApXHJcbiAgICAgIH1weGBcclxuICAgIH0sXHJcbiAgICBjYWxjWE92ZXJmbG93IChsZWZ0LCBtZW51V2lkdGgpIHtcclxuICAgICAgY29uc3QgeE92ZXJmbG93ID0gbGVmdCArIG1lbnVXaWR0aCAtIHRoaXMucGFnZVdpZHRoICsgMTJcclxuXHJcbiAgICAgIGlmICgoIXRoaXMubGVmdCB8fCB0aGlzLnJpZ2h0KSAmJiB4T3ZlcmZsb3cgPiAwKSB7XHJcbiAgICAgICAgbGVmdCA9IE1hdGgubWF4KGxlZnQgLSB4T3ZlcmZsb3csIDApXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGVmdCA9IE1hdGgubWF4KGxlZnQsIDEyKVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gbGVmdCArIHRoaXMuZ2V0T2Zmc2V0TGVmdCgpXHJcbiAgICB9LFxyXG4gICAgY2FsY1lPdmVyZmxvdyAodG9wKSB7XHJcbiAgICAgIGNvbnN0IGRvY3VtZW50SGVpZ2h0ID0gdGhpcy5nZXRJbm5lckhlaWdodCgpXHJcbiAgICAgIGNvbnN0IHRvVG9wID0gdGhpcy5wYWdlWU9mZnNldCArIGRvY3VtZW50SGVpZ2h0XHJcbiAgICAgIGNvbnN0IGFjdGl2YXRvciA9IHRoaXMuZGltZW5zaW9ucy5hY3RpdmF0b3JcclxuICAgICAgY29uc3QgY29udGVudEhlaWdodCA9IHRoaXMuZGltZW5zaW9ucy5jb250ZW50LmhlaWdodFxyXG4gICAgICBjb25zdCB0b3RhbEhlaWdodCA9IHRvcCArIGNvbnRlbnRIZWlnaHRcclxuICAgICAgY29uc3QgaXNPdmVyZmxvd2luZyA9IHRvVG9wIDwgdG90YWxIZWlnaHRcclxuXHJcbiAgICAgIC8vIElmIG92ZXJmbG93aW5nIGJvdHRvbSBhbmQgb2Zmc2V0XHJcbiAgICAgIC8vIFRPRE86IHNldCAnYm90dG9tJyBwb3NpdGlvbiBpbnN0ZWFkIG9mICd0b3AnXHJcbiAgICAgIGlmIChpc092ZXJmbG93aW5nICYmXHJcbiAgICAgICAgdGhpcy5vZmZzZXRPdmVyZmxvdyAmJlxyXG4gICAgICAgIC8vIElmIHdlIGRvbid0IGhhdmUgZW5vdWdoIHJvb20gdG8gb2Zmc2V0XHJcbiAgICAgICAgLy8gdGhlIG92ZXJmbG93LCBkb24ndCBvZmZzZXRcclxuICAgICAgICBhY3RpdmF0b3IudG9wID4gY29udGVudEhlaWdodFxyXG4gICAgICApIHtcclxuICAgICAgICB0b3AgPSB0aGlzLnBhZ2VZT2Zmc2V0ICsgKGFjdGl2YXRvci50b3AgLSBjb250ZW50SGVpZ2h0KVxyXG4gICAgICAvLyBJZiBvdmVyZmxvd2luZyBib3R0b21cclxuICAgICAgfSBlbHNlIGlmIChpc092ZXJmbG93aW5nICYmICF0aGlzLmFsbG93T3ZlcmZsb3cpIHtcclxuICAgICAgICB0b3AgPSB0b1RvcCAtIGNvbnRlbnRIZWlnaHQgLSAxMlxyXG4gICAgICAvLyBJZiBvdmVyZmxvd2luZyB0b3BcclxuICAgICAgfSBlbHNlIGlmICh0b3AgPCB0aGlzLnBhZ2VZT2Zmc2V0ICYmICF0aGlzLmFsbG93T3ZlcmZsb3cpIHtcclxuICAgICAgICB0b3AgPSB0aGlzLnBhZ2VZT2Zmc2V0ICsgMTJcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRvcCA8IDEyID8gMTIgOiB0b3BcclxuICAgIH0sXHJcbiAgICBjYWxsQWN0aXZhdGUgKCkge1xyXG4gICAgICBpZiAoIXRoaXMuaGFzV2luZG93KSByZXR1cm5cclxuXHJcbiAgICAgIHRoaXMuYWN0aXZhdGUoKVxyXG4gICAgfSxcclxuICAgIGNhbGxEZWFjdGl2YXRlICgpIHtcclxuICAgICAgdGhpcy5pc0NvbnRlbnRBY3RpdmUgPSBmYWxzZVxyXG5cclxuICAgICAgdGhpcy5kZWFjdGl2YXRlKClcclxuICAgIH0sXHJcbiAgICBjaGVja0ZvcldpbmRvdyAoKSB7XHJcbiAgICAgIGlmICghdGhpcy5oYXNXaW5kb3cpIHtcclxuICAgICAgICB0aGlzLmhhc1dpbmRvdyA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBjaGVja0ZvclBhZ2VZT2Zmc2V0ICgpIHtcclxuICAgICAgaWYgKHRoaXMuaGFzV2luZG93KSB7XHJcbiAgICAgICAgdGhpcy5wYWdlWU9mZnNldCA9IHRoaXMuZ2V0T2Zmc2V0VG9wKClcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGRlYWN0aXZhdGUgKCkge30sXHJcbiAgICBnZXRBY3RpdmF0b3IgKGUpIHtcclxuICAgICAgaWYgKHRoaXMuaW5wdXRBY3RpdmF0b3IpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignLnYtaW5wdXRfX3Nsb3QnKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5hY3RpdmF0b3IpIHtcclxuICAgICAgICByZXR1cm4gdHlwZW9mIHRoaXMuYWN0aXZhdG9yID09PSAnc3RyaW5nJ1xyXG4gICAgICAgICAgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuYWN0aXZhdG9yKVxyXG4gICAgICAgICAgOiB0aGlzLmFjdGl2YXRvclxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy4kcmVmcy5hY3RpdmF0b3IpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4kcmVmcy5hY3RpdmF0b3IuY2hpbGRyZW4ubGVuZ3RoID4gMFxyXG4gICAgICAgICAgPyB0aGlzLiRyZWZzLmFjdGl2YXRvci5jaGlsZHJlblswXVxyXG4gICAgICAgICAgOiB0aGlzLiRyZWZzLmFjdGl2YXRvclxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZSkge1xyXG4gICAgICAgIHRoaXMuYWN0aXZhdGVkQnkgPSBlLmN1cnJlbnRUYXJnZXQgfHwgZS50YXJnZXRcclxuICAgICAgICByZXR1cm4gdGhpcy5hY3RpdmF0ZWRCeVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5hY3RpdmF0ZWRCeSkgcmV0dXJuIHRoaXMuYWN0aXZhdGVkQnlcclxuXHJcbiAgICAgIGlmICh0aGlzLmFjdGl2YXRvck5vZGUpIHtcclxuICAgICAgICBjb25zdCBhY3RpdmF0b3IgPSBBcnJheS5pc0FycmF5KHRoaXMuYWN0aXZhdG9yTm9kZSkgPyB0aGlzLmFjdGl2YXRvck5vZGVbMF0gOiB0aGlzLmFjdGl2YXRvck5vZGVcclxuICAgICAgICBjb25zdCBlbCA9IGFjdGl2YXRvciAmJiBhY3RpdmF0b3IuZWxtXHJcbiAgICAgICAgaWYgKGVsKSByZXR1cm4gZWxcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc29sZUVycm9yKCdObyBhY3RpdmF0b3IgZm91bmQnKVxyXG4gICAgfSxcclxuICAgIGdldElubmVySGVpZ2h0ICgpIHtcclxuICAgICAgaWYgKCF0aGlzLmhhc1dpbmRvdykgcmV0dXJuIDBcclxuXHJcbiAgICAgIHJldHVybiB3aW5kb3cuaW5uZXJIZWlnaHQgfHxcclxuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0XHJcbiAgICB9LFxyXG4gICAgZ2V0T2Zmc2V0TGVmdCAoKSB7XHJcbiAgICAgIGlmICghdGhpcy5oYXNXaW5kb3cpIHJldHVybiAwXHJcblxyXG4gICAgICByZXR1cm4gd2luZG93LnBhZ2VYT2Zmc2V0IHx8XHJcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnRcclxuICAgIH0sXHJcbiAgICBnZXRPZmZzZXRUb3AgKCkge1xyXG4gICAgICBpZiAoIXRoaXMuaGFzV2luZG93KSByZXR1cm4gMFxyXG5cclxuICAgICAgcmV0dXJuIHdpbmRvdy5wYWdlWU9mZnNldCB8fFxyXG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3BcclxuICAgIH0sXHJcbiAgICBnZXRSb3VuZGVkQm91bmRlZENsaWVudFJlY3QgKGVsKSB7XHJcbiAgICAgIGNvbnN0IHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHRvcDogTWF0aC5yb3VuZChyZWN0LnRvcCksXHJcbiAgICAgICAgbGVmdDogTWF0aC5yb3VuZChyZWN0LmxlZnQpLFxyXG4gICAgICAgIGJvdHRvbTogTWF0aC5yb3VuZChyZWN0LmJvdHRvbSksXHJcbiAgICAgICAgcmlnaHQ6IE1hdGgucm91bmQocmVjdC5yaWdodCksXHJcbiAgICAgICAgd2lkdGg6IE1hdGgucm91bmQocmVjdC53aWR0aCksXHJcbiAgICAgICAgaGVpZ2h0OiBNYXRoLnJvdW5kKHJlY3QuaGVpZ2h0KVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgbWVhc3VyZSAoZWwpIHtcclxuICAgICAgaWYgKCFlbCB8fCAhdGhpcy5oYXNXaW5kb3cpIHJldHVybiBudWxsXHJcblxyXG4gICAgICBjb25zdCByZWN0ID0gdGhpcy5nZXRSb3VuZGVkQm91bmRlZENsaWVudFJlY3QoZWwpXHJcblxyXG4gICAgICAvLyBBY2NvdW50IGZvciBhY3RpdmF0b3IgbWFyZ2luXHJcbiAgICAgIGlmICh0aGlzLmlzQXR0YWNoZWQpIHtcclxuICAgICAgICBjb25zdCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKVxyXG5cclxuICAgICAgICByZWN0LmxlZnQgPSBwYXJzZUludChzdHlsZS5tYXJnaW5MZWZ0KVxyXG4gICAgICAgIHJlY3QudG9wID0gcGFyc2VJbnQoc3R5bGUubWFyZ2luVG9wKVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcmVjdFxyXG4gICAgfSxcclxuICAgIHNuZWFrUGVlayAoY2IpIHtcclxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgICBjb25zdCBlbCA9IHRoaXMuJHJlZnMuY29udGVudFxyXG5cclxuICAgICAgICBpZiAoIWVsIHx8IHRoaXMuaXNTaG93bihlbCkpIHJldHVybiBjYigpXHJcblxyXG4gICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJ1xyXG4gICAgICAgIGNiKClcclxuICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgc3RhcnRUcmFuc2l0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgICB0aGlzLmlzQ29udGVudEFjdGl2ZSA9IHRoaXMuaGFzSnVzdEZvY3VzZWQgPSB0aGlzLmlzQWN0aXZlXHJcbiAgICAgICAgcmVzb2x2ZSgpXHJcbiAgICAgIH0pKVxyXG4gICAgfSxcclxuICAgIGlzU2hvd24gKGVsKSB7XHJcbiAgICAgIHJldHVybiBlbC5zdHlsZS5kaXNwbGF5ICE9PSAnbm9uZSdcclxuICAgIH0sXHJcbiAgICB1cGRhdGVEaW1lbnNpb25zICgpIHtcclxuICAgICAgdGhpcy5jaGVja0ZvcldpbmRvdygpXHJcbiAgICAgIHRoaXMuY2hlY2tGb3JQYWdlWU9mZnNldCgpXHJcbiAgICAgIHRoaXMucGFnZVdpZHRoID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoXHJcblxyXG4gICAgICBjb25zdCBkaW1lbnNpb25zID0ge31cclxuXHJcbiAgICAgIC8vIEFjdGl2YXRvciBzaG91bGQgYWxyZWFkeSBiZSBzaG93blxyXG4gICAgICBpZiAoIXRoaXMuaGFzQWN0aXZhdG9yIHx8IHRoaXMuYWJzb2x1dGUpIHtcclxuICAgICAgICBkaW1lbnNpb25zLmFjdGl2YXRvciA9IHRoaXMuYWJzb2x1dGVQb3NpdGlvbigpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgYWN0aXZhdG9yID0gdGhpcy5nZXRBY3RpdmF0b3IoKVxyXG4gICAgICAgIGRpbWVuc2lvbnMuYWN0aXZhdG9yID0gdGhpcy5tZWFzdXJlKGFjdGl2YXRvcilcclxuICAgICAgICBkaW1lbnNpb25zLmFjdGl2YXRvci5vZmZzZXRMZWZ0ID0gYWN0aXZhdG9yLm9mZnNldExlZnRcclxuICAgICAgICBpZiAodGhpcy5pc0F0dGFjaGVkKSB7XHJcbiAgICAgICAgICAvLyBhY2NvdW50IGZvciBjc3MgcGFkZGluZyBjYXVzaW5nIHRoaW5ncyB0byBub3QgbGluZSB1cFxyXG4gICAgICAgICAgLy8gdGhpcyBpcyBtb3N0bHkgZm9yIHYtYXV0b2NvbXBsZXRlLCBob3BlZnVsbHkgaXQgd29uJ3QgYnJlYWsgYW55dGhpbmdcclxuICAgICAgICAgIGRpbWVuc2lvbnMuYWN0aXZhdG9yLm9mZnNldFRvcCA9IGFjdGl2YXRvci5vZmZzZXRUb3BcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZGltZW5zaW9ucy5hY3RpdmF0b3Iub2Zmc2V0VG9wID0gMFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gRGlzcGxheSBhbmQgaGlkZSB0byBnZXQgZGltZW5zaW9uc1xyXG4gICAgICB0aGlzLnNuZWFrUGVlaygoKSA9PiB7XHJcbiAgICAgICAgZGltZW5zaW9ucy5jb250ZW50ID0gdGhpcy5tZWFzdXJlKHRoaXMuJHJlZnMuY29udGVudClcclxuXHJcbiAgICAgICAgdGhpcy5kaW1lbnNpb25zID0gZGltZW5zaW9uc1xyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuIl19