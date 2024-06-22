
export const handleLogout = ()=>{
    localStorage.clear()
    window.location.replace('/login')
}

export const sleep = (time = 120) => {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    });
}
