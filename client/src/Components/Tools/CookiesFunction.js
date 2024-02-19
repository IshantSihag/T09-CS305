function setCookie(key, value, expirationHours) {
    var d = new Date();
    d.setTime(d.getTime() + (expirationHours * 60 * 60 * 1000)); // Convert hours to milliseconds
    var expires = "expires=" + d.toUTCString();
    document.cookie = key + "=" + value + ";" + expires + ";path=/";
}
function getCookie(key) {
    var name = key + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookieArray = decodedCookie.split(';');

    for (var i = 0; i < cookieArray.length; i++) {
        var cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return null;
}
function deleteCookie(key) {
    var d = new Date();
    d.setTime(d.getTime() - 1); // Set expiration time to the past

    // Set the cookie with the same key to expire immediately
    document.cookie = key + "=; expires=" + d.toUTCString() + "; path=/";
}



export { setCookie, getCookie ,deleteCookie}