import { Modal, Button } from 'idm-react-antd'
import React, { useState, useEffect } from 'react'
import '../styles/commonModal.less'
import SvgIcon from '../icons/SvgIcon'
import { SearchOutlined, CloseOutlined } from '@ant-design/icons'
interface IProp {
    commonFunctionShow: boolean
    handleCommonFunctionClose: (e: any) => void
}
interface IState {
    yxDataList: Array<any>
    dxDataList: Array<any>
    lsDataList: string
    searchValue: string
    changeUrl: string
    dialogHeight: number
}
const CommonFunction: React.FC<IProp> = (props) => {
    const [pageState, setPageState] = useState<IState>({
        yxDataList: [],
        dxDataList: [],
        lsDataList: '',
        searchValue: '',
        changeUrl: 'ctrl/shortcut/change',
        dialogHeight: 400
    })
    const [activeAnchor, setActiveAnchor] = useState(0)
    useEffect(() => {
        if (props.commonFunctionShow) {
            initData()
        }
    }, [props.commonFunctionShow])
    const initData = async () => {
        window.IDM.http
            .get('ctrl/shortcut/list')
            .then((res) => {
                const respData = res.data
                if (respData.code === '200') {
                    let yxDataList = []
                    let dxDataList = respData.data.menu
                    let lsDataList = JSON.stringify(respData.data.menu)
                    if (respData.data && respData.data.short) {
                        yxDataList = respData.data.short
                    }
                    if (respData.data && respData.data.menu) {
                        dxDataList.forEach((fitem, index) => {
                            if (fitem.children && fitem.children.length > 0) {
                                fitem.children.forEach((sitem, sindex) => {
                                    yxDataList.forEach((nitem: any, nindex) => {
                                        if (sitem.id === nitem.menuId) {
                                            fitem.children.splice(sindex, 1)
                                        }
                                    })
                                })
                            }
                        })
                    }
                    setPageState({
                        ...pageState,
                        yxDataList,
                        dxDataList,
                        lsDataList
                    })
                    initAnchorContentScroll();
                }
            })
            .catch((err) => {})
    }
    const handleOk = () => {
        props.handleCommonFunctionClose(1)
    }
    const handleSeachChange = (e) => {
        setPageState({
            ...pageState,
            searchValue: e.target.value
        })
    }
    const menuSearch = () => {
        let dxDataList: Array<any> = []

        if (pageState.searchValue === '') {
            setPageState({
                ...pageState,
                dxDataList: JSON.parse(pageState.lsDataList)
            })
            return
        }
        dxDataList = pageState.dxDataList
        let searchValueVar = pageState.searchValue
        let searchDataList: Array<any> = []
        dxDataList.map((item: any) => {
            let children: Array<any> = []
            item.children &&
                item.children.map((sitem: any) => {
                    if (sitem.menuName.indexOf(searchValueVar) > -1) {
                        children.push(sitem)
                    }
                })
            var newObject = item
            newObject.children = children
            if (newObject.menuName.indexOf(searchValueVar) > -1 || newObject.children.length > 0) {
                searchDataList.push(newObject)
            }
        })
        setPageState({
            ...pageState,
            dxDataList: searchDataList
        })
    }
    const jumpAnchor = (index) => {
        setActiveAnchor(index)
        const jump = $('.idm-create-menu-app-content').find('.idm-create-menu-app-group-item').eq(index)
        const scrollTop = jump.position().top + ($('.idm-create-menu-app-content').scrollTop() || 0) // 获取需要滚动的距离
        $('.idm-create-menu-app-content').scrollTop(scrollTop)
    }
    const jumpAttach = () => {
        let attachAnchor = $('.idm-create-menu-app-anchor-box')
        const jump = attachAnchor.find('.idm-create-menu-inner-item').eq(activeAnchor)
        const scrollTop = jump.position().top + (attachAnchor?.scrollTop() || 0) // 获取需要滚动的距离
        var aaheight = attachAnchor.height() || 0
        if (jump.position().top + 50 > aaheight || jump.position().top < 0) {
            attachAnchor.scrollTop(scrollTop - aaheight / 2)
        }
    }
    const initAnchorContentScroll = () => {
        let scrollBox = $('.idm-create-menu-app-content')
        const jump = scrollBox.find('.idm-create-menu-app-group-item')
        const topArr: Array<number> = []
        for (let i = 0; i < jump.length; i++) {
            topArr.push(jump.eq(i).position().top)
        }
        // 监听dom元素的scroll事件
        scrollBox.scroll(function () {
            const current_offset_top = scrollBox.scrollTop() || 0
            console.log(current_offset_top)
            for (let i = 0; i < topArr.length; i++) {
                if (current_offset_top <= topArr[i]) {
                    // 根据滚动距离判断应该滚动到第几个导航的位置
                    setActiveAnchor(i)
                    // 滚动到顶部位置
                    jumpAttach()
                    break
                }
            }
        })
    }
    const getClassStr = (icon): string => {
        return '1'
    }
    const delCygn = (item) => {
        const yxDataList = pageState.yxDataList
        const dxDataList = pageState.dxDataList
        pageState.yxDataList.forEach((sitem: any, sindex) => {
            if (sitem.id == item.id) {
                yxDataList.splice(sindex, 1)
            }
        })
        //追加待选
        let lsDataList = JSON.parse(pageState.lsDataList)
        var groupMenu = { id: '', children: [{}] },
            menuObject = {}
        lsDataList.forEach((fitem, index) => {
            if (fitem.children && fitem.children.length > 0) {
                fitem.children.forEach((sitem, sindex) => {
                    if (sitem.id == item.menuId) {
                        groupMenu = fitem
                        menuObject = sitem
                    }
                })
            }
        })
        //先判断是否有分组
        let hasGroup = false
        dxDataList.map((fitem: any, index) => {
            if (groupMenu.id == fitem.id) {
                fitem.children.push(menuObject)
                hasGroup = true
            }
        })
        if (!hasGroup) {
            groupMenu.children = [menuObject]
            dxDataList.push(groupMenu)
        }
        setPageState({
            ...pageState,
            dxDataList,
            yxDataList
        })

        var param = {
            operation: 'del',
            id: item.id,
            portalPattern: 'dsfa'
        }
        window.IDM.http
            .post(pageState.changeUrl, param)
            .then((res) => {
                console.log(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    const addCygn = (item) => {
        const dxDataList = pageState.dxDataList
        const yxDataList = pageState.yxDataList
        const yxObject = {
            badgeAction: item.badgeAction,
            isTabReload: item.isTabReload,
            name: item.menuName,
            icon: item.icon,
            link: item.action,
            menuId: item.id,
            id: item.id,
            target: item.target
        }
        //删除待选
        dxDataList.forEach((fitem: any, index) => {
            if (fitem.children && fitem.children.length > 0) {
                fitem.children.forEach((sitem, sindex) => {
                    if (sitem.id == item.id) {
                        fitem.children.splice(sindex, 1)
                    }
                })
            }
        })

        var param = {
            operation: 'add',
            menuId: item.id,
            portalPattern: 'dsfa'
        }
        window.IDM.http
            .post(pageState.changeUrl, param)
            .then((res) => {
                yxObject.id = res.data.data
                //追加已选
                yxDataList.push(yxObject)
                setPageState({
                    ...pageState,
                    dxDataList,
                    yxDataList
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }
    return (
        <Modal
            title="我要建"
            width={900}
            footer={
                <div style={{ textAlign: 'center' }}>
                    <Button onClick={handleOk}>关闭</Button>
                </div>
            }
            onCancel={handleOk}
            wrapClassName="idm-create-menu-app"
            visible={props.commonFunctionShow}
        >
            <div className="idm-create-menu-app-search">
                <input
                    type="text"
                    onKeyUp={menuSearch}
                    onChange={(e) => handleSeachChange(e)}
                    value={pageState.searchValue}
                    placeholder="请输入关键词进行检索"
                />
                <div>
                    <SearchOutlined style={{ fontSize: '20px' }} />
                    <i className="el-icon-search"></i>
                </div>
            </div>
            <div className="idm-create-menu-app-container" style={{ height: pageState.dialogHeight + 'px' }}>
                <div className="idm-create-menu-app-content">
                    <div className="idm-create-menu-app-group-item recently-use">
                        <div className="idm-create-menu-app-group-title">
                            <div>
                                <SvgIcon iconClass="fire"></SvgIcon>已选
                            </div>
                        </div>
                        <div className="idm-create-menu-app-group-content">
                            {pageState.yxDataList.map((el: any, index) => (
                                <div className="idm-create-menu-app-element-item hasClose" key={index} title={el.name}>
                                    <i className={getClassStr(el.icon)}></i>
                                    {el.name}
                                    <CloseOutlined  onClick={() => delCygn(el)}className='close-icon'/>
                                </div>
                            ))}
                        </div>
                    </div>
                    {pageState?.dxDataList?.map((el: any, index) => (
                        <div className="idm-create-menu-app-group-item" key={index}>
                            <div className="idm-create-menu-app-group-title">
                                <div>{el.menuName}</div>
                            </div>
                            <div className="idm-create-menu-app-group-content">
                                {el?.children?.map((els, indexs) => (
                                    <div key={indexs + 1111}>
                                        <div
                                            className="idm-create-menu-app-element-item"
                                            onClick={() => addCygn(els)}
                                            title={els.menuName}
                                        >
                                            <i className={getClassStr(els.icon)}></i>
                                            {els.menuName}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="idm-create-menu-inner-anchor">
                    <div className="idm-create-menu-app-anchor-box">
                        <div
                            className={`idm-create-menu-inner-item ${activeAnchor === 0 ? 'active' : ''}`}
                            onClick={() => jumpAnchor(0)}
                        >
                            <i></i>已选
                        </div>
                        {pageState.dxDataList.map((el: any, index) => (
                            <div
                                className={`idm-create-menu-inner-item ${
                                    activeAnchor === index + 1 ? 'active' : ''
                                }`}
                                onClick={() => jumpAnchor(index + 1)}
                                key={index + 11111}
                            >
                                <i></i>
                                {el.menuName}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default CommonFunction
