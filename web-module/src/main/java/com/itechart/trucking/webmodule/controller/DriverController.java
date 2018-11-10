package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.cancellationAct.dto.CancellationActDto;
import com.itechart.trucking.cancellationAct.entity.CancellationAct;
import com.itechart.trucking.cancellationAct.repository.CancellationActRepository;
import com.itechart.trucking.driver.entity.Driver;
import com.itechart.trucking.driver.repository.DriverRepository;
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
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
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

    @PutMapping(value = "/order/{id}/CancellationAct/addProduct")
    public Object addProductToCancellationAct(@PathVariable Long id, Long productId) throws JSONException {
        Order orderById = orderRepository.findOrderById(id);
        Product productById = productRepository.findProductById(productId);
        CancellationAct cancellationAct = orderById.getConsignment().getCancellationAct();
        List<Product> product = cancellationAct.getProduct();
        JSONObject json = new JSONObject();
        if (!product.contains(productById)) {
            product.add(productById);
            orderById.getConsignment().getCancellationAct().setProduct(product);
            orderRepository.save(orderById);
            json.put("status", "success");
        } else {
            json.put("error", "product is already cancelled");
        }
        return json.toString();

    }

    @RequestMapping(value = "/orders/getMyOrders", method = RequestMethod.GET)
    public List<OrderDto> getMyOrders() {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        Driver driver = driverRepository.findDriverByUser(userRepository.findUserByUsername(name));
        List<Order> orders = orderRepository.findCustomQueryOrderByDriver(driver.getId());
        List<OrderDto> orderDtos = Odt.OrderToDtoList(orders);
        return orderDtos;
    }

    @RequestMapping(value = "/orders/getMyOrders/{orderId}/routelist", method = RequestMethod.GET)
    public List<RouteListDto> getRouteList(@PathVariable Long orderId) {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Order> order = orderRepository.findById(orderId);
        if (!order.isPresent() || !order.get().getWaybill().getDriver().getUser().getUsername().equals(name))
            return null;
        return Odt.RouteListToDtoList(order.get().getWaybill().getRouteListList());
    }


    @RequestMapping(value = "/orders/getMyOrders/{orderId}/markpoint/{pointId}", method = RequestMethod.PUT)
    public RouteListDto markOrder(@PathVariable Long orderId, @PathVariable Long pointId) {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();

        Optional<Order> order = orderRepository.findById(orderId);
        if (!order.isPresent() || !order.get().getWaybill().getDriver().getUser().getUsername().equals(name))
            return null;

        Optional<RouteList> point = routeListRepository.findById(pointId);
        if (!point.isPresent() || point.get().getWaybill().getId() != order.get().getWaybill().getId()) return null;
        else {
            if (point.get().getMarked() == null) point.get().setMarked(false);
            if (point.get().getMarked()) point.get().setMarked(false);
            else point.get().setMarked(true);
        }
        routeListRepository.save(point.get());
        return new RouteListDto(point.get());
    }

    @RequestMapping(value = "/orders/getMyOrders/{orderId}/consignment", method = RequestMethod.GET)
    public List<ProductDto> getDriverConsignment(@PathVariable Long orderId) {
        Optional<Order> order = orderRepository.findById(orderId);
        List<Product> products = order.isPresent() ? order.get().getConsignment().getProductList() : Collections.EMPTY_LIST;
        return Odt.ProductToDtoList(products);
    }

    @RequestMapping(value = "/orders/getMyOrders/cancelProduct/{productId}", method = RequestMethod.GET)
    public ProductDto cancelProduct(@PathVariable Long productId) {
        Optional<Product> product = productRepository.findById(productId);
        CancellationAct cancellationAct = product.isPresent() ? product.get().getCancellationAct() : null;

        if (cancellationAct == null)
            return null;

        product.get().setStatus(4);
        cancellationAct.setPrice(product.get().getPrice() + cancellationAct.getPrice());
        Integer amount = cancellationAct.getAmount() + 1;
        cancellationAct.setAmount(amount);

        productRepository.save(product.get());
        cancellationActRepository.save(cancellationAct);

        return new ProductDto(product.get());
    }
}
