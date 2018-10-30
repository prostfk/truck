package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.order.repository.OrderRepository;
import com.itechart.trucking.user.repository.UserRepository;
import com.itechart.trucking.waybill.repository.WaybillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@PreAuthorize("hasAuthority('ROLE_DISPATCHER')")
@CrossOrigin
@RestController
@RequestMapping(value = "/api")
public class CommonControllers {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OrderRepository orderRepository;

    // dispatcher | manager
    @RequestMapping(value = "/orders/",method = RequestMethod.GET)
    public List<Order> getOrders(@ModelAttribute Order order){
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
//        String name = "driverUser";
        Company company = userRepository.findUserByUsername(name).getCompany();
        return orderRepository.findAllByCompany(company);
    }
}
