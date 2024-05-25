
export const handleLogout = ()=>{
    localStorage.clear()
    window.location.replace('/login')
}