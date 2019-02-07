import Vue from 'vue';
export default Vue.extend({
    name: 'elevatable',
    props: {
        elevation: [Number, String]
    },
    computed: {
        computedElevation() {
            return this.elevation;
        },
        elevationClasses() {
            if (!this.computedElevation)
                return {};
            return { [`elevation-${this.computedElevation}`]: true };
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxldmF0YWJsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taXhpbnMvZWxldmF0YWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEdBQUcsTUFBTSxLQUFLLENBQUE7QUFFckIsZUFBZSxHQUFHLENBQUMsTUFBTSxDQUFDO0lBQ3hCLElBQUksRUFBRSxZQUFZO0lBRWxCLEtBQUssRUFBRTtRQUNMLFNBQVMsRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7S0FDNUI7SUFFRCxRQUFRLEVBQUU7UUFDUixpQkFBaUI7WUFDZixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUE7UUFDdkIsQ0FBQztRQUNELGdCQUFnQjtZQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCO2dCQUFFLE9BQU8sRUFBRSxDQUFBO1lBRXRDLE9BQU8sRUFBRSxDQUFDLGFBQWEsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQTtRQUMxRCxDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVnVlIGZyb20gJ3Z1ZSdcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZ1ZS5leHRlbmQoe1xyXG4gIG5hbWU6ICdlbGV2YXRhYmxlJyxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIGVsZXZhdGlvbjogW051bWJlciwgU3RyaW5nXVxyXG4gIH0sXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICBjb21wdXRlZEVsZXZhdGlvbiAoKTogc3RyaW5nIHwgbnVtYmVyIHwgdW5kZWZpbmVkIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZWxldmF0aW9uXHJcbiAgICB9LFxyXG4gICAgZWxldmF0aW9uQ2xhc3NlcyAoKTogUmVjb3JkPHN0cmluZywgYm9vbGVhbj4ge1xyXG4gICAgICBpZiAoIXRoaXMuY29tcHV0ZWRFbGV2YXRpb24pIHJldHVybiB7fVxyXG5cclxuICAgICAgcmV0dXJuIHsgW2BlbGV2YXRpb24tJHt0aGlzLmNvbXB1dGVkRWxldmF0aW9ufWBdOiB0cnVlIH1cclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiJdfQ==