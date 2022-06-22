import { Component } from 'react'
import './IShortcutMenu.less'
import '../../public/static/menu-icon/iconfont.css';
import responseData from '../mockData/ShortCutInfo.json'
interface IState extends IDMCommonState {
    text: string
    shortCutData: {
        shortCut: Array<any>
    }
}
class DemoText extends Component<IDMCommonProp, IState> {
    constructor(props) {
        super(props)
        this.state = {
            shortCutData: responseData.data,
            propData: {
                title: '页面标题',
                text: '测试文本'
            },
            ...props
        }
    }
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject(stateObj) {
        const { propData, id } = stateObj
        var styleObject = {}
        if (propData.bgSize && propData.bgSize === 'custom') {
            styleObject['background-size'] =
                (propData.bgSizeWidth ? propData.bgSizeWidth.inputVal + propData.bgSizeWidth.selectVal : 'auto') +
                ' ' +
                (propData.bgSizeHeight ? propData.bgSizeHeight.inputVal + propData.bgSizeHeight.selectVal : 'auto')
        } else if (propData.bgSize) {
            styleObject['background-size'] = propData.bgSize
        }
        if (propData.positionX && propData.positionX.inputVal) {
            styleObject['background-position-x'] = propData.positionX.inputVal + propData.positionX.selectVal
        }
        if (propData.positionY && propData.positionY.inputVal) {
            styleObject['background-position-y'] = propData.positionY.inputVal + propData.positionY.selectVal
        }
        for (const key in propData) {
            if (propData.hasOwnProperty.call(propData, key)) {
                const element = propData[key]
                if (!element && element !== false && element !== 0) {
                    continue
                }
                switch (key) {
                    case 'width':
                        styleObject[key] = element
                        break
                    case 'height':
                        styleObject[key] = element
                        break
                    case 'font':
                        styleObject['font-family'] = element.fontFamily
                        if (element.fontColors.hex8) {
                            styleObject['color'] = element.fontColors.hex8
                        }
                        styleObject['font-weight'] = element.fontWeight && element.fontWeight.split(' ')[0]
                        styleObject['font-style'] = element.fontStyle
                        styleObject['font-size'] = element.fontSize + element.fontSizeUnit
                        styleObject['line-height'] =
                            element.fontLineHeight +
                            (element.fontLineHeightUnit === '-' ? '' : element.fontLineHeightUnit)
                        styleObject['text-align'] = element.fontTextAlign
                        styleObject['text-decoration'] = element.fontDecoration
                        break
                    case 'box':
                        if (element.marginTopVal) {
                            styleObject['margin-top'] = `${element.marginTopVal}`
                        }
                        if (element.marginRightVal) {
                            styleObject['margin-right'] = `${element.marginRightVal}`
                        }
                        if (element.marginBottomVal) {
                            styleObject['margin-bottom'] = `${element.marginBottomVal}`
                        }
                        if (element.marginLeftVal) {
                            styleObject['margin-left'] = `${element.marginLeftVal}`
                        }
                        if (element.paddingTopVal) {
                            styleObject['padding-top'] = `${element.paddingTopVal}`
                        }
                        if (element.paddingRightVal) {
                            styleObject['padding-right'] = `${element.paddingRightVal}`
                        }
                        if (element.paddingBottomVal) {
                            styleObject['padding-bottom'] = `${element.paddingBottomVal}`
                        }
                        if (element.paddingLeftVal) {
                            styleObject['padding-left'] = `${element.paddingLeftVal}`
                        }
                        break
                    case 'border':
                        if (element.border.top.width > 0) {
                            styleObject['border-top-width'] = element.border.top.width + element.border.top.widthUnit
                            styleObject['border-top-style'] = element.border.top.style
                            if (element.border.top.colors.hex8) {
                                styleObject['border-top-color'] = element.border.top.colors.hex8
                            }
                        }
                        if (element.border.right.width > 0) {
                            styleObject['border-right-width'] =
                                element.border.right.width + element.border.right.widthUnit
                            styleObject['border-right-style'] = element.border.right.style
                            if (element.border.right.colors.hex8) {
                                styleObject['border-right-color'] = element.border.right.colors.hex8
                            }
                        }
                        if (element.border.bottom.width > 0) {
                            styleObject['border-bottom-width'] =
                                element.border.bottom.width + element.border.bottom.widthUnit
                            styleObject['border-bottom-style'] = element.border.bottom.style
                            if (element.border.bottom.colors.hex8) {
                                styleObject['border-bottom-color'] = element.border.bottom.colors.hex8
                            }
                        }
                        if (element.border.left.width > 0) {
                            styleObject['border-left-width'] = element.border.left.width + element.border.left.widthUnit
                            styleObject['border-left-style'] = element.border.left.style
                            if (element.border.left.colors.hex8) {
                                styleObject['border-left-color'] = element.border.left.colors.hex8
                            }
                        }

                        styleObject['border-top-left-radius'] =
                            element.radius.leftTop.radius + element.radius.leftTop.radiusUnit
                        styleObject['border-top-right-radius'] =
                            element.radius.rightTop.radius + element.radius.rightTop.radiusUnit
                        styleObject['border-bottom-left-radius'] =
                            element.radius.leftBottom.radius + element.radius.leftBottom.radiusUnit
                        styleObject['border-bottom-right-radius'] =
                            element.radius.rightBottom.radius + element.radius.rightBottom.radiusUnit
                        break
                }
            }
        }
        window.IDM.setStyleToPageHead(id, styleObject)
        this.initData()
    }
    /**
     * 重新加载
     */
    reload() {
        //请求数据源
        this.initData()
    }
    /**
     * 加载动态数据
     */
    initData() {}
    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData) {
        const stateObj = { ...this.state, propData }
        this.setState(stateObj)
        // setState是异步，把state当参数传进去，确保数据同步
        this.convertAttrToStyleObject(stateObj)
    }
    /**
     * 组件通信：发送消息的方法
     * @param {
     *  type:"自己定义的，统一规定的type：linkageResult（组件联动传结果值）、linkageDemand（组件联动传需求值）、linkageReload（联动组件重新加载）
     * 、linkageOpenDialog（打开弹窗）、linkageCloseDialog（关闭弹窗）、linkageShowModule（显示组件）、linkageHideModule（隐藏组件）、linkageResetDefaultValue（重置默认值）",
     *  message:{实际的消息对象},
     *  rangeModule:"为空发送给全部，根据配置的属性中设定的值（值的内容是组件的packageid数组），不取子表的，比如直接 this.$root.propData.compositeAttr["attrKey"]（注意attrKey是属性中定义的bindKey）,这里的格式为：['1','2']"",
     *  className:"指定的组件类型，比如只给待办组件发送，然后再去过滤上面的值"
     *  globalSend:如果为true则全站发送消息，注意全站rangeModule是无效的，只有className才有效，默认为false
     * } object
     */
    sendBroadcastMessage(object) {
        window.IDM.broadcast && window.IDM.broadcast.send(object)
    }
    /**
     * 组件通信：接收消息的方法
     * @param {
     *  type:"发送消息的时候定义的类型，这里可以自己用来要具体做什么，统一规定的type：linkageResult（组件联动传结果值）、linkageDemand（组件联动传需求值）、linkageReload（联动组件重新加载）
     * 、linkageOpenDialog（打开弹窗）、linkageCloseDialog（关闭弹窗）、linkageShowModule（显示组件）、linkageHideModule（隐藏组件）、linkageResetDefaultValue（重置默认值）"
     *  message:{发送的时候传输的消息对象数据}
     *  messageKey:"消息数据的key值，代表数据类型是什么，常用于表单交互上，比如通过这个key判断是什么数据"
     *  isAcross:如果为true则代表发送来源是其他页面的组件，默认为false
     * } object
     */
    receiveBroadcastMessage(object) {
        console.log(`收到消息 ---> ${object}`)
    }

    render() {
        const { id } = this.props
        const { propData, shortCutData } = this.state
        return (
            <div idm-ctrl="idm_module" className="idm-shortcut-menu" idm-ctrl-id={id}>
                {shortCutData.shortCut.map((el) => (
                    <div className="idm-shortcut-menu-box" key={el.id}>
                        <i className="oa-menu-iconfont oa-menu-tuceng idm-shortcut-menu-icon"></i>
                        <div className="idm-shortcut-menu-text" title={el.name}>{el.name}</div>
                    </div>
                ))}
            </div>
        )
    }
}

export default DemoText
