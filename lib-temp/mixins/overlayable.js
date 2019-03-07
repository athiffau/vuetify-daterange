// Styles
import '../stylus/components/_overlay.styl';
// Utilities
import { keyCodes } from '../util/helpers';
// Types
import Vue from 'vue';
/* @vue/component */
export default Vue.extend().extend({
    name: 'overlayable',
    props: {
        hideOverlay: Boolean
    },
    data() {
        return {
            overlay: null,
            overlayOffset: 0,
            overlayTimeout: undefined,
            overlayTransitionDuration: 500 + 150 // transition + delay
        };
    },
    watch: {
        hideOverlay(value) {
            if (value)
                this.removeOverlay();
            else
                this.genOverlay();
        }
    },
    beforeDestroy() {
        this.removeOverlay();
    },
    methods: {
        genOverlay() {
            // If fn is called and timeout is active
            // or overlay already exists
            // cancel removal of overlay and re-add active
            if ((!this.isActive || this.hideOverlay) ||
                (this.isActive && this.overlayTimeout) ||
                this.overlay) {
                clearTimeout(this.overlayTimeout);
                return this.overlay &&
                    this.overlay.classList.add('v-overlay--active');
            }
            this.overlay = document.createElement('div');
            this.overlay.className = 'v-overlay';
            if (this.absolute)
                this.overlay.className += ' v-overlay--absolute';
            this.hideScroll();
            const parent = this.absolute
                ? this.$el.parentNode
                : document.querySelector('[data-app]');
            parent && parent.insertBefore(this.overlay, parent.firstChild);
            // eslint-disable-next-line no-unused-expressions
            this.overlay.clientHeight; // Force repaint
            requestAnimationFrame(() => {
                // https://github.com/vuetifyjs/vuetify/issues/4678
                if (!this.overlay)
                    return;
                this.overlay.className += ' v-overlay--active';
                if (this.activeZIndex !== undefined) {
                    this.overlay.style.zIndex = String(this.activeZIndex - 1);
                }
            });
            return true;
        },
        /** removeOverlay(false) will not restore the scollbar afterwards */
        removeOverlay(showScroll = true) {
            if (!this.overlay) {
                return showScroll && this.showScroll();
            }
            this.overlay.classList.remove('v-overlay--active');
            this.overlayTimeout = window.setTimeout(() => {
                // IE11 Fix
                try {
                    if (this.overlay && this.overlay.parentNode) {
                        this.overlay.parentNode.removeChild(this.overlay);
                    }
                    this.overlay = null;
                    showScroll && this.showScroll();
                }
                catch (e) {
                    console.log(e);
                }
                clearTimeout(this.overlayTimeout);
                this.overlayTimeout = undefined;
            }, this.overlayTransitionDuration);
        },
        scrollListener(e) {
            if (e.type === 'keydown') {
                if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) ||
                    // https://github.com/vuetifyjs/vuetify/issues/4715
                    e.target.isContentEditable)
                    return;
                const up = [keyCodes.up, keyCodes.pageup];
                const down = [keyCodes.down, keyCodes.pagedown];
                if (up.includes(e.keyCode)) {
                    e.deltaY = -1;
                }
                else if (down.includes(e.keyCode)) {
                    e.deltaY = 1;
                }
                else {
                    return;
                }
            }
            if (e.target === this.overlay ||
                (e.type !== 'keydown' && e.target === document.body) ||
                this.checkPath(e))
                e.preventDefault();
        },
        hasScrollbar(el) {
            if (!el || el.nodeType !== Node.ELEMENT_NODE)
                return false;
            const style = window.getComputedStyle(el);
            return ['auto', 'scroll'].includes(style.overflowY) && el.scrollHeight > el.clientHeight;
        },
        shouldScroll(el, delta) {
            if (el.scrollTop === 0 && delta < 0)
                return true;
            return el.scrollTop + el.clientHeight === el.scrollHeight && delta > 0;
        },
        isInside(el, parent) {
            if (el === parent) {
                return true;
            }
            else if (el === null || el === document.body) {
                return false;
            }
            else {
                return this.isInside(el.parentNode, parent);
            }
        },
        checkPath(e) {
            const path = e.path || this.composedPath(e);
            const delta = e.deltaY;
            if (e.type === 'keydown' && path[0] === document.body) {
                const dialog = this.$refs.dialog;
                const selected = window.getSelection().anchorNode;
                if (dialog && this.hasScrollbar(dialog) && this.isInside(selected, dialog)) {
                    return this.shouldScroll(dialog, delta);
                }
                return true;
            }
            for (let index = 0; index < path.length; index++) {
                const el = path[index];
                if (el === document)
                    return true;
                if (el === document.documentElement)
                    return true;
                if (el === this.$refs.content)
                    return true;
                if (this.hasScrollbar(el))
                    return this.shouldScroll(el, delta);
            }
            return true;
        },
        /**
         * Polyfill for Event.prototype.composedPath
         */
        composedPath(e) {
            if (e.composedPath)
                return e.composedPath();
            const path = [];
            let el = e.target;
            while (el) {
                path.push(el);
                if (el.tagName === 'HTML') {
                    path.push(document);
                    path.push(window);
                    return path;
                }
                el = el.parentElement;
            }
            return path;
        },
        hideScroll() {
            if (this.$vuetify.breakpoint.smAndDown) {
                document.documentElement.classList.add('overflow-y-hidden');
            }
            else {
                window.addEventListener('wheel', this.scrollListener, { passive: false });
                window.addEventListener('keydown', this.scrollListener);
            }
        },
        showScroll() {
            document.documentElement.classList.remove('overflow-y-hidden');
            window.removeEventListener('wheel', this.scrollListener);
            window.removeEventListener('keydown', this.scrollListener);
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3ZlcmxheWFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWl4aW5zL292ZXJsYXlhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFNBQVM7QUFDVCxPQUFPLG9DQUFvQyxDQUFBO0FBRTNDLFlBQVk7QUFDWixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUE7QUFFMUMsUUFBUTtBQUNSLE9BQU8sR0FBRyxNQUFNLEtBQUssQ0FBQTtBQWtCckIsb0JBQW9CO0FBQ3BCLGVBQWUsR0FBRyxDQUFDLE1BQU0sRUFBMEMsQ0FBQyxNQUFNLENBQUM7SUFDekUsSUFBSSxFQUFFLGFBQWE7SUFFbkIsS0FBSyxFQUFFO1FBQ0wsV0FBVyxFQUFFLE9BQU87S0FDckI7SUFFRCxJQUFJO1FBQ0YsT0FBTztZQUNMLE9BQU8sRUFBRSxJQUEwQjtZQUNuQyxhQUFhLEVBQUUsQ0FBQztZQUNoQixjQUFjLEVBQUUsU0FBK0I7WUFDL0MseUJBQXlCLEVBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxxQkFBcUI7U0FDM0QsQ0FBQTtJQUNILENBQUM7SUFFRCxLQUFLLEVBQUU7UUFDTCxXQUFXLENBQUUsS0FBSztZQUNoQixJQUFJLEtBQUs7Z0JBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFBOztnQkFDMUIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFBO1FBQ3hCLENBQUM7S0FDRjtJQUVELGFBQWE7UUFDWCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUE7SUFDdEIsQ0FBQztJQUVELE9BQU8sRUFBRTtRQUNQLFVBQVU7WUFDUix3Q0FBd0M7WUFDeEMsNEJBQTRCO1lBQzVCLDhDQUE4QztZQUM5QyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUM7Z0JBQ3RDLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDO2dCQUN0QyxJQUFJLENBQUMsT0FB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QUFJLENBQUMsTUFBTSxDQUFDLENBQUE7b0JBRWpCLE9BQU8sSUFBSSxDQUFBO2lCQUNaO2dCQUVELEVBQUUsR0FBRyxFQUFFLENBQUMsYUFBYyxDQUFBO2FBQ3ZCO1lBQ0QsT0FBTyxJQUFJLENBQUE7UUFDYixDQUFDO1FBQ0QsVUFBVTtZQUNSLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFO2dCQUN0QyxRQUFRLENBQUMsZUFBZ0IsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUE7YUFDN0Q7aUJBQU07Z0JBQ0wsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsY0FBcUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFBO2dCQUNoRyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxjQUFxQyxDQUFDLENBQUE7YUFDL0U7UUFDSCxDQUFDO1FBQ0QsVUFBVTtZQUNSLFFBQVEsQ0FBQyxlQUFnQixDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQTtZQUMvRCxNQUFNLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxjQUFxQyxDQUFDLENBQUE7WUFDL0UsTUFBTSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsY0FBcUMsQ0FBQyxDQUFBO1FBQ25GLENBQUM7S0FDRjtDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlc1xyXG5pbXBvcnQgJy4uL3N0eWx1cy9jb21wb25lbnRzL19vdmVybGF5LnN0eWwnXHJcblxyXG4vLyBVdGlsaXRpZXNcclxuaW1wb3J0IHsga2V5Q29kZXMgfSBmcm9tICcuLi91dGlsL2hlbHBlcnMnXHJcblxyXG4vLyBUeXBlc1xyXG5pbXBvcnQgVnVlIGZyb20gJ3Z1ZSdcclxuXHJcbmludGVyZmFjZSBUb2dnbGVhYmxlIGV4dGVuZHMgVnVlIHtcclxuICBpc0FjdGl2ZT86IGJvb2xlYW5cclxufVxyXG5cclxuaW50ZXJmYWNlIFN0YWNrYWJsZSBleHRlbmRzIFZ1ZSB7XHJcbiAgYWN0aXZlWkluZGV4OiBudW1iZXJcclxufVxyXG5cclxuaW50ZXJmYWNlIG9wdGlvbnMge1xyXG4gIGFic29sdXRlPzogYm9vbGVhblxyXG4gICRyZWZzOiB7XHJcbiAgICBkaWFsb2c/OiBIVE1MRWxlbWVudFxyXG4gICAgY29udGVudD86IEhUTUxFbGVtZW50XHJcbiAgfVxyXG59XHJcblxyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG5leHBvcnQgZGVmYXVsdCBWdWUuZXh0ZW5kPFZ1ZSAmIFRvZ2dsZWFibGUgJiBTdGFja2FibGUgJiBvcHRpb25zPigpLmV4dGVuZCh7XHJcbiAgbmFtZTogJ292ZXJsYXlhYmxlJyxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIGhpZGVPdmVybGF5OiBCb29sZWFuXHJcbiAgfSxcclxuXHJcbiAgZGF0YSAoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBvdmVybGF5OiBudWxsIGFzIEhUTUxFbGVtZW50IHwgbnVsbCxcclxuICAgICAgb3ZlcmxheU9mZnNldDogMCxcclxuICAgICAgb3ZlcmxheVRpbWVvdXQ6IHVuZGVmaW5lZCBhcyBudW1iZXIgfCB1bmRlZmluZWQsXHJcbiAgICAgIG92ZXJsYXlUcmFuc2l0aW9uRHVyYXRpb246IDUwMCArIDE1MCAvLyB0cmFuc2l0aW9uICsgZGVsYXlcclxuICAgIH1cclxuICB9LFxyXG5cclxuICB3YXRjaDoge1xyXG4gICAgaGlkZU92ZXJsYXkgKHZhbHVlKSB7XHJcbiAgICAgIGlmICh2YWx1ZSkgdGhpcy5yZW1vdmVPdmVybGF5KClcclxuICAgICAgZWxzZSB0aGlzLmdlbk92ZXJsYXkoKVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGJlZm9yZURlc3Ryb3kgKCkge1xyXG4gICAgdGhpcy5yZW1vdmVPdmVybGF5KClcclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICBnZW5PdmVybGF5ICgpIHtcclxuICAgICAgLy8gSWYgZm4gaXMgY2FsbGVkIGFuZCB0aW1lb3V0IGlzIGFjdGl2ZVxyXG4gICAgICAvLyBvciBvdmVybGF5IGFscmVhZHkgZXhpc3RzXHJcbiAgICAgIC8vIGNhbmNlbCByZW1vdmFsIG9mIG92ZXJsYXkgYW5kIHJlLWFkZCBhY3RpdmVcclxuICAgICAgaWYgKCghdGhpcy5pc0FjdGl2ZSB8fCB0aGlzLmhpZGVPdmVybGF5KSB8fFxyXG4gICAgICAgICh0aGlzLmlzQWN0aXZlICYmIHRoaXMub3ZlcmxheVRpbWVvdXQpIHx8XHJcbiAgICAgICAgdGhpcy5vdmVybGF5XHJcbiAgICAgICkge1xyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLm92ZXJsYXlUaW1lb3V0KVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5vdmVybGF5ICYmXHJcbiAgICAgICAgICB0aGlzLm92ZXJsYXkuY2xhc3NMaXN0LmFkZCgndi1vdmVybGF5LS1hY3RpdmUnKVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLm92ZXJsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgICB0aGlzLm92ZXJsYXkuY2xhc3NOYW1lID0gJ3Ytb3ZlcmxheSdcclxuXHJcbiAgICAgIGlmICh0aGlzLmFic29sdXRlKSB0aGlzLm92ZXJsYXkuY2xhc3NOYW1lICs9ICcgdi1vdmVybGF5LS1hYnNvbHV0ZSdcclxuXHJcbiAgICAgIHRoaXMuaGlkZVNjcm9sbCgpXHJcblxyXG4gICAgICBjb25zdCBwYXJlbnQgPSB0aGlzLmFic29sdXRlXHJcbiAgICAgICAgPyB0aGlzLiRlbC5wYXJlbnROb2RlXHJcbiAgICAgICAgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1hcHBdJylcclxuXHJcbiAgICAgIHBhcmVudCAmJiBwYXJlbnQuaW5zZXJ0QmVmb3JlKHRoaXMub3ZlcmxheSwgcGFyZW50LmZpcnN0Q2hpbGQpXHJcblxyXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLWV4cHJlc3Npb25zXHJcbiAgICAgIHRoaXMub3ZlcmxheS5jbGllbnRIZWlnaHQgLy8gRm9yY2UgcmVwYWludFxyXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xyXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS92dWV0aWZ5anMvdnVldGlmeS9pc3N1ZXMvNDY3OFxyXG4gICAgICAgIGlmICghdGhpcy5vdmVybGF5KSByZXR1cm5cclxuXHJcbiAgICAgICAgdGhpcy5vdmVybGF5LmNsYXNzTmFtZSArPSAnIHYtb3ZlcmxheS0tYWN0aXZlJ1xyXG5cclxuICAgICAgICBpZiAodGhpcy5hY3RpdmVaSW5kZXggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgdGhpcy5vdmVybGF5LnN0eWxlLnpJbmRleCA9IFN0cmluZyh0aGlzLmFjdGl2ZVpJbmRleCAtIDEpXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgcmV0dXJuIHRydWVcclxuICAgIH0sXHJcbiAgICAvKiogcmVtb3ZlT3ZlcmxheShmYWxzZSkgd2lsbCBub3QgcmVzdG9yZSB0aGUgc2NvbGxiYXIgYWZ0ZXJ3YXJkcyAqL1xyXG4gICAgcmVtb3ZlT3ZlcmxheSAoc2hvd1Njcm9sbCA9IHRydWUpIHtcclxuICAgICAgaWYgKCF0aGlzLm92ZXJsYXkpIHtcclxuICAgICAgICByZXR1cm4gc2hvd1Njcm9sbCAmJiB0aGlzLnNob3dTY3JvbGwoKVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLm92ZXJsYXkuY2xhc3NMaXN0LnJlbW92ZSgndi1vdmVybGF5LS1hY3RpdmUnKVxyXG5cclxuICAgICAgdGhpcy5vdmVybGF5VGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAvLyBJRTExIEZpeFxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5vdmVybGF5ICYmIHRoaXMub3ZlcmxheS5wYXJlbnROb2RlKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3ZlcmxheS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMub3ZlcmxheSlcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMub3ZlcmxheSA9IG51bGxcclxuICAgICAgICAgIHNob3dTY3JvbGwgJiYgdGhpcy5zaG93U2Nyb2xsKClcclxuICAgICAgICB9IGNhdGNoIChlKSB7IGNvbnNvbGUubG9nKGUpIH1cclxuXHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMub3ZlcmxheVRpbWVvdXQpXHJcbiAgICAgICAgdGhpcy5vdmVybGF5VGltZW91dCA9IHVuZGVmaW5lZFxyXG4gICAgICB9LCB0aGlzLm92ZXJsYXlUcmFuc2l0aW9uRHVyYXRpb24pXHJcbiAgICB9LFxyXG4gICAgc2Nyb2xsTGlzdGVuZXIgKGU6IFdoZWVsRXZlbnQgJiBLZXlib2FyZEV2ZW50KSB7XHJcbiAgICAgIGlmIChlLnR5cGUgPT09ICdrZXlkb3duJykge1xyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgIFsnSU5QVVQnLCAnVEVYVEFSRUEnLCAnU0VMRUNUJ10uaW5jbHVkZXMoKGUudGFyZ2V0IGFzIEVsZW1lbnQpLnRhZ05hbWUpIHx8XHJcbiAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdnVldGlmeWpzL3Z1ZXRpZnkvaXNzdWVzLzQ3MTVcclxuICAgICAgICAgIChlLnRhcmdldCBhcyBIVE1MRWxlbWVudCkuaXNDb250ZW50RWRpdGFibGVcclxuICAgICAgICApIHJldHVyblxyXG5cclxuICAgICAgICBjb25zdCB1cCA9IFtrZXlDb2Rlcy51cCwga2V5Q29kZXMucGFnZXVwXVxyXG4gICAgICAgIGNvbnN0IGRvd24gPSBba2V5Q29kZXMuZG93biwga2V5Q29kZXMucGFnZWRvd25dXHJcblxyXG4gICAgICAgIGlmICh1cC5pbmNsdWRlcyhlLmtleUNvZGUpKSB7XHJcbiAgICAgICAgICAoZSBhcyBhbnkpLmRlbHRhWSA9IC0xXHJcbiAgICAgICAgfSBlbHNlIGlmIChkb3duLmluY2x1ZGVzKGUua2V5Q29kZSkpIHtcclxuICAgICAgICAgIChlIGFzIGFueSkuZGVsdGFZID0gMVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChlLnRhcmdldCA9PT0gdGhpcy5vdmVybGF5IHx8XHJcbiAgICAgICAgKGUudHlwZSAhPT0gJ2tleWRvd24nICYmIGUudGFyZ2V0ID09PSBkb2N1bWVudC5ib2R5KSB8fFxyXG4gICAgICAgIHRoaXMuY2hlY2tQYXRoKGUpKSBlLnByZXZlbnREZWZhdWx0KClcclxuICAgIH0sXHJcbiAgICBoYXNTY3JvbGxiYXIgKGVsPzogRWxlbWVudCkge1xyXG4gICAgICBpZiAoIWVsIHx8IGVsLm5vZGVUeXBlICE9PSBOb2RlLkVMRU1FTlRfTk9ERSkgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgICBjb25zdCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKVxyXG4gICAgICByZXR1cm4gWydhdXRvJywgJ3Njcm9sbCddLmluY2x1ZGVzKHN0eWxlLm92ZXJmbG93WSEpICYmIGVsLnNjcm9sbEhlaWdodCA+IGVsLmNsaWVudEhlaWdodFxyXG4gICAgfSxcclxuICAgIHNob3VsZFNjcm9sbCAoZWw6IEVsZW1lbnQsIGRlbHRhOiBudW1iZXIpIHtcclxuICAgICAgaWYgKGVsLnNjcm9sbFRvcCA9PT0gMCAmJiBkZWx0YSA8IDApIHJldHVybiB0cnVlXHJcbiAgICAgIHJldHVybiBlbC5zY3JvbGxUb3AgKyBlbC5jbGllbnRIZWlnaHQgPT09IGVsLnNjcm9sbEhlaWdodCAmJiBkZWx0YSA+IDBcclxuICAgIH0sXHJcbiAgICBpc0luc2lkZSAoZWw6IEVsZW1lbnQsIHBhcmVudDogRWxlbWVudCk6IGJvb2xlYW4ge1xyXG4gICAgICBpZiAoZWwgPT09IHBhcmVudCkge1xyXG4gICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgIH0gZWxzZSBpZiAoZWwgPT09IG51bGwgfHwgZWwgPT09IGRvY3VtZW50LmJvZHkpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pc0luc2lkZShlbC5wYXJlbnROb2RlIGFzIEVsZW1lbnQsIHBhcmVudClcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGNoZWNrUGF0aCAoZTogV2hlZWxFdmVudCkge1xyXG4gICAgICBjb25zdCBwYXRoID0gZS5wYXRoIHx8IHRoaXMuY29tcG9zZWRQYXRoKGUpXHJcbiAgICAgIGNvbnN0IGRlbHRhID0gZS5kZWx0YVlcclxuXHJcbiAgICAgIGlmIChlLnR5cGUgPT09ICdrZXlkb3duJyAmJiBwYXRoWzBdID09PSBkb2N1bWVudC5ib2R5KSB7XHJcbiAgICAgICAgY29uc3QgZGlhbG9nID0gdGhpcy4kcmVmcy5kaWFsb2dcclxuICAgICAgICBjb25zdCBzZWxlY3RlZCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKS5hbmNob3JOb2RlIGFzIEVsZW1lbnRcclxuICAgICAgICBpZiAoZGlhbG9nICYmIHRoaXMuaGFzU2Nyb2xsYmFyKGRpYWxvZykgJiYgdGhpcy5pc0luc2lkZShzZWxlY3RlZCwgZGlhbG9nKSkge1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2hvdWxkU2Nyb2xsKGRpYWxvZywgZGVsdGEpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBwYXRoLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgIGNvbnN0IGVsID0gcGF0aFtpbmRleF1cclxuXHJcbiAgICAgICAgaWYgKGVsID09PSBkb2N1bWVudCkgcmV0dXJuIHRydWVcclxuICAgICAgICBpZiAoZWwgPT09IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkgcmV0dXJuIHRydWVcclxuICAgICAgICBpZiAoZWwgPT09IHRoaXMuJHJlZnMuY29udGVudCkgcmV0dXJuIHRydWVcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaGFzU2Nyb2xsYmFyKGVsIGFzIEVsZW1lbnQpKSByZXR1cm4gdGhpcy5zaG91bGRTY3JvbGwoZWwgYXMgRWxlbWVudCwgZGVsdGEpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0cnVlXHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiBQb2x5ZmlsbCBmb3IgRXZlbnQucHJvdG90eXBlLmNvbXBvc2VkUGF0aFxyXG4gICAgICovXHJcbiAgICBjb21wb3NlZFBhdGggKGU6IFdoZWVsRXZlbnQpOiBFdmVudFRhcmdldFtdIHtcclxuICAgICAgaWYgKGUuY29tcG9zZWRQYXRoKSByZXR1cm4gZS5jb21wb3NlZFBhdGgoKVxyXG5cclxuICAgICAgY29uc3QgcGF0aCA9IFtdXHJcbiAgICAgIGxldCBlbCA9IGUudGFyZ2V0IGFzIEVsZW1lbnRcclxuXHJcbiAgICAgIHdoaWxlIChlbCkge1xyXG4gICAgICAgIHBhdGgucHVzaChlbClcclxuXHJcbiAgICAgICAgaWYgKGVsLnRhZ05hbWUgPT09ICdIVE1MJykge1xyXG4gICAgICAgICAgcGF0aC5wdXNoKGRvY3VtZW50KVxyXG4gICAgICAgICAgcGF0aC5wdXNoKHdpbmRvdylcclxuXHJcbiAgICAgICAgICByZXR1cm4gcGF0aFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50IVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBwYXRoXHJcbiAgICB9LFxyXG4gICAgaGlkZVNjcm9sbCAoKSB7XHJcbiAgICAgIGlmICh0aGlzLiR2dWV0aWZ5LmJyZWFrcG9pbnQuc21BbmREb3duKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IS5jbGFzc0xpc3QuYWRkKCdvdmVyZmxvdy15LWhpZGRlbicpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgdGhpcy5zY3JvbGxMaXN0ZW5lciBhcyBFdmVudEhhbmRsZXJOb25OdWxsLCB7IHBhc3NpdmU6IGZhbHNlIH0pXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLnNjcm9sbExpc3RlbmVyIGFzIEV2ZW50SGFuZGxlck5vbk51bGwpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzaG93U2Nyb2xsICgpIHtcclxuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IS5jbGFzc0xpc3QucmVtb3ZlKCdvdmVyZmxvdy15LWhpZGRlbicpXHJcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCd3aGVlbCcsIHRoaXMuc2Nyb2xsTGlzdGVuZXIgYXMgRXZlbnRIYW5kbGVyTm9uTnVsbClcclxuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLnNjcm9sbExpc3RlbmVyIGFzIEV2ZW50SGFuZGxlck5vbk51bGwpXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iXX0=