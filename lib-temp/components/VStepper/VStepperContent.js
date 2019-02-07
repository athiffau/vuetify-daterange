// Components
import { VTabTransition, VTabReverseTransition } from '../transitions';
// Mixins
import { inject as RegistrableInject } from '../../mixins/registrable';
// Helpers
import { convertToUnit } from '../../util/helpers';
// Util
import mixins from '../../util/mixins';
export default mixins(RegistrableInject('stepper', 'v-stepper-content', 'v-stepper')
/* @vue/component */
).extend({
    name: 'v-stepper-content',
    inject: {
        isVerticalProvided: {
            from: 'isVertical'
        }
    },
    props: {
        step: {
            type: [Number, String],
            required: true
        }
    },
    data() {
        return {
            height: 0,
            // Must be null to allow
            // previous comparison
            isActive: null,
            isReverse: false,
            isVertical: this.isVerticalProvided
        };
    },
    computed: {
        classes() {
            return {
                'v-stepper__content': true
            };
        },
        computedTransition() {
            return this.isReverse
                ? VTabReverseTransition
                : VTabTransition;
        },
        styles() {
            if (!this.isVertical)
                return {};
            return {
                height: convertToUnit(this.height)
            };
        },
        wrapperClasses() {
            return {
                'v-stepper__wrapper': true
            };
        }
    },
    watch: {
        isActive(current, previous) {
            // If active and the previous state
            // was null, is just booting up
            if (current && previous == null) {
                this.height = 'auto';
                return;
            }
            if (!this.isVertical)
                return;
            if (this.isActive)
                this.enter();
            else
                this.leave();
        }
    },
    mounted() {
        this.$refs.wrapper.addEventListener('transitionend', this.onTransition, false);
        this.stepper && this.stepper.register(this);
    },
    beforeDestroy() {
        this.$refs.wrapper.removeEventListener('transitionend', this.onTransition, false);
        this.stepper && this.stepper.unregister(this);
    },
    methods: {
        onTransition(e) {
            if (!this.isActive ||
                e.propertyName !== 'height')
                return;
            this.height = 'auto';
        },
        enter() {
            let scrollHeight = 0;
            // Render bug with height
            requestAnimationFrame(() => {
                scrollHeight = this.$refs.wrapper.scrollHeight;
            });
            this.height = 0;
            // Give the collapsing element time to collapse
            setTimeout(() => this.isActive && (this.height = (scrollHeight || 'auto')), 450);
        },
        leave() {
            this.height = this.$refs.wrapper.clientHeight;
            setTimeout(() => (this.height = 0), 10);
        },
        toggle(step, reverse) {
            this.isActive = step.toString() === this.step.toString();
            this.isReverse = reverse;
        }
    },
    render(h) {
        const contentData = {
            'class': this.classes
        };
        const wrapperData = {
            'class': this.wrapperClasses,
            style: this.styles,
            ref: 'wrapper'
        };
        if (!this.isVertical) {
            contentData.directives = [{
                    name: 'show',
                    value: this.isActive
                }];
        }
        const wrapper = h('div', wrapperData, [this.$slots.default]);
        const content = h('div', contentData, [wrapper]);
        return h(this.computedTransition, {
            on: this.$listeners
        }, [content]);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlN0ZXBwZXJDb250ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVlN0ZXBwZXIvVlN0ZXBwZXJDb250ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGFBQWE7QUFDYixPQUFPLEVBQ0wsY0FBYyxFQUNkLHFCQUFxQixFQUN0QixNQUFNLGdCQUFnQixDQUFBO0FBRXZCLFNBQVM7QUFDVCxPQUFPLEVBQWUsTUFBTSxJQUFJLGlCQUFpQixFQUFFLE1BQU0sMEJBQTBCLENBQUE7QUFFbkYsVUFBVTtBQUNWLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUVsRCxPQUFPO0FBQ1AsT0FBTyxNQUFzQixNQUFNLG1CQUFtQixDQUFBO0FBWXRELGVBQWUsTUFBTSxDQU9uQixpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsbUJBQW1CLEVBQUUsV0FBVyxDQUFDO0FBQ2hFLG9CQUFvQjtDQUNuQixDQUFDLE1BQU0sQ0FBQztJQUNQLElBQUksRUFBRSxtQkFBbUI7SUFFekIsTUFBTSxFQUFFO1FBQ04sa0JBQWtCLEVBQUU7WUFDbEIsSUFBSSxFQUFFLFlBQVk7U0FDbkI7S0FDRjtJQUVELEtBQUssRUFBRTtRQUNMLElBQUksRUFBRTtZQUNKLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIsUUFBUSxFQUFFLElBQUk7U0FDZjtLQUNGO0lBRUQsSUFBSTtRQUNGLE9BQU87WUFDTCxNQUFNLEVBQUUsQ0FBb0I7WUFDNUIsd0JBQXdCO1lBQ3hCLHNCQUFzQjtZQUN0QixRQUFRLEVBQUUsSUFBc0I7WUFDaEMsU0FBUyxFQUFFLEtBQUs7WUFDaEIsVUFBVSxFQUFFLElBQUksQ0FBQyxrQkFBa0I7U0FDcEMsQ0FBQTtJQUNILENBQUM7SUFFRCxRQUFRLEVBQUU7UUFDUixPQUFPO1lBQ0wsT0FBTztnQkFDTCxvQkFBb0IsRUFBRSxJQUFJO2FBQzNCLENBQUE7UUFDSCxD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LFNBQVMsR0FBRyxPQUFPLENBQUE7UUFDMUIsQ0FBQztLQUNGO0lBRUQsTUFBTSxDQUFFLENBQUM7UUFDUCxNQUFNLFdBQVcsR0FBYztZQUM3QixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87U0FDdEIsQ0FBQTtRQUNELE1BQU0sV0FBVyxHQUFHO1lBQ2xCLE9BQU8sRUFBRSxJQUFJLENBQUMsY0FBYztZQUM1QixLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDbEIsR0FBRyxFQUFFLFNBQVM7U0FDZixDQUFBO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDcEIsV0FBVyxDQUFDLFVBQVUsR0FBRyxDQUFDO29CQUN4QixJQUFJLEVBQUUsTUFBTTtvQkFDWixLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVE7aUJBQ3JCLENBQUMsQ0FBQTtTQUNIO1FBRUQsTUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUE7UUFDNUQsTUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO1FBRWhELE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtZQUNoQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFVBQVU7U0FDcEIsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUE7SUFDZixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29tcG9uZW50c1xyXG5pbXBvcnQge1xyXG4gIFZUYWJUcmFuc2l0aW9uLFxyXG4gIFZUYWJSZXZlcnNlVHJhbnNpdGlvblxyXG59IGZyb20gJy4uL3RyYW5zaXRpb25zJ1xyXG5cclxuLy8gTWl4aW5zXHJcbmltcG9ydCB7IFJlZ2lzdHJhYmxlLCBpbmplY3QgYXMgUmVnaXN0cmFibGVJbmplY3QgfSBmcm9tICcuLi8uLi9taXhpbnMvcmVnaXN0cmFibGUnXHJcblxyXG4vLyBIZWxwZXJzXHJcbmltcG9ydCB7IGNvbnZlcnRUb1VuaXQgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXHJcblxyXG4vLyBVdGlsXHJcbmltcG9ydCBtaXhpbnMsIHsgRXh0cmFjdFZ1ZSB9IGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xyXG5cclxuLy8gVHlwZXNcclxuaW1wb3J0IFZ1ZSwgeyBWTm9kZSwgRnVuY3Rpb25hbENvbXBvbmVudE9wdGlvbnMsIFZOb2RlRGF0YSB9IGZyb20gJ3Z1ZSdcclxuXHJcbmludGVyZmFjZSBvcHRpb25zIGV4dGVuZHMgVnVlIHtcclxuICAkcmVmczoge1xyXG4gICAgd3JhcHBlcjogSFRNTEVsZW1lbnRcclxuICB9XHJcbiAgaXNWZXJ0aWNhbFByb3ZpZGVkOiBib29sZWFuXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1peGluczxvcHRpb25zICZcclxuLyogZXNsaW50LWRpc2FibGUgaW5kZW50ICovXHJcbiAgRXh0cmFjdFZ1ZTxbXHJcbiAgICBSZWdpc3RyYWJsZTwnc3RlcHBlcic+XHJcbiAgXT5cclxuLyogZXNsaW50LWVuYWJsZSBpbmRlbnQgKi9cclxuPihcclxuICBSZWdpc3RyYWJsZUluamVjdCgnc3RlcHBlcicsICd2LXN0ZXBwZXItY29udGVudCcsICd2LXN0ZXBwZXInKVxyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG4pLmV4dGVuZCh7XHJcbiAgbmFtZTogJ3Ytc3RlcHBlci1jb250ZW50JyxcclxuXHJcbiAgaW5qZWN0OiB7XHJcbiAgICBpc1ZlcnRpY2FsUHJvdmlkZWQ6IHtcclxuICAgICAgZnJvbTogJ2lzVmVydGljYWwnXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIHN0ZXA6IHtcclxuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcclxuICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBkYXRhICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGhlaWdodDogMCBhcyBudW1iZXIgfCBzdHJpbmcsXHJcbiAgICAgIC8vIE11c3QgYmUgbnVsbCB0byBhbGxvd1xyXG4gICAgICAvLyBwcmV2aW91cyBjb21wYXJpc29uXHJcbiAgICAgIGlzQWN0aXZlOiBudWxsIGFzIGJvb2xlYW4gfCBudWxsLFxyXG4gICAgICBpc1JldmVyc2U6IGZhbHNlLFxyXG4gICAgICBpc1ZlcnRpY2FsOiB0aGlzLmlzVmVydGljYWxQcm92aWRlZFxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICBjbGFzc2VzICgpOiBvYmplY3Qge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgICd2LXN0ZXBwZXJfX2NvbnRlbnQnOiB0cnVlXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBjb21wdXRlZFRyYW5zaXRpb24gKCk6IEZ1bmN0aW9uYWxDb21wb25lbnRPcHRpb25zIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaXNSZXZlcnNlXHJcbiAgICAgICAgPyBWVGFiUmV2ZXJzZVRyYW5zaXRpb25cclxuICAgICAgICA6IFZUYWJUcmFuc2l0aW9uXHJcbiAgICB9LFxyXG4gICAgc3R5bGVzICgpOiBvYmplY3Qge1xyXG4gICAgICBpZiAoIXRoaXMuaXNWZXJ0aWNhbCkgcmV0dXJuIHt9XHJcblxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGhlaWdodDogY29udmVydFRvVW5pdCh0aGlzLmhlaWdodClcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHdyYXBwZXJDbGFzc2VzICgpOiBvYmplY3Qge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgICd2LXN0ZXBwZXJfX3dyYXBwZXInOiB0cnVlXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG5cclxuICB3YXRjaDoge1xyXG4gICAgaXNBY3RpdmUgKGN1cnJlbnQsIHByZXZpb3VzKSB7XHJcbiAgICAgIC8vIElmIGFjdGl2ZSBhbmQgdGhlIHByZXZpb3VzIHN0YXRlXHJcbiAgICAgIC8vIHdhcyBudWxsLCBpcyBqdXN0IGJvb3RpbmcgdXBcclxuICAgICAgaWYgKGN1cnJlbnQgJiYgcHJldmlvdXMgPT0gbnVsbCkge1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gJ2F1dG8nXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghdGhpcy5pc1ZlcnRpY2FsKSByZXR1cm5cclxuXHJcbiAgICAgIGlmICh0aGlzLmlzQWN0aXZlKSB0aGlzLmVudGVyKClcclxuICAgICAgZWxzZSB0aGlzLmxlYXZlKClcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBtb3VudGVkICgpIHtcclxuICAgIHRoaXMuJHJlZnMud3JhcHBlci5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICAndHJhbnNpdGlvbmVuZCcsXHJcbiAgICAgIHRoaXMub25UcmFuc2l0aW9uLFxyXG4gICAgICBmYWxzZVxyXG4gICAgKVxyXG4gICAgdGhpcy5zdGVwcGVyICYmIHRoaXMuc3RlcHBlci5yZWdpc3Rlcih0aGlzKVxyXG4gIH0sXHJcblxyXG4gIGJlZm9yZURlc3Ryb3kgKCkge1xyXG4gICAgdGhpcy4kcmVmcy53cmFwcGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoXHJcbiAgICAgICd0cmFuc2l0aW9uZW5kJyxcclxuICAgICAgdGhpcy5vblRyYW5zaXRpb24sXHJcbiAgICAgIGZhbHNlXHJcbiAgICApXHJcbiAgICB0aGlzLnN0ZXBwZXIgJiYgdGhpcy5zdGVwcGVyLnVucmVnaXN0ZXIodGhpcylcclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICBvblRyYW5zaXRpb24gKGU6IFRyYW5zaXRpb25FdmVudCkge1xyXG4gICAgICBpZiAoIXRoaXMuaXNBY3RpdmUgfHxcclxuICAgICAgICBlLnByb3BlcnR5TmFtZSAhPT0gJ2hlaWdodCdcclxuICAgICAgKSByZXR1cm5cclxuXHJcbiAgICAgIHRoaXMuaGVpZ2h0ID0gJ2F1dG8nXHJcbiAgICB9LFxyXG4gICAgZW50ZXIgKCkge1xyXG4gICAgICBsZXQgc2Nyb2xsSGVpZ2h0ID0gMFxyXG5cclxuICAgICAgLy8gUmVuZGVyIGJ1ZyB3aXRoIGhlaWdodFxyXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xyXG4gICAgICAgIHNjcm9sbEhlaWdodCA9IHRoaXMuJHJlZnMud3JhcHBlci5zY3JvbGxIZWlnaHRcclxuICAgICAgfSlcclxuXHJcbiAgICAgIHRoaXMuaGVpZ2h0ID0gMFxyXG5cclxuICAgICAgLy8gR2l2ZSB0aGUgY29sbGFwc2luZyBlbGVtZW50IHRpbWUgdG8gY29sbGFwc2VcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmlzQWN0aXZlICYmICh0aGlzLmhlaWdodCA9IChzY3JvbGxIZWlnaHQgfHwgJ2F1dG8nKSksIDQ1MClcclxuICAgIH0sXHJcbiAgICBsZWF2ZSAoKSB7XHJcbiAgICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy4kcmVmcy53cmFwcGVyLmNsaWVudEhlaWdodFxyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+ICh0aGlzLmhlaWdodCA9IDApLCAxMClcclxuICAgIH0sXHJcbiAgICB0b2dnbGUgKHN0ZXA6IHN0cmluZyB8IG51bWJlciwgcmV2ZXJzZTogYm9vbGVhbikge1xyXG4gICAgICB0aGlzLmlzQWN0aXZlID0gc3RlcC50b1N0cmluZygpID09PSB0aGlzLnN0ZXAudG9TdHJpbmcoKVxyXG4gICAgICB0aGlzLmlzUmV2ZXJzZSA9IHJldmVyc2VcclxuICAgIH1cclxuICB9LFxyXG5cclxuICByZW5kZXIgKGgpOiBWTm9kZSB7XHJcbiAgICBjb25zdCBjb250ZW50RGF0YTogVk5vZGVEYXRhID0ge1xyXG4gICAgICAnY2xhc3MnOiB0aGlzLmNsYXNzZXNcclxuICAgIH1cclxuICAgIGNvbnN0IHdyYXBwZXJEYXRhID0ge1xyXG4gICAgICAnY2xhc3MnOiB0aGlzLndyYXBwZXJDbGFzc2VzLFxyXG4gICAgICBzdHlsZTogdGhpcy5zdHlsZXMsXHJcbiAgICAgIHJlZjogJ3dyYXBwZXInXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF0aGlzLmlzVmVydGljYWwpIHtcclxuICAgICAgY29udGVudERhdGEuZGlyZWN0aXZlcyA9IFt7XHJcbiAgICAgICAgbmFtZTogJ3Nob3cnLFxyXG4gICAgICAgIHZhbHVlOiB0aGlzLmlzQWN0aXZlXHJcbiAgICAgIH1dXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgd3JhcHBlciA9IGgoJ2RpdicsIHdyYXBwZXJEYXRhLCBbdGhpcy4kc2xvdHMuZGVmYXVsdF0pXHJcbiAgICBjb25zdCBjb250ZW50ID0gaCgnZGl2JywgY29udGVudERhdGEsIFt3cmFwcGVyXSlcclxuXHJcbiAgICByZXR1cm4gaCh0aGlzLmNvbXB1dGVkVHJhbnNpdGlvbiwge1xyXG4gICAgICBvbjogdGhpcy4kbGlzdGVuZXJzXHJcbiAgICB9LCBbY29udGVudF0pXHJcbiAgfVxyXG59KVxyXG4iXX0=