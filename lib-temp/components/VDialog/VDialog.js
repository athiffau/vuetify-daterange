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
import { getZIndex, convertToUnit, getSlotType } from '../../util/helpers';
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
            if (getSlotType(this, 'activator') === 'scoped') {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkRpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZEaWFsb2cvVkRpYWxvZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLHVDQUF1QyxDQUFBO0FBRTlDLFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUNoRCxPQUFPLFdBQVcsTUFBTSwwQkFBMEIsQ0FBQTtBQUNsRCxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUNoRCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUVoRCxhQUFhO0FBQ2IsT0FBTyxZQUFZLE1BQU0sZ0NBQWdDLENBQUE7QUFFekQsVUFBVTtBQUNWLE9BQU8sRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQzFFLE9BQU8sYUFBYSxNQUFNLDBCQUEwQixDQUFBO0FBQ3BELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUVqRCxvQkFBb0I7QUFDcEIsZUFBZTtJQUNiLElBQUksRUFBRSxVQUFVO0lBRWhCLFVBQVUsRUFBRTtRQUNWLFlBQVk7S0FDYjtJQUVELE1BQU0sRUFBRTtRQUNOLFNBQVM7UUFDVCxVQUFVO1FBQ1YsV0FBVztRQUNYLFVBQVU7UUFDVixTQUFTO1FBQ1QsVUFBVTtLQUNYO0lBRUQsS0FBSyxFQUFFO1FBQ0wsUUFBUSxFQUFFLE9BQU87UUFDakIsVUFBVSxFQUFFLE9BQU87UUFDbkIsVUFBVSxFQUFFLE9BQU87UUFDbkIsU0FBUyxFQUFFLE9BQU87UUFDbEIsZ0JBQWdCLEVBQUUsT0FBTztRQUN6QixLQUFLLEVBQUUsT0FBTztRQUNkLElBQUksRUFBRSxPQUFPO1FBQ2IsUUFBUSxFQUFFO1lBQ1IsSUFBSSxFQUFFLENB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WUFDRCxJQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsRUFBRTtnQkFDakMsS0FBSyxFQUFFO29CQUNMLElBQUksRUFBRSxJQUFJO29CQUNWLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztvQkFDakIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO2lCQUNoQjthQUNGLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNiLENBQUMsQ0FBQyxDQUFBO1FBRUgsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFO1lBQ2QsV0FBVyxFQUFFLHFCQUFxQjtZQUNsQyxLQUFLLEVBQUU7Z0JBQ0wsT0FBTyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxjQUFjO2FBQzNFO1NBQ0YsRUFBRSxRQUFRLENBQUMsQ0FBQTtJQUNkLENBQUM7Q0FDRixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuLi8uLi9zdHlsdXMvY29tcG9uZW50cy9fZGlhbG9ncy5zdHlsJ1xyXG5cclxuLy8gTWl4aW5zXHJcbmltcG9ydCBEZXBlbmRlbnQgZnJvbSAnLi4vLi4vbWl4aW5zL2RlcGVuZGVudCdcclxuaW1wb3J0IERldGFjaGFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2RldGFjaGFibGUnXHJcbmltcG9ydCBPdmVybGF5YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvb3ZlcmxheWFibGUnXHJcbmltcG9ydCBSZXR1cm5hYmxlIGZyb20gJy4uLy4uL21peGlucy9yZXR1cm5hYmxlJ1xyXG5pbXBvcnQgU3RhY2thYmxlIGZyb20gJy4uLy4uL21peGlucy9zdGFja2FibGUnXHJcbmltcG9ydCBUb2dnbGVhYmxlIGZyb20gJy4uLy4uL21peGlucy90b2dnbGVhYmxlJ1xyXG5cclxuLy8gRGlyZWN0aXZlc1xyXG5pbXBvcnQgQ2xpY2tPdXRzaWRlIGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvY2xpY2stb3V0c2lkZSdcclxuXHJcbi8vIEhlbHBlcnNcclxuaW1wb3J0IHsgZ2V0WkluZGV4LCBjb252ZXJ0VG9Vbml0LCBnZXRTbG90VHlwZSB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcclxuaW1wb3J0IFRoZW1lUHJvdmlkZXIgZnJvbSAnLi4vLi4vdXRpbC9UaGVtZVByb3ZpZGVyJ1xyXG5pbXBvcnQgeyBjb25zb2xlRXJyb3IgfSBmcm9tICcuLi8uLi91dGlsL2NvbnNvbGUnXHJcblxyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgbmFtZTogJ3YtZGlhbG9nJyxcclxuXHJcbiAgZGlyZWN0aXZlczoge1xyXG4gICAgQ2xpY2tPdXRzaWRlXHJcbiAgfSxcclxuXHJcbiAgbWl4aW5zOiBbXHJcbiAgICBEZXBlbmRlbnQsXHJcbiAgICBEZXRhY2hhYmxlLFxyXG4gICAgT3ZlcmxheWFibGUsXHJcbiAgICBSZXR1cm5hYmxlLFxyXG4gICAgU3RhY2thYmxlLFxyXG4gICAgVG9nZ2xlYWJsZVxyXG4gIF0sXHJcblxyXG4gIHByb3BzOiB7XHJcbiAgICBkaXNhYmxlZDogQm9vbGVhbixcclxuICAgIHBlcnNpc3RlbnQ6IEJvb2xlYW4sXHJcbiAgICBmdWxsc2NyZWVuOiBCb29sZWFuLFxyXG4gICAgZnVsbFdpZHRoOiBCb29sZWFuLFxyXG4gICAgbm9DbGlja0FuaW1hdGlvbjogQm9vbGVhbixcclxuICAgIGxpZ2h0OiBCb29sZWFuLFxyXG4gICAgZGFyazogQm9vbGVhbixcclxuICAgIG1heFdpZHRoOiB7XHJcbiAgICAgIHR5cGU6IFtTdHJpbmcsIE51bWJlcl0sXHJcbiAgICAgIGRlZmF1bHQ6ICdub25lJ1xyXG4gICAgfSxcclxuICAgIG9yaWdpbjoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICdjZW50ZXIgY2VudGVyJ1xyXG4gICAgfSxcclxuICAgIHdpZHRoOiB7XHJcbiAgICAgIHR5cGU6IFtTdHJpbmcsIE51bWJlcl0sXHJcbiAgICAgIGRlZmF1bHQ6ICdhdXRvJ1xyXG4gICAgfSxcclxuICAgIHNjcm9sbGFibGU6IEJvb2xlYW4sXHJcbiAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgIHR5cGU6IFtTdHJpbmcsIEJvb2xlYW5dLFxyXG4gICAgICBkZWZhdWx0OiAnZGlhbG9nLXRyYW5zaXRpb24nXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZGF0YSAoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBhbmltYXRlOiBmYWxzZSxcclxuICAgICAgYW5pbWF0ZVRpbWVvdXQ6IG51bGwsXHJcbiAgICAgIHN0YWNrQ2xhc3M6ICd2LWRpYWxvZ19fY29udGVudC0tYWN0aXZlJyxcclxuICAgICAgc3RhY2tNaW5aSW5kZXg6IDIwMFxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICBjbGFzc2VzICgpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBbKGB2LWRpYWxvZyAke3RoaXMuY29udGVudENsYXNzfWApLnRyaW0oKV06IHRydWUsXHJcbiAgICAgICAgJ3YtZGlhbG9nLS1hY3RpdmUnOiB0aGlzLmlzQWN0aXZlLFxyXG4gICAgICAgICd2LWRpYWxvZy0tcGVyc2lzdGVudCc6IHRoaXMucGVyc2lzdGVudCxcclxuICAgICAgICAndi1kaWFsb2ctLWZ1bGxzY3JlZW4nOiB0aGlzLmZ1bGxzY3JlZW4sXHJcbiAgICAgICAgJ3YtZGlhbG9nLS1zY3JvbGxhYmxlJzogdGhpcy5zY3JvbGxhYmxlLFxyXG4gICAgICAgICd2LWRpYWxvZy0tYW5pbWF0ZWQnOiB0aGlzLmFuaW1hdGVcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGNvbnRlbnRDbGFzc2VzICgpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAndi1kaWFsb2dfX2NvbnRlbnQnOiB0cnVlLFxyXG4gICAgICAgICd2LWRpYWxvZ19fY29udGVudC0tYWN0aXZlJzogdGhpcy5pc0FjdGl2ZVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgaGFzQWN0aXZhdG9yICgpIHtcclxuICAgICAgcmV0dXJuIEJvb2xlYW4oXHJcbiAgICAgICAgISF0aGlzLiRzbG90cy5hY3RpdmF0b3IgfHxcclxuICAgICAgICAhIXRoaXMuJHNjb3BlZFNsb3RzLmFjdGl2YXRvclxyXG4gICAgICApXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgd2F0Y2g6IHtcclxuICAgIGlzQWN0aXZlICh2YWwpIHtcclxuICAgICAgaWYgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuc2hvdygpXHJcbiAgICAgICAgdGhpcy5oaWRlU2Nyb2xsKClcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnJlbW92ZU92ZXJsYXkoKVxyXG4gICAgICAgIHRoaXMudW5iaW5kKClcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGZ1bGxzY3JlZW4gKHZhbCkge1xyXG4gICAgICBpZiAoIXRoaXMuaXNBY3RpdmUpIHJldHVyblxyXG5cclxuICAgICAgaWYgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuaGlkZVNjcm9sbCgpXHJcbiAgICAgICAgdGhpcy5yZW1vdmVPdmVybGF5KGZhbHNlKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuc2hvd1Njcm9sbCgpXHJcbiAgICAgICAgdGhpcy5nZW5PdmVybGF5KClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGJlZm9yZU1vdW50ICgpIHtcclxuICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcclxuICAgICAgdGhpcy5pc0Jvb3RlZCA9IHRoaXMuaXNBY3RpdmVcclxuICAgICAgdGhpcy5pc0FjdGl2ZSAmJiB0aGlzLnNob3coKVxyXG4gICAgfSlcclxuICB9LFxyXG5cclxuICBtb3VudGVkICgpIHtcclxuICAgIGlmIChnZXRTbG90VHlwZSh0aGlzLCAnYWN0aXZhdG9yJywgdHJ1ZSkgPT09ICd2LXNsb3QnKSB7XHJcbiAgICAgIGNvbnNvbGVFcnJvcihgdi1kaWFsb2cncyBhY3RpdmF0b3Igc2xvdCBtdXN0IGJlIGJvdW5kLCB0cnkgJzx0ZW1wbGF0ZSAjYWN0aXZhdG9yPVwiZGF0YVwiPjx2LWJ0biB2LW9uPVwiZGF0YS5vbj4nYCwgdGhpcylcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBiZWZvcmVEZXN0cm95ICgpIHtcclxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykgdGhpcy51bmJpbmQoKVxyXG4gIH0sXHJcblxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGFuaW1hdGVDbGljayAoKSB7XHJcbiAgICAgIHRoaXMuYW5pbWF0ZSA9IGZhbHNlXHJcbiAgICAgIC8vIE5lZWRlZCBmb3Igd2hlbiBjbGlja2luZyB2ZXJ5IGZhc3RcclxuICAgICAgLy8gb3V0c2lkZSBvZiB0aGUgZGlhbG9nXHJcbiAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcclxuICAgICAgICB0aGlzLmFuaW1hdGUgPSB0cnVlXHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuYW5pbWF0ZVRpbWVvdXQpXHJcbiAgICAgICAgdGhpcy5hbmltYXRlVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4gKHRoaXMuYW5pbWF0ZSA9IGZhbHNlKSwgMTUwKVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIGNsb3NlQ29uZGl0aW9uYWwgKGUpIHtcclxuICAgICAgLy8gSWYgdGhlIGRpYWxvZyBjb250ZW50IGNvbnRhaW5zXHJcbiAgICAgIC8vIHRoZSBjbGljayBldmVudCwgb3IgaWYgdGhlXHJcbiAgICAgIC8vIGRpYWxvZyBpcyBub3QgYWN0aXZlXHJcbiAgICAgIGlmICh0aGlzLiRyZWZzLmNvbnRlbnQuY29udGFpbnMoZS50YXJnZXQpIHx8XHJcbiAgICAgICAgIXRoaXMuaXNBY3RpdmVcclxuICAgICAgKSByZXR1cm4gZmFsc2VcclxuXHJcbiAgICAgIC8vIElmIHdlIG1hZGUgaXQgaGVyZSwgdGhlIGNsaWNrIGlzIG91dHNpZGVcclxuICAgICAgLy8gYW5kIGlzIGFjdGl2ZS4gSWYgcGVyc2lzdGVudCwgYW5kIHRoZVxyXG4gICAgICAvLyBjbGljayBpcyBvbiB0aGUgb3ZlcmxheSwgYW5pbWF0ZVxyXG4gICAgICBpZiAodGhpcy5wZXJzaXN0ZW50KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLm5vQ2xpY2tBbmltYXRpb24gJiZcclxuICAgICAgICAgIHRoaXMub3ZlcmxheSA9PT0gZS50YXJnZXRcclxuICAgICAgICApIHRoaXMuYW5pbWF0ZUNsaWNrKClcclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGNsb3NlIGRpYWxvZyBpZiAhcGVyc2lzdGVudCwgY2xpY2tlZCBvdXRzaWRlIGFuZCB3ZSdyZSB0aGUgdG9wbW9zdCBkaWFsb2cuXHJcbiAgICAgIC8vIFNpbmNlIHRoaXMgc2hvdWxkIG9ubHkgYmUgY2FsbGVkIGluIGEgY2FwdHVyZSBldmVudCAoYm90dG9tIHVwKSwgd2Ugc2hvdWxkbid0IG5lZWQgdG8gc3RvcCBwcm9wYWdhdGlvblxyXG4gICAgICByZXR1cm4gZ2V0WkluZGV4KHRoaXMuJHJlZnMuY29udGVudCkgPj0gdGhpcy5nZXRNYXhaSW5kZXgoKVxyXG4gICAgfSxcclxuICAgIGhpZGVTY3JvbGwgKCkge1xyXG4gICAgICBpZiAodGhpcy5mdWxsc2NyZWVuKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ292ZXJmbG93LXktaGlkZGVuJylcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBPdmVybGF5YWJsZS5vcHRpb25zLm1ldGhvZHMuaGlkZVNjcm9sbC5jYWxsKHRoaXMpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzaG93ICgpIHtcclxuICAgICAgIXRoaXMuZnVsbHNjcmVlbiAmJiAhdGhpcy5oaWRlT3ZlcmxheSAmJiB0aGlzLmdlbk92ZXJsYXkoKVxyXG4gICAgICB0aGlzLiRyZWZzLmNvbnRlbnQuZm9jdXMoKVxyXG4gICAgICB0aGlzLiRsaXN0ZW5lcnMua2V5ZG93biAmJiB0aGlzLmJpbmQoKVxyXG4gICAgfSxcclxuICAgIGJpbmQgKCkge1xyXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMub25LZXlkb3duKVxyXG4gICAgfSxcclxuICAgIHVuYmluZCAoKSB7XHJcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5vbktleWRvd24pXHJcbiAgICB9LFxyXG4gICAgb25LZXlkb3duIChlKSB7XHJcbiAgICAgIHRoaXMuJGVtaXQoJ2tleWRvd24nLCBlKVxyXG4gICAgfSxcclxuICAgIGdlbkFjdGl2YXRvciAoKSB7XHJcbiAgICAgIGlmICghdGhpcy5oYXNBY3RpdmF0b3IpIHJldHVybiBudWxsXHJcblxyXG4gICAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLmRpc2FibGVkID8ge30gOiB7XHJcbiAgICAgICAgY2xpY2s6IGUgPT4ge1xyXG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgICAgaWYgKCF0aGlzLmRpc2FibGVkKSB0aGlzLmlzQWN0aXZlID0gIXRoaXMuaXNBY3RpdmVcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChnZXRTbG90VHlwZSh0aGlzLCAnYWN0aXZhdG9yJykgPT09ICdzY29wZWQnKSB7XHJcbiAgICAgICAgY29uc3QgYWN0aXZhdG9yID0gdGhpcy4kc2NvcGVkU2xvdHMuYWN0aXZhdG9yKHsgb246IGxpc3RlbmVycyB9KVxyXG4gICAgICAgIHRoaXMuYWN0aXZhdG9yTm9kZSA9IGFjdGl2YXRvclxyXG4gICAgICAgIHJldHVybiBhY3RpdmF0b3JcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICBzdGF0aWNDbGFzczogJ3YtZGlhbG9nX19hY3RpdmF0b3InLFxyXG4gICAgICAgICdjbGFzcyc6IHtcclxuICAgICAgICAgICd2LWRpYWxvZ19fYWN0aXZhdG9yLS1kaXNhYmxlZCc6IHRoaXMuZGlzYWJsZWRcclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uOiBsaXN0ZW5lcnNcclxuICAgICAgfSwgdGhpcy4kc2xvdHMuYWN0aXZhdG9yKVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlbmRlciAoaCkge1xyXG4gICAgY29uc3QgY2hpbGRyZW4gPSBbXVxyXG4gICAgY29uc3QgZGF0YSA9IHtcclxuICAgICAgJ2NsYXNzJzogdGhpcy5jbGFzc2VzLFxyXG4gICAgICByZWY6ICdkaWFsb2cnLFxyXG4gICAgICBkaXJlY3RpdmVzOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbmFtZTogJ2NsaWNrLW91dHNpZGUnLFxyXG4gICAgICAgICAgdmFsdWU6ICgpID0+ICh0aGlzLmlzQWN0aXZlID0gZmFsc2UpLFxyXG4gICAgICAgICAgYXJnczoge1xyXG4gICAgICAgICAgICBjbG9zZUNvbmRpdGlvbmFsOiB0aGlzLmNsb3NlQ29uZGl0aW9uYWwsXHJcbiAgICAgICAgICAgIGluY2x1ZGU6IHRoaXMuZ2V0T3BlbkRlcGVuZGVudEVsZW1lbnRzXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7IG5hbWU6ICdzaG93JywgdmFsdWU6IHRoaXMuaXNBY3RpdmUgfVxyXG4gICAgICBdLFxyXG4gICAgICBvbjoge1xyXG4gICAgICAgIGNsaWNrOiBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKSB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXRoaXMuZnVsbHNjcmVlbikge1xyXG4gICAgICBkYXRhLnN0eWxlID0ge1xyXG4gICAgICAgIG1heFdpZHRoOiB0aGlzLm1heFdpZHRoID09PSAnbm9uZScgPyB1bmRlZmluZWQgOiBjb252ZXJ0VG9Vbml0KHRoaXMubWF4V2lkdGgpLFxyXG4gICAgICAgIHdpZHRoOiB0aGlzLndpZHRoID09PSAnYXV0bycgPyB1bmRlZmluZWQgOiBjb252ZXJ0VG9Vbml0KHRoaXMud2lkdGgpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjaGlsZHJlbi5wdXNoKHRoaXMuZ2VuQWN0aXZhdG9yKCkpXHJcblxyXG4gICAgbGV0IGRpYWxvZyA9IGgoJ2RpdicsIGRhdGEsIHRoaXMuc2hvd0xhenlDb250ZW50KHRoaXMuJHNsb3RzLmRlZmF1bHQpKVxyXG4gICAgaWYgKHRoaXMudHJhbnNpdGlvbikge1xyXG4gICAgICBkaWFsb2cgPSBoKCd0cmFuc2l0aW9uJywge1xyXG4gICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICBuYW1lOiB0aGlzLnRyYW5zaXRpb24sXHJcbiAgICAgICAgICBvcmlnaW46IHRoaXMub3JpZ2luXHJcbiAgICAgICAgfVxyXG4gICAgICB9LCBbZGlhbG9nXSlcclxuICAgIH1cclxuXHJcbiAgICBjaGlsZHJlbi5wdXNoKGgoJ2RpdicsIHtcclxuICAgICAgJ2NsYXNzJzogdGhpcy5jb250ZW50Q2xhc3NlcyxcclxuICAgICAgYXR0cnM6IHtcclxuICAgICAgICB0YWJJbmRleDogJy0xJyxcclxuICAgICAgICAuLi50aGlzLmdldFNjb3BlSWRBdHRycygpXHJcbiAgICAgIH0sXHJcbiAgICAgIHN0eWxlOiB7IHpJbmRleDogdGhpcy5hY3RpdmVaSW5kZXggfSxcclxuICAgICAgcmVmOiAnY29udGVudCdcclxuICAgIH0sIFtcclxuICAgICAgdGhpcy4kY3JlYXRlRWxlbWVudChUaGVtZVByb3ZpZGVyLCB7XHJcbiAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgIHJvb3Q6IHRydWUsXHJcbiAgICAgICAgICBsaWdodDogdGhpcy5saWdodCxcclxuICAgICAgICAgIGRhcms6IHRoaXMuZGFya1xyXG4gICAgICAgIH1cclxuICAgICAgfSwgW2RpYWxvZ10pXHJcbiAgICBdKSlcclxuXHJcbiAgICByZXR1cm4gaCgnZGl2Jywge1xyXG4gICAgICBzdGF0aWNDbGFzczogJ3YtZGlhbG9nX19jb250YWluZXInLFxyXG4gICAgICBzdHlsZToge1xyXG4gICAgICAgIGRpc3BsYXk6ICghdGhpcy5oYXNBY3RpdmF0b3IgfHwgdGhpcy5mdWxsV2lkdGgpID8gJ2Jsb2NrJyA6ICdpbmxpbmUtYmxvY2snXHJcbiAgICAgIH1cclxuICAgIH0sIGNoaWxkcmVuKVxyXG4gIH1cclxufVxyXG4iXX0=