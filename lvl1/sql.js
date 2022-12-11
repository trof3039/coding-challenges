// https://www.codewars.com/kata/545434090294935e7d0010ab
const query = () => {
    this.selectFn = undefined
    this.fromData = null
    this.fromJoinData = null
    this.whereConditions = []
    this.whereJoinConditions = []
    this.groupByConditions = undefined
    this.orderByFn = undefined
    this.havingConditions = []

    this.select = fn => {
        if (this.selectFn === undefined) {
            this.selectFn = fn || null
            return this
        }
        throw new Error('Duplicate SELECT')
    }
    this.from = (...data) => {
        if (this.fromData || this.fromJoinData) throw new Error('Duplicate FROM')
        if (!data || data.length === 0) this.fromData = []
        if (data.length === 1) this.fromData = data
        if (data.length > 1) this.fromJoinData = data
        
        return this
    }
    this.where = (...conditionFns) => {
        if (conditionFns.length) {
            if (!this.fromJoinData) this.whereConditions.push(conditionFns)
            else this.whereJoinConditions.push(conditionFns)
        }
        
        return this
    }
    this.groupBy = (...groupByFns) => {
        if (this.groupByConditions === undefined) {
            this.groupByConditions = groupByFns || null
            return this
        }

        throw new Error('Duplicate GROUPBY')
    }
    this.orderBy = compareFn => {
        if (this.orderByFn === undefined) {
            this.orderByFn = compareFn || null
            return this
        }
        throw new Error('Duplicate ORDERBY')
    }
    this.having = (...conditionFns) => {
        if (conditionFns.length) this.havingConditions.push(conditionFns)
        return this
    }

    this.execute = () => {
        const isItemValid = (item, conditions) => !conditions.length ? true : conditions.reduce(
            (acc, fnArr) => {
                if (!acc) return false

                return fnArr.reduce(
                    (res, fn) => {
                        if (res) return true
        
                        return fn(item)
                    }, false
                )
            }
            , true
        )
        const getWhereData = (from, where) => from.length === 1 
            ? from[0].filter(item => isItemValid(item, where))
            : from[0].reduce(
                    (acc, firstTableItem) => {
                        const validSecondTableItems = from[1].filter(item => isItemValid([firstTableItem, item], where))
                        if (validSecondTableItems) validSecondTableItems.forEach(item => acc.push([firstTableItem, item]))
                        return acc
                    }, []
                )
        
        const getGroupByData = (whereData, fnArr) => {
            const flatGroupBy = (flatArr, groupByFn) => {
                const groupByData = []
                flatArr.forEach(item => {
                    const groupByKey = groupByFn(item)
                    const group = groupByData.find(group => group[0] === groupByKey)
                    if (group) group[1].push(item)
                    else groupByData.push([groupByKey, [item]])
                })
                return groupByData
            }
            const deepGroupBy = (data, groupByFn, fnIndex, counter = 1) => {
                if (fnIndex === 0) return flatGroupBy(data, groupByFn)
                if (fnIndex === counter) return data.map(group => [group[0], flatGroupBy(group[1], groupByFn)])
                return data.map(deeperData => [deeperData[0], deepGroupBy(deeperData[1], groupByFn, fnIndex, counter + 1)])
            }

            return fnArr.reduce((acc, fn, index) => deepGroupBy(!acc ? whereData : acc, fn, index), null)
        }
        const getHavingData = (data, having) => data.filter(item => having.length ? isItemValid(item, having) : true)
        const getSelectData = (data, select) => data.map(item => select(item))
        const getOrderByData = (data, orderBy) => data.sort(orderBy)

        const { fromData, fromJoinData, whereConditions, whereJoinConditions } = this
        if ((!fromData || !fromData.length) && (!fromJoinData || !fromJoinData.length)) return []

        const whereData = getWhereData(fromData || fromJoinData, whereConditions.length ? whereConditions : whereJoinConditions)
        const groupByData = this.groupByConditions ? getGroupByData(whereData, this.groupByConditions) : whereData
        const havingData = this.havingConditions ? getHavingData(groupByData, this.havingConditions) : groupByData
        const selectData = this.selectFn ? getSelectData(havingData, this.selectFn) : havingData
        const finalData = this.orderByFn ? getOrderByData(selectData, this.orderByFn) : selectData

        return finalData
    }

    return this
}

module.exports = query



