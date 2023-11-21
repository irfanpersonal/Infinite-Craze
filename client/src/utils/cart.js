const getCartFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem('cart'));
}

const addCartToLocalStorage = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export {getCartFromLocalStorage, addCartToLocalStorage};