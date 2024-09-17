import { Button } from "antd"
import { useState } from "react"
import { FaPlus, FaTrashCan } from "react-icons/fa6"
import ProvinceItem from "./ProvinceItem"
import { randomId } from "../utils/randomId"
import toast from "react-hot-toast"


const AddressSelect = ({
    data,
    onChange
}: {
    data: Address,
    onChange?: (value: Address) => void
}) => {

    const [address, setAddress] = useState<Address>(data)

    const addProvince = () => {
        setAddress([...address, {
            id: randomId(),
            name: '',
            districts: [
                {
                    id: randomId(),
                    name: '',
                    ward: '',
                    street: ''
                }
            ]
        }])
    }

    const handleAddProvince = () => {
        const isDisabled = address.some(item => {
            if(!item.name || item.districts.length === 0) return true
            return item.districts.some(item => !item.name || !item.ward || !item.street)
        })

        if(isDisabled) {
            toast.error('Vui lòng nhập đầy đủ thông tin trước đó!')
            return
        }

        addProvince()
    }

    const handleChangeProvince = (province: Province) => {
        const newAddress = address.map(item => item.id === province.id ? province : item)
        setAddress(newAddress)
        onChange?.(newAddress)
    }

    const handleDeleteProvince = (province: Province) => {
        const newAddress = address.filter(item => item.id !== province.id)
        setAddress(newAddress)
        onChange?.(newAddress)
    }

    if(address.length < 1) addProvince()

    return (
        <div>
            <h2>Chọn địa điểm</h2>
            <Button
                type="primary"
                icon={<FaPlus />}
                onClick={handleAddProvince}
            >
                Thêm khu vực
            </Button>
            <div>
                {address.map((item) => (
                    <div key={item.id} style={{
                        position: 'relative',
                        paddingLeft: 40,
                        marginTop: 20
                    }}>
                        <Button
                            type="primary"
                            icon={<FaTrashCan />}
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 0
                            }}
                            danger
                            onClick={() => handleDeleteProvince(item)}
                        />
                        <ProvinceItem
                            data={item}
                            onChange={(value) => handleChangeProvince(value)}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AddressSelect

export type Address = Province[]

export type Province = {
    id: string
    name: string
    districts: District[]
}

export type District = {
    id: string
    name: string
    ward: string
    street: string
}