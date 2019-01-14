import Url from './url';
import Events from 'events';
import routeConf from 'routeConf';

class Route extends Events.EventEmitter{
	constructor(props){
		super(props);
		window.addEventListener("hashchange", this.format.bind(this), false);
		this.format();
	}
	format(){
		const url = new Url("/"+location.hash.substring(1));
		let routePath = url.pathname.length>1?url.pathname.substring(1):routeConf.index;
		routePath = routePath.substr(-1) === "/"?routePath.substr(0,routePath.length-1):routePath;
		if(!routeConf.routes[routePath]){
			this.go("404");
			return;
		}
		const params = Url.parseParam(url.search);
		this.current = {
			page:routeConf.routes[routePath],
			routePath:routePath,
			params:params,
			url:url,
		};
		this.emit("change",this.current);
	}
	//不修改hash，跳页面
	switchPage(path,data){
		let page = this.getPage(path);
		if(!page){
			this.go("404");
			return;
		}
		this.current = {
			page:page,
			routePath:path,
			params:data || {},
		}
		this.emit("switch",this.getPage(path),data);
	}
	getPage(routePath){
		return routeConf.routes[routePath] || "";
	}
	href(path,data){
		return "#"+path+(data?"?"+Url.param(data):"");
	}
	go(path,data){
		location.href = "#"+path+(data?"?"+Url.param(data):"");
	}
}
export default new Route;
