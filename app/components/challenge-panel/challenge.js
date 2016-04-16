import './challenge.css!'
import tmpl from './challenge.html!text'
import Vue from 'vue'

export default Vue.extend({
    template: tmpl,
    props: [
        "control",
    ],
    data() {
        return {
            error: '',
            deeds: [],
            new_deed: {
                description:''
            },
        }
    },
    computed: {

    },
    ready() {
        this.control.send('get_deeds', {}, this.got_deeds)
    },
    methods: {
        got_deeds(request, response) {
            try {
                this.error = response.error
                this.deeds = response.result
            }
            catch(error) {
                this.error = "Couldn't parse server reponse."
            }
        },
        add_deed() {
            this.control.send('insert_deed', this.new_deed, this.added_deed)
        }
        added_deed(request, response) {
            this.new_deed.description=''
        }
    },
    events: {
        insert_deed(deed) {
            this.deeds.push(deed)
        },
        delete_deed(id) {
            const index = this.deeds.findIndex(d => d.id === id)
            this.deeds.splice(index, 1)
        },
    },
})