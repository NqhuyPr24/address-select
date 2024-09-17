import { useState } from "react"
import { District } from "./AddressSelect"
import { Flex, Input, Select } from "antd"
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const fetchDistricts = async (provinceCode: string) => {
    const { data } = await axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
    return data.districts
}

const fetchWards = async (districtCode: string) => {
    const { data } = await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
    return data.wards
}

const DistrictItem = ({
    provinceCode,
    data,
    onChange
}: {
    provinceCode: any,
    data: District
    onChange?: (data: District) => void
}) => {

    const [district, setDistrict] = useState<District>(data)
    const [selectedDistrict, setSelectedDistrict] = useState<any>(null)
    const { data: districts = [], isLoading: isDistrictsLoading } = useQuery({
        queryKey: ['districts', provinceCode],
        queryFn: () => fetchDistricts(provinceCode),
        enabled: !!provinceCode
    })

    const { data: wards = [], isLoading: isWardsLoading } = useQuery({
        queryKey: ['wards', selectedDistrict?.code],
        queryFn: () => fetchWards(selectedDistrict?.code),
        enabled: !!selectedDistrict?.code
    })

    const handleChangeDistrict = (value: string) => {
        const selected = districts?.find((item: any) => item.name === value)
        const newDistrict: District = {
            ...district,
            name: value,
            ward: '',
            street: ''
        }
        setDistrict(newDistrict)
        setSelectedDistrict(selected)
        onChange?.(newDistrict)
    }

    const handleChangeWard = (value: string) => {
        const newDistrict: District = {
            ...district,
            ward: value,
            street: ''
        }
        setDistrict(newDistrict)
        onChange?.(newDistrict)
    }

    const handleChangeStreet = (e: any) => {
        const newDistrict: District = {...district, street: e.target.value}
        setDistrict(newDistrict)
        onChange?.(newDistrict)
    }

    return (
        <Flex gap={15}>
            <Select
                showSearch
                optionFilterProp="label"
                onChange={handleChangeDistrict}
                loading={isDistrictsLoading}
                value={district.name}
                options={[
                    {
                        value: '',
                        label: 'Chọn quận/huyện'
                    },
                    ...districts.map((item: any) => ({
                        value: item?.name,
                        label: item?.name
                    }))
                ]}
                style={{
                    width: 200
                }}
            />
            <Select
                showSearch
                optionFilterProp="label"
                onChange={handleChangeWard}
                loading={isWardsLoading}
                value={district.ward}
                disabled={!district.name}
                options={[
                    {
                        value: '',
                        label: 'Chọn xã/phường'
                    },
                    ...wards.map((item: any) => ({
                        value: item?.name,
                        label: item?.name
                    }))
                ]}
                style={{
                    width: 200
                }}
            />
            <Input
                onChange={handleChangeStreet}
                placeholder="Đường/Số nhà"
                disabled={!district.ward}
                value={district.street}
                style={{
                    width: 200
                }}
            />
        </Flex>
    )
}

export default DistrictItem