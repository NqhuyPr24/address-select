export const randomId = () => {
    const currentTime = Date.now()
    const randomNum = Math.random().toString(36).substring(2, 7)
    return currentTime.toString(36) + randomNum
}