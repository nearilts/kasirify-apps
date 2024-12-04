export const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'IDR' }).format(price);
};

export const formatNumber = (price) => {
    return new Intl.NumberFormat('en-US', { }).format(price);
};