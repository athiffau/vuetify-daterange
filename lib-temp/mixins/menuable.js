import Vue from 'vue';
import Positionable from './positionable';
import Stackable from './stackable';
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
        activatorFixed: false,
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
                this.pageYOffset = this.activatorFixed ? 0 : this.getOffsetTop();
            }
        },
        checkActivatorFixed() {
            if (this.attach !== false)
                return;
            let el = this.getActivator();
            while (el) {
                if (window.getComputedStyle(el).position === 'fixed') {
                    this.activatorFixed = true;
                    return;
                }
                el = el.offsetParent;
            }
            this.activatorFixed = false;
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
            this.checkActivatorFixed();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudWFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWl4aW5zL21lbnVhYmxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sR0FBRyxNQUFNLEtBQUssQ0FBQTtBQUVyQixPQUFPLFlBQVksTUFBTSxnQkFBZ0IsQ0FBQTtBQUV6QyxPQUFPLFNBQVMsTUFBTSxhQUFhLENBQUE7QUFFbkMsNENBQTRDO0FBQzVDLE1BQU0sVUFBVSxHQUFHO0lBQ2pCLFNBQVMsRUFBRTtRQUNULEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUM7UUFDZixNQUFNLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDO1FBQ25CLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUM7UUFDbkIsU0FBUyxFQUFFLENBQUMsRUFBRSxZQUFZLEVBQUUsQ0FBQztLQUM5QjtJQUNELE9BQU8sRUFBRTtRQUNQLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUM7UUFDZixNQUFNLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDO1FBQ25CLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUM7UUFDbkIsU0FBUyxFQUFFLENBQUMsRUFBRSxZQUFZLEVBQUUsQ0FBQztLQUM5QjtJQUNELFNBQVMsRUFBRSxLQUFLO0NBQ2pCLENBQUE7QUFDRCwyQ0FBMkM7QUFFM0M7Ozs7Ozs7OztHQVNHO0FBQ0gsb0JBQW9CO0FBQ3BCLGVBQWUsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUN4QixJQUFJLEVBQUUsVUFBVTtJQUVoQixNQUFNLEVBQUU7UUFDTixZQUFZO1FBQ1osU0FBUztLQUNWO0lBRUQsS0FBSyxFQUFFO1FBQ0wsU0FBUyxFQUFFO1lBQ1QsT0FBTyxFQUFFLElBQUk7WUFDYixTQUFTLEVBQUUsR0FBRyxDQUFDLEVBQUU7Z0JBQ2YsT0FBTyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxR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QzFCLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO1lBQzFCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUE7WUFFckQsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFBO1lBRXJCLG9DQUFvQztZQUNwQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUN2QyxVQUFVLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO2FBQy9DO2lCQUFNO2dCQUNMLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQTtnQkFDckMsVUFBVSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFBO2dCQUM5QyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUMsVUFBVSxDQUFBO2dCQUN0RCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7b0JBQ25CLHdEQUF3RDtvQkFDeEQsdUVBQXVFO29CQUN2RSxVQUFVLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFBO2lCQUNyRDtxQkFBTTtvQkFDTCxVQUFVLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUE7aUJBQ25DO2FBQ0Y7WUFFRCxxQ0FBcUM7WUFDckMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2xCLFVBQVUsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFBO2dCQUVyRCxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQTtZQUM5QixDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUM7S0FDRjtDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWdWUgZnJvbSAndnVlJ1xyXG5cclxuaW1wb3J0IFBvc2l0aW9uYWJsZSBmcm9tICcuL3Bvc2l0aW9uYWJsZSdcclxuXHJcbmltcG9ydCBTdGFja2FibGUgZnJvbSAnLi9zdGFja2FibGUnXHJcblxyXG4vKiBlc2xpbnQtZGlzYWJsZSBvYmplY3QtcHJvcGVydHktbmV3bGluZSAqL1xyXG5jb25zdCBkaW1lbnNpb25zID0ge1xyXG4gIGFjdGl2YXRvcjoge1xyXG4gICAgdG9wOiAwLCBsZWZ0OiAwLFxyXG4gICAgYm90dG9tOiAwLCByaWdodDogMCxcclxuICAgIHdpZHRoOiAwLCBoZWlnaHQ6IDAsXHJcbiAgICBvZmZzZXRUb3A6IDAsIHNjcm9sbEhlaWdodDogMFxyXG4gIH0sXHJcbiAgY29udGVudDoge1xyXG4gICAgdG9wOiAwLCBsZWZ0OiAwLFxyXG4gICAgYm90dG9tOiAwLCByaWdodDogMCxcclxuICAgIHdpZHRoOiAwLCBoZWlnaHQ6IDAsXHJcbiAgICBvZmZzZXRUb3A6IDAsIHNjcm9sbEhlaWdodDogMFxyXG4gIH0sXHJcbiAgaGFzV2luZG93OiBmYWxzZVxyXG59XHJcbi8qIGVzbGludC1lbmFibGUgb2JqZWN0LXByb3BlcnR5LW5ld2xpbmUgKi9cclxuXHJcbi8qKlxyXG4gKiBNZW51YWJsZVxyXG4gKlxyXG4gKiBAbWl4aW5cclxuICpcclxuICogVXNlZCBmb3IgZml4ZWQgb3IgYWJzb2x1dGVseSBwb3NpdGlvbmluZ1xyXG4gKiBlbGVtZW50cyB3aXRoaW4gdGhlIERPTVxyXG4gKiBDYW4gY2FsY3VsYXRlIFggYW5kIFkgYXhpcyBvdmVyZmxvd3NcclxuICogQXMgd2VsbCBhcyBiZSBtYW51YWxseSBwb3NpdGlvbmVkXHJcbiAqL1xyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG5leHBvcnQgZGVmYXVsdCBWdWUuZXh0ZW5kKHtcclxuICBuYW1lOiAnbWVudWFibGUnLFxyXG5cclxuICBtaXhpbnM6IFtcclxuICAgIFBvc2l0aW9uYWJsZSxcclxuICAgIFN0YWNrYWJsZVxyXG4gIF0sXHJcblxyXG4gIHByb3BzOiB7XHJcbiAgICBhY3RpdmF0b3I6IHtcclxuICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgdmFsaWRhdG9yOiB2YWwgPT4ge1xyXG4gICAgICAgIHJldHVybiBbJ3N0cmluZycsICdvYmplY3QnXS5pbmNsdWRlcyh0eXBlb2YgdmFsKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgYWxsb3dPdmVyZmxvdzogQm9vbGVhbixcclxuICAgIGlucHV0QWN0aXZhdG9yOiBCb29sZWFuLFxyXG4gICAgbGlnaHQ6IEJvb2xlYW4sXHJcbiAgICBkYXJrOiBCb29sZWFuLFxyXG4gICAgbWF4V2lkdGg6IHtcclxuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcclxuICAgICAgZGVmYXVsdDogJ2F1dG8nXHJcbiAgICB9LFxyXG4gICAgbWluV2lkdGg6IFtOdW1iZXIsIFN0cmluZ10sXHJcbiAgICBudWRnZUJvdHRvbToge1xyXG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxyXG4gICAgICBkZWZhdWx0OiAwXHJcbiAgICB9LFxyXG4gICAgbnVkZ2VMZWZ0OiB7XHJcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXHJcbiAgICAgIGRlZmF1bHQ6IDBcclxuICAgIH0sXHJcbiAgICBudWRnZVJpZ2h0OiB7XHJcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXHJcbiAgICAgIGRlZmF1bHQ6IDBcclxuICAgIH0sXHJcbiAgICBudWRnZVRvcDoge1xyXG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxyXG4gICAgICBkZWZhdWx0OiAwXHJcbiAgICB9LFxyXG4gICAgbnVkZ2VXaWR0aDoge1xyXG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxyXG4gICAgICBkZWZhdWx0OiAwXHJcbiAgICB9LFxyXG4gICAgb2Zmc2V0T3ZlcmZsb3c6IEJvb2xlYW4sXHJcbiAgICBwb3NpdGlvblg6IHtcclxuICAgICAgdHlwZTogTnVtYmVyLFxyXG4gICAgICBkZWZhdWx0OiBudWxsXHJcbiAgICB9LFxyXG4gICAgcG9zaXRpb25ZOiB7XHJcbiAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgZGVmYXVsdDogbnVsbFxyXG4gICAgfSxcclxuICAgIHpJbmRleDoge1xyXG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxyXG4gICAgICBkZWZhdWx0OiBudWxsXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZGF0YTogKCkgPT4gKHtcclxuICAgIGFic29sdXRlWDogMCxcclxuICAgIGFic29sdXRlWTogMCxcclxuICAgIGFjdGl2YXRvckZpeGVkOiBmYWxzZSxcclxuICAgIGRpbWVuc2lvbnM6IE9iamVjdC5hc3NpZ24oe30sIGRpbWVuc2lvbnMpLFxyXG4gICAgaXNDb250ZW50QWN0aXZlOiBmYWxzZSxcclxuICAgIHBhZ2VXaWR0aDogMCxcclxuICAgIHBhZ2VZT2Zmc2V0OiAwLFxyXG4gICAgc3RhY2tDbGFzczogJ3YtbWVudV9fY29udGVudC0tYWN0aXZlJyxcclxuICAgIHN0YWNrTWluWkluZGV4OiA2XHJcbiAgfSksXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICBjb21wdXRlZExlZnQgKCkge1xyXG4gICAgICBjb25zdCBhID0gdGhpcy5kaW1lbnNpb25zLmFjdGl2YXRvclxyXG4gICAgICBjb25zdCBjID0gdGhpcy5kaW1lbnNpb25zLmNvbnRlbnRcclxuICAgICAgY29uc3QgYWN0aXZhdG9yTGVmdCA9ICh0aGlzLmlzQXR0YWNoZWQgPyBhLm9mZnNldExlZnQgOiBhLmxlZnQpIHx8IDBcclxuICAgICAgY29uc3QgbWluV2lkdGggPSBNYXRoLm1heChhLndpZHRoLCBjLndpZHRoKVxyXG4gICAgICBsZXQgbGVmdCA9IDBcclxuICAgICAgbGVmdCArPSB0aGlzLmxlZnQgPyBhY3RpdmF0b3JMZWZ0IC0gKG1pbldpZHRoIC0gYS53aWR0aCkgOiBhY3RpdmF0b3JMZWZ0XHJcbiAgICAgIGlmICh0aGlzLm9mZnNldFgpIHtcclxuICAgICAgICBjb25zdCBtYXhXaWR0aCA9IGlzTmFOKHRoaXMubWF4V2lkdGgpXHJcbiAgICAgICAgICA/IGEud2lkdGhcclxuICAgICAgICAgIDogTWF0aC5taW4oYS53aWR0aCwgdGhpcy5tYXhXaWR0aClcclxuXHJcbiAgICAgICAgbGVmdCArPSB0aGlzLmxlZnQgPyAtbWF4V2lkdGggOiBhLndpZHRoXHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMubnVkZ2VMZWZ0KSBsZWZ0IC09IHBhcnNlSW50KHRoaXMubnVkZ2VMZWZ0KVxyXG4gICAgICBpZiAodGhpcy5udWRnZVJpZ2h0KSBsZWZ0ICs9IHBhcnNlSW50KHRoaXMubnVkZ2VSaWdodClcclxuXHJcbiAgICAgIHJldHVybiBsZWZ0XHJcbiAgICB9LFxyXG4gICAgY29tcHV0ZWRUb3AgKCkge1xyXG4gICAgICBjb25zdCBhID0gdGhpcy5kaW1lbnNpb25zLmFjdGl2YXRvclxyXG4gICAgICBjb25zdCBjID0gdGhpcy5kaW1lbnNpb25zLmNvbnRlbnRcclxuICAgICAgbGV0IHRvcCA9IDBcclxuXHJcbiAgICAgIGlmICh0aGlzLnRvcCkgdG9wICs9IGEuaGVpZ2h0IC0gYy5oZWlnaHRcclxuICAgICAgaWYgKHRoaXMuaXNBdHRhY2hlZCkgdG9wICs9IGEub2Zmc2V0VG9wXHJcbiAgICAgIGVsc2UgdG9wICs9IGEudG9wICsgdGhpcy5wYWdlWU9mZnNldFxyXG4gICAgICBpZiAodGhpcy5vZmZzZXRZKSB0b3AgKz0gdGhpcy50b3AgPyAtYS5oZWlnaHQgOiBhLmhlaWdodFxyXG4gICAgICBpZiAodGhpcy5udWRnZVRvcCkgdG9wIC09IHBhcnNlSW50KHRoaXMubnVkZ2VUb3ApXHJcbiAgICAgIGlmICh0aGlzLm51ZGdlQm90dG9tKSB0b3AgKz0gcGFyc2VJbnQodGhpcy5udWRnZUJvdHRvbSlcclxuXHJcbiAgICAgIHJldHVybiB0b3BcclxuICAgIH0sXHJcbiAgICBoYXNBY3RpdmF0b3IgKCkge1xyXG4gICAgICByZXR1cm4gISF0aGlzLiRzbG90cy5hY3RpdmF0b3IgfHwgISF0aGlzLiRzY29wZWRTbG90cy5hY3RpdmF0b3IgfHwgdGhpcy5hY3RpdmF0b3IgfHwgdGhpcy5pbnB1dEFjdGl2YXRvclxyXG4gICAgfSxcclxuICAgIGlzQXR0YWNoZWQgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5hdHRhY2ggIT09IGZhbHNlXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgd2F0Y2g6IHtcclxuICAgIGRpc2FibGVkICh2YWwpIHtcclxuICAgICAgdmFsICYmIHRoaXMuY2FsbERlYWN0aXZhdGUoKVxyXG4gICAgfSxcclxuICAgIGlzQWN0aXZlICh2YWwpIHtcclxuICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHJldHVyblxyXG5cclxuICAgICAgdmFsID8gdGhpcy5jYWxsQWN0aXZhdGUoKSA6IHRoaXMuY2FsbERlYWN0aXZhdGUoKVxyXG4gICAgfSxcclxuICAgIHBvc2l0aW9uWDogJ3VwZGF0ZURpbWVuc2lvbnMnLFxyXG4gICAgcG9zaXRpb25ZOiAndXBkYXRlRGltZW5zaW9ucydcclxuICB9LFxyXG5cclxuICBiZWZvcmVNb3VudCAoKSB7XHJcbiAgICB0aGlzLmNoZWNrRm9yV2luZG93KClcclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICBhYnNvbHV0ZVBvc2l0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBvZmZzZXRUb3A6IDAsXHJcbiAgICAgICAgb2Zmc2V0TGVmdDogMCxcclxuICAgICAgICBzY3JvbGxIZWlnaHQ6IDAsXHJcbiAgICAgICAgdG9wOiB0aGlzLnBvc2l0aW9uWSB8fCB0aGlzLmFic29sdXRlWSxcclxuICAgICAgICBib3R0b206IHRoaXMucG9zaXRpb25ZIHx8IHRoaXMuYWJzb2x1dGVZLFxyXG4gICAgICAgIGxlZnQ6IHRoaXMucG9zaXRpb25YIHx8IHRoaXMuYWJzb2x1dGVYLFxyXG4gICAgICAgIHJpZ2h0OiB0aGlzLnBvc2l0aW9uWCB8fCB0aGlzLmFic29sdXRlWCxcclxuICAgICAgICBoZWlnaHQ6IDAsXHJcbiAgICAgICAgd2lkdGg6IDBcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGFjdGl2YXRlICgpIHt9LFxyXG4gICAgY2FsY0xlZnQgKG1lbnVXaWR0aCkge1xyXG4gICAgICByZXR1cm4gYCR7dGhpcy5pc0F0dGFjaGVkXHJcbiAgICAgICAgPyB0aGlzLmNvbXB1dGVkTGVmdFxyXG4gICAgICAgIDogdGhpcy5jYWxjWE92ZXJmbG93KHRoaXMuY29tcHV0ZWRMZWZ0LCBtZW51V2lkdGgpXHJcbiAgICAgIH1weGBcclxuICAgIH0sXHJcbiAgICBjYWxjVG9wICgpIHtcclxuICAgICAgcmV0dXJuIGAke3RoaXMuaXNBdHRhY2hlZFxyXG4gICAgICAgID8gdGhpcy5jb21wdXRlZFRvcFxyXG4gICAgICAgIDogdGhpcy5jYWxjWU92ZXJmbG93KHRoaXMuY29tcHV0ZWRUb3ApXHJcbiAgICAgIH1weGBcclxuICAgIH0sXHJcbiAgICBjYWxjWE92ZXJmbG93IChsZWZ0LCBtZW51V2lkdGgpIHtcclxuICAgICAgY29uc3QgeE92ZXJmbG93ID0gbGVmdCArIG1lbnVXaWR0aCAtIHRoaXMucGFnZVdpZHRoICsgMTJcclxuXHJcbiAgICAgIGlmICgoIXRoaXMubGVmdCB8fCB0aGlzLnJpZ2h0KSAmJiB4T3ZlcmZsb3cgPiAwKSB7XHJcbiAgICAgICAgbGVmdCA9IE1hdGgubWF4KGxlZnQgLSB4T3ZlcmZsb3csIDApXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGVmdCA9IE1hdGgubWF4KGxlZnQsIDEyKVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gbGVmdCArIHRoaXMuZ2V0T2Zmc2V0TGVmdCgpXHJcbiAgICB9LFxyXG4gICAgY2FsY1lPdmVyZmxvdyAodG9wKSB7XHJcbiAgICAgIGNvbnN0IGRvY3VtZW50SGVpZ2h0ID0gdGhpcy5nZXRJbm5lckhlaWdodCgpXHJcbiAgICAgIGNvbnN0IHRvVG9wID0gdGhpcy5wYWdlWU9mZnNldCArIGRvY3VtZW50SGVpZ2h0XHJcbiAgICAgIGNvbnN0IGFjdGl2YXRvciA9IHRoaXMuZGltZW5zaW9ucy5hY3RpdmF0b3JcclxuICAgICAgY29uc3QgY29udGVudEhlaWdodCA9IHRoaXMuZGltZW5zaW9ucy5jb250ZW50LmhlaWdodFxyXG4gICAgICBjb25zdCB0b3RhbEhlaWdodCA9IHRvcCArIGNvbnRlbnRIZWlnaHRcclxuICAgICAgY29uc3QgaXNPdmVyZmxvd2luZyA9IHRvVG9wIDwgdG90YWxIZWlnaHRcclxuXHJcbiAgICAgIC8vIElmIG92ZXJmbG93aW5nIGJvdHRvbSBhbmQgb2Zmc2V0XHJcbiAgICAgIC8vIFRPRE86IHNldCAnYm90dG9tJyBwb3NpdGlvbiBpbnN0ZWFkIG9mICd0b3AnXHJcbiAgICAgIGlmIChpc092ZXJmbG93aW5nICYmXHJcbiAgICAgICAgdGhpcy5vZmZzZXRPdmVyZmxvdyAmJlxyXG4gICAgICAgIC8vIElmIHdlIGRvbid0IGhhdmUgZW5vdWdoIHJvb20gdG8gb2Zmc2V0XHJcbiAgICAgICAgLy8gdGhlIG92ZXJmbG93LCBkb24ndCBvZmZzZXRcclxuICAgICAgICBhY3RpdmF0b3IudG9wID4gY29udGVudEhlaWdodFxyXG4gICAgICApIHtcclxuICAgICAgICB0b3AgPSB0aGlzLnBhZ2VZT2Zmc2V0ICsgKGFjdGl2YXRvci50b3AgLSBjb250ZW50SGVpZ2h0KVxyXG4gICAgICAvLyBJZiBvdmVyZmxvd2luZyBib3R0b21cclxuICAgICAgfSBlbHNlIGlmIChpc092ZXJmbG93aW5nICYmICF0aGlzLmFsbG93T3ZlcmZsb3cpIHtcclxuICAgICAgICB0b3AgPSB0b1RvcCAtIGNvbnRlbnRIZWlnaHQgLSAxMlxyXG4gICAgICAvLyBJZiBvdmVyZmxvd2luZyB0b3BcclxuICAgICAgfSBlbHNlIGlmICh0b3AgPCB0aGlzLnBhZ2VZT2Zmc2V0ICYmICF0aGlzLmFsbG93T3ZlcmZsb3cpIHtcclxuICAgICAgICB0b3AgPSB0aGlzLnBhZ2VZT2Zmc2V0ICsgMTJcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRvcCA8IDEyID8gMTIgOiB0b3BcclxuICAgIH0sXHJcbiAgICBjYWxsQWN0aXZhdGUgKCkge1xyXG4gICAgICBpZiAoIXRoaXMuaGFzV2luZG93KSByZXR1cm5cclxuXHJcbiAgICAgIHRoaXMuYWN0aXZhdGUoKVxyXG4gICAgfSxcclxuICAgIGNhbGxEZWFjdGl2YXRlICgpIHtcclxuICAgICAgdGhpcy5pc0NvbnRlbnRBY3RpdmUgPSBmYWxzZVxyXG5cclxuICAgICAgdGhpcy5kZWFjdGl2YXRlKClcclxuICAgIH0sXHJcbiAgICBjaGVja0ZvcldpbmRvdyAoKSB7XHJcbiAgICAgIGlmICghdGhpcy5oYXNXaW5kb3cpIHtcclxuICAgICAgICB0aGlzLmhhc1dpbmRvdyA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBjaGVja0ZvclBhZ2VZT2Zmc2V0ICgpIHtcclxuICAgICAgaWYgKHRoaXMuaGFzV2luZG93KSB7XHJcbiAgICAgICAgdGhpcy5wYWdlWU9mZnNldCA9IHRoaXMuYWN0aXZhdG9yRml4ZWQgPyAwIDogdGhpcy5nZXRPZmZzZXRUb3AoKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgY2hlY2tBY3RpdmF0b3JGaXhlZCAoKSB7XHJcbiAgICAgIGlmICh0aGlzLmF0dGFjaCAhPT0gZmFsc2UpIHJldHVyblxyXG4gICAgICBsZXQgZWwgPSB0aGlzLmdldEFjdGl2YXRvcigpXHJcbiAgICAgIHdoaWxlIChlbCkge1xyXG4gICAgICAgIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCkucG9zaXRpb24gPT09ICdmaXhlZCcpIHtcclxuICAgICAgICAgIHRoaXMuYWN0aXZhdG9yRml4ZWQgPSB0cnVlXHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgZWwgPSBlbC5vZmZzZXRQYXJlbnRcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmFjdGl2YXRvckZpeGVkID0gZmFsc2VcclxuICAgIH0sXHJcbiAgICBkZWFjdGl2YXRlICgpIHt9LFxyXG4gICAgZ2V0QWN0aXZhdG9yIChlKSB7XHJcbiAgICAgIGlmICh0aGlzLmlucHV0QWN0aXZhdG9yKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJy52LWlucHV0X19zbG90JylcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMuYWN0aXZhdG9yKSB7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiB0aGlzLmFjdGl2YXRvciA9PT0gJ3N0cmluZydcclxuICAgICAgICAgID8gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLmFjdGl2YXRvcilcclxuICAgICAgICAgIDogdGhpcy5hY3RpdmF0b3JcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMuJHJlZnMuYWN0aXZhdG9yKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuJHJlZnMuYWN0aXZhdG9yLmNoaWxkcmVuLmxlbmd0aCA+IDBcclxuICAgICAgICAgID8gdGhpcy4kcmVmcy5hY3RpdmF0b3IuY2hpbGRyZW5bMF1cclxuICAgICAgICAgIDogdGhpcy4kcmVmcy5hY3RpdmF0b3JcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGUpIHtcclxuICAgICAgICB0aGlzLmFjdGl2YXRlZEJ5ID0gZS5jdXJyZW50VGFyZ2V0IHx8IGUudGFyZ2V0XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYWN0aXZhdGVkQnlcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMuYWN0aXZhdGVkQnkpIHJldHVybiB0aGlzLmFjdGl2YXRlZEJ5XHJcblxyXG4gICAgICBpZiAodGhpcy5hY3RpdmF0b3JOb2RlKSB7XHJcbiAgICAgICAgY29uc3QgYWN0aXZhdG9yID0gQXJyYXkuaXNBcnJheSh0aGlzLmFjdGl2YXRvck5vZGUpID8gdGhpcy5hY3RpdmF0b3JOb2RlWzBdIDogdGhpcy5hY3RpdmF0b3JOb2RlXHJcbiAgICAgICAgY29uc3QgZWwgPSBhY3RpdmF0b3IgJiYgYWN0aXZhdG9yLmVsbVxyXG4gICAgICAgIGlmIChlbCkgcmV0dXJuIGVsXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBnZXRJbm5lckhlaWdodCAoKSB7XHJcbiAgICAgIGlmICghdGhpcy5oYXNXaW5kb3cpIHJldHVybiAwXHJcblxyXG4gICAgICByZXR1cm4gd2luZG93LmlubmVySGVpZ2h0IHx8XHJcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodFxyXG4gICAgfSxcclxuICAgIGdldE9mZnNldExlZnQgKCkge1xyXG4gICAgICBpZiAoIXRoaXMuaGFzV2luZG93KSByZXR1cm4gMFxyXG5cclxuICAgICAgcmV0dXJuIHdpbmRvdy5wYWdlWE9mZnNldCB8fFxyXG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0XHJcbiAgICB9LFxyXG4gICAgZ2V0T2Zmc2V0VG9wICgpIHtcclxuICAgICAgaWYgKCF0aGlzLmhhc1dpbmRvdykgcmV0dXJuIDBcclxuXHJcbiAgICAgIHJldHVybiB3aW5kb3cucGFnZVlPZmZzZXQgfHxcclxuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wXHJcbiAgICB9LFxyXG4gICAgZ2V0Um91bmRlZEJvdW5kZWRDbGllbnRSZWN0IChlbCkge1xyXG4gICAgICBjb25zdCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0b3A6IE1hdGgucm91bmQocmVjdC50b3ApLFxyXG4gICAgICAgIGxlZnQ6IE1hdGgucm91bmQocmVjdC5sZWZ0KSxcclxuICAgICAgICBib3R0b206IE1hdGgucm91bmQocmVjdC5ib3R0b20pLFxyXG4gICAgICAgIHJpZ2h0OiBNYXRoLnJvdW5kKHJlY3QucmlnaHQpLFxyXG4gICAgICAgIHdpZHRoOiBNYXRoLnJvdW5kKHJlY3Qud2lkdGgpLFxyXG4gICAgICAgIGhlaWdodDogTWF0aC5yb3VuZChyZWN0LmhlaWdodClcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIG1lYXN1cmUgKGVsKSB7XHJcbiAgICAgIGlmICghZWwgfHwgIXRoaXMuaGFzV2luZG93KSByZXR1cm4gbnVsbFxyXG5cclxuICAgICAgY29uc3QgcmVjdCA9IHRoaXMuZ2V0Um91bmRlZEJvdW5kZWRDbGllbnRSZWN0KGVsKVxyXG5cclxuICAgICAgLy8gQWNjb3VudCBmb3IgYWN0aXZhdG9yIG1hcmdpblxyXG4gICAgICBpZiAodGhpcy5pc0F0dGFjaGVkKSB7XHJcbiAgICAgICAgY29uc3Qgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbClcclxuXHJcbiAgICAgICAgcmVjdC5sZWZ0ID0gcGFyc2VJbnQoc3R5bGUubWFyZ2luTGVmdClcclxuICAgICAgICByZWN0LnRvcCA9IHBhcnNlSW50KHN0eWxlLm1hcmdpblRvcClcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHJlY3RcclxuICAgIH0sXHJcbiAgICBzbmVha1BlZWsgKGNiKSB7XHJcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZWwgPSB0aGlzLiRyZWZzLmNvbnRlbnRcclxuXHJcbiAgICAgICAgaWYgKCFlbCB8fCB0aGlzLmlzU2hvd24oZWwpKSByZXR1cm4gY2IoKVxyXG5cclxuICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZS1ibG9jaydcclxuICAgICAgICBjYigpXHJcbiAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIHN0YXJ0VHJhbnNpdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5pc0NvbnRlbnRBY3RpdmUgPSB0aGlzLmhhc0p1c3RGb2N1c2VkID0gdGhpcy5pc0FjdGl2ZVxyXG4gICAgICAgIHJlc29sdmUoKVxyXG4gICAgICB9KSlcclxuICAgIH0sXHJcbiAgICBpc1Nob3duIChlbCkge1xyXG4gICAgICByZXR1cm4gZWwuc3R5bGUuZGlzcGxheSAhPT0gJ25vbmUnXHJcbiAgICB9LFxyXG4gICAgdXBkYXRlRGltZW5zaW9ucyAoKSB7XHJcbiAgICAgIHRoaXMuY2hlY2tGb3JXaW5kb3coKVxyXG4gICAgICB0aGlzLmNoZWNrQWN0aXZhdG9yRml4ZWQoKVxyXG4gICAgICB0aGlzLmNoZWNrRm9yUGFnZVlPZmZzZXQoKVxyXG4gICAgICB0aGlzLnBhZ2VXaWR0aCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aFxyXG5cclxuICAgICAgY29uc3QgZGltZW5zaW9ucyA9IHt9XHJcblxyXG4gICAgICAvLyBBY3RpdmF0b3Igc2hvdWxkIGFscmVhZHkgYmUgc2hvd25cclxuICAgICAgaWYgKCF0aGlzLmhhc0FjdGl2YXRvciB8fCB0aGlzLmFic29sdXRlKSB7XHJcbiAgICAgICAgZGltZW5zaW9ucy5hY3RpdmF0b3IgPSB0aGlzLmFic29sdXRlUG9zaXRpb24oKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IGFjdGl2YXRvciA9IHRoaXMuZ2V0QWN0aXZhdG9yKClcclxuICAgICAgICBkaW1lbnNpb25zLmFjdGl2YXRvciA9IHRoaXMubWVhc3VyZShhY3RpdmF0b3IpXHJcbiAgICAgICAgZGltZW5zaW9ucy5hY3RpdmF0b3Iub2Zmc2V0TGVmdCA9IGFjdGl2YXRvci5vZmZzZXRMZWZ0XHJcbiAgICAgICAgaWYgKHRoaXMuaXNBdHRhY2hlZCkge1xyXG4gICAgICAgICAgLy8gYWNjb3VudCBmb3IgY3NzIHBhZGRpbmcgY2F1c2luZyB0aGluZ3MgdG8gbm90IGxpbmUgdXBcclxuICAgICAgICAgIC8vIHRoaXMgaXMgbW9zdGx5IGZvciB2LWF1dG9jb21wbGV0ZSwgaG9wZWZ1bGx5IGl0IHdvbid0IGJyZWFrIGFueXRoaW5nXHJcbiAgICAgICAgICBkaW1lbnNpb25zLmFjdGl2YXRvci5vZmZzZXRUb3AgPSBhY3RpdmF0b3Iub2Zmc2V0VG9wXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGRpbWVuc2lvbnMuYWN0aXZhdG9yLm9mZnNldFRvcCA9IDBcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIERpc3BsYXkgYW5kIGhpZGUgdG8gZ2V0IGRpbWVuc2lvbnNcclxuICAgICAgdGhpcy5zbmVha1BlZWsoKCkgPT4ge1xyXG4gICAgICAgIGRpbWVuc2lvbnMuY29udGVudCA9IHRoaXMubWVhc3VyZSh0aGlzLiRyZWZzLmNvbnRlbnQpXHJcblxyXG4gICAgICAgIHRoaXMuZGltZW5zaW9ucyA9IGRpbWVuc2lvbnNcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiJdfQ==