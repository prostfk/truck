package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.driver.entity.Driver;
import com.itechart.trucking.driver.repository.DriverRepository;
import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.order.repository.OrderRepository;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/api")
public class DriverController {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DriverRepository driverRepository;

    @RequestMapping(value = "/orders/getMyOrders",method = RequestMethod.GET)
    public List<Order> getMyOrders(){
        String name="driverUser";
        User user = userRepository.findUserByUsername(name);
        if(user==null) return null;
        Driver driver = driverRepository.findDriverByUser(user);
        if(driver==null) return null;
        List<Order> orders = orderRepository.findCustomQueryOrderByDriver(driver.getId());
        return orders;
    }
}
