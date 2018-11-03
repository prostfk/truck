package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.consignment.entity.Consignment;
import com.itechart.trucking.consignment.repository.ConsignmentRepository;
import com.itechart.trucking.formData.WaybillFormData;
import com.itechart.trucking.odt.Odt;
import com.itechart.trucking.order.dto.OrderDto;
import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.order.repository.OrderRepository;
import com.itechart.trucking.product.dto.ProductDto;
import com.itechart.trucking.product.entity.Product;
import com.itechart.trucking.product.entity.ProductState;
import com.itechart.trucking.product.repository.ProductRepository;
import com.itechart.trucking.routeList.dto.RouteListDto;
import com.itechart.trucking.routeList.entity.RouteList;
import com.itechart.trucking.routeList.repository.RouteListRepository;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.repository.UserRepository;
import com.itechart.trucking.waybill.dto.WaybillDto;
import com.itechart.trucking.waybill.entity.Waybill;
import com.itechart.trucking.waybill.repository.WaybillRepository;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
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

    @Autowired
    private UserRepository userRepository;

    @GetMapping(value = "/manager/orders")//todo findByStatus change on number value(Murat, please)
    public List<OrderDto> findActiveOrders() {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByUsername = userRepository.findUserByUsername(name);
        List<Order> active = orderRepository.findAllByStatusAndCompanyId("ACTIVE", userByUsername.getCompany().getId());
        return Odt.OrderToDtoList(active);
    }

    @GetMapping(value = "/manager/products/{id}")
    public List<ProductDto> findProductsByOrderId(@PathVariable Long id) {
        Optional<Order> order = orderRepository.findById(id);
        List<Product> productList = order.isPresent() ? order.get().getConsignment().getProductList() : Collections.EMPTY_LIST;
        return Odt.ProductToDtoList(productList);
    }

    @GetMapping(value = "/manager/routeList/{id}")
    public List<RouteListDto> getRouteList(@PathVariable Long id) {
        Optional<Order> order = orderRepository.findById(id);
        return order.map(order1 -> Odt.RouteListToDtoList(order1.getWaybill().getRouteListList())).orElse(null);
    }

    @PostMapping(value = "/manager/updateProductStatus/{id}")
    public Object changeStatus(@PathVariable Long id, @RequestBody String status) throws JSONException {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent()) {
            product.get().setStatus(ProductState.valueOf(status));
            Product save = productRepository.save(product.get());
            return new ProductDto(save);
        }else{
            JSONObject json = new JSONObject();
            json.put("error", "invalid data");
            return json;
        }
    }

    @DeleteMapping(value = "/manager/deletePoint/{id}")
    public boolean deletePoint(@PathVariable Long id) {
        try {
            routeListRepository.deleteById(id);
            return true;
        }catch (Exception e){
            return false;
        }
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
