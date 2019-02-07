/**
 * Menu position
 *
 * @mixin
 *
 * Used for calculating an automatic position (used for VSelect)
 * Will position the VMenu content properly over the VSelect
 */
/* @vue/component */
export default {
    data: () => ({
        calculatedTopAuto: 0
    }),
    methods: {
        calcScrollPosition() {
            const $el = this.$refs.content;
            const activeTile = $el.querySelector('.v-list__tile--active');
            const maxScrollTop = $el.scrollHeight - $el.offsetHeight;
            return activeTile
                ? Math.min(maxScrollTop, Math.max(0, activeTile.offsetTop - $el.offsetHeight / 2 + activeTile.offsetHeight / 2))
                : $el.scrollTop;
        },
        calcLeftAuto() {
            if (this.isAttached)
                return 0;
            return parseInt(this.dimensions.activator.left - this.defaultOffset * 2);
        },
        calcTopAuto() {
            const $el = this.$refs.content;
            const activeTile = $el.querySelector('.v-list__tile--active');
            if (!activeTile) {
                this.selectedIndex = null;
            }
            if (this.offsetY || !activeTile) {
                return this.computedTop;
            }
            this.selectedIndex = Array.from(this.tiles).indexOf(activeTile);
            const tileDistanceFromMenuTop = activeTile.offsetTop - this.calcScrollPosition();
            const firstTileOffsetTop = $el.querySelector('.v-list__tile').offsetTop;
            return this.computedTop - tileDistanceFromMenuTop - firstTileOffsetTop;
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1wb3NpdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZNZW51L21peGlucy9tZW51LXBvc2l0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0dBT0c7QUFDSCxvQkFBb0I7QUFDcEIsZUFBZTtJQUNiLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ1gsaUJBQWlCLEVBQUUsQ0FBQztLQUNyQixDQUFDO0lBQ0YsT0FBTyxFQUFFO1FBQ1Asa0JBQWtCO1lBQ2hCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFBO1lBQzlCLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsdUJBQXVCLENBQUMsQ0FBQTtZQUM3RCxNQUFNLFlBQVksR0FBRyxHQUFHLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUE7WUFFeEQsT0FBTyxVQUFVO2dCQUNmLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hILENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFBO1FBQ25CLENBQUM7UUFDRCxZQUFZO1lBQ1YsSUFBSSxJQUFJLENBQUMsVUFBVTtnQkFBRSxPQUFPLENBQUMsQ0FBQTtZQUU3QixPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUMxRSxDQUFDO1FBQ0QsV0FBVztZQUNULE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFBO1lBQzlCLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsdUJBQXVCLENBQUMsQ0FBQTtZQUU3RCxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNmLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFBO2FBQzFCO1lBRUQsSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUMvQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUE7YUFDeEI7WUFFRCxJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQTtZQUUvRCxNQUFNLHVCQUF1QixHQUFHLFVBQVUsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUE7WUFDaEYsTUFBTSxrQkFBa0IsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDLFNBQVMsQ0FBQTtZQUV2RSxPQUFPLElBQUksQ0FBQyxXQUFXLEdBQUcsdUJBQXVCLEdBQUcsa0JBQWtCLENBQUE7UUFDeEUsQ0FBQztLQUNGO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBNZW51IHBvc2l0aW9uXHJcbiAqXHJcbiAqIEBtaXhpblxyXG4gKlxyXG4gKiBVc2VkIGZvciBjYWxjdWxhdGluZyBhbiBhdXRvbWF0aWMgcG9zaXRpb24gKHVzZWQgZm9yIFZTZWxlY3QpXHJcbiAqIFdpbGwgcG9zaXRpb24gdGhlIFZNZW51IGNvbnRlbnQgcHJvcGVybHkgb3ZlciB0aGUgVlNlbGVjdFxyXG4gKi9cclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIGRhdGE6ICgpID0+ICh7XHJcbiAgICBjYWxjdWxhdGVkVG9wQXV0bzogMFxyXG4gIH0pLFxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGNhbGNTY3JvbGxQb3NpdGlvbiAoKSB7XHJcbiAgICAgIGNvbnN0ICRlbCA9IHRoaXMuJHJlZnMuY29udGVudFxyXG4gICAgICBjb25zdCBhY3RpdmVUaWxlID0gJGVsLnF1ZXJ5U2VsZWN0b3IoJy52LWxpc3RfX3RpbGUtLWFjdGl2ZScpXHJcbiAgICAgIGNvbnN0IG1heFNjcm9sbFRvcCA9ICRlbC5zY3JvbGxIZWlnaHQgLSAkZWwub2Zmc2V0SGVpZ2h0XHJcblxyXG4gICAgICByZXR1cm4gYWN0aXZlVGlsZVxyXG4gICAgICAgID8gTWF0aC5taW4obWF4U2Nyb2xsVG9wLCBNYXRoLm1heCgwLCBhY3RpdmVUaWxlLm9mZnNldFRvcCAtICRlbC5vZmZzZXRIZWlnaHQgLyAyICsgYWN0aXZlVGlsZS5vZmZzZXRIZWlnaHQgLyAyKSlcclxuICAgICAgICA6ICRlbC5zY3JvbGxUb3BcclxuICAgIH0sXHJcbiAgICBjYWxjTGVmdEF1dG8gKCkge1xyXG4gICAgICBpZiAodGhpcy5pc0F0dGFjaGVkKSByZXR1cm4gMFxyXG5cclxuICAgICAgcmV0dXJuIHBhcnNlSW50KHRoaXMuZGltZW5zaW9ucy5hY3RpdmF0b3IubGVmdCAtIHRoaXMuZGVmYXVsdE9mZnNldCAqIDIpXHJcbiAgICB9LFxyXG4gICAgY2FsY1RvcEF1dG8gKCkge1xyXG4gICAgICBjb25zdCAkZWwgPSB0aGlzLiRyZWZzLmNvbnRlbnRcclxuICAgICAgY29uc3QgYWN0aXZlVGlsZSA9ICRlbC5xdWVyeVNlbGVjdG9yKCcudi1saXN0X190aWxlLS1hY3RpdmUnKVxyXG5cclxuICAgICAgaWYgKCFhY3RpdmVUaWxlKSB7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gbnVsbFxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5vZmZzZXRZIHx8ICFhY3RpdmVUaWxlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29tcHV0ZWRUb3BcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gQXJyYXkuZnJvbSh0aGlzLnRpbGVzKS5pbmRleE9mKGFjdGl2ZVRpbGUpXHJcblxyXG4gICAgICBjb25zdCB0aWxlRGlzdGFuY2VGcm9tTWVudVRvcCA9IGFjdGl2ZVRpbGUub2Zmc2V0VG9wIC0gdGhpcy5jYWxjU2Nyb2xsUG9zaXRpb24oKVxyXG4gICAgICBjb25zdCBmaXJzdFRpbGVPZmZzZXRUb3AgPSAkZWwucXVlcnlTZWxlY3RvcignLnYtbGlzdF9fdGlsZScpLm9mZnNldFRvcFxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuY29tcHV0ZWRUb3AgLSB0aWxlRGlzdGFuY2VGcm9tTWVudVRvcCAtIGZpcnN0VGlsZU9mZnNldFRvcFxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=