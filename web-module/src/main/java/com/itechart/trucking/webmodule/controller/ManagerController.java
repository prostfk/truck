package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.consignment.entity.Consignment;
import com.itechart.trucking.consignment.repository.ConsignmentRepository;
import com.itechart.trucking.formData.WaybillFormData;
import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.order.repository.OrderRepository;
import com.itechart.trucking.product.entity.Product;
import com.itechart.trucking.product.entity.ProductState;
import com.itechart.trucking.product.repository.ProductRepository;
import com.itechart.trucking.routeList.dto.RouteListDto;
import com.itechart.trucking.routeList.entity.RouteList;
import com.itechart.trucking.routeList.repository.RouteListRepository;
import com.itechart.trucking.waybill.dto.WaybillDto;
import com.itechart.trucking.waybill.entity.Waybill;
import com.itechart.trucking.waybill.repository.WaybillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@PreAuthorize("hasAuthority('ROLE_MANAGER')")
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
    private WaybillRepository waybillRepository;

    @GetMapping(value = "/manager/orders")//todo findByStatus change on number value(Murat, please)
    public List<Order> findActiveOrders() {
        return orderRepository.findAllByStatus("ACTIVE");
    }

    @GetMapping(value = "/manager/products/{id}")
    public List<Product> findProductsByOrderId(@PathVariable Long id) {
        Optional<Order> order = orderRepository.findById(id);
        if (order.isPresent()) {
            Consignment consignment = consignmentRepository.findConsignmentByOrder(order.get());
            return productRepository.findAllByConsignment(consignment);
        }
        return null;
    }

    @GetMapping(value = "/manager/routeList/{id}")
    public List<RouteList> getRouteList(@PathVariable Long id) {
        Optional<Order> order = orderRepository.findById(id);
        return order.map(order1 -> routeListRepository.findAllByWaybillOrderByPointLevel(order1.getWaybill())).orElse(null);
    }

    @PostMapping(value = "/manager/updateProductStatus/{id}")
    public Optional<Product> changeStatus(@PathVariable Long id, @RequestBody String status) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent()) {
            product.get().setStatus(ProductState.valueOf(status));
            productRepository.save(product.get());
        }
        return product;
    }

    @DeleteMapping(value = "/manager/deletePoint/{id}")
    public boolean deletePoint(@PathVariable Long id) {
        routeListRepository.deleteById(id);
        return true;
    }

    @PostMapping(value = "/manager/{orderId}/createPoint")
    public boolean createPoint(@PathVariable Long orderId, @RequestBody RouteList routeList) {
        Optional<Order> order = orderRepository.findById(orderId);
        if (!order.isPresent())
            return false;
        routeList.setWaybill(order.get().getWaybill());
        return routeListRepository.save(routeList) != null;

    }

    @PostMapping(value = "/manager/createRouteList")
    public Object createRouteList(RouteList routeListDto, WaybillFormData waybill) {
        //todo CREATE FORM SAVING IN DB
        return null;//!!!
    }

}
