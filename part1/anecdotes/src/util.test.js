import indexOfHighestValue from './util'

it('finds the higest value', () => {
    expect(indexOfHighestValue([1, 2, 3])).toEqual(2)
    expect(indexOfHighestValue([3, 2, 1])).toEqual(0)
    expect(indexOfHighestValue([3, 4, 1])).toEqual(1)
    expect(indexOfHighestValue([3, 4, 4])).toEqual(1)

    expect(indexOfHighestValue([1])).toEqual(0)
    expect(indexOfHighestValue([-999999])).toEqual(0)
    expect(indexOfHighestValue([-Infinity])).toEqual(0)

    expect(indexOfHighestValue([])).toEqual(-1)
})