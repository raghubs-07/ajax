import 'foundation-sites/js/foundation/foundation';
import 'foundation-sites/js/foundation/foundation.dropdown';
import utils from '@bigcommerce/stencil-utils';
import { normalizeFormData } from '../common/utils/api';
import { update } from 'lodash';



//Get cart details
// async function getCart(url) {
//     return fetch(url, {
//         method: "GET",
//         credentials: "same-origin"
//     })
//         .then(response => response.json())
//         .catch(error => console.error(error));
// };

export default function (context) {

    const loadingClass = 'is-loading';
    const $cart = $('[data-cart-preview]');
    const $cartDropdown = $('#cart-preview-dropdownn');
    const $cartLoading = $('<div class="loadingOverlay"></div>');
    const options = {
        template: 'common/cart-preview',
    };


    // close cart 

    $('body').on('click', '.close-btn-cart', event => {
        event.preventDefault();

        const cartMenu = $(event.currentTarget).closest('.dropdown-menu-cart');
        cartMenu.removeClass('is-open');
    })

    //Add to card on Card
    $('body').on('click', '.card-atc', event => {
        event.preventDefault();

        const productId = $(event.currentTarget).data('productId');

        let formData = new FormData();
        formData.append('product_id', productId);
        formData.append('quantity', 1);

        // Do not do AJAX if browser doesn't support FormData
        if (window.FormData === undefined) {
            return;
        }


        $cartDropdown
            .addClass(loadingClass)
            .html($cartLoading);
        $cartLoading
            .show();

        // Add item to cart
        utils.api.cart.itemAdd(normalizeFormData(formData), (err, response) => {
            utils.api.cart.getContent(options, (err, response) => {
                $cartDropdown
                    .removeClass(loadingClass)
                    .addClass('is-open')
                    .html(response);
                $cartLoading
                    .hide();

                utils.api.cart.getCartQuantity({}, (err, quantity) => {

                    if (quantity > 0) {
                        $('.cart-quantity')
                            .text(quantity)
                            .toggleClass('countPill--positive', quantity > 0);
                    }
                });

                // update subtotal

                fetch('/api/storefront/carts?include=lineItems.digitalItems.options,lineItems.physicalItems.options', {
                    method: "GET",
                    credentials: "same-origin"
                })
                    .then(response => response.json())
                    .then(response => {
                        let data = response;
                        let symbol = data[0].currency.symbol;
                        let Items = data[0].lineItems.physicalItems;

                        let total = Items.reduce((acc, element) => {
                            return acc + (element.salePrice * element.quantity);
                        }, 0);

                        $('.sub-total-value').text(`${symbol} ${total}`)

                    })
                    .catch(error => console.error(error));
            });

        });
    });

    //Delete cart Item from cart
    $('body').on('click', '.cart-remove-btn', event => {
        event.preventDefault();
        const itemId = $(event.currentTarget).closest('.quantity-container').attr('item-id');

        utils.api.cart.itemRemove(itemId, (err, response) => {
            utils.api.cart.getContent(options, (err, response) => {
                $cartDropdown
                    .removeClass(loadingClass)
                    .addClass('is-open')
                    .html(response);
                $cartLoading
                    .hide();

                utils.api.cart.getCartQuantity({}, (err, quantity) => {

                    if (quantity > 0) {
                        $('.cart-quantity')
                            .text(quantity)
                            .toggleClass('countPill--positive', quantity > 0);
                    } else {
                        $('.cart-quantity').removeClass('countPill--positive')
                    }
                });

                // update subtotal
                fetch('/api/storefront/carts?include=lineItems.digitalItems.options,lineItems.physicalItems.options', {
                    method: "GET",
                    credentials: "same-origin"
                })
                    .then(response => response.json())
                    .then(response => {
                        let data = response;
                        let symbol = data[0].currency.symbol;
                        let Items = data[0].lineItems.physicalItems;

                        let total = Items.reduce((acc, element) => {
                            return acc + (element.salePrice * element.quantity);
                        }, 0);

                        $('.sub-total-value').text(`${symbol} ${total}`)

                    })
                    .catch(error => console.error(error));
            });
        });

    });


    //Update cart item quantity
    $('body').on('click', '.cart-qty-plus', event => {
        event.preventDefault();

        const itemId = $(event.currentTarget).closest('.quantity-container').attr('item-id');

        const $el = $(`#qty-${itemId}`);
        const oldQty = parseInt($el.text(), 10);
        const newQty = $(event.currentTarget).data('action') === 'inc' ? oldQty + 1 : oldQty - 1;

        utils.api.cart.itemUpdate(itemId, newQty, (err, response) => {
            // console.log(response);
            utils.api.cart.getContent(options, (err, response) => {
                $cartDropdown
                    .removeClass(loadingClass)
                    .addClass('is-open')
                    .html(response);
                $cartLoading
                    .hide();

                utils.api.cart.getCartQuantity({}, (err, quantity) => {

                    if (quantity > 0) {
                        $('.cart-quantity')
                            .text(quantity)
                            .toggleClass('countPill--positive', quantity > 0);
                    }
                })

                //Update Subtotal
                fetch('/api/storefront/carts?include=lineItems.digitalItems.options,lineItems.physicalItems.options', {
                    method: "GET",
                    credentials: "same-origin"
                })
                    .then(response => response.json())
                    .then(response => {
                        let data = response;
                        let symbol = data[0].currency.symbol;
                        let Items = data[0].lineItems.physicalItems;

                        let total = Items.reduce((acc, element) => {
                            return acc + (element.salePrice * element.quantity);
                        }, 0);

                        $('.sub-total-value').text(`${symbol} ${total}`)

                    })
                    .catch(error => console.error(error));

            });
        });

    });

    //Decrement cart Item Quantity
    $('body').on('click', '.cart-qty-minus', event => {
        event.preventDefault();

        const itemId = $(event.currentTarget).closest('.quantity-container').attr('item-id');

        const $el = $(`#qty-${itemId}`);
        const oldQty = parseInt($el.text(), 10);
        const newQty = $(event.currentTarget).data('action') === 'inc' ? oldQty + 1 : oldQty - 1;

        utils.api.cart.itemUpdate(itemId, newQty, (err, response) => {
            utils.api.cart.getContent(options, (err, response) => {
                $cartDropdown
                    .removeClass(loadingClass)
                    .addClass('is-open')
                    .html(response);
                $cartLoading
                    .hide();

                utils.api.cart.getCartQuantity({}, (err, quantity) => {

                    if (quantity > 0) {
                        $('.cart-quantity')
                            .text(quantity)
                            .toggleClass('countPill--positive', quantity > 0);
                    } else {
                        $('.cart-quantity').removeClass('countPill--positive')
                    }
                });

                //Update Subtotal
                fetch('/api/storefront/carts?include=lineItems.digitalItems.options,lineItems.physicalItems.options', {
                    method: "GET",
                    credentials: "same-origin"
                })
                    .then(response => response.json())
                    .then(response => {
                        let data = response;
                        let symbol = data[0].currency.symbol;
                        let Items = data[0].lineItems.physicalItems;

                        let total = Items.reduce((acc, element) => {
                            return acc + (element.salePrice * element.quantity);
                        }, 0);

                        $('.sub-total-value').text(`${symbol} ${total}`)

                    })
                    .catch(error => console.error(error));
            });
        });

    });
}
