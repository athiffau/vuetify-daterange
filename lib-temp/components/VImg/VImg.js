import '../../stylus/components/_images.styl';
// Components
import VResponsive from '../VResponsive';
// Utils
import { consoleError, consoleWarn } from '../../util/console';
/* @vue/component */
export default VResponsive.extend({
    name: 'v-img',
    props: {
        alt: String,
        contain: Boolean,
        src: {
            type: [String, Object],
            default: ''
        },
        gradient: String,
        lazySrc: String,
        srcset: String,
        sizes: String,
        position: {
            type: String,
            default: 'center center'
        },
        transition: {
            type: [Boolean, String],
            default: 'fade-transition'
        }
    },
    data() {
        return {
            currentSrc: '',
            image: null,
            isLoading: true,
            calculatedAspectRatio: undefined
        };
    },
    computed: {
        computedAspectRatio() {
            return this.normalisedSrc.aspect;
        },
        normalisedSrc() {
            return typeof this.src === 'string'
                ? {
                    src: this.src,
                    srcset: this.srcset,
                    lazySrc: this.lazySrc,
                    aspect: Number(this.aspectRatio || this.calculatedAspectRatio)
                }
                : {
                    src: this.src.src,
                    srcset: this.srcset || this.src.srcset,
                    lazySrc: this.lazySrc || this.src.lazySrc,
                    aspect: Number(this.aspectRatio || this.src.aspect || this.calculatedAspectRatio)
                };
        },
        __cachedImage() {
            if (!(this.normalisedSrc.src || this.normalisedSrc.lazySrc))
                return [];
            const backgroundImage = [];
            const src = this.isLoading ? this.normalisedSrc.lazySrc : this.currentSrc;
            if (this.gradient)
                backgroundImage.push(`linear-gradient(${this.gradient})`);
            if (src)
                backgroundImage.push(`url("${src}")`);
            const image = this.$createElement('div', {
                staticClass: 'v-image__image',
                class: {
                    'v-image__image--preload': this.isLoading,
                    'v-image__image--contain': this.contain,
                    'v-image__image--cover': !this.contain
                },
                style: {
                    backgroundImage: backgroundImage.join(', '),
                    backgroundPosition: this.position
                },
                key: +this.isLoading
            });
            if (!this.transition)
                return image;
            return this.$createElement('transition', {
                attrs: {
                    name: this.transition,
                    mode: 'in-out'
                }
            }, [image]);
        }
    },
    watch: {
        src() {
            if (!this.isLoading)
                this.init();
            else
                this.loadImage();
        },
        '$vuetify.breakpoint.width': 'getSrc'
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            if (this.normalisedSrc.lazySrc) {
                const lazyImg = new Image();
                lazyImg.src = this.normalisedSrc.lazySrc;
                this.pollForSize(lazyImg, null);
            }
            /* istanbul ignore else */
            if (this.normalisedSrc.src)
                this.loadImage();
        },
        onLoad() {
            this.getSrc();
            this.isLoading = false;
            this.$emit('load', this.src);
        },
        onError() {
            consoleError(`Image load failed\n\n` +
                `src: ${this.normalisedSrc.src}`, this);
            this.$emit('error', this.src);
        },
        getSrc() {
            /* istanbul ignore else */
            if (this.image)
                this.currentSrc = this.image.currentSrc || this.image.src;
        },
        loadImage() {
            const image = new Image();
            this.image = image;
            image.onload = () => {
                /* istanbul ignore if */
                if (image.decode) {
                    image.decode().catch((err) => {
                        consoleWarn(`Failed to decode image, trying to render anyway\n\n` +
                            `src: ${this.normalisedSrc.src}` +
                            (err.message ? `\nOriginal error: ${err.message}` : ''), this);
                    }).then(this.onLoad);
                }
                else {
                    this.onLoad();
                }
            };
            image.onerror = this.onError;
            image.src = this.normalisedSrc.src;
            this.sizes && (image.sizes = this.sizes);
            this.normalisedSrc.srcset && (image.srcset = this.normalisedSrc.srcset);
            this.aspectRatio || this.pollForSize(image);
            this.getSrc();
        },
        pollForSize(img, timeout = 100) {
            const poll = () => {
                const { naturalHeight, naturalWidth } = img;
                if (naturalHeight || naturalWidth) {
                    this.calculatedAspectRatio = naturalWidth / naturalHeight;
                }
                else {
                    timeout != null && setTimeout(poll, timeout);
                }
            };
            poll();
        },
        __genPlaceholder() {
            if (this.$slots.placeholder) {
                const placeholder = this.isLoading
                    ? [this.$createElement('div', {
                            staticClass: 'v-image__placeholder'
                        }, this.$slots.placeholder)]
                    : [];
                if (!this.transition)
                    return placeholder[0];
                return this.$createElement('transition', {
                    attrs: { name: this.transition }
                }, placeholder);
            }
        }
    },
    render(h) {
        const node = VResponsive.options.render.call(this, h);
        node.data.staticClass += ' v-image';
        node.data.attrs = {
            role: this.alt ? 'img' : undefined,
            'aria-label': this.alt
        };
        node.children = [
            this.__cachedSizer,
            this.__cachedImage,
            this.__genPlaceholder(),
            this.genContent()
        ];
        return h(node.tag, node.data, node.children);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkltZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZJbWcvVkltZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLHNDQUFzQyxDQUFBO0FBTTdDLGFBQWE7QUFDYixPQUFPLFdBQVcsTUFBTSxnQkFBZ0IsQ0FBQTtBQUV4QyxRQUFRO0FBQ1IsT0FBTyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQVU5RCxvQkFBb0I7QUFDcEIsZUFBZSxXQUFXLENBQUMsTUFBTSxDQUFDO0lBQ2hDLElBQUksRUFBRSxPQUFPO0lBRWIsS0FBSyxFQUFFO1FBQ0wsR0FBRyxFQUFFLE1BQU07UUFDWCxPQUFPLEVBQUUsT0FBTztRQUNoQixHQUFHLEVBQUU7WUFDSCxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxFQUFFO1NBQ3lCO1FBQ3RDLFFBQVEsRUFBRSxNQUFNO1FBQ2hCLE9BQU8sRUFBRSxNQUFNO1FBQ2YsTUFBTSxFQUFFLE1BQU07UUFDZCxLQUFLLEVBQUUsTUFBTTtRQUNiLFFBQVEsRUFBRTtZQUNSLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLGVBQWU7U0FDekI7UUFDRCxVQUFVLEVBQUU7WUFDVixJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDO1lBQ3ZCLE9BQU8sRUFBRSxpQkFBaUI7U0FDM0I7S0FDRjtJQUVELElBQUk7UUFDRixPQUFPO1lBQ0wsVUFBVSxFQUFFLEVBQUU7WUFDZCxLQUFLLEVBQUUsSUFBK0I7WUFDdEMsU0FBUyxFQUFFLElBQUk7WUFDZixxQkFBcUIsRUFBRSxTQUErQjtTQUN2RCxDQUFBO0lBQ0gsQ0FBQztJQUVELFFBQVEsRUFBRTtRQUNSLG1CQUFtQjtZQUNqQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFBO1FBQ2xDLENBQUM7UUFDRCxhQUFhO1lB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WUFDZCxJQUFJLENBQUMsYUFBYTtZQUNsQixJQUFJLENBQUMsYUFBYTtZQUNsQixJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDdkIsSUFBSSxDQUFDLFVBQVUsRUFBRTtTQUNsQixDQUFBO1FBRUQsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUM5QyxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuLi8uLi9zdHlsdXMvY29tcG9uZW50cy9faW1hZ2VzLnN0eWwnXHJcblxyXG4vLyBUeXBlc1xyXG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gJ3Z1ZSdcclxuaW1wb3J0IHsgUHJvcFZhbGlkYXRvciB9IGZyb20gJ3Z1ZS90eXBlcy9vcHRpb25zJ1xyXG5cclxuLy8gQ29tcG9uZW50c1xyXG5pbXBvcnQgVlJlc3BvbnNpdmUgZnJvbSAnLi4vVlJlc3BvbnNpdmUnXHJcblxyXG4vLyBVdGlsc1xyXG5pbXBvcnQgeyBjb25zb2xlRXJyb3IsIGNvbnNvbGVXYXJuIH0gZnJvbSAnLi4vLi4vdXRpbC9jb25zb2xlJ1xyXG5cclxuLy8gbm90IGludGVuZGVkIGZvciBwdWJsaWMgdXNlLCB0aGlzIGlzIHBhc3NlZCBpbiBieSB2dWV0aWZ5LWxvYWRlclxyXG5leHBvcnQgaW50ZXJmYWNlIHNyY09iamVjdCB7XHJcbiAgc3JjOiBzdHJpbmdcclxuICBzcmNzZXQ/OiBzdHJpbmdcclxuICBsYXp5U3JjOiBzdHJpbmdcclxuICBhc3BlY3Q6IG51bWJlclxyXG59XHJcblxyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG5leHBvcnQgZGVmYXVsdCBWUmVzcG9uc2l2ZS5leHRlbmQoe1xyXG4gIG5hbWU6ICd2LWltZycsXHJcblxyXG4gIHByb3BzOiB7XHJcbiAgICBhbHQ6IFN0cmluZyxcclxuICAgIGNvbnRhaW46IEJvb2xlYW4sXHJcbiAgICBzcmM6IHtcclxuICAgICAgdHlwZTogW1N0cmluZywgT2JqZWN0XSxcclxuICAgICAgZGVmYXVsdDogJydcclxuICAgIH0gYXMgUHJvcFZhbGlkYXRvcjxzdHJpbmcgfCBzcmNPYmplY3Q+LFxyXG4gICAgZ3JhZGllbnQ6IFN0cmluZyxcclxuICAgIGxhenlTcmM6IFN0cmluZyxcclxuICAgIHNyY3NldDogU3RyaW5nLFxyXG4gICAgc2l6ZXM6IFN0cmluZyxcclxuICAgIHBvc2l0aW9uOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJ2NlbnRlciBjZW50ZXInXHJcbiAgICB9LFxyXG4gICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICB0eXBlOiBbQm9vbGVhbiwgU3RyaW5nXSxcclxuICAgICAgZGVmYXVsdDogJ2ZhZGUtdHJhbnNpdGlvbidcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBkYXRhICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGN1cnJlbnRTcmM6ICcnLCAvLyBTZXQgZnJvbSBzcmNzZXRcclxuICAgICAgaW1hZ2U6IG51bGwgYXMgSFRNTEltYWdlRWxlbWVudCB8IG51bGwsXHJcbiAgICAgIGlzTG9hZGluZzogdHJ1ZSxcclxuICAgICAgY2FsY3VsYXRlZEFzcGVjdFJhdGlvOiB1bmRlZmluZWQgYXMgbnVtYmVyIHwgdW5kZWZpbmVkXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIGNvbXB1dGVkQXNwZWN0UmF0aW8gKCk6IG51bWJlciB7XHJcbiAgICAgIHJldHVybiB0aGlzLm5vcm1hbGlzZWRTcmMuYXNwZWN0XHJcbiAgICB9LFxyXG4gICAgbm9ybWFsaXNlZFNyYyAoKTogc3JjT2JqZWN0IHtcclxuICAgICAgcmV0dXJuIHR5cGVvZiB0aGlzLnNyYyA9PT0gJ3N0cmluZydcclxuICAgICAgICA/IHtcclxuICAgICAgICAgIHNyYzogdGhpcy5zcmMsXHJcbiAgICAgICAgICBzcmNzZXQ6IHRoaXMuc3Jjc2V0LFxyXG4gICAgICAgICAgbGF6eVNyYzogdGhpcy5sYXp5U3JjLFxyXG4gICAgICAgICAgYXNwZWN0OiBOdW1iZXIodGhpcy5hc3BlY3RSYXRpbyB8fCB0aGlzLmNhbGN1bGF0ZWRBc3BlY3RSYXRpbylcclxuICAgICAgICB9XHJcbiAgICAgICAgOiB7XHJcbiAgICAgICAgICBzcmM6IHRoaXMuc3JjLnNyYyxcclxuICAgICAgICAgIHNyY3NldDogdGhpcy5zcmNzZXQgfHwgdGhpcy5zcmMuc3Jjc2V0LFxyXG4gICAgICAgICAgbGF6eVNyYzogdGhpcy5sYXp5U3JjIHx8IHRoaXMuc3JjLmxhenlTcmMsXHJcbiAgICAgICAgICBhc3BlY3Q6IE51bWJlcih0aGlzLmFzcGVjdFJhdGlvIHx8IHRoaXMuc3JjLmFzcGVjdCB8fCB0aGlzLmNhbGN1bGF0ZWRBc3BlY3RSYXRpbylcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgX19jYWNoZWRJbWFnZSAoKTogVk5vZGUgfCBuZXZlcltdIHtcclxuICAgICAgaWYgKCEodGhpcy5ub3JtYWxpc2VkU3JjLnNyYyB8fCB0aGlzLm5vcm1hbGlzZWRTcmMubGF6eVNyYykpIHJldHVybiBbXVxyXG5cclxuICAgICAgY29uc3QgYmFja2dyb3VuZEltYWdlOiBzdHJpbmdbXSA9IFtdXHJcbiAgICAgIGNvbnN0IHNyYyA9IHRoaXMuaXNMb2FkaW5nID8gdGhpcy5ub3JtYWxpc2VkU3JjLmxhenlTcmMgOiB0aGlzLmN1cnJlbnRTcmNcclxuXHJcbiAgICAgIGlmICh0aGlzLmdyYWRpZW50KSBiYWNrZ3JvdW5kSW1hZ2UucHVzaChgbGluZWFyLWdyYWRpZW50KCR7dGhpcy5ncmFkaWVudH0pYClcclxuICAgICAgaWYgKHNyYykgYmFja2dyb3VuZEltYWdlLnB1c2goYHVybChcIiR7c3JjfVwiKWApXHJcblxyXG4gICAgICBjb25zdCBpbWFnZSA9IHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICBzdGF0aWNDbGFzczogJ3YtaW1hZ2VfX2ltYWdlJyxcclxuICAgICAgICBjbGFzczoge1xyXG4gICAgICAgICAgJ3YtaW1hZ2VfX2ltYWdlLS1wcmVsb2FkJzogdGhpcy5pc0xvYWRpbmcsXHJcbiAgICAgICAgICAndi1pbWFnZV9faW1hZ2UtLWNvbnRhaW4nOiB0aGlzLmNvbnRhaW4sXHJcbiAgICAgICAgICAndi1pbWFnZV9faW1hZ2UtLWNvdmVyJzogIXRoaXMuY29udGFpblxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc3R5bGU6IHtcclxuICAgICAgICAgIGJhY2tncm91bmRJbWFnZTogYmFja2dyb3VuZEltYWdlLmpvaW4oJywgJyksXHJcbiAgICAgICAgICBiYWNrZ3JvdW5kUG9zaXRpb246IHRoaXMucG9zaXRpb25cclxuICAgICAgICB9LFxyXG4gICAgICAgIGtleTogK3RoaXMuaXNMb2FkaW5nXHJcbiAgICAgIH0pXHJcblxyXG4gICAgICBpZiAoIXRoaXMudHJhbnNpdGlvbikgcmV0dXJuIGltYWdlXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgndHJhbnNpdGlvbicsIHtcclxuICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgbmFtZTogdGhpcy50cmFuc2l0aW9uLFxyXG4gICAgICAgICAgbW9kZTogJ2luLW91dCdcclxuICAgICAgICB9XHJcbiAgICAgIH0sIFtpbWFnZV0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgd2F0Y2g6IHtcclxuICAgIHNyYyAoKSB7XHJcbiAgICAgIGlmICghdGhpcy5pc0xvYWRpbmcpIHRoaXMuaW5pdCgpXHJcbiAgICAgIGVsc2UgdGhpcy5sb2FkSW1hZ2UoKVxyXG4gICAgfSxcclxuICAgICckdnVldGlmeS5icmVha3BvaW50LndpZHRoJzogJ2dldFNyYydcclxuICB9LFxyXG5cclxuICBtb3VudGVkICgpIHtcclxuICAgIHRoaXMuaW5pdCgpXHJcbiAgfSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgaW5pdCAoKSB7XHJcbiAgICAgIGlmICh0aGlzLm5vcm1hbGlzZWRTcmMubGF6eVNyYykge1xyXG4gICAgICAgIGNvbnN0IGxhenlJbWcgPSBuZXcgSW1hZ2UoKVxyXG4gICAgICAgIGxhenlJbWcuc3JjID0gdGhpcy5ub3JtYWxpc2VkU3JjLmxhenlTcmNcclxuICAgICAgICB0aGlzLnBvbGxGb3JTaXplKGxhenlJbWcsIG51bGwpXHJcbiAgICAgIH1cclxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cclxuICAgICAgaWYgKHRoaXMubm9ybWFsaXNlZFNyYy5zcmMpIHRoaXMubG9hZEltYWdlKClcclxuICAgIH0sXHJcbiAgICBvbkxvYWQgKCkge1xyXG4gICAgICB0aGlzLmdldFNyYygpXHJcbiAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2VcclxuICAgICAgdGhpcy4kZW1pdCgnbG9hZCcsIHRoaXMuc3JjKVxyXG4gICAgfSxcclxuICAgIG9uRXJyb3IgKCkge1xyXG4gICAgICBjb25zb2xlRXJyb3IoXHJcbiAgICAgICAgYEltYWdlIGxvYWQgZmFpbGVkXFxuXFxuYCArXHJcbiAgICAgICAgYHNyYzogJHt0aGlzLm5vcm1hbGlzZWRTcmMuc3JjfWAsXHJcbiAgICAgICAgdGhpc1xyXG4gICAgICApXHJcbiAgICAgIHRoaXMuJGVtaXQoJ2Vycm9yJywgdGhpcy5zcmMpXHJcbiAgICB9LFxyXG4gICAgZ2V0U3JjICgpIHtcclxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cclxuICAgICAgaWYgKHRoaXMuaW1hZ2UpIHRoaXMuY3VycmVudFNyYyA9IHRoaXMuaW1hZ2UuY3VycmVudFNyYyB8fCB0aGlzLmltYWdlLnNyY1xyXG4gICAgfSxcclxuICAgIGxvYWRJbWFnZSAoKSB7XHJcbiAgICAgIGNvbnN0IGltYWdlID0gbmV3IEltYWdlKClcclxuICAgICAgdGhpcy5pbWFnZSA9IGltYWdlXHJcblxyXG4gICAgICBpbWFnZS5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICAgICAgaWYgKGltYWdlLmRlY29kZSkge1xyXG4gICAgICAgICAgaW1hZ2UuZGVjb2RlKCkuY2F0Y2goKGVycjogRE9NRXhjZXB0aW9uKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGVXYXJuKFxyXG4gICAgICAgICAgICAgIGBGYWlsZWQgdG8gZGVjb2RlIGltYWdlLCB0cnlpbmcgdG8gcmVuZGVyIGFueXdheVxcblxcbmAgK1xyXG4gICAgICAgICAgICAgIGBzcmM6ICR7dGhpcy5ub3JtYWxpc2VkU3JjLnNyY31gICtcclxuICAgICAgICAgICAgICAoZXJyLm1lc3NhZ2UgPyBgXFxuT3JpZ2luYWwgZXJyb3I6ICR7ZXJyLm1lc3NhZ2V9YCA6ICcnKSxcclxuICAgICAgICAgICAgICB0aGlzXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgIH0pLnRoZW4odGhpcy5vbkxvYWQpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMub25Mb2FkKClcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaW1hZ2Uub25lcnJvciA9IHRoaXMub25FcnJvclxyXG5cclxuICAgICAgaW1hZ2Uuc3JjID0gdGhpcy5ub3JtYWxpc2VkU3JjLnNyY1xyXG4gICAgICB0aGlzLnNpemVzICYmIChpbWFnZS5zaXplcyA9IHRoaXMuc2l6ZXMpXHJcbiAgICAgIHRoaXMubm9ybWFsaXNlZFNyYy5zcmNzZXQgJiYgKGltYWdlLnNyY3NldCA9IHRoaXMubm9ybWFsaXNlZFNyYy5zcmNzZXQpXHJcblxyXG4gICAgICB0aGlzLmFzcGVjdFJhdGlvIHx8IHRoaXMucG9sbEZvclNpemUoaW1hZ2UpXHJcbiAgICAgIHRoaXMuZ2V0U3JjKClcclxuICAgIH0sXHJcbiAgICBwb2xsRm9yU2l6ZSAoaW1nOiBIVE1MSW1hZ2VFbGVtZW50LCB0aW1lb3V0OiBudW1iZXIgfCBudWxsID0gMTAwKSB7XHJcbiAgICAgIGNvbnN0IHBvbGwgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBuYXR1cmFsSGVpZ2h0LCBuYXR1cmFsV2lkdGggfSA9IGltZ1xyXG5cclxuICAgICAgICBpZiAobmF0dXJhbEhlaWdodCB8fCBuYXR1cmFsV2lkdGgpIHtcclxuICAgICAgICAgIHRoaXMuY2FsY3VsYXRlZEFzcGVjdFJhdGlvID0gbmF0dXJhbFdpZHRoIC8gbmF0dXJhbEhlaWdodFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aW1lb3V0ICE9IG51bGwgJiYgc2V0VGltZW91dChwb2xsLCB0aW1lb3V0KVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcG9sbCgpXHJcbiAgICB9LFxyXG4gICAgX19nZW5QbGFjZWhvbGRlciAoKTogVk5vZGUgfCB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMuJHNsb3RzLnBsYWNlaG9sZGVyKSB7XHJcbiAgICAgICAgY29uc3QgcGxhY2Vob2xkZXIgPSB0aGlzLmlzTG9hZGluZ1xyXG4gICAgICAgICAgPyBbdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xyXG4gICAgICAgICAgICBzdGF0aWNDbGFzczogJ3YtaW1hZ2VfX3BsYWNlaG9sZGVyJ1xyXG4gICAgICAgICAgfSwgdGhpcy4kc2xvdHMucGxhY2Vob2xkZXIpXVxyXG4gICAgICAgICAgOiBbXVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMudHJhbnNpdGlvbikgcmV0dXJuIHBsYWNlaG9sZGVyWzBdXHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCd0cmFuc2l0aW9uJywge1xyXG4gICAgICAgICAgYXR0cnM6IHsgbmFtZTogdGhpcy50cmFuc2l0aW9uIH1cclxuICAgICAgICB9LCBwbGFjZWhvbGRlcilcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcclxuICAgIGNvbnN0IG5vZGUgPSBWUmVzcG9uc2l2ZS5vcHRpb25zLnJlbmRlci5jYWxsKHRoaXMsIGgpXHJcblxyXG4gICAgbm9kZS5kYXRhLnN0YXRpY0NsYXNzICs9ICcgdi1pbWFnZSdcclxuXHJcbiAgICBub2RlLmRhdGEuYXR0cnMgPSB7XHJcbiAgICAgIHJvbGU6IHRoaXMuYWx0ID8gJ2ltZycgOiB1bmRlZmluZWQsXHJcbiAgICAgICdhcmlhLWxhYmVsJzogdGhpcy5hbHRcclxuICAgIH1cclxuXHJcbiAgICBub2RlLmNoaWxkcmVuID0gW1xyXG4gICAgICB0aGlzLl9fY2FjaGVkU2l6ZXIsXHJcbiAgICAgIHRoaXMuX19jYWNoZWRJbWFnZSxcclxuICAgICAgdGhpcy5fX2dlblBsYWNlaG9sZGVyKCksXHJcbiAgICAgIHRoaXMuZ2VuQ29udGVudCgpXHJcbiAgICBdXHJcblxyXG4gICAgcmV0dXJuIGgobm9kZS50YWcsIG5vZGUuZGF0YSwgbm9kZS5jaGlsZHJlbilcclxuICB9XHJcbn0pXHJcbiJdfQ==