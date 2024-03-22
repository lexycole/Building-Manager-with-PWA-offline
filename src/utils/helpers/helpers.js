const CLEAN_NAMES = Object.freeze([
    { id: 'cleanOne', name: 'Clean One' },
    { id: 'cleanTwo', name: 'Clean Two' },
    { id: 'cleanThree', name: 'Clean Three' },
    { id: 'cleanFour', name: 'Clean Four' },
    { id: 'cleanFive', name: 'Clean Five' },
    { id: 'cleanSix', name: 'Clean Six' },
    { id: 'cleanSeven', name: 'Clean Seven' },
    { id: 'cleanEight', name: 'Clean Eight' },
    { id: 'cleanNine', name: 'Clean Nine' },
    { id: 'cleanTen', name: 'Clean Ten' },
])

export function getCleanNames(numberOfCleans) {
    const cleanNames = []
    for (let i = 0; i < numberOfCleans; i++) {
        cleanNames.push(CLEAN_NAMES[i].name);
    }
    return cleanNames
}

export function getCleanNameFromId(id) {
    try {
        const cleanIndex = CLEAN_NAMES.findIndex(clean => clean.id === id)
        if (cleanIndex === -1) {
            throw new Error('An Error has occurred. Please try again or contact us if the error persists.')
        }
        return CLEAN_NAMES[cleanIndex].name
    } catch (error) {
        console.log(error)
    }

}

export function getCleanIdFromName(name) {
    try {
        const cleanIndex = CLEAN_NAMES.findIndex(clean => clean.name === name)
        if (cleanIndex === -1) {
            throw new Error('An Error has occurred. Please try again or contant us if the error persists.')
        }
        return CLEAN_NAMES[cleanIndex].id
    } catch (error) {
        console.log(error)
    }

}
