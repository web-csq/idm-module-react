import { Component } from 'react'
import './IShortcutMenu.less'
import '../../public/static/menu-icon/iconfont.css'
import responseData from '../mockData/ShortCutInfo.json'
import CreateMenu from '../commonComponents/CreateMenu'
import CommonFunction from '../commonComponents/CommonFunctions'
interface IState extends IDMCommonState {
    text: string
    moduleHeight: number
    isHover: boolean
    isDisplayRight: boolean
    shortCutData: {
        shortCut: Array<any>
    }
    createMenuShow: boolean
    commonFunctionShow: boolean
    pageShortcutList: Array<any>
}
class IShortcutMenu extends Component<IDMCommonProp, IState> {
    constructor(props) {
        super(props)
        this.state = {
            shortCutData: responseData.data,
            createMenuShow: false,
            commonFunctionShow: false,
            isHover: false,
            isDisplayRight: true,
            moduleHeight: 800,
            pageShortcutList: [
                [
                    {
                        badgeAction: '',
                        isTabReload: '',
                        name: ' ',
                        icon: '',
                        link: '',
                        menuId: '',
                        id: '200819032505wojCx49Dqt5sLavzEo6',
                        target: ''
                    }
                ]
            ],
            propData: {
                title: '页面标题',
                text: '测试文本',
                interfaceUrl: 'ctrl/api/frame/getShortCutInfo'
            },
            ...props
        }
        // 防抖处理
        this.sliceShortcutData = window._.debounce(this.sliceShortcutData, 400)
    }
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject(stateObj) {
        const { propData, id } = stateObj
        const styleObject = {},
            fontObj = {}
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
                        styleObject[key] = element + 'px'
                        break
                    case 'font':
                        fontObj['font-family'] = element.fontFamily
                        if (element.fontColors.hex8) {
                            fontObj['color'] = element.fontColors.hex8
                        }
                        fontObj['font-weight'] = element.fontWeight && element.fontWeight.split(' ')[0]
                        fontObj['font-style'] = element.fontStyle
                        fontObj['font-size'] = element.fontSize + element.fontSizeUnit
                        fontObj['line-height'] =
                            element.fontLineHeight +
                            (element.fontLineHeightUnit === '-' ? '' : element.fontLineHeightUnit)
                        fontObj['text-align'] = element.fontTextAlign
                        fontObj['text-decoration'] = element.fontDecoration
                        break
                    case 'bgColor':
                        if (element && element.hex8) {
                            styleObject['background-color'] = element.hex8 + ' !important'
                        }
                        break
                    case 'bgImgUrl':
                        styleObject['background-image'] = `url(${window.IDM.url.getWebPath(element)})`
                        break
                    case 'positionX':
                        //背景横向偏移

                        break
                    case 'positionY':
                        //背景纵向偏移

                        break
                    case 'bgRepeat':
                        //平铺模式
                        styleObject['background-repeat'] = element
                        break
                    case 'bgAttachment':
                        //背景模式
                        styleObject['background-attachment'] = element
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
                }
            }
        }
        window.IDM.setStyleToPageHead(id + ' .idm-shortcut-menu-box-container', {
            ...styleObject,
            height: `calc(${this.state.moduleHeight}px - 60px)`
        })
        window.IDM.setStyleToPageHead(id + ' .idm-shortcut-menu-box-container .idm-shortcut-menu-text', fontObj)
        this.initData()
    }
    // 获取单列数量
    getOneLineNumber() {
        const oneBox = $('.idm-shortcut-menu-box')[0]
        const containerBox = $('.idm-shortcut-menu-box-container')[0]
        const oneHeight =
            parseInt(window.getComputedStyle(oneBox)['height']) +
            parseInt(window.getComputedStyle(oneBox)['margin-bottom'])
        const totalHeight = parseInt(window.getComputedStyle(containerBox)['height']) - 70 // 减去底部的高
        return Math.floor(totalHeight / oneHeight)
    }
    // 加载css
    loadIconFile() {
        const iconfontUrl = this.state.propData.iconfontUrl
        if (iconfontUrl) {
            let baseUrl =
                iconfontUrl + (iconfontUrl.substring(iconfontUrl.length - 1, iconfontUrl.length) === '/' ? '' : '/')
            window.IDM.http
                .get(baseUrl + 'iconfont.json', {})
                .then((res) => {
                    if (!res.data) {
                        return
                    }
                    //存在，加载css
                    window.IDM.module.loadCss(window.IDM.url.getWebPath(baseUrl + 'iconfont.css'), true)
                })
                .catch(function (error) {
                    console.log(error)
                })
        }
    }
    // 批量生成css类名
    generateClassName(themePrefix, classArray) {
        return classArray.map((el) => themePrefix + el).join(',')
    }
    // 主题
    convertThemeListAttrToStyleObject() {
        var themeList = this.state.propData.themeList
        if (!themeList) {
            return
        }
        const themeNamePrefix =
            window.IDM.setting && window.IDM.setting.applications && window.IDM.setting.applications.themeNamePrefix
                ? window.IDM.setting.applications.themeNamePrefix
                : 'idm-theme-'
        for (var i = 0; i < themeList.length; i++) {
            var item = themeList[i]
            const mainBgColorObj = {
                'background-color': item.mainColor ? window.IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
            }
            const minorBgColorObj = {
                'background-color': item.minorColor ? window.IDM.hex8ToRgbaString(item.minorColor.hex8) : ''
            }

            const mainColorObj = {
                color: item.mainColor ? window.IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
            }
            const borderColorObj = {
                'border-color': item.mainColor ? window.IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
            }

            window.IDM.setStyleToPageHead(
                '.' + themeNamePrefix + item.key + ' .idm-shortcut-menu-box-container',
                mainBgColorObj
            )
            window.IDM.setStyleToPageHead(
                '.' + themeNamePrefix + item.key + ' .idm-shortcut-menu-box:hover',
                minorBgColorObj
            )

            /**dialog */
            window.IDM.setStyleToPageHead(
                this.generateClassName('.' + themeNamePrefix + item.key + ` .idm-create-menu-app `, [
                    `.idm-create-menu-app-group-item .idm-create-menu-app-group-title>div`,
                    '.idm-create-menu-inner-anchor>div>div.active',
                    '.idm-create-menu-inner-anchor>div>div.active i',
                    '.idm-create-menu-app-search>div .search-icon'
                ]),
                Object.assign({}, mainColorObj, borderColorObj)
            )
            window.IDM.setStyleToPageHead(
                '.' +
                    themeNamePrefix +
                    item.key +
                    ` .idm-create-menu-app .idm-create-menu-app-content .idm-create-menu-app-group-item .idm-create-menu-app-group-content .idm-create-menu-app-element-item:hover`,
                mainBgColorObj
            )
        }
    }
    // 切割数组
    sliceShortcutData() {
        const list: Array<any> = []
        const number = this.getOneLineNumber()
        this.state.shortCutData.shortCut.forEach((element, index) => {
            let key = Math.floor(index / number)
            if (!list[key]) {
                list[key] = []
            }
            list[key].push(element)
        })
        console.log(list, '<------------- Slice done')
        this.setState({ pageShortcutList: list })
    }
    componentDidMount() {
        this.sliceShortcutData()
    }
    handleMouseEnter(type: 'left' | 'right') {
        if(type === 'left'){
            this.setState({
                isDisplayRight: true
            })
        }
        this.setState({ isHover: true })
    }
    handleMouseLeave() {
        this.setState({ isHover: false })
    }
    getPositionStyle(indexs) {
        const index = indexs + 1
        return {
            left: this.state.isDisplayRight && this.state.isHover ? (this.state.propData.width + 1) * index + 'px' : '0',
            transition: `left ${index * 0.06}s`,
            zIndex: index
        }
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
    initData() {
        this.state.propData.interfaceUrl &&
            window.IDM.http
                .get(this.state.propData.interfaceUrl)
                .then((res) => {
                    if (res.status === 200 && res.data.code === '200') {
                        this.setState({ shortCutData: res.data.data }, () => {
                            this.sliceShortcutData()
                        })
                    } else {
                        window.IDM.message.error(res.data.message)
                    }
                })
                .catch(function (error) {})
    }
    resizeContentWrapperHeight(wrapperHeight?: number) {
        let moduleHeight = this.state.propData.moduleHeight
        if (this.state.propData.heightType === 'adaptive' && wrapperHeight) {
            //自适应父级容器
            moduleHeight = wrapperHeight
        }
        this.setState({
            moduleHeight
        })
    }
    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData) {
        const stateObj = { ...this.state, propData }
        this.setState(stateObj, () => {
            // setState是异步 需要放在回调里
            this.sliceShortcutData()
            this.convertThemeListAttrToStyleObject()
            this.resizeContentWrapperHeight()
            this.loadIconFile()
        })
        // 另一种方法，把state当参数传进去，确保数据同步
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
        console.log('组件收到消息', object)
        switch (object.type) {
            case 'regionResize':
                if (object.message && object.message.gridEleTarget) {
                    let gridEleTarget = object.message.gridEleTarget
                    if (gridEleTarget && gridEleTarget.offsetHeight) {
                        this.resizeContentWrapperHeight(gridEleTarget.offsetHeight)
                    }
                }
                break
        }
    }

    replaceAction(action) {
        if (action.indexOf('../../') === 0) {
            return window.IDM.url.getWebPath(action.replace('../../', ''))
        } else {
            return action
        }
    }

    handleClickIcon() {
        if(this.state.env === 'develop') return
        this.setState({
            commonFunctionShow: true
        })
    }

    handleCommonFunctionClose(e) {
        this.setState({
            commonFunctionShow: false
        })
        this.initData()
    }

    handleIconClassName(el) {
        // 自定义
        const isCustom = this.state.propData.iconfontUrl ? true : false
        // 取自定义字段 默认 iconfont
        let fontFamily =
            isCustom && this.state.propData.iconFontFamily ? this.state.propData.iconFontFamily : 'iconfont'
        // 取自定义前缀 默认icon-
        let prefix = isCustom && this.state.propData.iconPrefix ? this.state.propData.iconPrefix : 'icon-'
        let familyStr = `${fontFamily} ${prefix}`
        if (isCustom && el.icon) {
            return familyStr + el.icon
        }
        // 没有icon 不是自定义图标库 使用本地自带图标库
        return 'oa-menu-iconfont oa-menu-tuceng'
    }

    handleClickItem(item) {
        if (this.state.env === 'develop') return
        
        this.setState({
            isDisplayRight: false
        })
        if (item.script) {
            switch (item.script) {
                case 'newFile':
                    // this.openWyj()
                    break
                case 'remind':
                    item.link = this.replaceAction('../../ctrl/remind/index')
                    this.sendBroadcastMessage({
                        type: 'addTab',
                        className: '',
                        message: item
                    })
                    break
            }
            return
        }
        if (item.action.indexOf('javascript') === 0) {
            eval(this.replaceAction(item.link).replace('javascript:', ''))
        } else {
            this.sendBroadcastMessage({
                type: 'addTab',
                className: '',
                message: item
            })
        }
    }

    render() {
        const { handleMouseEnter, handleMouseLeave } = this
        const { id } = this.props
        const { pageShortcutList, moduleHeight } = this.state
        return (
            <>
                <div idm-ctrl="idm_module" className="idm-shortcut-menu" idm-ctrl-id={id}>
                    <div
                        className="idm-shortcut-menu-box-container"
                        style={{ left: 0, zIndex: 200, height: moduleHeight + 'px' }}
                        onMouseLeave={() => handleMouseLeave.call(this)}
                        onMouseEnter={() => handleMouseEnter.call(this, 'left')}
                    >
                        {pageShortcutList[0].map((el) => (
                            <div className="idm-shortcut-menu-box" key={el.id} onClick={() => this.handleClickItem(el)}>
                                <i className={`idm-shortcut-menu-icon ${this.handleIconClassName(el)}`}></i>
                                <div className="idm-shortcut-menu-text" title={el.name}>
                                    {el.name}
                                </div>
                            </div>
                        ))}
                        <div className="idm-shortcut-menu-add">
                            <i
                                onClick={this.handleClickIcon.bind(this)}
                                className="oa-menu-iconfont oa-menu-zengjiatianjiajiahao idm-shortcut-menu-add-icon"
                            ></i>
                        </div>
                    </div>
                    {pageShortcutList
                        .filter((el, index) => index !== 0)
                        .map((els, indexs) => {
                            return (
                                <div
                                    onMouseLeave={() => handleMouseLeave.call(this)}
                                    onMouseEnter={() => handleMouseEnter.call(this, 'right')}
                                    className="idm-shortcut-menu-box-container"
                                    key={indexs}
                                    style={this.getPositionStyle(indexs)}
                                >
                                    {els.map((item) => (
                                        <div
                                            className="idm-shortcut-menu-box"
                                            key={item.id}
                                            onClick={() => this.handleClickItem(item)}
                                        >
                                            <i className="oa-menu-iconfont oa-menu-tuceng idm-shortcut-menu-icon"></i>
                                            <div className="idm-shortcut-menu-text" title={item.name}>
                                                {item.name}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        })}
                </div>
                <CreateMenu createMenuShow={this.state.createMenuShow}></CreateMenu>
                <CommonFunction
                    commonFunctionShow={this.state.commonFunctionShow}
                    handleCommonFunctionClose={this.handleCommonFunctionClose.bind(this)}
                ></CommonFunction>
            </>
        )
    }
}

export default IShortcutMenu
