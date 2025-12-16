package com.corethreads.corethreads.repository;

import com.corethreads.corethreads.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByCustomerCustomerId(Long customerId);
    List<Address> findByCustomerCustomerIdAndIsDefaultTrue(Long customerId);
}
