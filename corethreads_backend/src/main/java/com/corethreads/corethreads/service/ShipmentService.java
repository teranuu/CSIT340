package com.corethreads.corethreads.service;

import com.corethreads.corethreads.entity.Shipment;
import com.corethreads.corethreads.repository.ShipmentRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;

    public ShipmentService(ShipmentRepository shipmentRepository) {
        this.shipmentRepository = shipmentRepository;
    }

    public Shipment createShipment(Shipment shipment) {
        shipment.setCreatedAt(LocalDateTime.now());
        return shipmentRepository.save(shipment);
    }

    public Optional<Shipment> getShipmentById(Long shipmentId) {
        return shipmentRepository.findById(shipmentId);
    }

    public List<Shipment> getOrderShipments(Long orderId) {
        return shipmentRepository.findByOrderId(orderId);
    }

    public Optional<Shipment> getShipmentByTrackingNumber(String trackingNumber) {
        return shipmentRepository.findByTrackingNumber(trackingNumber);
    }

    public Shipment updateShipmentStatus(Long shipmentId, String status) {
        return shipmentRepository.findById(shipmentId)
                .map(shipment -> {
                    shipment.setStatus(status);
                    if ("PICKED_UP".equals(status) && shipment.getShippedAt() == null) {
                        shipment.setShippedAt(LocalDateTime.now());
                    }
                    if ("DELIVERED".equals(status) && shipment.getDeliveredAt() == null) {
                        shipment.setDeliveredAt(LocalDateTime.now());
                    }
                    return shipmentRepository.save(shipment);
                })
                .orElseThrow(() -> new RuntimeException("Shipment not found"));
    }

    public List<Shipment> getShipmentsByStatus(String status) {
        return shipmentRepository.findByStatus(status);
    }

    public List<Shipment> getAllShipments() {
        return shipmentRepository.findAll();
    }
}
