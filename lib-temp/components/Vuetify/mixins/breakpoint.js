import Vue from 'vue';
const BREAKPOINTS_DEFAULTS = {
    thresholds: {
        xs: 600,
        sm: 960,
        md: 1280,
        lg: 1920
    },
    scrollbarWidth: 16
};
/**
 * Factory function for the breakpoint mixin.
 */
export default function breakpoint(opts = {}) {
    if (!opts) {
        opts = {};
    }
    return Vue.extend({
        data() {
            return {
                clientHeight: getClientHeight(),
                clientWidth: getClientWidth(),
                resizeTimeout: undefined,
                ...BREAKPOINTS_DEFAULTS,
                ...opts
            };
        },
        computed: {
            breakpoint() {
                const xs = this.clientWidth < this.thresholds.xs;
                const sm = this.clientWidth < this.thresholds.sm && !xs;
                const md = this.clientWidth < (this.thresholds.md - this.scrollbarWidth) && !(sm || xs);
                const lg = this.clientWidth < (this.thresholds.lg - this.scrollbarWidth) && !(md || sm || xs);
                const xl = this.clientWidth >= (this.thresholds.lg - this.scrollbarWidth);
                const xsOnly = xs;
                const smOnly = sm;
                const smAndDown = (xs || sm) && !(md || lg || xl);
                const smAndUp = !xs && (sm || md || lg || xl);
                const mdOnly = md;
                const mdAndDown = (xs || sm || md) && !(lg || xl);
                const mdAndUp = !(xs || sm) && (md || lg || xl);
                const lgOnly = lg;
                const lgAndDown = (xs || sm || md || lg) && !xl;
                const lgAndUp = !(xs || sm || md) && (lg || xl);
                const xlOnly = xl;
                let name;
                switch (true) {
                    case (xs):
                        name = 'xs';
                        break;
                    case (sm):
                        name = 'sm';
                        break;
                    case (md):
                        name = 'md';
                        break;
                    case (lg):
                        name = 'lg';
                        break;
                    default:
                        name = 'xl';
                        break;
                }
                return {
                    // Definite breakpoint.
                    xs,
                    sm,
                    md,
                    lg,
                    xl,
                    // Useful e.g. to construct CSS class names dynamically.
                    name,
                    // Breakpoint ranges.
                    xsOnly,
                    smOnly,
                    smAndDown,
                    smAndUp,
                    mdOnly,
                    mdAndDown,
                    mdAndUp,
                    lgOnly,
                    lgAndDown,
                    lgAndUp,
                    xlOnly,
                    // For custom breakpoint logic.
                    width: this.clientWidth,
                    height: this.clientHeight,
                    thresholds: this.thresholds,
                    scrollbarWidth: this.scrollbarWidth
                };
            }
        },
        created() {
            if (typeof window === 'undefined')
                return;
            window.addEventListener('resize', this.onResize, { passive: true });
        },
        beforeDestroy() {
            if (typeof window === 'undefined')
                return;
            window.removeEventListener('resize', this.onResize);
        },
        methods: {
            onResize() {
                clearTimeout(this.resizeTimeout);
                // Added debounce to match what
                // v-resize used to do but was
                // removed due to a memory leak
                // https://github.com/vuetifyjs/vuetify/pull/2997
                this.resizeTimeout = window.setTimeout(this.setDimensions, 200);
            },
            setDimensions() {
                this.clientHeight = getClientHeight();
                this.clientWidth = getClientWidth();
            }
        }
    });
}
// Cross-browser support as described in:
// https://stackoverflow.com/questions/1248081
function getClientWidth() {
    if (typeof document === 'undefined')
        return 0; // SSR
    return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
}
function getClientHeight() {
    if (typeof document === 'undefined')
        return 0; // SSR
    return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJlYWtwb2ludC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1Z1ZXRpZnkvbWl4aW5zL2JyZWFrcG9pbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxHQUFHLE1BQU0sS0FBSyxDQUFBO0FBR3JCLE1BQU0sb0JBQW9CLEdBQUc7SUFDM0IsVUFBVSxFQUFFO1FBQ1YsRUFBRSxFQUFFLEdBQUc7UUFDUCxFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLElBQUk7S0FDVDtJQUNELGNBQWMsRUFBRSxFQUFFO0NBQ25CLENBQUE7QUFFRDs7R0FFRztBQUNILE1BQU0sQ0FBQyxPQUFPLFVBQVUsVUFBVSxDQUFFLE9BQXdDLEVBQUU7SUFDNUUsSUFBSSxDQUFDLElBQUksRUFBRTtRQUNULElBQUksR0FBRyxFQUFFLENBQUE7S0FDVjtJQUVELE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQztRQUNoQixJQUFJO1lBQ0YsT0FBTztnQkFDTCxZQUFZLEVBQUUsZUFBZSxFQUFFO2dCQUMvQixXQUFXLEVBQUUsY0FBYyxFQUFFO2dCQUM3QixhQUFhLEVBQUUsU0FBK0I7Z0JBRTlDLEdBQUcsb0JBQW9CO2dCQUN2QixHQUFHLElBQUk7YUFDUixDQUFBO1FBQ0gsQ0FBQztRQUVELFFBQVEsRUFBRTtZQUNSLFVBQVU7Z0JBQ1IsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQTtnQkFDaEQsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQTtnQkFDdkQsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxjQUFj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LENBQUMsR0FBRyxDQUNiLFFBQVEsQ0FBQyxlQUFnQixDQUFDLFlBQVksRUFDdEMsTUFBTSxDQUFDLFdBQVcsSUFBSSxDQUFDLENBQ3hCLENBQUE7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZ1ZSBmcm9tICd2dWUnXHJcbmltcG9ydCB7IFZ1ZXRpZnlVc2VPcHRpb25zLCBWdWV0aWZ5QnJlYWtwb2ludCB9IGZyb20gJ3Z1ZXRpZnkvdHlwZXMnXHJcblxyXG5jb25zdCBCUkVBS1BPSU5UU19ERUZBVUxUUyA9IHtcclxuICB0aHJlc2hvbGRzOiB7XHJcbiAgICB4czogNjAwLFxyXG4gICAgc206IDk2MCxcclxuICAgIG1kOiAxMjgwLFxyXG4gICAgbGc6IDE5MjBcclxuICB9LFxyXG4gIHNjcm9sbGJhcldpZHRoOiAxNlxyXG59XHJcblxyXG4vKipcclxuICogRmFjdG9yeSBmdW5jdGlvbiBmb3IgdGhlIGJyZWFrcG9pbnQgbWl4aW4uXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBicmVha3BvaW50IChvcHRzOiBWdWV0aWZ5VXNlT3B0aW9uc1snYnJlYWtwb2ludCddID0ge30pIHtcclxuICBpZiAoIW9wdHMpIHtcclxuICAgIG9wdHMgPSB7fVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIFZ1ZS5leHRlbmQoe1xyXG4gICAgZGF0YSAoKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgY2xpZW50SGVpZ2h0OiBnZXRDbGllbnRIZWlnaHQoKSxcclxuICAgICAgICBjbGllbnRXaWR0aDogZ2V0Q2xpZW50V2lkdGgoKSxcclxuICAgICAgICByZXNpemVUaW1lb3V0OiB1bmRlZmluZWQgYXMgbnVtYmVyIHwgdW5kZWZpbmVkLFxyXG5cclxuICAgICAgICAuLi5CUkVBS1BPSU5UU19ERUZBVUxUUyxcclxuICAgICAgICAuLi5vcHRzXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgY29tcHV0ZWQ6IHtcclxuICAgICAgYnJlYWtwb2ludCAoKTogVnVldGlmeUJyZWFrcG9pbnQge1xyXG4gICAgICAgIGNvbnN0IHhzID0gdGhpcy5jbGllbnRXaWR0aCA8IHRoaXMudGhyZXNob2xkcy54c1xyXG4gICAgICAgIGNvbnN0IHNtID0gdGhpcy5jbGllbnRXaWR0aCA8IHRoaXMudGhyZXNob2xkcy5zbSAmJiAheHNcclxuICAgICAgICBjb25zdCBtZCA9IHRoaXMuY2xpZW50V2lkdGggPCAodGhpcy50aHJlc2hvbGRzLm1kIC0gdGhpcy5zY3JvbGxiYXJXaWR0aCkgJiYgIShzbSB8fCB4cylcclxuICAgICAgICBjb25zdCBsZyA9IHRoaXMuY2xpZW50V2lkdGggPCAodGhpcy50aHJlc2hvbGRzLmxnIC0gdGhpcy5zY3JvbGxiYXJXaWR0aCkgJiYgIShtZCB8fCBzbSB8fCB4cylcclxuICAgICAgICBjb25zdCB4bCA9IHRoaXMuY2xpZW50V2lkdGggPj0gKHRoaXMudGhyZXNob2xkcy5sZyAtIHRoaXMuc2Nyb2xsYmFyV2lkdGgpXHJcblxyXG4gICAgICAgIGNvbnN0IHhzT25seSA9IHhzXHJcbiAgICAgICAgY29uc3Qgc21Pbmx5ID0gc21cclxuICAgICAgICBjb25zdCBzbUFuZERvd24gPSAoeHMgfHwgc20pICYmICEobWQgfHwgbGcgfHwgeGwpXHJcbiAgICAgICAgY29uc3Qgc21BbmRVcCA9ICF4cyAmJiAoc20gfHwgbWQgfHwgbGcgfHwgeGwpXHJcbiAgICAgICAgY29uc3QgbWRPbmx5ID0gbWRcclxuICAgICAgICBjb25zdCBtZEFuZERvd24gPSAoeHMgfHwgc20gfHwgbWQpICYmICEobGcgfHwgeGwpXHJcbiAgICAgICAgY29uc3QgbWRBbmRVcCA9ICEoeHMgfHwgc20pICYmIChtZCB8fCBsZyB8fCB4bClcclxuICAgICAgICBjb25zdCBsZ09ubHkgPSBsZ1xyXG4gICAgICAgIGNvbnN0IGxnQW5kRG93biA9ICh4cyB8fCBzbSB8fCBtZCB8fCBsZykgJiYgIXhsXHJcbiAgICAgICAgY29uc3QgbGdBbmRVcCA9ICEoeHMgfHwgc20gfHwgbWQpICYmIChsZyB8fCB4bClcclxuICAgICAgICBjb25zdCB4bE9ubHkgPSB4bFxyXG5cclxuICAgICAgICBsZXQgbmFtZVxyXG4gICAgICAgIHN3aXRjaCAodHJ1ZSkge1xyXG4gICAgICAgICAgY2FzZSAoeHMpOlxyXG4gICAgICAgICAgICBuYW1lID0gJ3hzJ1xyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSAoc20pOlxyXG4gICAgICAgICAgICBuYW1lID0gJ3NtJ1xyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSAobWQpOlxyXG4gICAgICAgICAgICBuYW1lID0gJ21kJ1xyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSAobGcpOlxyXG4gICAgICAgICAgICBuYW1lID0gJ2xnJ1xyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgbmFtZSA9ICd4bCdcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAvLyBEZWZpbml0ZSBicmVha3BvaW50LlxyXG4gICAgICAgICAgeHMsXHJcbiAgICAgICAgICBzbSxcclxuICAgICAgICAgIG1kLFxyXG4gICAgICAgICAgbGcsXHJcbiAgICAgICAgICB4bCxcclxuXHJcbiAgICAgICAgICAvLyBVc2VmdWwgZS5nLiB0byBjb25zdHJ1Y3QgQ1NTIGNsYXNzIG5hbWVzIGR5bmFtaWNhbGx5LlxyXG4gICAgICAgICAgbmFtZSxcclxuXHJcbiAgICAgICAgICAvLyBCcmVha3BvaW50IHJhbmdlcy5cclxuICAgICAgICAgIHhzT25seSxcclxuICAgICAgICAgIHNtT25seSxcclxuICAgICAgICAgIHNtQW5kRG93bixcclxuICAgICAgICAgIHNtQW5kVXAsXHJcbiAgICAgICAgICBtZE9ubHksXHJcbiAgICAgICAgICBtZEFuZERvd24sXHJcbiAgICAgICAgICBtZEFuZFVwLFxyXG4gICAgICAgICAgbGdPbmx5LFxyXG4gICAgICAgICAgbGdBbmREb3duLFxyXG4gICAgICAgICAgbGdBbmRVcCxcclxuICAgICAgICAgIHhsT25seSxcclxuXHJcbiAgICAgICAgICAvLyBGb3IgY3VzdG9tIGJyZWFrcG9pbnQgbG9naWMuXHJcbiAgICAgICAgICB3aWR0aDogdGhpcy5jbGllbnRXaWR0aCxcclxuICAgICAgICAgIGhlaWdodDogdGhpcy5jbGllbnRIZWlnaHQsXHJcbiAgICAgICAgICB0aHJlc2hvbGRzOiB0aGlzLnRocmVzaG9sZHMsXHJcbiAgICAgICAgICBzY3JvbGxiYXJXaWR0aDogdGhpcy5zY3JvbGxiYXJXaWR0aFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBjcmVhdGVkICgpIHtcclxuICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSByZXR1cm5cclxuXHJcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLm9uUmVzaXplLCB7IHBhc3NpdmU6IHRydWUgfSlcclxuICAgIH0sXHJcblxyXG4gICAgYmVmb3JlRGVzdHJveSAoKSB7XHJcbiAgICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykgcmV0dXJuXHJcblxyXG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5vblJlc2l6ZSlcclxuICAgIH0sXHJcblxyXG4gICAgbWV0aG9kczoge1xyXG4gICAgICBvblJlc2l6ZSAoKTogdm9pZCB7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMucmVzaXplVGltZW91dClcclxuXHJcbiAgICAgICAgLy8gQWRkZWQgZGVib3VuY2UgdG8gbWF0Y2ggd2hhdFxyXG4gICAgICAgIC8vIHYtcmVzaXplIHVzZWQgdG8gZG8gYnV0IHdhc1xyXG4gICAgICAgIC8vIHJlbW92ZWQgZHVlIHRvIGEgbWVtb3J5IGxlYWtcclxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdnVldGlmeWpzL3Z1ZXRpZnkvcHVsbC8yOTk3XHJcbiAgICAgICAgdGhpcy5yZXNpemVUaW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQodGhpcy5zZXREaW1lbnNpb25zLCAyMDApXHJcbiAgICAgIH0sXHJcbiAgICAgIHNldERpbWVuc2lvbnMgKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY2xpZW50SGVpZ2h0ID0gZ2V0Q2xpZW50SGVpZ2h0KClcclxuICAgICAgICB0aGlzLmNsaWVudFdpZHRoID0gZ2V0Q2xpZW50V2lkdGgoKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSlcclxufVxyXG5cclxuLy8gQ3Jvc3MtYnJvd3NlciBzdXBwb3J0IGFzIGRlc2NyaWJlZCBpbjpcclxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTI0ODA4MVxyXG5mdW5jdGlvbiBnZXRDbGllbnRXaWR0aCAoKSB7XHJcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybiAwIC8vIFNTUlxyXG4gIHJldHVybiBNYXRoLm1heChcclxuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCEuY2xpZW50V2lkdGgsXHJcbiAgICB3aW5kb3cuaW5uZXJXaWR0aCB8fCAwXHJcbiAgKVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDbGllbnRIZWlnaHQgKCkge1xyXG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSByZXR1cm4gMCAvLyBTU1JcclxuICByZXR1cm4gTWF0aC5tYXgoXHJcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQhLmNsaWVudEhlaWdodCxcclxuICAgIHdpbmRvdy5pbm5lckhlaWdodCB8fCAwXHJcbiAgKVxyXG59XHJcbiJdfQ==