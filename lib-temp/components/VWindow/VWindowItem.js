// Mixins
import Bootable from '../../mixins/bootable';
import { factory as GroupableFactory } from '../../mixins/groupable';
// Directives
import Touch from '../../directives/touch';
// Utilities
import { convertToUnit } from '../../util/helpers';
import mixins from '../../util/mixins';
export default mixins(Bootable, GroupableFactory('windowGroup', 'v-window-item', 'v-window')
/* @vue/component */
).extend({
    name: 'v-window-item',
    directives: {
        Touch
    },
    props: {
        reverseTransition: {
            type: [Boolean, String],
            default: undefined
        },
        transition: {
            type: [Boolean, String],
            default: undefined
        },
        value: {
            required: false
        }
    },
    data() {
        return {
            done: null,
            isActive: false,
            wasCancelled: false
        };
    },
    computed: {
        computedTransition() {
            if (!this.windowGroup.internalReverse) {
                return typeof this.transition !== 'undefined'
                    ? this.transition || ''
                    : this.windowGroup.computedTransition;
            }
            return typeof this.reverseTransition !== 'undefined'
                ? this.reverseTransition || ''
                : this.windowGroup.computedTransition;
        }
    },
    mounted() {
        this.$el.addEventListener('transitionend', this.onTransitionEnd, false);
    },
    beforeDestroy() {
        this.$el.removeEventListener('transitionend', this.onTransitionEnd, false);
    },
    methods: {
        genDefaultSlot() {
            return this.$slots.default;
        },
        onAfterEnter() {
            if (this.wasCancelled) {
                this.wasCancelled = false;
                return;
            }
            requestAnimationFrame(() => {
                this.windowGroup.internalHeight = undefined;
                this.windowGroup.isActive = false;
            });
        },
        onBeforeEnter() {
            this.windowGroup.isActive = true;
        },
        onLeave(el) {
            this.windowGroup.internalHeight = convertToUnit(el.clientHeight);
        },
        onEnterCancelled() {
            this.wasCancelled = true;
        },
        onEnter(el, done) {
            const isBooted = this.windowGroup.isBooted;
            if (isBooted)
                this.done = done;
            requestAnimationFrame(() => {
                if (!this.computedTransition)
                    return done();
                this.windowGroup.internalHeight = convertToUnit(el.clientHeight);
                // On initial render, there is no transition
                // Vue leaves a `enter` transition class
                // if done is called too fast
                !isBooted && setTimeout(done, 100);
            });
        },
        onTransitionEnd(e) {
            // This ensures we only call done
            // when the element transform
            // completes
            if (e.propertyName !== 'transform' ||
                e.target !== this.$el ||
                !this.done)
                return;
            this.done();
            this.done = null;
        }
    },
    render(h) {
        const div = h('div', {
            staticClass: 'v-window-item',
            directives: [{
                    name: 'show',
                    value: this.isActive
                }],
            on: this.$listeners
        }, this.showLazyContent(this.genDefaultSlot()));
        return h('transition', {
            props: {
                name: this.computedTransition
            },
            on: {
                afterEnter: this.onAfterEnter,
                beforeEnter: this.onBeforeEnter,
                leave: this.onLeave,
                enter: this.onEnter,
                enterCancelled: this.onEnterCancelled
            }
        }, [div]);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVldpbmRvd0l0ZW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WV2luZG93L1ZXaW5kb3dJdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBLFNBQVM7QUFDVCxPQUFPLFFBQVEsTUFBTSx1QkFBdUIsQ0FBQTtBQUM1QyxPQUFPLEVBQUUsT0FBTyxJQUFJLGdCQUFnQixFQUFFLE1BQU0sd0JBQXdCLENBQUE7QUFFcEUsYUFBYTtBQUNiLE9BQU8sS0FBSyxNQUFNLHdCQUF3QixDQUFBO0FBRTFDLFlBQVk7QUFDWixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFFbEQsT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFZdEMsZUFBZSxNQUFNLENBQ25CLFFBQVEsRUFDUixnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsZUFBZSxFQUFFLFVBQVUsQ0FBQztBQUM1RCxvQkFBb0I7Q0FDckIsQ0FBQyxNQUFNLENBQUM7SUFDUCxJQUFJLEVBQUUsZUFBZTtJQUVyQixVQUFVLEVBQUU7UUFDVixLQUFLO0tBQ047SUFFRCxLQUFLLEVBQUU7UUFDTCxpQkFBaUIsRUFBRTtZQUNqQixJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDO1lBQ3ZCLE9BQU8sRUFBRSxTQUFTO1NBQ25CO1FBQ0QsVUFBVSxFQUFFO1lBQ1YsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQztZQUN2QixPQUFPLEVBQUUsU0FBUztTQUNuQjtRQUNELEtBQUssRUFBRTtZQUNMLFFBQVEsRUFBRSxLQUFLO1NBQ2hCO0tBQ0Y7SUFFRCxJQUFJO1FBQ0YsT0FBTztZQUNMLElBQUksRUFBRSxJQUEyQjtZQUNqQyxRQUFRLEVBQUUsS0FBSztZQUNmLFlBQVksRUFBRSxLQUFLO1NBQ3BCLENBQUE7SUFDSCxDQUFDO0lBRUQsUUFBUSxFQUFFO1FBQ1Isa0JBQWtCO1lBQ2hCLElBQUksQ0FBQyxJQUFJ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QUssRUFBRTtZQUNuQixXQUFXLEVBQUUsZUFBZTtZQUM1QixVQUFVLEVBQUUsQ0FBQztvQkFDWCxJQUFJLEVBQUUsTUFBTTtvQkFDWixLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVE7aUJBQ3JCLENBQUM7WUFDRixFQUFFLEVBQUUsSUFBSSxDQUFDLFVBQVU7U0FDcEIsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFFL0MsT0FBTyxDQUFDLENBQUMsWUFBWSxFQUFFO1lBQ3JCLEtBQUssRUFBRTtnQkFDTCxJQUFJLEVBQUUsSUFBSSxDQUFDLGtCQUFrQjthQUM5QjtZQUNELEVBQUUsRUFBRTtnQkFDRixVQUFVLEVBQUUsSUFBSSxDQUFDLFlBQVk7Z0JBQzdCLFdBQVcsRUFBRSxJQUFJLENBQUMsYUFBYTtnQkFDL0IsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPO2dCQUNuQixLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU87Z0JBQ25CLGNBQWMsRUFBRSxJQUFJLENBQUMsZ0JBQWdCO2FBQ3RDO1NBQ0YsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7SUFDWCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29tcG9uZW50c1xyXG5pbXBvcnQgVldpbmRvdyBmcm9tICcuL1ZXaW5kb3cnXHJcblxyXG4vLyBNaXhpbnNcclxuaW1wb3J0IEJvb3RhYmxlIGZyb20gJy4uLy4uL21peGlucy9ib290YWJsZSdcclxuaW1wb3J0IHsgZmFjdG9yeSBhcyBHcm91cGFibGVGYWN0b3J5IH0gZnJvbSAnLi4vLi4vbWl4aW5zL2dyb3VwYWJsZSdcclxuXHJcbi8vIERpcmVjdGl2ZXNcclxuaW1wb3J0IFRvdWNoIGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvdG91Y2gnXHJcblxyXG4vLyBVdGlsaXRpZXNcclxuaW1wb3J0IHsgY29udmVydFRvVW5pdCB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcclxuaW1wb3J0IHsgRXh0cmFjdFZ1ZSB9IGZyb20gJy4vLi4vLi4vdXRpbC9taXhpbnMnXHJcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXHJcblxyXG4vLyBUeXBlc1xyXG5pbXBvcnQgVnVlLCB7IFZOb2RlIH0gZnJvbSAndnVlJ1xyXG5cclxudHlwZSBWQmFzZVdpbmRvdyA9IEluc3RhbmNlVHlwZTx0eXBlb2YgVldpbmRvdz5cclxuXHJcbmludGVyZmFjZSBvcHRpb25zIGV4dGVuZHMgVnVlIHtcclxuICAkZWw6IEhUTUxFbGVtZW50XHJcbiAgd2luZG93R3JvdXA6IFZCYXNlV2luZG93XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1peGluczxvcHRpb25zICYgRXh0cmFjdFZ1ZTxbdHlwZW9mIEJvb3RhYmxlXT4+KFxyXG4gIEJvb3RhYmxlLFxyXG4gIEdyb3VwYWJsZUZhY3RvcnkoJ3dpbmRvd0dyb3VwJywgJ3Ytd2luZG93LWl0ZW0nLCAndi13aW5kb3cnKVxyXG4gIC8qIEB2dWUvY29tcG9uZW50ICovXHJcbikuZXh0ZW5kKHtcclxuICBuYW1lOiAndi13aW5kb3ctaXRlbScsXHJcblxyXG4gIGRpcmVjdGl2ZXM6IHtcclxuICAgIFRvdWNoXHJcbiAgfSxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIHJldmVyc2VUcmFuc2l0aW9uOiB7XHJcbiAgICAgIHR5cGU6IFtCb29sZWFuLCBTdHJpbmddLFxyXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWRcclxuICAgIH0sXHJcbiAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgIHR5cGU6IFtCb29sZWFuLCBTdHJpbmddLFxyXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWRcclxuICAgIH0sXHJcbiAgICB2YWx1ZToge1xyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBkYXRhICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGRvbmU6IG51bGwgYXMgbnVsbCB8ICgoKSA9PiB2b2lkKSxcclxuICAgICAgaXNBY3RpdmU6IGZhbHNlLFxyXG4gICAgICB3YXNDYW5jZWxsZWQ6IGZhbHNlXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIGNvbXB1dGVkVHJhbnNpdGlvbiAoKTogc3RyaW5nIHwgYm9vbGVhbiB7XHJcbiAgICAgIGlmICghdGhpcy53aW5kb3dHcm91cC5pbnRlcm5hbFJldmVyc2UpIHtcclxuICAgICAgICByZXR1cm4gdHlwZW9mIHRoaXMudHJhbnNpdGlvbiAhPT0gJ3VuZGVmaW5lZCdcclxuICAgICAgICAgID8gdGhpcy50cmFuc2l0aW9uIHx8ICcnXHJcbiAgICAgICAgICA6IHRoaXMud2luZG93R3JvdXAuY29tcHV0ZWRUcmFuc2l0aW9uXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0eXBlb2YgdGhpcy5yZXZlcnNlVHJhbnNpdGlvbiAhPT0gJ3VuZGVmaW5lZCdcclxuICAgICAgICA/IHRoaXMucmV2ZXJzZVRyYW5zaXRpb24gfHwgJydcclxuICAgICAgICA6IHRoaXMud2luZG93R3JvdXAuY29tcHV0ZWRUcmFuc2l0aW9uXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgbW91bnRlZCAoKSB7XHJcbiAgICB0aGlzLiRlbC5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgdGhpcy5vblRyYW5zaXRpb25FbmQsIGZhbHNlKVxyXG4gIH0sXHJcblxyXG4gIGJlZm9yZURlc3Ryb3kgKCkge1xyXG4gICAgdGhpcy4kZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIHRoaXMub25UcmFuc2l0aW9uRW5kLCBmYWxzZSlcclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICBnZW5EZWZhdWx0U2xvdCAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRzbG90cy5kZWZhdWx0XHJcbiAgICB9LFxyXG4gICAgb25BZnRlckVudGVyICgpIHtcclxuICAgICAgaWYgKHRoaXMud2FzQ2FuY2VsbGVkKSB7XHJcbiAgICAgICAgdGhpcy53YXNDYW5jZWxsZWQgPSBmYWxzZVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMud2luZG93R3JvdXAuaW50ZXJuYWxIZWlnaHQgPSB1bmRlZmluZWRcclxuICAgICAgICB0aGlzLndpbmRvd0dyb3VwLmlzQWN0aXZlID0gZmFsc2VcclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBvbkJlZm9yZUVudGVyICgpIHtcclxuICAgICAgdGhpcy53aW5kb3dHcm91cC5pc0FjdGl2ZSA9IHRydWVcclxuICAgIH0sXHJcbiAgICBvbkxlYXZlIChlbDogSFRNTEVsZW1lbnQpIHtcclxuICAgICAgdGhpcy53aW5kb3dHcm91cC5pbnRlcm5hbEhlaWdodCA9IGNvbnZlcnRUb1VuaXQoZWwuY2xpZW50SGVpZ2h0KVxyXG4gICAgfSxcclxuICAgIG9uRW50ZXJDYW5jZWxsZWQgKCkge1xyXG4gICAgICB0aGlzLndhc0NhbmNlbGxlZCA9IHRydWVcclxuICAgIH0sXHJcbiAgICBvbkVudGVyIChlbDogSFRNTEVsZW1lbnQsIGRvbmU6ICgpID0+IHZvaWQpIHtcclxuICAgICAgY29uc3QgaXNCb290ZWQgPSB0aGlzLndpbmRvd0dyb3VwLmlzQm9vdGVkXHJcblxyXG4gICAgICBpZiAoaXNCb290ZWQpIHRoaXMuZG9uZSA9IGRvbmVcclxuXHJcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbXB1dGVkVHJhbnNpdGlvbikgcmV0dXJuIGRvbmUoKVxyXG5cclxuICAgICAgICB0aGlzLndpbmRvd0dyb3VwLmludGVybmFsSGVpZ2h0ID0gY29udmVydFRvVW5pdChlbC5jbGllbnRIZWlnaHQpXHJcblxyXG4gICAgICAgIC8vIE9uIGluaXRpYWwgcmVuZGVyLCB0aGVyZSBpcyBubyB0cmFuc2l0aW9uXHJcbiAgICAgICAgLy8gVnVlIGxlYXZlcyBhIGBlbnRlcmAgdHJhbnNpdGlvbiBjbGFzc1xyXG4gICAgICAgIC8vIGlmIGRvbmUgaXMgY2FsbGVkIHRvbyBmYXN0XHJcbiAgICAgICAgIWlzQm9vdGVkICYmIHNldFRpbWVvdXQoZG9uZSwgMTAwKVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIG9uVHJhbnNpdGlvbkVuZCAoZTogVHJhbnNpdGlvbkV2ZW50KSB7XHJcbiAgICAgIC8vIFRoaXMgZW5zdXJlcyB3ZSBvbmx5IGNhbGwgZG9uZVxyXG4gICAgICAvLyB3aGVuIHRoZSBlbGVtZW50IHRyYW5zZm9ybVxyXG4gICAgICAvLyBjb21wbGV0ZXNcclxuICAgICAgaWYgKFxyXG4gICAgICAgIGUucHJvcGVydHlOYW1lICE9PSAndHJhbnNmb3JtJyB8fFxyXG4gICAgICAgIGUudGFyZ2V0ICE9PSB0aGlzLiRlbCB8fFxyXG4gICAgICAgICF0aGlzLmRvbmVcclxuICAgICAgKSByZXR1cm5cclxuXHJcbiAgICAgIHRoaXMuZG9uZSgpXHJcbiAgICAgIHRoaXMuZG9uZSA9IG51bGxcclxuICAgIH1cclxuICB9LFxyXG5cclxuICByZW5kZXIgKGgpOiBWTm9kZSB7XHJcbiAgICBjb25zdCBkaXYgPSBoKCdkaXYnLCB7XHJcbiAgICAgIHN0YXRpY0NsYXNzOiAndi13aW5kb3ctaXRlbScsXHJcbiAgICAgIGRpcmVjdGl2ZXM6IFt7XHJcbiAgICAgICAgbmFtZTogJ3Nob3cnLFxyXG4gICAgICAgIHZhbHVlOiB0aGlzLmlzQWN0aXZlXHJcbiAgICAgIH1dLFxyXG4gICAgICBvbjogdGhpcy4kbGlzdGVuZXJzXHJcbiAgICB9LCB0aGlzLnNob3dMYXp5Q29udGVudCh0aGlzLmdlbkRlZmF1bHRTbG90KCkpKVxyXG5cclxuICAgIHJldHVybiBoKCd0cmFuc2l0aW9uJywge1xyXG4gICAgICBwcm9wczoge1xyXG4gICAgICAgIG5hbWU6IHRoaXMuY29tcHV0ZWRUcmFuc2l0aW9uXHJcbiAgICAgIH0sXHJcbiAgICAgIG9uOiB7XHJcbiAgICAgICAgYWZ0ZXJFbnRlcjogdGhpcy5vbkFmdGVyRW50ZXIsXHJcbiAgICAgICAgYmVmb3JlRW50ZXI6IHRoaXMub25CZWZvcmVFbnRlcixcclxuICAgICAgICBsZWF2ZTogdGhpcy5vbkxlYXZlLFxyXG4gICAgICAgIGVudGVyOiB0aGlzLm9uRW50ZXIsXHJcbiAgICAgICAgZW50ZXJDYW5jZWxsZWQ6IHRoaXMub25FbnRlckNhbmNlbGxlZFxyXG4gICAgICB9XHJcbiAgICB9LCBbZGl2XSlcclxuICB9XHJcbn0pXHJcbiJdfQ==