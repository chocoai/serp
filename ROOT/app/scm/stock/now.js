var url=rootPath+"/scm/stock",gridQryUrl=url+"/dataGrid.json";
var model = avalon.define({$id:'view',data:{keyword : "",category_id:"",depot_id:"-1"},depotList:[]});
var THISPAGE = {
	init : function() {
		this.loadGrid();
		this.addEvent()
		Public.ajaxPost(rootPath+"/scm/depot/list.json",{},function(json){
			model.depotList=json.data;
		});
	},
	loadGrid : function() {
		var i = Public.setGrid();
		function custParame(v,e,r){
			return SYSTEM.custParame[v].name;
		}
		$("#grid").jqGrid({
			url : gridQryUrl,
			postData : model.data.$model,
			datatype : "json",
			mtype:'POST',
			autowidth : true,
			height : i.h,
			altRows : true,
			gridview : true,rownumbers:true,
			colModel : [ {
				name : "category",
				label : "类别",formatter:custParame,
				align : "center",sortable:true,
				title : true
			}, {
				name : "billsn",
				label : "商品编号",
				align : "center",sortable:true,
				title : true
			}, {
				name : "product_name",
				label : "商品名称",
				align : "center",sortable:true,
				title : true
			}, {
				name : "model",
				label : "商品型号",
				align : "center",sortable:true,
				title : true
			}, {
				name : "unit",
				label : "计量单位",
				align : "center",formatter:custParame,
				width:100,
				title : true
			}, {
				name : "depot_name",
				label : "仓库",
				align : "center",
				width:100,
				title : false
			}, {
				name : "amount",
				label : "库存",
				align : "center",
				width:100,
				title : false
			} ],
			cmTemplate : {
				sortable : false,
				title : false
			},
			page : 1,
			sortname : "product_name",
			sortorder : "asc",
			pager : "#page",
			rowNum : 50,
			rowList : [ 50,100, 200 ],
			viewrecords : true,
			shrinkToFit : false,
			forceFit : false,
			jsonReader : {
				root : "data.list",
				records : "data.totalRow",
				total:"data.totalPage",
				page:"data.pageNumber",
				repeatitems : false,
				id : "id"
			},
			loadError : function() {
				parent.Public.tips({
					type : 1,
					content :"加载数据异常！"
				})
			},
			ondblClickRow : function(t) {
				$("#" + t).find(".fa-eye").trigger("click")
			}
		})
	},
	reloadData : function() {
		$("#grid").jqGrid("setGridParam", {
			url : gridQryUrl,
			datatype : "json",mtype:'POST',
			postData :model.data.$model
		}).trigger("reloadGrid");
	},
	addEvent : function() {
		Public.dateCheck();
		$("#search").click(function() {THISPAGE.reloadData();});
		/**商品类别combo START*/
		var r = $("#category");
		var i=Public.comboTree(r,{url:rootPath+'/sso/parame/tree.json',postData:{type:0},
				callback : {
					beforeClick : function(e, t) {
						r.val(t.name);r.data("pid", t.id);
						model.data.category_id=t.id;
						i.hide();
					}
				}
			});
		/**商品类别combo END*/
		/**仓库 START*/
		var $depot=$("#depot");
		$depot.combo(
					{
						data : rootPath+"/scm/depot/list.json",
						value : "id",
						text : "name",
						width : 210,
						defaultSelected:"",//$depot.data("defItem")||"",
						editable :true,
						ajaxOptions : {
							formatData : function(e) {
								if (200 == e.status) {
									e.data.unshift({
										id:"",
										name : "（空）"
									});
									return e.data
								}
								return []
							},callback: {
								onChange: function(data){
									model.data.depot_id=data.id;
									alert(data.id);
								},
								onListClick: function(){
								}
							}
						}
					}).getCombo();
		/**仓库 END*/
		
		$(window).resize(function() {
			Public.resizeGrid()
		})
	}
};
THISPAGE.init();