import * as Theme from '../../../util/theme';
export default {
    data: () => ({
        style: null
    }),
    computed: {
        parsedTheme() {
            return Theme.parse(this.$vuetify.theme);
        },
        /** @return string */
        generatedStyles() {
            const theme = this.parsedTheme;
            let css;
            if (this.$vuetify.options.themeCache != null) {
                css = this.$vuetify.options.themeCache.get(theme);
                if (css != null)
                    return css;
            }
            css = Theme.genStyles(theme, this.$vuetify.options.customProperties);
            if (this.$vuetify.options.minifyTheme != null) {
                css = this.$vuetify.options.minifyTheme(css);
            }
            if (this.$vuetify.options.themeCache != null) {
                this.$vuetify.options.themeCache.set(theme, css);
            }
            return css;
        },
        vueMeta() {
            if (this.$vuetify.theme === false)
                return {};
            const options = {
                cssText: this.generatedStyles,
                id: 'vuetify-theme-stylesheet',
                type: 'text/css'
            };
            if (this.$vuetify.options.cspNonce) {
                options.nonce = this.$vuetify.options.cspNonce;
            }
            return {
                style: [options]
            };
        }
    },
    // Regular vue-meta
    metaInfo() {
        return this.vueMeta;
    },
    // Nuxt
    head() {
        return this.vueMeta;
    },
    watch: {
        generatedStyles() {
            !this.meta && this.applyTheme();
        }
    },
    created() {
        if (this.$vuetify.theme === false)
            return;
        if (this.$meta) {
            // Vue-meta
            // Handled by metaInfo()/nuxt()
        }
        else if (typeof document === 'undefined' && this.$ssrContext) {
            // SSR
            const nonce = this.$vuetify.options.cspNonce
                ? ` nonce="${this.$vuetify.options.cspNonce}"`
                : '';
            this.$ssrContext.head = this.$ssrContext.head || '';
            this.$ssrContext.head += `<style type="text/css" id="vuetify-theme-stylesheet"${nonce}>${this.generatedStyles}</style>`;
        }
        else if (typeof document !== 'undefined') {
            // Client-side
            this.genStyle();
            this.applyTheme();
        }
    },
    methods: {
        applyTheme() {
            if (this.style)
                this.style.innerHTML = this.generatedStyles;
        },
        genStyle() {
            let style = document.getElementById('vuetify-theme-stylesheet');
            if (!style) {
                style = document.createElement('style');
                style.type = 'text/css';
                style.id = 'vuetify-theme-stylesheet';
                if (this.$vuetify.options.cspNonce) {
                    style.setAttribute('nonce', this.$vuetify.options.cspNonce);
                }
                document.head.appendChild(style);
            }
            this.style = style;
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXRoZW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkFwcC9taXhpbnMvYXBwLXRoZW1lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxLQUFLLE1BQU0scUJBQXFCLENBQUE7QUFFNUMsZUFBZTtJQUNiLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ1gsS0FBSyxFQUFFLElBQUk7S0FDWixDQUFDO0lBRUYsUUFBUSxFQUFFO1FBQ1IsV0FBVztZQUNULE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ3pDLENBQUM7UUFDRCxxQkFBcUI7UUFDckIsZUFBZTtZQUNiLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUE7WUFDOUIsSUFBSSxHQUFHLENBQUE7WUFFUCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxJQUFJLEVBQUU7Z0JBQzVDLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO2dCQUNqRCxJQUFJLEdBQUcsSUFBSSxJQUFJO29CQUFFLE9BQU8sR0FBRyxDQUFBO2FBQzVCO1lBRUQsR0FBRyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUE7WUFFcEUsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxXQUFXLElBQUksSUFBSSxFQUFFO2dCQUM3QyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFBO2FBQzdDO1lBRUQsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8s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T0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO2lCQUM1RDtnQkFDRCxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQTthQUNqQztZQUVELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO1FBQ3BCLENBQUM7S0FDRjtDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBUaGVtZSBmcm9tICcuLi8uLi8uLi91dGlsL3RoZW1lJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIGRhdGE6ICgpID0+ICh7XHJcbiAgICBzdHlsZTogbnVsbFxyXG4gIH0pLFxyXG5cclxuICBjb21wdXRlZDoge1xyXG4gICAgcGFyc2VkVGhlbWUgKCkge1xyXG4gICAgICByZXR1cm4gVGhlbWUucGFyc2UodGhpcy4kdnVldGlmeS50aGVtZSlcclxuICAgIH0sXHJcbiAgICAvKiogQHJldHVybiBzdHJpbmcgKi9cclxuICAgIGdlbmVyYXRlZFN0eWxlcyAoKSB7XHJcbiAgICAgIGNvbnN0IHRoZW1lID0gdGhpcy5wYXJzZWRUaGVtZVxyXG4gICAgICBsZXQgY3NzXHJcblxyXG4gICAgICBpZiAodGhpcy4kdnVldGlmeS5vcHRpb25zLnRoZW1lQ2FjaGUgIT0gbnVsbCkge1xyXG4gICAgICAgIGNzcyA9IHRoaXMuJHZ1ZXRpZnkub3B0aW9ucy50aGVtZUNhY2hlLmdldCh0aGVtZSlcclxuICAgICAgICBpZiAoY3NzICE9IG51bGwpIHJldHVybiBjc3NcclxuICAgICAgfVxyXG5cclxuICAgICAgY3NzID0gVGhlbWUuZ2VuU3R5bGVzKHRoZW1lLCB0aGlzLiR2dWV0aWZ5Lm9wdGlvbnMuY3VzdG9tUHJvcGVydGllcylcclxuXHJcbiAgICAgIGlmICh0aGlzLiR2dWV0aWZ5Lm9wdGlvbnMubWluaWZ5VGhlbWUgIT0gbnVsbCkge1xyXG4gICAgICAgIGNzcyA9IHRoaXMuJHZ1ZXRpZnkub3B0aW9ucy5taW5pZnlUaGVtZShjc3MpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLiR2dWV0aWZ5Lm9wdGlvbnMudGhlbWVDYWNoZSAhPSBudWxsKSB7XHJcbiAgICAgICAgdGhpcy4kdnVldGlmeS5vcHRpb25zLnRoZW1lQ2FjaGUuc2V0KHRoZW1lLCBjc3MpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBjc3NcclxuICAgIH0sXHJcbiAgICB2dWVNZXRhICgpIHtcclxuICAgICAgaWYgKHRoaXMuJHZ1ZXRpZnkudGhlbWUgPT09IGZhbHNlKSByZXR1cm4ge31cclxuXHJcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgY3NzVGV4dDogdGhpcy5nZW5lcmF0ZWRTdHlsZXMsXHJcbiAgICAgICAgaWQ6ICd2dWV0aWZ5LXRoZW1lLXN0eWxlc2hlZXQnLFxyXG4gICAgICAgIHR5cGU6ICd0ZXh0L2NzcydcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMuJHZ1ZXRpZnkub3B0aW9ucy5jc3BOb25jZSkge1xyXG4gICAgICAgIG9wdGlvbnMubm9uY2UgPSB0aGlzLiR2dWV0aWZ5Lm9wdGlvbnMuY3NwTm9uY2VcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBzdHlsZTogW29wdGlvbnNdXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvLyBSZWd1bGFyIHZ1ZS1tZXRhXHJcbiAgbWV0YUluZm8gKCkge1xyXG4gICAgcmV0dXJuIHRoaXMudnVlTWV0YVxyXG4gIH0sXHJcblxyXG4gIC8vIE51eHRcclxuICBoZWFkICgpIHtcclxuICAgIHJldHVybiB0aGlzLnZ1ZU1ldGFcclxuICB9LFxyXG5cclxuICB3YXRjaDoge1xyXG4gICAgZ2VuZXJhdGVkU3R5bGVzICgpIHtcclxuICAgICAgIXRoaXMubWV0YSAmJiB0aGlzLmFwcGx5VGhlbWUoKVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGNyZWF0ZWQgKCkge1xyXG4gICAgaWYgKHRoaXMuJHZ1ZXRpZnkudGhlbWUgPT09IGZhbHNlKSByZXR1cm5cclxuXHJcbiAgICBpZiAodGhpcy4kbWV0YSkge1xyXG4gICAgICAvLyBWdWUtbWV0YVxyXG4gICAgICAvLyBIYW5kbGVkIGJ5IG1ldGFJbmZvKCkvbnV4dCgpXHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcgJiYgdGhpcy4kc3NyQ29udGV4dCkge1xyXG4gICAgICAvLyBTU1JcclxuICAgICAgY29uc3Qgbm9uY2UgPSB0aGlzLiR2dWV0aWZ5Lm9wdGlvbnMuY3NwTm9uY2VcclxuICAgICAgICA/IGAgbm9uY2U9XCIke3RoaXMuJHZ1ZXRpZnkub3B0aW9ucy5jc3BOb25jZX1cImBcclxuICAgICAgICA6ICcnXHJcbiAgICAgIHRoaXMuJHNzckNvbnRleHQuaGVhZCA9IHRoaXMuJHNzckNvbnRleHQuaGVhZCB8fCAnJ1xyXG4gICAgICB0aGlzLiRzc3JDb250ZXh0LmhlYWQgKz0gYDxzdHlsZSB0eXBlPVwidGV4dC9jc3NcIiBpZD1cInZ1ZXRpZnktdGhlbWUtc3R5bGVzaGVldFwiJHtub25jZX0+JHt0aGlzLmdlbmVyYXRlZFN0eWxlc308L3N0eWxlPmBcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAvLyBDbGllbnQtc2lkZVxyXG4gICAgICB0aGlzLmdlblN0eWxlKClcclxuICAgICAgdGhpcy5hcHBseVRoZW1lKClcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICBhcHBseVRoZW1lICgpIHtcclxuICAgICAgaWYgKHRoaXMuc3R5bGUpIHRoaXMuc3R5bGUuaW5uZXJIVE1MID0gdGhpcy5nZW5lcmF0ZWRTdHlsZXNcclxuICAgIH0sXHJcbiAgICBnZW5TdHlsZSAoKSB7XHJcbiAgICAgIGxldCBzdHlsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2dWV0aWZ5LXRoZW1lLXN0eWxlc2hlZXQnKVxyXG5cclxuICAgICAgaWYgKCFzdHlsZSkge1xyXG4gICAgICAgIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKVxyXG4gICAgICAgIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnXHJcbiAgICAgICAgc3R5bGUuaWQgPSAndnVldGlmeS10aGVtZS1zdHlsZXNoZWV0J1xyXG4gICAgICAgIGlmICh0aGlzLiR2dWV0aWZ5Lm9wdGlvbnMuY3NwTm9uY2UpIHtcclxuICAgICAgICAgIHN0eWxlLnNldEF0dHJpYnV0ZSgnbm9uY2UnLCB0aGlzLiR2dWV0aWZ5Lm9wdGlvbnMuY3NwTm9uY2UpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuc3R5bGUgPSBzdHlsZVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=