import 'foundation-sites/js/foundation/foundation';
import 'foundation-sites/js/foundation/foundation.dropdown';
import utils from '@bigcommerce/stencil-utils';
import { normalizeFormData } from '../common/utils/api';

export default function (context) {

    const loadingClass = 'is-loading';
    const $cart = $('[data-cart-preview]');
    const $cartDropdown = $('#cart-preview-dropdownn');
    const $cartLoading = $('<div class="loadingOverlay"></div>');
    const options = {
        template: 'common/cart-preview',
    };

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
                    .addClass('active')
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
            });

        });
    });

    //Delete cart Item from cart
    $('body').on('click', '.remove-btn', event => {
        event.preventDefault();
        const itemId = $(event.currentTarget).closest('.previewCartItem-quantity').attr('item-id');

        utils.api.cart.itemRemove(itemId, (err, response) => {
            utils.api.cart.getContent(options, (err, response) => {
                $cartDropdown
                    .removeClass(loadingClass)
                    .addClass('active')
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
                })
            });
        });

    });


    //Update cart item quantity
    $('body').on('click', '.qty-plus', event => {
        event.preventDefault();

        const itemId = $(event.currentTarget).closest('.previewCartItem-quantity').attr('item-id');

        const $el = $(`#qty-${itemId}`);
        const oldQty = parseInt($el.text(), 10);
        const newQty = $(event.currentTarget).data('action') === 'inc' ? oldQty + 1 : oldQty - 1;

        utils.api.cart.itemUpdate(itemId, newQty, (err, response) => {
            utils.api.cart.getContent(options, (err, response) => {
                $cartDropdown
                    .removeClass(loadingClass)
                    .addClass('active')
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
            });
        });

    });

    //Decrement cart Item Quantity
    $('body').on('click', '.qty-minus', event => {
        event.preventDefault();

        const itemId = $(event.currentTarget).closest('.previewCartItem-quantity').attr('item-id');

        const $el = $(`#qty-${itemId}`);
        const oldQty = parseInt($el.text(), 10);
        const newQty = $(event.currentTarget).data('action') === 'inc' ? oldQty + 1 : oldQty - 1;

        utils.api.cart.itemUpdate(itemId, newQty, (err, response) => {
            utils.api.cart.getContent(options, (err, response) => {
                $cartDropdown
                    .removeClass(loadingClass)
                    .addClass('active')
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
                })
            });
        });

    });
}
