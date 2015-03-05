var api = frameElement.api,oper = api.data.oper,id=api.data.id,$_form=$("#base_form"),url=rootPath+"/plan/breed";
var model = avalon.define({$id:'view',
	data:{name:"",variety:"",number:0,breed_region:"",feed:"",anti_epidemic:"",ripe_number:0,ripe_time:"",username:"",mobile:"",id:""},
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