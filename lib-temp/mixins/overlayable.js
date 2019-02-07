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
            const delta = e.deltaY || -e.wheelDelta;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3ZlcmxheWFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWl4aW5zL292ZXJsYXlhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFNBQVM7QUFDVCxPQUFPLG9DQUFvQyxDQUFBO0FBRTNDLFlBQVk7QUFDWixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUE7QUFFMUMsUUFBUTtBQUNSLE9BQU8sR0FBRyxNQUFNLEtBQUssQ0FBQTtBQWtCckIsb0JBQW9CO0FBQ3BCLGVBQWUsR0FBRyxDQUFDLE1BQU0sRUFBMEMsQ0FBQyxNQUFNLENBQUM7SUFDekUsSUFBSSxFQUFFLGFBQWE7SUFFbkIsS0FBSyxFQUFFO1FBQ0wsV0FBVyxFQUFFLE9BQU87S0FDckI7SUFFRCxJQUFJO1FBQ0YsT0FBTztZQUNMLE9BQU8sRUFBRSxJQUEwQjtZQUNuQyxhQUFhLEVBQUUsQ0FBQztZQUNoQixjQUFjLEVBQUUsU0FBK0I7WUFDL0MseUJBQXlCLEVBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxxQkFBcUI7U0FDM0QsQ0FBQTtJQUNILENBQUM7SUFFRCxLQUFLLEVBQUU7UUFDTCxXQUFXLENBQUUsS0FBSztZQUNoQixJQUFJLEtBQUs7Z0JBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFBOztnQkFDMUIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFBO1FBQ3hCLENBQUM7S0FDRjtJQUVELGFBQWE7UUFDWCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUE7SUFDdEIsQ0FBQztJQUVELE9BQU8sRUFBRTtRQUNQLFVBQVU7WUFDUix3Q0FBd0M7WUFDeEMsNEJBQTRCO1lBQzVCLDhDQUE4QztZQUM5QyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUM7Z0JBQ3RDLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDO2dCQUN0QyxJQUFJLENBQUMsT0FB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QyxDQUFBO29CQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO29CQUVqQixPQUFPLElBQUksQ0FBQTtpQkFDWjtnQkFFRCxFQUFFLEdBQUcsRUFBRSxDQUFDLGFBQWMsQ0FBQTthQUN2QjtZQUNELE9BQU8sSUFBSSxDQUFBO1FBQ2IsQ0FBQztRQUNELFVBQVU7WUFDUixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRTtnQkFDdEMsUUFBUSxDQUFDLGVBQWdCLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO2FBQzdEO2lCQUFNO2dCQUNMLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGNBQXFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQTtnQkFDaEcsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsY0FBcUMsQ0FBQyxDQUFBO2FBQy9FO1FBQ0gsQ0FBQztRQUNELFVBQVU7WUFDUixRQUFRLENBQUMsZUFBZ0IsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUE7WUFDL0QsTUFBTSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsY0FBcUMsQ0FBQyxDQUFBO1lBQy9FLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLGNBQXFDLENBQUMsQ0FBQTtRQUNuRixDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcclxuaW1wb3J0ICcuLi9zdHlsdXMvY29tcG9uZW50cy9fb3ZlcmxheS5zdHlsJ1xyXG5cclxuLy8gVXRpbGl0aWVzXHJcbmltcG9ydCB7IGtleUNvZGVzIH0gZnJvbSAnLi4vdXRpbC9oZWxwZXJzJ1xyXG5cclxuLy8gVHlwZXNcclxuaW1wb3J0IFZ1ZSBmcm9tICd2dWUnXHJcblxyXG5pbnRlcmZhY2UgVG9nZ2xlYWJsZSBleHRlbmRzIFZ1ZSB7XHJcbiAgaXNBY3RpdmU/OiBib29sZWFuXHJcbn1cclxuXHJcbmludGVyZmFjZSBTdGFja2FibGUgZXh0ZW5kcyBWdWUge1xyXG4gIGFjdGl2ZVpJbmRleDogbnVtYmVyXHJcbn1cclxuXHJcbmludGVyZmFjZSBvcHRpb25zIHtcclxuICBhYnNvbHV0ZT86IGJvb2xlYW5cclxuICAkcmVmczoge1xyXG4gICAgZGlhbG9nPzogSFRNTEVsZW1lbnRcclxuICAgIGNvbnRlbnQ/OiBIVE1MRWxlbWVudFxyXG4gIH1cclxufVxyXG5cclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuZXhwb3J0IGRlZmF1bHQgVnVlLmV4dGVuZDxWdWUgJiBUb2dnbGVhYmxlICYgU3RhY2thYmxlICYgb3B0aW9ucz4oKS5leHRlbmQoe1xyXG4gIG5hbWU6ICdvdmVybGF5YWJsZScsXHJcblxyXG4gIHByb3BzOiB7XHJcbiAgICBoaWRlT3ZlcmxheTogQm9vbGVhblxyXG4gIH0sXHJcblxyXG4gIGRhdGEgKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgb3ZlcmxheTogbnVsbCBhcyBIVE1MRWxlbWVudCB8IG51bGwsXHJcbiAgICAgIG92ZXJsYXlPZmZzZXQ6IDAsXHJcbiAgICAgIG92ZXJsYXlUaW1lb3V0OiB1bmRlZmluZWQgYXMgbnVtYmVyIHwgdW5kZWZpbmVkLFxyXG4gICAgICBvdmVybGF5VHJhbnNpdGlvbkR1cmF0aW9uOiA1MDAgKyAxNTAgLy8gdHJhbnNpdGlvbiArIGRlbGF5XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgd2F0Y2g6IHtcclxuICAgIGhpZGVPdmVybGF5ICh2YWx1ZSkge1xyXG4gICAgICBpZiAodmFsdWUpIHRoaXMucmVtb3ZlT3ZlcmxheSgpXHJcbiAgICAgIGVsc2UgdGhpcy5nZW5PdmVybGF5KClcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBiZWZvcmVEZXN0cm95ICgpIHtcclxuICAgIHRoaXMucmVtb3ZlT3ZlcmxheSgpXHJcbiAgfSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgZ2VuT3ZlcmxheSAoKSB7XHJcbiAgICAgIC8vIElmIGZuIGlzIGNhbGxlZCBhbmQgdGltZW91dCBpcyBhY3RpdmVcclxuICAgICAgLy8gb3Igb3ZlcmxheSBhbHJlYWR5IGV4aXN0c1xyXG4gICAgICAvLyBjYW5jZWwgcmVtb3ZhbCBvZiBvdmVybGF5IGFuZCByZS1hZGQgYWN0aXZlXHJcbiAgICAgIGlmICgoIXRoaXMuaXNBY3RpdmUgfHwgdGhpcy5oaWRlT3ZlcmxheSkgfHxcclxuICAgICAgICAodGhpcy5pc0FjdGl2ZSAmJiB0aGlzLm92ZXJsYXlUaW1lb3V0KSB8fFxyXG4gICAgICAgIHRoaXMub3ZlcmxheVxyXG4gICAgICApIHtcclxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5vdmVybGF5VGltZW91dClcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3ZlcmxheSAmJlxyXG4gICAgICAgICAgdGhpcy5vdmVybGF5LmNsYXNzTGlzdC5hZGQoJ3Ytb3ZlcmxheS0tYWN0aXZlJylcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5vdmVybGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgICAgdGhpcy5vdmVybGF5LmNsYXNzTmFtZSA9ICd2LW92ZXJsYXknXHJcblxyXG4gICAgICBpZiAodGhpcy5hYnNvbHV0ZSkgdGhpcy5vdmVybGF5LmNsYXNzTmFtZSArPSAnIHYtb3ZlcmxheS0tYWJzb2x1dGUnXHJcblxyXG4gICAgICB0aGlzLmhpZGVTY3JvbGwoKVxyXG5cclxuICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5hYnNvbHV0ZVxyXG4gICAgICAgID8gdGhpcy4kZWwucGFyZW50Tm9kZVxyXG4gICAgICAgIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtYXBwXScpXHJcblxyXG4gICAgICBwYXJlbnQgJiYgcGFyZW50Lmluc2VydEJlZm9yZSh0aGlzLm92ZXJsYXksIHBhcmVudC5maXJzdENoaWxkKVxyXG5cclxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC1leHByZXNzaW9uc1xyXG4gICAgICB0aGlzLm92ZXJsYXkuY2xpZW50SGVpZ2h0IC8vIEZvcmNlIHJlcGFpbnRcclxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdnVldGlmeWpzL3Z1ZXRpZnkvaXNzdWVzLzQ2NzhcclxuICAgICAgICBpZiAoIXRoaXMub3ZlcmxheSkgcmV0dXJuXHJcblxyXG4gICAgICAgIHRoaXMub3ZlcmxheS5jbGFzc05hbWUgKz0gJyB2LW92ZXJsYXktLWFjdGl2ZSdcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlWkluZGV4ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIHRoaXMub3ZlcmxheS5zdHlsZS56SW5kZXggPSBTdHJpbmcodGhpcy5hY3RpdmVaSW5kZXggLSAxKVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuXHJcbiAgICAgIHJldHVybiB0cnVlXHJcbiAgICB9LFxyXG4gICAgLyoqIHJlbW92ZU92ZXJsYXkoZmFsc2UpIHdpbGwgbm90IHJlc3RvcmUgdGhlIHNjb2xsYmFyIGFmdGVyd2FyZHMgKi9cclxuICAgIHJlbW92ZU92ZXJsYXkgKHNob3dTY3JvbGwgPSB0cnVlKSB7XHJcbiAgICAgIGlmICghdGhpcy5vdmVybGF5KSB7XHJcbiAgICAgICAgcmV0dXJuIHNob3dTY3JvbGwgJiYgdGhpcy5zaG93U2Nyb2xsKClcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5vdmVybGF5LmNsYXNzTGlzdC5yZW1vdmUoJ3Ytb3ZlcmxheS0tYWN0aXZlJylcclxuXHJcbiAgICAgIHRoaXMub3ZlcmxheVRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgLy8gSUUxMSBGaXhcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgaWYgKHRoaXMub3ZlcmxheSAmJiB0aGlzLm92ZXJsYXkucGFyZW50Tm9kZSkge1xyXG4gICAgICAgICAgICB0aGlzLm92ZXJsYXkucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLm92ZXJsYXkpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLm92ZXJsYXkgPSBudWxsXHJcbiAgICAgICAgICBzaG93U2Nyb2xsICYmIHRoaXMuc2hvd1Njcm9sbCgpXHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBjb25zb2xlLmxvZyhlKSB9XHJcblxyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLm92ZXJsYXlUaW1lb3V0KVxyXG4gICAgICAgIHRoaXMub3ZlcmxheVRpbWVvdXQgPSB1bmRlZmluZWRcclxuICAgICAgfSwgdGhpcy5vdmVybGF5VHJhbnNpdGlvbkR1cmF0aW9uKVxyXG4gICAgfSxcclxuICAgIHNjcm9sbExpc3RlbmVyIChlOiBXaGVlbEV2ZW50ICYgS2V5Ym9hcmRFdmVudCkge1xyXG4gICAgICBpZiAoZS50eXBlID09PSAna2V5ZG93bicpIHtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICBbJ0lOUFVUJywgJ1RFWFRBUkVBJywgJ1NFTEVDVCddLmluY2x1ZGVzKChlLnRhcmdldCBhcyBFbGVtZW50KS50YWdOYW1lKSB8fFxyXG4gICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3Z1ZXRpZnlqcy92dWV0aWZ5L2lzc3Vlcy80NzE1XHJcbiAgICAgICAgICAoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmlzQ29udGVudEVkaXRhYmxlXHJcbiAgICAgICAgKSByZXR1cm5cclxuXHJcbiAgICAgICAgY29uc3QgdXAgPSBba2V5Q29kZXMudXAsIGtleUNvZGVzLnBhZ2V1cF1cclxuICAgICAgICBjb25zdCBkb3duID0gW2tleUNvZGVzLmRvd24sIGtleUNvZGVzLnBhZ2Vkb3duXVxyXG5cclxuICAgICAgICBpZiAodXAuaW5jbHVkZXMoZS5rZXlDb2RlKSkge1xyXG4gICAgICAgICAgKGUgYXMgYW55KS5kZWx0YVkgPSAtMVxyXG4gICAgICAgIH0gZWxzZSBpZiAoZG93bi5pbmNsdWRlcyhlLmtleUNvZGUpKSB7XHJcbiAgICAgICAgICAoZSBhcyBhbnkpLmRlbHRhWSA9IDFcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZS50YXJnZXQgPT09IHRoaXMub3ZlcmxheSB8fFxyXG4gICAgICAgIChlLnR5cGUgIT09ICdrZXlkb3duJyAmJiBlLnRhcmdldCA9PT0gZG9jdW1lbnQuYm9keSkgfHxcclxuICAgICAgICB0aGlzLmNoZWNrUGF0aChlKSkgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICB9LFxyXG4gICAgaGFzU2Nyb2xsYmFyIChlbD86IEVsZW1lbnQpIHtcclxuICAgICAgaWYgKCFlbCB8fCBlbC5ub2RlVHlwZSAhPT0gTm9kZS5FTEVNRU5UX05PREUpIHJldHVybiBmYWxzZVxyXG5cclxuICAgICAgY29uc3Qgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbClcclxuICAgICAgcmV0dXJuIFsnYXV0bycsICdzY3JvbGwnXS5pbmNsdWRlcyhzdHlsZS5vdmVyZmxvd1khKSAmJiBlbC5zY3JvbGxIZWlnaHQgPiBlbC5jbGllbnRIZWlnaHRcclxuICAgIH0sXHJcbiAgICBzaG91bGRTY3JvbGwgKGVsOiBFbGVtZW50LCBkZWx0YTogbnVtYmVyKSB7XHJcbiAgICAgIGlmIChlbC5zY3JvbGxUb3AgPT09IDAgJiYgZGVsdGEgPCAwKSByZXR1cm4gdHJ1ZVxyXG4gICAgICByZXR1cm4gZWwuc2Nyb2xsVG9wICsgZWwuY2xpZW50SGVpZ2h0ID09PSBlbC5zY3JvbGxIZWlnaHQgJiYgZGVsdGEgPiAwXHJcbiAgICB9LFxyXG4gICAgaXNJbnNpZGUgKGVsOiBFbGVtZW50LCBwYXJlbnQ6IEVsZW1lbnQpOiBib29sZWFuIHtcclxuICAgICAgaWYgKGVsID09PSBwYXJlbnQpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICB9IGVsc2UgaWYgKGVsID09PSBudWxsIHx8IGVsID09PSBkb2N1bWVudC5ib2R5KSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNJbnNpZGUoZWwucGFyZW50Tm9kZSBhcyBFbGVtZW50LCBwYXJlbnQpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBjaGVja1BhdGggKGU6IFdoZWVsRXZlbnQpIHtcclxuICAgICAgY29uc3QgcGF0aCA9IGUucGF0aCB8fCB0aGlzLmNvbXBvc2VkUGF0aChlKVxyXG4gICAgICBjb25zdCBkZWx0YSA9IGUuZGVsdGFZIHx8IC1lLndoZWVsRGVsdGFcclxuXHJcbiAgICAgIGlmIChlLnR5cGUgPT09ICdrZXlkb3duJyAmJiBwYXRoWzBdID09PSBkb2N1bWVudC5ib2R5KSB7XHJcbiAgICAgICAgY29uc3QgZGlhbG9nID0gdGhpcy4kcmVmcy5kaWFsb2dcclxuICAgICAgICBjb25zdCBzZWxlY3RlZCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKS5hbmNob3JOb2RlIGFzIEVsZW1lbnRcclxuICAgICAgICBpZiAoZGlhbG9nICYmIHRoaXMuaGFzU2Nyb2xsYmFyKGRpYWxvZykgJiYgdGhpcy5pc0luc2lkZShzZWxlY3RlZCwgZGlhbG9nKSkge1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2hvdWxkU2Nyb2xsKGRpYWxvZywgZGVsdGEpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBwYXRoLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgIGNvbnN0IGVsID0gcGF0aFtpbmRleF1cclxuXHJcbiAgICAgICAgaWYgKGVsID09PSBkb2N1bWVudCkgcmV0dXJuIHRydWVcclxuICAgICAgICBpZiAoZWwgPT09IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkgcmV0dXJuIHRydWVcclxuICAgICAgICBpZiAoZWwgPT09IHRoaXMuJHJlZnMuY29udGVudCkgcmV0dXJuIHRydWVcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaGFzU2Nyb2xsYmFyKGVsIGFzIEVsZW1lbnQpKSByZXR1cm4gdGhpcy5zaG91bGRTY3JvbGwoZWwgYXMgRWxlbWVudCwgZGVsdGEpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0cnVlXHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiBQb2x5ZmlsbCBmb3IgRXZlbnQucHJvdG90eXBlLmNvbXBvc2VkUGF0aFxyXG4gICAgICovXHJcbiAgICBjb21wb3NlZFBhdGggKGU6IFdoZWVsRXZlbnQpOiBFdmVudFRhcmdldFtdIHtcclxuICAgICAgaWYgKGUuY29tcG9zZWRQYXRoKSByZXR1cm4gZS5jb21wb3NlZFBhdGgoKVxyXG5cclxuICAgICAgY29uc3QgcGF0aCA9IFtdXHJcbiAgICAgIGxldCBlbCA9IGUudGFyZ2V0IGFzIEVsZW1lbnRcclxuXHJcbiAgICAgIHdoaWxlIChlbCkge1xyXG4gICAgICAgIHBhdGgucHVzaChlbClcclxuXHJcbiAgICAgICAgaWYgKGVsLnRhZ05hbWUgPT09ICdIVE1MJykge1xyXG4gICAgICAgICAgcGF0aC5wdXNoKGRvY3VtZW50KVxyXG4gICAgICAgICAgcGF0aC5wdXNoKHdpbmRvdylcclxuXHJcbiAgICAgICAgICByZXR1cm4gcGF0aFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50IVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBwYXRoXHJcbiAgICB9LFxyXG4gICAgaGlkZVNjcm9sbCAoKSB7XHJcbiAgICAgIGlmICh0aGlzLiR2dWV0aWZ5LmJyZWFrcG9pbnQuc21BbmREb3duKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IS5jbGFzc0xpc3QuYWRkKCdvdmVyZmxvdy15LWhpZGRlbicpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgdGhpcy5zY3JvbGxMaXN0ZW5lciBhcyBFdmVudEhhbmRsZXJOb25OdWxsLCB7IHBhc3NpdmU6IGZhbHNlIH0pXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLnNjcm9sbExpc3RlbmVyIGFzIEV2ZW50SGFuZGxlck5vbk51bGwpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzaG93U2Nyb2xsICgpIHtcclxuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IS5jbGFzc0xpc3QucmVtb3ZlKCdvdmVyZmxvdy15LWhpZGRlbicpXHJcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCd3aGVlbCcsIHRoaXMuc2Nyb2xsTGlzdGVuZXIgYXMgRXZlbnRIYW5kbGVyTm9uTnVsbClcclxuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLnNjcm9sbExpc3RlbmVyIGFzIEV2ZW50SGFuZGxlck5vbk51bGwpXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iXX0=