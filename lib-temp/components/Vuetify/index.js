import OurVue from 'vue';
import application from './mixins/application';
import breakpoint from './mixins/breakpoint';
import theme from './mixins/theme';
import icons from './mixins/icons';
import options from './mixins/options';
import genLang from './mixins/lang';
import goTo from './goTo';
// Utils
import { consoleWarn, consoleError } from '../../util/console';
const Vuetify = {
    install(Vue, opts = {}) {
        if (this.installed)
            return;
        this.installed = true;
        if (OurVue !== Vue) {
            consoleError('Multiple instances of Vue detected\nSee https://github.com/vuetifyjs/vuetify/issues/4068\n\nIf you\'re seeing "$attrs is readonly", it\'s caused by this');
        }
        checkVueVersion(Vue);
        const lang = genLang(opts.lang);
        Vue.prototype.$vuetify = new Vue({
            mixins: [
                breakpoint(opts.breakpoint)
            ],
            data: {
                application,
                dark: false,
                icons: icons(opts.iconfont, opts.icons),
                lang,
                options: options(opts.options),
                rtl: opts.rtl,
                theme: theme(opts.theme)
            },
            methods: {
                goTo,
                t: lang.t.bind(lang)
            }
        });
        if (opts.directives) {
            for (const name in opts.directives) {
                Vue.directive(name, opts.directives[name]);
            }
        }
        (function registerComponents(components) {
            if (components) {
                for (const key in components) {
                    const component = components[key];
                    if (component && !registerComponents(component.$_vuetify_subcomponents)) {
                        Vue.component(key, component);
                    }
                }
                return true;
            }
            return false;
        })(opts.components);
    },
    version: __VUETIFY_VERSION__
};
export function checkVueVersion(Vue, requiredVue) {
    const vueDep = requiredVue || __REQUIRED_VUE__;
    const required = vueDep.split('.', 3).map(v => v.replace(/\D/g, '')).map(Number);
    const actual = Vue.version.split('.', 3).map(n => parseInt(n, 10));
    // Simple semver caret range comparison
    const passes = actual[0] === required[0] && // major matches
        (actual[1] > required[1] || // minor is greater
            (actual[1] === required[1] && actual[2] >= required[2]) // or minor is eq and patch is >=
        );
    if (!passes) {
        consoleWarn(`Vuetify requires Vue version ${vueDep}`);
    }
}
export default Vuetify;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WdWV0aWZ5L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sTUFBTSxNQUFNLEtBQUssQ0FBQTtBQUV4QixPQUFPLFdBQVcsTUFBTSxzQkFBc0IsQ0FBQTtBQUM5QyxPQUFPLFVBQVUsTUFBTSxxQkFBcUIsQ0FBQTtBQUM1QyxPQUFPLEtBQUssTUFBTSxnQkFBZ0IsQ0FBQTtBQUNsQyxPQUFPLEtBQUssTUFBTSxnQkFBZ0IsQ0FBQTtBQUNsQyxPQUFPLE9BQU8sTUFBTSxrQkFBa0IsQ0FBQTtBQUN0QyxPQUFPLE9BQU8sTUFBTSxlQUFlLENBQUE7QUFDbkMsT0FBTyxJQUFJLE1BQU0sUUFBUSxDQUFBO0FBRXpCLFFBQVE7QUFDUixPQUFPLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBTTlELE1BQU0sT0FBTyxHQUFrQjtJQUM3QixPQUFPLENBQUUsR0FBRyxFQUFFLElBQUksR0FBRyxFQUFFO1FBQ3JCLElBQUssSUFBWSxDQUFDLFNBQVM7WUFBRSxPQUM1QjtRQUFDLElBQVksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFBO1FBRS9CLElBQUksTUFBTSxLQUFLLEdBQUcsRUFBRTtZQUNsQixZQUFZLENBQUMsMEpBQTBKLENBQUMsQ0FBQTtTQUN6SztRQUVELGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUVwQixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBRS9CLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxDQUFDO1lBQy9CLE1BQU0sRUFBRTtnQkFDTixVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQzthQUM1QjtZQUNELElBQUksRUFBRTtnQkFDSixXQUFXO2dCQUNYLElBQUksRUFBRSxLQUFLO2dCQUNYLEtBQUssRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUN2QyxJQUFJO2dCQUNKLE9BQU8sRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFDOUIsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO2dCQUNiLEtBQUssRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQzthQUN6QjtZQUNELE9BQU8sRUFBRTtnQkFDUCxJQUFJO2dCQUNKLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7YUFDckI7U0FDRixDQUFDLENBQUE7UUFFRixJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDbkIsS0FBSyxNQUFNLElBQUksSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNsQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7YUFDM0M7U0FDRjtRQUVELENBQUMsU0FBUyxrQkFBa0IsQ0FBRSxVQUEyQztZQUN2RSxJQUFJLFVBQVUsRUFBRTtnQkFDZCxLQUFLLE1BQU0sR0FBRyxJQUFJLFVBQVUsRUFBRTtvQkFDNUIsTUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFBO29CQUNqQyxJQUFJLFNBQVMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBQyxFQUFFO3dCQUN2RSxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxTQUF1QixDQUFDLENBQUE7cUJBQzVDO2lCQUNGO2dCQUNELE9BQU8sSUFBSSxDQUFBO2FBQ1o7WUFDRCxPQUFPLEtBQUssQ0FBQTtRQUNkLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQTtJQUNyQixDQUFDO0lBQ0QsT0FBTyxFQUFFLG1CQUFtQjtDQUM3QixDQUFBO0FBRUQsTUFBTSxVQUFVLGVBQWUsQ0FBRSxHQUFtQixFQUFFLFdBQW9CO0lBQ3hFLE1BQU0sTUFBTSxHQUFHLFdBQVcsSUFBSSxnQkFBZ0IsQ0FBQTtJQUU5QyxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUNoRixNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFBO0lBRWxFLHVDQUF1QztJQUN2QyxNQUFNLE1BQU0sR0FDVixNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLGdCQUFnQjtRQUM3QyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksbUJBQW1CO1lBQzdDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsaUNBQWlDO1NBQzFGLENBQUE7SUFFSCxJQUFJLENBQUMsTUFBTSxFQUFFO1FBQ1gsV0FBVyxDQUFDLGdDQUFnQyxNQUFNLEVBQUUsQ0FBQyxDQUFBO0tBQ3REO0FBQ0gsQ0FBQztBQUVELGVBQWUsT0FBTyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE91clZ1ZSBmcm9tICd2dWUnXHJcblxyXG5pbXBvcnQgYXBwbGljYXRpb24gZnJvbSAnLi9taXhpbnMvYXBwbGljYXRpb24nXHJcbmltcG9ydCBicmVha3BvaW50IGZyb20gJy4vbWl4aW5zL2JyZWFrcG9pbnQnXHJcbmltcG9ydCB0aGVtZSBmcm9tICcuL21peGlucy90aGVtZSdcclxuaW1wb3J0IGljb25zIGZyb20gJy4vbWl4aW5zL2ljb25zJ1xyXG5pbXBvcnQgb3B0aW9ucyBmcm9tICcuL21peGlucy9vcHRpb25zJ1xyXG5pbXBvcnQgZ2VuTGFuZyBmcm9tICcuL21peGlucy9sYW5nJ1xyXG5pbXBvcnQgZ29UbyBmcm9tICcuL2dvVG8nXHJcblxyXG4vLyBVdGlsc1xyXG5pbXBvcnQgeyBjb25zb2xlV2FybiwgY29uc29sZUVycm9yIH0gZnJvbSAnLi4vLi4vdXRpbC9jb25zb2xlJ1xyXG5cclxuLy8gVHlwZXNcclxuaW1wb3J0IHsgVnVlQ29uc3RydWN0b3IgfSBmcm9tICd2dWUvdHlwZXMnXHJcbmltcG9ydCB7IFZ1ZXRpZnkgYXMgVnVldGlmeVBsdWdpbiwgVnVldGlmeVVzZU9wdGlvbnMgfSBmcm9tICd2dWV0aWZ5L3R5cGVzJ1xyXG5cclxuY29uc3QgVnVldGlmeTogVnVldGlmeVBsdWdpbiA9IHtcclxuICBpbnN0YWxsIChWdWUsIG9wdHMgPSB7fSkge1xyXG4gICAgaWYgKCh0aGlzIGFzIGFueSkuaW5zdGFsbGVkKSByZXR1cm5cclxuICAgIDsodGhpcyBhcyBhbnkpLmluc3RhbGxlZCA9IHRydWVcclxuXHJcbiAgICBpZiAoT3VyVnVlICE9PSBWdWUpIHtcclxuICAgICAgY29uc29sZUVycm9yKCdNdWx0aXBsZSBpbnN0YW5jZXMgb2YgVnVlIGRldGVjdGVkXFxuU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS92dWV0aWZ5anMvdnVldGlmeS9pc3N1ZXMvNDA2OFxcblxcbklmIHlvdVxcJ3JlIHNlZWluZyBcIiRhdHRycyBpcyByZWFkb25seVwiLCBpdFxcJ3MgY2F1c2VkIGJ5IHRoaXMnKVxyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrVnVlVmVyc2lvbihWdWUpXHJcblxyXG4gICAgY29uc3QgbGFuZyA9IGdlbkxhbmcob3B0cy5sYW5nKVxyXG5cclxuICAgIFZ1ZS5wcm90b3R5cGUuJHZ1ZXRpZnkgPSBuZXcgVnVlKHtcclxuICAgICAgbWl4aW5zOiBbXHJcbiAgICAgICAgYnJlYWtwb2ludChvcHRzLmJyZWFrcG9pbnQpXHJcbiAgICAgIF0sXHJcbiAgICAgIGRhdGE6IHtcclxuICAgICAgICBhcHBsaWNhdGlvbixcclxuICAgICAgICBkYXJrOiBmYWxzZSxcclxuICAgICAgICBpY29uczogaWNvbnMob3B0cy5pY29uZm9udCwgb3B0cy5pY29ucyksXHJcbiAgICAgICAgbGFuZyxcclxuICAgICAgICBvcHRpb25zOiBvcHRpb25zKG9wdHMub3B0aW9ucyksXHJcbiAgICAgICAgcnRsOiBvcHRzLnJ0bCxcclxuICAgICAgICB0aGVtZTogdGhlbWUob3B0cy50aGVtZSlcclxuICAgICAgfSxcclxuICAgICAgbWV0aG9kczoge1xyXG4gICAgICAgIGdvVG8sXHJcbiAgICAgICAgdDogbGFuZy50LmJpbmQobGFuZylcclxuICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICBpZiAob3B0cy5kaXJlY3RpdmVzKSB7XHJcbiAgICAgIGZvciAoY29uc3QgbmFtZSBpbiBvcHRzLmRpcmVjdGl2ZXMpIHtcclxuICAgICAgICBWdWUuZGlyZWN0aXZlKG5hbWUsIG9wdHMuZGlyZWN0aXZlc1tuYW1lXSlcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIChmdW5jdGlvbiByZWdpc3RlckNvbXBvbmVudHMgKGNvbXBvbmVudHM6IFZ1ZXRpZnlVc2VPcHRpb25zWydjb21wb25lbnRzJ10pIHtcclxuICAgICAgaWYgKGNvbXBvbmVudHMpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBjb21wb25lbnRzKSB7XHJcbiAgICAgICAgICBjb25zdCBjb21wb25lbnQgPSBjb21wb25lbnRzW2tleV1cclxuICAgICAgICAgIGlmIChjb21wb25lbnQgJiYgIXJlZ2lzdGVyQ29tcG9uZW50cyhjb21wb25lbnQuJF92dWV0aWZ5X3N1YmNvbXBvbmVudHMpKSB7XHJcbiAgICAgICAgICAgIFZ1ZS5jb21wb25lbnQoa2V5LCBjb21wb25lbnQgYXMgdHlwZW9mIFZ1ZSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuICAgIH0pKG9wdHMuY29tcG9uZW50cylcclxuICB9LFxyXG4gIHZlcnNpb246IF9fVlVFVElGWV9WRVJTSU9OX19cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrVnVlVmVyc2lvbiAoVnVlOiBWdWVDb25zdHJ1Y3RvciwgcmVxdWlyZWRWdWU/OiBzdHJpbmcpIHtcclxuICBjb25zdCB2dWVEZXAgPSByZXF1aXJlZFZ1ZSB8fCBfX1JFUVVJUkVEX1ZVRV9fXHJcblxyXG4gIGNvbnN0IHJlcXVpcmVkID0gdnVlRGVwLnNwbGl0KCcuJywgMykubWFwKHYgPT4gdi5yZXBsYWNlKC9cXEQvZywgJycpKS5tYXAoTnVtYmVyKVxyXG4gIGNvbnN0IGFjdHVhbCA9IFZ1ZS52ZXJzaW9uLnNwbGl0KCcuJywgMykubWFwKG4gPT4gcGFyc2VJbnQobiwgMTApKVxyXG5cclxuICAvLyBTaW1wbGUgc2VtdmVyIGNhcmV0IHJhbmdlIGNvbXBhcmlzb25cclxuICBjb25zdCBwYXNzZXMgPVxyXG4gICAgYWN0dWFsWzBdID09PSByZXF1aXJlZFswXSAmJiAvLyBtYWpvciBtYXRjaGVzXHJcbiAgICAoYWN0dWFsWzFdID4gcmVxdWlyZWRbMV0gfHwgLy8gbWlub3IgaXMgZ3JlYXRlclxyXG4gICAgICAoYWN0dWFsWzFdID09PSByZXF1aXJlZFsxXSAmJiBhY3R1YWxbMl0gPj0gcmVxdWlyZWRbMl0pIC8vIG9yIG1pbm9yIGlzIGVxIGFuZCBwYXRjaCBpcyA+PVxyXG4gICAgKVxyXG5cclxuICBpZiAoIXBhc3Nlcykge1xyXG4gICAgY29uc29sZVdhcm4oYFZ1ZXRpZnkgcmVxdWlyZXMgVnVlIHZlcnNpb24gJHt2dWVEZXB9YClcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZ1ZXRpZnlcclxuIl19