import './challenge.css!'
import tmpl from './challenge.html!text'
import Vue from 'vue'
import PercentageWidget from 'app/components/percentage-widget/percentage-widget'
import tz from 'jstimezonedetect'


export default Vue.extend({
    template: tmpl,
    components: {
        'percentage-widget': PercentageWidget,
    },
    props: [
        "control",
    ],
    data() {
        return {
            error: '',
            deeds: [],
        }
    },
    computed: {
        accomplished_deed() {
            return this.deeds.some(d => d.accomplished)
        },
        total_champains() {
            return this.deeds.filter(d => d.accomplished_count)
                             .map(d => d.accomplished_count)
                             .reduce((a, b) => a + b, 0)
        },
        column_width() {
            return 100 / this.deeds.length + '%'
        },
    },
    ready() {
        this.get_deeds()
    },
    methods: {
        get_deeds() {
            this.error = ''
            this.deeds = []
            const timezone = tz.determine().name()
            this.control.send('get_todays_deeds', {timezone}, this.got_deeds)
        },
        accomplish_deed(deed_id) {
            this.error = ''
            this.control.send('accomplish_deed', {deed_id}, this.got_deeds)
        },
        got_deeds(request, response) {
            try {
                this.error = response.error
                this.deeds = response.result
            }
            catch(error) {
                this.error = "Couldn't parse server reponse."
            }
        },
        percentage_of_champains(champains) {
            return 100 * champains / this.total_champains
        },
        primary_color(index) {
            return index % 2 ? 'rgb(239, 147, 63)' : 'rgb(76, 171, 223)'
        },
        secondary_color(index) {
            return index % 2 ? 'rgb(247, 68, 56)' : 'rgb(23, 93, 130)'
        },
    },
    events: {
        update_deed(deed) {
            const index = this.deeds.findIndex(d => d.id === deed.id)
            if (index !== -1) this.deeds.$set(index, deed)
            return true
        },
        delete_deed(id) {
            // Did a challenge get deleted? Then replace them both
            const index = this.deeds.findIndex(d => d.id === id)
            if (index !== -1) this.get_deeds()
            return true
        },
    },
})