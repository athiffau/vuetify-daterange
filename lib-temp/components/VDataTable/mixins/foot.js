/* @vue/component */
export default {
    methods: {
        genTFoot() {
            if (!this.$slots.footer) {
                return null;
            }
            const footer = this.$slots.footer;
            const row = this.hasTag(footer, 'td') ? this.genTR(footer) : footer;
            return this.$createElement('tfoot', [row]);
        },
        genActionsFooter() {
            if (this.hideActions) {
                return null;
            }
            return this.$createElement('div', {
                'class': this.classes
            }, this.genActions());
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9vdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZEYXRhVGFibGUvbWl4aW5zL2Zvb3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsb0JBQW9CO0FBQ3BCLGVBQWU7SUFDYixPQUFPLEVBQUU7UUFDUCxRQUFRO1lBQ04sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO2dCQUN2QixPQUFPLElBQUksQ0FBQTthQUNaO1lBRUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUE7WUFDakMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQTtZQUVuRSxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUM1QyxDQUFDO1FBQ0QsZ0JBQWdCO1lBQ2QsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO2dCQUNwQixPQUFPLElBQUksQ0FBQTthQUNaO1lBRUQsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRTtnQkFDaEMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO2FBQ3RCLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUE7UUFDdkIsQ0FBQztLQUNGO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qIEB2dWUvY29tcG9uZW50ICovXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBtZXRob2RzOiB7XHJcbiAgICBnZW5URm9vdCAoKSB7XHJcbiAgICAgIGlmICghdGhpcy4kc2xvdHMuZm9vdGVyKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGxcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgZm9vdGVyID0gdGhpcy4kc2xvdHMuZm9vdGVyXHJcbiAgICAgIGNvbnN0IHJvdyA9IHRoaXMuaGFzVGFnKGZvb3RlciwgJ3RkJykgPyB0aGlzLmdlblRSKGZvb3RlcikgOiBmb290ZXJcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCd0Zm9vdCcsIFtyb3ddKVxyXG4gICAgfSxcclxuICAgIGdlbkFjdGlvbnNGb290ZXIgKCkge1xyXG4gICAgICBpZiAodGhpcy5oaWRlQWN0aW9ucykge1xyXG4gICAgICAgIHJldHVybiBudWxsXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XHJcbiAgICAgICAgJ2NsYXNzJzogdGhpcy5jbGFzc2VzXHJcbiAgICAgIH0sIHRoaXMuZ2VuQWN0aW9ucygpKVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=