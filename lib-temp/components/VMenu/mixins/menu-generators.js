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
                    value: () => (this.isActive = false),
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
                    }
                }
            };
            !this.disabled && this.openOnHover && (options.on.mouseenter = this.mouseEnterHandler);
            this.openOnHover && (options.on.mouseleave = this.mouseLeaveHandler);
            return this.$createElement('div', options, this.showLazyContent(this.$slots.default));
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1nZW5lcmF0b3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVk1lbnUvbWl4aW5zL21lbnUtZ2VuZXJhdG9ycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sdUJBQXVCLENBQUE7QUFFbkQsb0JBQW9CO0FBQ3BCLGVBQWU7SUFDYixPQUFPLEVBQUU7UUFDUCxZQUFZO1lBQ1YsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTO2dCQUFFLE9BQU8sSUFBSSxDQUFBO1lBRXZFLE1BQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQTtZQUVwQixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDbEIsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO29CQUNwQixTQUFTLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQTtvQkFDN0MsU0FBUyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUE7aUJBQzlDO3FCQUFNLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtvQkFDM0IsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUE7aUJBQzdDO2FBQ0Y7WUFFRCxJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLEtBQUssUUFBUSxFQUFFO2dCQUMvQyxTQUFTLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUE7Z0JBQ2xDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUE7Z0JBQ2hFLElBQUksQ0FBQyxhQUFhLEdBQUcsU0FBUyxDQUFBO2dCQUM5QixPQUFPLFNBQVMsQ0FBQTthQUNqQjtZQUVELE9BQU8s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QUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUE7UUFDdkYsQ0FBQztLQUNGO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldFNsb3RUeXBlIH0gZnJvbSAnLi4vLi4vLi4vdXRpbC9oZWxwZXJzJ1xyXG5cclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIG1ldGhvZHM6IHtcclxuICAgIGdlbkFjdGl2YXRvciAoKSB7XHJcbiAgICAgIGlmICghdGhpcy4kc2xvdHMuYWN0aXZhdG9yICYmICF0aGlzLiRzY29wZWRTbG90cy5hY3RpdmF0b3IpIHJldHVybiBudWxsXHJcblxyXG4gICAgICBjb25zdCBsaXN0ZW5lcnMgPSB7fVxyXG5cclxuICAgICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XHJcbiAgICAgICAgaWYgKHRoaXMub3Blbk9uSG92ZXIpIHtcclxuICAgICAgICAgIGxpc3RlbmVycy5tb3VzZWVudGVyID0gdGhpcy5tb3VzZUVudGVySGFuZGxlclxyXG4gICAgICAgICAgbGlzdGVuZXJzLm1vdXNlbGVhdmUgPSB0aGlzLm1vdXNlTGVhdmVIYW5kbGVyXHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm9wZW5PbkNsaWNrKSB7XHJcbiAgICAgICAgICBsaXN0ZW5lcnMuY2xpY2sgPSB0aGlzLmFjdGl2YXRvckNsaWNrSGFuZGxlclxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGdldFNsb3RUeXBlKHRoaXMsICdhY3RpdmF0b3InKSA9PT0gJ3Njb3BlZCcpIHtcclxuICAgICAgICBsaXN0ZW5lcnMua2V5ZG93biA9IHRoaXMub25LZXlEb3duXHJcbiAgICAgICAgY29uc3QgYWN0aXZhdG9yID0gdGhpcy4kc2NvcGVkU2xvdHMuYWN0aXZhdG9yKHsgb246IGxpc3RlbmVycyB9KVxyXG4gICAgICAgIHRoaXMuYWN0aXZhdG9yTm9kZSA9IGFjdGl2YXRvclxyXG4gICAgICAgIHJldHVybiBhY3RpdmF0b3JcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICBzdGF0aWNDbGFzczogJ3YtbWVudV9fYWN0aXZhdG9yJyxcclxuICAgICAgICAnY2xhc3MnOiB7XHJcbiAgICAgICAgICAndi1tZW51X19hY3RpdmF0b3ItLWFjdGl2ZSc6IHRoaXMuaGFzSnVzdEZvY3VzZWQgfHwgdGhpcy5pc0FjdGl2ZSxcclxuICAgICAgICAgICd2LW1lbnVfX2FjdGl2YXRvci0tZGlzYWJsZWQnOiB0aGlzLmRpc2FibGVkXHJcbiAgICAgICAgfSxcclxuICAgICAgICByZWY6ICdhY3RpdmF0b3InLFxyXG4gICAgICAgIG9uOiBsaXN0ZW5lcnNcclxuICAgICAgfSwgdGhpcy4kc2xvdHMuYWN0aXZhdG9yKVxyXG4gICAgfSxcclxuXHJcbiAgICBnZW5UcmFuc2l0aW9uICgpIHtcclxuICAgICAgaWYgKCF0aGlzLnRyYW5zaXRpb24pIHJldHVybiB0aGlzLmdlbkNvbnRlbnQoKVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ3RyYW5zaXRpb24nLCB7XHJcbiAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgIG5hbWU6IHRoaXMudHJhbnNpdGlvblxyXG4gICAgICAgIH1cclxuICAgICAgfSwgW3RoaXMuZ2VuQ29udGVudCgpXSlcclxuICAgIH0sXHJcblxyXG4gICAgZ2VuRGlyZWN0aXZlcyAoKSB7XHJcbiAgICAgIC8vIERvIG5vdCBhZGQgY2xpY2sgb3V0c2lkZSBmb3IgaG92ZXIgbWVudVxyXG4gICAgICBjb25zdCBkaXJlY3RpdmVzID0gIXRoaXMub3Blbk9uSG92ZXIgJiYgdGhpcy5jbG9zZU9uQ2xpY2sgPyBbe1xyXG4gICAgICAgIG5hbWU6ICdjbGljay1vdXRzaWRlJyxcclxuICAgICAgICB2YWx1ZTogKCkgPT4gKHRoaXMuaXNBY3RpdmUgPSBmYWxzZSksXHJcbiAgICAgICAgYXJnczoge1xyXG4gICAgICAgICAgY2xvc2VDb25kaXRpb25hbDogdGhpcy5jbG9zZUNvbmRpdGlvbmFsLFxyXG4gICAgICAgICAgaW5jbHVkZTogKCkgPT4gW3RoaXMuJGVsLCAuLi50aGlzLmdldE9wZW5EZXBlbmRlbnRFbGVtZW50cygpXVxyXG4gICAgICAgIH1cclxuICAgICAgfV0gOiBbXVxyXG5cclxuICAgICAgZGlyZWN0aXZlcy5wdXNoKHtcclxuICAgICAgICBuYW1lOiAnc2hvdycsXHJcbiAgICAgICAgdmFsdWU6IHRoaXMuaXNDb250ZW50QWN0aXZlXHJcbiAgICAgIH0pXHJcblxyXG4gICAgICByZXR1cm4gZGlyZWN0aXZlc1xyXG4gICAgfSxcclxuXHJcbiAgICBnZW5Db250ZW50ICgpIHtcclxuICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcclxuICAgICAgICBhdHRyczogdGhpcy5nZXRTY29wZUlkQXR0cnMoKSxcclxuICAgICAgICBzdGF0aWNDbGFzczogJ3YtbWVudV9fY29udGVudCcsXHJcbiAgICAgICAgJ2NsYXNzJzoge1xyXG4gICAgICAgICAgLi4udGhpcy5yb290VGhlbWVDbGFzc2VzLFxyXG4gICAgICAgICAgJ3YtbWVudV9fY29udGVudC0tYXV0byc6IHRoaXMuYXV0byxcclxuICAgICAgICAgICdtZW51YWJsZV9fY29udGVudF9fYWN0aXZlJzogdGhpcy5pc0FjdGl2ZSxcclxuICAgICAgICAgIFt0aGlzLmNvbnRlbnRDbGFzcy50cmltKCldOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzdHlsZTogdGhpcy5zdHlsZXMsXHJcbiAgICAgICAgZGlyZWN0aXZlczogdGhpcy5nZW5EaXJlY3RpdmVzKCksXHJcbiAgICAgICAgcmVmOiAnY29udGVudCcsXHJcbiAgICAgICAgb246IHtcclxuICAgICAgICAgIGNsaWNrOiBlID0+IHtcclxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgICAgICBpZiAoZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkaXNhYmxlZCcpKSByZXR1cm5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY2xvc2VPbkNvbnRlbnRDbGljaykgdGhpcy5pc0FjdGl2ZSA9IGZhbHNlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAhdGhpcy5kaXNhYmxlZCAmJiB0aGlzLm9wZW5PbkhvdmVyICYmIChvcHRpb25zLm9uLm1vdXNlZW50ZXIgPSB0aGlzLm1vdXNlRW50ZXJIYW5kbGVyKVxyXG4gICAgICB0aGlzLm9wZW5PbkhvdmVyICYmIChvcHRpb25zLm9uLm1vdXNlbGVhdmUgPSB0aGlzLm1vdXNlTGVhdmVIYW5kbGVyKVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIG9wdGlvbnMsIHRoaXMuc2hvd0xhenlDb250ZW50KHRoaXMuJHNsb3RzLmRlZmF1bHQpKVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=