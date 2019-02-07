// Maps internal Vuetify icon names to actual Material Design icon names.
const ICONS_MATERIAL = {
    'complete': 'check',
    'cancel': 'cancel',
    'close': 'close',
    'delete': 'cancel',
    'clear': 'clear',
    'success': 'check_circle',
    'info': 'info',
    'warning': 'priority_high',
    'error': 'warning',
    'prev': 'chevron_left',
    'next': 'chevron_right',
    'checkboxOn': 'check_box',
    'checkboxOff': 'check_box_outline_blank',
    'checkboxIndeterminate': 'indeterminate_check_box',
    'delimiter': 'fiber_manual_record',
    'sort': 'arrow_upward',
    'expand': 'keyboard_arrow_down',
    'menu': 'menu',
    'subgroup': 'arrow_drop_down',
    'dropdown': 'arrow_drop_down',
    'radioOn': 'radio_button_checked',
    'radioOff': 'radio_button_unchecked',
    'edit': 'edit',
    'ratingEmpty': 'star_border',
    'ratingFull': 'star',
    'ratingHalf': 'star_half',
    'loading': 'cached'
};
// Maps internal Vuetify icon names to actual icons from materialdesignicons.com
const ICONS_MDI = {
    'complete': 'mdi-check',
    'cancel': 'mdi-close-circle',
    'close': 'mdi-close',
    'delete': 'mdi-close-circle',
    'clear': 'mdi-close',
    'success': 'mdi-check-circle',
    'info': 'mdi-information',
    'warning': 'mdi-exclamation',
    'error': 'mdi-alert',
    'prev': 'mdi-chevron-left',
    'next': 'mdi-chevron-right',
    'checkboxOn': 'mdi-checkbox-marked',
    'checkboxOff': 'mdi-checkbox-blank-outline',
    'checkboxIndeterminate': 'mdi-minus-box',
    'delimiter': 'mdi-circle',
    'sort': 'mdi-arrow-up',
    'expand': 'mdi-chevron-down',
    'menu': 'mdi-menu',
    'subgroup': 'mdi-menu-down',
    'dropdown': 'mdi-menu-down',
    'radioOn': 'mdi-radiobox-marked',
    'radioOff': 'mdi-radiobox-blank',
    'edit': 'mdi-pencil',
    'ratingEmpty': 'mdi-star-outline',
    'ratingFull': 'mdi-star',
    'ratingHalf': 'mdi-star-half'
};
// Maps internal Vuetify icon names to actual Font-Awesome 4 icon names.
const ICONS_FONTAWESOME4 = {
    'complete': 'fa fa-check',
    'cancel': 'fa fa-times-circle',
    'close': 'fa fa-times',
    'delete': 'fa fa-times-circle',
    'clear': 'fa fa-times-circle',
    'success': 'fa fa-check-circle',
    'info': 'fa fa-info-circle',
    'warning': 'fa fa-exclamation',
    'error': 'fa fa-exclamation-triangle',
    'prev': 'fa fa-chevron-left',
    'next': 'fa fa-chevron-right',
    'checkboxOn': 'fa fa-check-square',
    'checkboxOff': 'fa fa-square-o',
    'checkboxIndeterminate': 'fa fa-minus-square',
    'delimiter': 'fa fa-circle',
    'sort': 'fa fa-sort-up',
    'expand': 'fa fa-chevron-down',
    'menu': 'fa fa-bars',
    'subgroup': 'fa fa-caret-down',
    'dropdown': 'fa fa-caret-down',
    'radioOn': 'fa fa-dot-circle',
    'radioOff': 'fa fa-circle-o',
    'edit': 'fa fa-pencil',
    'ratingEmpty': 'fa fa-star-o',
    'ratingFull': 'fa fa-star',
    'ratingHalf': 'fa fa-star-half-o'
};
// Maps internal Vuetify icon names to actual Font-Awesome 5+ icon names.
const ICONS_FONTAWESOME = {
    'complete': 'fas fa-check',
    'cancel': 'fas fa-times-circle',
    'close': 'fas fa-times',
    'delete': 'fas fa-times-circle',
    'clear': 'fas fa-times-circle',
    'success': 'fas fa-check-circle',
    'info': 'fas fa-info-circle',
    'warning': 'fas fa-exclamation',
    'error': 'fas fa-exclamation-triangle',
    'prev': 'fas fa-chevron-left',
    'next': 'fas fa-chevron-right',
    'checkboxOn': 'fas fa-check-square',
    'checkboxOff': 'far fa-square',
    'checkboxIndeterminate': 'fas fa-minus-square',
    'delimiter': 'fas fa-circle',
    'sort': 'fas fa-sort-up',
    'expand': 'fas fa-chevron-down',
    'menu': 'fas fa-bars',
    'subgroup': 'fas fa-caret-down',
    'dropdown': 'fas fa-caret-down',
    'radioOn': 'far fa-dot-circle',
    'radioOff': 'far fa-circle',
    'edit': 'fas fa-edit',
    'ratingEmpty': 'far fa-star',
    'ratingFull': 'fas fa-star',
    'ratingHalf': 'fas fa-star-half'
};
export function convertToComponentDeclarations(component, iconSet) {
    const result = {};
    for (const key in iconSet) {
        result[key] = {
            component,
            props: {
                icon: iconSet[key].split(' fa-')
            }
        };
    }
    return result;
}
const iconSets = {
    md: ICONS_MATERIAL,
    mdi: ICONS_MDI,
    fa: ICONS_FONTAWESOME,
    fa4: ICONS_FONTAWESOME4,
    faSvg: convertToComponentDeclarations('font-awesome-icon', ICONS_FONTAWESOME)
};
export default function icons(iconfont = 'md', icons = {}) {
    return Object.assign({}, iconSets[iconfont] || iconSets.md, icons);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WdWV0aWZ5L21peGlucy9pY29ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSx5RUFBeUU7QUFDekUsTUFBTSxjQUFjLEdBQWlCO0lBQ25DLFVBQVUsRUFBRSxPQUFPO0lBQ25CLFFBQVEsRUFBRSxRQUFRO0lBQ2xCLE9BQU8sRUFBRSxPQUFPO0lBQ2hCLFFBQVEsRUFBRSxRQUFRO0lBQ2xCLE9BQU8sRUFBRSxPQUFPO0lBQ2hCLFNBQVMsRUFBRSxjQUFjO0lBQ3pCLE1BQU0sRUFBRSxNQUFNO0lBQ2QsU0FBUyxFQUFFLGVBQWU7SUFDMUIsT0FBTyxFQUFFLFNBQVM7SUFDbEIsTUFBTSxFQUFFLGNBQWM7SUFDdEIsTUFBTSxFQUFFLGVBQWU7SUFDdkIsWUFBWSxFQUFFLFdBQVc7SUFDekIsYUFBYSxFQUFFLHlCQUF5QjtJQUN4Qyx1QkFBdUIsRUFBRSx5QkFBeUI7SUFDbEQsV0FBVyxFQUFFLHFCQUFxQjtJQUNsQyxNQUFNLEVBQUUsY0FBYztJQUN0QixRQUFRLEVBQUUscUJBQXFCO0lBQy9CLE1BQU0sRUFBRSxNQUFNO0lBQ2QsVUFBVSxFQUFFLGlCQUFpQjtJQUM3QixVQUFVLEVBQUUsaUJBQWlCO0lBQzdCLFNBQVMsRUFBRSxzQkFBc0I7SUFDakMsVUFBVSxFQUFFLHdCQUF3QjtJQUNwQyxNQUFNLEVBQUUsTUFBTTtJQUNkLGFBQWEsRUFBRSxhQUFhO0lBQzVCLFlBQVksRUFBRSxNQUFNO0lBQ3BCLFlBQVksRUFBRSxXQUFXO0lBQ3pCLFNBQVMsRUFBRSxRQUFRO0NBQ3BCLENBQUE7QUFFRCxnRkFBZ0Y7QUFDaEYsTUFBTSxTQUFTLEdBQWlCO0lBQzlCLFVBQVUsRUFBRSxXQUFXO0lBQ3ZCLFFBQVEsRUFBRSxrQkFBa0I7SUFDNUIsT0FBTyxFQUFFLFdBQVc7SUFDcEIsUUFBUSxFQUFFLGtCQUFrQjtJQUM1QixPQUFPLEVBQUUs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QU0sR0FBa0MsRUFBRSxDQUFBO0lBRWhELEtBQUssTUFBTSxHQUFHLElBQUksT0FBTyxFQUFFO1FBQ3pCLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRztZQUNaLFNBQVM7WUFDVCxLQUFLLEVBQUU7Z0JBQ0wsSUFBSSxFQUFHLE9BQU8sQ0FBQyxHQUFHLENBQVksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO2FBQzdDO1NBQ0YsQ0FBQTtLQUNGO0lBRUQsT0FBTyxNQUFzQixDQUFBO0FBQy9CLENBQUM7QUFFRCxNQUFNLFFBQVEsR0FBaUM7SUFDN0MsRUFBRSxFQUFFLGNBQWM7SUFDbEIsR0FBRyxFQUFFLFNBQVM7SUFDZCxFQUFFLEVBQUUsaUJBQWlCO0lBQ3JCLEdBQUcsRUFBRSxrQkFBa0I7SUFDdkIsS0FBSyxFQUFFLDhCQUE4QixDQUFDLG1CQUFtQixFQUFFLGlCQUFpQixDQUFDO0NBQzlFLENBQUE7QUFFRCxNQUFNLENBQUMsT0FBTyxVQUFVLEtBQUssQ0FBRSxRQUFRLEdBQUcsSUFBSSxFQUFFLFFBQStCLEVBQUU7SUFDL0UsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksUUFBUSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQTtBQUNwRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVnVldGlmeUljb24sIFZ1ZXRpZnlJY29ucyB9IGZyb20gJ3Z1ZXRpZnknXHJcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ3Z1ZSdcclxuXHJcbi8vIE1hcHMgaW50ZXJuYWwgVnVldGlmeSBpY29uIG5hbWVzIHRvIGFjdHVhbCBNYXRlcmlhbCBEZXNpZ24gaWNvbiBuYW1lcy5cclxuY29uc3QgSUNPTlNfTUFURVJJQUw6IFZ1ZXRpZnlJY29ucyA9IHtcclxuICAnY29tcGxldGUnOiAnY2hlY2snLFxyXG4gICdjYW5jZWwnOiAnY2FuY2VsJyxcclxuICAnY2xvc2UnOiAnY2xvc2UnLFxyXG4gICdkZWxldGUnOiAnY2FuY2VsJywgLy8gZGVsZXRlIChlLmcuIHYtY2hpcCBjbG9zZSlcclxuICAnY2xlYXInOiAnY2xlYXInLFxyXG4gICdzdWNjZXNzJzogJ2NoZWNrX2NpcmNsZScsXHJcbiAgJ2luZm8nOiAnaW5mbycsXHJcbiAgJ3dhcm5pbmcnOiAncHJpb3JpdHlfaGlnaCcsXHJcbiAgJ2Vycm9yJzogJ3dhcm5pbmcnLFxyXG4gICdwcmV2JzogJ2NoZXZyb25fbGVmdCcsXHJcbiAgJ25leHQnOiAnY2hldnJvbl9yaWdodCcsXHJcbiAgJ2NoZWNrYm94T24nOiAnY2hlY2tfYm94JyxcclxuICAnY2hlY2tib3hPZmYnOiAnY2hlY2tfYm94X291dGxpbmVfYmxhbmsnLFxyXG4gICdjaGVja2JveEluZGV0ZXJtaW5hdGUnOiAnaW5kZXRlcm1pbmF0ZV9jaGVja19ib3gnLFxyXG4gICdkZWxpbWl0ZXInOiAnZmliZXJfbWFudWFsX3JlY29yZCcsIC8vIGZvciBjYXJvdXNlbFxyXG4gICdzb3J0JzogJ2Fycm93X3Vwd2FyZCcsXHJcbiAgJ2V4cGFuZCc6ICdrZXlib2FyZF9hcnJvd19kb3duJyxcclxuICAnbWVudSc6ICdtZW51JyxcclxuICAnc3ViZ3JvdXAnOiAnYXJyb3dfZHJvcF9kb3duJyxcclxuICAnZHJvcGRvd24nOiAnYXJyb3dfZHJvcF9kb3duJyxcclxuICAncmFkaW9Pbic6ICdyYWRpb19idXR0b25fY2hlY2tlZCcsXHJcbiAgJ3JhZGlvT2ZmJzogJ3JhZGlvX2J1dHRvbl91bmNoZWNrZWQnLFxyXG4gICdlZGl0JzogJ2VkaXQnLFxyXG4gICdyYXRpbmdFbXB0eSc6ICdzdGFyX2JvcmRlcicsXHJcbiAgJ3JhdGluZ0Z1bGwnOiAnc3RhcicsXHJcbiAgJ3JhdGluZ0hhbGYnOiAnc3Rhcl9oYWxmJyxcclxuICAnbG9hZGluZyc6ICdjYWNoZWQnXHJcbn1cclxuXHJcbi8vIE1hcHMgaW50ZXJuYWwgVnVldGlmeSBpY29uIG5hbWVzIHRvIGFjdHVhbCBpY29ucyBmcm9tIG1hdGVyaWFsZGVzaWduaWNvbnMuY29tXHJcbmNvbnN0IElDT05TX01ESTogVnVldGlmeUljb25zID0ge1xyXG4gICdjb21wbGV0ZSc6ICdtZGktY2hlY2snLFxyXG4gICdjYW5jZWwnOiAnbWRpLWNsb3NlLWNpcmNsZScsXHJcbiAgJ2Nsb3NlJzogJ21kaS1jbG9zZScsXHJcbiAgJ2RlbGV0ZSc6ICdtZGktY2xvc2UtY2lyY2xlJywgLy8gZGVsZXRlIChlLmcuIHYtY2hpcCBjbG9zZSlcclxuICAnY2xlYXInOiAnbWRpLWNsb3NlJyxcclxuICAnc3VjY2Vzcyc6ICdtZGktY2hlY2stY2lyY2xlJyxcclxuICAnaW5mbyc6ICdtZGktaW5mb3JtYXRpb24nLFxyXG4gICd3YXJuaW5nJzogJ21kaS1leGNsYW1hdGlvbicsXHJcbiAgJ2Vycm9yJzogJ21kaS1hbGVydCcsXHJcbiAgJ3ByZXYnOiAnbWRpLWNoZXZyb24tbGVmdCcsXHJcbiAgJ25leHQnOiAnbWRpLWNoZXZyb24tcmlnaHQnLFxyXG4gICdjaGVja2JveE9uJzogJ21kaS1jaGVja2JveC1tYXJrZWQnLFxyXG4gICdjaGVja2JveE9mZic6ICdtZGktY2hlY2tib3gtYmxhbmstb3V0bGluZScsXHJcbiAgJ2NoZWNrYm94SW5kZXRlcm1pbmF0ZSc6ICdtZGktbWludXMtYm94JyxcclxuICAnZGVsaW1pdGVyJzogJ21kaS1jaXJjbGUnLCAvLyBmb3IgY2Fyb3VzZWxcclxuICAnc29ydCc6ICdtZGktYXJyb3ctdXAnLFxyXG4gICdleHBhbmQnOiAnbWRpLWNoZXZyb24tZG93bicsXHJcbiAgJ21lbnUnOiAnbWRpLW1lbnUnLFxyXG4gICdzdWJncm91cCc6ICdtZGktbWVudS1kb3duJyxcclxuICAnZHJvcGRvd24nOiAnbWRpLW1lbnUtZG93bicsXHJcbiAgJ3JhZGlvT24nOiAnbWRpLXJhZGlvYm94LW1hcmtlZCcsXHJcbiAgJ3JhZGlvT2ZmJzogJ21kaS1yYWRpb2JveC1ibGFuaycsXHJcbiAgJ2VkaXQnOiAnbWRpLXBlbmNpbCcsXHJcbiAgJ3JhdGluZ0VtcHR5JzogJ21kaS1zdGFyLW91dGxpbmUnLFxyXG4gICdyYXRpbmdGdWxsJzogJ21kaS1zdGFyJyxcclxuICAncmF0aW5nSGFsZic6ICdtZGktc3Rhci1oYWxmJ1xyXG59XHJcblxyXG4vLyBNYXBzIGludGVybmFsIFZ1ZXRpZnkgaWNvbiBuYW1lcyB0byBhY3R1YWwgRm9udC1Bd2Vzb21lIDQgaWNvbiBuYW1lcy5cclxuY29uc3QgSUNPTlNfRk9OVEFXRVNPTUU0OiBWdWV0aWZ5SWNvbnMgPSB7XHJcbiAgJ2NvbXBsZXRlJzogJ2ZhIGZhLWNoZWNrJyxcclxuICAnY2FuY2VsJzogJ2ZhIGZhLXRpbWVzLWNpcmNsZScsXHJcbiAgJ2Nsb3NlJzogJ2ZhIGZhLXRpbWVzJyxcclxuICAnZGVsZXRlJzogJ2ZhIGZhLXRpbWVzLWNpcmNsZScsIC8vIGRlbGV0ZSAoZS5nLiB2LWNoaXAgY2xvc2UpXHJcbiAgJ2NsZWFyJzogJ2ZhIGZhLXRpbWVzLWNpcmNsZScsIC8vIGRlbGV0ZSAoZS5nLiB2LWNoaXAgY2xvc2UpXHJcbiAgJ3N1Y2Nlc3MnOiAnZmEgZmEtY2hlY2stY2lyY2xlJyxcclxuICAnaW5mbyc6ICdmYSBmYS1pbmZvLWNpcmNsZScsXHJcbiAgJ3dhcm5pbmcnOiAnZmEgZmEtZXhjbGFtYXRpb24nLFxyXG4gICdlcnJvcic6ICdmYSBmYS1leGNsYW1hdGlvbi10cmlhbmdsZScsXHJcbiAgJ3ByZXYnOiAnZmEgZmEtY2hldnJvbi1sZWZ0JyxcclxuICAnbmV4dCc6ICdmYSBmYS1jaGV2cm9uLXJpZ2h0JyxcclxuICAnY2hlY2tib3hPbic6ICdmYSBmYS1jaGVjay1zcXVhcmUnLFxyXG4gICdjaGVja2JveE9mZic6ICdmYSBmYS1zcXVhcmUtbycsIC8vIG5vdGUgJ2ZhcidcclxuICAnY2hlY2tib3hJbmRldGVybWluYXRlJzogJ2ZhIGZhLW1pbnVzLXNxdWFyZScsXHJcbiAgJ2RlbGltaXRlcic6ICdmYSBmYS1jaXJjbGUnLCAvLyBmb3IgY2Fyb3VzZWxcclxuICAnc29ydCc6ICdmYSBmYS1zb3J0LXVwJyxcclxuICAnZXhwYW5kJzogJ2ZhIGZhLWNoZXZyb24tZG93bicsXHJcbiAgJ21lbnUnOiAnZmEgZmEtYmFycycsXHJcbiAgJ3N1Ymdyb3VwJzogJ2ZhIGZhLWNhcmV0LWRvd24nLFxyXG4gICdkcm9wZG93bic6ICdmYSBmYS1jYXJldC1kb3duJyxcclxuICAncmFkaW9Pbic6ICdmYSBmYS1kb3QtY2lyY2xlJyxcclxuICAncmFkaW9PZmYnOiAnZmEgZmEtY2lyY2xlLW8nLFxyXG4gICdlZGl0JzogJ2ZhIGZhLXBlbmNpbCcsXHJcbiAgJ3JhdGluZ0VtcHR5JzogJ2ZhIGZhLXN0YXItbycsXHJcbiAgJ3JhdGluZ0Z1bGwnOiAnZmEgZmEtc3RhcicsXHJcbiAgJ3JhdGluZ0hhbGYnOiAnZmEgZmEtc3Rhci1oYWxmLW8nXHJcbn1cclxuXHJcbi8vIE1hcHMgaW50ZXJuYWwgVnVldGlmeSBpY29uIG5hbWVzIHRvIGFjdHVhbCBGb250LUF3ZXNvbWUgNSsgaWNvbiBuYW1lcy5cclxuY29uc3QgSUNPTlNfRk9OVEFXRVNPTUU6IFZ1ZXRpZnlJY29ucyA9IHtcclxuICAnY29tcGxldGUnOiAnZmFzIGZhLWNoZWNrJyxcclxuICAnY2FuY2VsJzogJ2ZhcyBmYS10aW1lcy1jaXJjbGUnLFxyXG4gICdjbG9zZSc6ICdmYXMgZmEtdGltZXMnLFxyXG4gICdkZWxldGUnOiAnZmFzIGZhLXRpbWVzLWNpcmNsZScsIC8vIGRlbGV0ZSAoZS5nLiB2LWNoaXAgY2xvc2UpXHJcbiAgJ2NsZWFyJzogJ2ZhcyBmYS10aW1lcy1jaXJjbGUnLCAvLyBkZWxldGUgKGUuZy4gdi1jaGlwIGNsb3NlKVxyXG4gICdzdWNjZXNzJzogJ2ZhcyBmYS1jaGVjay1jaXJjbGUnLFxyXG4gICdpbmZvJzogJ2ZhcyBmYS1pbmZvLWNpcmNsZScsXHJcbiAgJ3dhcm5pbmcnOiAnZmFzIGZhLWV4Y2xhbWF0aW9uJyxcclxuICAnZXJyb3InOiAnZmFzIGZhLWV4Y2xhbWF0aW9uLXRyaWFuZ2xlJyxcclxuICAncHJldic6ICdmYXMgZmEtY2hldnJvbi1sZWZ0JyxcclxuICAnbmV4dCc6ICdmYXMgZmEtY2hldnJvbi1yaWdodCcsXHJcbiAgJ2NoZWNrYm94T24nOiAnZmFzIGZhLWNoZWNrLXNxdWFyZScsXHJcbiAgJ2NoZWNrYm94T2ZmJzogJ2ZhciBmYS1zcXVhcmUnLCAvLyBub3RlICdmYXInXHJcbiAgJ2NoZWNrYm94SW5kZXRlcm1pbmF0ZSc6ICdmYXMgZmEtbWludXMtc3F1YXJlJyxcclxuICAnZGVsaW1pdGVyJzogJ2ZhcyBmYS1jaXJjbGUnLCAvLyBmb3IgY2Fyb3VzZWxcclxuICAnc29ydCc6ICdmYXMgZmEtc29ydC11cCcsXHJcbiAgJ2V4cGFuZCc6ICdmYXMgZmEtY2hldnJvbi1kb3duJyxcclxuICAnbWVudSc6ICdmYXMgZmEtYmFycycsXHJcbiAgJ3N1Ymdyb3VwJzogJ2ZhcyBmYS1jYXJldC1kb3duJyxcclxuICAnZHJvcGRvd24nOiAnZmFzIGZhLWNhcmV0LWRvd24nLFxyXG4gICdyYWRpb09uJzogJ2ZhciBmYS1kb3QtY2lyY2xlJyxcclxuICAncmFkaW9PZmYnOiAnZmFyIGZhLWNpcmNsZScsXHJcbiAgJ2VkaXQnOiAnZmFzIGZhLWVkaXQnLFxyXG4gICdyYXRpbmdFbXB0eSc6ICdmYXIgZmEtc3RhcicsXHJcbiAgJ3JhdGluZ0Z1bGwnOiAnZmFzIGZhLXN0YXInLFxyXG4gICdyYXRpbmdIYWxmJzogJ2ZhcyBmYS1zdGFyLWhhbGYnXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0VG9Db21wb25lbnREZWNsYXJhdGlvbnMgKFxyXG4gIGNvbXBvbmVudDogQ29tcG9uZW50IHwgc3RyaW5nLFxyXG4gIGljb25TZXQ6IFZ1ZXRpZnlJY29uc1xyXG4pIHtcclxuICBjb25zdCByZXN1bHQ6IHtbbmFtZTogc3RyaW5nXTogVnVldGlmeUljb259ID0ge31cclxuXHJcbiAgZm9yIChjb25zdCBrZXkgaW4gaWNvblNldCkge1xyXG4gICAgcmVzdWx0W2tleV0gPSB7XHJcbiAgICAgIGNvbXBvbmVudCxcclxuICAgICAgcHJvcHM6IHtcclxuICAgICAgICBpY29uOiAoaWNvblNldFtrZXldIGFzIHN0cmluZykuc3BsaXQoJyBmYS0nKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVzdWx0IGFzIFZ1ZXRpZnlJY29uc1xyXG59XHJcblxyXG5jb25zdCBpY29uU2V0czogUmVjb3JkPHN0cmluZywgVnVldGlmeUljb25zPiA9IHtcclxuICBtZDogSUNPTlNfTUFURVJJQUwsXHJcbiAgbWRpOiBJQ09OU19NREksXHJcbiAgZmE6IElDT05TX0ZPTlRBV0VTT01FLFxyXG4gIGZhNDogSUNPTlNfRk9OVEFXRVNPTUU0LFxyXG4gIGZhU3ZnOiBjb252ZXJ0VG9Db21wb25lbnREZWNsYXJhdGlvbnMoJ2ZvbnQtYXdlc29tZS1pY29uJywgSUNPTlNfRk9OVEFXRVNPTUUpXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGljb25zIChpY29uZm9udCA9ICdtZCcsIGljb25zOiBQYXJ0aWFsPFZ1ZXRpZnlJY29ucz4gPSB7fSkge1xyXG4gIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBpY29uU2V0c1tpY29uZm9udF0gfHwgaWNvblNldHMubWQsIGljb25zKVxyXG59XHJcbiJdfQ==