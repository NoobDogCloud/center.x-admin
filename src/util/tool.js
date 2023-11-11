//表格工具

/**
 * 时间格式化
 * @param value
 * @param format
 * @returns {string}
 */
export const formatDate = (value = Date.now(), format = 'Y-M-D h:m:s') => {
    const formatNumber = n => `0${n}`.slice(-2)
    const date = new Date(value)
    const formatList = ['Y', 'M', 'D', 'h', 'm', 's']
    const resultList = []
    resultList.push(date.getFullYear().toString())
    resultList.push(formatNumber(date.getMonth() + 1))
    resultList.push(formatNumber(date.getDate()))
    resultList.push(formatNumber(date.getHours()))
    resultList.push(formatNumber(date.getMinutes()))
    resultList.push(formatNumber(date.getSeconds()))
    for (let i = 0; i < resultList.length; i++) {
        format = format.replace(formatList[i], resultList[i])
    }
    return format
}

/**
 * 文字超长省略
 * @param value
 * @param len
 * @returns {string}
 */
export const textOverflow = (value, len) => {
    if (value.length > len) {
        return value.substring(0, len) + '...'
    }
}

export const dictionary = (value, dictionary) => {
    for (let i = 0; i < dictionary.length; i++) {
        if (dictionary[i].key == value || dictionary[i].id == value) {
            return dictionary[i].label || dictionary[i].name
        }
    }
    return value
}
