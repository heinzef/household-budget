export const saveProfile = (userName) => {
    const profileObj = {
        userName,
    };
    localStorage.setItem('profile', JSON.stringify(profileObj));
}

export const loadProfile = () => {
    let profileObj = {};
    const profileAsString = localStorage.getItem('profile');
    if (profileAsString && profileAsString.length > 0) {
        profileObj = JSON.parse(profileAsString);
    }
    return profileObj;
}