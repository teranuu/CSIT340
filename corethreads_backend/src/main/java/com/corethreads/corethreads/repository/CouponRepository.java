package com.corethreads.corethreads.repository;

import com.corethreads.corethreads.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {
    Optional<Coupon> findByCode(String code);
    List<Coupon> findByExpiryDateAfter(LocalDateTime date);
}
