export function createElement(type, props, ...children) {
    const reaktElement = {
        type,
        props,
        children,
    }
    return reaktElement
}
