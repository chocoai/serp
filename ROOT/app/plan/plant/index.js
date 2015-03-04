var url=rootPath+"/plan/plant",gridQryUrl=url+"/dataGrid.json",custParame=SYSTEM.custParame,typeList=custParame.typeList;
var order_type=["种植计划","采购退货单","销售订单","销售退货单","报价"],audit_status=["未提交","待审核","通过","拒绝"],order_name=order_type[type],
audit_hidden=(type<=1||((type==2&&SYSTEM.company.config.p_sale_audit=="false")||(type==3&&SYSTEM.company.config.p_saletui_audit=="false")));
var model = avalon.define({$id:'view',
	query:{keyword:"",start_date:SYSTEM.beginDate,end_date:SYSTEM.endDate,status:"",ordertype:type,is_deleted:0,qryType:5,pay_status:""},
	parameList:typeList,
	fastQryText:"快速查询",
	fastQry:[
		       {text:"我创建的",sl:false},
		       {text:"我负责的",sl:false},
		       {text:"下属创建的",sl:false},
		       {text:"下属负责的",sl:false},
		       {text:"回收站",sl:false},
		       {text:"",sl:true},
		       ],
	qry:function(type){
		model.query.qryType=type;
		if(type==4){
			model.query.is_deleted=1;
			model.query.qryType=-1;//查看自己的回收站信息
			model.fastQryText="回收站";
			model.query.pay_status="";
		}else if(type>5){//支付情况
			model.fastQryText=model.fastQry[type].text;
			model.query.pay_status=type-6;
			model.query.qryType=5;
			model.query.is_deleted=0;
		}else{
			model.fastQryText=model.fastQry[type].text;
			model.query.is_deleted=0;
			model.query.pay_status="";
		}
		model.reloadData();
	},
	init:function() {
		$(".ui-datepicker-input").datepicker();
		this.loadGrid();
		this.addEvent()
	},
	resetQry:function(){
		model.query={keyword:"",start_date:SYSTEM.beginDate,end_date:SYSTEM.endDate,status:"",ordertype:type};
		model.reloadData();
	},
	loadGrid:function() {
				function t(val, opt, row) {
					var html_con = '<div class="operating" data-id="'+ row.id+'"><span class="fa fa-eye mrb" title="查看"></span>';
						html_con+='<span class="fa fa-edit mrb" title="修改"></span>';
						html_con+='<span class="fa fa-trash-o mrb del" title="删除"></span>';
					html_con+='</div>';
					return html_con;
				}
		var i = Public.setGrid();
		$("#grid").jqGrid({
			url:gridQryUrl,
			postData:model.query.$model,
			datatype:"json",
			mtype:'POST',
			autowidth:true,
			height:i.h,
			altRows:true,
			gridview:true,
			rownumbers:true,
			multiselect:true,
			multiboxonly:true,
			colModel:[ {
				name:"operating",
				label:"操作",
				fixed:true,width:150,
				formatter:t,
				align:"center",
				title:false
			}, {
				name:"name",
				label:"名称",
				align:"center",
				width:100,sortable:true,
				title:false
			}, {
				name:"variety",
				label:"品种",
				align:"center",
				width:100,sortable:true,
				title:false
			}, {
				name:"area",
				label:"面积",
				align:"center",sortable:true,
				width:100,
				title:false
			}, {
				name:"plant_region",
				label:"种植区域",
				align:"center",
				width:100,sortable:true,
				title:false
			}, {
				name:"spawning_time",
				label:"育种时间",
				align:"center",
				width:100,sortable:true,
				title:false
			}, {
				name:"seeding_time",
				label:"播种时间",
				align:"center",
				width:100,sortable:true,
				title:false
			}, {
				name:"growing_time",
				label:"生长时间",
				align:"center",
				width:100,sortable:true,
				title:false
			}, {
				name:"ripe_time",
				label:"成熟时间",
				align:"center",sortable:true,
				width:100,sortable:true,
				title:false
			}, {
				name:"harvest_time",
				label:"采摘时间",sortable:true,
				align:"center",
				width:100,
				title:false
			}, {
				name:"fertilizer",
				label:"肥料投入",sortable:true,
				align:"center",
				width:100,
				title:false
			}, {
				name:"pestisaid",
				label:"农药投入",sortable:true,
				align:"center",
				width:100,
				title:false
			}, {
				name:"head_name",
				label:"管理人",sortable:true,
				align:"center",
				width:100,
				title:false
			} , {
				name:"mobile",
				label:"电话",sortable:true,
				align:"center",
				width:100,
				title:false
			}],
			cmTemplate:{
				sortable:false,
				title:false
			},
			page:1,
			sortname:"create_datetime",
			sortorder:"desc",
			pager:"#page",
			rowNum:10,
			rowList:[ 10,100, 200 ],
			viewrecords:true,
			shrinkToFit:false,
			forceFit:false,
			jsonReader:{
				root:"data.list",
				records:"data.totalRow",
				repeatitems:false,
				id:"id"
			},
			loadError:function() {
				parent.Public.tips({
					type:1,
					content :"加载数据异常！"
				})
			},
			ondblClickRow:function(t) {
				model.view(t);
			}
		})
	},
	reloadData:function() {
		$("#grid").jqGrid("setGridParam", {
			url:gridQryUrl,
			datatype:"json",mtype:'POST',
			postData:model.query.$model
		}).trigger("reloadGrid");
	},
	addEvent:function() {
		Public.dateCheck();
		var t = this;
		$(".grid-wrap").on("click", ".fa-eye", function(t) {
			t.preventDefault();
			var e = $(this).parent().data("id");
			model.view(e);
		});
		
		$(".grid-wrap").on("click", ".fa-edit", function(e) {
			e.preventDefault();
			if (Business.verifyRight("TD_UPDATE")) {
				var t = $(this).parent().data("id");
				model.operate("edit", t)
			}
		});
		
		$(".grid-wrap").on("click", ".fa-trash-o", function(t) {
			t.preventDefault();
			if (Business.verifyRight("BU_DELETE")) {
				var e = $(this).parent().data("id");
				if(model.query.qryType==4)
					model.del(e);
				else
					model.trash(e);
			}
		});
		$(".grid-wrap").on("click", ".del", function(t) {
			t.preventDefault();
			if (Business.verifyRight("BU_DELETE")) {
				var e = $(this).parent().data("id");
					model.del(e);
			}
		});
		$(".grid-wrap").on("click", ".fa-reply", function(t) {
			t.preventDefault();
				var e = $(this).parent().data("id");
					model.reply(e);
		});
		$(".grid-wrap").on("click", ".submit", function(t) {
			t.preventDefault();
			var e = $(this).parent().data("id");
			model.submit(e);
		});
		$("#add").click(function(t) {
			t.preventDefault();
			if(Business.verifyRight("TF_ADD")){
				model.operate('add');
			}
		});
		$("#btn-batchDel").click(function(e) {
			e.preventDefault();
			if (Business.verifyRight("BU_DELETE")) {
				var t = $("#grid").jqGrid("getGridParam", "selarrrow");
				t.length ? 
						((model.query.qryType==4)?model.del(t.join()):model.trash(t.join()))
						:parent.Public.tips({
					type:2,
					content:"请选择需要删除的项"
				})
			}
		});
		$("#btn-batchReply").click(function(e) {
			e.preventDefault();
				var t = $("#grid").jqGrid("getGridParam", "selarrrow");
				if(t.length){
						model.reply(t.join());
				}else
					parent.Public.tips({type:2,content:"请选择需要恢复的"+order_name});
		});
		$(window).resize(function() {
			Public.resizeGrid()
		})
	},
	operate:function(e, t) {
			if ("add" == e)
				var i = "新增"+order_type[type], r = {oper:e};
			else
				var i = "修改"+order_type[type], r = {oper:e,id:t};
			
			$.dialog({title:i,content:"url:"+url+"/edit.html",
				data:r,width:900,height:280,max:true,resize:true,min :false,cache :false,lock :true
			})
	},
	view:function(id){
		$.dialog({id:"dialog1",width:900,height :700,min:true,max:true,
			title:"查看"+order_type[type],button:[{name:"关闭"	} ],resize:true,lock:true,
			content:"url:"+url+"/view.html",data:{id:id,type:type}});
	},
	reply:function(e) {
			Public.ajaxPost(url + "/reply.json", {id:e}, function(t) {
				if (t && 200 == t.status) {
					parent.Public.tips({type:2,content:t.msg});
					model.reloadData();
				} else
					parent.Public.tips({type:1,content:"恢复"+order_name+"失败！" + t.msg})
			});
	},
	trash:function(e) {
			Public.ajaxPost(url + "/trash", {id:e}, function(t) {
				if (t && 200 == t.status) {
					parent.Public.tips({type:2,content:t.msg});
					model.reloadData();
				} else
					parent.Public.tips({type:1,content:"删除"+order_name+"失败！" + t.msg});
			});
	},
	del:function(id) {
		$.dialog.confirm("删除的"+order_type[type]+"将不能恢复，请确认是否删除？", function() {
			Public.ajaxPost(url+"/del.json", {
				id:id
			}, function(t) {
				if (t && 200 == t.status) {
					parent.Public.tips({type:2,content:t.msg});
					model.reloadData();
				} else{
					parent.Public.tips({type:1,content:"删除"+order_type[type]+"失败！请检查是否被引用！" + t.msg});
				}
			})
		});
	},
	submit:function(id) {
		$.dialog.confirm("提交"+order_type[type]+"后将不能修改，且生成应收应付单，请确认是否提交？", function() {
			Public.ajaxPost(url+"/submit.json", {id:id}, function(t) {
				if (t && 200 == t.status) {
					parent.Public.tips({type:2,content:t.msg});
					model.reloadData();
				} else{
					parent.Public.tips({type:1,content:"提交"+order_type[type]+"失败！" + t.msg});
				}
			})
		});
	}
});
model.init();