package com.itechart.trucking.consignment.repository;

import com.itechart.trucking.consignment.entity.Consignment;
import com.itechart.trucking.order.entity.Order;
import org.springframework.data.repository.CrudRepository;

public interface ConsignmentRepository extends CrudRepository<Consignment, Long> {
    Consignment findConsignmentByOrder(Order order);
}
