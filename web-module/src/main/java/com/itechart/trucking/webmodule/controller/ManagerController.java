package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.order.entity.Order;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/api")
public class ManagerController {


    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ConsignmentRepository consignmentRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private RouteListRepository routeListRepository;

    @GetMapping(value = "/manager/orders")
    public List<Order> findActiveOrders() {
        return orderRepository.findAllByStatus("ACTIVE");
    }

    @GetMapping(value = "/manager/products/{id}")
    public List<Product> findProductsByOrderId(@PathVariable Long id) {
        List<Product> products = new ArrayList<>();
        Optional<Order> order = orderRepository.findById(id);

        if(order.isPresent()) {
            Consignment consignment = consignmentRepository.findConsignmentByOrder(order.get());
            products = productRepository.findAllByConsignment(consignment);
        }
        return products;
    }

    @GetMapping(value = "manager/routelist/{id}")
    public List<RouteList> getRouteList(@PathVariable Long id) {
        Optional<Order> order = orderRepository.findById(id);
        if(!order.isPresent()) return null;

        System.out.println(order.get().getWaybill());
        List<RouteList> routeLists = routeListRepository.findAllByWaybillOrderByPointLevel(order.get().getWaybill());

        System.out.println(routeLists.size());
        return routeLists;
    }

    @PostMapping(value = "/manager/upsateproductstatus/{id}")
    public Optional<Product> changeStatus(@PathVariable Long id,@RequestBody String status) {
        Optional<Product> product = productRepository.findById(id);

        if(product.isPresent()) {
            product.get().setStatus(ProductState.valueOf(status));
            productRepository.save(product.get());
        }

        return product;
    }

    @DeleteMapping(value = "/manager/deletepoint/{id}")
    public boolean deletePoint(@PathVariable Long id) {
        System.out.println(id);
        routeListRepository.deleteById(id);
        return true;
    }

    @PostMapping(value = "/manager/{orderId}/createPoint")
    public boolean createPoint(@PathVariable Long orderId, @RequestBody RouteList routeList) {
        Optional<Order> order = orderRepository.findById(orderId);
        if(!order.isPresent())
            return false;

        routeList.setWaybill(order.get().getWaybill());
        System.out.println("routeList");
        System.out.println(routeList);
        routeListRepository.save(routeList);
        return true;
    }
}
