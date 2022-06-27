import { Modal, Button } from 'idm-react-antd'
import React, { useState, useEffect } from 'react'
import '../styles/commonModal.less'
import SvgIcon from '../icons/SvgIcon'
import { SearchOutlined, CloseOutlined } from '@ant-design/icons'
interface IProp {
    createMenuShow: boolean
    handleCreateMenuClose: (e: any) => void
}
interface IState {
    cyDataObject: Array<any>
    searchValue: string
    changeUrl: string
    dialogHeight: number
}
const CreateMenu: React.FC<IProp> = (props) => {
    const [pageState, setPageState] = useState<IState>({
        cyDataObject: [],
        searchValue: '',
        changeUrl: 'ctrl/shortcut/change',
        dialogHeight: 400
    })
    const [allDataObject, setAllDataObject] = useState({})
    const [activeAnchor, setActiveAnchor] = useState(0)
    useEffect(() => {
        if (props.createMenuShow) {
            initData()
        }
    }, [props.createMenuShow])
    useEffect(() => {
        if (pageState.cyDataObject.length > 0 && Object.keys(allDataObject).length > 0) {
            initAnchorContentScroll()
        }
    }, [pageState.cyDataObject, allDataObject])
    const initData = () => {
        window.IDM.http
            .get('ctrl/api/frame/getBusinessShortcuts?key=' + pageState.searchValue)
            .then((res) => {
                if (res && res.data && res.data.data) {
                    setAllDataObject(res.data.data)
                }
                initCygnData()
            })
            .catch((err) => {})
    }
    const initCygnData = () => {
        window.IDM.http
            .get('ctrl/api/frame/getUsedModuleShortcuts?key=' + pageState.searchValue)
            .then((res) => {
                if (res && res.data && res.data.data) {
                    setPageState({
                        ...pageState,
                        cyDataObject: res.data.data
                    })
                }
            })
            .catch((err) => {})
    }
    const handleOk = () => {
        props.handleCreateMenuClose(1)
    }
    const handleSeachChange = (e) => {
        setPageState({
            ...pageState,
            searchValue: e.target.value
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
        window.IDM.http
            .post('ctrl/api/frame/delUsedShortcut?id=' + item.id, {
                shortcutId: item.shortcutId
            })
            .then((res) => {
                initCygnData()
            })
            .catch((err) => {
                console.log(err)
            })
    }
    const addCygn = (item) => {
        window.IDM.http
            .post('ctrl/api/frame/addUsedModuleShortcut?shortcutId=' + item.shortcutId, { shortcutId: item.shortcutId })
            .then(() => {
                initCygnData()
            })
            .catch((err) => {
                console.log(err)
            })
    }
    return (
        <Modal
            title="我要建"
            maskClosable={false}
            width={900}
            footer={
                <div style={{ textAlign: 'center' }}>
                    <Button onClick={handleOk}>关闭</Button>
                </div>
            }
            onCancel={handleOk}
            wrapClassName="idm-create-menu-app"
            visible={props.createMenuShow}
        >
            <div className="idm-create-menu-app-search">
                <input
                    type="text"
                    onKeyUp={initData}
                    onChange={(e) => handleSeachChange(e)}
                    value={pageState.searchValue}
                    placeholder="请输入关键词进行检索"
                />
                <div>
                    <SearchOutlined className="search-icon" style={{ fontSize: '20px' }} />
                </div>
            </div>
            <div className="idm-create-menu-app-container" style={{ height: pageState.dialogHeight + 'px' }}>
                <div className="idm-create-menu-app-content">
                    <div className="idm-create-menu-app-group-item recently-use">
                        <div className="idm-create-menu-app-group-title">
                            <div>
                                <SvgIcon iconClass="fire"></SvgIcon>常用
                            </div>
                        </div>
                        <div className="idm-create-menu-app-group-content">
                            {pageState.cyDataObject.map((el: any, index) => (
                                <div className="idm-create-menu-app-element-item hasClose" key={index} title={el.name}>
                                    <i className={getClassStr(el.icon)}></i>
                                    {el.shortcutName}
                                    <CloseOutlined onClick={() => delCygn(el)} className="close-icon" />
                                </div>
                            ))}
                        </div>
                    </div>
                    {Object.keys(allDataObject).map((el: string, index) => (
                        <div className="idm-create-menu-app-group-item" key={index}>
                            <div className="idm-create-menu-app-group-title">
                                <div>{el}</div>
                            </div>
                            <div className="idm-create-menu-app-group-content">
                                {allDataObject[el]?.children?.map((els, indexs) => (
                                    <div key={indexs + 1111}>
                                        <div
                                            className="idm-create-menu-app-element-item"
                                            onClick={() => addCygn(els)}
                                            title={els.shortcutName}
                                        >
                                            <i className={getClassStr(els.icon)}></i>
                                            {els.shortcutName}
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
                            <i></i>常用
                        </div>
                        {Object.keys(allDataObject).map((el: string, index) => (
                            <div
                                className={`idm-create-menu-inner-item ${activeAnchor === index + 1 ? 'active' : ''}`}
                                onClick={() => jumpAnchor(index + 1)}
                                key={index + 11111}
                            >
                                <i></i>
                                {el}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default CreateMenu
