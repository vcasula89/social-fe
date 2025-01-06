export function isEmail(value) {
    return value.includes('@');
}

export function isNotEmpty(value) {
    return value.trim() !== '';
}

export function hasMinLength(value, minLength) {
    return value.length >= minLength;
}

export function isEqualsToOtherValue(value, otherValue) {
    return value === otherValue;
}

export function isAlphaNum(value) {
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    return hasUpperCase && hasLowerCase && hasNumber;
}
