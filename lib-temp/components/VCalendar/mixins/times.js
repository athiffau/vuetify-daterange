import Vue from 'vue';
import { validateTimestamp, parseTimestamp, parseDate } from '../util/timestamp';
export default Vue.extend({
    name: 'times',
    props: {
        now: {
            type: String,
            validator: validateTimestamp
        }
    },
    data: () => ({
        times: {
            now: parseTimestamp('0000-00-00 00:00'),
            today: parseTimestamp('0000-00-00')
        }
    }),
    computed: {
        parsedNow() {
            return this.now ? parseTimestamp(this.now) : null;
        }
    },
    watch: {
        parsedNow: 'updateTimes'
    },
    created() {
        this.updateTimes();
        this.setPresent();
    },
    methods: {
        setPresent() {
            this.times.now.present = this.times.today.present = true;
            this.times.now.past = this.times.today.past = false;
            this.times.now.future = this.times.today.future = false;
        },
        updateTimes() {
            const now = this.parsedNow || this.getNow();
            this.updateDay(now, this.times.now);
            this.updateTime(now, this.times.now);
            this.updateDay(now, this.times.today);
        },
        getNow() {
            return parseDate(new Date());
        },
        updateDay(now, target) {
            if (now.date !== target.date) {
                target.year = now.year;
                target.month = now.month;
                target.day = now.day;
                target.weekday = now.weekday;
                target.date = now.date;
            }
        },
        updateTime(now, target) {
            if (now.time !== target.time) {
                target.hour = now.hour;
                target.minute = now.minute;
                target.time = now.time;
            }
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WQ2FsZW5kYXIvbWl4aW5zL3RpbWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sR0FBRyxNQUFNLEtBQUssQ0FBQTtBQUVyQixPQUFPLEVBRUwsaUJBQWlCLEVBQ2pCLGNBQWMsRUFDZCxTQUFTLEVBQ1YsTUFBTSxtQkFBbUIsQ0FBQTtBQUUxQixlQUFlLEdBQUcsQ0FBQyxNQUFNLENBQUM7SUFDeEIsSUFBSSxFQUFFLE9BQU87SUFFYixLQUFLLEVBQUU7UUFDTCxHQUFHLEVBQUU7WUFDSCxJQUFJLEVBQUUsTUFBTTtZQUNaLFNBQVMsRUFBRSxpQkFBaUI7U0FDN0I7S0FDRjtJQUVELElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ1gsS0FBSyxFQUFFO1lBQ0wsR0FBRyxFQUFFLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBZTtZQUNyRCxLQUFLLEVBQUUsY0FBYyxDQUFDLFlBQVksQ0FBZTtTQUNsRDtLQUNGLENBQUM7SUFFRixRQUFRLEVBQUU7UUFDUixTQUFTO1lBQ1AsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUE7UUFDbkQsQ0FBQztLQUNGO0lBRUQsS0FBSyxFQUFFO1FBQ0wsU0FBUyxFQUFFLGFBQWE7S0FDekI7SUFFRCxPQUFPO1FBQ0wsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFBO1FBQ2xCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTtJQUNuQixDQUFDO0lBRUQsT0FBTyxFQUFFO1FBQ1AsVUFBVTtZQUNSLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFBO1lBQ3hELElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFBO1lBQ25ELElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFBO1FBQ3pELENBQUM7UUFDRCxXQUFXO1lBQ1QsTUFBTSxHQUFHLEdBQWUsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUE7WUFDdkQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUNuQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQ3BDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDdkMsQ0FBQztRQUNELE1BQU07WUFDSixPQUFPLFNBQVMsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUE7UUFDOUIsQ0FBQztRQUNELFNBQVMsQ0FBRSxHQUFlLEVBQUUsTUFBa0I7WUFDNUMsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQUU7Z0JBQzVCLE1BQU0sQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQTtnQkFDdEIsTUFBTSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFBO2dCQUN4QixNQUFNLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUE7Z0JBQ3BCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQTtnQkFDNUIsTUFBTSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFBO2FBQ3ZCO1FBQ0gsQ0FBQztRQUNELFVBQVUsQ0FBRSxHQUFlLEVBQUUsTUFBa0I7WUFDN0MsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQUU7Z0JBQzVCLE1BQU0sQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQTtnQkFDdEIsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFBO2dCQUMxQixNQUFNLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUE7YUFDdkI7UUFDSCxDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVnVlIGZyb20gJ3Z1ZSdcclxuXHJcbmltcG9ydCB7XHJcbiAgVlRpbWVzdGFtcCxcclxuICB2YWxpZGF0ZVRpbWVzdGFtcCxcclxuICBwYXJzZVRpbWVzdGFtcCxcclxuICBwYXJzZURhdGVcclxufSBmcm9tICcuLi91dGlsL3RpbWVzdGFtcCdcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZ1ZS5leHRlbmQoe1xyXG4gIG5hbWU6ICd0aW1lcycsXHJcblxyXG4gIHByb3BzOiB7XHJcbiAgICBub3c6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICB2YWxpZGF0b3I6IHZhbGlkYXRlVGltZXN0YW1wXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZGF0YTogKCkgPT4gKHtcclxuICAgIHRpbWVzOiB7XHJcbiAgICAgIG5vdzogcGFyc2VUaW1lc3RhbXAoJzAwMDAtMDAtMDAgMDA6MDAnKSBhcyBWVGltZXN0YW1wLFxyXG4gICAgICB0b2RheTogcGFyc2VUaW1lc3RhbXAoJzAwMDAtMDAtMDAnKSBhcyBWVGltZXN0YW1wXHJcbiAgICB9XHJcbiAgfSksXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICBwYXJzZWROb3cgKCk6IFZUaW1lc3RhbXAgfCBudWxsIHtcclxuICAgICAgcmV0dXJuIHRoaXMubm93ID8gcGFyc2VUaW1lc3RhbXAodGhpcy5ub3cpIDogbnVsbFxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHdhdGNoOiB7XHJcbiAgICBwYXJzZWROb3c6ICd1cGRhdGVUaW1lcydcclxuICB9LFxyXG5cclxuICBjcmVhdGVkICgpIHtcclxuICAgIHRoaXMudXBkYXRlVGltZXMoKVxyXG4gICAgdGhpcy5zZXRQcmVzZW50KClcclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICBzZXRQcmVzZW50ICgpOiB2b2lkIHtcclxuICAgICAgdGhpcy50aW1lcy5ub3cucHJlc2VudCA9IHRoaXMudGltZXMudG9kYXkucHJlc2VudCA9IHRydWVcclxuICAgICAgdGhpcy50aW1lcy5ub3cucGFzdCA9IHRoaXMudGltZXMudG9kYXkucGFzdCA9IGZhbHNlXHJcbiAgICAgIHRoaXMudGltZXMubm93LmZ1dHVyZSA9IHRoaXMudGltZXMudG9kYXkuZnV0dXJlID0gZmFsc2VcclxuICAgIH0sXHJcbiAgICB1cGRhdGVUaW1lcyAoKTogdm9pZCB7XHJcbiAgICAgIGNvbnN0IG5vdzogVlRpbWVzdGFtcCA9IHRoaXMucGFyc2VkTm93IHx8IHRoaXMuZ2V0Tm93KClcclxuICAgICAgdGhpcy51cGRhdGVEYXkobm93LCB0aGlzLnRpbWVzLm5vdylcclxuICAgICAgdGhpcy51cGRhdGVUaW1lKG5vdywgdGhpcy50aW1lcy5ub3cpXHJcbiAgICAgIHRoaXMudXBkYXRlRGF5KG5vdywgdGhpcy50aW1lcy50b2RheSlcclxuICAgIH0sXHJcbiAgICBnZXROb3cgKCk6IFZUaW1lc3RhbXAge1xyXG4gICAgICByZXR1cm4gcGFyc2VEYXRlKG5ldyBEYXRlKCkpXHJcbiAgICB9LFxyXG4gICAgdXBkYXRlRGF5IChub3c6IFZUaW1lc3RhbXAsIHRhcmdldDogVlRpbWVzdGFtcCk6IHZvaWQge1xyXG4gICAgICBpZiAobm93LmRhdGUgIT09IHRhcmdldC5kYXRlKSB7XHJcbiAgICAgICAgdGFyZ2V0LnllYXIgPSBub3cueWVhclxyXG4gICAgICAgIHRhcmdldC5tb250aCA9IG5vdy5tb250aFxyXG4gICAgICAgIHRhcmdldC5kYXkgPSBub3cuZGF5XHJcbiAgICAgICAgdGFyZ2V0LndlZWtkYXkgPSBub3cud2Vla2RheVxyXG4gICAgICAgIHRhcmdldC5kYXRlID0gbm93LmRhdGVcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHVwZGF0ZVRpbWUgKG5vdzogVlRpbWVzdGFtcCwgdGFyZ2V0OiBWVGltZXN0YW1wKTogdm9pZCB7XHJcbiAgICAgIGlmIChub3cudGltZSAhPT0gdGFyZ2V0LnRpbWUpIHtcclxuICAgICAgICB0YXJnZXQuaG91ciA9IG5vdy5ob3VyXHJcbiAgICAgICAgdGFyZ2V0Lm1pbnV0ZSA9IG5vdy5taW51dGVcclxuICAgICAgICB0YXJnZXQudGltZSA9IG5vdy50aW1lXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiJdfQ==