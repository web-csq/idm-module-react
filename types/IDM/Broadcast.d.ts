interface IDMBroadcastMessage{
  type: string
  message: any
  rangeModule: null| Array<any>
  className: string,
  globalSend: boolean,
  messageKey: string,
  triggerType: string,
}

export interface OpenDialogOptions<T = function> {
  moduleId: string
  openUrl: string
  success?: T
  yes?: T
  cancel?: T
  end?: T
}

export interface OpenControlOptions<T = function>{
  param: {
   marketModuleId: string
   pageId: string
   packageid: string
  },
  showTop?: string
  success?: T
  yes?: T
  reset?: T
  other?: T
}

export interface IDMBroadcast {
  pageModule: {
    id: string
  }
  send(e: IDMBroadcastMessage):void
  getModuleContextValue(pageModuleList?: Array<object>, groupKey?: string): any
  getRangeModule(pageModuleList?: Array<object>, groupKey?: string): any
  openDialog(options: OpenDialogOptions):void
  closeDialog(options: {moduleId: string | Array<string>}): void
  openControlSetPanel(options: OpenControlOptions):void
  closeControlSetPanel(options: {controlSetPanelId: string}):void
}