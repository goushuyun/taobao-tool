import {
    priceFloat,
    priceInt
} from '../../../assets/script/utils.js'
import axios from "../../../config/http.js"
export default {
    data() {
        return {
            warehouse: '',
            shelf: '',
            floor: '',
            select: '1',
            locations: [],

            loading: false,
            size: 10,
            total_count: 100
        }
    },
    mounted() {
        this.locationFazzyQuery()
    },
    methods: {
        locationFazzyQuery() {
            axios.post('/v1/stock/location_fazzy_query', {
                "warehouse": "A", //仓库名称 optional
                "shelf": "B", //货架名称 optional
                "floor": "1" //层数 optional
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    var data = resp.data.data
                    this.locations = data
                }
            })
        },
        handleSizeChange(size) {
            this.size = size
        },
        handleCurrentChange(page) {
            this.page = page
        }
    }
}
