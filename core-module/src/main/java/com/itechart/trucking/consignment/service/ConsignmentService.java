package com.itechart.trucking.consignment.service;

import com.itechart.trucking.consignment.entity.Consignment;
import com.itechart.trucking.consignment.repository.ConsignmentRepository;
import com.itechart.trucking.order.entity.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import javax.validation.Valid;

@Service
public class ConsignmentService {

    @Autowired
    private ConsignmentRepository consignmentRepository;

    public Consignment findConsignmentByOrder(Order order) {
        return consignmentRepository.findConsignmentByOrder(order);
    }

    public void customDeleteConsignmentsByOrderId(Long orderId) {
        consignmentRepository.customDeleteConsignmentsByOrderId(orderId);
    }

    public Consignment save(@Valid Consignment consignment) {
        return consignmentRepository.save(consignment);
    }

    public Consignment update(@Valid Consignment consignment) {
        return consignmentRepository.save(consignment);
    }

    public void remove(Consignment consignment) {
        consignmentRepository.delete(consignment);
    }


}
