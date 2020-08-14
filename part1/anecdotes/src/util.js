function indexOfHighestValue(things) {
    const [, index] = things.reduce(
        ([maxVal, maxI], val, i) => maxI < 0 || val > maxVal ? [val, i] : [maxVal, maxI],
        [-Infinity, -1],
    )
    return index
}

export default indexOfHighestValue;