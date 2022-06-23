interface ModuleObject {
  env: 'develop' | 'production'
}
interface IDMCommonState {
  propData: any,
  moduleObject: ModuleObject
}

interface IDMCommonProp {
  id: string,
  className: string,
  moduleObject: object
}

interface IDMReactComponent {
  /**
   * 组件根据传入数据更新
   * @param propData 传入数据data
   */
  propDataWatchHandle(propData: any): void
  /**
   * 接受消息
   * @param object 消息体
   */
  receiveBroadcastMessage(object: any):void
  idmSetContextValue(object: any):void
  idmGetContextValue(): any
}