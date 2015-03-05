var api = frameElement.api,oper = api.data.oper,id=api.data.id,$_form=$("#base_form"),url=rootPath+"/plan/plant";
var model = avalon.define({$id:'view',
	data:{name:"",variety:"",area:"",plant_region:"",spawning_time:"",seeding_time:"",growing_time:"",ripe_time:"",harvest_time:"",fertilizer:"",pestisaid:"",username:"",company_id:"",company_name:"",id:"",mobile:""},
    tabActive:0,
    showTab:function(i,b){
    	model.tabActive=i;
    }
});
model.data.$watch("$all",function(name,a,b){
	if(b==null||b=="null"){
		eval("model.data."+name+"='';");
	}
});

var THISPAGE = {
	init : function() {
		this.initDom();
	},
	initDom : function() {
		if(id!=undefined&&id!=''&&id!='undefined'){
			Public.ajaxPost(url+"/qryOp.json",{id:id}, function(json){
				if(json.status==200){
					model.data=json.data;
				}else{
					parent.Public.tips({type: 1, content : json.msg});
				}
			});
		}
	}
};
THISPAGE.init();