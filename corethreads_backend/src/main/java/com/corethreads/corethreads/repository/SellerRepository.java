package com.corethreads.corethreads.repository;

import com.corethreads.corethreads.entity.Seller;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SellerRepository extends JpaRepository<Seller, Long> {
    Optional<Seller> findByCustomer_CustomerId(Long customerId);
}
