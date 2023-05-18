Vue.component('pulldowntable', {
    // 声明 props
    props: {
        // 表格的列
        columns: {
            type: Array
        },
        value:{
            type: String,
        },
        loadurl: {
            type: String
        },
        data:{
            type: Object,
        },
        datakey:{
            type: [Object,String]
        },
        height: {
            type: [ Number, String ],
            default: 300
        },
        width: {
            type: [ Number, String ],
            default: 700
        },
        
    },
    methods: {
        onRowClick(row, column, event){
            this.isshow = false;
            console.log(typeof this.datakey)
            
            if(this.data&&this.datakey){
                if(typeof this.datakey=='string'){
                    this.data[this.datakey] = row[this.datakey];
                }else{
                    for(var key in this.datakey){
                        this.data[key] = row[this.datakey[key]];
                    }
                }
            }
            this.$emit('row-click',this.data, row, column, event);
            //this.$emit('input', "666");
            
        },
        popoverShow(){
            this.$refs.listtable.filtercol.param = {};
            this.$refs.listtable.loader();
        },
    },
    data() {
        return {
            isshow:false,
        }
    },
    computed: {
        
    },
    mounted() {
       
    },
    watch: {

    },
    template: ' <div>'+
                '<el-popover'+
                '  placement="bottom-start"'+
                ' @show="popoverShow" v-model="isshow"'+
                '  :width="width"'+
                '  trigger="click">'+
                '<s-table :autoLoad="false" :loadurl="loadurl" :height="height" ref="listtable" :columns="columns" @row-click="onRowClick"> </s-table>'+
                //'<el-input v-bind:value="value"  slot="reference" placeholder="请选择"></el-input>'+
                '  <el-select no-data-text="1"  style="width:100%" v-bind:value="value" slot="reference" placeholder="请选择">'+
                '   <el-option style="display: none;" label="此条隐藏选项用来解决空白数据时显示无数据覆盖表单的问题" value="1"></el-option>'+
                '  </el-select>'+
                '</el-popover>'+
                '</div>'
  })