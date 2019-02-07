/**
 * Tabs props
 *
 * @mixin
 */
/* @vue/component */
export default {
    props: {
        activeClass: {
            type: String,
            default: 'v-tabs__item--active'
        },
        alignWithTitle: Boolean,
        centered: Boolean,
        fixedTabs: Boolean,
        grow: Boolean,
        height: {
            type: [Number, String],
            default: undefined,
            validator: v => !isNaN(parseInt(v))
        },
        hideSlider: Boolean,
        iconsAndText: Boolean,
        mandatory: {
            type: Boolean,
            default: true
        },
        mobileBreakPoint: {
            type: [Number, String],
            default: 1264,
            validator: v => !isNaN(parseInt(v))
        },
        nextIcon: {
            type: String,
            default: '$vuetify.icons.next'
        },
        prevIcon: {
            type: String,
            default: '$vuetify.icons.prev'
        },
        right: Boolean,
        showArrows: Boolean,
        sliderColor: {
            type: String,
            default: 'accent'
        },
        value: [Number, String]
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFicy1wcm9wcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZUYWJzL21peGlucy90YWJzLXByb3BzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0dBSUc7QUFDSCxvQkFBb0I7QUFDcEIsZUFBZTtJQUNiLEtBQUssRUFBRTtRQUNMLFdBQVcsRUFBRTtZQUNYLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLHNCQUFzQjtTQUNoQztRQUNELGNBQWMsRUFBRSxPQUFPO1FBQ3ZCLFFBQVEsRUFBRSxPQUFPO1FBQ2pCLFNBQVMsRUFBRSxPQUFPO1FBQ2xCLElBQUksRUFBRSxPQUFPO1FBQ2IsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUN0QixPQUFPLEVBQUUsU0FBUztZQUNsQixTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDcEM7UUFDRCxVQUFVLEVBQUUsT0FBTztRQUNuQixZQUFZLEVBQUUsT0FBTztRQUNyQixTQUFTLEVBQUU7WUFDVCxJQUFJLEVBQUUsT0FBTztZQUNiLE9BQU8sRUFBRSxJQUFJO1NBQ2Q7UUFDRCxnQkFBZ0IsRUFBRTtZQUNoQixJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxJQUFJO1lBQ2IsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3BDO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUscUJBQXFCO1NBQy9CO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUscUJBQXFCO1NBQy9CO1FBQ0QsS0FBSyxFQUFFLE9BQU87UUFDZCxVQUFVLEVBQUUsT0FBTztRQUNuQixXQUFXLEVBQUU7WUFDWCxJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxRQUFRO1NBQ2xCO1FBQ0QsS0FBSyxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztLQUN4QjtDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogVGFicyBwcm9wc1xyXG4gKlxyXG4gKiBAbWl4aW5cclxuICovXHJcbi8qIEB2dWUvY29tcG9uZW50ICovXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBwcm9wczoge1xyXG4gICAgYWN0aXZlQ2xhc3M6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAndi10YWJzX19pdGVtLS1hY3RpdmUnXHJcbiAgICB9LFxyXG4gICAgYWxpZ25XaXRoVGl0bGU6IEJvb2xlYW4sXHJcbiAgICBjZW50ZXJlZDogQm9vbGVhbixcclxuICAgIGZpeGVkVGFiczogQm9vbGVhbixcclxuICAgIGdyb3c6IEJvb2xlYW4sXHJcbiAgICBoZWlnaHQ6IHtcclxuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcclxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxyXG4gICAgICB2YWxpZGF0b3I6IHYgPT4gIWlzTmFOKHBhcnNlSW50KHYpKVxyXG4gICAgfSxcclxuICAgIGhpZGVTbGlkZXI6IEJvb2xlYW4sXHJcbiAgICBpY29uc0FuZFRleHQ6IEJvb2xlYW4sXHJcbiAgICBtYW5kYXRvcnk6IHtcclxuICAgICAgdHlwZTogQm9vbGVhbixcclxuICAgICAgZGVmYXVsdDogdHJ1ZVxyXG4gICAgfSxcclxuICAgIG1vYmlsZUJyZWFrUG9pbnQ6IHtcclxuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcclxuICAgICAgZGVmYXVsdDogMTI2NCxcclxuICAgICAgdmFsaWRhdG9yOiB2ID0+ICFpc05hTihwYXJzZUludCh2KSlcclxuICAgIH0sXHJcbiAgICBuZXh0SWNvbjoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICckdnVldGlmeS5pY29ucy5uZXh0J1xyXG4gICAgfSxcclxuICAgIHByZXZJY29uOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJyR2dWV0aWZ5Lmljb25zLnByZXYnXHJcbiAgICB9LFxyXG4gICAgcmlnaHQ6IEJvb2xlYW4sXHJcbiAgICBzaG93QXJyb3dzOiBCb29sZWFuLFxyXG4gICAgc2xpZGVyQ29sb3I6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAnYWNjZW50J1xyXG4gICAgfSxcclxuICAgIHZhbHVlOiBbTnVtYmVyLCBTdHJpbmddXHJcbiAgfVxyXG59XHJcbiJdfQ==