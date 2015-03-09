var api = frameElement.api,oper = api.data.oper,id=api.data.id,$_form=$("#base_form");

var custParame=SYSTEM.custParame,typeList=custParame.typeList,url=rootPath+"/plan/plant";
var model = avalon.define({$id:'view',
	data:{name:"",variety:"",area:"",plant_region:"",spawning_time:"",seeding_time:"",growing_time:"",ripe_time:"",harvest_time:"",fertilizer:"",pestisaid:"",head_id:"",company_id:"",company_name:"",id:""},
    parameList:typeList,
    userList:[],
    custComboV:false,
    init:function(){},
    choosEmployee:function(e){ ///选择负责人
    	model.data.head_id=e.id;
    	model.custComboV=false;
    },
    setCompany:function(e){
    	model.data.company_id=e.id;
    },
    qryHead:function(v){
    	Public.ajaxPost(rootPath+"/sso/user/dataGrid.json",{keyword:v,status:1,_sortField:"realname",rows:9999,_sort:"asc",rows:9999},function(json){
    		model.userList=json.data.list;
    	});
    }
});

var THISPAGE = {
	init : function() {
		model.qryHead();
		this.initDom();
		this.initBtn();
	},
	initDom : function() {
		if(id!=undefined&&id!=''&&id!='undefined'){
			Public.ajaxPost(url+"/qryOp.json",{id:id}, function(json){
				if(json.status==200){
					avalon.mix(model.data,json.data);
				}else{
					parent.Public.tips({type: 1, content : json.msg});
				}
			});
		}
		THISPAGE.initEvent();
	},
	initBtn:function(){
		var e = "add" ==  api.data.oper ? [ "<i class='fa fa-save mrb'></i>保存", "关闭" ] : [ "<i class='fa fa-save mrb'></i>确定", "取消" ];
		api.button({
			id : "confirm",
			name : e[0],
			focus : !0,
			callback : function() {
				$_form.trigger("validate");
				return false
			}
		}, {
			id : "cancel",
			name : e[1]
		})
	},
	initEvent:function(){
		this.initValidator();
	},
	initValidator:function() {
		$_form.validator({
			messages : {
				required : "请填写{0}"
			},
			display : function(e) {
				return $(e).closest(".row-item").find("label").text()
			},
			valid : function() {
				postData();
			},
			ignore : ":hidden",
			theme : "yellow_bottom",
			timely : 1,
			stopOnError : true
		});
	}
};
function postData(){
	var e = "add" == oper ? "新增种植计划" : "修改种植计划";
	Public.ajaxPost(url+"/save.json",model.data.$model, function(json) {
		if (200 == json.status) {
			parent.parent.Public.tips({
				content : e + "成功！"
			});
			model.data.id=json.data.id;
			parent.model.reloadData(null);
		} else
			parent.parent.Public.tips({
				type : 1,
				content : e + "失败！" + json.msg
			});
	});
}
THISPAGE.init();