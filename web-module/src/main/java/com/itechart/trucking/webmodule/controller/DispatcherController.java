package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.order.repository.OrderRepository;
import com.itechart.trucking.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping(value = "/api")
public class DispatcherController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OrderRepository orderRepository;

    @RequestMapping(value = "/orders/",method = RequestMethod.GET)
    public List<Order> getOrders(@ModelAttribute Order order){
        /*        String name = SecurityContextHolder.getContext().getAuthentication().getName();*/
        String name = "manager";
        Company company = userRepository.findUserByUsername(name).getCompany();
        List<Order> orders= orderRepository.findAllByCompany(company);
        return orders;
    }

    @RequestMapping(value = "/orders/{id}",method = RequestMethod.GET)
    public Order editOrder(@PathVariable Long id){
        /*        String name = SecurityContextHolder.getContext().getAuthentication().getName();*/
        System.out.println(id);
        String name = "manager";
        Company company = userRepository.findUserByUsername(name).getCompany();

        Optional<Order> order = orderRepository.findById(id);
        if(order.isPresent() && order.get().getCompany().getId()==company.getId())
        return order.get();
        else{
            System.out.println("access dined");
            return null;
        }
    }

    @RequestMapping(value = "/ordedrs/createorder",method = RequestMethod.POST)
    public boolean createOrder(@ModelAttribute Order order){
        /*        String name = SecurityContextHolder.getContext().getAuthentication().getName();*/
        System.out.println(order);
        return true;
    }

}
