package com.itechart.trucking.order.repository;

import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.order.entity.Order;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends CrudRepository<Order, Long> {
    List<Order> findAllByCompany(Company company);
}
