Vue.component('s-table', {
    // 声明 props
    props: {
        // 表格数据
        data: {
            type: Array,
        },
        // 表格的列
        columns: {
            type: Array
        },
        // 是否显示斑马线，默认显示
        stripe: {
            type: Boolean,
            default: true
        },
        // 是否显示竖向的边框，默认不显示
        border: {
            type: Boolean,
            default: false
        },
        selectioncolumn: {
            type: Boolean,
            default: false
        },
        indexcolumn: {
            type: Boolean,
            default: true
        },
        // 是否为树形表格，默认否
        tree: {
            type: Boolean,
            default: false
        },
        // 树形表格时，默认是否全部折叠，默认是
        treeCollapse: {
            type: Boolean,
            default: true
        },
        // 树形表格的列，默认为第一列
        treeProp: {
            type: [ String, Number ],
            default: 0
        },
        treeParent: {
            type: String,
            default: 'parent'
        },
        clickSelect: {
            type: Boolean,
            default: true
        },
        treeRoot: {
            type: Function,
            default: function(n) {
                return n[this.treeParent] == '-1';
            }
        },
        singleSelect: {
            type: Boolean,
            default: false
        },
        loadurl: {
            type: String
        },
        autoload: {
            type: Boolean,
            default: true
        },
        loader: {
            type: Function,
            default: function() {
                var _this = this;
                _this.Tableloading = true;
                var JsonParam = this.CloneObj(_this.filtercol);
                delete JsonParam.param;
                JsonParam.filterRules = this.formatFilterRules(_this.filtercol.param);
                $.ajax({
                    type: "POST",
                    url: _this.loadurl,
                    data: JsonParam,
                    dataType: "json",
                    success: function (result) {
                        var Data = result.Data;
                        var datas;
                        console.log(result);
                        if(Data!=undefined){
                            if(result.Success){
                                datas = Data;
                            }else{
                                _this.$message.error(result.Message);
                                _this.datasource =[];
                                _this.Tableloading = false;
                                _this.filtercol.total = 0;
                            }
                        }else{
                            datas = result;
                        }
                        if(datas.total!=0&&datas.rows.length==0){
                            _this.filtercol.page=1;
                            _this.reload();
                        }else{
                            _this.datasource = datas.rows;
                            _this.Tableloading = false;
                            _this.filtercol.total = datas.total;
                        }
                        
                    },
                    error: function (xhr, type, errorThrown) {
                        //异常处理；
                        _this.datasource = [];
                        _this.$message.error(xhr);
                        _this.Tableloading = false;
                    }
                });

                // this.ajax.get(this.encodeUri ? encodeURI(this.loadurl) : this.loadurl, example).then(ret => {
                //     this.datasource = this.postLoader.call(this, ret);
                // });
            }
        },
        exportdata:{
            type:Function,
            default: function(_url,_jsonParam) {
                 // exportjsonParam:{},
                // exportParamUrl:'',
                var JsonParam ={export :1}
                JsonParam.filterRules = this.formatFilterRules(this.filtercol.param);
                var form = $("<form target='_blank' method='post'></form>");
                form.attr({"action":this.exportUrl});
                //过滤条件
                var input = $("<input type='hidden'>");
                input.attr({"name":"filterRules"});
                input.val(JsonParam.filterRules);
                form.append(input);
                
                if(this.exportjsonParam){
                    for(var key in this.exportjsonParam){
                        var input = $("<input type='hidden'>");
                        input.attr({"name":key});
                        input.val(this.exportjsonParam[key]);
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
        postLoader: {
            type: Function,
            default: function(ret) {
                //return ret ? ret.datas : [];
                return ret;
            }
        },
        loadExample: {
            type: [ Object, Function ]
        },
        defaultExpandAll: {
            type: Boolean,
            default: false
        },
        height: {
            type: [ Number, String ]
        },
        loading: {
            type: Boolean,
            default: false
        },
        elementLoadingText: {
            type: String
        },
        encodeUri: {
            type: Boolean,
            default: true
        },
        rowStyle: {
            type: Object,
            default: function(ret) {
                //return ret ? ret.datas : [];
                return { "height": "35px" }
            }
        },
        cellStyle: {
            type: Object,
            default: function(ret) {
                //return ret ? ret.datas : [];
                return {"padding":"0px"}
            }
        },
        //内容过多是否隐藏显示
        showOverflowTooltip: {
            type: Boolean,
            default: true
        },
        //table过滤值
        filtercol:{
            type: Object,
            default: function(ret) {
                return { order: "", sort: "", page: 1, rows: 20, total: 0,export:0,param: {} }
            }
        },
        isshowfiltercol:{
            type: Boolean,
            default: true
        },
        isshowpage:{
            type: Boolean,
            default: true
        },
        isshowlabel:{
            type: Boolean,
            default: true
        },
        spanmethod:{
            type: Function,
            default: function(n) {
               
            }
        }
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
        reload() {
            // if (this.autoload && this.loadurl) {
               
            // }
            this.loader.call(this);
        },
        toExportdata(_url,_jsonParam){
            
            this.exportParamUrl = _url;
            this.exportjsonParam = _jsonParam;
            this.exportdata.call(this);
            // this.exportpage =1;
            // this.exportdialogVisible = true;
            // if(this.filtercol.total/this.exportsize>1){
            //     this.exportpage =1;
            //     this.exportdialogVisible = true;
            // }else{
            //     this.exportdata.call(this);
            // }
        },
        toPageExportdata(){
            this.exportdata.call(this);
            if(this.exportpage+1<=this.exportpageselect){
                this.exportpage++;
            }else{
                this.exportpage = 1;
                this.exportdialogVisible = false;
            }
        },
        indent(scope) {
            // 菜单缩进
            return 'padding-left: ' + scope.row.level * 30 + 'px';
        },
        toggle(scope) {
            // 修改当前节点的打开关闭状态
            scope.row._collapse = ! scope.row._collapse;

            // 若当前节点为关闭状态，则需要修改所有子节点状态也为关闭
            if (scope.row._collapse) {
                // 折叠，此时需要调整他所有子级为折叠状态
                let fun = function(parent) {
                    parent._children.forEach(n => {
                        n._collapse = true;

                        fun(n);
                    });
                }

                fun(scope.row);
            }

            this.$nextTick(() => {
                this.$refs.table.updateScrollY();
            });
        },
        localRowStyle(row) {

            if (this.rowStyle) {
                return this.rowStyle.apply(this, arguments);
            } else {
                if (this.tree) {
                    // 树形结构时，行样式处理
                    //if (row[this.treeParent] != '-1' && row._parent._collapse) {
                    if (!this.treeRoot(row) && row._parent._collapse) {
                        return 'display: none';
                    }

                    return '';
                }
            }
        },
        onSelectionChange(val) {
            this.selection = val;
            this.$emit('selection-change', val);
        },
        select(rs = [], reverse = false, trigger = true) {

            if (rs.length == 0) {
                return;
            }

            // 选中数据存放的容器，操作这个容器即可实现选中与取消选中
            let selection = this.getSelection();
            let changed = false;
            rs.forEach(key => {
                let row = this.tableData.find(r => r.id == key);

                if (! row) {
                    return;
                }

                // 取得当前行数据在已选中列表中的索引
                let index = selection.findIndex(r => r.id == row.id);

                if (index == -1 && reverse == false) {
                    // 当前没有选中，且需要选中
                    selection.push(row);
                    changed = true;
                } else if (index != -1 && reverse == true) {
                    // 当前已选中了，且需要取消选中
                    selection.splice(index, 1);
                    changed = true;
                }
            });

            if (changed && trigger) {
                // 触发事件
                this.$emit('selection-change', selection);
            }
        },
        onSelect(selection, row) {
            this.$emit('select', selection, row, selection.findIndex(r => r.id == row.id) != -1);
        },
        onSelectAll(rs) {
            this.$emit('select-all', rs);
        },
        onSortChange(args) {
            // 排序发生变化的事件
            this.$emit('sort-change', args);
        },
        getSelection() {
            // 取得当前选中的条目
            return this.$refs.table.store.states.currentRow;
            //return this.$refs.table.store.states.selection;
        },
        getSelectionList() {
            // 取得当前选中的条目
            return this.$refs.table.store.states.selection;
        },
        proxy(name, args) {
            this.$refs.table[name].apply(this, args);
        },
        //单击头事件
        onHeaderClick(column, event){
            //this.HeaderClick.call(this, {column, event});
            if (!event.target.type) {
                this.filtercol.sort = column.property;
                this.filtercol.order = this.filtercol.order == ' asc ' ? " desc " : ' asc ';
                //this.getDatas();
                this.reload();
                this.$emit('header-click',column, event);
            }
            
        },
        onRowClick(row, column, event){
           
            this.$emit('row-click', row, column, event);
        },
        //每页显示数据改变时
        pagehandleSizeChange(val){
            this.filtercol.rows = val;
            this.reload();
            this.$emit('pagehandlesizechange', val);
        },
        //换页时
        pagehandleCurrentChange(val){
            this.filtercol.page = val;
            this.reload();
            this.$emit('pagehandlecurrentchange', val);
        },
        //校验正整数
        NumberVerify(e,qty) {
            var str1 = qty.toString();
            var strQty = str1.replace(/[^\.\d]/g, '');
            var VerifyQty  = parseInt(strQty.replace('.', '') || 0);
            VerifyQty = VerifyQty==0?'':VerifyQty;
            
            var evt = document.createEvent('HTMLEvents')
            evt.initEvent('input', true, true)
            $(e.target).val(VerifyQty).get(0).dispatchEvent(evt)
        },
    },
    data() {
        return {
            selection: [],
            datasource: this.data || [],
            Tableloading:false,
            exportdialogVisible:false,//分页导出弹窗
            exportpage:1,//导出页数
            exportsize:10000,//导出条目数
            exportjsonParam:{},//导出url参数
            exportParamUrl:'',//导出url
        }
    },
    computed: {
        exportUrl(){
            return this.exportParamUrl||this.loadurl;
        },
        exportpageselect(){
            return Math.ceil(this.filtercol.total/this.exportsize);
        },
        tableColumns() {
            //return this.columns;
            if (this.columns) {
                let _cols = [];

                if (this.selectioncolumn) {
                    _cols.push({ type: 'selection', width: '45', sortable: false });
                }

                if (this.indexcolumn) {
                    _cols.push({ type: 'index', width: '60', sortable: false });
                }

                //this.columns.forEach();

                //_cols.push(this.columns);

                return _cols.concat(this.columns);
            }

            return this.columns;
        },
        tableData() {
            if (this.tree && this.datasource.length > 0) {
                // 树形表格，对数据做处理
                // 展开
                let map = {};
                this.datasource.forEach(n => {
                    if (n['_collapse'] === undefined) {
                        this.$set(n, '_collapse', this.treeCollapse);
                    }
                    n._children = [];

                    map[n.id] = n;
                });

                // 组装属性结构
                let roots = [];
                this.datasource.forEach(n => {
                    //if (n[this.treeParent] == '-1') {
                    if (this.treeRoot(n)) {
                        roots.push(n);
                    } else {
                        //map[n[this.treeParent]]._children.push(n);
                        map[eval('n.' + this.treeParent)]._children.push(n);

                        //this.$set(n, '_parent', map[n.parent]);
                        n._parent = map[eval('n.' + this.treeParent)];
                    }
                });

                let tmp = [];
                // 按照树形结构的顺序转成数组
                let fun = (parent, level) => {

                    // 级别
                    parent.level = level++;

                    tmp.push(parent);

                    // 对节点排序，让子节点中

                    parent._children = this.sinkMulti(parent._children, { children: '_children' });

                    parent._children.forEach(n => {
                        fun(n, level);
                    });
                }

                roots.forEach(root => fun(root, 0));

                return tmp;
            } else {
                return this.datasource;
            }
        },
        CurrSelection(){
            return this.$refs.table.store.states.currentRow;
        }
        
    },
    mounted() {
        // if (this.clickSelect) {
        //     // 行点击时处理当前行的选中与否
        //     this.$refs.table.$on('row-click', row => {
        //         // 当前已选中条目
        //         let selection = this.getSelection();

        //         // 找到当前行是否在已选中列表中
        //         let index = selection.findIndex(r => r.id == row.id);

        //         if (index == -1) {

        //             if (this.singleSelect && selection.length > 0) {
        //                 // 单选时，要清空之前的选中项
        //                 selection.splice(0, selection.length);
        //             }

        //             // 当前处于未选中状态，执行选中
        //             selection.push(row);
        //         } else {
        //             // 当前处于选中状态，取消选中
        //             selection.splice(index, 1);
        //         }

        //         // 触发行复选框选择事件
        //         this.onSelect(selection, row);
        //     });
        // }

        if (this.autoload && this.loadurl) {
            //this.loader.call(this);
            this.reload();
        }
    },
    watch: {
        data() {
            this.datasource = this.data;
        },
        datasource() {
            // 触发数据变化事件
            this.$emit('data-change', this.datasource);
        },
        loading(){
            this.Tableloading = this.loading;
        }

    },
    template: ' <div>'+
                    '<el-dialog :close-on-click-modal="false" title="导出" width="30%" :visible.sync="exportdialogVisible">'+
                    ' 共{{filtercol.total}} 条数据,每次导出 {{exportsize}} 条，需分 {{exportpageselect}} 批导出,<br/>现进行第'+
                    ' <el-select style="width:80px"  v-model="exportpage" placeholder="">'+
                    ' <el-option v-for="page in exportpageselect" :label="page" :value="page"></el-option>'+
                    '</el-select>'+
                    '批导出'+
                    ' <div slot="footer" class="dialog-footer">'+
                    '   <el-button @click="exportdialogVisible = false">取 消</el-button>'+
                    '   <el-button type="primary" :disabled="filtercol.total==0||Tableloading" @click="toPageExportdata">确 定</el-button>'+
                    ' </div>'+
                    '</el-dialog>'+
                    '<el-table id="s-table" :border="border" v-loading="Tableloading" element-loading-text="" highlight-current-row '+
                        'element-loading-spinner="el-icon-loading" '+
                        'element-loading-background="rgba(0, 0, 0, 0.6)" :height="height" ref="table" '+
                        ':data="tableData" style="width: 100%;font-size: 10px" '+
                        ':row-style="rowStyle" :cell-style="cellStyle" '+
                        ':span-method="spanmethod"'+
                        '@header-click="onHeaderClick" '+
                        '@row-click="onRowClick" @select="onSelect" '+
                        '@sort-change="onSortChange" @select-all="onSelectAll" @selection-change="onSelectionChange"> '+
                        '<el-table-column v-show="false" v-for="(item,index) in tableColumns" '+
                            ':type="item.type" '+
                            ':align="item.align" '+
                            ':label="item.label" '+
                            ':width="item.width" '+
                            ':prop="item.prop" '+
                            ':formatter="item.formatter"'+
                            ':show-overflow-tooltip="item.tooltip"> '+

                            '<template v-if="item.inputedit&&item.inputedit.type==0" scope="scope">'+
                            '<el-input  size="small"'+
                            ' v-model="scope.row[item.prop]"'+
                            'placeholder=""></el-input>'+
                            '</template>'+

                            '<template v-else-if="item.inputedit&&item.inputedit.type==1" scope="scope">'+
                            '<el-input  size="small"'+
                            '@keyup.native="NumberVerify($event,scope.row[item.prop])" @blur="NumberVerify($event,scope.row[item.prop])" v-model="scope.row[item.prop]"'+
                            'placeholder=""></el-input>'+
                            '</template>'+

                            '<template v-else-if="item.inputedit&&item.inputedit.type==2" scope="scope">'+
                            '<el-date-picker  size="small"  type="date" value-format="yyyy-MM-dd"'+
                            ' v-model="scope.row[item.prop]"'+
                            'placeholder=""></el-date-picker>'+
                            '</template>'+

                            '<template v-else-if="item.inputedit&&item.inputedit.type==3" scope="scope">'+
                            '<el-date-picker  size="small"  type="datetime" value-format="yyyy-MM-dd HH:mm:ss"'+
                            ' v-model="scope.row[item.prop]"'+
                            'placeholder=""></el-date-picker>'+
                            '</template>'+

                            '<template v-if="!item.type" '+
                                'slot="header" '+
                                'slot-scope="scope"> '+
                                '{{isshowlabel?item.label:""}} '+
                                '<el-tooltip v-if="item.tooltipcontent&&isshowfiltercol" class="item" effect="dark" :content="item.tooltipcontent" '+
                                'placement="top-start">'+
                                    '<el-input size="mini" @change="reload"  v-model="filtercol.param[item.prop]" '+
                                    'placeholder="" /> '+
                                '</el-tooltip>'+
                                '<el-input v-if="!item.tooltipcontent&&isshowfiltercol" size="mini" @change="reload"  v-model="filtercol.param[item.prop]" '+
                                'placeholder="" /> '+
                            '</template> '+
                        '</el-table-column>'+
                    '</el-table> '+
                    '<div class="block" v-if="isshowpage"> '+
                        '<el-pagination @size-change="pagehandleSizeChange" @current-change="pagehandleCurrentChange" '+
                        ':current-page="filtercol.page" :page-sizes="[1,20, 40, 60, 80]" '+
                        ':page-size="filtercol.rows" layout="total, sizes, prev, pager, next, jumper" '+
                        ':total="filtercol.total"> '+
                        '</el-pagination> '+
                    '</div> '+
                '</div>'
  })