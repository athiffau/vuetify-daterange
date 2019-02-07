export default function Grid(name) {
    /* @vue/component */
    return {
        name: `v-${name}`,
        functional: true,
        props: {
            id: String,
            tag: {
                type: String,
                default: 'div'
            }
        },
        render: (h, { props, data, children }) => {
            data.staticClass = (`${name} ${data.staticClass || ''}`).trim();
            const { attrs } = data;
            if (attrs) {
                // reset attrs to extract utility clases like pa-3
                data.attrs = {};
                const classes = Object.keys(attrs).filter(key => {
                    // TODO: Remove once resolved
                    // https://github.com/vuejs/vue/issues/7841
                    if (key === 'slot')
                        return false;
                    const value = attrs[key];
                    // add back data attributes like data-test="foo" but do not
                    // add them as classes
                    if (key.startsWith('data-')) {
                        data.attrs[key] = value;
                        return false;
                    }
                    return value || typeof value === 'string';
                });
                if (classes.length)
                    data.staticClass += ` ${classes.join(' ')}`;
            }
            if (props.id) {
                data.domProps = data.domProps || {};
                data.domProps.id = props.id;
            }
            return h(props.tag, data, children);
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZHcmlkL2dyaWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxDQUFDLE9BQU8sVUFBVSxJQUFJLENBQUUsSUFBSTtJQUNoQyxvQkFBb0I7SUFDcEIsT0FBTztRQUNMLElBQUksRUFBRSxLQUFLLElBQUksRUFBRTtRQUVqQixVQUFVLEVBQUUsSUFBSTtRQUVoQixLQUFLLEVBQUU7WUFDTCxFQUFFLEVBQUUsTUFBTTtZQUNWLEdBQUcsRUFBRTtnQkFDSCxJQUFJLEVBQUUsTUFBTTtnQkFDWixPQUFPLEVBQUUsS0FBSzthQUNmO1NBQ0Y7UUFFRCxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUU7WUFDdkMsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtZQUUvRCxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsSUFBSSxDQUFBO1lBQ3RCLElBQUksS0FBSyxFQUFFO2dCQUNULGtEQUFrRDtnQkFDbEQsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUE7Z0JBQ2YsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQzlDLDZCQUE2QjtvQkFDN0IsMkNBQTJDO29CQUMzQyxJQUFJLEdBQUcsS0FBSyxNQUFNO3dCQUFFLE9BQU8sS0FBSyxDQUFBO29CQUVoQyxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7b0JBRXhCLDJEQUEyRDtvQkFDM0Qsc0JBQXNCO29CQUN0QixJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUU7d0JBQzNCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFBO3dCQUN2QixPQUFPLEtBQUssQ0FBQTtxQkFDYjtvQkFFRCxPQUFPLEtBQUssSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUE7Z0JBQzNDLENBQUMsQ0FBQyxDQUFBO2dCQUVGLElBQUksT0FBTyxDQUFDLE1BQU07b0JBQUUsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQTthQUNoRTtZQUVELElBQUksS0FBSyxDQUFDLEVBQUUsRUFBRTtnQkFDWixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFBO2dCQUNuQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFBO2FBQzVCO1lBRUQsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUE7UUFDckMsQ0FBQztLQUNGLENBQUE7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gR3JpZCAobmFtZSkge1xyXG4gIC8qIEB2dWUvY29tcG9uZW50ICovXHJcbiAgcmV0dXJuIHtcclxuICAgIG5hbWU6IGB2LSR7bmFtZX1gLFxyXG5cclxuICAgIGZ1bmN0aW9uYWw6IHRydWUsXHJcblxyXG4gICAgcHJvcHM6IHtcclxuICAgICAgaWQ6IFN0cmluZyxcclxuICAgICAgdGFnOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICAgIGRlZmF1bHQ6ICdkaXYnXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgcmVuZGVyOiAoaCwgeyBwcm9wcywgZGF0YSwgY2hpbGRyZW4gfSkgPT4ge1xyXG4gICAgICBkYXRhLnN0YXRpY0NsYXNzID0gKGAke25hbWV9ICR7ZGF0YS5zdGF0aWNDbGFzcyB8fCAnJ31gKS50cmltKClcclxuXHJcbiAgICAgIGNvbnN0IHsgYXR0cnMgfSA9IGRhdGFcclxuICAgICAgaWYgKGF0dHJzKSB7XHJcbiAgICAgICAgLy8gcmVzZXQgYXR0cnMgdG8gZXh0cmFjdCB1dGlsaXR5IGNsYXNlcyBsaWtlIHBhLTNcclxuICAgICAgICBkYXRhLmF0dHJzID0ge31cclxuICAgICAgICBjb25zdCBjbGFzc2VzID0gT2JqZWN0LmtleXMoYXR0cnMpLmZpbHRlcihrZXkgPT4ge1xyXG4gICAgICAgICAgLy8gVE9ETzogUmVtb3ZlIG9uY2UgcmVzb2x2ZWRcclxuICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS92dWVqcy92dWUvaXNzdWVzLzc4NDFcclxuICAgICAgICAgIGlmIChrZXkgPT09ICdzbG90JykgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgICAgICAgY29uc3QgdmFsdWUgPSBhdHRyc1trZXldXHJcblxyXG4gICAgICAgICAgLy8gYWRkIGJhY2sgZGF0YSBhdHRyaWJ1dGVzIGxpa2UgZGF0YS10ZXN0PVwiZm9vXCIgYnV0IGRvIG5vdFxyXG4gICAgICAgICAgLy8gYWRkIHRoZW0gYXMgY2xhc3Nlc1xyXG4gICAgICAgICAgaWYgKGtleS5zdGFydHNXaXRoKCdkYXRhLScpKSB7XHJcbiAgICAgICAgICAgIGRhdGEuYXR0cnNba2V5XSA9IHZhbHVlXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHJldHVybiB2YWx1ZSB8fCB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgaWYgKGNsYXNzZXMubGVuZ3RoKSBkYXRhLnN0YXRpY0NsYXNzICs9IGAgJHtjbGFzc2VzLmpvaW4oJyAnKX1gXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChwcm9wcy5pZCkge1xyXG4gICAgICAgIGRhdGEuZG9tUHJvcHMgPSBkYXRhLmRvbVByb3BzIHx8IHt9XHJcbiAgICAgICAgZGF0YS5kb21Qcm9wcy5pZCA9IHByb3BzLmlkXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBoKHByb3BzLnRhZywgZGF0YSwgY2hpbGRyZW4pXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==