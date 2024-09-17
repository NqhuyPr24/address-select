import { useState } from "react"
import AddressSelect, { Address } from "./AddressSelect"
import { Flex } from "antd"

const Main = () => {

    const [address, setAddress] = useState<Address>([])

    return (
        <Flex style={{
            width: '100%',
            height: '100vh'
        }}>
            <div style={{
                boxSizing: 'border-box',
                width: '60%',
                height: '100%',
                padding: 20,
                overflowY: 'auto'
            }}>
                <AddressSelect data={address} onChange={setAddress}/>
            </div>
            <div style={{
                boxSizing: 'border-box',
                borderLeft: '1px solid #000',
                width: '40%',
                height: '100%',
                padding: 20,
                overflowY: 'auto'
            }}>
                <h2>Địa điểm</h2>
                {address.map(item => (
                <>
                    {item.name && <div>
                    <h4>Khu vực: {item.name}</h4>
                    <ol>
                        {item.districts.map(district => (
                        <>
                            {district.name && <li>{district.name}{district.ward && ', ' + district.ward}{district.street && ', ' + district.street}.</li>}
                        </>
                        ))}
                    </ol>
                    </div>}
                </>
                ))}
            </div>
        </Flex>
    )
}

export default Main