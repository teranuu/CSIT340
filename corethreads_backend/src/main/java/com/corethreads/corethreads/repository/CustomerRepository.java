package com.corethreads.corethreads.repository;

import com.corethreads.corethreads.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
	Optional<Customer> findByUsername(String username);
	boolean existsByUsername(String username);
	boolean existsByEmail(String email);
	
	// Align native query with entity mapping: table `customer`, PK `customer_id`
	@Query(value = "SELECT * FROM customer WHERE customer_id = :customerId", nativeQuery = true)
	Optional<Customer> findByCustomerIdNative(@Param("customerId") Long customerId);
}
