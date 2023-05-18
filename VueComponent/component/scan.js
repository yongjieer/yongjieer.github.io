Vue.component('s-scan', {
	// 声明 props
	props: {
		isrecognize: {
			type: Boolean,
			default: false
		},
		scan: {
			type: Object,
			default: function(ret) {
				return null;
			}
		}
	},
	methods: {
		//      CloneObj: function (obj) {
		//          var _this = this;
		//          var newObj = {};
		//          if (obj instanceof Array) {
		//              newObj = [];
		//          }
		//          for (var key in obj) {
		//              var val = obj[key];
		//              //newObj[key] = typeof val === 'object' ? arguments.callee(val) : val; //arguments.callee 在哪一个函数中运行，它就代表哪个函数, 一般用在匿名函数中。  
		//              newObj[key] = val;
		//          }
		//          return newObj;
		//      },
		onSortChange(args) {
			// 排序发生变化的事件
			this.$emit('sort-change', args);
		},
		startRecognize: function(e) {
			var _this = this;
			this.isrecognize = false;
			_this.scan = null; //扫描对象
			if(_this.scan != null) {
				_this.scan.start();
				return;
			}
			try {
				var filter = [plus.barcode.QR, plus.barcode.CODE128, plus.barcode.CODE93, plus.barcode.CODE39, plus.barcode.EAN13, plus.barcode.EAN8];
				//自定义的扫描控件样式
				var styles = {
					frameColor: "#29E52C",
					scanbarColor: "#29E52C",
					background: ""
				}
				//扫描控件构造
				_this.scan = new plus.barcode.Barcode('body', filter, styles);
				_this.scan.onmarked = _this.onmarked;
				_this.scan.onerror = function(e){
					alert(e);
				};
				_this.scan.start();
				//打开关闭闪光灯处理
				var flag = false;
				//					document.getElementById("turnTheLight").addEventListener('tap', function() {
				//						if(flag == false) {
				//							_this.scan.setFlash(true);
				//							flag = true;
				//						} else {
				//							_this.scan.setFlash(false);
				//							flag = false;
				//						}
				//					});
			} catch(e) {
				alert("出现错误啦:\n" + e);
			}
		},
		onmarked:function (type, result) {
			//vue.cccode = result;
			this.close();
			scan = null;
			this.isrecognize = true;
			this.$emit('onmarked', result);
			//				mui.confirm('确认添加' + result, '提示', ['是', '否'], function(e) {
			//					e.index == 0 ? mui.toast('success!') : mui.toast('error!')
			//				})

		}
	},
	data() {
		return {
			//scan: null,
		}
	},
	computed: {

	},
	mounted() {

	},
	watch: {
		//      data() {
		//          this.datasource = this.data;
		//      },
		//      datasource() {
		//          // 触发数据变化事件
		//          this.$emit('data-change', this.datasource);
		//      },
		//      loading(){
		//          this.Tableloading = this.loading;
		//      }

	},
	template: ' <div>'+
	'<span v-show="isrecognize" style="color:#009BFF;font-size: 2em;margin-top: 0.1em;" @click="startRecognize($event)"    class="mui-icon   iconfont icon-saomiao"></span>' +
		'<span v-show="!isrecognize" style="color:#009BFF;font-size: 2em;margin-top: 0.1em;"  class="mui-icon mui-icon-spinner-cycle mui-spin"></span>'+
		'</div>'
})