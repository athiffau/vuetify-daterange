// Mixins
import { inject as RegistrableInject } from './registrable';
export function factory(namespace, child, parent) {
    return RegistrableInject(namespace, child, parent).extend({
        name: 'groupable',
        props: {
            activeClass: {
                type: String,
                default() {
                    if (!this[namespace])
                        return undefined;
                    return this[namespace].activeClass;
                }
            },
            disabled: Boolean
        },
        data() {
            return {
                isActive: false
            };
        },
        computed: {
            groupClasses() {
                if (!this.activeClass)
                    return {};
                return {
                    [this.activeClass]: this.isActive
                };
            }
        },
        created() {
            this[namespace] && this[namespace].register(this);
        },
        beforeDestroy() {
            this[namespace] && this[namespace].unregister(this);
        },
        methods: {
            toggle() {
                this.$emit('change');
            }
        }
    });
}
/* eslint-disable-next-line no-redeclare */
const Groupable = factory('itemGroup');
export default Groupable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvdXBhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21peGlucy9ncm91cGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsU0FBUztBQUNULE9BQU8sRUFBZSxNQUFNLElBQUksaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUE7QUFleEUsTUFBTSxVQUFVLE9BQU8sQ0FDckIsU0FBWSxFQUNaLEtBQWMsRUFDZCxNQUFlO0lBRWYsT0FBTyxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUN4RCxJQUFJLEVBQUUsV0FBVztRQUVqQixLQUFLLEVBQUU7WUFDTCxXQUFXLEVBQUU7Z0JBQ1gsSUFBSSxFQUFFLE1BQU07Z0JBQ1osT0FBTztvQkFDTCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQzt3QkFBRSxPQUFPLFNBQVMsQ0FBQTtvQkFFdEMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxDQUFBO2dCQUNwQyxDQUFDO2FBQzhCO1lBQ2pDLFFBQVEsRUFBRSxPQUFPO1NBQ2xCO1FBRUQsSUFBSTtZQUNGLE9BQU87Z0JBQ0wsUUFBUSxFQUFFLEtBQUs7YUFDaEIsQ0FBQTtRQUNILENBQUM7UUFFRCxRQUFRLEVBQUU7WUFDUixZQUFZO2dCQUNWLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVztvQkFBRSxPQUFPLEVBQUUsQ0FBQTtnQkFFaEMsT0FBTztvQkFDTCxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUTtpQkFDbEMsQ0FBQTtZQUNILENBQUM7U0FDRjtRQUVELE9BQU87WUFDTCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUssSUFBSSxDQUFDLFNBQVMsQ0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUM1RCxDQUFDO1FBRUQsYUFBYTtZQUNYLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSyxJQUFJLENBQUMsU0FBUyxDQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQzlELENBQUM7UUFFRCxPQUFPLEVBQUU7WUFDUCxNQUFNO2dCQUNKLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDdEIsQ0FBQztTQUNGO0tBQ0YsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQUVELDJDQUEyQztBQUMzQyxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUE7QUFFdEMsZUFBZSxTQUFTLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBNaXhpbnNcclxuaW1wb3J0IHsgUmVnaXN0cmFibGUsIGluamVjdCBhcyBSZWdpc3RyYWJsZUluamVjdCB9IGZyb20gJy4vcmVnaXN0cmFibGUnXHJcblxyXG4vLyBVdGlsaXRpZXNcclxuaW1wb3J0IHsgRXh0cmFjdFZ1ZSB9IGZyb20gJy4uL3V0aWwvbWl4aW5zJ1xyXG5pbXBvcnQgeyBQcm9wVmFsaWRhdG9yIH0gZnJvbSAndnVlL3R5cGVzL29wdGlvbnMnXHJcbmltcG9ydCB7IFZ1ZUNvbnN0cnVjdG9yIH0gZnJvbSAndnVlJ1xyXG5cclxuLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVzZS1iZWZvcmUtZGVmaW5lICovXHJcbmV4cG9ydCB0eXBlIEdyb3VwYWJsZTxUIGV4dGVuZHMgc3RyaW5nPiA9IFZ1ZUNvbnN0cnVjdG9yPEV4dHJhY3RWdWU8UmVnaXN0cmFibGU8VD4+ICYge1xyXG4gIGFjdGl2ZUNsYXNzOiBzdHJpbmdcclxuICBpc0FjdGl2ZTogYm9vbGVhblxyXG4gIGdyb3VwQ2xhc3Nlczogb2JqZWN0XHJcbiAgdG9nZ2xlICgpOiB2b2lkXHJcbn0+XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmFjdG9yeTxUIGV4dGVuZHMgc3RyaW5nPiAoXHJcbiAgbmFtZXNwYWNlOiBULFxyXG4gIGNoaWxkPzogc3RyaW5nLFxyXG4gIHBhcmVudD86IHN0cmluZ1xyXG4pOiBHcm91cGFibGU8VD4ge1xyXG4gIHJldHVybiBSZWdpc3RyYWJsZUluamVjdChuYW1lc3BhY2UsIGNoaWxkLCBwYXJlbnQpLmV4dGVuZCh7XHJcbiAgICBuYW1lOiAnZ3JvdXBhYmxlJyxcclxuXHJcbiAgICBwcm9wczoge1xyXG4gICAgICBhY3RpdmVDbGFzczoge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICBkZWZhdWx0ICgpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xyXG4gICAgICAgICAgaWYgKCF0aGlzW25hbWVzcGFjZV0pIHJldHVybiB1bmRlZmluZWRcclxuXHJcbiAgICAgICAgICByZXR1cm4gdGhpc1tuYW1lc3BhY2VdLmFjdGl2ZUNsYXNzXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGFzIGFueSBhcyBQcm9wVmFsaWRhdG9yPHN0cmluZz4sXHJcbiAgICAgIGRpc2FibGVkOiBCb29sZWFuXHJcbiAgICB9LFxyXG5cclxuICAgIGRhdGEgKCkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGlzQWN0aXZlOiBmYWxzZVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGNvbXB1dGVkOiB7XHJcbiAgICAgIGdyb3VwQ2xhc3NlcyAoKTogb2JqZWN0IHtcclxuICAgICAgICBpZiAoIXRoaXMuYWN0aXZlQ2xhc3MpIHJldHVybiB7fVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgW3RoaXMuYWN0aXZlQ2xhc3NdOiB0aGlzLmlzQWN0aXZlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGNyZWF0ZWQgKCkge1xyXG4gICAgICB0aGlzW25hbWVzcGFjZV0gJiYgKHRoaXNbbmFtZXNwYWNlXSBhcyBhbnkpLnJlZ2lzdGVyKHRoaXMpXHJcbiAgICB9LFxyXG5cclxuICAgIGJlZm9yZURlc3Ryb3kgKCkge1xyXG4gICAgICB0aGlzW25hbWVzcGFjZV0gJiYgKHRoaXNbbmFtZXNwYWNlXSBhcyBhbnkpLnVucmVnaXN0ZXIodGhpcylcclxuICAgIH0sXHJcblxyXG4gICAgbWV0aG9kczoge1xyXG4gICAgICB0b2dnbGUgKCkge1xyXG4gICAgICAgIHRoaXMuJGVtaXQoJ2NoYW5nZScpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KVxyXG59XHJcblxyXG4vKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmVkZWNsYXJlICovXHJcbmNvbnN0IEdyb3VwYWJsZSA9IGZhY3RvcnkoJ2l0ZW1Hcm91cCcpXHJcblxyXG5leHBvcnQgZGVmYXVsdCBHcm91cGFibGVcclxuIl19