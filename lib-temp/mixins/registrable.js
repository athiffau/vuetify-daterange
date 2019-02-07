import Vue from 'vue';
import { consoleWarn } from '../util/console';
function generateWarning(child, parent) {
    return () => consoleWarn(`The ${child} component must be used inside a ${parent}`);
}
export function inject(namespace, child, parent) {
    const defaultImpl = child && parent ? {
        register: generateWarning(child, parent),
        unregister: generateWarning(child, parent)
    } : null;
    return Vue.extend({
        name: 'registrable-inject',
        inject: {
            [namespace]: {
                default: defaultImpl
            }
        }
    });
}
export function provide(namespace) {
    return Vue.extend({
        name: 'registrable-provide',
        methods: {
            register: null,
            unregister: null
        },
        provide() {
            return {
                [namespace]: {
                    register: this.register,
                    unregister: this.unregister
                }
            };
        }
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0cmFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWl4aW5zL3JlZ2lzdHJhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sR0FBRyxNQUFNLEtBQUssQ0FBQTtBQUVyQixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0saUJBQWlCLENBQUE7QUFFN0MsU0FBUyxlQUFlLENBQUUsS0FBYSxFQUFFLE1BQWM7SUFDckQsT0FBTyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsT0FBTyxLQUFLLG9DQUFvQyxNQUFNLEVBQUUsQ0FBQyxDQUFBO0FBQ3BGLENBQUM7QUFTRCxNQUFNLFVBQVUsTUFBTSxDQUFvQixTQUFZLEVBQUUsS0FBYyxFQUFFLE1BQWU7SUFDckYsTUFBTSxXQUFXLEdBQUcsS0FBSyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDcEMsUUFBUSxFQUFFLGVBQWUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDO1FBQ3hDLFVBQVUsRUFBRSxlQUFlLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQztLQUMzQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUE7SUFFUixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFDaEIsSUFBSSxFQUFFLG9CQUFvQjtRQUUxQixNQUFNLEVBQUU7WUFDTixDQUFDLFNBQVMsQ0FBQyxFQUFFO2dCQUNYLE9BQU8sRUFBRSxXQUFXO2FBQ3JCO1NBQ0Y7S0FDRixDQUFDLENBQUE7QUFDSixDQUFDO0FBRUQsTUFBTSxVQUFVLE9BQU8sQ0FBRSxTQUFpQjtJQUN4QyxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFDaEIsSUFBSSxFQUFFLHFCQUFxQjtRQUUzQixPQUFPLEVBQUU7WUFDUCxRQUFRLEVBQUUsSUFBSTtZQUNkLFVBQVUsRUFBRSxJQUFJO1NBQ2pCO1FBQ0QsT0FBTztZQUNMLE9BQU87Z0JBQ0wsQ0FBQyxTQUFTLENBQUMsRUFBRTtvQkFDWCxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7b0JBQ3ZCLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtpQkFDNUI7YUFDRixDQUFBO1FBQ0gsQ0FBQztLQUNGLENBQUMsQ0FBQTtBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVnVlIGZyb20gJ3Z1ZSdcclxuaW1wb3J0IHsgVnVlQ29uc3RydWN0b3IgfSBmcm9tICd2dWUvdHlwZXMvdnVlJ1xyXG5pbXBvcnQgeyBjb25zb2xlV2FybiB9IGZyb20gJy4uL3V0aWwvY29uc29sZSdcclxuXHJcbmZ1bmN0aW9uIGdlbmVyYXRlV2FybmluZyAoY2hpbGQ6IHN0cmluZywgcGFyZW50OiBzdHJpbmcpIHtcclxuICByZXR1cm4gKCkgPT4gY29uc29sZVdhcm4oYFRoZSAke2NoaWxkfSBjb21wb25lbnQgbXVzdCBiZSB1c2VkIGluc2lkZSBhICR7cGFyZW50fWApXHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIFJlZ2lzdHJhYmxlPFQgZXh0ZW5kcyBzdHJpbmc+ID0gVnVlQ29uc3RydWN0b3I8VnVlICYge1xyXG4gIFtLIGluIFRdOiB7XHJcbiAgICByZWdpc3RlciAoLi4ucHJvcHM6IGFueVtdKTogdm9pZFxyXG4gICAgdW5yZWdpc3RlciAoc2VsZjogYW55KTogdm9pZFxyXG4gIH1cclxufT5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbmplY3Q8VCBleHRlbmRzIHN0cmluZz4gKG5hbWVzcGFjZTogVCwgY2hpbGQ/OiBzdHJpbmcsIHBhcmVudD86IHN0cmluZyk6IFJlZ2lzdHJhYmxlPFQ+IHtcclxuICBjb25zdCBkZWZhdWx0SW1wbCA9IGNoaWxkICYmIHBhcmVudCA/IHtcclxuICAgIHJlZ2lzdGVyOiBnZW5lcmF0ZVdhcm5pbmcoY2hpbGQsIHBhcmVudCksXHJcbiAgICB1bnJlZ2lzdGVyOiBnZW5lcmF0ZVdhcm5pbmcoY2hpbGQsIHBhcmVudClcclxuICB9IDogbnVsbFxyXG5cclxuICByZXR1cm4gVnVlLmV4dGVuZCh7XHJcbiAgICBuYW1lOiAncmVnaXN0cmFibGUtaW5qZWN0JyxcclxuXHJcbiAgICBpbmplY3Q6IHtcclxuICAgICAgW25hbWVzcGFjZV06IHtcclxuICAgICAgICBkZWZhdWx0OiBkZWZhdWx0SW1wbFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHByb3ZpZGUgKG5hbWVzcGFjZTogc3RyaW5nKSB7XHJcbiAgcmV0dXJuIFZ1ZS5leHRlbmQoe1xyXG4gICAgbmFtZTogJ3JlZ2lzdHJhYmxlLXByb3ZpZGUnLFxyXG5cclxuICAgIG1ldGhvZHM6IHtcclxuICAgICAgcmVnaXN0ZXI6IG51bGwsXHJcbiAgICAgIHVucmVnaXN0ZXI6IG51bGxcclxuICAgIH0sXHJcbiAgICBwcm92aWRlICgpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBbbmFtZXNwYWNlXToge1xyXG4gICAgICAgICAgcmVnaXN0ZXI6IHRoaXMucmVnaXN0ZXIsXHJcbiAgICAgICAgICB1bnJlZ2lzdGVyOiB0aGlzLnVucmVnaXN0ZXJcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KVxyXG59XHJcbiJdfQ==