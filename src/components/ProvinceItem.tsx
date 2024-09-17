import { useState } from "react"
import { District, Province } from "./AddressSelect"
import { Button, Flex, Select } from "antd"
import DistrictItem from "./DistrictItem"
import { FaPlus, FaTrashCan } from "react-icons/fa6"
import { randomId } from "../utils/randomId"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"

const fetchProvinces = async () => {
    const { data } = await axios.get('https://provinces.open-api.vn/api/p/')
    return data
}

const ProvinceItem = ({
    data,
    onChange
}: {
    data: Province
    onChange?: (data: Province) => void
}) => {

    const { data: provinces = [], isLoading } = useQuery({
        queryKey: ['provinces'],
        queryFn: fetchProvinces,
    })
    const [province, setProvince] = useState<Province>(data)
    const [selectedProvince, setSelectedProvince] = useState<any>(null)

    const addDistrict = () => {
        setProvince(prev => {
            const districtsTmp = prev.districts
            return {
                ...prev,
                districts: [
                    ...districtsTmp,
                    {
                        id: randomId(),
                        name: '',
                        ward: '',
                        street: ''
                    }
                ]
            }
        })
    }

    const handleAddDistrict = () => {
        const isDisabled = province.districts.some(item => !item.name || !item.street || !item.ward)

        if(isDisabled) {
            toast.error('Vui lòng nhập đầy đủ thông tin trước đó!')
            return
        }

        addDistrict()
    }

    const handleDeleteDistrict = (value: District) => {
        const newProvince : Province = {
            ...province,
            districts: province.districts.filter(item => item.id !== value.id)
        }
        setProvince(newProvince)
        onChange?.(newProvince)
    }

    const handleChange = (value: string) => {
        const selected = provinces?.find((item: any) => item.name === value)
        const newProvince: Province = {
            ...province,
            name: value,
            districts: []
        }
        setProvince(newProvince)
        setSelectedProvince(selected)
        onChange?.(newProvince)
    }

    const handleDistrictChange = (district: District) => {
        const newDistricts: District[]  = province.districts.map(item => item.id === district.id ? district : item)
        const newProvince: Province = {
            ...province,
            districts: newDistricts
        }
        setProvince(newProvince)
        onChange?.(newProvince)
    }

    if(province.districts.length < 1) addDistrict()

    return (
        <div>
            <Select
                showSearch
                optionFilterProp="label"
                onChange={handleChange}
                loading={isLoading}
                value={province.name}
                options={[
                    {
                        value: '',
                        label: 'Chọn khu vực'
                    },
                    ...provinces.map((item: any) => ({
                        value: item?.name,
                        label: item?.name
                    }))
                ]}
                style={{
                    marginBottom: 10,
                    width: 200
                }}
            />
            {selectedProvince ? <>
                {province.districts.map((item) => (
                    <Flex
                        key={item.id}
                        style={{
                            marginBottom: 10 
                        }}
                    >
                        <DistrictItem
                            provinceCode={selectedProvince?.code}
                            data={item}
                            onChange={(e) => handleDistrictChange(e)}
                        />
                        <Button
                            type="primary"
                            icon={<FaTrashCan />}
                            style={{
                                marginLeft: 10
                            }}
                            danger
                            onClick={() => handleDeleteDistrict(item)}
                        />
                    </Flex>
                ))}
                <Button
                    type="primary"
                    icon={<FaPlus />}
                    style={{
                        backgroundColor: '#13b765' 
                    }}
                    onClick={handleAddDistrict}
                >
                    Thêm địa điểm
                </Button>
            </> : <></>}
        </div>
    )
}

export default ProvinceItem