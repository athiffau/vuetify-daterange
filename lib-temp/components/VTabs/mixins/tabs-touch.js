/**
 * Tabs touch
 *
 * @mixin
 */
/* @vue/component */
export default {
    methods: {
        newOffset(direction) {
            const clientWidth = this.$refs.wrapper.clientWidth;
            if (direction === 'prev') {
                return Math.max(this.scrollOffset - clientWidth, 0);
            }
            else {
                return Math.min(this.scrollOffset + clientWidth, this.$refs.container.clientWidth - clientWidth);
            }
        },
        onTouchStart(e) {
            this.startX = this.scrollOffset + e.touchstartX;
            this.$refs.container.style.transition = 'none';
            this.$refs.container.style.willChange = 'transform';
        },
        onTouchMove(e) {
            this.scrollOffset = this.startX - e.touchmoveX;
        },
        onTouchEnd() {
            const container = this.$refs.container;
            const wrapper = this.$refs.wrapper;
            const maxScrollOffset = container.clientWidth - wrapper.clientWidth;
            container.style.transition = null;
            container.style.willChange = null;
            /* istanbul ignore else */
            if (this.scrollOffset < 0 || !this.isOverflowing) {
                this.scrollOffset = 0;
            }
            else if (this.scrollOffset >= maxScrollOffset) {
                this.scrollOffset = maxScrollOffset;
            }
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFicy10b3VjaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZUYWJzL21peGlucy90YWJzLXRvdWNoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0dBSUc7QUFDSCxvQkFBb0I7QUFDcEIsZUFBZTtJQUNiLE9BQU8sRUFBRTtRQUNQLFNBQVMsQ0FBRSxTQUFTO1lBQ2xCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQTtZQUVsRCxJQUFJLFNBQVMsS0FBSyxNQUFNLEVBQUU7Z0JBQ3hCLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQTthQUNwRDtpQkFBTTtnQkFDTCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQyxDQUFBO2FBQ2pHO1FBQ0gsQ0FBQztRQUNELFlBQVksQ0FBRSxDQUFDO1lBQ2IsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUE7WUFDL0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUE7WUFDOUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxXQUFXLENBQUE7UUFDckQsQ0FBQztRQUNELFdBQVcsQ0FBRSxDQUFDO1lBQ1osSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUE7UUFDaEQsQ0FBQztRQUNELFVBQVU7WUFDUixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQTtZQUN0QyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQTtZQUNsQyxNQUFNLGVBQWUsR0FBRyxTQUFTLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUE7WUFDbkUsU0FBUyxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFBO1lBQ2pDLFNBQVMsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQTtZQUVqQywwQkFBMEI7WUFDMUIsSUFBSSxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUU7Z0JBQ2hELElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFBO2FBQ3RCO2lCQUFNLElBQUksSUFBSSxDQUFDLFlBQVksSUFBSSxlQUFlLEVBQUU7Z0JBQy9DLElBQUksQ0FBQyxZQUFZLEdBQUcsZUFBZSxDQUFBO2FBQ3BDO1FBQ0gsQ0FBQztLQUNGO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBUYWJzIHRvdWNoXHJcbiAqXHJcbiAqIEBtaXhpblxyXG4gKi9cclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIG1ldGhvZHM6IHtcclxuICAgIG5ld09mZnNldCAoZGlyZWN0aW9uKSB7XHJcbiAgICAgIGNvbnN0IGNsaWVudFdpZHRoID0gdGhpcy4kcmVmcy53cmFwcGVyLmNsaWVudFdpZHRoXHJcblxyXG4gICAgICBpZiAoZGlyZWN0aW9uID09PSAncHJldicpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5tYXgodGhpcy5zY3JvbGxPZmZzZXQgLSBjbGllbnRXaWR0aCwgMClcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5taW4odGhpcy5zY3JvbGxPZmZzZXQgKyBjbGllbnRXaWR0aCwgdGhpcy4kcmVmcy5jb250YWluZXIuY2xpZW50V2lkdGggLSBjbGllbnRXaWR0aClcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIG9uVG91Y2hTdGFydCAoZSkge1xyXG4gICAgICB0aGlzLnN0YXJ0WCA9IHRoaXMuc2Nyb2xsT2Zmc2V0ICsgZS50b3VjaHN0YXJ0WFxyXG4gICAgICB0aGlzLiRyZWZzLmNvbnRhaW5lci5zdHlsZS50cmFuc2l0aW9uID0gJ25vbmUnXHJcbiAgICAgIHRoaXMuJHJlZnMuY29udGFpbmVyLnN0eWxlLndpbGxDaGFuZ2UgPSAndHJhbnNmb3JtJ1xyXG4gICAgfSxcclxuICAgIG9uVG91Y2hNb3ZlIChlKSB7XHJcbiAgICAgIHRoaXMuc2Nyb2xsT2Zmc2V0ID0gdGhpcy5zdGFydFggLSBlLnRvdWNobW92ZVhcclxuICAgIH0sXHJcbiAgICBvblRvdWNoRW5kICgpIHtcclxuICAgICAgY29uc3QgY29udGFpbmVyID0gdGhpcy4kcmVmcy5jb250YWluZXJcclxuICAgICAgY29uc3Qgd3JhcHBlciA9IHRoaXMuJHJlZnMud3JhcHBlclxyXG4gICAgICBjb25zdCBtYXhTY3JvbGxPZmZzZXQgPSBjb250YWluZXIuY2xpZW50V2lkdGggLSB3cmFwcGVyLmNsaWVudFdpZHRoXHJcbiAgICAgIGNvbnRhaW5lci5zdHlsZS50cmFuc2l0aW9uID0gbnVsbFxyXG4gICAgICBjb250YWluZXIuc3R5bGUud2lsbENoYW5nZSA9IG51bGxcclxuXHJcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXHJcbiAgICAgIGlmICh0aGlzLnNjcm9sbE9mZnNldCA8IDAgfHwgIXRoaXMuaXNPdmVyZmxvd2luZykge1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsT2Zmc2V0ID0gMFxyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc2Nyb2xsT2Zmc2V0ID49IG1heFNjcm9sbE9mZnNldCkge1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsT2Zmc2V0ID0gbWF4U2Nyb2xsT2Zmc2V0XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19