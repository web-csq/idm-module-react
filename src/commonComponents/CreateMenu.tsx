import { Modal } from 'idm-react-antd'
import React, { useState } from 'react'
interface IProp {
    createMenuShow: boolean
}
const CreateMenu: React.FC<IProp> = (props) => {
    const [isModalVisible, setIsModalVisible] = useState(props.createMenuShow)

    const showModal = () => {
        setIsModalVisible(true)
    }

    const handleOk = () => {
        setIsModalVisible(false)
    }
    const handleCancel = () => {
        setIsModalVisible(false)
    }
    return <Modal title="我要建" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        123
    </Modal>
}

export default CreateMenu
