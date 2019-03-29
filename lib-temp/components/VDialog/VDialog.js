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
import { convertToUnit, keyCodes, getSlotType } from '../../util/helpers';
import ThemeProvider from '../../util/ThemeProvider';
import { consoleError } from '../../util/console';
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
    mounted() {
        if (getSlotType(this, 'activator', true) === 'v-slot') {
            consoleError(`v-dialog's activator slot must be bound, try '<template #activator="data"><v-btn v-on="data.on>'`, this);
        }
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
            if (!this.isActive || this.$refs.content.contains(e.target))
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
            return this.activeZIndex >= this.getMaxZIndex();
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
            this.bind();
        },
        bind() {
            window.addEventListener('focusin', this.onFocusin);
        },
        unbind() {
            window.removeEventListener('focusin', this.onFocusin);
        },
        onKeydown(e) {
            if (e.keyCode === keyCodes.esc && !this.getOpenDependents().length) {
                if (!this.persistent) {
                    this.isActive = false;
                    const activator = this.getActivator();
                    this.$nextTick(() => activator && activator.focus());
                }
                else if (!this.noClickAnimation) {
                    this.animateClick();
                }
            }
            this.$emit('keydown', e);
        },
        onFocusin(e) {
            const { target } = event;
            if (
            // It isn't the document or the dialog body
            ![document, this.$refs.content].includes(target) &&
                // It isn't inside the dialog body
                !this.$refs.content.contains(target) &&
                // We're the topmost dialog
                this.activeZIndex >= this.getMaxZIndex() &&
                // It isn't inside a dependent element (like a menu)
                !this.getOpenDependentElements().some(el => el.contains(target))
            // So we must have focused something outside the dialog and its children
            ) {
                // Find and focus the first available element inside the dialog
                const focusable = this.$refs.content.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                focusable.length && focusable[0].focus();
            }
        },
        getActivator(e) {
            if (this.$refs.activator) {
                return this.$refs.activator.children.length > 0
                    ? this.$refs.activator.children[0]
                    : this.$refs.activator;
            }
            if (e) {
                this.activatedBy = e.currentTarget || e.target;
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
        genActivator() {
            if (!this.hasActivator)
                return null;
            const listeners = this.disabled ? {} : {
                click: e => {
                    e.stopPropagation();
                    this.getActivator(e);
                    if (!this.disabled)
                        this.isActive = !this.isActive;
                }
            };
            if (getSlotType(this, 'activator') === 'scoped') {
                const activator = this.$scopedSlots.activator({ on: listeners });
                this.activatorNode = activator;
                return activator;
            }
            return this.$createElement('div', {
                staticClass: 'v-dialog__activator',
                class: {
                    'v-dialog__activator--disabled': this.disabled
                },
                ref: 'activator',
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
                    value: () => { this.isActive = false; },
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
            on: {
                keydown: this.onKeydown
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkRpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZEaWFsb2cvVkRpYWxvZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLHVDQUF1QyxDQUFBO0FBRTlDLFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUNoRCxPQUFPLFdBQVcsTUFBTSwwQkFBMEIsQ0FBQTtBQUNsRCxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUNoRCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUVoRCxhQUFhO0FBQ2IsT0FBTyxZQUFZLE1BQU0sZ0NBQWdDLENBQUE7QUFFekQsVUFBVTtBQUNWLE9BQU8sRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQ3pFLE9BQU8sYUFBYSxNQUFNLDBCQUEwQixDQUFBO0FBQ3BELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUVqRCxvQkFBb0I7QUFDcEIsZUFBZTtJQUNiLElBQUksRUFBRSxVQUFVO0lBRWhCLFVBQVUsRUFBRTtRQUNWLFlBQVk7S0FDYjtJQUVELE1BQU0sRUFBRTtRQUNOLFNBQVM7UUFDVCxVQUFVO1FBQ1YsV0FBVztRQUNYLFVBQVU7UUFDVixTQUFTO1FBQ1QsVUFBVTtLQUNYO0lBRUQsS0FBSyxFQUFFO1FBQ0wsUUFBUSxFQUFFLE9BQU87UUFDakIsVUFBVSxFQUFFLE9BQU87UUFDbkIsVUFBVSxFQUFFLE9BQU87UUFDbkIsU0FBUyxFQUFFLE9BQU87UUFDbEIsZ0JBQWdCLEVBQUUsT0FBTztRQUN6QixLQUFLLEVBQUUsT0FBTztRQUNkLElBQUksRUFBRSxPQUFPO1FBQ2IsUUFBUSxFQUFFO1lBQ1IsSUFBSSxFQUFFLENB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Z0JBQ2pDLEtBQUssRUFBRTtvQkFDTCxJQUFJLEVBQUUsSUFBSTtvQkFDVixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7b0JBQ2pCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtpQkFDaEI7YUFDRixFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDYixDQUFDLENBQUMsQ0FBQTtRQUVILE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRTtZQUNkLFdBQVcsRUFBRSxxQkFBcUI7WUFDbEMsS0FBSyxFQUFFO2dCQUNMLE9BQU8sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsY0FBYzthQUMzRTtTQUNGLEVBQUUsUUFBUSxDQUFDLENBQUE7SUFDZCxDQUFDO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi4vLi4vc3R5bHVzL2NvbXBvbmVudHMvX2RpYWxvZ3Muc3R5bCdcclxuXHJcbi8vIE1peGluc1xyXG5pbXBvcnQgRGVwZW5kZW50IGZyb20gJy4uLy4uL21peGlucy9kZXBlbmRlbnQnXHJcbmltcG9ydCBEZXRhY2hhYmxlIGZyb20gJy4uLy4uL21peGlucy9kZXRhY2hhYmxlJ1xyXG5pbXBvcnQgT3ZlcmxheWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL292ZXJsYXlhYmxlJ1xyXG5pbXBvcnQgUmV0dXJuYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvcmV0dXJuYWJsZSdcclxuaW1wb3J0IFN0YWNrYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvc3RhY2thYmxlJ1xyXG5pbXBvcnQgVG9nZ2xlYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdG9nZ2xlYWJsZSdcclxuXHJcbi8vIERpcmVjdGl2ZXNcclxuaW1wb3J0IENsaWNrT3V0c2lkZSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL2NsaWNrLW91dHNpZGUnXHJcblxyXG4vLyBIZWxwZXJzXHJcbmltcG9ydCB7IGNvbnZlcnRUb1VuaXQsIGtleUNvZGVzLCBnZXRTbG90VHlwZSB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcclxuaW1wb3J0IFRoZW1lUHJvdmlkZXIgZnJvbSAnLi4vLi4vdXRpbC9UaGVtZVByb3ZpZGVyJ1xyXG5pbXBvcnQgeyBjb25zb2xlRXJyb3IgfSBmcm9tICcuLi8uLi91dGlsL2NvbnNvbGUnXHJcblxyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgbmFtZTogJ3YtZGlhbG9nJyxcclxuXHJcbiAgZGlyZWN0aXZlczoge1xyXG4gICAgQ2xpY2tPdXRzaWRlXHJcbiAgfSxcclxuXHJcbiAgbWl4aW5zOiBbXHJcbiAgICBEZXBlbmRlbnQsXHJcbiAgICBEZXRhY2hhYmxlLFxyXG4gICAgT3ZlcmxheWFibGUsXHJcbiAgICBSZXR1cm5hYmxlLFxyXG4gICAgU3RhY2thYmxlLFxyXG4gICAgVG9nZ2xlYWJsZVxyXG4gIF0sXHJcblxyXG4gIHByb3BzOiB7XHJcbiAgICBkaXNhYmxlZDogQm9vbGVhbixcclxuICAgIHBlcnNpc3RlbnQ6IEJvb2xlYW4sXHJcbiAgICBmdWxsc2NyZWVuOiBCb29sZWFuLFxyXG4gICAgZnVsbFdpZHRoOiBCb29sZWFuLFxyXG4gICAgbm9DbGlja0FuaW1hdGlvbjogQm9vbGVhbixcclxuICAgIGxpZ2h0OiBCb29sZWFuLFxyXG4gICAgZGFyazogQm9vbGVhbixcclxuICAgIG1heFdpZHRoOiB7XHJcbiAgICAgIHR5cGU6IFtTdHJpbmcsIE51bWJlcl0sXHJcbiAgICAgIGRlZmF1bHQ6ICdub25lJ1xyXG4gICAgfSxcclxuICAgIG9yaWdpbjoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICdjZW50ZXIgY2VudGVyJ1xyXG4gICAgfSxcclxuICAgIHdpZHRoOiB7XHJcbiAgICAgIHR5cGU6IFtTdHJpbmcsIE51bWJlcl0sXHJcbiAgICAgIGRlZmF1bHQ6ICdhdXRvJ1xyXG4gICAgfSxcclxuICAgIHNjcm9sbGFibGU6IEJvb2xlYW4sXHJcbiAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgIHR5cGU6IFtTdHJpbmcsIEJvb2xlYW5dLFxyXG4gICAgICBkZWZhdWx0OiAnZGlhbG9nLXRyYW5zaXRpb24nXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZGF0YSAoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBhbmltYXRlOiBmYWxzZSxcclxuICAgICAgYW5pbWF0ZVRpbWVvdXQ6IG51bGwsXHJcbiAgICAgIHN0YWNrQ2xhc3M6ICd2LWRpYWxvZ19fY29udGVudC0tYWN0aXZlJyxcclxuICAgICAgc3RhY2tNaW5aSW5kZXg6IDIwMFxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICBjbGFzc2VzICgpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBbKGB2LWRpYWxvZyAke3RoaXMuY29udGVudENsYXNzfWApLnRyaW0oKV06IHRydWUsXHJcbiAgICAgICAgJ3YtZGlhbG9nLS1hY3RpdmUnOiB0aGlzLmlzQWN0aXZlLFxyXG4gICAgICAgICd2LWRpYWxvZy0tcGVyc2lzdGVudCc6IHRoaXMucGVyc2lzdGVudCxcclxuICAgICAgICAndi1kaWFsb2ctLWZ1bGxzY3JlZW4nOiB0aGlzLmZ1bGxzY3JlZW4sXHJcbiAgICAgICAgJ3YtZGlhbG9nLS1zY3JvbGxhYmxlJzogdGhpcy5zY3JvbGxhYmxlLFxyXG4gICAgICAgICd2LWRpYWxvZy0tYW5pbWF0ZWQnOiB0aGlzLmFuaW1hdGVcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGNvbnRlbnRDbGFzc2VzICgpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAndi1kaWFsb2dfX2NvbnRlbnQnOiB0cnVlLFxyXG4gICAgICAgICd2LWRpYWxvZ19fY29udGVudC0tYWN0aXZlJzogdGhpcy5pc0FjdGl2ZVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgaGFzQWN0aXZhdG9yICgpIHtcclxuICAgICAgcmV0dXJuIEJvb2xlYW4oXHJcbiAgICAgICAgISF0aGlzLiRzbG90cy5hY3RpdmF0b3IgfHxcclxuICAgICAgICAhIXRoaXMuJHNjb3BlZFNsb3RzLmFjdGl2YXRvclxyXG4gICAgICApXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgd2F0Y2g6IHtcclxuICAgIGlzQWN0aXZlICh2YWwpIHtcclxuICAgICAgaWYgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuc2hvdygpXHJcbiAgICAgICAgdGhpcy5oaWRlU2Nyb2xsKClcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnJlbW92ZU92ZXJsYXkoKVxyXG4gICAgICAgIHRoaXMudW5iaW5kKClcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGZ1bGxzY3JlZW4gKHZhbCkge1xyXG4gICAgICBpZiAoIXRoaXMuaXNBY3RpdmUpIHJldHVyblxyXG5cclxuICAgICAgaWYgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuaGlkZVNjcm9sbCgpXHJcbiAgICAgICAgdGhpcy5yZW1vdmVPdmVybGF5KGZhbHNlKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuc2hvd1Njcm9sbCgpXHJcbiAgICAgICAgdGhpcy5nZW5PdmVybGF5KClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGJlZm9yZU1vdW50ICgpIHtcclxuICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcclxuICAgICAgdGhpcy5pc0Jvb3RlZCA9IHRoaXMuaXNBY3RpdmVcclxuICAgICAgdGhpcy5pc0FjdGl2ZSAmJiB0aGlzLnNob3coKVxyXG4gICAgfSlcclxuICB9LFxyXG5cclxuICBtb3VudGVkICgpIHtcclxuICAgIGlmIChnZXRTbG90VHlwZSh0aGlzLCAnYWN0aXZhdG9yJywgdHJ1ZSkgPT09ICd2LXNsb3QnKSB7XHJcbiAgICAgIGNvbnNvbGVFcnJvcihgdi1kaWFsb2cncyBhY3RpdmF0b3Igc2xvdCBtdXN0IGJlIGJvdW5kLCB0cnkgJzx0ZW1wbGF0ZSAjYWN0aXZhdG9yPVwiZGF0YVwiPjx2LWJ0biB2LW9uPVwiZGF0YS5vbj4nYCwgdGhpcylcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBiZWZvcmVEZXN0cm95ICgpIHtcclxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykgdGhpcy51bmJpbmQoKVxyXG4gIH0sXHJcblxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGFuaW1hdGVDbGljayAoKSB7XHJcbiAgICAgIHRoaXMuYW5pbWF0ZSA9IGZhbHNlXHJcbiAgICAgIC8vIE5lZWRlZCBmb3Igd2hlbiBjbGlja2luZyB2ZXJ5IGZhc3RcclxuICAgICAgLy8gb3V0c2lkZSBvZiB0aGUgZGlhbG9nXHJcbiAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcclxuICAgICAgICB0aGlzLmFuaW1hdGUgPSB0cnVlXHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuYW5pbWF0ZVRpbWVvdXQpXHJcbiAgICAgICAgdGhpcy5hbmltYXRlVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4gKHRoaXMuYW5pbWF0ZSA9IGZhbHNlKSwgMTUwKVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIGNsb3NlQ29uZGl0aW9uYWwgKGUpIHtcclxuICAgICAgLy8gSWYgdGhlIGRpYWxvZyBjb250ZW50IGNvbnRhaW5zXHJcbiAgICAgIC8vIHRoZSBjbGljayBldmVudCwgb3IgaWYgdGhlXHJcbiAgICAgIC8vIGRpYWxvZyBpcyBub3QgYWN0aXZlXHJcbiAgICAgIGlmICghdGhpcy5pc0FjdGl2ZSB8fCB0aGlzLiRyZWZzLmNvbnRlbnQuY29udGFpbnMoZS50YXJnZXQpKSByZXR1cm4gZmFsc2VcclxuXHJcbiAgICAgIC8vIElmIHdlIG1hZGUgaXQgaGVyZSwgdGhlIGNsaWNrIGlzIG91dHNpZGVcclxuICAgICAgLy8gYW5kIGlzIGFjdGl2ZS4gSWYgcGVyc2lzdGVudCwgYW5kIHRoZVxyXG4gICAgICAvLyBjbGljayBpcyBvbiB0aGUgb3ZlcmxheSwgYW5pbWF0ZVxyXG4gICAgICBpZiAodGhpcy5wZXJzaXN0ZW50KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLm5vQ2xpY2tBbmltYXRpb24gJiZcclxuICAgICAgICAgIHRoaXMub3ZlcmxheSA9PT0gZS50YXJnZXRcclxuICAgICAgICApIHRoaXMuYW5pbWF0ZUNsaWNrKClcclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGNsb3NlIGRpYWxvZyBpZiAhcGVyc2lzdGVudCwgY2xpY2tlZCBvdXRzaWRlIGFuZCB3ZSdyZSB0aGUgdG9wbW9zdCBkaWFsb2cuXHJcbiAgICAgIC8vIFNpbmNlIHRoaXMgc2hvdWxkIG9ubHkgYmUgY2FsbGVkIGluIGEgY2FwdHVyZSBldmVudCAoYm90dG9tIHVwKSwgd2Ugc2hvdWxkbid0IG5lZWQgdG8gc3RvcCBwcm9wYWdhdGlvblxyXG4gICAgICByZXR1cm4gdGhpcy5hY3RpdmVaSW5kZXggPj0gdGhpcy5nZXRNYXhaSW5kZXgoKVxyXG4gICAgfSxcclxuICAgIGhpZGVTY3JvbGwgKCkge1xyXG4gICAgICBpZiAodGhpcy5mdWxsc2NyZWVuKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ292ZXJmbG93LXktaGlkZGVuJylcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBPdmVybGF5YWJsZS5vcHRpb25zLm1ldGhvZHMuaGlkZVNjcm9sbC5jYWxsKHRoaXMpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzaG93ICgpIHtcclxuICAgICAgIXRoaXMuZnVsbHNjcmVlbiAmJiAhdGhpcy5oaWRlT3ZlcmxheSAmJiB0aGlzLmdlbk92ZXJsYXkoKVxyXG4gICAgICB0aGlzLiRyZWZzLmNvbnRlbnQuZm9jdXMoKVxyXG4gICAgICB0aGlzLmJpbmQoKVxyXG4gICAgfSxcclxuICAgIGJpbmQgKCkge1xyXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXNpbicsIHRoaXMub25Gb2N1c2luKVxyXG4gICAgfSxcclxuICAgIHVuYmluZCAoKSB7XHJcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1c2luJywgdGhpcy5vbkZvY3VzaW4pXHJcbiAgICB9LFxyXG4gICAgb25LZXlkb3duIChlKSB7XHJcbiAgICAgIGlmIChlLmtleUNvZGUgPT09IGtleUNvZGVzLmVzYyAmJiAhdGhpcy5nZXRPcGVuRGVwZW5kZW50cygpLmxlbmd0aCkge1xyXG4gICAgICAgIGlmICghdGhpcy5wZXJzaXN0ZW50KSB7XHJcbiAgICAgICAgICB0aGlzLmlzQWN0aXZlID0gZmFsc2VcclxuICAgICAgICAgIGNvbnN0IGFjdGl2YXRvciA9IHRoaXMuZ2V0QWN0aXZhdG9yKClcclxuICAgICAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IGFjdGl2YXRvciAmJiBhY3RpdmF0b3IuZm9jdXMoKSlcclxuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLm5vQ2xpY2tBbmltYXRpb24pIHtcclxuICAgICAgICAgIHRoaXMuYW5pbWF0ZUNsaWNrKClcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy4kZW1pdCgna2V5ZG93bicsIGUpXHJcbiAgICB9LFxyXG4gICAgb25Gb2N1c2luIChlKSB7XHJcbiAgICAgIGNvbnN0IHsgdGFyZ2V0IH0gPSBldmVudFxyXG5cclxuICAgICAgaWYgKFxyXG4gICAgICAgIC8vIEl0IGlzbid0IHRoZSBkb2N1bWVudCBvciB0aGUgZGlhbG9nIGJvZHlcclxuICAgICAgICAhW2RvY3VtZW50LCB0aGlzLiRyZWZzLmNvbnRlbnRdLmluY2x1ZGVzKHRhcmdldCkgJiZcclxuICAgICAgICAvLyBJdCBpc24ndCBpbnNpZGUgdGhlIGRpYWxvZyBib2R5XHJcbiAgICAgICAgIXRoaXMuJHJlZnMuY29udGVudC5jb250YWlucyh0YXJnZXQpICYmXHJcbiAgICAgICAgLy8gV2UncmUgdGhlIHRvcG1vc3QgZGlhbG9nXHJcbiAgICAgICAgdGhpcy5hY3RpdmVaSW5kZXggPj0gdGhpcy5nZXRNYXhaSW5kZXgoKSAmJlxyXG4gICAgICAgIC8vIEl0IGlzbid0IGluc2lkZSBhIGRlcGVuZGVudCBlbGVtZW50IChsaWtlIGEgbWVudSlcclxuICAgICAgICAhdGhpcy5nZXRPcGVuRGVwZW5kZW50RWxlbWVudHMoKS5zb21lKGVsID0+IGVsLmNvbnRhaW5zKHRhcmdldCkpXHJcbiAgICAgICAgLy8gU28gd2UgbXVzdCBoYXZlIGZvY3VzZWQgc29tZXRoaW5nIG91dHNpZGUgdGhlIGRpYWxvZyBhbmQgaXRzIGNoaWxkcmVuXHJcbiAgICAgICkge1xyXG4gICAgICAgIC8vIEZpbmQgYW5kIGZvY3VzIHRoZSBmaXJzdCBhdmFpbGFibGUgZWxlbWVudCBpbnNpZGUgdGhlIGRpYWxvZ1xyXG4gICAgICAgIGNvbnN0IGZvY3VzYWJsZSA9IHRoaXMuJHJlZnMuY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCdidXR0b24sIFtocmVmXSwgaW5wdXQsIHNlbGVjdCwgdGV4dGFyZWEsIFt0YWJpbmRleF06bm90KFt0YWJpbmRleD1cIi0xXCJdKScpXHJcbiAgICAgICAgZm9jdXNhYmxlLmxlbmd0aCAmJiBmb2N1c2FibGVbMF0uZm9jdXMoKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgZ2V0QWN0aXZhdG9yIChlKSB7XHJcbiAgICAgIGlmICh0aGlzLiRyZWZzLmFjdGl2YXRvcikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiRyZWZzLmFjdGl2YXRvci5jaGlsZHJlbi5sZW5ndGggPiAwXHJcbiAgICAgICAgICA/IHRoaXMuJHJlZnMuYWN0aXZhdG9yLmNoaWxkcmVuWzBdXHJcbiAgICAgICAgICA6IHRoaXMuJHJlZnMuYWN0aXZhdG9yXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChlKSB7XHJcbiAgICAgICAgdGhpcy5hY3RpdmF0ZWRCeSA9IGUuY3VycmVudFRhcmdldCB8fCBlLnRhcmdldFxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5hY3RpdmF0ZWRCeSkgcmV0dXJuIHRoaXMuYWN0aXZhdGVkQnlcclxuXHJcbiAgICAgIGlmICh0aGlzLmFjdGl2YXRvck5vZGUpIHtcclxuICAgICAgICBjb25zdCBhY3RpdmF0b3IgPSBBcnJheS5pc0FycmF5KHRoaXMuYWN0aXZhdG9yTm9kZSkgPyB0aGlzLmFjdGl2YXRvck5vZGVbMF0gOiB0aGlzLmFjdGl2YXRvck5vZGVcclxuICAgICAgICBjb25zdCBlbCA9IGFjdGl2YXRvciAmJiBhY3RpdmF0b3IuZWxtXHJcbiAgICAgICAgaWYgKGVsKSByZXR1cm4gZWxcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc29sZUVycm9yKCdObyBhY3RpdmF0b3IgZm91bmQnKVxyXG4gICAgfSxcclxuICAgIGdlbkFjdGl2YXRvciAoKSB7XHJcbiAgICAgIGlmICghdGhpcy5oYXNBY3RpdmF0b3IpIHJldHVybiBudWxsXHJcblxyXG4gICAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLmRpc2FibGVkID8ge30gOiB7XHJcbiAgICAgICAgY2xpY2s6IGUgPT4ge1xyXG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgICAgdGhpcy5nZXRBY3RpdmF0b3IoZSlcclxuICAgICAgICAgIGlmICghdGhpcy5kaXNhYmxlZCkgdGhpcy5pc0FjdGl2ZSA9ICF0aGlzLmlzQWN0aXZlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZ2V0U2xvdFR5cGUodGhpcywgJ2FjdGl2YXRvcicpID09PSAnc2NvcGVkJykge1xyXG4gICAgICAgIGNvbnN0IGFjdGl2YXRvciA9IHRoaXMuJHNjb3BlZFNsb3RzLmFjdGl2YXRvcih7IG9uOiBsaXN0ZW5lcnMgfSlcclxuICAgICAgICB0aGlzLmFjdGl2YXRvck5vZGUgPSBhY3RpdmF0b3JcclxuICAgICAgICByZXR1cm4gYWN0aXZhdG9yXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XHJcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWRpYWxvZ19fYWN0aXZhdG9yJyxcclxuICAgICAgICBjbGFzczoge1xyXG4gICAgICAgICAgJ3YtZGlhbG9nX19hY3RpdmF0b3ItLWRpc2FibGVkJzogdGhpcy5kaXNhYmxlZFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVmOiAnYWN0aXZhdG9yJyxcclxuICAgICAgICBvbjogbGlzdGVuZXJzXHJcbiAgICAgIH0sIHRoaXMuJHNsb3RzLmFjdGl2YXRvcilcclxuICAgIH1cclxuICB9LFxyXG5cclxuICByZW5kZXIgKGgpIHtcclxuICAgIGNvbnN0IGNoaWxkcmVuID0gW11cclxuICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgICdjbGFzcyc6IHRoaXMuY2xhc3NlcyxcclxuICAgICAgcmVmOiAnZGlhbG9nJyxcclxuICAgICAgZGlyZWN0aXZlczogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6ICdjbGljay1vdXRzaWRlJyxcclxuICAgICAgICAgIHZhbHVlOiAoKSA9PiB7IHRoaXMuaXNBY3RpdmUgPSBmYWxzZSB9LFxyXG4gICAgICAgICAgYXJnczoge1xyXG4gICAgICAgICAgICBjbG9zZUNvbmRpdGlvbmFsOiB0aGlzLmNsb3NlQ29uZGl0aW9uYWwsXHJcbiAgICAgICAgICAgIGluY2x1ZGU6IHRoaXMuZ2V0T3BlbkRlcGVuZGVudEVsZW1lbnRzXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7IG5hbWU6ICdzaG93JywgdmFsdWU6IHRoaXMuaXNBY3RpdmUgfVxyXG4gICAgICBdLFxyXG4gICAgICBvbjoge1xyXG4gICAgICAgIGNsaWNrOiBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKSB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXRoaXMuZnVsbHNjcmVlbikge1xyXG4gICAgICBkYXRhLnN0eWxlID0ge1xyXG4gICAgICAgIG1heFdpZHRoOiB0aGlzLm1heFdpZHRoID09PSAnbm9uZScgPyB1bmRlZmluZWQgOiBjb252ZXJ0VG9Vbml0KHRoaXMubWF4V2lkdGgpLFxyXG4gICAgICAgIHdpZHRoOiB0aGlzLndpZHRoID09PSAnYXV0bycgPyB1bmRlZmluZWQgOiBjb252ZXJ0VG9Vbml0KHRoaXMud2lkdGgpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjaGlsZHJlbi5wdXNoKHRoaXMuZ2VuQWN0aXZhdG9yKCkpXHJcblxyXG4gICAgbGV0IGRpYWxvZyA9IGgoJ2RpdicsIGRhdGEsIHRoaXMuc2hvd0xhenlDb250ZW50KHRoaXMuJHNsb3RzLmRlZmF1bHQpKVxyXG4gICAgaWYgKHRoaXMudHJhbnNpdGlvbikge1xyXG4gICAgICBkaWFsb2cgPSBoKCd0cmFuc2l0aW9uJywge1xyXG4gICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICBuYW1lOiB0aGlzLnRyYW5zaXRpb24sXHJcbiAgICAgICAgICBvcmlnaW46IHRoaXMub3JpZ2luXHJcbiAgICAgICAgfVxyXG4gICAgICB9LCBbZGlhbG9nXSlcclxuICAgIH1cclxuXHJcbiAgICBjaGlsZHJlbi5wdXNoKGgoJ2RpdicsIHtcclxuICAgICAgJ2NsYXNzJzogdGhpcy5jb250ZW50Q2xhc3NlcyxcclxuICAgICAgYXR0cnM6IHtcclxuICAgICAgICB0YWJJbmRleDogJy0xJyxcclxuICAgICAgICAuLi50aGlzLmdldFNjb3BlSWRBdHRycygpXHJcbiAgICAgIH0sXHJcbiAgICAgIG9uOiB7XHJcbiAgICAgICAga2V5ZG93bjogdGhpcy5vbktleWRvd25cclxuICAgICAgfSxcclxuICAgICAgc3R5bGU6IHsgekluZGV4OiB0aGlzLmFjdGl2ZVpJbmRleCB9LFxyXG4gICAgICByZWY6ICdjb250ZW50J1xyXG4gICAgfSwgW1xyXG4gICAgICB0aGlzLiRjcmVhdGVFbGVtZW50KFRoZW1lUHJvdmlkZXIsIHtcclxuICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgcm9vdDogdHJ1ZSxcclxuICAgICAgICAgIGxpZ2h0OiB0aGlzLmxpZ2h0LFxyXG4gICAgICAgICAgZGFyazogdGhpcy5kYXJrXHJcbiAgICAgICAgfVxyXG4gICAgICB9LCBbZGlhbG9nXSlcclxuICAgIF0pKVxyXG5cclxuICAgIHJldHVybiBoKCdkaXYnLCB7XHJcbiAgICAgIHN0YXRpY0NsYXNzOiAndi1kaWFsb2dfX2NvbnRhaW5lcicsXHJcbiAgICAgIHN0eWxlOiB7XHJcbiAgICAgICAgZGlzcGxheTogKCF0aGlzLmhhc0FjdGl2YXRvciB8fCB0aGlzLmZ1bGxXaWR0aCkgPyAnYmxvY2snIDogJ2lubGluZS1ibG9jaydcclxuICAgICAgfVxyXG4gICAgfSwgY2hpbGRyZW4pXHJcbiAgfVxyXG59XHJcbiJdfQ==