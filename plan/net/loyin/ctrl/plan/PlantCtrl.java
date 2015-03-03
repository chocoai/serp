/**
 * 
 */
package net.loyin.ctrl.plan;

import java.util.HashMap;
import java.util.Map;

import net.loyin.ctrl.base.AdminBaseController;
import net.loyin.jfinal.anatation.RouteBind;
import net.loyin.model.plan.Plant;

/**
 * @author xiangning
 * 种植控制器
 */
@RouteBind(path="plant",sys="计划",model="种植计划")
public class PlantCtrl extends AdminBaseController<Plant> {
	public PlantCtrl(){
		this.modelClass = Plant.class;
	}
	
	public void dataGrid(){
		Map<String,String>userMap=this.getUserMap();
		Map<String,Object> filter=new HashMap<String,Object>();
		filter.put("company_id",userMap.get("company_id"));
		filter.put("keyword",this.getPara("keyword"));
		filter.put("start_date",this.getPara("start_date"));
		filter.put("end_date",this.getPara("end_date"));
		filter.put("status",this.getParaToInt("status"));
		filter.put("type",this.getParaToInt("type"));
		filter.put("uid",this.getPara("uid"));
		filter.put("user_id",userMap.get("uid"));
		filter.put("is_deleted",this.getParaToInt("is_deleted"));
		filter.put("position_id",userMap.get("position_id"));
		this.sortField(filter);
		this.rendJson(true, null, "",Plant.dao.pageGrid(this.getPageNo(),this.getPageSize(),filter));
	}
}
