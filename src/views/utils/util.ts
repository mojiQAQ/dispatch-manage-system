export const filterdata =  function(data: any, filterKey: any, filter: any) {
    if (data === null || data.length === 0) { return data }
    const filterRes = data.filter((item: any) => {
        return Object.keys(item).some(key => {
        if (filterKey.indexOf(key) === -1) return false
        return (
            String(item[key])
            .toLowerCase()
            .indexOf(filter.toLowerCase()) > -1
        )
        })
    })

    return filterRes
}