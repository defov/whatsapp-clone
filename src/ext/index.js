Date.prototype.toFormattedString = function() {
    return `${this.toDateString()} ${addZeros(this.getHours())}:${addZeros(this.getMinutes())}`
}

String.prototype.isValidEmail = function() {
    return this.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
}

const addZeros = (num) => {
    if(num < 10) num = '0' + num
    return num
}