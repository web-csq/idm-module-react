# 快捷菜单
此组件为快捷菜单组件，采用自适应高度计算显示快捷应用
## 组件类名（className）
IShortcutMenu
## 组件类ID（classId）
idm.componet.shortcutmenu.ishortcutMenu
## 组件开发语言（comLangue）
react
## 组件类型（comType）
shortcutmenu
## 所在代码包版本
shortcutmenu@1.0.0
## 组件属性
### 唯一标识【ctrlId】
默认值：`packageid`
### 基本属性
#### 组件标题【title】
默认值：`快捷菜单`

#### 接口地址【interfaceUrl】
默认值：`ctrl/api/frame/getShortCutInfo`

#### 图标URL【iconfontUrl】
从iconfont下载的图标库文件夹地址， 不需要具体到文件，比如：图标css文件的路径是【/project/font_1248060_zpcega7i6m9/iconfont.css】，我们这里只需要填写【/project/font_1248060_zpcega7i6m9/】，注意：里面的文件建议不要做任何修改，否则可能读取不正确，为空时默认使用项目自带iconfont，反之设置自定义路径后iconfont类名将从接口获取
默认值：``
#### 图标前缀【iconPrefix】
设置iconfont类名前缀，如类名是iconfont icon-shouye前缀为icon-
默认值：``
#### 图标字体【iconFontFamily】
设置iconfont字体，如类名是iconfont icon-shouye字体为iconfont
默认值：``

### 样式设置
#### 高度模式【heightType】
用于设置组件高度方式，如果是不适配响应父容器选择固定值就好，如果需要适配父容器(或其他)组件传递的具体值则选择适应容器即可
可选值：
- 适应容器
- 固定值

#### 宽(px)【width】
默认值：`60`

#### 高度(px)【moduleHeight】
设置组件固定高度，高度模式为固定值时生效
默认值：`800`

#### 内外边距【box】

#### 背景设置
##### 背景色【bgColor】
##### 背景图片【bgImgUrl】
##### 横向偏移【positionX】
##### 纵向偏移【positionY】
##### 背景大小【bgSize】
##### 宽度【bgSizeWidth】
##### 高度【bgSizeHeight】
##### 平铺模式【bgRepeat】
##### 背景模式【bgAttachment
#### 文字【font】
### 主题设置
#### 主要颜色【mainColor】
主题的主要颜色，作用于菜单背景色
标识：`mainColor`

#### 次要颜色【minorColor】
主题的次要颜色，作用于菜单鼠标悬浮色
标识：`minorColor`

### 高级
设置组件高度属性，例如：数据来源，接口地址，数据字段等.
#### 动态内容【dataSourceType】
通过选择不同的方式去动态获取结果值显示成文本内容
#### 接口地址【interfaceUrl】
获取快捷菜单的接口地址
#### 结果集名【dataName】
页面接口设定的结果集名称，位置为：页面设置 -> 高级设置 -> 页面接口
#### 显示字段【dataFiled】
根据接口返回数据格式指定结果集的字段，比如结果集名为resultData（自定义接口忽略）且它的值为{data:{filedName:[{\"text\":\"\",\"value\":\"\",\"check\":true}]}}，则这里应该填写data.filedName
#### 自定义函数【customFunction】
获取动态文本内容、自定义接口回调、页面统一接口回调的时候会调用此方法，返回数据格式为字符串，接收参数：{...自定义,interfaceData:自定义接口或页面统一接口的返回结果,expressData:表达式替换后的结果}
