var url=rootPath+"/plan/material",gridQryUrl=url+"/dataGrid.json",custParame=SYSTEM.custParame,typeList=custParame.typeList;
var frame_name ="生产资料计划";
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
				name:"number",
				label:"数量",
				align:"center",
				sortable:true,
				width:100,
				title:false
			}, {
				name:"unit",
				label:"单位",
				align:"center",
				width:100,
				sortable:true,
				title:false
			}, {
				name:"use",
				label:"用途",
				align:"center",
				width:100,
				sortable:true,
				title:false
			}, {
				name:"input",
				label:"预计投入",
				align:"center",
				width:100,
				sortable:true,
				title:false
			}, {
				name:"buy_time",
				label:"采购时间",
				align:"center",
				width:100,
				sortable:true,
				title:false
			}, {
				name:"buy_company_name",
				label:"厂家",
				align:"center",
				width:100,
				sortable:true,
				title:false
			},{
				name:"head_name",
				label:"负责人",
				sortable:true,
				align:"center",
				width:100,
				title:false
			} , {
				name:"mobile",
				label:"负责人电话",
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
				var i = "新增"+frame_name, r = {oper:e};
			else
				var i = "修改"+frame_name, r = {oper:e,id:t};
			
			$.dialog({title:i,content:"url:"+url+"/edit.html",
				data:r,width:900,height:280,max:true,resize:true,min :false,cache :false,lock :true
			})
	},
	view:function(id){
		$.dialog({id:"dialog1",width:800,height :280,min:true,max:true,
			title:"查看"+frame_name,button:[{name:"关闭"	} ],resize:true,lock:true,
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
		},null,null,rootPath);
	}
});
model.init();