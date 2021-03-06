// Styles
import '../../stylus/components/_counters.styl';
// Mixins
import Themeable, { functionalThemeClasses } from '../../mixins/themeable';
import mixins from '../../util/mixins';
/* @vue/component */
export default mixins(Themeable).extend({
    name: 'v-counter',
    functional: true,
    props: {
        value: {
            type: [Number, String],
            default: ''
        },
        max: [Number, String]
    },
    render(h, ctx) {
        const { props } = ctx;
        const max = parseInt(props.max, 10);
        const value = parseInt(props.value, 10);
        const content = max ? `${value} / ${max}` : props.value;
        const isGreater = max && (value > max);
        return h('div', {
            staticClass: 'v-counter',
            class: {
                'error--text': isGreater,
                ...functionalThemeClasses(ctx)
            }
        }, content);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkNvdW50ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WQ291bnRlci9WQ291bnRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyx3Q0FBd0MsQ0FBQTtBQUUvQyxTQUFTO0FBQ1QsT0FBTyxTQUFTLEVBQUUsRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHdCQUF3QixDQUFBO0FBSTFFLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBRXRDLG9CQUFvQjtBQUNwQixlQUFlLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDdEMsSUFBSSxFQUFFLFdBQVc7SUFFakIsVUFBVSxFQUFFLElBQUk7SUFFaEIsS0FBSyxFQUFFO1FBQ0wsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUN0QixPQUFPLEVBQUUsRUFBRTtTQUNaO1FBQ0QsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztLQUN0QjtJQUVELE1BQU0sQ0FBRSxDQUFDLEVBQUUsR0FBa0I7UUFDM0IsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEdBQUcsQ0FBQTtRQUNyQixNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUNuQyxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUN2QyxNQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFBO1FBQ3ZELE1BQU0sU0FBUyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQTtRQUV0QyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUU7WUFDZCxXQUFXLEVBQUUsV0FBVztZQUN4QixLQUFLLEVBQUU7Z0JBQ0wsYUFBYSxFQUFFLFNBQVM7Z0JBQ3hCLEdBQUcsc0JBQXNCLENBQUMsR0FBRyxDQUFDO2FBQy9CO1NBQ0YsRUFBRSxPQUFPLENBQUMsQ0FBQTtJQUNiLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcclxuaW1wb3J0ICcuLi8uLi9zdHlsdXMvY29tcG9uZW50cy9fY291bnRlcnMuc3R5bCdcclxuXHJcbi8vIE1peGluc1xyXG5pbXBvcnQgVGhlbWVhYmxlLCB7IGZ1bmN0aW9uYWxUaGVtZUNsYXNzZXMgfSBmcm9tICcuLi8uLi9taXhpbnMvdGhlbWVhYmxlJ1xyXG5cclxuLy8gVHlwZXNcclxuaW1wb3J0IHsgVk5vZGUsIFJlbmRlckNvbnRleHQgfSBmcm9tICd2dWUnXHJcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXHJcblxyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG5leHBvcnQgZGVmYXVsdCBtaXhpbnMoVGhlbWVhYmxlKS5leHRlbmQoe1xyXG4gIG5hbWU6ICd2LWNvdW50ZXInLFxyXG5cclxuICBmdW5jdGlvbmFsOiB0cnVlLFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgdmFsdWU6IHtcclxuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcclxuICAgICAgZGVmYXVsdDogJydcclxuICAgIH0sXHJcbiAgICBtYXg6IFtOdW1iZXIsIFN0cmluZ11cclxuICB9LFxyXG5cclxuICByZW5kZXIgKGgsIGN0eDogUmVuZGVyQ29udGV4dCk6IFZOb2RlIHtcclxuICAgIGNvbnN0IHsgcHJvcHMgfSA9IGN0eFxyXG4gICAgY29uc3QgbWF4ID0gcGFyc2VJbnQocHJvcHMubWF4LCAxMClcclxuICAgIGNvbnN0IHZhbHVlID0gcGFyc2VJbnQocHJvcHMudmFsdWUsIDEwKVxyXG4gICAgY29uc3QgY29udGVudCA9IG1heCA/IGAke3ZhbHVlfSAvICR7bWF4fWAgOiBwcm9wcy52YWx1ZVxyXG4gICAgY29uc3QgaXNHcmVhdGVyID0gbWF4ICYmICh2YWx1ZSA+IG1heClcclxuXHJcbiAgICByZXR1cm4gaCgnZGl2Jywge1xyXG4gICAgICBzdGF0aWNDbGFzczogJ3YtY291bnRlcicsXHJcbiAgICAgIGNsYXNzOiB7XHJcbiAgICAgICAgJ2Vycm9yLS10ZXh0JzogaXNHcmVhdGVyLFxyXG4gICAgICAgIC4uLmZ1bmN0aW9uYWxUaGVtZUNsYXNzZXMoY3R4KVxyXG4gICAgICB9XHJcbiAgICB9LCBjb250ZW50KVxyXG4gIH1cclxufSlcclxuIl19