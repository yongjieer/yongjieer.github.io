 //--------方法----------//

 //获取键值对
 function getStorageValLoa(key, val) {

 	if(val != undefined) {
 		return JSON.parse(localStorage.getItem(key))[val];
 	}
 	return JSON.parse(localStorage.getItem(key));
 	//localStorage.getItem("userName")
 }
 function SetStorageValLoa(key, val) {

     if (typeof val != 'string') {
         val = JSON.stringify(val);
     }
     localStorage.setItem(key, val);
 }

 //执行回调方法
 function clickFunName(fn, args) {
 	try {
 		fn = eval(fn);
 	} catch(e) {
 		console.log(e);
 		alert(fn + '方法不存在！');
 	}
 	if(typeof fn === 'function') {
 		fn.call(this, args);
 	}
 }

 //转换下拉选数据格式
 function entityToTV(data, text, value) {
 	if(data == undefined || text == undefined || value == undefined) {
 		return "";
 	} else {
 		var attr = [];
 		for(var index in data) {
 			var item = data[index];
 			for(var key in item) { //toLowerCase()
 				item[key.toLowerCase()] = item[key];
 			}
 			attr.push({
 				"text": item[text],
 				"value": item[value]
 			});
 		}
 		return attr;
 	}

 }

 //--------方法----------//

 //--------指令----------//
 //获取焦点
 Vue.directive('focus', {
 	// 当绑定元素插入到 DOM 中。
 	inserted: function(el) {
 		// 聚焦元素
 		el.focus()
 	}
 })

 //Vue.directive('control', {
 //	// 当绑定元素插入到 DOM 中。
 //	inserted: function(el) {
 //		// 禁用元素
 //		//console.log(el)
 //		console.log(789)
 //		el.disabled=true; 
 //	}
 //})

 //控制是否禁用(依据项目任务角色控制指定类型按钮)
 Vue.directive('controls', {
     componentUpdated: function (el, binding, vnode, oldVnode, oldValue) {
         var id = binding.value;
         var oldValue = binding.oldValue;
         var type = binding.arg;
         var className = '';
         var modifiers = binding.modifiers;
         for (var key in modifiers) {
             className = key;
             break;
         }
        
         console.log(className);


         //if (!id) {
         //    return;
         //}
         if (oldValue == id) {
             return;
         }

         if (!className) {
             el.style['pointer-events'] = "none";
             el.style.opacity = 0.5;

             $.ajax('/Modules_extend/handler/AssociatedPersonnel.ashx?action=GetRoleId', {
                 data: {
                     id: id,
                     type: type
                 },
                 dataType: 'json', //服务器返回json格式数据 
                 type: 'post', //HTTP请求类型 
                 timeout: 3000, //超时时间设置为10秒;
                 success: function (data) {
                     if (data.Success) {
                         var jsonData = data.Data;
                         if (jsonData && jsonData[ElementId]) {
                             el.style['pointer-events'] = "auto";
                             el.style.opacity = 1;
                         }
                     } else {
                         console.log(data.Message);
                     }
                 },
                 error: function (xhr, type, errorThrown) {

                     //异常处理； 
                     console.log(xhr.toString());
                     console.log(type);
                     console.log(errorThrown);

                 }
             });

         } else {
             $('.' + className).each(function (index, elItem) {
                 elItem.style['pointer-events'] = "none";
                 elItem.style.opacity = 0.5;
             })
             $.ajax('/Modules_extend/handler/AssociatedPersonnel.ashx?action=GetRoleId', {
                 data: {
                     id: id,
                     type: type
                 },
                 dataType: 'json', //服务器返回json格式数据 
                 type: 'post', //HTTP请求类型 
                 timeout: 3000, //超时时间设置为10秒;
                 success: function (data) {
                     if (data.Success) {
                         var jsonData = data.Data;
                         $('.' + className).each(function (index, elItem) {
                             var ElementId = elItem.id;
                             if (ElementId) {
                                 console.log(ElementId);
                                 if (jsonData && jsonData[ElementId]) {
                                     elItem.style['pointer-events'] = "auto";
                                     elItem.style.opacity = 1;
                                 }
                             } else {
                                 elItem.style['pointer-events'] = "auto";
                                 elItem.style.opacity = 1;
                             }

                         })
                     } else {
                         console.log(data.Message);
                     }
                 },
                 error: function (xhr, type, errorThrown) {

                     //异常处理； 
                     console.log(xhr.toString());
                     console.log(type);
                     console.log(errorThrown);

                 }
             });
         }
         

         

        
     }
     
 })


 //控制是否禁用(依据系统角色控制单个按钮)
 Vue.directive('control', {
 	bind: function(el, binding, vnode) {

		
		el.style['display'] = "none";
 		//el.style['pointer-events'] = "none";
 		//el.style.opacity = 0.5;

 		var s = JSON.stringify
 		var _left = binding.arg || '';
 		var _right = "";
 		var modifiers = binding.modifiers;
 		for(var key in modifiers) {
 			_right = key;
 			break;
 		}
 		$.ajax("/ajax/Role.ashx?action=getButtonPermission", {
 			data: {
 				permissionItemCode: _left + '.' + _right
 			},
 			dataType: 'json', //服务器返回json格式数据 
 			type: 'post', //HTTP请求类型 
 			timeout: 3000, //超时时间设置为10秒;
 			success: function(data) {
 				if(data.Success) {
					el.style['display'] = "initial";
					
					//el.style['pointer-events'] = "auto";
					//el.style.opacity = 1;
					
					//el.classList.remove("is-disabled")
					//el.removeAttribute('disabled'); 
 				} else {
					el.style['display'] = "none";

					//el.style['pointer-events'] = "none";
					//el.style.opacity = 0.5;

					//el.classList.add("is-disabled")
					//el.setAttribute('disabled','disabled'); 
 				}
 			},
 			error: function(xhr, type, errorThrown) {
				el.style['display'] = "none";

 				//el.style['pointer-events'] = "none";
 				//el.style.opacity = 0.5;
 				//异常处理； 
 				console.log(xhr.toString());
 				console.log(type);
 				console.log(errorThrown);

 			}
 		});
 	}
 })

 //下拉选
 Vue.directive('picker', {
 	bind: function(el, binding, vnode) {
 		console.log(el)
 		
 		var EnumValue = ''; //存储值

 		var modifiers = binding.modifiers;
 		for(var key in modifiers) {
 			EnumValue = key.toLowerCase();
 			break;
 		}
 		
 		console.log(EnumValue)
 		var ShowValue = binding.arg.toLowerCase(); //显示值

 		//若为空,则显示值作为实际存储值
 		if(EnumValue == '') {
 			EnumValue = ShowValue;
 		}

 		var fun = binding.value.fun; //回调方法

 		var val = binding.value.val; //json对象

 		var url = binding.value.url; //数据url

 		var datas = binding.value.datas; //数据集合

 		var picker = new mui.PopPicker();

 		if(datas) {
 			el.addEventListener('click', function(event) {
 				picker.setData(datas);
 				picker.show(function(selectItems) {

 					clickFunName(fun, {
 						val: val,
 						selectItems: selectItems[0]
 					});
 					//item['ObsoleteReason'] = selectItems[0].text;

 				})
 			}, false);
 		} else if(url) {
 			console.log(url)
 			mui.ajax(url, {
 				data: { 

 				},
 				dataType: 'json', //服务器返回json格式数据 
 				type: 'get', //HTTP请求类型 
 				timeout: 5000, //超时时间设置为10秒；
 				success: function(data) {
 					if(data.Success) {
 						
 						el.addEventListener('click', function(event) {
 							picker.setData(entityToTV(data.Data, ShowValue, EnumValue));
 							picker.show(function(selectItems) { 

 								clickFunName(fun, {
 									val: val,
 									selectItems: selectItems[0]
 								});
 								//item['ObsoleteReason'] = selectItems[0].text;

 							})
 						}, false);

 					} else {
 						mui.toast(data.Message);
 					}
 				},
 				error: function(xhr, type, errorThrown) {
 					mui.toast("请求超时!");
 					console.log(type);
 				}
 			});
 		}

 	}
 })

Vue.directive('pickerrow', {
 	bind: function(el, binding, vnode) {
 		console.log(el)
 		
 		var EnumValue = ''; //存储值

 		var modifiers = binding.modifiers;
 		
 		console.log(JSON.stringify(modifiers));
 		
 		for(var key in modifiers) {
 			EnumValue = key.toLowerCase();
 			console.log(EnumValue)
 			break;
 		}
 		var ShowValue = binding.arg!=undefined?binding.arg.toLowerCase():""; //显示值 

 		//若为空,则显示值作为实际存储值
 		if(EnumValue == '') {
 			EnumValue = ShowValue;
 		}
 		console.log(EnumValue)
 		console.log(ShowValue)
 		
 		var fun = binding.value.fun; //回调方法

 		var val = binding.value.val; //json对象

 		var url = binding.value.url; //数据url

 		var datas = binding.value.datas; //数据集合
 		
 		console.log(99999) 
 		console.log(JSON.stringify(datas)) 
 		 
 		var picker = new mui.PopPicker();

 		if(datas) {
 			el.addEventListener('click', function(event) {
 				picker.setData(datas);
 				picker.show(function(selectItems) {

 					clickFunName(fun, {
 						val: val,
 						selectItems: selectItems[0]
 					});
 					//item['ObsoleteReason'] = selectItems[0].text;

 				})
 			}, false);
 		} else if(url) {
 			console.log(url)
 			mui.ajax(url, {
 				data: {

 				},
 				dataType: 'json', //服务器返回json格式数据 
 				type: 'get', //HTTP请求类型 
 				timeout: 5000, //超时时间设置为10秒；
 				success: function(data) {
 					if(data) {
 						
 						el.addEventListener('click', function(event) {
 							picker.setData(entityToTV(data.rows||data.Data, ShowValue, EnumValue));
 							picker.show(function(selectItems) { 

 								clickFunName(fun, {
 									val: val,
 									selectItems: selectItems[0]
 								});
 								//item['ObsoleteReason'] = selectItems[0].text;

 							})
 						}, false);

 					} else {
 						mui.toast(data.Message);
 					}
 				},
 				error: function(xhr, type, errorThrown) {
 					mui.toast("请求超时!");
 					console.log(type);
 				}
 			});
 		}

 	}
 })

 //控制是否禁用(获取浏览器缓存权限控制单个按钮)
 Vue.directive('controll', {
 	bind: function(el, binding, vnode) {

 		//el.style['pointer-events'] = "none";
		 //el.style.opacity = 0.2;
		 
		el.style['display'] = "none";

 		var s = JSON.stringify
 		var _left = binding.arg || '';
 		var _right = "";
 		var modifiers = binding.modifiers;
 		for(var key in modifiers) {
 			_right = key;
 			break;
 		}

		var fal = getStorageValLoa("Permission", _left + '.' + _right);
 		if(fal) {
 			//el.style['pointer-events'] = "auto";
			 //el.style.opacity = 1;
			el.style['display'] = "initial";

 		} else {
 			//el.style['pointer-events'] = "none";
 			//el.style['background-color'] = '#9E9E9E';
			 //el.style.opacity = 0.5;
			el.style['display'] = "none";

 		}
 	}
 })


 //--------指令----------//

 //--------组件----------//
 // 注册
 Vue.component('Test', {
 	template: '<h1>自定义组件!</h1>'
 })
 //--------组件----------//
