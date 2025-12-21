package com.corethreads.corethreads.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentResultDto {
    private Long paymentId;
    private Long orderId;
    private String paymentStatus;
    private String transactionReference;
    private BigDecimal authorizedAmount;
    private BigDecimal capturedAmount;
    private LocalDateTime paidAt;
    private String providerMessage;

    public PaymentResultDto() {}

    public Long getPaymentId() { return paymentId; }
    public void setPaymentId(Long paymentId) { this.paymentId = paymentId; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getTransactionReference() { return transactionReference; }
    public void setTransactionReference(String transactionReference) { this.transactionReference = transactionReference; }

    public BigDecimal getAuthorizedAmount() { return authorizedAmount; }
    public void setAuthorizedAmount(BigDecimal authorizedAmount) { this.authorizedAmount = authorizedAmount; }

    public BigDecimal getCapturedAmount() { return capturedAmount; }
    public void setCapturedAmount(BigDecimal capturedAmount) { this.capturedAmount = capturedAmount; }

    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }

    public String getProviderMessage() { return providerMessage; }
    public void setProviderMessage(String providerMessage) { this.providerMessage = providerMessage; }
}
