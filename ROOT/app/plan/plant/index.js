var url=rootPath+"/plan/plant",gridQryUrl=url+"/dataGrid.json",custParame=SYSTEM.custParame,typeList=custParame.typeList;
var frame_name ="种植计划";
var model = avalon.define({$id:'view',
	query:{keyword:"",start_date:SYSTEM.beginDate,end_date:SYSTEM.endDate},
	parameList:typeList,
	fastQryText:"快速查询",
	init:function() {
		$(".ui-datepicker-input").datepicker();
		this.loadGrid();
		this.addEvent()
	},
	resetQry:function(){
		model.query={keyword:"",start_date:SYSTEM.beginDate,end_date:SYSTEM.endDate};
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
				fixed:true,
				width:150,
				formatter:t,
				align:"center",
				title:false
			}, {
				name:"name",
				label:"名称",
				align:"center",
				width:100,
				sortable:true,
				title:false
			}, {
				name:"variety",
				label:"品种",
				align:"center",
				width:100,
				sortable:true,
				title:false
			}, {
				name:"area",
				label:"面积",
				align:"center",
				sortable:true,
				width:100,
				title:false
			}, {
				name:"plant_region",
				label:"种植区域",
				align:"center",
				width:100,
				sortable:true,
				title:false
			}, {
				name:"spawning_time",
				label:"育种时间",
				align:"center",
				width:100,
				sortable:true,
				title:false
			}, {
				name:"seeding_time",
				label:"播种时间",
				align:"center",
				width:100,
				sortable:true,
				title:false
			}, {
				name:"growing_time",
				label:"生长时间",
				align:"center",
				width:100,
				sortable:true,
				title:false
			}, {
				name:"ripe_time",
				label:"成熟时间",
				align:"center",
				width:100,
				sortable:true,
				title:false
			}, {
				name:"harvest_time",
				label:"采摘时间",
				sortable:true,
				align:"center",
				width:100,
				title:false
			}, {
				name:"fertilizer",
				label:"肥料投入",
				sortable:true,
				align:"center",
				width:100,
				title:false
			}, {
				name:"pestisaid",
				label:"农药投入",
				sortable:true,
				align:"center",
				width:100,
				title:false
			}, {
				name:"head_name",
				label:"管理人",
				sortable:true,
				align:"center",
				width:100,
				title:false
			} , {
				name:"mobile",
				label:"电话",
				sortable:true,
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
			rowNum:50,
			rowList:[ 50,100, 200 ],
			viewrecords:true,
			shrinkToFit:false,
			forceFit:false,
			jsonReader:{
				root:"data.list",
				total:"data.totalPage",
				page:"data.pageNumber",
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
			datatype:"json",
			mtype:'POST',
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
		
		
		$(".grid-wrap").on("click", ".del", function(t) {
			t.preventDefault();
			if (Business.verifyRight("BU_DELETE")) {
				var e = $(this).parent().data("id");
					model.del(e);
			}
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
				t.length ? model.del(t.join()):parent.Public.tips({
								type:2,
								content:"请选择需要删除的项"
							});
			}
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
		$.dialog({id:"dialog1",width:800,height :280,min:true,max:true,
			title:"查看"+order_type[type],button:[{name:"关闭"	} ],resize:true,lock:true,
			content:"url:"+url+"/view.html",data:{id:id,type:type}});
	},
	trash:function(e) {
			Public.ajaxPost(url + "/trash", {id:e}, function(t) {
				if (t && 200 == t.status) {
					parent.Public.tips({type:2,content:t.msg});
					model.reloadData();
				} else
					parent.Public.tips({type:1,content:"删除"+frame_name+"失败！" + t.msg});
			});
	},
	del:function(id) {
		$.dialog.confirm("删除的"+frame_name+"将不能恢复，请确认是否删除？", function() {
			Public.ajaxPost(url+"/del.json", {
				id:id
			}, function(t) {
				if (t && 200 == t.status) {
					parent.Public.tips({type:2,content:t.msg});
					model.reloadData();
				} else{
					parent.Public.tips({type:1,content:"删除"+frame_name+"失败！请检查是否被引用！" + t.msg});
				}
			})
		});
	}
});
model.init();