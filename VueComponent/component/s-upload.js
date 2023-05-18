Vue.component('s-upload', {
    // 声明 props
    props: {
        
        data:{
            type: Object,
        },
        width: {
            type: [ Number, String ],
            default: 700
        },
        action:{
            type: String,
            default: ""
        },
        type:{
            type: String,
            default: ""
        },
        size:{
            type: String,
            default: "small"
        },
        disabled:{
            type:Boolean,
        },
        accept:{
            type: String,
            default:".xls"
        },
        headers: {
            type: Object,
            default: function () { return { "UserLangue": localStorage.lang || 'zh-CN' } },
        }

        
    },
    methods: {
        onRowClick(row, column, event){
            
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
            this.fileList = [];
        },
        onsuccess(res, file){
            this.fileList = [];
            this.isshow = false;
            this.$emit('onsuccess', res, file);
            console.log(res);
        },
        onerror(res, file){
            this.fileList = [];
            this.isshow = false;
            this.$emit('onerror', res, file);
        },
        beforeupload(file){
            var JsonColums = {};
            if(this.data.Column){
                this.data.Column.forEach(currentValue=>{
                    if(currentValue.prop&&currentValue.label){
                        JsonColums[currentValue.label] = currentValue.prop;
                    }
                })
                this.data.Columns = JSON.stringify(JsonColums);
            }
            
            this.$emit('beforeupload',file);
        }
    },
    data() {
        return {
            isshow:false,
            fileList:[],
        }
    },
    computed: {
        
    },
    mounted() {
       
    },
    watch: {

    },
    template:  `
                <el-popover
                placement="bottom-start" 
                @show="popoverShow" v-model="isshow"
                :width="width"
                trigger="click">
                
                <el-upload 
                :headers='headers' 
                class="upload-demo"
                drag
                :data='data' 
                :action="action" 
                :file-list="fileList" 
                :on-success="onsuccess" :on-error="onerror" 
                :accept='accept' 
                :before-upload='beforeupload'
                >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">点击上传</em></div>
                
                </el-upload>
                <el-button :disabled='disabled' icon='el-icon-upload' slot="reference" :size="size" :type="type">
                <slot />
                </el-button>
                </el-popover>
                `
  })