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
            if (this.$scopedSlots.activator && this.$scopedSlots.activator.length) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1nZW5lcmF0b3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVk1lbnUvbWl4aW5zL21lbnUtZ2VuZXJhdG9ycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxvQkFBb0I7QUFDcEIsZUFBZTtJQUNiLE9BQU8sRUFBRTtRQUNQLFlBQVk7WUFDVixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVM7Z0JBQUUsT0FBTyxJQUFJLENBQUE7WUFFdkUsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFBO1lBRXBCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNsQixJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7b0JBQ3BCLFNBQVMsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFBO29CQUM3QyxTQUFTLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQTtpQkFDOUM7cUJBQU0sSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO29CQUMzQixTQUFTLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQTtpQkFDN0M7YUFDRjtZQUVELElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFO2dCQUNyRSxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFBO2dCQUNoRSxJQUFJLENBQUMsYUFBYSxHQUFHLFNBQVMsQ0FBQTtnQkFDOUIsT0FBTyxTQUFTLENBQUE7YUFDakI7WUFFRCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFO2dCQUNoQyxXQUFXLEVBQUUsbUJBQW1CO2dCQUNoQyxPQUFP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QUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO1FBQ3ZGLENBQUM7S0FDRjtDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAdnVlL2NvbXBvbmVudCAqL1xyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgbWV0aG9kczoge1xyXG4gICAgZ2VuQWN0aXZhdG9yICgpIHtcclxuICAgICAgaWYgKCF0aGlzLiRzbG90cy5hY3RpdmF0b3IgJiYgIXRoaXMuJHNjb3BlZFNsb3RzLmFjdGl2YXRvcikgcmV0dXJuIG51bGxcclxuXHJcbiAgICAgIGNvbnN0IGxpc3RlbmVycyA9IHt9XHJcblxyXG4gICAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcclxuICAgICAgICBpZiAodGhpcy5vcGVuT25Ib3Zlcikge1xyXG4gICAgICAgICAgbGlzdGVuZXJzLm1vdXNlZW50ZXIgPSB0aGlzLm1vdXNlRW50ZXJIYW5kbGVyXHJcbiAgICAgICAgICBsaXN0ZW5lcnMubW91c2VsZWF2ZSA9IHRoaXMubW91c2VMZWF2ZUhhbmRsZXJcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMub3Blbk9uQ2xpY2spIHtcclxuICAgICAgICAgIGxpc3RlbmVycy5jbGljayA9IHRoaXMuYWN0aXZhdG9yQ2xpY2tIYW5kbGVyXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy4kc2NvcGVkU2xvdHMuYWN0aXZhdG9yICYmIHRoaXMuJHNjb3BlZFNsb3RzLmFjdGl2YXRvci5sZW5ndGgpIHtcclxuICAgICAgICBjb25zdCBhY3RpdmF0b3IgPSB0aGlzLiRzY29wZWRTbG90cy5hY3RpdmF0b3IoeyBvbjogbGlzdGVuZXJzIH0pXHJcbiAgICAgICAgdGhpcy5hY3RpdmF0b3JOb2RlID0gYWN0aXZhdG9yXHJcbiAgICAgICAgcmV0dXJuIGFjdGl2YXRvclxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xyXG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1tZW51X19hY3RpdmF0b3InLFxyXG4gICAgICAgICdjbGFzcyc6IHtcclxuICAgICAgICAgICd2LW1lbnVfX2FjdGl2YXRvci0tYWN0aXZlJzogdGhpcy5oYXNKdXN0Rm9jdXNlZCB8fCB0aGlzLmlzQWN0aXZlLFxyXG4gICAgICAgICAgJ3YtbWVudV9fYWN0aXZhdG9yLS1kaXNhYmxlZCc6IHRoaXMuZGlzYWJsZWRcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlZjogJ2FjdGl2YXRvcicsXHJcbiAgICAgICAgb246IGxpc3RlbmVyc1xyXG4gICAgICB9LCB0aGlzLiRzbG90cy5hY3RpdmF0b3IpXHJcbiAgICB9LFxyXG5cclxuICAgIGdlblRyYW5zaXRpb24gKCkge1xyXG4gICAgICBpZiAoIXRoaXMudHJhbnNpdGlvbikgcmV0dXJuIHRoaXMuZ2VuQ29udGVudCgpXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgndHJhbnNpdGlvbicsIHtcclxuICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgbmFtZTogdGhpcy50cmFuc2l0aW9uXHJcbiAgICAgICAgfVxyXG4gICAgICB9LCBbdGhpcy5nZW5Db250ZW50KCldKVxyXG4gICAgfSxcclxuXHJcbiAgICBnZW5EaXJlY3RpdmVzICgpIHtcclxuICAgICAgLy8gRG8gbm90IGFkZCBjbGljayBvdXRzaWRlIGZvciBob3ZlciBtZW51XHJcbiAgICAgIGNvbnN0IGRpcmVjdGl2ZXMgPSAhdGhpcy5vcGVuT25Ib3ZlciAmJiB0aGlzLmNsb3NlT25DbGljayA/IFt7XHJcbiAgICAgICAgbmFtZTogJ2NsaWNrLW91dHNpZGUnLFxyXG4gICAgICAgIHZhbHVlOiAoKSA9PiAodGhpcy5pc0FjdGl2ZSA9IGZhbHNlKSxcclxuICAgICAgICBhcmdzOiB7XHJcbiAgICAgICAgICBjbG9zZUNvbmRpdGlvbmFsOiB0aGlzLmNsb3NlQ29uZGl0aW9uYWwsXHJcbiAgICAgICAgICBpbmNsdWRlOiAoKSA9PiBbdGhpcy4kZWwsIC4uLnRoaXMuZ2V0T3BlbkRlcGVuZGVudEVsZW1lbnRzKCldXHJcbiAgICAgICAgfVxyXG4gICAgICB9XSA6IFtdXHJcblxyXG4gICAgICBkaXJlY3RpdmVzLnB1c2goe1xyXG4gICAgICAgIG5hbWU6ICdzaG93JyxcclxuICAgICAgICB2YWx1ZTogdGhpcy5pc0NvbnRlbnRBY3RpdmVcclxuICAgICAgfSlcclxuXHJcbiAgICAgIHJldHVybiBkaXJlY3RpdmVzXHJcbiAgICB9LFxyXG5cclxuICAgIGdlbkNvbnRlbnQgKCkge1xyXG4gICAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICAgIGF0dHJzOiB0aGlzLmdldFNjb3BlSWRBdHRycygpLFxyXG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1tZW51X19jb250ZW50JyxcclxuICAgICAgICAnY2xhc3MnOiB7XHJcbiAgICAgICAgICAuLi50aGlzLnJvb3RUaGVtZUNsYXNzZXMsXHJcbiAgICAgICAgICAndi1tZW51X19jb250ZW50LS1hdXRvJzogdGhpcy5hdXRvLFxyXG4gICAgICAgICAgJ21lbnVhYmxlX19jb250ZW50X19hY3RpdmUnOiB0aGlzLmlzQWN0aXZlLFxyXG4gICAgICAgICAgW3RoaXMuY29udGVudENsYXNzLnRyaW0oKV06IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHN0eWxlOiB0aGlzLnN0eWxlcyxcclxuICAgICAgICBkaXJlY3RpdmVzOiB0aGlzLmdlbkRpcmVjdGl2ZXMoKSxcclxuICAgICAgICByZWY6ICdjb250ZW50JyxcclxuICAgICAgICBvbjoge1xyXG4gICAgICAgICAgY2xpY2s6IGUgPT4ge1xyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgICAgIGlmIChlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJykpIHJldHVyblxyXG4gICAgICAgICAgICBpZiAodGhpcy5jbG9zZU9uQ29udGVudENsaWNrKSB0aGlzLmlzQWN0aXZlID0gZmFsc2VcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICF0aGlzLmRpc2FibGVkICYmIHRoaXMub3Blbk9uSG92ZXIgJiYgKG9wdGlvbnMub24ubW91c2VlbnRlciA9IHRoaXMubW91c2VFbnRlckhhbmRsZXIpXHJcbiAgICAgIHRoaXMub3Blbk9uSG92ZXIgJiYgKG9wdGlvbnMub24ubW91c2VsZWF2ZSA9IHRoaXMubW91c2VMZWF2ZUhhbmRsZXIpXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywgb3B0aW9ucywgdGhpcy5zaG93TGF6eUNvbnRlbnQodGhpcy4kc2xvdHMuZGVmYXVsdCkpXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==