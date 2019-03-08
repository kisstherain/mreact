import React, { Component } from 'react'
import Url from 'core/url';
import Route from './route';

export default class Router extends Component {
	constructor(props){
		super(props);
		Route.setConf(props.conf)
	}
	componentDidMount(){
		Route.on("change",()=>{
			//延迟50ms执行，防止其他组件有change事件未卸载
			//setTimeout(()=>{
			this.setState({},()=>{
				//渲染完成触发渲染路由事件
				Route.changeFinish();
			})
			//},50)
		})
	}
	render() {
		if(!Route.current){
			return null;
		}
		let Layout = Route.current.layout;
		let RoutePage = Route.current.page;
		if(!RoutePage){
			return null;
		}
		//判断页面是否真的改变,如果不变，则ctrl不变
		if(this.page != RoutePage){
			this.ctrl = null;
		}
		if(this.page != RoutePage && RoutePage.Controller){
			this.ctrl = new RoutePage.Controller;
		}
		this.page = RoutePage;
		Route.current.ctrl = this.ctrl;

		if(!Layout){
			return <RoutePage />
		}
		return (
			<Layout>
				<RoutePage />
			</Layout>
		)
	}
}
