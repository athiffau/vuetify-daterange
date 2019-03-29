import { getSlotType } from '../../../util/helpers';
/* @vue/component */
export default {
    methods: {
        genActivator() {
            if (!this.$slots.activator && !this.$scopedSlots.activator)
                return null;
            const listeners = {};
            if (!this.disabled) {
                if (this.openOnHover) {
                    listeners.mouseenter = this.mouseEnterHandler;
                    listeners.mouseleave = this.mouseLeaveHandler;
                }
                else if (this.openOnClick) {
                    listeners.click = this.activatorClickHandler;
                }
            }
            if (getSlotType(this, 'activator') === 'scoped') {
                listeners.keydown = this.onKeyDown;
                const activator = this.$scopedSlots.activator({ on: listeners });
                this.activatorNode = activator;
                return activator;
            }
            return this.$createElement('div', {
                staticClass: 'v-menu__activator',
                'class': {
                    'v-menu__activator--active': this.hasJustFocused || this.isActive,
                    'v-menu__activator--disabled': this.disabled
                },
                ref: 'activator',
                on: listeners
            }, this.$slots.activator);
        },
        genTransition() {
            if (!this.transition)
                return this.genContent();
            return this.$createElement('transition', {
                props: {
                    name: this.transition
                }
            }, [this.genContent()]);
        },
        genDirectives() {
            // Do not add click outside for hover menu
            const directives = !this.openOnHover && this.closeOnClick ? [{
                    name: 'click-outside',
                    value: () => { this.isActive = false; },
                    args: {
                        closeConditional: this.closeConditional,
                        include: () => [this.$el, ...this.getOpenDependentElements()]
                    }
                }] : [];
            directives.push({
                name: 'show',
                value: this.isContentActive
            });
            return directives;
        },
        genContent() {
            const options = {
                attrs: this.getScopeIdAttrs(),
                staticClass: 'v-menu__content',
                'class': {
                    ...this.rootThemeClasses,
                    'v-menu__content--auto': this.auto,
                    'v-menu__content--fixed': this.activatorFixed,
                    'menuable__content__active': this.isActive,
                    [this.contentClass.trim()]: true
                },
                style: this.styles,
                directives: this.genDirectives(),
                ref: 'content',
                on: {
                    click: e => {
                        e.stopPropagation();
                        if (e.target.getAttribute('disabled'))
                            return;
                        if (this.closeOnContentClick)
                            this.isActive = false;
                    },
                    keydown: this.onKeyDown
                }
            };
            !this.disabled && this.openOnHover && (options.on.mouseenter = this.mouseEnterHandler);
            this.openOnHover && (options.on.mouseleave = this.mouseLeaveHandler);
            return this.$createElement('div', options, this.showLazyContent(this.$slots.default));
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1nZW5lcmF0b3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVk1lbnUvbWl4aW5zL21lbnUtZ2VuZXJhdG9ycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sdUJBQXVCLENBQUE7QUFFbkQsb0JBQW9CO0FBQ3BCLGVBQWU7SUFDYixPQUFPLEVBQUU7UUFDUCxZQUFZO1lBQ1YsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTO2dCQUFFLE9BQU8sSUFBSSxDQUFBO1lBRXZFLE1BQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQTtZQUVwQixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDbEIsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO29CQUNwQixTQUFTLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQTtvQkFDN0MsU0FBUyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUE7aUJBQzlDO3FCQUFNLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtvQkFDM0IsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUE7aUJBQzdDO2FBQ0Y7WUFFRCxJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLEtBQUssUUFBUSxFQUFFO2dCQUMvQyxTQUFTLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUE7Z0JBQ2xDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUE7Z0JBQ2hFLElBQUksQ0FBQyxhQUFhLEdBQUcsU0FBUyxDQUFBO2dCQUM5QixPQUFPLFNBQVMsQ0FBQTthQUNqQjtZQUVELE9BQU8s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QyxPQUFPLENBQUMsRUFBRSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtZQUVwRSxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtRQUN2RixDQUFDO0tBQ0Y7Q0FDRixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0U2xvdFR5cGUgfSBmcm9tICcuLi8uLi8uLi91dGlsL2hlbHBlcnMnXHJcblxyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgbWV0aG9kczoge1xyXG4gICAgZ2VuQWN0aXZhdG9yICgpIHtcclxuICAgICAgaWYgKCF0aGlzLiRzbG90cy5hY3RpdmF0b3IgJiYgIXRoaXMuJHNjb3BlZFNsb3RzLmFjdGl2YXRvcikgcmV0dXJuIG51bGxcclxuXHJcbiAgICAgIGNvbnN0IGxpc3RlbmVycyA9IHt9XHJcblxyXG4gICAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcclxuICAgICAgICBpZiAodGhpcy5vcGVuT25Ib3Zlcikge1xyXG4gICAgICAgICAgbGlzdGVuZXJzLm1vdXNlZW50ZXIgPSB0aGlzLm1vdXNlRW50ZXJIYW5kbGVyXHJcbiAgICAgICAgICBsaXN0ZW5lcnMubW91c2VsZWF2ZSA9IHRoaXMubW91c2VMZWF2ZUhhbmRsZXJcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMub3Blbk9uQ2xpY2spIHtcclxuICAgICAgICAgIGxpc3RlbmVycy5jbGljayA9IHRoaXMuYWN0aXZhdG9yQ2xpY2tIYW5kbGVyXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZ2V0U2xvdFR5cGUodGhpcywgJ2FjdGl2YXRvcicpID09PSAnc2NvcGVkJykge1xyXG4gICAgICAgIGxpc3RlbmVycy5rZXlkb3duID0gdGhpcy5vbktleURvd25cclxuICAgICAgICBjb25zdCBhY3RpdmF0b3IgPSB0aGlzLiRzY29wZWRTbG90cy5hY3RpdmF0b3IoeyBvbjogbGlzdGVuZXJzIH0pXHJcbiAgICAgICAgdGhpcy5hY3RpdmF0b3JOb2RlID0gYWN0aXZhdG9yXHJcbiAgICAgICAgcmV0dXJuIGFjdGl2YXRvclxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xyXG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1tZW51X19hY3RpdmF0b3InLFxyXG4gICAgICAgICdjbGFzcyc6IHtcclxuICAgICAgICAgICd2LW1lbnVfX2FjdGl2YXRvci0tYWN0aXZlJzogdGhpcy5oYXNKdXN0Rm9jdXNlZCB8fCB0aGlzLmlzQWN0aXZlLFxyXG4gICAgICAgICAgJ3YtbWVudV9fYWN0aXZhdG9yLS1kaXNhYmxlZCc6IHRoaXMuZGlzYWJsZWRcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlZjogJ2FjdGl2YXRvcicsXHJcbiAgICAgICAgb246IGxpc3RlbmVyc1xyXG4gICAgICB9LCB0aGlzLiRzbG90cy5hY3RpdmF0b3IpXHJcbiAgICB9LFxyXG5cclxuICAgIGdlblRyYW5zaXRpb24gKCkge1xyXG4gICAgICBpZiAoIXRoaXMudHJhbnNpdGlvbikgcmV0dXJuIHRoaXMuZ2VuQ29udGVudCgpXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgndHJhbnNpdGlvbicsIHtcclxuICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgbmFtZTogdGhpcy50cmFuc2l0aW9uXHJcbiAgICAgICAgfVxyXG4gICAgICB9LCBbdGhpcy5nZW5Db250ZW50KCldKVxyXG4gICAgfSxcclxuXHJcbiAgICBnZW5EaXJlY3RpdmVzICgpIHtcclxuICAgICAgLy8gRG8gbm90IGFkZCBjbGljayBvdXRzaWRlIGZvciBob3ZlciBtZW51XHJcbiAgICAgIGNvbnN0IGRpcmVjdGl2ZXMgPSAhdGhpcy5vcGVuT25Ib3ZlciAmJiB0aGlzLmNsb3NlT25DbGljayA/IFt7XHJcbiAgICAgICAgbmFtZTogJ2NsaWNrLW91dHNpZGUnLFxyXG4gICAgICAgIHZhbHVlOiAoKSA9PiB7IHRoaXMuaXNBY3RpdmUgPSBmYWxzZSB9LFxyXG4gICAgICAgIGFyZ3M6IHtcclxuICAgICAgICAgIGNsb3NlQ29uZGl0aW9uYWw6IHRoaXMuY2xvc2VDb25kaXRpb25hbCxcclxuICAgICAgICAgIGluY2x1ZGU6ICgpID0+IFt0aGlzLiRlbCwgLi4udGhpcy5nZXRPcGVuRGVwZW5kZW50RWxlbWVudHMoKV1cclxuICAgICAgICB9XHJcbiAgICAgIH1dIDogW11cclxuXHJcbiAgICAgIGRpcmVjdGl2ZXMucHVzaCh7XHJcbiAgICAgICAgbmFtZTogJ3Nob3cnLFxyXG4gICAgICAgIHZhbHVlOiB0aGlzLmlzQ29udGVudEFjdGl2ZVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgcmV0dXJuIGRpcmVjdGl2ZXNcclxuICAgIH0sXHJcblxyXG4gICAgZ2VuQ29udGVudCAoKSB7XHJcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgYXR0cnM6IHRoaXMuZ2V0U2NvcGVJZEF0dHJzKCksXHJcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LW1lbnVfX2NvbnRlbnQnLFxyXG4gICAgICAgICdjbGFzcyc6IHtcclxuICAgICAgICAgIC4uLnRoaXMucm9vdFRoZW1lQ2xhc3NlcyxcclxuICAgICAgICAgICd2LW1lbnVfX2NvbnRlbnQtLWF1dG8nOiB0aGlzLmF1dG8sXHJcbiAgICAgICAgICAndi1tZW51X19jb250ZW50LS1maXhlZCc6IHRoaXMuYWN0aXZhdG9yRml4ZWQsXHJcbiAgICAgICAgICAnbWVudWFibGVfX2NvbnRlbnRfX2FjdGl2ZSc6IHRoaXMuaXNBY3RpdmUsXHJcbiAgICAgICAgICBbdGhpcy5jb250ZW50Q2xhc3MudHJpbSgpXTogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc3R5bGU6IHRoaXMuc3R5bGVzLFxyXG4gICAgICAgIGRpcmVjdGl2ZXM6IHRoaXMuZ2VuRGlyZWN0aXZlcygpLFxyXG4gICAgICAgIHJlZjogJ2NvbnRlbnQnLFxyXG4gICAgICAgIG9uOiB7XHJcbiAgICAgICAgICBjbGljazogZSA9PiB7XHJcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICAgICAgaWYgKGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGlzYWJsZWQnKSkgcmV0dXJuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNsb3NlT25Db250ZW50Q2xpY2spIHRoaXMuaXNBY3RpdmUgPSBmYWxzZVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGtleWRvd246IHRoaXMub25LZXlEb3duXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAhdGhpcy5kaXNhYmxlZCAmJiB0aGlzLm9wZW5PbkhvdmVyICYmIChvcHRpb25zLm9uLm1vdXNlZW50ZXIgPSB0aGlzLm1vdXNlRW50ZXJIYW5kbGVyKVxyXG4gICAgICB0aGlzLm9wZW5PbkhvdmVyICYmIChvcHRpb25zLm9uLm1vdXNlbGVhdmUgPSB0aGlzLm1vdXNlTGVhdmVIYW5kbGVyKVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIG9wdGlvbnMsIHRoaXMuc2hvd0xhenlDb250ZW50KHRoaXMuJHNsb3RzLmRlZmF1bHQpKVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=