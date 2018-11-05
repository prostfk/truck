package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.cancellationAct.entity.CancellationAct;
import com.itechart.trucking.cancellationAct.repository.CancellationActRepository;
import com.itechart.trucking.driver.entity.Driver;
import com.itechart.trucking.driver.repository.DriverRepository;
import com.itechart.trucking.odt.Odt;
import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.order.repository.OrderRepository;
import com.itechart.trucking.product.dto.ProductDto;
import com.itechart.trucking.product.entity.Product;
import com.itechart.trucking.product.entity.ProductState;
import com.itechart.trucking.product.repository.ProductRepository;
import com.itechart.trucking.routeList.entity.RouteList;
import com.itechart.trucking.routeList.repository.RouteListRepository;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
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
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CancellationActRepository cancellationActRepository;

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

    @RequestMapping(value ="/orders/getMyOrders/{orderId}/routelist",method = RequestMethod.GET)
    public  List<RouteList> getRouteList(@PathVariable Long orderId){
        String name="driverUser";
        Optional<Order> order = orderRepository.findById(orderId); if(!order.isPresent()) return null;
        List<RouteList> routeLists = null;
        if(order.get().getWaybill().getDriver().getUser().getUsername().equals(name)) routeLists = routeListRepository.findAllByWaybillOrderByPointLevel(order.get().getWaybill());
        return routeLists;
    }
/*    @RequestMapping(value ="/orders/getMyOrders/{orderId}/routelist/{pointId}",method = RequestMethod.GET)
    public  RouteList getRouteListPoint(@PathVariable Long orderId,@PathVariable Long pointId){
        String name="driverUser";
        Optional<Order> order = orderRepository.findById(orderId); if(!order.isPresent()) return null;
        Optional<RouteList> routeList = null;
        if(order.get().getWaybill().getDriver().getUser().getUsername().equals(name)) routeList = routeListRepository.findById(pointId);
        return routeList.get();
    }*/

    @RequestMapping(value ="/orders/getMyOrders/{orderId}/markpoint/{pointId}",method = RequestMethod.PUT)
    public Optional<RouteList> markorder(@PathVariable Long orderId,@PathVariable Long pointId){
        String name="driverUser";

        Optional<Order> order = orderRepository.findById(orderId); if(!order.isPresent()) return null;
        List<RouteList> routeLists = null;
        if(order.get().getWaybill().getDriver().getUser().getUsername().equals(name)) routeLists = routeListRepository.findAllByWaybillOrderByPointLevel(order.get().getWaybill());
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

    @RequestMapping(value ="/orders/getMyOrders/{orderId}/consignment",method = RequestMethod.GET)
    public List<ProductDto> getDriverConsignment(@PathVariable Long orderId) {
        Optional<Order> order = orderRepository.findById(orderId);
        List<Product> products = order.isPresent() ? order.get().getConsignment().getProductList() : Collections.EMPTY_LIST;
        return Odt.ProductToDtoList(products);
    }

    @RequestMapping(value ="/orders/getMyOrders/cancelProduct/{productId}",method = RequestMethod.GET)
    public ProductDto cancelProduct(@PathVariable Long productId) {
        Optional<Product> product = productRepository.findById(productId);
        CancellationAct cancellationAct = product.isPresent()? product.get().getCancellationAct() : null;

        if(cancellationAct == null)
            return null;

        product.get().setStatus(ProductState.valueOf("LOST"));
        cancellationAct.setPrice(product.get().getPrice() + cancellationAct.getPrice());
        Integer amount = cancellationAct.getAmount() + 1;
        cancellationAct.setAmount(amount);

        productRepository.save(product.get());
        cancellationActRepository.save(cancellationAct);

        return new ProductDto(product.get());
    }
}
