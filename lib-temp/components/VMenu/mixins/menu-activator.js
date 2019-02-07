/**
 * Menu activator
 *
 * @mixin
 *
 * Handles the click and hover activation
 * Supports slotted and detached activators
 */
/* @vue/component */
export default {
    methods: {
        activatorClickHandler(e) {
            if (this.openOnClick && !this.isActive) {
                this.getActivator(e).focus();
                this.isActive = true;
                this.absoluteX = e.clientX;
                this.absoluteY = e.clientY;
            }
            else if (this.closeOnClick && this.isActive) {
                this.getActivator(e).blur();
                this.isActive = false;
            }
        },
        mouseEnterHandler() {
            this.runDelay('open', () => {
                if (this.hasJustFocused)
                    return;
                this.hasJustFocused = true;
                this.isActive = true;
            });
        },
        mouseLeaveHandler(e) {
            // Prevent accidental re-activation
            this.runDelay('close', () => {
                if (this.$refs.content.contains(e.relatedTarget))
                    return;
                requestAnimationFrame(() => {
                    this.isActive = false;
                    this.callDeactivate();
                });
            });
        },
        addActivatorEvents(activator = null) {
            if (!activator || this.disabled)
                return;
            activator.addEventListener('click', this.activatorClickHandler);
        },
        removeActivatorEvents(activator = null) {
            if (!activator)
                return;
            activator.removeEventListener('click', this.activatorClickHandler);
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1hY3RpdmF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WTWVudS9taXhpbnMvbWVudS1hY3RpdmF0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7R0FPRztBQUNILG9CQUFvQjtBQUNwQixlQUFlO0lBQ2IsT0FBTyxFQUFFO1FBQ1AscUJBQXFCLENBQUUsQ0FBQztZQUN0QixJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUN0QyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFBO2dCQUM1QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQTtnQkFDcEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFBO2dCQUMxQixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUE7YUFDM0I7aUJBQU0sSUFBSSxJQUFJLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQzdDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUE7Z0JBQzNCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFBO2FBQ3RCO1FBQ0gsQ0FBQztRQUNELGlCQUFpQjtZQUNmLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRTtnQkFDekIsSUFBSSxJQUFJLENBQUMsY0FBYztvQkFBRSxPQUFNO2dCQUUvQixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQTtnQkFDMUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUE7WUFDdEIsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDO1FBQ0QsaUJBQWlCLENBQUUsQ0FBQztZQUNsQixtQ0FBbUM7WUFDbkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO2dCQUMxQixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDO29CQUFFLE9BQU07Z0JBRXhELHFCQUFxQixDQUFDLEdBQUcsRUFBRTtvQkFDekIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUE7b0JBQ3JCLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQTtnQkFDdkIsQ0FBQyxDQUFDLENBQUE7WUFDSixDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUM7UUFDRCxrQkFBa0IsQ0FBRSxTQUFTLEdBQUcsSUFBSTtZQUNsQyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxRQUFRO2dCQUFFLE9BQU07WUFDdkMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQTtRQUNqRSxDQUFDO1FBQ0QscUJBQXFCLENBQUUsU0FBUyxHQUFHLElBQUk7WUFDckMsSUFBSSxDQUFDLFNBQVM7Z0JBQUUsT0FBTTtZQUN0QixTQUFTLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO1FBQ3BFLENBQUM7S0FDRjtDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogTWVudSBhY3RpdmF0b3JcclxuICpcclxuICogQG1peGluXHJcbiAqXHJcbiAqIEhhbmRsZXMgdGhlIGNsaWNrIGFuZCBob3ZlciBhY3RpdmF0aW9uXHJcbiAqIFN1cHBvcnRzIHNsb3R0ZWQgYW5kIGRldGFjaGVkIGFjdGl2YXRvcnNcclxuICovXHJcbi8qIEB2dWUvY29tcG9uZW50ICovXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBtZXRob2RzOiB7XHJcbiAgICBhY3RpdmF0b3JDbGlja0hhbmRsZXIgKGUpIHtcclxuICAgICAgaWYgKHRoaXMub3Blbk9uQ2xpY2sgJiYgIXRoaXMuaXNBY3RpdmUpIHtcclxuICAgICAgICB0aGlzLmdldEFjdGl2YXRvcihlKS5mb2N1cygpXHJcbiAgICAgICAgdGhpcy5pc0FjdGl2ZSA9IHRydWVcclxuICAgICAgICB0aGlzLmFic29sdXRlWCA9IGUuY2xpZW50WFxyXG4gICAgICAgIHRoaXMuYWJzb2x1dGVZID0gZS5jbGllbnRZXHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jbG9zZU9uQ2xpY2sgJiYgdGhpcy5pc0FjdGl2ZSkge1xyXG4gICAgICAgIHRoaXMuZ2V0QWN0aXZhdG9yKGUpLmJsdXIoKVxyXG4gICAgICAgIHRoaXMuaXNBY3RpdmUgPSBmYWxzZVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgbW91c2VFbnRlckhhbmRsZXIgKCkge1xyXG4gICAgICB0aGlzLnJ1bkRlbGF5KCdvcGVuJywgKCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLmhhc0p1c3RGb2N1c2VkKSByZXR1cm5cclxuXHJcbiAgICAgICAgdGhpcy5oYXNKdXN0Rm9jdXNlZCA9IHRydWVcclxuICAgICAgICB0aGlzLmlzQWN0aXZlID0gdHJ1ZVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIG1vdXNlTGVhdmVIYW5kbGVyIChlKSB7XHJcbiAgICAgIC8vIFByZXZlbnQgYWNjaWRlbnRhbCByZS1hY3RpdmF0aW9uXHJcbiAgICAgIHRoaXMucnVuRGVsYXkoJ2Nsb3NlJywgKCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLiRyZWZzLmNvbnRlbnQuY29udGFpbnMoZS5yZWxhdGVkVGFyZ2V0KSkgcmV0dXJuXHJcblxyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmlzQWN0aXZlID0gZmFsc2VcclxuICAgICAgICAgIHRoaXMuY2FsbERlYWN0aXZhdGUoKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgYWRkQWN0aXZhdG9yRXZlbnRzIChhY3RpdmF0b3IgPSBudWxsKSB7XHJcbiAgICAgIGlmICghYWN0aXZhdG9yIHx8IHRoaXMuZGlzYWJsZWQpIHJldHVyblxyXG4gICAgICBhY3RpdmF0b3IuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmFjdGl2YXRvckNsaWNrSGFuZGxlcilcclxuICAgIH0sXHJcbiAgICByZW1vdmVBY3RpdmF0b3JFdmVudHMgKGFjdGl2YXRvciA9IG51bGwpIHtcclxuICAgICAgaWYgKCFhY3RpdmF0b3IpIHJldHVyblxyXG4gICAgICBhY3RpdmF0b3IucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmFjdGl2YXRvckNsaWNrSGFuZGxlcilcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19