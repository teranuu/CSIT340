package com.corethreads.corethreads.repository;

import com.corethreads.corethreads.entity.RefundRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RefundRequestRepository extends JpaRepository<RefundRequest, Long> {
    List<RefundRequest> findByOrderId(Long orderId);
    List<RefundRequest> findByStatus(String status);
}
