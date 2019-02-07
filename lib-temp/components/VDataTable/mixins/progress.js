/* @vue/component */
export default {
    methods: {
        genTProgress() {
            const col = this.$createElement('th', {
                staticClass: 'column',
                attrs: {
                    colspan: this.headerColumns
                }
            }, [this.genProgress()]);
            return this.genTR([col], {
                staticClass: 'v-datatable__progress'
            });
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WRGF0YVRhYmxlL21peGlucy9wcm9ncmVzcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxvQkFBb0I7QUFDcEIsZUFBZTtJQUNiLE9BQU8sRUFBRTtRQUNQLFlBQVk7WUFDVixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRTtnQkFDcEMsV0FBVyxFQUFFLFFBQVE7Z0JBQ3JCLEtBQUssRUFBRTtvQkFDTCxPQUFPLEVBQUUsSUFBSSxDQUFDLGFBQWE7aUJBQzVCO2FBQ0YsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUE7WUFFeEIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ3ZCLFdBQVcsRUFBRSx1QkFBdUI7YUFDckMsQ0FBQyxDQUFBO1FBQ0osQ0FBQztLQUNGO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qIEB2dWUvY29tcG9uZW50ICovXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBtZXRob2RzOiB7XHJcbiAgICBnZW5UUHJvZ3Jlc3MgKCkge1xyXG4gICAgICBjb25zdCBjb2wgPSB0aGlzLiRjcmVhdGVFbGVtZW50KCd0aCcsIHtcclxuICAgICAgICBzdGF0aWNDbGFzczogJ2NvbHVtbicsXHJcbiAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgIGNvbHNwYW46IHRoaXMuaGVhZGVyQ29sdW1uc1xyXG4gICAgICAgIH1cclxuICAgICAgfSwgW3RoaXMuZ2VuUHJvZ3Jlc3MoKV0pXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5nZW5UUihbY29sXSwge1xyXG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1kYXRhdGFibGVfX3Byb2dyZXNzJ1xyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=