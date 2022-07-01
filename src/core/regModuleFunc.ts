import { createElement, useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client';
import config from '../../public/static/config.json'
//闭包方法
(() => {
    const className = window.IDM && window.IDM.url.queryString("className")
    const requireComponent = require.context('../components', true, /[A-Z]\w+\.(jsx|tsx)$/);
    const componentsMap = new Map()
    requireComponent.keys().forEach((fileName: any) => {
        const componentConfig = requireComponent(fileName)
        const  componentName= fileName.split('/').pop().replace(/\.\w+$/, '')
        // 将全部组件放到一个Map里
        componentsMap.set(componentName, componentConfig.default || componentConfig)
    })
    //这里把classId+@+version作为入口方法名（组件的包名）
    var defining = {};
    config && config.module.forEach((item: any) => {
        defining[item.classId + "@" + config.version] = function (moduleObject) {
            // 把组件定义的属性返回给核心框架
            moduleObject.compositeAttr = item.compositeAttr;
            //把组件定义的组件内属性返回给核心框架(如果有的话)
            if(item.innerAttr) moduleObject.innerAttr = item.innerAttr
            //组件内部容器组件的名称
            if(item.innerComName) moduleObject.innerComName = item.innerComName
            const root = createRoot(document.getElementById(moduleObject.id) || document.createElement('div'));
            root.render(createElement(() => {
                const childCom = useRef<IDMReactComponent>()
                // 编辑属性更新
                moduleObject.idmProps = props => childCom?.current?.propDataWatchHandle(props.compositeAttr)
                // 接收消息
                moduleObject.idmBroadcastMessage = object => childCom?.current?.receiveBroadcastMessage(object)
                // 交互功能：设置组件的上下文内容值
                moduleObject.idmSetContextValue = object => childCom?.current?.setContextValue(object)
                // 交互功能：获取需要返回的值
                moduleObject.idmGetContextValue = () => {}
                useEffect(() => {
                    // 挂载完成通知idm
                    moduleObject.mountComplete && moduleObject.mountComplete(moduleObject);
                    // 预览时数据传入
                    const propData = moduleObject?.props?.compositeAttr
                    if(propData) childCom?.current?.propDataWatchHandle(propData)
                }, [])
                return createElement(componentsMap.get(moduleObject.className || className), {...moduleObject, ref: childCom})
            }))
        }
    })
    Object.keys(defining).forEach(key => {
        window[key] = defining[key];
    });
    //延时
    setTimeout(function(){
        if(className){
            config && config.module.forEach(item => {
                if(item.className === className){
                    window[item.classId + "@" + config.version]({"id": "module_demo"})
                }
            });
        }
    },100)
})();