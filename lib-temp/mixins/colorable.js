import Vue from 'vue';
function isCssColor(color) {
    return !!color && !!color.match(/^(#|(rgb|hsl)a?\()/);
}
export default Vue.extend({
    name: 'colorable',
    props: {
        color: String
    },
    methods: {
        setBackgroundColor(color, data = {}) {
            if (isCssColor(color)) {
                data.style = {
                    ...data.style,
                    'background-color': `${color}`,
                    'border-color': `${color}`
                };
            }
            else if (color) {
                data.class = {
                    ...data.class,
                    [color]: true
                };
            }
            return data;
        },
        setTextColor(color, data = {}) {
            if (isCssColor(color)) {
                data.style = {
                    ...data.style,
                    'color': `${color}`,
                    'caret-color': `${color}`
                };
            }
            else if (color) {
                const [colorName, colorModifier] = color.toString().trim().split(' ', 2);
                data.class = {
                    ...data.class,
                    [colorName + '--text']: true
                };
                if (colorModifier) {
                    data.class['text--' + colorModifier] = true;
                }
            }
            return data;
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21peGlucy9jb2xvcmFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxHQUFHLE1BQU0sS0FBSyxDQUFBO0FBR3JCLFNBQVMsVUFBVSxDQUFFLEtBQXNCO0lBQ3pDLE9BQU8sQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBO0FBQ3ZELENBQUM7QUFFRCxlQUFlLEdBQUcsQ0FBQyxNQUFNLENBQUM7SUFDeEIsSUFBSSxFQUFFLFdBQVc7SUFFakIsS0FBSyxFQUFFO1FBQ0wsS0FBSyxFQUFFLE1BQU07S0FDZDtJQUVELE9BQU8sRUFBRTtRQUNQLGtCQUFrQixDQUFFLEtBQXNCLEVBQUUsT0FBa0IsRUFBRTtZQUM5RCxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDckIsSUFBSSxDQUFDLEtBQUssR0FBRztvQkFDWCxHQUFHLElBQUksQ0FBQyxLQUFLO29CQUNiLGtCQUFrQixFQUFFLEdBQUcsS0FBSyxFQUFFO29CQUM5QixjQUFjLEVBQUUsR0FBRyxLQUFLLEVBQUU7aUJBQzNCLENBQUE7YUFDRjtpQkFBTSxJQUFJLEtBQUssRUFBRTtnQkFDaEIsSUFBSSxDQUFDLEtBQUssR0FBRztvQkFDWCxHQUFHLElBQUksQ0FBQyxLQUFLO29CQUNiLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSTtpQkFDZCxDQUFBO2FBQ0Y7WUFFRCxPQUFPLElBQUksQ0FBQTtRQUNiLENBQUM7UUFFRCxZQUFZLENBQUUsS0FBc0IsRUFBRSxPQUFrQixFQUFFO1lBQ3hELElBQUksVUFBVSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHO29CQUNYLEdBQUcsSUFBSSxDQUFDLEtBQUs7b0JBQ2IsT0FBTyxFQUFFLEdBQUcsS0FBSyxFQUFFO29CQUNuQixhQUFhLEVBQUUsR0FBRyxLQUFLLEVBQUU7aUJBQzFCLENBQUE7YUFDRjtpQkFBTSxJQUFJLEtBQUssRUFBRTtnQkFDaEIsTUFBTSxDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUMsR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQTJCLENBQUE7Z0JBQ2xHLElBQUksQ0FBQyxLQUFLLEdBQUc7b0JBQ1gsR0FBRyxJQUFJLENBQUMsS0FBSztvQkFDYixDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsRUFBRSxJQUFJO2lCQUM3QixDQUFBO2dCQUNELElBQUksYUFBYSxFQUFFO29CQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxhQUFhLENBQUMsR0FBRyxJQUFJLENBQUE7aUJBQzVDO2FBQ0Y7WUFDRCxPQUFPLElBQUksQ0FBQTtRQUNiLENBQUM7S0FDRjtDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWdWUgZnJvbSAndnVlJ1xyXG5pbXBvcnQgeyBWTm9kZURhdGEgfSBmcm9tICd2dWUvdHlwZXMvdm5vZGUnXHJcblxyXG5mdW5jdGlvbiBpc0Nzc0NvbG9yIChjb2xvcj86IHN0cmluZyB8IGZhbHNlKTogYm9vbGVhbiB7XHJcbiAgcmV0dXJuICEhY29sb3IgJiYgISFjb2xvci5tYXRjaCgvXigjfChyZ2J8aHNsKWE/XFwoKS8pXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZ1ZS5leHRlbmQoe1xyXG4gIG5hbWU6ICdjb2xvcmFibGUnLFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgY29sb3I6IFN0cmluZ1xyXG4gIH0sXHJcblxyXG4gIG1ldGhvZHM6IHtcclxuICAgIHNldEJhY2tncm91bmRDb2xvciAoY29sb3I/OiBzdHJpbmcgfCBmYWxzZSwgZGF0YTogVk5vZGVEYXRhID0ge30pOiBWTm9kZURhdGEge1xyXG4gICAgICBpZiAoaXNDc3NDb2xvcihjb2xvcikpIHtcclxuICAgICAgICBkYXRhLnN0eWxlID0ge1xyXG4gICAgICAgICAgLi4uZGF0YS5zdHlsZSxcclxuICAgICAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogYCR7Y29sb3J9YCxcclxuICAgICAgICAgICdib3JkZXItY29sb3InOiBgJHtjb2xvcn1gXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKGNvbG9yKSB7XHJcbiAgICAgICAgZGF0YS5jbGFzcyA9IHtcclxuICAgICAgICAgIC4uLmRhdGEuY2xhc3MsXHJcbiAgICAgICAgICBbY29sb3JdOiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gZGF0YVxyXG4gICAgfSxcclxuXHJcbiAgICBzZXRUZXh0Q29sb3IgKGNvbG9yPzogc3RyaW5nIHwgZmFsc2UsIGRhdGE6IFZOb2RlRGF0YSA9IHt9KTogVk5vZGVEYXRhIHtcclxuICAgICAgaWYgKGlzQ3NzQ29sb3IoY29sb3IpKSB7XHJcbiAgICAgICAgZGF0YS5zdHlsZSA9IHtcclxuICAgICAgICAgIC4uLmRhdGEuc3R5bGUsXHJcbiAgICAgICAgICAnY29sb3InOiBgJHtjb2xvcn1gLFxyXG4gICAgICAgICAgJ2NhcmV0LWNvbG9yJzogYCR7Y29sb3J9YFxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmIChjb2xvcikge1xyXG4gICAgICAgIGNvbnN0IFtjb2xvck5hbWUsIGNvbG9yTW9kaWZpZXJdID0gY29sb3IudG9TdHJpbmcoKS50cmltKCkuc3BsaXQoJyAnLCAyKSBhcyAoc3RyaW5nIHwgdW5kZWZpbmVkKVtdXHJcbiAgICAgICAgZGF0YS5jbGFzcyA9IHtcclxuICAgICAgICAgIC4uLmRhdGEuY2xhc3MsXHJcbiAgICAgICAgICBbY29sb3JOYW1lICsgJy0tdGV4dCddOiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjb2xvck1vZGlmaWVyKSB7XHJcbiAgICAgICAgICBkYXRhLmNsYXNzWyd0ZXh0LS0nICsgY29sb3JNb2RpZmllcl0gPSB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBkYXRhXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iXX0=