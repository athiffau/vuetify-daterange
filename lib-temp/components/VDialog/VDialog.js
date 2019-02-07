import '../../stylus/components/_dialogs.styl';
// Mixins
import Dependent from '../../mixins/dependent';
import Detachable from '../../mixins/detachable';
import Overlayable from '../../mixins/overlayable';
import Returnable from '../../mixins/returnable';
import Stackable from '../../mixins/stackable';
import Toggleable from '../../mixins/toggleable';
// Directives
import ClickOutside from '../../directives/click-outside';
// Helpers
import { getZIndex, convertToUnit } from '../../util/helpers';
import ThemeProvider from '../../util/ThemeProvider';
/* @vue/component */
export default {
    name: 'v-dialog',
    directives: {
        ClickOutside
    },
    mixins: [
        Dependent,
        Detachable,
        Overlayable,
        Returnable,
        Stackable,
        Toggleable
    ],
    props: {
        disabled: Boolean,
        persistent: Boolean,
        fullscreen: Boolean,
        fullWidth: Boolean,
        noClickAnimation: Boolean,
        light: Boolean,
        dark: Boolean,
        maxWidth: {
            type: [String, Number],
            default: 'none'
        },
        origin: {
            type: String,
            default: 'center center'
        },
        width: {
            type: [String, Number],
            default: 'auto'
        },
        scrollable: Boolean,
        transition: {
            type: [String, Boolean],
            default: 'dialog-transition'
        }
    },
    data() {
        return {
            animate: false,
            animateTimeout: null,
            stackClass: 'v-dialog__content--active',
            stackMinZIndex: 200
        };
    },
    computed: {
        classes() {
            return {
                [(`v-dialog ${this.contentClass}`).trim()]: true,
                'v-dialog--active': this.isActive,
                'v-dialog--persistent': this.persistent,
                'v-dialog--fullscreen': this.fullscreen,
                'v-dialog--scrollable': this.scrollable,
                'v-dialog--animated': this.animate
            };
        },
        contentClasses() {
            return {
                'v-dialog__content': true,
                'v-dialog__content--active': this.isActive
            };
        },
        hasActivator() {
            return Boolean(!!this.$slots.activator ||
                !!this.$scopedSlots.activator);
        }
    },
    watch: {
        isActive(val) {
            if (val) {
                this.show();
                this.hideScroll();
            }
            else {
                this.removeOverlay();
                this.unbind();
            }
        },
        fullscreen(val) {
            if (!this.isActive)
                return;
            if (val) {
                this.hideScroll();
                this.removeOverlay(false);
            }
            else {
                this.showScroll();
                this.genOverlay();
            }
        }
    },
    beforeMount() {
        this.$nextTick(() => {
            this.isBooted = this.isActive;
            this.isActive && this.show();
        });
    },
    beforeDestroy() {
        if (typeof window !== 'undefined')
            this.unbind();
    },
    methods: {
        animateClick() {
            this.animate = false;
            // Needed for when clicking very fast
            // outside of the dialog
            this.$nextTick(() => {
                this.animate = true;
                clearTimeout(this.animateTimeout);
                this.animateTimeout = setTimeout(() => (this.animate = false), 150);
            });
        },
        closeConditional(e) {
            // If the dialog content contains
            // the click event, or if the
            // dialog is not active
            if (this.$refs.content.contains(e.target) ||
                !this.isActive)
                return false;
            // If we made it here, the click is outside
            // and is active. If persistent, and the
            // click is on the overlay, animate
            if (this.persistent) {
                if (!this.noClickAnimation &&
                    this.overlay === e.target)
                    this.animateClick();
                return false;
            }
            // close dialog if !persistent, clicked outside and we're the topmost dialog.
            // Since this should only be called in a capture event (bottom up), we shouldn't need to stop propagation
            return getZIndex(this.$refs.content) >= this.getMaxZIndex();
        },
        hideScroll() {
            if (this.fullscreen) {
                document.documentElement.classList.add('overflow-y-hidden');
            }
            else {
                Overlayable.options.methods.hideScroll.call(this);
            }
        },
        show() {
            !this.fullscreen && !this.hideOverlay && this.genOverlay();
            this.$refs.content.focus();
            this.$listeners.keydown && this.bind();
        },
        bind() {
            window.addEventListener('keydown', this.onKeydown);
        },
        unbind() {
            window.removeEventListener('keydown', this.onKeydown);
        },
        onKeydown(e) {
            this.$emit('keydown', e);
        },
        genActivator() {
            if (!this.hasActivator)
                return null;
            const listeners = this.disabled ? {} : {
                click: e => {
                    e.stopPropagation();
                    if (!this.disabled)
                        this.isActive = !this.isActive;
                }
            };
            if (this.$scopedSlots.activator && this.$scopedSlots.activator.length) {
                const activator = this.$scopedSlots.activator({ on: listeners });
                this.activatorNode = activator;
                return activator;
            }
            return this.$createElement('div', {
                staticClass: 'v-dialog__activator',
                'class': {
                    'v-dialog__activator--disabled': this.disabled
                },
                on: listeners
            }, this.$slots.activator);
        }
    },
    render(h) {
        const children = [];
        const data = {
            'class': this.classes,
            ref: 'dialog',
            directives: [
                {
                    name: 'click-outside',
                    value: () => (this.isActive = false),
                    args: {
                        closeConditional: this.closeConditional,
                        include: this.getOpenDependentElements
                    }
                },
                { name: 'show', value: this.isActive }
            ],
            on: {
                click: e => { e.stopPropagation(); }
            }
        };
        if (!this.fullscreen) {
            data.style = {
                maxWidth: this.maxWidth === 'none' ? undefined : convertToUnit(this.maxWidth),
                width: this.width === 'auto' ? undefined : convertToUnit(this.width)
            };
        }
        children.push(this.genActivator());
        let dialog = h('div', data, this.showLazyContent(this.$slots.default));
        if (this.transition) {
            dialog = h('transition', {
                props: {
                    name: this.transition,
                    origin: this.origin
                }
            }, [dialog]);
        }
        children.push(h('div', {
            'class': this.contentClasses,
            attrs: {
                tabIndex: '-1',
                ...this.getScopeIdAttrs()
            },
            style: { zIndex: this.activeZIndex },
            ref: 'content'
        }, [
            this.$createElement(ThemeProvider, {
                props: {
                    root: true,
                    light: this.light,
                    dark: this.dark
                }
            }, [dialog])
        ]));
        return h('div', {
            staticClass: 'v-dialog__container',
            style: {
                display: (!this.hasActivator || this.fullWidth) ? 'block' : 'inline-block'
            }
        }, children);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkRpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZEaWFsb2cvVkRpYWxvZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLHVDQUF1QyxDQUFBO0FBRTlDLFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUNoRCxPQUFPLFdBQVcsTUFBTSwwQkFBMEIsQ0FBQTtBQUNsRCxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUNoRCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUVoRCxhQUFhO0FBQ2IsT0FBTyxZQUFZLE1BQU0sZ0NBQWdDLENBQUE7QUFFekQsVUFBVTtBQUNWLE9BQU8sRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFDN0QsT0FBTyxhQUFhLE1BQU0sMEJBQTBCLENBQUE7QUFFcEQsb0JBQW9CO0FBQ3BCLGVBQWU7SUFDYixJQUFJLEVBQUUsVUFBVTtJQUVoQixVQUFVLEVBQUU7UUFDVixZQUFZO0tBQ2I7SUFFRCxNQUFNLEVBQUU7UUFDTixTQUFTO1FBQ1QsVUFBVTtRQUNWLFdBQVc7UUFDWCxVQUFVO1FBQ1YsU0FBUztRQUNULFVBQVU7S0FDWDtJQUVELEtBQUssRUFBRTtRQUNMLFFBQVEsRUFBRSxPQUFPO1FBQ2pCLFVBQVUsRUFBRSxPQUFPO1FBQ25CLFVBQVUsRUFBRSxPQUFPO1FBQ25CLFNBQVMsRUFBRSxPQUFPO1FBQ2xCLGdCQUFnQixFQUFFLE9BQU87UUFDekIsS0FBSyxFQUFFLE9BQU87UUFDZCxJQUFJLEVBQUUsT0FBTztRQUNiLFFBQVEsRUFBRTtZQUNSLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxFQUFFLE1BQU07U0FDaEI7UUFD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LENBQUMsQ0FBQztTQUNiLENBQUMsQ0FBQyxDQUFBO1FBRUgsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFO1lBQ2QsV0FBVyxFQUFFLHFCQUFxQjtZQUNsQyxLQUFLLEVBQUU7Z0JBQ0wsT0FBTyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxjQUFjO2FBQzNFO1NBQ0YsRUFBRSxRQUFRLENBQUMsQ0FBQTtJQUNkLENBQUM7Q0FDRixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuLi8uLi9zdHlsdXMvY29tcG9uZW50cy9fZGlhbG9ncy5zdHlsJ1xyXG5cclxuLy8gTWl4aW5zXHJcbmltcG9ydCBEZXBlbmRlbnQgZnJvbSAnLi4vLi4vbWl4aW5zL2RlcGVuZGVudCdcclxuaW1wb3J0IERldGFjaGFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2RldGFjaGFibGUnXHJcbmltcG9ydCBPdmVybGF5YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvb3ZlcmxheWFibGUnXHJcbmltcG9ydCBSZXR1cm5hYmxlIGZyb20gJy4uLy4uL21peGlucy9yZXR1cm5hYmxlJ1xyXG5pbXBvcnQgU3RhY2thYmxlIGZyb20gJy4uLy4uL21peGlucy9zdGFja2FibGUnXHJcbmltcG9ydCBUb2dnbGVhYmxlIGZyb20gJy4uLy4uL21peGlucy90b2dnbGVhYmxlJ1xyXG5cclxuLy8gRGlyZWN0aXZlc1xyXG5pbXBvcnQgQ2xpY2tPdXRzaWRlIGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvY2xpY2stb3V0c2lkZSdcclxuXHJcbi8vIEhlbHBlcnNcclxuaW1wb3J0IHsgZ2V0WkluZGV4LCBjb252ZXJ0VG9Vbml0IH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xyXG5pbXBvcnQgVGhlbWVQcm92aWRlciBmcm9tICcuLi8uLi91dGlsL1RoZW1lUHJvdmlkZXInXHJcblxyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgbmFtZTogJ3YtZGlhbG9nJyxcclxuXHJcbiAgZGlyZWN0aXZlczoge1xyXG4gICAgQ2xpY2tPdXRzaWRlXHJcbiAgfSxcclxuXHJcbiAgbWl4aW5zOiBbXHJcbiAgICBEZXBlbmRlbnQsXHJcbiAgICBEZXRhY2hhYmxlLFxyXG4gICAgT3ZlcmxheWFibGUsXHJcbiAgICBSZXR1cm5hYmxlLFxyXG4gICAgU3RhY2thYmxlLFxyXG4gICAgVG9nZ2xlYWJsZVxyXG4gIF0sXHJcblxyXG4gIHByb3BzOiB7XHJcbiAgICBkaXNhYmxlZDogQm9vbGVhbixcclxuICAgIHBlcnNpc3RlbnQ6IEJvb2xlYW4sXHJcbiAgICBmdWxsc2NyZWVuOiBCb29sZWFuLFxyXG4gICAgZnVsbFdpZHRoOiBCb29sZWFuLFxyXG4gICAgbm9DbGlja0FuaW1hdGlvbjogQm9vbGVhbixcclxuICAgIGxpZ2h0OiBCb29sZWFuLFxyXG4gICAgZGFyazogQm9vbGVhbixcclxuICAgIG1heFdpZHRoOiB7XHJcbiAgICAgIHR5cGU6IFtTdHJpbmcsIE51bWJlcl0sXHJcbiAgICAgIGRlZmF1bHQ6ICdub25lJ1xyXG4gICAgfSxcclxuICAgIG9yaWdpbjoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICdjZW50ZXIgY2VudGVyJ1xyXG4gICAgfSxcclxuICAgIHdpZHRoOiB7XHJcbiAgICAgIHR5cGU6IFtTdHJpbmcsIE51bWJlcl0sXHJcbiAgICAgIGRlZmF1bHQ6ICdhdXRvJ1xyXG4gICAgfSxcclxuICAgIHNjcm9sbGFibGU6IEJvb2xlYW4sXHJcbiAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgIHR5cGU6IFtTdHJpbmcsIEJvb2xlYW5dLFxyXG4gICAgICBkZWZhdWx0OiAnZGlhbG9nLXRyYW5zaXRpb24nXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZGF0YSAoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBhbmltYXRlOiBmYWxzZSxcclxuICAgICAgYW5pbWF0ZVRpbWVvdXQ6IG51bGwsXHJcbiAgICAgIHN0YWNrQ2xhc3M6ICd2LWRpYWxvZ19fY29udGVudC0tYWN0aXZlJyxcclxuICAgICAgc3RhY2tNaW5aSW5kZXg6IDIwMFxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICBjbGFzc2VzICgpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBbKGB2LWRpYWxvZyAke3RoaXMuY29udGVudENsYXNzfWApLnRyaW0oKV06IHRydWUsXHJcbiAgICAgICAgJ3YtZGlhbG9nLS1hY3RpdmUnOiB0aGlzLmlzQWN0aXZlLFxyXG4gICAgICAgICd2LWRpYWxvZy0tcGVyc2lzdGVudCc6IHRoaXMucGVyc2lzdGVudCxcclxuICAgICAgICAndi1kaWFsb2ctLWZ1bGxzY3JlZW4nOiB0aGlzLmZ1bGxzY3JlZW4sXHJcbiAgICAgICAgJ3YtZGlhbG9nLS1zY3JvbGxhYmxlJzogdGhpcy5zY3JvbGxhYmxlLFxyXG4gICAgICAgICd2LWRpYWxvZy0tYW5pbWF0ZWQnOiB0aGlzLmFuaW1hdGVcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGNvbnRlbnRDbGFzc2VzICgpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAndi1kaWFsb2dfX2NvbnRlbnQnOiB0cnVlLFxyXG4gICAgICAgICd2LWRpYWxvZ19fY29udGVudC0tYWN0aXZlJzogdGhpcy5pc0FjdGl2ZVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgaGFzQWN0aXZhdG9yICgpIHtcclxuICAgICAgcmV0dXJuIEJvb2xlYW4oXHJcbiAgICAgICAgISF0aGlzLiRzbG90cy5hY3RpdmF0b3IgfHxcclxuICAgICAgICAhIXRoaXMuJHNjb3BlZFNsb3RzLmFjdGl2YXRvclxyXG4gICAgICApXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgd2F0Y2g6IHtcclxuICAgIGlzQWN0aXZlICh2YWwpIHtcclxuICAgICAgaWYgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuc2hvdygpXHJcbiAgICAgICAgdGhpcy5oaWRlU2Nyb2xsKClcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnJlbW92ZU92ZXJsYXkoKVxyXG4gICAgICAgIHRoaXMudW5iaW5kKClcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGZ1bGxzY3JlZW4gKHZhbCkge1xyXG4gICAgICBpZiAoIXRoaXMuaXNBY3RpdmUpIHJldHVyblxyXG5cclxuICAgICAgaWYgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuaGlkZVNjcm9sbCgpXHJcbiAgICAgICAgdGhpcy5yZW1vdmVPdmVybGF5KGZhbHNlKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuc2hvd1Njcm9sbCgpXHJcbiAgICAgICAgdGhpcy5nZW5PdmVybGF5KClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGJlZm9yZU1vdW50ICgpIHtcclxuICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcclxuICAgICAgdGhpcy5pc0Jvb3RlZCA9IHRoaXMuaXNBY3RpdmVcclxuICAgICAgdGhpcy5pc0FjdGl2ZSAmJiB0aGlzLnNob3coKVxyXG4gICAgfSlcclxuICB9LFxyXG5cclxuICBiZWZvcmVEZXN0cm95ICgpIHtcclxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykgdGhpcy51bmJpbmQoKVxyXG4gIH0sXHJcblxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGFuaW1hdGVDbGljayAoKSB7XHJcbiAgICAgIHRoaXMuYW5pbWF0ZSA9IGZhbHNlXHJcbiAgICAgIC8vIE5lZWRlZCBmb3Igd2hlbiBjbGlja2luZyB2ZXJ5IGZhc3RcclxuICAgICAgLy8gb3V0c2lkZSBvZiB0aGUgZGlhbG9nXHJcbiAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcclxuICAgICAgICB0aGlzLmFuaW1hdGUgPSB0cnVlXHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuYW5pbWF0ZVRpbWVvdXQpXHJcbiAgICAgICAgdGhpcy5hbmltYXRlVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4gKHRoaXMuYW5pbWF0ZSA9IGZhbHNlKSwgMTUwKVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIGNsb3NlQ29uZGl0aW9uYWwgKGUpIHtcclxuICAgICAgLy8gSWYgdGhlIGRpYWxvZyBjb250ZW50IGNvbnRhaW5zXHJcbiAgICAgIC8vIHRoZSBjbGljayBldmVudCwgb3IgaWYgdGhlXHJcbiAgICAgIC8vIGRpYWxvZyBpcyBub3QgYWN0aXZlXHJcbiAgICAgIGlmICh0aGlzLiRyZWZzLmNvbnRlbnQuY29udGFpbnMoZS50YXJnZXQpIHx8XHJcbiAgICAgICAgIXRoaXMuaXNBY3RpdmVcclxuICAgICAgKSByZXR1cm4gZmFsc2VcclxuXHJcbiAgICAgIC8vIElmIHdlIG1hZGUgaXQgaGVyZSwgdGhlIGNsaWNrIGlzIG91dHNpZGVcclxuICAgICAgLy8gYW5kIGlzIGFjdGl2ZS4gSWYgcGVyc2lzdGVudCwgYW5kIHRoZVxyXG4gICAgICAvLyBjbGljayBpcyBvbiB0aGUgb3ZlcmxheSwgYW5pbWF0ZVxyXG4gICAgICBpZiAodGhpcy5wZXJzaXN0ZW50KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLm5vQ2xpY2tBbmltYXRpb24gJiZcclxuICAgICAgICAgIHRoaXMub3ZlcmxheSA9PT0gZS50YXJnZXRcclxuICAgICAgICApIHRoaXMuYW5pbWF0ZUNsaWNrKClcclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGNsb3NlIGRpYWxvZyBpZiAhcGVyc2lzdGVudCwgY2xpY2tlZCBvdXRzaWRlIGFuZCB3ZSdyZSB0aGUgdG9wbW9zdCBkaWFsb2cuXHJcbiAgICAgIC8vIFNpbmNlIHRoaXMgc2hvdWxkIG9ubHkgYmUgY2FsbGVkIGluIGEgY2FwdHVyZSBldmVudCAoYm90dG9tIHVwKSwgd2Ugc2hvdWxkbid0IG5lZWQgdG8gc3RvcCBwcm9wYWdhdGlvblxyXG4gICAgICByZXR1cm4gZ2V0WkluZGV4KHRoaXMuJHJlZnMuY29udGVudCkgPj0gdGhpcy5nZXRNYXhaSW5kZXgoKVxyXG4gICAgfSxcclxuICAgIGhpZGVTY3JvbGwgKCkge1xyXG4gICAgICBpZiAodGhpcy5mdWxsc2NyZWVuKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ292ZXJmbG93LXktaGlkZGVuJylcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBPdmVybGF5YWJsZS5vcHRpb25zLm1ldGhvZHMuaGlkZVNjcm9sbC5jYWxsKHRoaXMpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzaG93ICgpIHtcclxuICAgICAgIXRoaXMuZnVsbHNjcmVlbiAmJiAhdGhpcy5oaWRlT3ZlcmxheSAmJiB0aGlzLmdlbk92ZXJsYXkoKVxyXG4gICAgICB0aGlzLiRyZWZzLmNvbnRlbnQuZm9jdXMoKVxyXG4gICAgICB0aGlzLiRsaXN0ZW5lcnMua2V5ZG93biAmJiB0aGlzLmJpbmQoKVxyXG4gICAgfSxcclxuICAgIGJpbmQgKCkge1xyXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMub25LZXlkb3duKVxyXG4gICAgfSxcclxuICAgIHVuYmluZCAoKSB7XHJcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5vbktleWRvd24pXHJcbiAgICB9LFxyXG4gICAgb25LZXlkb3duIChlKSB7XHJcbiAgICAgIHRoaXMuJGVtaXQoJ2tleWRvd24nLCBlKVxyXG4gICAgfSxcclxuICAgIGdlbkFjdGl2YXRvciAoKSB7XHJcbiAgICAgIGlmICghdGhpcy5oYXNBY3RpdmF0b3IpIHJldHVybiBudWxsXHJcblxyXG4gICAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLmRpc2FibGVkID8ge30gOiB7XHJcbiAgICAgICAgY2xpY2s6IGUgPT4ge1xyXG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgICAgaWYgKCF0aGlzLmRpc2FibGVkKSB0aGlzLmlzQWN0aXZlID0gIXRoaXMuaXNBY3RpdmVcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLiRzY29wZWRTbG90cy5hY3RpdmF0b3IgJiYgdGhpcy4kc2NvcGVkU2xvdHMuYWN0aXZhdG9yLmxlbmd0aCkge1xyXG4gICAgICAgIGNvbnN0IGFjdGl2YXRvciA9IHRoaXMuJHNjb3BlZFNsb3RzLmFjdGl2YXRvcih7IG9uOiBsaXN0ZW5lcnMgfSlcclxuICAgICAgICB0aGlzLmFjdGl2YXRvck5vZGUgPSBhY3RpdmF0b3JcclxuICAgICAgICByZXR1cm4gYWN0aXZhdG9yXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XHJcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWRpYWxvZ19fYWN0aXZhdG9yJyxcclxuICAgICAgICAnY2xhc3MnOiB7XHJcbiAgICAgICAgICAndi1kaWFsb2dfX2FjdGl2YXRvci0tZGlzYWJsZWQnOiB0aGlzLmRpc2FibGVkXHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbjogbGlzdGVuZXJzXHJcbiAgICAgIH0sIHRoaXMuJHNsb3RzLmFjdGl2YXRvcilcclxuICAgIH1cclxuICB9LFxyXG5cclxuICByZW5kZXIgKGgpIHtcclxuICAgIGNvbnN0IGNoaWxkcmVuID0gW11cclxuICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgICdjbGFzcyc6IHRoaXMuY2xhc3NlcyxcclxuICAgICAgcmVmOiAnZGlhbG9nJyxcclxuICAgICAgZGlyZWN0aXZlczogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6ICdjbGljay1vdXRzaWRlJyxcclxuICAgICAgICAgIHZhbHVlOiAoKSA9PiAodGhpcy5pc0FjdGl2ZSA9IGZhbHNlKSxcclxuICAgICAgICAgIGFyZ3M6IHtcclxuICAgICAgICAgICAgY2xvc2VDb25kaXRpb25hbDogdGhpcy5jbG9zZUNvbmRpdGlvbmFsLFxyXG4gICAgICAgICAgICBpbmNsdWRlOiB0aGlzLmdldE9wZW5EZXBlbmRlbnRFbGVtZW50c1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgeyBuYW1lOiAnc2hvdycsIHZhbHVlOiB0aGlzLmlzQWN0aXZlIH1cclxuICAgICAgXSxcclxuICAgICAgb246IHtcclxuICAgICAgICBjbGljazogZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCkgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF0aGlzLmZ1bGxzY3JlZW4pIHtcclxuICAgICAgZGF0YS5zdHlsZSA9IHtcclxuICAgICAgICBtYXhXaWR0aDogdGhpcy5tYXhXaWR0aCA9PT0gJ25vbmUnID8gdW5kZWZpbmVkIDogY29udmVydFRvVW5pdCh0aGlzLm1heFdpZHRoKSxcclxuICAgICAgICB3aWR0aDogdGhpcy53aWR0aCA9PT0gJ2F1dG8nID8gdW5kZWZpbmVkIDogY29udmVydFRvVW5pdCh0aGlzLndpZHRoKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2hpbGRyZW4ucHVzaCh0aGlzLmdlbkFjdGl2YXRvcigpKVxyXG5cclxuICAgIGxldCBkaWFsb2cgPSBoKCdkaXYnLCBkYXRhLCB0aGlzLnNob3dMYXp5Q29udGVudCh0aGlzLiRzbG90cy5kZWZhdWx0KSlcclxuICAgIGlmICh0aGlzLnRyYW5zaXRpb24pIHtcclxuICAgICAgZGlhbG9nID0gaCgndHJhbnNpdGlvbicsIHtcclxuICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgbmFtZTogdGhpcy50cmFuc2l0aW9uLFxyXG4gICAgICAgICAgb3JpZ2luOiB0aGlzLm9yaWdpblxyXG4gICAgICAgIH1cclxuICAgICAgfSwgW2RpYWxvZ10pXHJcbiAgICB9XHJcblxyXG4gICAgY2hpbGRyZW4ucHVzaChoKCdkaXYnLCB7XHJcbiAgICAgICdjbGFzcyc6IHRoaXMuY29udGVudENsYXNzZXMsXHJcbiAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgdGFiSW5kZXg6ICctMScsXHJcbiAgICAgICAgLi4udGhpcy5nZXRTY29wZUlkQXR0cnMoKVxyXG4gICAgICB9LFxyXG4gICAgICBzdHlsZTogeyB6SW5kZXg6IHRoaXMuYWN0aXZlWkluZGV4IH0sXHJcbiAgICAgIHJlZjogJ2NvbnRlbnQnXHJcbiAgICB9LCBbXHJcbiAgICAgIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVGhlbWVQcm92aWRlciwge1xyXG4gICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICByb290OiB0cnVlLFxyXG4gICAgICAgICAgbGlnaHQ6IHRoaXMubGlnaHQsXHJcbiAgICAgICAgICBkYXJrOiB0aGlzLmRhcmtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIFtkaWFsb2ddKVxyXG4gICAgXSkpXHJcblxyXG4gICAgcmV0dXJuIGgoJ2RpdicsIHtcclxuICAgICAgc3RhdGljQ2xhc3M6ICd2LWRpYWxvZ19fY29udGFpbmVyJyxcclxuICAgICAgc3R5bGU6IHtcclxuICAgICAgICBkaXNwbGF5OiAoIXRoaXMuaGFzQWN0aXZhdG9yIHx8IHRoaXMuZnVsbFdpZHRoKSA/ICdibG9jaycgOiAnaW5saW5lLWJsb2NrJ1xyXG4gICAgICB9XHJcbiAgICB9LCBjaGlsZHJlbilcclxuICB9XHJcbn1cclxuIl19