import Vue from 'vue';
export function functionalThemeClasses(context) {
    const vm = {
        ...context.props,
        ...context.injections
    };
    const isDark = Themeable.options.computed.isDark.call(vm);
    return Themeable.options.computed.themeClasses.call({ isDark });
}
/* @vue/component */
const Themeable = Vue.extend().extend({
    name: 'themeable',
    provide() {
        return {
            theme: this.themeableProvide
        };
    },
    inject: {
        theme: {
            default: {
                isDark: false
            }
        }
    },
    props: {
        dark: {
            type: Boolean,
            default: null
        },
        light: {
            type: Boolean,
            default: null
        }
    },
    data() {
        return {
            themeableProvide: {
                isDark: false
            }
        };
    },
    computed: {
        isDark() {
            if (this.dark === true) {
                // explicitly dark
                return true;
            }
            else if (this.light === true) {
                // explicitly light
                return false;
            }
            else {
                // inherit from parent, or default false if there is none
                return this.theme.isDark;
            }
        },
        themeClasses() {
            return {
                'theme--dark': this.isDark,
                'theme--light': !this.isDark
            };
        },
        /** Used by menus and dialogs, inherits from v-app instead of the parent */
        rootIsDark() {
            if (this.dark === true) {
                // explicitly dark
                return true;
            }
            else if (this.light === true) {
                // explicitly light
                return false;
            }
            else {
                // inherit from v-app
                return this.$vuetify.dark;
            }
        },
        rootThemeClasses() {
            return {
                'theme--dark': this.rootIsDark,
                'theme--light': !this.rootIsDark
            };
        }
    },
    watch: {
        isDark: {
            handler(newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.themeableProvide.isDark = this.isDark;
                }
            },
            immediate: true
        }
    }
});
export default Themeable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWVhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21peGlucy90aGVtZWFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxHQUFHLE1BQU0sS0FBSyxDQUFBO0FBVXJCLE1BQU0sVUFBVSxzQkFBc0IsQ0FBRSxPQUFzQjtJQUM1RCxNQUFNLEVBQUUsR0FBRztRQUNULEdBQUcsT0FBTyxDQUFDLEtBQUs7UUFDaEIsR0FBRyxPQUFPLENBQUMsVUFBVTtLQUN0QixDQUFBO0lBQ0QsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUN6RCxPQUFPLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO0FBQ2pFLENBQUM7QUFFRCxvQkFBb0I7QUFDcEIsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBYSxDQUFDLE1BQU0sQ0FBQztJQUMvQyxJQUFJLEVBQUUsV0FBVztJQUVqQixPQUFPO1FBQ0wsT0FBTztZQUNMLEtBQUssRUFBRSxJQUFJLENBQUMsZ0JBQWdCO1NBQzdCLENBQUE7SUFDSCxDQUFDO0lBRUQsTUFBTSxFQUFFO1FBQ04sS0FBSyxFQUFFO1lBQ0wsT0FBTyxFQUFFO2dCQUNQLE1BQU0sRUFBRSxLQUFLO2FBQ2Q7U0FDRjtLQUNGO0lBRUQsS0FBSyxFQUFFO1FBQ0wsSUFBSSxFQUFFO1lBQ0osSUFBSSxFQUFFLE9BQU87WUFDYixPQUFPLEVBQUUsSUFBSTtTQUNtQjtRQUNsQyxLQUFLLEVBQUU7WUFDTCxJQUFJLEVBQUUsT0FBTztZQUNiLE9BQU8sRUFBRSxJQUFJO1NBQ21CO0tBQ25DO0lBRUQsSUFBSTtRQUNGLE9BQU87WUFDTCxnQkFBZ0IsRUFBRTtnQkFDaEIsTUFBTSxFQUFFLEtBQUs7YUFDZDtTQUNGLENBQUE7SUFDSCxDQUFDO0lBRUQsUUFBUSxFQUFFO1FBQ1IsTUFBTTtZQUNKLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUU7Z0JBQ3RCLGtCQUFrQjtnQkFDbEIsT0FBTyxJQUFJLENBQUE7YUFDWjtpQkFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssSUFBSSxFQUFFO2dCQUM5QixtQkFBbUI7Z0JBQ25CLE9BQU8sS0FBSyxDQUFBO2FBQ2I7aUJBQU07Z0JBQ0wseURBQXlEO2dCQUN6RCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFBO2FBQ3pCO1FBQ0gsQ0FBQztRQUNELFlBQVk7WUFDVixPQUFPO2dCQUNMLGFBQWEsRUFBRSxJQUFJLENBQUMsTUFBTTtnQkFDMUIsY0FBYyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU07YUFDN0IsQ0FBQTtRQUNILENBQUM7UUFDRCwyRUFBMkU7UUFDM0UsVUFBVTtZQUNSLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUU7Z0JBQ3RCLGtCQUFrQjtnQkFDbEIsT0FBTyxJQUFJLENBQUE7YUFDWjtpQkFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssSUFBSSxFQUFFO2dCQUM5QixtQkFBbUI7Z0JBQ25CLE9BQU8sS0FBSyxDQUFBO2FBQ2I7aUJBQU07Z0JBQ0wscUJBQXFCO2dCQUNyQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFBO2FBQzFCO1FBQ0gsQ0FBQztRQUNELGdCQUFnQjtZQUNkLE9BQU87Z0JBQ0wsYUFBYSxFQUFFLElBQUksQ0FBQyxVQUFVO2dCQUM5QixjQUFjLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVTthQUNqQyxDQUFBO1FBQ0gsQ0FBQztLQUNGO0lBRUQsS0FBSyxFQUFFO1FBQ0wsTUFBTSxFQUFFO1lBQ04sT0FBTyxDQUFFLE1BQU0sRUFBRSxNQUFNO2dCQUNyQixJQUFJLE1BQU0sS0FBSyxNQUFNLEVBQUU7b0JBQ3JCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQTtpQkFDM0M7WUFDSCxDQUFDO1lBQ0QsU0FBUyxFQUFFLElBQUk7U0FDaEI7S0FDRjtDQUNGLENBQUMsQ0FBQTtBQUVGLGVBQWUsU0FBUyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZ1ZSBmcm9tICd2dWUnXHJcbmltcG9ydCB7IFByb3BWYWxpZGF0b3IsIFJlbmRlckNvbnRleHQgfSBmcm9tICd2dWUvdHlwZXMvb3B0aW9ucydcclxuXHJcbi8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11c2UtYmVmb3JlLWRlZmluZSAqL1xyXG5pbnRlcmZhY2UgVGhlbWVhYmxlIGV4dGVuZHMgVnVlIHtcclxuICB0aGVtZToge1xyXG4gICAgaXNEYXJrOiBib29sZWFuXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZnVuY3Rpb25hbFRoZW1lQ2xhc3NlcyAoY29udGV4dDogUmVuZGVyQ29udGV4dCk6IG9iamVjdCB7XHJcbiAgY29uc3Qgdm0gPSB7XHJcbiAgICAuLi5jb250ZXh0LnByb3BzLFxyXG4gICAgLi4uY29udGV4dC5pbmplY3Rpb25zXHJcbiAgfVxyXG4gIGNvbnN0IGlzRGFyayA9IFRoZW1lYWJsZS5vcHRpb25zLmNvbXB1dGVkLmlzRGFyay5jYWxsKHZtKVxyXG4gIHJldHVybiBUaGVtZWFibGUub3B0aW9ucy5jb21wdXRlZC50aGVtZUNsYXNzZXMuY2FsbCh7IGlzRGFyayB9KVxyXG59XHJcblxyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG5jb25zdCBUaGVtZWFibGUgPSBWdWUuZXh0ZW5kPFRoZW1lYWJsZT4oKS5leHRlbmQoe1xyXG4gIG5hbWU6ICd0aGVtZWFibGUnLFxyXG5cclxuICBwcm92aWRlICgpOiBvYmplY3Qge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdGhlbWU6IHRoaXMudGhlbWVhYmxlUHJvdmlkZVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGluamVjdDoge1xyXG4gICAgdGhlbWU6IHtcclxuICAgICAgZGVmYXVsdDoge1xyXG4gICAgICAgIGlzRGFyazogZmFsc2VcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHByb3BzOiB7XHJcbiAgICBkYXJrOiB7XHJcbiAgICAgIHR5cGU6IEJvb2xlYW4sXHJcbiAgICAgIGRlZmF1bHQ6IG51bGxcclxuICAgIH0gYXMgUHJvcFZhbGlkYXRvcjxib29sZWFuIHwgbnVsbD4sXHJcbiAgICBsaWdodDoge1xyXG4gICAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgICBkZWZhdWx0OiBudWxsXHJcbiAgICB9IGFzIFByb3BWYWxpZGF0b3I8Ym9vbGVhbiB8IG51bGw+XHJcbiAgfSxcclxuXHJcbiAgZGF0YSAoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0aGVtZWFibGVQcm92aWRlOiB7XHJcbiAgICAgICAgaXNEYXJrOiBmYWxzZVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIGlzRGFyayAoKTogYm9vbGVhbiB7XHJcbiAgICAgIGlmICh0aGlzLmRhcmsgPT09IHRydWUpIHtcclxuICAgICAgICAvLyBleHBsaWNpdGx5IGRhcmtcclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMubGlnaHQgPT09IHRydWUpIHtcclxuICAgICAgICAvLyBleHBsaWNpdGx5IGxpZ2h0XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gaW5oZXJpdCBmcm9tIHBhcmVudCwgb3IgZGVmYXVsdCBmYWxzZSBpZiB0aGVyZSBpcyBub25lXHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGhlbWUuaXNEYXJrXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB0aGVtZUNsYXNzZXMgKCk6IG9iamVjdCB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgJ3RoZW1lLS1kYXJrJzogdGhpcy5pc0RhcmssXHJcbiAgICAgICAgJ3RoZW1lLS1saWdodCc6ICF0aGlzLmlzRGFya1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgLyoqIFVzZWQgYnkgbWVudXMgYW5kIGRpYWxvZ3MsIGluaGVyaXRzIGZyb20gdi1hcHAgaW5zdGVhZCBvZiB0aGUgcGFyZW50ICovXHJcbiAgICByb290SXNEYXJrICgpOiBib29sZWFuIHtcclxuICAgICAgaWYgKHRoaXMuZGFyayA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIC8vIGV4cGxpY2l0bHkgZGFya1xyXG4gICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5saWdodCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIC8vIGV4cGxpY2l0bHkgbGlnaHRcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBpbmhlcml0IGZyb20gdi1hcHBcclxuICAgICAgICByZXR1cm4gdGhpcy4kdnVldGlmeS5kYXJrXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICByb290VGhlbWVDbGFzc2VzICgpOiBEaWN0aW9uYXJ5PGJvb2xlYW4+IHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAndGhlbWUtLWRhcmsnOiB0aGlzLnJvb3RJc0RhcmssXHJcbiAgICAgICAgJ3RoZW1lLS1saWdodCc6ICF0aGlzLnJvb3RJc0RhcmtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHdhdGNoOiB7XHJcbiAgICBpc0Rhcms6IHtcclxuICAgICAgaGFuZGxlciAobmV3VmFsLCBvbGRWYWwpIHtcclxuICAgICAgICBpZiAobmV3VmFsICE9PSBvbGRWYWwpIHtcclxuICAgICAgICAgIHRoaXMudGhlbWVhYmxlUHJvdmlkZS5pc0RhcmsgPSB0aGlzLmlzRGFya1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgaW1tZWRpYXRlOiB0cnVlXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVGhlbWVhYmxlXHJcbiJdfQ==