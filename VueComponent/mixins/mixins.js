Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
Vue.prototype.ajax = $.ajax;
//----------------导出到excel----------------
var idTmr;

function ExportToExcel(tableid) {
    if (getExplorer() == 'ie') {
        var curTbl = document.getElementById(tableid);
        var oXL;
        try {
            oXL = new ActiveXObject("Excel.Application"); //创建AX对象excel  
        } catch (e) {
            alert("无法启动Excel!\n\n如果您确信您的电脑中已经安装了Excel，" + "那么请调整IE的安全级别。\n\n具体操作：\n\n" + "工具 → Internet选项 → 安全 → 自定义级别 → 对没有标记为安全的ActiveX进行初始化和脚本运行 → 启用");
            return false;
        }
        var oWB = oXL.Workbooks.Add();
        var xlsheet = oWB.Worksheets(1);
        var sel = document.body.createTextRange();
        sel.moveToElementText(curTbl);
        sel.select();
        sel.execCommand("Copy");
        xlsheet.Paste();
        oXL.Visible = true;

        try {
            var fname = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");
        } catch (e) {
            print("Nested catch caught " + e);
        } finally {
            oWB.SaveAs(fname);
            oWB.Close(savechanges = false);
            oXL.Quit();
            oXL = null;
            idTmr = window.setInterval("Cleanup();", 1);
        }

    }
    else {
        tableToExcel(tableid)
    }
}
//获取浏览器种类
function getExplorer() {
    var explorer = window.navigator.userAgent;
    //ie  
    if (explorer.indexOf("MSIE") >= 0) {
        return 'ie';
    }
        //firefox  
    else if (explorer.indexOf("Firefox") >= 0) {
        return 'Firefox';
    }
        //Chrome  
    else if (explorer.indexOf("Chrome") >= 0) {
        return 'Chrome';
    }
        //Opera  
    else if (explorer.indexOf("Opera") >= 0) {
        return 'Opera';
    }
        //Safari  
    else if (explorer.indexOf("Safari") >= 0) {
        return 'Safari';
    }
}

function Cleanup() {
    window.clearInterval(idTmr);
    CollectGarbage();
}
var tableToExcel = (function () {
    var uri = 'data:application/vnd.ms-excel;base64,',
            template = '<html><head><meta charset="UTF-8"></head><body><table>{table}</table></body></html>',
            base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) },
            format = function (s, c) {
                return s.replace(/{(\w+)}/g,
                        function (m, p) { return c[p]; })
            }
    return function (table, name) {
        if (!table.nodeType) table = document.getElementById(table)
        var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
        console.log(ctx)
        window.location.href = uri + base64(format(template, ctx))
    }
})()
//-----------------导出到excel-------------------


//-----------------导出到Word-------------------
//指定页面区域内容导入
function ExportToWord(controlId) {
    var control = document.getElementById(controlId);
    try {
        var oWD = new ActiveXObject("Word.Application");
        var oDC = oWD.Documents.Add("", 0, 1);
        var oRange = oDC.Range(0, 1);
        var sel = document.body.createTextRange();
        try { sel.moveToElementText(control); }
        catch (notE) {
            alert("导出数据失败，没有数据可以导出。");
            window.close();
            return;
        }
        sel.select();
        sel.execCommand("Copy");
        oRange.Paste();
        oWD.Application.Visible = true;
        //window.close();
    }
    catch (e) {
        alert("导出数据失败，需要在客户机器安装Microsoft Office Word(不限版本)，将当前站点加入信任站点，允许在IE中运行ActiveX控件。");
        try { oWD.Quit(); } catch (ex) { }
        //window.close();
    }
}
//-----------------导出到Word-------------------





Vue.mixin({
    methods: {
         //表单提交校验
         $SubmitFormVerify: function (formName) {
            var falg = false;
            this.$refs[formName].validate((valid) => {
                console.log(valid)
                if (valid) {
                    falg = true;
                } else {
                    falg = false;
                }
            });
            return falg;
        },
        $getParam: function (val) {
            var request = {
                QueryString: function (val) {
                    var uri = window.location.search;
                    var re = new RegExp("" + val + "\=([^\&\?]*)", "ig");
                    return ((uri.match(re)) ? (uri.match(re)[0].substr(val.length + 1)) : null);
                },
            }
            var v = request.QueryString(val);
            return v;
        },
        $getStorageVal(key, val){
            if (val != undefined) {
                return JSON.parse(localStorage.getItem(key))[val];
            }
            return JSON.parse(localStorage.getItem(key));
        },
         //开启全局Loading
         $OpenGlobalLoading() {
            this.GlobalLoading = this.$loading({
                lock: true,
                text: '',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
        },
        //关闭全局Loading
        $CloseGlobalLoading: function () {
            this.GlobalLoading.close();
        },
        //导出到excel(少量数据)
        // $ExportToExcel(docId){
        //     ExportToExcel(docId);
        // },
        //直接导出数据,导出到excel(大量数据)
        $ExportDataToExcel({docId,fileName=Date.parse(new Date()),SheetName='Sheet1'}={}){
            fileName = fileName+".xlsx";
            //var filename = "分选报表"+Date.parse(new Date())+".xls";
            var workbook = XLSX.utils.book_new();
            var ws1 = XLSX.utils.table_to_sheet(document.getElementById(docId), { raw: true });
            XLSX.utils.book_append_sheet(workbook, ws1, SheetName);
            //XLSX.utils.book_append_sheet(workbook, ws1, "Sheet2");
            XLSX.writeFile(workbook, fileName); //导出Excel
        },
        //返回excel模板
        $GetExportExcelModel(){
            var workbook = XLSX.utils.book_new();
            return workbook;
        },
        //添加excel Sheet页签
        $AddWorkbookSheet(_document,_workbook,_sheetName){
            var _dom;
            if(typeof _document=='string'){
                _dom = document.getElementById(_document);
            }else{
                _dom = _document;
            }
            var ws1 = XLSX.utils.table_to_sheet(_dom, { raw: true });
            XLSX.utils.book_append_sheet(_workbook, ws1, _sheetName);
        },
        //导出excel
        $ExportExcelByWorkbook(_workbook,_fileName){
            _fileName = _fileName||Date.parse(new Date());
            _fileName = _fileName+".xlsx";
            XLSX.writeFile(_workbook, _fileName); //导出Excel
        },
        //导出到word
        $ExportToWord(docId){
            ExportToWord(docId);
        },
        $formatZero(num, len) {
            if(String(num).length > len) return num;
            return (Array(len).join(0) + num).slice(-len);
        },
        $dataURLtoBlob(dataurl) {
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], { type: mime });
        },
        $downloadFile(url,name='11'){
            var a = document.createElement("a")
            a.setAttribute("href",url)
            a.setAttribute("download",name)
            a.setAttribute("target","_blank")
            let clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("click", true, true);  
            a.dispatchEvent(clickEvent);
        },
        $downloadFileByBase64(base64,name){//将base64编码下载为图片
            var myBlob = this.$dataURLtoBlob(base64)
            var myUrl = URL.createObjectURL(myBlob)
            this.$downloadFile(myUrl,name)
        },
        $getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
            //compatibility for firefox and chrome
            var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
            var pc = new myPeerConnection({
                iceServers: []
            }),
            noop = function() {},
            localIPs = {},
            ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
            key;
        
            function iterateIP(ip) {
                if (!localIPs[ip]) onNewIP(ip);
                localIPs[ip] = true;
            }
        
             //create a bogus data channel
            pc.createDataChannel("");
        
            // create offer and set local description
            pc.createOffer().then(function(sdp) {
                sdp.sdp.split('\n').forEach(function(line) {
                    if (line.indexOf('candidate') < 0) return;
                    line.match(ipRegex).forEach(iterateIP);
                });
                
                pc.setLocalDescription(sdp, noop, noop);
            }).catch(function(reason) {
                // An error occurred, so handle the failure to connect
            });
        
            //listen for candidate events
            pc.onicecandidate = function(ice) {
                if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
                ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
            };
        }
    },
    created: function () {
      
    }
  })