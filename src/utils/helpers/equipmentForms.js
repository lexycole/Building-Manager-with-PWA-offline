const EQUIPMENT_FORMS = Object.freeze([
    {
        id: 'BMU',
        pre: {
            checkpoints: [
                "Are the operatives trained to access and use the equipment",
                "Is the cradle inspection tag in date and in it's designated space",
                "Barriers/signs placed below the work area",
                "Weather forecast checked ",
                "Lanyards and harnesses have been checked and no issues found",
                "Cradle track is clear of debris and obstacles",
                "Power cable shows no signs of damage or exposed wiring",
                "Transporter is in good working order",
                "Storm clamp is in good working order (if applicable)",
                "Power supply is on",
                "Emergency stop buttons are in correct position and not damaged",
                "The cradle functions are in good working order",
                "Limit and safety switches are in good working order",
                "All tools/radios/equipment are tethered",
            ]
        },
        post: {
            checkpoints: [
                "Cradle is in authorised parking position",
                "Cradle disconnected from the power supply ",
                "Storm clamp attached (if applicable)",
                "Cradle cover correctly installed",
                "All tools, equipment, and waste removed",
                "Any defects that occurred during use",
            ]
        }

    },
    {
        id: 'MEWP',
        pre: {
            checkpoints: [
                "LOLER and Insurance",
                "Operative is trained to use equipment",
                "Wheels/tyres",
                "Engine/power source",
                "Hydraulics",
                "Hoses and cables",
                "Outtriggers, stabilisers",
                "Chassi, boom, and scissor pack",
                "Platform or cage",
                "Decals and signage",
                "Using Ground and Platform controls",
            ]
        },
        post: {
            checkpoints: [
                "Equipment is returned to correct storage location",
                "Rubbish is removed",
                "Any defects that occurred during use have been highlighted to correct personnel and report filed in site pack",
            ]
        }
    }
])

const PPE_FORM = Object.freeze({
    id: 'ppe',
    questions: [
        {
            question: "Steel Toe Shoes",
            value: "",
            multipleChoice: true
        },
        {
            question: "Full Body Harness",
            value: "",
            multipleChoice: true
        },
        {
            question: "Restraint Lanyards",
            value: "",
            multipleChoice: true
        },
        {
            question: "Weather forecast checked",
            value: "",
            multipleChoice: true
        },
        {
            question: "Uniform (t-shirt, trousers)",
            value: "",
            multipleChoice: true
        },
        {
            question: "Winter Uniform (fleece, winter jacket etc)",
            value: "",
            multipleChoice: true
        },
        {
            question: "Disposable gloves",
            value: "",
            multipleChoice: true
        },
        {
            question: "Winter gloves",
            value: "",
            multipleChoice: true
        },
        {
            question: "Tools attachment (yellow lanyards)",
            value: "",
            multipleChoice: true
        },
        {
            question: "Sunglasses",
            value: "",
            multipleChoice: true
        },
        {
            question: "Damaged item/s",
            value: "N/A",
            multipleChoice: false
        },
        {
            question: "Missing item/s",
            value: "N/A",
            multipleChoice: false
        },
        {
            question: "Damage/Missing equipment reported to",
            value: "N/A",
            multipleChoice: false
        }
    ]
}
)

export const getFormNames = () => {
    const formNames = []
    EQUIPMENT_FORMS.forEach(form => {
        formNames.push(form.id)
    })
    return formNames
}

export const getFormCheckpoints = (form, type) => {
    const formIndex = EQUIPMENT_FORMS.findIndex(f => f.id === form)
    return EQUIPMENT_FORMS[formIndex][type].checkpoints
}

export const getPPEFormQuestions = () => {
    return PPE_FORM.questions
}