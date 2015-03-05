var api = frameElement.api,oper = api.data.oper,id=api.data.id,$_form=$("#base_form"),url=rootPath+"/plan/plant";
var model = avalon.define({$id:'view',
	data:{name:"",variety:"",number:"",unit:"",use:"",input:"",buy_time:"",buy_company_name:"",username:"",mobile:"",id:""},
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