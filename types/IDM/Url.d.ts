export interface IDMUrl {
  getWebPath(url: string, rootPath?: string, projectNo?: string): string
  getModuleAbsoluteDir(projectNo?: string, rootPath?: string): string
  getModuleAssetsWebPath(url: string, module: object): string
  getAbsolutePath(url: string): string
  queryString(key: string): string
  stringify(params: object, options?: object): string
  parse(str: string, options?: object): object
  analyzing(url: string): object
  getURLRoot():string
  getContextWebUrl(url: string): string
  queryObject(url?: string): object
}