Vue.component('exportdialog', {
    // 声明 props
    props: {
        exportdialogparam:{
            type: Object,
            default: function(ret) {
                return { dialogvisible: false, exporturl: "",jsonparam:""}
            }
        },
        loading: {
            type: Boolean,
            default: false
        },
        // 表格的列
        columns: {
            type: Array
        },
        exportdata:{
            type:Function,
            default: function() {
                var JsonParam ={export :1}
                JsonParam.filterRules = this.formatFilterRules(this.filtercol.param);
                var form = $("<form target='_blank' method='post'></form>");
                form.attr({"action":this.exportdialogparam.exporturl});
                console.log(this.exportdialogparam.exporturl);
                //过滤条件
                var input = $("<input type='hidden'>");
                input.attr({"name":"filterRules"});
                input.val(JsonParam.filterRules);
                form.append(input);
                
                if(this.exportdialogparam.jsonparam){
                    for(var key in this.exportdialogparam.jsonparam){
                        var input = $("<input type='hidden'>");
                        input.attr({"name":key});
                        input.val(this.exportdialogparam.jsonparam[key]);
                        form.append(input);
                    }
                }
                //是否导出
                var input1 = $("<input type='hidden'>");
                input1.attr({"name":"export"});
                input1.val(1);
                form.append(input1);


                //字段对应关系

                var JsonColums = {};
                this.columns.forEach(currentValue=>{
                    if(currentValue.prop&&currentValue.label){
                        JsonColums[currentValue.prop] = currentValue.label;
                    }
                })
                var Columnsinput = $("<input type='hidden'>");
                Columnsinput.attr({"name":"Column"});
                Columnsinput.val(JSON.stringify(JsonColums));
                form.append(Columnsinput);

                let ElementExportParam = {};
                ElementExportParam.export = 1;
                ElementExportParam.exportpage = this.exportpage;
                ElementExportParam.exportsize = this.exportsize;
                ElementExportParam.FieldColums = JSON.stringify(JsonColums);
                var ElementExportParaminput = $("<input type='hidden'>");
                ElementExportParaminput.attr({"name":"ElementExportParam"});
                ElementExportParaminput.val(JSON.stringify(ElementExportParam));
                form.append(ElementExportParaminput);

                $("html").append(form);
                form.submit();
            }
        },
        //table过滤值
        filtercol:{
            type: Object,
            default: function(ret) {
                return { order: "", sort: "", page: 1, rows: 20, total: 0,export:0,param: {} }
            }
        },
    },
    methods: {
        CloneObj: function (obj) {
            var _this = this;
            var newObj = {};
            if (obj instanceof Array) {
                newObj = [];
            }
            for (var key in obj) {
                var val = obj[key];
                //newObj[key] = typeof val === 'object' ? arguments.callee(val) : val; //arguments.callee 在哪一个函数中运行，它就代表哪个函数, 一般用在匿名函数中。  
                newObj[key] = val;
            }
            return newObj;
        },
        //格式化参数
        formatFilterRules: function (jsonData) {
            var filterRules = [];
            for (var item in jsonData) {
                if (jsonData[item]) {
                    var jsonItem = {};
                    jsonItem.field = item;
                    jsonItem.value = jsonData[item];
                    filterRules.push(jsonItem);
                }

            }
            return JSON.stringify(filterRules);
        },
        // toExportdata(_url,_jsonParam){
        //     this.exporturl = _url;
        //     this.exportjsonParam = _jsonParam;
            
        //     this.exportpage =1;
        //     this.dialogvisible = true;
        //     // if(this.filtercol.total/this.exportsize>1){
        //     //     this.exportpage =1;
        //     //     this.dialogvisible = true;
        //     // }else{
        //     //     this.exportdata.call(this);
        //     // }
        // },
        toPageExportdata(){
            this.exportdata.call(this);
            if(this.exportpage+1<=this.exportpageselect){
                this.exportpage++;
            }else{
                this.exportpage = 1;
                this.exportdialogparam.dialogvisible = false;
            }
        },
    },
    data() {
        return {
          
            Tableloading:false,
            exportpage:1,//导出页数
            exportsize:10000,//导出条目数
            exportjsonParam:{},//导出url参数
            //exporturl:'',//导出url
        }
    },
    computed: {
        exportpageselect(){
            return Math.ceil(this.filtercol.total/this.exportsize);
        }
    },
    mounted() {
    },
    watch: {
        loading(){
            this.Tableloading = this.loading;
        },
        "exportdialogparam.dialogvisible"(){
            this.exportpage = 1;
        }

    },
    template: ' <div>'+
                    '<el-dialog :close-on-click-modal="false" title="导出" width="30%" :visible.sync="exportdialogparam.dialogvisible">'+
                    ' 共{{filtercol.total}} 条数据,每次导出 {{exportsize}} 条，需分 {{exportpageselect}} 批导出,<br/>现进行第'+
                    ' <el-select style="width:80px"  v-model="exportpage" placeholder="">'+
                    ' <el-option v-for="page in exportpageselect" :key ="page" :label="page" :value="page"></el-option>'+
                    '</el-select>'+
                    '批导出'+
                    ' <div slot="footer" class="dialog-footer">'+
                    '   <el-button @click="exportdialogparam.dialogvisible = false">取 消</el-button>'+
                    '   <el-button type="primary" :disabled="filtercol.total==0||Tableloading" @click="toPageExportdata">确 定</el-button>'+
                    ' </div>'+
                    '</el-dialog>'+
                    '</div>'
                    
  })