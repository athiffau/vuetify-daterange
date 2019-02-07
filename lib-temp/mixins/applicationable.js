import { factory as PositionableFactory } from './positionable';
// Util
import mixins from '../util/mixins';
export default function applicationable(value, events = []) {
    /* @vue/component */
    return mixins(PositionableFactory(['absolute', 'fixed'])).extend({
        name: 'applicationable',
        props: {
            app: Boolean
        },
        computed: {
            applicationProperty() {
                return value;
            }
        },
        watch: {
            // If previous value was app
            // reset the provided prop
            app(x, prev) {
                prev
                    ? this.removeApplication(true)
                    : this.callUpdate();
            },
            applicationProperty(newVal, oldVal) {
                this.$vuetify.application.unbind(this._uid, oldVal);
            }
        },
        activated() {
            this.callUpdate();
        },
        created() {
            for (let i = 0, length = events.length; i < length; i++) {
                this.$watch(events[i], this.callUpdate);
            }
            this.callUpdate();
        },
        mounted() {
            this.callUpdate();
        },
        deactivated() {
            this.removeApplication();
        },
        destroyed() {
            this.removeApplication();
        },
        methods: {
            callUpdate() {
                if (!this.app)
                    return;
                this.$vuetify.application.bind(this._uid, this.applicationProperty, this.updateApplication());
            },
            removeApplication(force = false) {
                if (!force && !this.app)
                    return;
                this.$vuetify.application.unbind(this._uid, this.applicationProperty);
            },
            updateApplication: () => 0
        }
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb25hYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21peGlucy9hcHBsaWNhdGlvbmFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE9BQU8sSUFBSSxtQkFBbUIsRUFBRSxNQUFNLGdCQUFnQixDQUFBO0FBRy9ELE9BQU87QUFDUCxPQUFPLE1BQU0sTUFBTSxnQkFBZ0IsQ0FBQTtBQUVuQyxNQUFNLENBQUMsT0FBTyxVQUFVLGVBQWUsQ0FBRSxLQUFpQixFQUFFLFNBQW1CLEVBQUU7SUFDL0Usb0JBQW9CO0lBQ3BCLE9BQU8sTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDL0QsSUFBSSxFQUFFLGlCQUFpQjtRQUV2QixLQUFLLEVBQUU7WUFDTCxHQUFHLEVBQUUsT0FBTztTQUNiO1FBRUQsUUFBUSxFQUFFO1lBQ1IsbUJBQW1CO2dCQUNqQixPQUFPLEtBQUssQ0FBQTtZQUNkLENBQUM7U0FDRjtRQUVELEtBQUssRUFBRTtZQUNMLDRCQUE0QjtZQUM1QiwwQkFBMEI7WUFDMUIsR0FBRyxDQUFFLENBQVUsRUFBRSxJQUFhO2dCQUM1QixJQUFJO29CQUNGLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDO29CQUM5QixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFBO1lBQ3ZCLENBQUM7WUFDRCxtQkFBbUIsQ0FBRSxNQUFNLEVBQUUsTUFBTTtnQkFDakMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUE7WUFDckQsQ0FBQztTQUNGO1FBRUQsU0FBUztZQUNQLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTtRQUNuQixDQUFDO1FBRUQsT0FBTztZQUNMLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3ZELElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQTthQUN4QztZQUNELElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTtRQUNuQixDQUFDO1FBRUQsT0FBTztZQUNMLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTtRQUNuQixDQUFDO1FBRUQsV0FBVztZQUNULElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQzFCLENBQUM7UUFFRCxTQUFTO1lBQ1AsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDMUIsQ0FBQztRQUVELE9BQU8sRUFBRTtZQUNQLFVBQVU7Z0JBQ1IsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHO29CQUFFLE9BQU07Z0JBRXJCLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FDNUIsSUFBSSxDQUFDLElBQUksRUFDVCxJQUFJLENBQUMsbUJBQW1CLEVBQ3hCLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUN6QixDQUFBO1lBQ0gsQ0FBQztZQUNELGlCQUFpQixDQUFFLEtBQUssR0FBRyxLQUFLO2dCQUM5QixJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUc7b0JBQUUsT0FBTTtnQkFFL0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUM5QixJQUFJLENBQUMsSUFBSSxFQUNULElBQUksQ0FBQyxtQkFBbUIsQ0FDekIsQ0FBQTtZQUNILENBQUM7WUFDRCxpQkFBaUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1NBQzNCO0tBQ0YsQ0FBQyxDQUFBO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGZhY3RvcnkgYXMgUG9zaXRpb25hYmxlRmFjdG9yeSB9IGZyb20gJy4vcG9zaXRpb25hYmxlJ1xyXG5pbXBvcnQgeyBUYXJnZXRQcm9wIH0gZnJvbSAnLi4vY29tcG9uZW50cy9WdWV0aWZ5L21peGlucy9hcHBsaWNhdGlvbidcclxuXHJcbi8vIFV0aWxcclxuaW1wb3J0IG1peGlucyBmcm9tICcuLi91dGlsL21peGlucydcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFwcGxpY2F0aW9uYWJsZSAodmFsdWU6IFRhcmdldFByb3AsIGV2ZW50czogc3RyaW5nW10gPSBbXSkge1xyXG4gIC8qIEB2dWUvY29tcG9uZW50ICovXHJcbiAgcmV0dXJuIG1peGlucyhQb3NpdGlvbmFibGVGYWN0b3J5KFsnYWJzb2x1dGUnLCAnZml4ZWQnXSkpLmV4dGVuZCh7XHJcbiAgICBuYW1lOiAnYXBwbGljYXRpb25hYmxlJyxcclxuXHJcbiAgICBwcm9wczoge1xyXG4gICAgICBhcHA6IEJvb2xlYW5cclxuICAgIH0sXHJcblxyXG4gICAgY29tcHV0ZWQ6IHtcclxuICAgICAgYXBwbGljYXRpb25Qcm9wZXJ0eSAoKTogVGFyZ2V0UHJvcCB7XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgd2F0Y2g6IHtcclxuICAgICAgLy8gSWYgcHJldmlvdXMgdmFsdWUgd2FzIGFwcFxyXG4gICAgICAvLyByZXNldCB0aGUgcHJvdmlkZWQgcHJvcFxyXG4gICAgICBhcHAgKHg6IGJvb2xlYW4sIHByZXY6IGJvb2xlYW4pIHtcclxuICAgICAgICBwcmV2XHJcbiAgICAgICAgICA/IHRoaXMucmVtb3ZlQXBwbGljYXRpb24odHJ1ZSlcclxuICAgICAgICAgIDogdGhpcy5jYWxsVXBkYXRlKClcclxuICAgICAgfSxcclxuICAgICAgYXBwbGljYXRpb25Qcm9wZXJ0eSAobmV3VmFsLCBvbGRWYWwpIHtcclxuICAgICAgICB0aGlzLiR2dWV0aWZ5LmFwcGxpY2F0aW9uLnVuYmluZCh0aGlzLl91aWQsIG9sZFZhbClcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBhY3RpdmF0ZWQgKCkge1xyXG4gICAgICB0aGlzLmNhbGxVcGRhdGUoKVxyXG4gICAgfSxcclxuXHJcbiAgICBjcmVhdGVkICgpIHtcclxuICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbmd0aCA9IGV2ZW50cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHRoaXMuJHdhdGNoKGV2ZW50c1tpXSwgdGhpcy5jYWxsVXBkYXRlKVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuY2FsbFVwZGF0ZSgpXHJcbiAgICB9LFxyXG5cclxuICAgIG1vdW50ZWQgKCkge1xyXG4gICAgICB0aGlzLmNhbGxVcGRhdGUoKVxyXG4gICAgfSxcclxuXHJcbiAgICBkZWFjdGl2YXRlZCAoKSB7XHJcbiAgICAgIHRoaXMucmVtb3ZlQXBwbGljYXRpb24oKVxyXG4gICAgfSxcclxuXHJcbiAgICBkZXN0cm95ZWQgKCkge1xyXG4gICAgICB0aGlzLnJlbW92ZUFwcGxpY2F0aW9uKClcclxuICAgIH0sXHJcblxyXG4gICAgbWV0aG9kczoge1xyXG4gICAgICBjYWxsVXBkYXRlICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuYXBwKSByZXR1cm5cclxuXHJcbiAgICAgICAgdGhpcy4kdnVldGlmeS5hcHBsaWNhdGlvbi5iaW5kKFxyXG4gICAgICAgICAgdGhpcy5fdWlkLFxyXG4gICAgICAgICAgdGhpcy5hcHBsaWNhdGlvblByb3BlcnR5LFxyXG4gICAgICAgICAgdGhpcy51cGRhdGVBcHBsaWNhdGlvbigpXHJcbiAgICAgICAgKVxyXG4gICAgICB9LFxyXG4gICAgICByZW1vdmVBcHBsaWNhdGlvbiAoZm9yY2UgPSBmYWxzZSkge1xyXG4gICAgICAgIGlmICghZm9yY2UgJiYgIXRoaXMuYXBwKSByZXR1cm5cclxuXHJcbiAgICAgICAgdGhpcy4kdnVldGlmeS5hcHBsaWNhdGlvbi51bmJpbmQoXHJcbiAgICAgICAgICB0aGlzLl91aWQsXHJcbiAgICAgICAgICB0aGlzLmFwcGxpY2F0aW9uUHJvcGVydHlcclxuICAgICAgICApXHJcbiAgICAgIH0sXHJcbiAgICAgIHVwZGF0ZUFwcGxpY2F0aW9uOiAoKSA9PiAwXHJcbiAgICB9XHJcbiAgfSlcclxufVxyXG4iXX0=