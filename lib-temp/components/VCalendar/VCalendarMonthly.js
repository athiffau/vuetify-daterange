// Styles
import '../../stylus/components/_calendar-weekly.styl';
// Mixins
import VCalendarWeekly from './VCalendarWeekly';
// Util
import { parseTimestamp } from './util/timestamp';
/* @vue/component */
export default VCalendarWeekly.extend({
    name: 'v-calendar-monthly',
    computed: {
        staticClass() {
            return 'v-calendar-monthly v-calendar-weekly';
        },
        parsedStart() {
            return this.getStartOfMonth(parseTimestamp(this.start));
        },
        parsedEnd() {
            return this.getEndOfMonth(parseTimestamp(this.end));
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkNhbGVuZGFyTW9udGhseS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZDYWxlbmRhci9WQ2FsZW5kYXJNb250aGx5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFNBQVM7QUFDVCxPQUFPLCtDQUErQyxDQUFBO0FBRXRELFNBQVM7QUFDVCxPQUFPLGVBQWUsTUFBTSxtQkFBbUIsQ0FBQTtBQUUvQyxPQUFPO0FBQ1AsT0FBTyxFQUFjLGNBQWMsRUFBRSxNQUFNLGtCQUFrQixDQUFBO0FBRTdELG9CQUFvQjtBQUNwQixlQUFlLGVBQWUsQ0FBQyxNQUFNLENBQUM7SUFDcEMsSUFBSSxFQUFFLG9CQUFvQjtJQUUxQixRQUFRLEVBQUU7UUFDUixXQUFXO1lBQ1QsT0FBTyxzQ0FBc0MsQ0FBQTtRQUMvQyxDQUFDO1FBQ0QsV0FBVztZQUNULE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBZSxDQUFDLENBQUE7UUFDdkUsQ0FBQztRQUNELFNBQVM7WUFDUCxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQWUsQ0FBQyxDQUFBO1FBQ25FLENBQUM7S0FDRjtDQUVGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlc1xyXG5pbXBvcnQgJy4uLy4uL3N0eWx1cy9jb21wb25lbnRzL19jYWxlbmRhci13ZWVrbHkuc3R5bCdcclxuXHJcbi8vIE1peGluc1xyXG5pbXBvcnQgVkNhbGVuZGFyV2Vla2x5IGZyb20gJy4vVkNhbGVuZGFyV2Vla2x5J1xyXG5cclxuLy8gVXRpbFxyXG5pbXBvcnQgeyBWVGltZXN0YW1wLCBwYXJzZVRpbWVzdGFtcCB9IGZyb20gJy4vdXRpbC90aW1lc3RhbXAnXHJcblxyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG5leHBvcnQgZGVmYXVsdCBWQ2FsZW5kYXJXZWVrbHkuZXh0ZW5kKHtcclxuICBuYW1lOiAndi1jYWxlbmRhci1tb250aGx5JyxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIHN0YXRpY0NsYXNzICgpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gJ3YtY2FsZW5kYXItbW9udGhseSB2LWNhbGVuZGFyLXdlZWtseSdcclxuICAgIH0sXHJcbiAgICBwYXJzZWRTdGFydCAoKTogVlRpbWVzdGFtcCB7XHJcbiAgICAgIHJldHVybiB0aGlzLmdldFN0YXJ0T2ZNb250aChwYXJzZVRpbWVzdGFtcCh0aGlzLnN0YXJ0KSBhcyBWVGltZXN0YW1wKVxyXG4gICAgfSxcclxuICAgIHBhcnNlZEVuZCAoKTogVlRpbWVzdGFtcCB7XHJcbiAgICAgIHJldHVybiB0aGlzLmdldEVuZE9mTW9udGgocGFyc2VUaW1lc3RhbXAodGhpcy5lbmQpIGFzIFZUaW1lc3RhbXApXHJcbiAgICB9XHJcbiAgfVxyXG5cclxufSlcclxuIl19