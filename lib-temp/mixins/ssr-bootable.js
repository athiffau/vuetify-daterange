import Vue from 'vue';
/**
 * SSRBootable
 *
 * @mixin
 *
 * Used in layout components (drawer, toolbar, content)
 * to avoid an entry animation when using SSR
 */
export default Vue.extend({
    name: 'ssr-bootable',
    data: () => ({
        isBooted: false
    }),
    mounted() {
        // Use setAttribute instead of dataset
        // because dataset does not work well
        // with unit tests
        window.requestAnimationFrame(() => {
            this.$el.setAttribute('data-booted', 'true');
            this.isBooted = true;
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3NyLWJvb3RhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21peGlucy9zc3ItYm9vdGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxHQUFHLE1BQU0sS0FBSyxDQUFBO0FBRXJCOzs7Ozs7O0dBT0c7QUFDSCxlQUFlLEdBQUcsQ0FBQyxNQUFNLENBQUM7SUFDeEIsSUFBSSxFQUFFLGNBQWM7SUFFcEIsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDWCxRQUFRLEVBQUUsS0FBSztLQUNoQixDQUFDO0lBRUYsT0FBTztRQUNMLHNDQUFzQztRQUN0QyxxQ0FBcUM7UUFDckMsa0JBQWtCO1FBQ2xCLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLEVBQUU7WUFDaEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFBO1lBQzVDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBO1FBQ3RCLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWdWUgZnJvbSAndnVlJ1xyXG5cclxuLyoqXHJcbiAqIFNTUkJvb3RhYmxlXHJcbiAqXHJcbiAqIEBtaXhpblxyXG4gKlxyXG4gKiBVc2VkIGluIGxheW91dCBjb21wb25lbnRzIChkcmF3ZXIsIHRvb2xiYXIsIGNvbnRlbnQpXHJcbiAqIHRvIGF2b2lkIGFuIGVudHJ5IGFuaW1hdGlvbiB3aGVuIHVzaW5nIFNTUlxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgVnVlLmV4dGVuZCh7XHJcbiAgbmFtZTogJ3Nzci1ib290YWJsZScsXHJcblxyXG4gIGRhdGE6ICgpID0+ICh7XHJcbiAgICBpc0Jvb3RlZDogZmFsc2VcclxuICB9KSxcclxuXHJcbiAgbW91bnRlZCAoKSB7XHJcbiAgICAvLyBVc2Ugc2V0QXR0cmlidXRlIGluc3RlYWQgb2YgZGF0YXNldFxyXG4gICAgLy8gYmVjYXVzZSBkYXRhc2V0IGRvZXMgbm90IHdvcmsgd2VsbFxyXG4gICAgLy8gd2l0aCB1bml0IHRlc3RzXHJcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlKCdkYXRhLWJvb3RlZCcsICd0cnVlJylcclxuICAgICAgdGhpcy5pc0Jvb3RlZCA9IHRydWVcclxuICAgIH0pXHJcbiAgfVxyXG59KVxyXG4iXX0=