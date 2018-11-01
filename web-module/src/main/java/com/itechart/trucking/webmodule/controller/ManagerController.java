package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.cancellationAct.entity.CancellationAct;
import com.itechart.trucking.cancellationAct.repository.CancellationActRepository;
import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.consignment.entity.Consignment;
import com.itechart.trucking.consignment.repository.ConsignmentRepository;
import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.order.repository.OrderRepository;
import com.itechart.trucking.product.entity.Product;
import com.itechart.trucking.product.entity.ProductState;
import com.itechart.trucking.product.repository.ProductRepository;
import com.itechart.trucking.routeList.entity.RouteList;
import com.itechart.trucking.routeList.repository.RouteListRepository;
import com.itechart.trucking.waybill.entity.Waybill;
import com.itechart.trucking.waybill.repository.WaybillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.sql.Date;
import java.util.List;
import java.util.Optional;

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
    @Autowired
    private CancellationActRepository cancellationActRepository;
    @Autowired
    private WaybillRepository waybillRepository;

    @GetMapping(value = "/manager/orders")
    public List<Order> findActiveOrders() {
        return orderRepository.findAllByStatus("ACTIVE");
    }

    @GetMapping(value = "/manager/orders/{id}")
    public Order findOrderById(@PathVariable Long id) {
        return orderRepository.findOrderById(id);
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

    @GetMapping(value = "/manager/updateProductStatus/{id}")
    public Optional<Product> changeStatus(@PathVariable Long id, @RequestParam("status") String status) {
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

    @PostMapping(value = "/manager/{productId}/cancelProduct")
    public Optional<Product> cancelProduct(@PathVariable Long productId, @RequestParam("orderId") Long orderId, @RequestParam("isLost") Boolean isLost) {
        Optional<Order> order = orderRepository.findById(orderId);
        Consignment consignment = consignmentRepository.findConsignmentByOrder(order.get());
        CancellationAct cancellationAct = cancellationActRepository.findCancellationActByConsignment(consignment);

        Optional<Product> product = productRepository.findById(productId);

        if(product.isPresent()) {
            if(isLost) {
                product.get().setStatus(ProductState.valueOf("LOST"));
                cancellationAct.setPrice(product.get().getPrice() + cancellationAct.getPrice());
                Integer amount = cancellationAct.getAmount() + 1;
                cancellationAct.setAmount(amount);
            } else {
                product.get().setStatus(ProductState.valueOf("ACCEPTED"));
                cancellationAct.setPrice(cancellationAct.getPrice() - product.get().getPrice());
                Integer amount = cancellationAct.getAmount() - 1;
                cancellationAct.setAmount(amount);
            }

            productRepository.save(product.get());
            cancellationActRepository.save(cancellationAct);
        }

        return product;
    }

    @GetMapping(value = "/manager/finishChecking/{orderId}")
    public Order finishChecking(@PathVariable Long orderId) {

        Order order = orderRepository.findOrderById(orderId);
        Waybill waybill = order.getWaybill();
        waybill.setStatus("DONE");
        waybill.setCheckDate(new Date((new java.util.Date()).getTime()));

        Consignment consignment = consignmentRepository.findConsignmentByOrder(order);
        CancellationAct cancellationAct = cancellationActRepository.findCancellationActByConsignment(consignment);
        //cancellation.setDate(new Date());

        cancellationAct.setDate(new Date((new java.util.Date()).getTime()));
        cancellationActRepository.save(cancellationAct);
        waybillRepository.save(waybill);
        order.setWaybill(waybill);

        return order;
    }
}
