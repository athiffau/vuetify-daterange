// Style
import '../../stylus/components/_parallax.styl';
// Mixins
import Translatable from '../../mixins/translatable';
import mixins from '../../util/mixins';
/* @vue/component */
export default mixins(Translatable).extend({
    name: 'v-parallax',
    props: {
        alt: {
            type: String,
            default: ''
        },
        height: {
            type: [String, Number],
            default: 500
        },
        src: String
    },
    data: () => ({
        isBooted: false
    }),
    computed: {
        styles() {
            return {
                display: 'block',
                opacity: this.isBooted ? 1 : 0,
                transform: `translate(-50%, ${this.parallax}px)`
            };
        }
    },
    watch: {
        parallax() {
            this.isBooted = true;
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            const img = this.$refs.img;
            if (!img)
                return;
            if (img.complete) {
                this.translate();
                this.listeners();
            }
            else {
                img.addEventListener('load', () => {
                    this.translate();
                    this.listeners();
                }, false);
            }
        },
        objHeight() {
            return this.$refs.img.naturalHeight;
        }
    },
    render(h) {
        const imgData = {
            staticClass: 'v-parallax__image',
            style: this.styles,
            attrs: {
                src: this.src,
                alt: this.alt
            },
            ref: 'img'
        };
        const container = h('div', {
            staticClass: 'v-parallax__image-container'
        }, [
            h('img', imgData)
        ]);
        const content = h('div', {
            staticClass: 'v-parallax__content'
        }, this.$slots.default);
        return h('div', {
            staticClass: 'v-parallax',
            style: {
                height: `${this.height}px`
            },
            on: this.$listeners
        }, [container, content]);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlBhcmFsbGF4LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVlBhcmFsbGF4L1ZQYXJhbGxheC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxRQUFRO0FBQ1IsT0FBTyx3Q0FBd0MsQ0FBQTtBQUUvQyxTQUFTO0FBQ1QsT0FBTyxZQUFZLE1BQU0sMkJBQTJCLENBQUE7QUFLcEQsT0FBTyxNQUFzQixNQUFNLG1CQUFtQixDQUFBO0FBUXRELG9CQUFvQjtBQUNwQixlQUFlLE1BQU0sQ0FBNEMsWUFBWSxDQUFDLENBQUMsTUFBTSxDQUFDO0lBQ3BGLElBQUksRUFBRSxZQUFZO0lBRWxCLEtBQUssRUFBRTtRQUNMLEdBQUcsRUFBRTtZQUNILElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLEVBQUU7U0FDWjtRQUNELE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxFQUFFLEdBQUc7U0FDYjtRQUNELEdBQUcsRUFBRSxNQUFNO0tBQ1o7SUFFRCxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNYLFFBQVEsRUFBRSxLQUFLO0tBQ2hCLENBQUM7SUFFRixRQUFRLEVBQUU7UUFDUixNQUFNO1lBQ0osT0FBTztnQkFDTCxPQUFPLEVBQUUsT0FBTztnQkFDaEIsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUIsU0FBUyxFQUFFLG1CQUFtQixJQUFJLENBQUMsUUFBUSxLQUFLO2FBQ2pELENBQUE7UUFDSCxDQUFDO0tBQ0Y7SUFFRCxLQUFLLEVBQUU7UUFDTCxRQUFRO1lBQ04sSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUE7UUFDdEIsQ0FBQztLQUNGO0lBRUQsT0FBTztRQUNMLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQTtJQUNiLENBQUM7SUFFRCxPQUFPLEVBQUU7UUFDUCxJQUFJO1lBQ0YsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUE7WUFFMUIsSUFBSSxDQUFDLEdBQUc7Z0JBQUUsT0FBTTtZQUVoQixJQUFJLEdBQUcsQ0FBQyxRQUFRLEVBQUU7Z0JBQ2hCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQTtnQkFDaEIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFBO2FBQ2pCO2lCQUFNO2dCQUNMLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO29CQUNoQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUE7b0JBQ2hCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQTtnQkFDbEIsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFBO2FBQ1Y7UUFDSCxDQUFDO1FBQ0QsU0FBUztZQUNQLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFBO1FBQ3JDLENBQUM7S0FDRjtJQUVELE1BQU0sQ0FBRSxDQUFDO1FBQ1AsTUFBTSxPQUFPLEdBQWM7WUFDekIsV0FBVyxFQUFFLG1CQUFtQjtZQUNoQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDbEIsS0FBSyxFQUFFO2dCQUNMLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztnQkFDYixHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7YUFDZDtZQUNELEdBQUcsRUFBRSxLQUFLO1NBQ1gsQ0FBQTtRQUVELE1BQU0sU0FBUyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUU7WUFDekIsV0FBVyxFQUFFLDZCQUE2QjtTQUMzQyxFQUFFO1lBQ0QsQ0FBQyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUM7U0FDbEIsQ0FBQyxDQUFBO1FBRUYsTUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRTtZQUN2QixXQUFXLEVBQUUscUJBQXFCO1NBQ25DLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUV2QixPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUU7WUFDZCxXQUFXLEVBQUUsWUFBWTtZQUN6QixLQUFLLEVBQUU7Z0JBQ0wsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSTthQUMzQjtZQUNELEVBQUUsRUFBRSxJQUFJLENBQUMsVUFBVTtTQUNwQixFQUFFLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUE7SUFDMUIsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlXHJcbmltcG9ydCAnLi4vLi4vc3R5bHVzL2NvbXBvbmVudHMvX3BhcmFsbGF4LnN0eWwnXHJcblxyXG4vLyBNaXhpbnNcclxuaW1wb3J0IFRyYW5zbGF0YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdHJhbnNsYXRhYmxlJ1xyXG5cclxuLy8gVHlwZXNcclxuaW1wb3J0IFZ1ZSBmcm9tICd2dWUnXHJcbmltcG9ydCB7IFZOb2RlLCBWTm9kZURhdGEgfSBmcm9tICd2dWUvdHlwZXMvdm5vZGUnXHJcbmltcG9ydCBtaXhpbnMsIHsgRXh0cmFjdFZ1ZSB9IGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xyXG5cclxuaW50ZXJmYWNlIG9wdGlvbnMgZXh0ZW5kcyBWdWUge1xyXG4gICRyZWZzOiB7XHJcbiAgICBpbWc6IEhUTUxJbWFnZUVsZW1lbnRcclxuICB9XHJcbn1cclxuXHJcbi8qIEB2dWUvY29tcG9uZW50ICovXHJcbmV4cG9ydCBkZWZhdWx0IG1peGluczxvcHRpb25zICYgRXh0cmFjdFZ1ZTx0eXBlb2YgVHJhbnNsYXRhYmxlPj4oVHJhbnNsYXRhYmxlKS5leHRlbmQoe1xyXG4gIG5hbWU6ICd2LXBhcmFsbGF4JyxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIGFsdDoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICcnXHJcbiAgICB9LFxyXG4gICAgaGVpZ2h0OiB7XHJcbiAgICAgIHR5cGU6IFtTdHJpbmcsIE51bWJlcl0sXHJcbiAgICAgIGRlZmF1bHQ6IDUwMFxyXG4gICAgfSxcclxuICAgIHNyYzogU3RyaW5nXHJcbiAgfSxcclxuXHJcbiAgZGF0YTogKCkgPT4gKHtcclxuICAgIGlzQm9vdGVkOiBmYWxzZVxyXG4gIH0pLFxyXG5cclxuICBjb21wdXRlZDoge1xyXG4gICAgc3R5bGVzICgpOiBvYmplY3Qge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGRpc3BsYXk6ICdibG9jaycsXHJcbiAgICAgICAgb3BhY2l0eTogdGhpcy5pc0Jvb3RlZCA/IDEgOiAwLFxyXG4gICAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZSgtNTAlLCAke3RoaXMucGFyYWxsYXh9cHgpYFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgd2F0Y2g6IHtcclxuICAgIHBhcmFsbGF4ICgpIHtcclxuICAgICAgdGhpcy5pc0Jvb3RlZCA9IHRydWVcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBtb3VudGVkICgpIHtcclxuICAgIHRoaXMuaW5pdCgpXHJcbiAgfSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgaW5pdCAoKSB7XHJcbiAgICAgIGNvbnN0IGltZyA9IHRoaXMuJHJlZnMuaW1nXHJcblxyXG4gICAgICBpZiAoIWltZykgcmV0dXJuXHJcblxyXG4gICAgICBpZiAoaW1nLmNvbXBsZXRlKSB7XHJcbiAgICAgICAgdGhpcy50cmFuc2xhdGUoKVxyXG4gICAgICAgIHRoaXMubGlzdGVuZXJzKClcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpbWcuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgICAgICAgIHRoaXMudHJhbnNsYXRlKClcclxuICAgICAgICAgIHRoaXMubGlzdGVuZXJzKClcclxuICAgICAgICB9LCBmYWxzZSlcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIG9iakhlaWdodCAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRyZWZzLmltZy5uYXR1cmFsSGVpZ2h0XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgcmVuZGVyIChoKTogVk5vZGUge1xyXG4gICAgY29uc3QgaW1nRGF0YTogVk5vZGVEYXRhID0ge1xyXG4gICAgICBzdGF0aWNDbGFzczogJ3YtcGFyYWxsYXhfX2ltYWdlJyxcclxuICAgICAgc3R5bGU6IHRoaXMuc3R5bGVzLFxyXG4gICAgICBhdHRyczoge1xyXG4gICAgICAgIHNyYzogdGhpcy5zcmMsXHJcbiAgICAgICAgYWx0OiB0aGlzLmFsdFxyXG4gICAgICB9LFxyXG4gICAgICByZWY6ICdpbWcnXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY29udGFpbmVyID0gaCgnZGl2Jywge1xyXG4gICAgICBzdGF0aWNDbGFzczogJ3YtcGFyYWxsYXhfX2ltYWdlLWNvbnRhaW5lcidcclxuICAgIH0sIFtcclxuICAgICAgaCgnaW1nJywgaW1nRGF0YSlcclxuICAgIF0pXHJcblxyXG4gICAgY29uc3QgY29udGVudCA9IGgoJ2RpdicsIHtcclxuICAgICAgc3RhdGljQ2xhc3M6ICd2LXBhcmFsbGF4X19jb250ZW50J1xyXG4gICAgfSwgdGhpcy4kc2xvdHMuZGVmYXVsdClcclxuXHJcbiAgICByZXR1cm4gaCgnZGl2Jywge1xyXG4gICAgICBzdGF0aWNDbGFzczogJ3YtcGFyYWxsYXgnLFxyXG4gICAgICBzdHlsZToge1xyXG4gICAgICAgIGhlaWdodDogYCR7dGhpcy5oZWlnaHR9cHhgXHJcbiAgICAgIH0sXHJcbiAgICAgIG9uOiB0aGlzLiRsaXN0ZW5lcnNcclxuICAgIH0sIFtjb250YWluZXIsIGNvbnRlbnRdKVxyXG4gIH1cclxufSlcclxuIl19