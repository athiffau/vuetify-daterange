// Helpers
import { convertToUnit } from '../util/helpers';
// Types
import Vue from 'vue';
export default Vue.extend({
    name: 'measurable',
    props: {
        height: [Number, String],
        maxHeight: [Number, String],
        maxWidth: [Number, String],
        minHeight: [Number, String],
        minWidth: [Number, String],
        width: [Number, String]
    },
    computed: {
        measurableStyles() {
            const styles = {};
            const height = convertToUnit(this.height);
            const minHeight = convertToUnit(this.minHeight);
            const minWidth = convertToUnit(this.minWidth);
            const maxHeight = convertToUnit(this.maxHeight);
            const maxWidth = convertToUnit(this.maxWidth);
            const width = convertToUnit(this.width);
            if (height)
                styles.height = height;
            if (minHeight)
                styles.minHeight = minHeight;
            if (minWidth)
                styles.minWidth = minWidth;
            if (maxHeight)
                styles.maxHeight = maxHeight;
            if (maxWidth)
                styles.maxWidth = maxWidth;
            if (width)
                styles.width = width;
            return styles;
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVhc3VyYWJsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taXhpbnMvbWVhc3VyYWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxVQUFVO0FBQ1YsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGlCQUFpQixDQUFBO0FBRS9DLFFBQVE7QUFDUixPQUFPLEdBQUcsTUFBTSxLQUFLLENBQUE7QUFLckIsZUFBZSxHQUFHLENBQUMsTUFBTSxDQUFDO0lBQ3hCLElBQUksRUFBRSxZQUFZO0lBRWxCLEtBQUssRUFBRTtRQUNMLE1BQU0sRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQXlCO1FBQ2hELFNBQVMsRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQXlCO1FBQ25ELFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQXlCO1FBQ2xELFNBQVMsRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQXlCO1FBQ25ELFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQXlCO1FBQ2xELEtBQUssRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQXlCO0tBQ2hEO0lBRUQsUUFBUSxFQUFFO1FBQ1IsZ0JBQWdCO1lBQ2QsTUFBTSxNQUFNLEdBQTJCLEVBQUUsQ0FBQTtZQUV6QyxNQUFNLE1BQU0sR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQ3pDLE1BQU0sU0FBUyxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7WUFDL0MsTUFBTSxRQUFRLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUM3QyxNQUFNLFNBQVMsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1lBQy9DLE1BQU0sUUFBUSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDN0MsTUFBTSxLQUFLLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUV2QyxJQUFJLE1BQU07Z0JBQUUsTUFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7WUFDbEMsSUFBSSxTQUFTO2dCQUFFLE1BQU0sQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFBO1lBQzNDLElBQUksUUFBUTtnQkFBRSxNQUFNLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQTtZQUN4QyxJQUFJLFNBQVM7Z0JBQUUsTUFBTSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUE7WUFDM0MsSUFBSSxRQUFRO2dCQUFFLE1BQU0sQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBO1lBQ3hDLElBQUksS0FBSztnQkFBRSxNQUFNLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTtZQUUvQixPQUFPLE1BQU0sQ0FBQTtRQUNmLENBQUM7S0FDRjtDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIEhlbHBlcnNcclxuaW1wb3J0IHsgY29udmVydFRvVW5pdCB9IGZyb20gJy4uL3V0aWwvaGVscGVycydcclxuXHJcbi8vIFR5cGVzXHJcbmltcG9ydCBWdWUgZnJvbSAndnVlJ1xyXG5pbXBvcnQgeyBQcm9wVmFsaWRhdG9yIH0gZnJvbSAndnVlL3R5cGVzL29wdGlvbnMnXHJcblxyXG5leHBvcnQgdHlwZSBOdW1iZXJPck51bWJlclN0cmluZyA9IFByb3BWYWxpZGF0b3I8c3RyaW5nIHwgbnVtYmVyIHwgdW5kZWZpbmVkPlxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVnVlLmV4dGVuZCh7XHJcbiAgbmFtZTogJ21lYXN1cmFibGUnLFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgaGVpZ2h0OiBbTnVtYmVyLCBTdHJpbmddIGFzIE51bWJlck9yTnVtYmVyU3RyaW5nLFxyXG4gICAgbWF4SGVpZ2h0OiBbTnVtYmVyLCBTdHJpbmddIGFzIE51bWJlck9yTnVtYmVyU3RyaW5nLFxyXG4gICAgbWF4V2lkdGg6IFtOdW1iZXIsIFN0cmluZ10gYXMgTnVtYmVyT3JOdW1iZXJTdHJpbmcsXHJcbiAgICBtaW5IZWlnaHQ6IFtOdW1iZXIsIFN0cmluZ10gYXMgTnVtYmVyT3JOdW1iZXJTdHJpbmcsXHJcbiAgICBtaW5XaWR0aDogW051bWJlciwgU3RyaW5nXSBhcyBOdW1iZXJPck51bWJlclN0cmluZyxcclxuICAgIHdpZHRoOiBbTnVtYmVyLCBTdHJpbmddIGFzIE51bWJlck9yTnVtYmVyU3RyaW5nXHJcbiAgfSxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIG1lYXN1cmFibGVTdHlsZXMgKCk6IG9iamVjdCB7XHJcbiAgICAgIGNvbnN0IHN0eWxlczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9XHJcblxyXG4gICAgICBjb25zdCBoZWlnaHQgPSBjb252ZXJ0VG9Vbml0KHRoaXMuaGVpZ2h0KVxyXG4gICAgICBjb25zdCBtaW5IZWlnaHQgPSBjb252ZXJ0VG9Vbml0KHRoaXMubWluSGVpZ2h0KVxyXG4gICAgICBjb25zdCBtaW5XaWR0aCA9IGNvbnZlcnRUb1VuaXQodGhpcy5taW5XaWR0aClcclxuICAgICAgY29uc3QgbWF4SGVpZ2h0ID0gY29udmVydFRvVW5pdCh0aGlzLm1heEhlaWdodClcclxuICAgICAgY29uc3QgbWF4V2lkdGggPSBjb252ZXJ0VG9Vbml0KHRoaXMubWF4V2lkdGgpXHJcbiAgICAgIGNvbnN0IHdpZHRoID0gY29udmVydFRvVW5pdCh0aGlzLndpZHRoKVxyXG5cclxuICAgICAgaWYgKGhlaWdodCkgc3R5bGVzLmhlaWdodCA9IGhlaWdodFxyXG4gICAgICBpZiAobWluSGVpZ2h0KSBzdHlsZXMubWluSGVpZ2h0ID0gbWluSGVpZ2h0XHJcbiAgICAgIGlmIChtaW5XaWR0aCkgc3R5bGVzLm1pbldpZHRoID0gbWluV2lkdGhcclxuICAgICAgaWYgKG1heEhlaWdodCkgc3R5bGVzLm1heEhlaWdodCA9IG1heEhlaWdodFxyXG4gICAgICBpZiAobWF4V2lkdGgpIHN0eWxlcy5tYXhXaWR0aCA9IG1heFdpZHRoXHJcbiAgICAgIGlmICh3aWR0aCkgc3R5bGVzLndpZHRoID0gd2lkdGhcclxuXHJcbiAgICAgIHJldHVybiBzdHlsZXNcclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiJdfQ==