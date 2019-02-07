// Components
import { VExpandTransition } from '../transitions';
import { VIcon } from '../VIcon';
import VTreeviewNode from './VTreeviewNode';
// Mixins
import { inject as RegistrableInject } from '../../mixins/registrable';
// Utils
import mixins from '../../util/mixins';
import { getObjectValueByPath } from '../../util/helpers';
export const VTreeviewNodeProps = {
    activatable: Boolean,
    activeClass: {
        type: String,
        default: 'v-treeview-node--active'
    },
    selectable: Boolean,
    selectedColor: {
        type: String,
        default: 'accent'
    },
    indeterminateIcon: {
        type: String,
        default: '$vuetify.icons.checkboxIndeterminate'
    },
    onIcon: {
        type: String,
        default: '$vuetify.icons.checkboxOn'
    },
    offIcon: {
        type: String,
        default: '$vuetify.icons.checkboxOff'
    },
    expandIcon: {
        type: String,
        default: '$vuetify.icons.subgroup'
    },
    loadingIcon: {
        type: String,
        default: '$vuetify.icons.loading'
    },
    itemKey: {
        type: String,
        default: 'id'
    },
    itemText: {
        type: String,
        default: 'name'
    },
    itemChildren: {
        type: String,
        default: 'children'
    },
    loadChildren: Function,
    openOnClick: Boolean,
    transition: Boolean
};
export default mixins(RegistrableInject('treeview')
/* @vue/component */
).extend({
    name: 'v-treeview-node',
    inject: {
        treeview: {
            default: null
        }
    },
    props: {
        item: {
            type: Object,
            default: () => null
        },
        ...VTreeviewNodeProps
    },
    data: () => ({
        isOpen: false,
        isSelected: false,
        isIndeterminate: false,
        isActive: false,
        isLoading: false,
        hasLoaded: false
    }),
    computed: {
        key() {
            return getObjectValueByPath(this.item, this.itemKey);
        },
        children() {
            return getObjectValueByPath(this.item, this.itemChildren);
        },
        text() {
            return getObjectValueByPath(this.item, this.itemText);
        },
        scopedProps() {
            return {
                item: this.item,
                leaf: !this.children,
                selected: this.isSelected,
                indeterminate: this.isIndeterminate,
                active: this.isActive,
                open: this.isOpen
            };
        },
        computedIcon() {
            if (this.isIndeterminate)
                return this.indeterminateIcon;
            else if (this.isSelected)
                return this.onIcon;
            else
                return this.offIcon;
        },
        hasChildren() {
            return !!this.children && (!!this.children.length || !!this.loadChildren);
        }
    },
    created() {
        this.treeview.register(this);
    },
    beforeDestroy() {
        this.treeview.unregister(this);
    },
    methods: {
        checkChildren() {
            return new Promise(resolve => {
                // TODO: Potential issue with always trying
                // to load children if response is empty?
                if (!this.children || this.children.length || !this.loadChildren || this.hasLoaded)
                    return resolve();
                this.isLoading = true;
                resolve(this.loadChildren(this.item));
            }).then(() => {
                this.isLoading = false;
                this.hasLoaded = true;
            });
        },
        open() {
            this.isOpen = !this.isOpen;
            this.treeview.updateOpen(this.key, this.isOpen);
            this.treeview.emitOpen();
        },
        genLabel() {
            const children = [];
            if (this.$scopedSlots.label)
                children.push(this.$scopedSlots.label(this.scopedProps));
            else
                children.push(this.text);
            return this.$createElement('div', {
                slot: 'label',
                staticClass: 'v-treeview-node__label'
            }, children);
        },
        genContent() {
            const children = [
                this.$scopedSlots.prepend && this.$scopedSlots.prepend(this.scopedProps),
                this.genLabel(),
                this.$scopedSlots.append && this.$scopedSlots.append(this.scopedProps)
            ];
            return this.$createElement('div', {
                staticClass: 'v-treeview-node__content'
            }, children);
        },
        genToggle() {
            return this.$createElement(VIcon, {
                staticClass: 'v-treeview-node__toggle',
                class: {
                    'v-treeview-node__toggle--open': this.isOpen,
                    'v-treeview-node__toggle--loading': this.isLoading
                },
                slot: 'prepend',
                on: {
                    click: (e) => {
                        e.stopPropagation();
                        if (this.isLoading)
                            return;
                        this.checkChildren().then(() => this.open());
                    }
                }
            }, [this.isLoading ? this.loadingIcon : this.expandIcon]);
        },
        genCheckbox() {
            return this.$createElement(VIcon, {
                staticClass: 'v-treeview-node__checkbox',
                props: {
                    color: this.isSelected ? this.selectedColor : undefined
                },
                on: {
                    click: (e) => {
                        e.stopPropagation();
                        if (this.isLoading)
                            return;
                        this.checkChildren().then(() => {
                            // We nextTick here so that items watch in VTreeview has a chance to run first
                            this.$nextTick(() => {
                                this.isSelected = !this.isSelected;
                                this.isIndeterminate = false;
                                this.treeview.updateSelected(this.key, this.isSelected);
                                this.treeview.emitSelected();
                            });
                        });
                    }
                }
            }, [this.computedIcon]);
        },
        genNode() {
            const children = [this.genContent()];
            if (this.selectable)
                children.unshift(this.genCheckbox());
            if (this.hasChildren)
                children.unshift(this.genToggle());
            return this.$createElement('div', {
                staticClass: 'v-treeview-node__root',
                class: {
                    [this.activeClass]: this.isActive
                },
                on: {
                    click: () => {
                        if (this.openOnClick && this.children) {
                            this.open();
                        }
                        else if (this.activatable) {
                            this.isActive = !this.isActive;
                            this.treeview.updateActive(this.key, this.isActive);
                            this.treeview.emitActive();
                        }
                    }
                }
            }, children);
        },
        genChild(item) {
            return this.$createElement(VTreeviewNode, {
                key: getObjectValueByPath(item, this.itemKey),
                props: {
                    activatable: this.activatable,
                    activeClass: this.activeClass,
                    item,
                    selectable: this.selectable,
                    selectedColor: this.selectedColor,
                    expandIcon: this.expandIcon,
                    indeterminateIcon: this.indeterminateIcon,
                    offIcon: this.offIcon,
                    onIcon: this.onIcon,
                    loadingIcon: this.loadingIcon,
                    itemKey: this.itemKey,
                    itemText: this.itemText,
                    itemChildren: this.itemChildren,
                    loadChildren: this.loadChildren,
                    transition: this.transition,
                    openOnClick: this.openOnClick
                },
                scopedSlots: this.$scopedSlots
            });
        },
        genChildrenWrapper() {
            if (!this.isOpen || !this.children)
                return null;
            const children = [this.children.map(this.genChild)];
            return this.$createElement('div', {
                staticClass: 'v-treeview-node__children'
            }, children);
        },
        genTransition() {
            return this.$createElement(VExpandTransition, [this.genChildrenWrapper()]);
        }
    },
    render(h) {
        const children = [this.genNode()];
        if (this.transition)
            children.push(this.genTransition());
        else
            children.push(this.genChildrenWrapper());
        return h('div', {
            staticClass: 'v-treeview-node',
            class: {
                'v-treeview-node--leaf': !this.hasChildren,
                'v-treeview-node--click': this.openOnClick,
                'v-treeview-node--selected': this.isSelected,
                'v-treeview-node--excluded': this.treeview.isExcluded(this.key)
            }
        }, children);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlRyZWV2aWV3Tm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZUcmVldmlldy9WVHJlZXZpZXdOb2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGFBQWE7QUFDYixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQTtBQUNsRCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sVUFBVSxDQUFBO0FBRWhDLE9BQU8sYUFBYSxNQUFNLGlCQUFpQixDQUFBO0FBRTNDLFNBQVM7QUFDVCxPQUFPLEVBQUUsTUFBTSxJQUFJLGlCQUFpQixFQUFFLE1BQU0sMEJBQTBCLENBQUE7QUFFdEUsUUFBUTtBQUNSLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBQ3RDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBWXpELE1BQU0sQ0FBQyxNQUFNLGtCQUFrQixHQUFHO0lBQ2hDLFdBQVcsRUFBRSxPQUFPO0lBQ3BCLFdBQVcsRUFBRTtRQUNYLElBQUksRUFBRSxNQUFNO1FBQ1osT0FBTyxFQUFFLHlCQUF5QjtLQUNuQztJQUNELFVBQVUsRUFBRSxPQUFPO0lBQ25CLGFBQWEsRUFBRTtRQUNiLElBQUksRUFBRSxNQUFNO1FBQ1osT0FBTyxFQUFFLFFBQVE7S0FDbEI7SUFDRCxpQkFBaUIsRUFBRTtRQUNqQixJQUFJLEVBQUUsTUFBTTtRQUNaLE9BQU8sRUFBRSxzQ0FBc0M7S0FDaEQ7SUFDRCxNQUFNLEVBQUU7UUFDTixJQUFJLEVBQUUsTUFBTTtRQUNaLE9BQU8sRUFBRSwyQkFBMkI7S0FDckM7SUFDRCxPQUFPLEVBQUU7UUFDUCxJQUFJLEVBQUUsTUFBTTtRQUNaLE9BQU8sRUFBRSw0QkFBNEI7S0FDdEM7SUFDRCxVQUFVLEVBQUU7UUFDVixJQUFJLEVBQUUsTUFBTTtRQUNaLE9BQU8sRUFBRSx5QkFBeUI7S0FDbkM7SUFDRCxXQUFXLEVBQUU7UUFDWCxJ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QUFDLGFBQWEsRUFBRSxDQUFDLENBQUE7O1lBQ25ELFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQTtRQUU3QyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUU7WUFDZCxXQUFXLEVBQUUsaUJBQWlCO1lBQzlCLEtBQUssRUFBRTtnQkFDTCx1QkFBdUIsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXO2dCQUMxQyx3QkFBd0IsRUFBRSxJQUFJLENBQUMsV0FBVztnQkFDMUMsMkJBQTJCLEVBQUUsSUFBSSxDQUFDLFVBQVU7Z0JBQzVDLDJCQUEyQixFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7YUFDaEU7U0FDRixFQUFFLFFBQVEsQ0FBQyxDQUFBO0lBQ2QsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvbXBvbmVudHNcclxuaW1wb3J0IHsgVkV4cGFuZFRyYW5zaXRpb24gfSBmcm9tICcuLi90cmFuc2l0aW9ucydcclxuaW1wb3J0IHsgVkljb24gfSBmcm9tICcuLi9WSWNvbidcclxuaW1wb3J0IFZUcmVldmlldyBmcm9tICcuL1ZUcmVldmlldydcclxuaW1wb3J0IFZUcmVldmlld05vZGUgZnJvbSAnLi9WVHJlZXZpZXdOb2RlJ1xyXG5cclxuLy8gTWl4aW5zXHJcbmltcG9ydCB7IGluamVjdCBhcyBSZWdpc3RyYWJsZUluamVjdCB9IGZyb20gJy4uLy4uL21peGlucy9yZWdpc3RyYWJsZSdcclxuXHJcbi8vIFV0aWxzXHJcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXHJcbmltcG9ydCB7IGdldE9iamVjdFZhbHVlQnlQYXRoIH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xyXG5pbXBvcnQgeyBQcm9wVmFsaWRhdG9yIH0gZnJvbSAndnVlL3R5cGVzL29wdGlvbnMnXHJcblxyXG4vLyBUeXBlc1xyXG5pbXBvcnQgVnVlLCB7IFZOb2RlIH0gZnJvbSAndnVlJ1xyXG5cclxudHlwZSBWVHJlZVZpZXdJbnN0YW5jZSA9IEluc3RhbmNlVHlwZTx0eXBlb2YgVlRyZWV2aWV3PlxyXG5cclxuaW50ZXJmYWNlIG9wdGlvbnMgZXh0ZW5kcyBWdWUge1xyXG4gIHRyZWV2aWV3OiBWVHJlZVZpZXdJbnN0YW5jZVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgVlRyZWV2aWV3Tm9kZVByb3BzID0ge1xyXG4gIGFjdGl2YXRhYmxlOiBCb29sZWFuLFxyXG4gIGFjdGl2ZUNsYXNzOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAndi10cmVldmlldy1ub2RlLS1hY3RpdmUnXHJcbiAgfSxcclxuICBzZWxlY3RhYmxlOiBCb29sZWFuLFxyXG4gIHNlbGVjdGVkQ29sb3I6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICdhY2NlbnQnXHJcbiAgfSxcclxuICBpbmRldGVybWluYXRlSWNvbjoge1xyXG4gICAgdHlwZTogU3RyaW5nLFxyXG4gICAgZGVmYXVsdDogJyR2dWV0aWZ5Lmljb25zLmNoZWNrYm94SW5kZXRlcm1pbmF0ZSdcclxuICB9LFxyXG4gIG9uSWNvbjoge1xyXG4gICAgdHlwZTogU3RyaW5nLFxyXG4gICAgZGVmYXVsdDogJyR2dWV0aWZ5Lmljb25zLmNoZWNrYm94T24nXHJcbiAgfSxcclxuICBvZmZJY29uOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnJHZ1ZXRpZnkuaWNvbnMuY2hlY2tib3hPZmYnXHJcbiAgfSxcclxuICBleHBhbmRJY29uOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnJHZ1ZXRpZnkuaWNvbnMuc3ViZ3JvdXAnXHJcbiAgfSxcclxuICBsb2FkaW5nSWNvbjoge1xyXG4gICAgdHlwZTogU3RyaW5nLFxyXG4gICAgZGVmYXVsdDogJyR2dWV0aWZ5Lmljb25zLmxvYWRpbmcnXHJcbiAgfSxcclxuICBpdGVtS2V5OiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnaWQnXHJcbiAgfSxcclxuICBpdGVtVGV4dDoge1xyXG4gICAgdHlwZTogU3RyaW5nLFxyXG4gICAgZGVmYXVsdDogJ25hbWUnXHJcbiAgfSxcclxuICBpdGVtQ2hpbGRyZW46IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICdjaGlsZHJlbidcclxuICB9LFxyXG4gIGxvYWRDaGlsZHJlbjogRnVuY3Rpb24gYXMgUHJvcFZhbGlkYXRvcjwoaXRlbTogYW55KSA9PiBQcm9taXNlPHZvaWQ+PixcclxuICBvcGVuT25DbGljazogQm9vbGVhbixcclxuICB0cmFuc2l0aW9uOiBCb29sZWFuXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1peGluczxvcHRpb25zPihcclxuICBSZWdpc3RyYWJsZUluamVjdCgndHJlZXZpZXcnKVxyXG4gIC8qIEB2dWUvY29tcG9uZW50ICovXHJcbikuZXh0ZW5kKHtcclxuICBuYW1lOiAndi10cmVldmlldy1ub2RlJyxcclxuXHJcbiAgaW5qZWN0OiB7XHJcbiAgICB0cmVldmlldzoge1xyXG4gICAgICBkZWZhdWx0OiBudWxsXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIGl0ZW06IHtcclxuICAgICAgdHlwZTogT2JqZWN0LFxyXG4gICAgICBkZWZhdWx0OiAoKSA9PiBudWxsXHJcbiAgICB9LFxyXG4gICAgLi4uVlRyZWV2aWV3Tm9kZVByb3BzXHJcbiAgfSxcclxuXHJcbiAgZGF0YTogKCkgPT4gKHtcclxuICAgIGlzT3BlbjogZmFsc2UsIC8vIE5vZGUgaXMgb3Blbi9leHBhbmRlZFxyXG4gICAgaXNTZWxlY3RlZDogZmFsc2UsIC8vIE5vZGUgaXMgc2VsZWN0ZWQgKGNoZWNrYm94KVxyXG4gICAgaXNJbmRldGVybWluYXRlOiBmYWxzZSwgLy8gTm9kZSBoYXMgYXQgbGVhc3Qgb25lIHNlbGVjdGVkIGNoaWxkXHJcbiAgICBpc0FjdGl2ZTogZmFsc2UsIC8vIE5vZGUgaXMgc2VsZWN0ZWQgKHJvdylcclxuICAgIGlzTG9hZGluZzogZmFsc2UsXHJcbiAgICBoYXNMb2FkZWQ6IGZhbHNlXHJcbiAgfSksXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICBrZXkgKCk6IHN0cmluZyB7XHJcbiAgICAgIHJldHVybiBnZXRPYmplY3RWYWx1ZUJ5UGF0aCh0aGlzLml0ZW0sIHRoaXMuaXRlbUtleSlcclxuICAgIH0sXHJcbiAgICBjaGlsZHJlbiAoKTogYW55W10gfCBudWxsIHtcclxuICAgICAgcmV0dXJuIGdldE9iamVjdFZhbHVlQnlQYXRoKHRoaXMuaXRlbSwgdGhpcy5pdGVtQ2hpbGRyZW4pXHJcbiAgICB9LFxyXG4gICAgdGV4dCAoKTogc3RyaW5nIHtcclxuICAgICAgcmV0dXJuIGdldE9iamVjdFZhbHVlQnlQYXRoKHRoaXMuaXRlbSwgdGhpcy5pdGVtVGV4dClcclxuICAgIH0sXHJcbiAgICBzY29wZWRQcm9wcyAoKTogb2JqZWN0IHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBpdGVtOiB0aGlzLml0ZW0sXHJcbiAgICAgICAgbGVhZjogIXRoaXMuY2hpbGRyZW4sXHJcbiAgICAgICAgc2VsZWN0ZWQ6IHRoaXMuaXNTZWxlY3RlZCxcclxuICAgICAgICBpbmRldGVybWluYXRlOiB0aGlzLmlzSW5kZXRlcm1pbmF0ZSxcclxuICAgICAgICBhY3RpdmU6IHRoaXMuaXNBY3RpdmUsXHJcbiAgICAgICAgb3BlbjogdGhpcy5pc09wZW5cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGNvbXB1dGVkSWNvbiAoKTogc3RyaW5nIHtcclxuICAgICAgaWYgKHRoaXMuaXNJbmRldGVybWluYXRlKSByZXR1cm4gdGhpcy5pbmRldGVybWluYXRlSWNvblxyXG4gICAgICBlbHNlIGlmICh0aGlzLmlzU2VsZWN0ZWQpIHJldHVybiB0aGlzLm9uSWNvblxyXG4gICAgICBlbHNlIHJldHVybiB0aGlzLm9mZkljb25cclxuICAgIH0sXHJcbiAgICBoYXNDaGlsZHJlbiAoKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiAhIXRoaXMuY2hpbGRyZW4gJiYgKCEhdGhpcy5jaGlsZHJlbi5sZW5ndGggfHwgISF0aGlzLmxvYWRDaGlsZHJlbilcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBjcmVhdGVkICgpIHtcclxuICAgIHRoaXMudHJlZXZpZXcucmVnaXN0ZXIodGhpcylcclxuICB9LFxyXG5cclxuICBiZWZvcmVEZXN0cm95ICgpIHtcclxuICAgIHRoaXMudHJlZXZpZXcudW5yZWdpc3Rlcih0aGlzKVxyXG4gIH0sXHJcblxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGNoZWNrQ2hpbGRyZW4gKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4ocmVzb2x2ZSA9PiB7XHJcbiAgICAgICAgLy8gVE9ETzogUG90ZW50aWFsIGlzc3VlIHdpdGggYWx3YXlzIHRyeWluZ1xyXG4gICAgICAgIC8vIHRvIGxvYWQgY2hpbGRyZW4gaWYgcmVzcG9uc2UgaXMgZW1wdHk/XHJcbiAgICAgICAgaWYgKCF0aGlzLmNoaWxkcmVuIHx8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoIHx8ICF0aGlzLmxvYWRDaGlsZHJlbiB8fCB0aGlzLmhhc0xvYWRlZCkgcmV0dXJuIHJlc29sdmUoKVxyXG5cclxuICAgICAgICB0aGlzLmlzTG9hZGluZyA9IHRydWVcclxuICAgICAgICByZXNvbHZlKHRoaXMubG9hZENoaWxkcmVuKHRoaXMuaXRlbSkpXHJcbiAgICAgIH0pLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2VcclxuICAgICAgICB0aGlzLmhhc0xvYWRlZCA9IHRydWVcclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBvcGVuICgpIHtcclxuICAgICAgdGhpcy5pc09wZW4gPSAhdGhpcy5pc09wZW5cclxuICAgICAgdGhpcy50cmVldmlldy51cGRhdGVPcGVuKHRoaXMua2V5LCB0aGlzLmlzT3BlbilcclxuICAgICAgdGhpcy50cmVldmlldy5lbWl0T3BlbigpXHJcbiAgICB9LFxyXG4gICAgZ2VuTGFiZWwgKCkge1xyXG4gICAgICBjb25zdCBjaGlsZHJlbiA9IFtdXHJcblxyXG4gICAgICBpZiAodGhpcy4kc2NvcGVkU2xvdHMubGFiZWwpIGNoaWxkcmVuLnB1c2godGhpcy4kc2NvcGVkU2xvdHMubGFiZWwodGhpcy5zY29wZWRQcm9wcykpXHJcbiAgICAgIGVsc2UgY2hpbGRyZW4ucHVzaCh0aGlzLnRleHQpXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xyXG4gICAgICAgIHNsb3Q6ICdsYWJlbCcsXHJcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LXRyZWV2aWV3LW5vZGVfX2xhYmVsJ1xyXG4gICAgICB9LCBjaGlsZHJlbilcclxuICAgIH0sXHJcbiAgICBnZW5Db250ZW50ICgpIHtcclxuICAgICAgY29uc3QgY2hpbGRyZW4gPSBbXHJcbiAgICAgICAgdGhpcy4kc2NvcGVkU2xvdHMucHJlcGVuZCAmJiB0aGlzLiRzY29wZWRTbG90cy5wcmVwZW5kKHRoaXMuc2NvcGVkUHJvcHMpLFxyXG4gICAgICAgIHRoaXMuZ2VuTGFiZWwoKSxcclxuICAgICAgICB0aGlzLiRzY29wZWRTbG90cy5hcHBlbmQgJiYgdGhpcy4kc2NvcGVkU2xvdHMuYXBwZW5kKHRoaXMuc2NvcGVkUHJvcHMpXHJcbiAgICAgIF1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XHJcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LXRyZWV2aWV3LW5vZGVfX2NvbnRlbnQnXHJcbiAgICAgIH0sIGNoaWxkcmVuKVxyXG4gICAgfSxcclxuICAgIGdlblRvZ2dsZSAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZJY29uLCB7XHJcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LXRyZWV2aWV3LW5vZGVfX3RvZ2dsZScsXHJcbiAgICAgICAgY2xhc3M6IHtcclxuICAgICAgICAgICd2LXRyZWV2aWV3LW5vZGVfX3RvZ2dsZS0tb3Blbic6IHRoaXMuaXNPcGVuLFxyXG4gICAgICAgICAgJ3YtdHJlZXZpZXctbm9kZV9fdG9nZ2xlLS1sb2FkaW5nJzogdGhpcy5pc0xvYWRpbmdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNsb3Q6ICdwcmVwZW5kJyxcclxuICAgICAgICBvbjoge1xyXG4gICAgICAgICAgY2xpY2s6IChlOiBNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzTG9hZGluZykgcmV0dXJuXHJcblxyXG4gICAgICAgICAgICB0aGlzLmNoZWNrQ2hpbGRyZW4oKS50aGVuKCgpID0+IHRoaXMub3BlbigpKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSwgW3RoaXMuaXNMb2FkaW5nID8gdGhpcy5sb2FkaW5nSWNvbiA6IHRoaXMuZXhwYW5kSWNvbl0pXHJcbiAgICB9LFxyXG4gICAgZ2VuQ2hlY2tib3ggKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudChWSWNvbiwge1xyXG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi10cmVldmlldy1ub2RlX19jaGVja2JveCcsXHJcbiAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgIGNvbG9yOiB0aGlzLmlzU2VsZWN0ZWQgPyB0aGlzLnNlbGVjdGVkQ29sb3IgOiB1bmRlZmluZWRcclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uOiB7XHJcbiAgICAgICAgICBjbGljazogKGU6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNMb2FkaW5nKSByZXR1cm5cclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2hlY2tDaGlsZHJlbigpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgIC8vIFdlIG5leHRUaWNrIGhlcmUgc28gdGhhdCBpdGVtcyB3YXRjaCBpbiBWVHJlZXZpZXcgaGFzIGEgY2hhbmNlIHRvIHJ1biBmaXJzdFxyXG4gICAgICAgICAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNTZWxlY3RlZCA9ICF0aGlzLmlzU2VsZWN0ZWRcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNJbmRldGVybWluYXRlID0gZmFsc2VcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRyZWV2aWV3LnVwZGF0ZVNlbGVjdGVkKHRoaXMua2V5LCB0aGlzLmlzU2VsZWN0ZWQpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRyZWV2aWV3LmVtaXRTZWxlY3RlZCgpXHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sIFt0aGlzLmNvbXB1dGVkSWNvbl0pXHJcbiAgICB9LFxyXG4gICAgZ2VuTm9kZSAoKTogVk5vZGUge1xyXG4gICAgICBjb25zdCBjaGlsZHJlbiA9IFt0aGlzLmdlbkNvbnRlbnQoKV1cclxuXHJcbiAgICAgIGlmICh0aGlzLnNlbGVjdGFibGUpIGNoaWxkcmVuLnVuc2hpZnQodGhpcy5nZW5DaGVja2JveCgpKVxyXG4gICAgICBpZiAodGhpcy5oYXNDaGlsZHJlbikgY2hpbGRyZW4udW5zaGlmdCh0aGlzLmdlblRvZ2dsZSgpKVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICBzdGF0aWNDbGFzczogJ3YtdHJlZXZpZXctbm9kZV9fcm9vdCcsXHJcbiAgICAgICAgY2xhc3M6IHtcclxuICAgICAgICAgIFt0aGlzLmFjdGl2ZUNsYXNzXTogdGhpcy5pc0FjdGl2ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb246IHtcclxuICAgICAgICAgIGNsaWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wZW5PbkNsaWNrICYmIHRoaXMuY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgICB0aGlzLm9wZW4oKVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYWN0aXZhdGFibGUpIHtcclxuICAgICAgICAgICAgICB0aGlzLmlzQWN0aXZlID0gIXRoaXMuaXNBY3RpdmVcclxuICAgICAgICAgICAgICB0aGlzLnRyZWV2aWV3LnVwZGF0ZUFjdGl2ZSh0aGlzLmtleSwgdGhpcy5pc0FjdGl2ZSlcclxuICAgICAgICAgICAgICB0aGlzLnRyZWV2aWV3LmVtaXRBY3RpdmUoKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCBjaGlsZHJlbilcclxuICAgIH0sXHJcbiAgICBnZW5DaGlsZCAoaXRlbTogYW55KTogVk5vZGUge1xyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudChWVHJlZXZpZXdOb2RlLCB7XHJcbiAgICAgICAga2V5OiBnZXRPYmplY3RWYWx1ZUJ5UGF0aChpdGVtLCB0aGlzLml0ZW1LZXkpLFxyXG4gICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICBhY3RpdmF0YWJsZTogdGhpcy5hY3RpdmF0YWJsZSxcclxuICAgICAgICAgIGFjdGl2ZUNsYXNzOiB0aGlzLmFjdGl2ZUNsYXNzLFxyXG4gICAgICAgICAgaXRlbSxcclxuICAgICAgICAgIHNlbGVjdGFibGU6IHRoaXMuc2VsZWN0YWJsZSxcclxuICAgICAgICAgIHNlbGVjdGVkQ29sb3I6IHRoaXMuc2VsZWN0ZWRDb2xvcixcclxuICAgICAgICAgIGV4cGFuZEljb246IHRoaXMuZXhwYW5kSWNvbixcclxuICAgICAgICAgIGluZGV0ZXJtaW5hdGVJY29uOiB0aGlzLmluZGV0ZXJtaW5hdGVJY29uLFxyXG4gICAgICAgICAgb2ZmSWNvbjogdGhpcy5vZmZJY29uLFxyXG4gICAgICAgICAgb25JY29uOiB0aGlzLm9uSWNvbixcclxuICAgICAgICAgIGxvYWRpbmdJY29uOiB0aGlzLmxvYWRpbmdJY29uLFxyXG4gICAgICAgICAgaXRlbUtleTogdGhpcy5pdGVtS2V5LFxyXG4gICAgICAgICAgaXRlbVRleHQ6IHRoaXMuaXRlbVRleHQsXHJcbiAgICAgICAgICBpdGVtQ2hpbGRyZW46IHRoaXMuaXRlbUNoaWxkcmVuLFxyXG4gICAgICAgICAgbG9hZENoaWxkcmVuOiB0aGlzLmxvYWRDaGlsZHJlbixcclxuICAgICAgICAgIHRyYW5zaXRpb246IHRoaXMudHJhbnNpdGlvbixcclxuICAgICAgICAgIG9wZW5PbkNsaWNrOiB0aGlzLm9wZW5PbkNsaWNrXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzY29wZWRTbG90czogdGhpcy4kc2NvcGVkU2xvdHNcclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBnZW5DaGlsZHJlbldyYXBwZXIgKCk6IGFueSB7XHJcbiAgICAgIGlmICghdGhpcy5pc09wZW4gfHwgIXRoaXMuY2hpbGRyZW4pIHJldHVybiBudWxsXHJcblxyXG4gICAgICBjb25zdCBjaGlsZHJlbiA9IFt0aGlzLmNoaWxkcmVuLm1hcCh0aGlzLmdlbkNoaWxkKV1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XHJcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LXRyZWV2aWV3LW5vZGVfX2NoaWxkcmVuJ1xyXG4gICAgICB9LCBjaGlsZHJlbilcclxuICAgIH0sXHJcbiAgICBnZW5UcmFuc2l0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkV4cGFuZFRyYW5zaXRpb24sIFt0aGlzLmdlbkNoaWxkcmVuV3JhcHBlcigpXSlcclxuICAgIH1cclxuICB9LFxyXG5cclxuICByZW5kZXIgKGgpOiBWTm9kZSB7XHJcbiAgICBjb25zdCBjaGlsZHJlbiA9IFt0aGlzLmdlbk5vZGUoKV1cclxuXHJcbiAgICBpZiAodGhpcy50cmFuc2l0aW9uKSBjaGlsZHJlbi5wdXNoKHRoaXMuZ2VuVHJhbnNpdGlvbigpKVxyXG4gICAgZWxzZSBjaGlsZHJlbi5wdXNoKHRoaXMuZ2VuQ2hpbGRyZW5XcmFwcGVyKCkpXHJcblxyXG4gICAgcmV0dXJuIGgoJ2RpdicsIHtcclxuICAgICAgc3RhdGljQ2xhc3M6ICd2LXRyZWV2aWV3LW5vZGUnLFxyXG4gICAgICBjbGFzczoge1xyXG4gICAgICAgICd2LXRyZWV2aWV3LW5vZGUtLWxlYWYnOiAhdGhpcy5oYXNDaGlsZHJlbixcclxuICAgICAgICAndi10cmVldmlldy1ub2RlLS1jbGljayc6IHRoaXMub3Blbk9uQ2xpY2ssXHJcbiAgICAgICAgJ3YtdHJlZXZpZXctbm9kZS0tc2VsZWN0ZWQnOiB0aGlzLmlzU2VsZWN0ZWQsXHJcbiAgICAgICAgJ3YtdHJlZXZpZXctbm9kZS0tZXhjbHVkZWQnOiB0aGlzLnRyZWV2aWV3LmlzRXhjbHVkZWQodGhpcy5rZXkpXHJcbiAgICAgIH1cclxuICAgIH0sIGNoaWxkcmVuKVxyXG4gIH1cclxufSlcclxuIl19