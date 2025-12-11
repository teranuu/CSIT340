package com.corethreads.corethreads.service;

import com.corethreads.corethreads.entity.Cart;
import com.corethreads.corethreads.entity.CartItem;
import com.corethreads.corethreads.entity.Customer;
import com.corethreads.corethreads.entity.ProductVariant;
import com.corethreads.corethreads.repository.CartRepository;
import com.corethreads.corethreads.repository.CartItemRepository;
import com.corethreads.corethreads.repository.CustomerRepository;
import com.corethreads.corethreads.repository.ProductVariantRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final CustomerRepository customerRepository;
    private final ProductVariantRepository productVariantRepository;

    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository,
                      CustomerRepository customerRepository, ProductVariantRepository productVariantRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.customerRepository = customerRepository;
        this.productVariantRepository = productVariantRepository;
    }

    public Cart getOrCreateCart(Long customerId) {
        return cartRepository.findByCustomerId(customerId)
                .orElseGet(() -> {
                    Customer customer = customerRepository.findById(customerId)
                            .orElseThrow(() -> new RuntimeException("Customer not found"));
                    Cart newCart = new Cart(customer);
                    return cartRepository.save(newCart);
                });
    }

    public CartItem addToCart(Long customerId, Long variantId, Long quantity) {
        Cart cart = getOrCreateCart(customerId);
        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Variant not found"));

        // Check if item already exists
        List<CartItem> existingItems = cartItemRepository.findByCartId(cart.getCartId());
        for (CartItem item : existingItems) {
            if (item.getVariant().getVariantId().equals(variantId)) {
                item.setQuantity(item.getQuantity() + quantity);
                return cartItemRepository.save(item);
            }
        }

        CartItem cartItem = new CartItem(cart, variant, quantity);
        return cartItemRepository.save(cartItem);
    }

    public void updateCartItemQuantity(Long cartItemId, Long quantity) {
        cartItemRepository.findById(cartItemId)
                .ifPresent(item -> {
                    item.setQuantity(quantity);
                    cartItemRepository.save(item);
                });
    }

    public void removeFromCart(Long cartItemId) {
        cartItemRepository.deleteById(cartItemId);
    }

    public List<CartItem> getCartItems(Long customerId) {
        Cart cart = getOrCreateCart(customerId);
        return cartItemRepository.findByCartId(cart.getCartId());
    }

    public void clearCart(Long customerId) {
        Cart cart = cartRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        cartItemRepository.findByCartId(cart.getCartId())
                .forEach(item -> cartItemRepository.deleteById(item.getCartItemId()));
    }
}
