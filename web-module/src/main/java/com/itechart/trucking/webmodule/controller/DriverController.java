package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.driver.entity.Driver;
import com.itechart.trucking.driver.repository.DriverRepository;
import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.order.repository.OrderRepository;
import com.itechart.trucking.routeList.entity.RouteList;
import com.itechart.trucking.routeList.repository.RouteListRepository;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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
    public List<Order> getMyOrders(){
        String name="driverUser";
        User user = userRepository.findUserByUsername(name);
        if(user==null) return null;
        Driver driver = driverRepository.findDriverByUser(user);
        if(driver==null) return null;
        List<Order> orders = orderRepository.findCustomQueryOrderByDriver(driver.getId());
        return orders;
    }

    @RequestMapping(value ="/orders/getMyOrders/{orderId}",method = RequestMethod.GET)
    public  List<RouteList> getRouteList(@PathVariable Long orderId){
        String name="driverUser";

        Optional<Order> order = orderRepository.findById(orderId); if(!order.isPresent()) return null;
        List<RouteList> routeLists = null;
        if(order.get().getWaybill().getDriver().getUser().getUsername().equals(name)) routeLists = routeListRepository.findAllByWaybillOrderByPointLevelDesc(order.get().getWaybill());
        return routeLists;
    }

    @RequestMapping(value ="/orders/getMyOrders/{orderId}/markpoint/{pointId}",method = RequestMethod.GET)
    public Optional<RouteList> markorder(@PathVariable Long orderId,@PathVariable Long pointId){
        String name="driverUser";

        Optional<Order> order = orderRepository.findById(orderId); if(!order.isPresent()) return null;
        List<RouteList> routeLists = null;
        if(order.get().getWaybill().getDriver().getUser().getUsername().equals(name)) routeLists = routeListRepository.findAllByWaybillOrderByPointLevelDesc(order.get().getWaybill());
        else return null;
        Optional<RouteList> point = routeListRepository.findById(pointId);
        if(point.isPresent()){
            if(point.get().getMarked()==null) point.get().setMarked(false);
            if(point.get().getMarked()) point.get().setMarked(false);
            else point.get().setMarked(true);
        }
        routeListRepository.save(point.get());
        return point;
    }
}
