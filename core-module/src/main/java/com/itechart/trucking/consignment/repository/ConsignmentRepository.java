package com.itechart.trucking.consignment.repository;

import com.itechart.trucking.consignment.entity.Consignment;
import com.itechart.trucking.order.entity.Order;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
<<<<<<< HEAD

import java.util.List;
=======
>>>>>>> rebeans

public interface ConsignmentRepository extends CrudRepository<Consignment, Long> {

    Consignment findConsignmentByOrder(Order order);
<<<<<<< HEAD
    @Query(value = "SELECT * FROM consignment WHERE order_id=:orderId", nativeQuery = true)
    List<Consignment> customFindConsignmentsByOrderId(@Param("orderId") Long orderId);
=======
>>>>>>> rebeans
    @Transactional
    @Modifying
    @Query(value = "DELETE FROM consignment WHERE order_id=:orderId", nativeQuery = true)
    void customDeleteConsignmentsByOrderId(@Param("orderId")Long orderId);
<<<<<<< HEAD

=======
>>>>>>> rebeans
}
