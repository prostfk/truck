package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.driver.entity.Driver;
import com.itechart.trucking.driver.repository.DriverRepository;
import com.itechart.trucking.odt.Odt;
import com.itechart.trucking.order.dto.OrderDto;
import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.order.repository.OrderRepository;
import com.itechart.trucking.routeList.dto.RouteListDto;
import com.itechart.trucking.routeList.entity.RouteList;
import com.itechart.trucking.routeList.repository.RouteListRepository;
import com.itechart.trucking.user.dto.UserDto;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@PreAuthorize("hasAuthority('ROLE_DRIVER')")
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
    @Autowired
    private RouteListRepository routeListRepository;

    @RequestMapping(value = "/orders/getMyOrders",method = RequestMethod.GET)
    public List<OrderDto> getMyOrders(){
        String name = SecurityContextHolder.getContext().getAuthentication().getName();

        Driver driver = driverRepository.findDriverByUser(userRepository.findUserByUsername(name));
        List<Order> orders = orderRepository.findCustomQueryOrderByDriver(driver.getId());

        List<OrderDto> orderDtos = Odt.OrdertoDtoList(orders);
        return orderDtos;
    }

    @RequestMapping(value ="/orders/getMyOrders/{orderId}/routelist",method = RequestMethod.GET)
    public  List<RouteListDto> getRouteList(@PathVariable Long orderId){
        String name= SecurityContextHolder.getContext().getAuthentication().getName();

        Optional<Order> order = orderRepository.findById(orderId);
        if(order==null || order.get().getWaybill().getDriver().getUser().getUsername().equals(name)==false) return null;

       return Odt.RouteListtoDtoList(order.get().getWaybill().getRouteListList());
    }


    @RequestMapping(value ="/orders/getMyOrders/{orderId}/markpoint/{pointId}",method = RequestMethod.PUT)
    public RouteListDto markOrder(@PathVariable Long orderId,@PathVariable Long pointId){
        String name= SecurityContextHolder.getContext().getAuthentication().getName();

        Optional<Order> order = orderRepository.findById(orderId);
        if(order==null || order.get().getWaybill().getDriver().getUser().getUsername().equals(name)==false) return null;

        Optional<RouteList> point = routeListRepository.findById(pointId);
        if(point.isPresent()==false || point.get().getWaybill().getId()!= order.get().getWaybill().getId()) return null;
        else {
            if(point.get().getMarked()==null) point.get().setMarked(false);
            if(point.get().getMarked()) point.get().setMarked(false);
            else point.get().setMarked(true);
        }
        routeListRepository.save(point.get());
        return new RouteListDto(point.get());
    }
}
