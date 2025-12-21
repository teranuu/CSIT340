package com.corethreads.corethreads.repository;

import com.corethreads.corethreads.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByCartCartId(Long cartId);
    void deleteByCartCartIdAndVariantVariantId(Long cartId, Long variantId);
}
