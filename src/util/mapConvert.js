const mapConvert = {
    toDisplay: (map, v) => {
        for (const mapKey in map) {
            if (map[mapKey].key == v) {
                return map[mapKey].name
            }
        }
    },
    //展示内容转实际值
    toValue: (map, v) => {
        for (const mapKey in map) {
            if (map[mapKey].name == v) {
                return map[mapKey].key
            }
        }
    }
}

export default mapConvert
