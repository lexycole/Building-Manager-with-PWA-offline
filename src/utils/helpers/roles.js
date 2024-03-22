const USER_ROLES = Object.freeze({
    ADMIN: 'admin',
    MANAGER: 'manager',
    WINDOW_CLEANER: 'windowCleaner',
    DIRECTOR: 'director',
    SUPERVISOR: 'supervisor'
})

const CAN_ACCESS_APP = Object.freeze([
    USER_ROLES.ADMIN, 
    USER_ROLES.WINDOW_CLEANER, 
    USER_ROLES.MANAGER, 
    USER_ROLES.DIRECTOR,
    USER_ROLES.SUPERVISOR
])


export const getAccess = (userRole) => {
    return CAN_ACCESS_APP.includes(userRole)
}
