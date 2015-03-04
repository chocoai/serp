/**
 * 
 */
package net.loyin.ctrl.plan;

import java.util.HashMap;
import java.util.Map;

import net.loyin.ctrl.base.AdminBaseController;
import net.loyin.jfinal.anatation.PowerBind;
import net.loyin.jfinal.anatation.RouteBind;
import net.loyin.model.plan.Plant;

import org.apache.commons.lang3.StringUtils;

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
	
	@PowerBind(code="A1_1_E",funcName="编辑")
	public void save() {
		try {
			Plant po = (Plant) getModel();
			if (po == null) {
				this.rendJson(false,null, "提交数据错误！");
				return;
			}
			getId();
			String uid=this.getCurrentUserId();
			this.pullUser(po, uid);
			if (StringUtils.isEmpty(id)) {
				po.set("company_id", this.getCompanyId());
				po.save();
				id=po.getStr("id");
			} else {
				po.update();
			}
			this.rendJson(true,null, "操作成功！",id);
		} catch (Exception e) {
			log.error("保存产品异常", e);
			this.rendJson(false,null, "保存数据异常！");
		}
	}
	
	@PowerBind(code={"A2_1_E","A3_1_E"},funcName="删除")
	public void del() {
		try {
			getId();
			Plant.dao.del(id,this.getCompanyId());
			rendJson(true,null,"删除成功！",id);
		} catch (Exception e) {
			log.error("删除异常", e);
			rendJson(false,null,"删除失败！",id);
		}
	}
}