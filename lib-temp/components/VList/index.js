import { createSimpleFunctional } from '../../util/helpers';
import VList from './VList';
import VListGroup from './VListGroup';
import VListTile from './VListTile';
import VListTileAction from './VListTileAction';
import VListTileAvatar from './VListTileAvatar';
export { VList, VListGroup, VListTile, VListTileAction, VListTileAvatar };
export const VListTileActionText = createSimpleFunctional('v-list__tile__action-text', 'span');
export const VListTileContent = createSimpleFunctional('v-list__tile__content', 'div');
export const VListTileTitle = createSimpleFunctional('v-list__tile__title', 'div');
export const VListTileSubTitle = createSimpleFunctional('v-list__tile__sub-title', 'div');
export default {
    $_vuetify_subcomponents: {
        VList,
        VListGroup,
        VListTile,
        VListTileAction,
        VListTileActionText,
        VListTileAvatar,
        VListTileContent,
        VListTileSubTitle,
        VListTileTitle
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WTGlzdC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUUzRCxPQUFPLEtBQUssTUFBTSxTQUFTLENBQUE7QUFDM0IsT0FBTyxVQUFVLE1BQU0sY0FBYyxDQUFBO0FBQ3JDLE9BQU8sU0FBUyxNQUFNLGFBQWEsQ0FBQTtBQUNuQyxPQUFPLGVBQWUsTUFBTSxtQkFBbUIsQ0FBQTtBQUMvQyxPQUFPLGVBQWUsTUFBTSxtQkFBbUIsQ0FBQTtBQUUvQyxPQUFPLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBRSxDQUFBO0FBQ3pFLE1BQU0sQ0FBQyxNQUFNLG1CQUFtQixHQUFHLHNCQUFzQixDQUFDLDJCQUEyQixFQUFFLE1BQU0sQ0FBQyxDQUFBO0FBQzlGLE1BQU0sQ0FBQyxNQUFNLGdCQUFnQixHQUFHLHNCQUFzQixDQUFDLHVCQUF1QixFQUFFLEtBQUssQ0FBQyxDQUFBO0FBQ3RGLE1BQU0sQ0FBQyxNQUFNLGNBQWMsR0FBRyxzQkFBc0IsQ0FBQyxxQkFBcUIsRUFBRSxLQUFLLENBQUMsQ0FBQTtBQUNsRixNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FBRyxzQkFBc0IsQ0FBQyx5QkFBeUIsRUFBRSxLQUFLLENBQUMsQ0FBQTtBQUV6RixlQUFlO0lBQ2IsdUJBQXVCLEVBQUU7UUFDdkIsS0FBSztRQUNMLFVBQVU7UUFDVixTQUFTO1FBQ1QsZUFBZTtRQUNmLG1CQUFtQjtRQUNuQixlQUFlO1FBQ2YsZ0JBQWdCO1FBQ2hCLGlCQUFpQjtRQUNqQixjQUFjO0tBQ2Y7Q0FDRixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlU2ltcGxlRnVuY3Rpb25hbCB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcclxuXHJcbmltcG9ydCBWTGlzdCBmcm9tICcuL1ZMaXN0J1xyXG5pbXBvcnQgVkxpc3RHcm91cCBmcm9tICcuL1ZMaXN0R3JvdXAnXHJcbmltcG9ydCBWTGlzdFRpbGUgZnJvbSAnLi9WTGlzdFRpbGUnXHJcbmltcG9ydCBWTGlzdFRpbGVBY3Rpb24gZnJvbSAnLi9WTGlzdFRpbGVBY3Rpb24nXHJcbmltcG9ydCBWTGlzdFRpbGVBdmF0YXIgZnJvbSAnLi9WTGlzdFRpbGVBdmF0YXInXHJcblxyXG5leHBvcnQgeyBWTGlzdCwgVkxpc3RHcm91cCwgVkxpc3RUaWxlLCBWTGlzdFRpbGVBY3Rpb24sIFZMaXN0VGlsZUF2YXRhciB9XHJcbmV4cG9ydCBjb25zdCBWTGlzdFRpbGVBY3Rpb25UZXh0ID0gY3JlYXRlU2ltcGxlRnVuY3Rpb25hbCgndi1saXN0X190aWxlX19hY3Rpb24tdGV4dCcsICdzcGFuJylcclxuZXhwb3J0IGNvbnN0IFZMaXN0VGlsZUNvbnRlbnQgPSBjcmVhdGVTaW1wbGVGdW5jdGlvbmFsKCd2LWxpc3RfX3RpbGVfX2NvbnRlbnQnLCAnZGl2JylcclxuZXhwb3J0IGNvbnN0IFZMaXN0VGlsZVRpdGxlID0gY3JlYXRlU2ltcGxlRnVuY3Rpb25hbCgndi1saXN0X190aWxlX190aXRsZScsICdkaXYnKVxyXG5leHBvcnQgY29uc3QgVkxpc3RUaWxlU3ViVGl0bGUgPSBjcmVhdGVTaW1wbGVGdW5jdGlvbmFsKCd2LWxpc3RfX3RpbGVfX3N1Yi10aXRsZScsICdkaXYnKVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gICRfdnVldGlmeV9zdWJjb21wb25lbnRzOiB7XHJcbiAgICBWTGlzdCxcclxuICAgIFZMaXN0R3JvdXAsXHJcbiAgICBWTGlzdFRpbGUsXHJcbiAgICBWTGlzdFRpbGVBY3Rpb24sXHJcbiAgICBWTGlzdFRpbGVBY3Rpb25UZXh0LFxyXG4gICAgVkxpc3RUaWxlQXZhdGFyLFxyXG4gICAgVkxpc3RUaWxlQ29udGVudCxcclxuICAgIFZMaXN0VGlsZVN1YlRpdGxlLFxyXG4gICAgVkxpc3RUaWxlVGl0bGVcclxuICB9XHJcbn1cclxuIl19