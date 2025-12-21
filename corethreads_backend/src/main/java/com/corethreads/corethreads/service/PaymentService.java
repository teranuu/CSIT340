package com.corethreads.corethreads.service;

import com.corethreads.corethreads.entity.Payment;
import com.corethreads.corethreads.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public Payment createPayment(Payment payment) {
        payment.setCreatedAt(LocalDateTime.now());
        return paymentRepository.save(payment);
    }

    public Optional<Payment> getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId);
    }

    public List<Payment> getOrderPayments(Long orderId) {
        return paymentRepository.findByOrderId(orderId);
    }

    public Optional<Payment> getPaymentByTransactionReference(String reference) {
        return paymentRepository.findByTransactionReference(reference);
    }

    public Payment updatePaymentStatus(Long paymentId, String status) {
        return paymentRepository.findById(paymentId)
                .map(payment -> {
                    payment.setPaymentStatus(status);
                    if ("COMPLETED".equals(status)) {
                        payment.setPaidAt(LocalDateTime.now());
                    }
                    return paymentRepository.save(payment);
                })
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    public List<Payment> getPaymentsByStatus(String status) {
        return paymentRepository.findByPaymentStatus(status);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
}
