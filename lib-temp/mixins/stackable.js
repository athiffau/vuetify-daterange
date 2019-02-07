import Vue from 'vue';
import { getZIndex } from '../util/helpers';
/* @vue/component */
export default Vue.extend().extend({
    name: 'stackable',
    data() {
        return {
            stackClass: 'unpecified',
            stackElement: null,
            stackExclude: null,
            stackMinZIndex: 0,
            isActive: false
        };
    },
    computed: {
        activeZIndex() {
            if (typeof window === 'undefined')
                return 0;
            const content = this.stackElement || this.$refs.content;
            // Return current zindex if not active
            const index = !this.isActive
                ? getZIndex(content)
                : this.getMaxZIndex(this.stackExclude || [content]) + 2;
            if (index == null)
                return index;
            // Return max current z-index (excluding self) + 2
            // (2 to leave room for an overlay below, if needed)
            return parseInt(index);
        }
    },
    methods: {
        getMaxZIndex(exclude = []) {
            const base = this.$el;
            // Start with lowest allowed z-index or z-index of
            // base component's element, whichever is greater
            const zis = [this.stackMinZIndex, getZIndex(base)];
            // Convert the NodeList to an array to
            // prevent an Edge bug with Symbol.iterator
            // https://github.com/vuetifyjs/vuetify/issues/2146
            const activeElements = [...document.getElementsByClassName(this.stackClass)];
            // Get z-index for all active dialogs
            for (let index = 0; index < activeElements.length; index++) {
                if (!exclude.includes(activeElements[index])) {
                    zis.push(getZIndex(activeElements[index]));
                }
            }
            return Math.max(...zis);
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2thYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21peGlucy9zdGFja2FibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxHQUFHLE1BQU0sS0FBSyxDQUFBO0FBRXJCLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQTtBQVEzQyxvQkFBb0I7QUFDcEIsZUFBZSxHQUFHLENBQUMsTUFBTSxFQUFXLENBQUMsTUFBTSxDQUFDO0lBQzFDLElBQUksRUFBRSxXQUFXO0lBRWpCLElBQUk7UUFDRixPQUFPO1lBQ0wsVUFBVSxFQUFFLFlBQVk7WUFDeEIsWUFBWSxFQUFFLElBQXNCO1lBQ3BDLFlBQVksRUFBRSxJQUF3QjtZQUN0QyxjQUFjLEVBQUUsQ0FBQztZQUNqQixRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFBO0lBQ0gsQ0FBQztJQUNELFFBQVEsRUFBRTtRQUNSLFlBQVk7WUFDVixJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVc7Z0JBQUUsT0FBTyxDQUFDLENBQUE7WUFFM0MsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQTtZQUN2RCxzQ0FBc0M7WUFFdEMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUTtnQkFDMUIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3BCLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxZQUFZLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUV6RCxJQUFJLEtBQUssSUFBSSxJQUFJO2dCQUFFLE9BQU8sS0FBSyxDQUFBO1lBRS9CLGtEQUFrRDtZQUNsRCxvREFBb0Q7WUFDcEQsT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDeEIsQ0FBQztLQUNGO0lBQ0QsT0FBTyxFQUFFO1FBQ1AsWUFBWSxDQUFFLFVBQXFCLEVBQUU7WUFDbkMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQTtZQUNyQixrREFBa0Q7WUFDbEQsaURBQWlEO1lBQ2pELE1BQU0sR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtZQUNsRCxzQ0FBc0M7WUFDdEMsMkNBQTJDO1lBQzNDLG1EQUFtRDtZQUNuRCxNQUFNLGNBQWMsR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFBO1lBRTVFLHFDQUFxQztZQUNyQyxLQUFLLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsY0FBYyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTtnQkFDMUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7b0JBQzVDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7aUJBQzNDO2FBQ0Y7WUFFRCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQTtRQUN6QixDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVnVlIGZyb20gJ3Z1ZSdcclxuXHJcbmltcG9ydCB7IGdldFpJbmRleCB9IGZyb20gJy4uL3V0aWwvaGVscGVycydcclxuXHJcbmludGVyZmFjZSBvcHRpb25zIGV4dGVuZHMgVnVlIHtcclxuICAkcmVmczoge1xyXG4gICAgY29udGVudDogRWxlbWVudFxyXG4gIH1cclxufVxyXG5cclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuZXhwb3J0IGRlZmF1bHQgVnVlLmV4dGVuZDxvcHRpb25zPigpLmV4dGVuZCh7XHJcbiAgbmFtZTogJ3N0YWNrYWJsZScsXHJcblxyXG4gIGRhdGEgKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc3RhY2tDbGFzczogJ3VucGVjaWZpZWQnLFxyXG4gICAgICBzdGFja0VsZW1lbnQ6IG51bGwgYXMgRWxlbWVudCB8IG51bGwsXHJcbiAgICAgIHN0YWNrRXhjbHVkZTogbnVsbCBhcyBFbGVtZW50W10gfCBudWxsLFxyXG4gICAgICBzdGFja01pblpJbmRleDogMCxcclxuICAgICAgaXNBY3RpdmU6IGZhbHNlXHJcbiAgICB9XHJcbiAgfSxcclxuICBjb21wdXRlZDoge1xyXG4gICAgYWN0aXZlWkluZGV4ICgpOiBudW1iZXIge1xyXG4gICAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybiAwXHJcblxyXG4gICAgICBjb25zdCBjb250ZW50ID0gdGhpcy5zdGFja0VsZW1lbnQgfHwgdGhpcy4kcmVmcy5jb250ZW50XHJcbiAgICAgIC8vIFJldHVybiBjdXJyZW50IHppbmRleCBpZiBub3QgYWN0aXZlXHJcblxyXG4gICAgICBjb25zdCBpbmRleCA9ICF0aGlzLmlzQWN0aXZlXHJcbiAgICAgICAgPyBnZXRaSW5kZXgoY29udGVudClcclxuICAgICAgICA6IHRoaXMuZ2V0TWF4WkluZGV4KHRoaXMuc3RhY2tFeGNsdWRlIHx8IFtjb250ZW50XSkgKyAyXHJcblxyXG4gICAgICBpZiAoaW5kZXggPT0gbnVsbCkgcmV0dXJuIGluZGV4XHJcblxyXG4gICAgICAvLyBSZXR1cm4gbWF4IGN1cnJlbnQgei1pbmRleCAoZXhjbHVkaW5nIHNlbGYpICsgMlxyXG4gICAgICAvLyAoMiB0byBsZWF2ZSByb29tIGZvciBhbiBvdmVybGF5IGJlbG93LCBpZiBuZWVkZWQpXHJcbiAgICAgIHJldHVybiBwYXJzZUludChpbmRleClcclxuICAgIH1cclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGdldE1heFpJbmRleCAoZXhjbHVkZTogRWxlbWVudFtdID0gW10pIHtcclxuICAgICAgY29uc3QgYmFzZSA9IHRoaXMuJGVsXHJcbiAgICAgIC8vIFN0YXJ0IHdpdGggbG93ZXN0IGFsbG93ZWQgei1pbmRleCBvciB6LWluZGV4IG9mXHJcbiAgICAgIC8vIGJhc2UgY29tcG9uZW50J3MgZWxlbWVudCwgd2hpY2hldmVyIGlzIGdyZWF0ZXJcclxuICAgICAgY29uc3QgemlzID0gW3RoaXMuc3RhY2tNaW5aSW5kZXgsIGdldFpJbmRleChiYXNlKV1cclxuICAgICAgLy8gQ29udmVydCB0aGUgTm9kZUxpc3QgdG8gYW4gYXJyYXkgdG9cclxuICAgICAgLy8gcHJldmVudCBhbiBFZGdlIGJ1ZyB3aXRoIFN5bWJvbC5pdGVyYXRvclxyXG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdnVldGlmeWpzL3Z1ZXRpZnkvaXNzdWVzLzIxNDZcclxuICAgICAgY29uc3QgYWN0aXZlRWxlbWVudHMgPSBbLi4uZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh0aGlzLnN0YWNrQ2xhc3MpXVxyXG5cclxuICAgICAgLy8gR2V0IHotaW5kZXggZm9yIGFsbCBhY3RpdmUgZGlhbG9nc1xyXG4gICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgYWN0aXZlRWxlbWVudHMubGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICAgICAgaWYgKCFleGNsdWRlLmluY2x1ZGVzKGFjdGl2ZUVsZW1lbnRzW2luZGV4XSkpIHtcclxuICAgICAgICAgIHppcy5wdXNoKGdldFpJbmRleChhY3RpdmVFbGVtZW50c1tpbmRleF0pKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIE1hdGgubWF4KC4uLnppcylcclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiJdfQ==