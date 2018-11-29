package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.cancellationAct.entity.CancellationAct;
import com.itechart.trucking.cancellationAct.service.CancellationActService;
import com.itechart.trucking.consignment.entity.Consignment;
import com.itechart.trucking.consignment.service.ConsignmentService;
import com.itechart.trucking.driver.entity.Driver;
import com.itechart.trucking.driver.service.DriverService;
import com.itechart.trucking.odt.Odt;
import com.itechart.trucking.order.dto.OrderDto;
import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.order.service.OrderService;
import com.itechart.trucking.product.dto.ProductDto;
import com.itechart.trucking.product.entity.Product;
import com.itechart.trucking.product.service.ProductService;
import com.itechart.trucking.routeList.dto.RouteListDto;
import com.itechart.trucking.routeList.entity.RouteList;
import com.itechart.trucking.routeList.service.RouteListService;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.service.UserService;
import com.itechart.trucking.waybill.dto.WaybillDto;
import com.itechart.trucking.waybill.entity.Waybill;
import com.itechart.trucking.waybill.service.WaybillService;
import com.itechart.trucking.webmodule.service.CommonService;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping(value = "/api")
public class DriverController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @Autowired
    private DriverService driverService;

    @Autowired
    private RouteListService routeListService;

    @Autowired
    private CommonService commonService;

    @Autowired
    private WaybillService waybillService;

/*    @Autowired
    private ProductService productService;

    @Autowired
    private CancellationActService cancellationActService;

    @Autowired
    private ConsignmentService consignmentService;*/

    @RequestMapping(value = "/orders/getMyOrders", method = RequestMethod.GET)
    public List<OrderDto> getMyOrders() {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        Driver driver = driverService.findDriverByUser(userService.findUserByUsername(name));
        List<Order> orders = orderService.findCustomQueryOrderByDriver(driver.getId());
        List<OrderDto> orderDtos = Odt.OrderToDtoList(orders);
        return orderDtos;
    }

    @RequestMapping(value = "/orders/getMyOrders/{orderId}/routelist", method = RequestMethod.GET)
    public List<RouteListDto> getRouteList(@PathVariable Long orderId) {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Order> order = orderService.findById(orderId);
        if (!order.isPresent() || !order.get().getWaybill().getDriver().getUser().getUsername().equals(name))
            return null;
        return Odt.RouteListToDtoList(order.get().getWaybill().getRouteListList());
    }

    @RequestMapping(value = "/orders/getMyOrders/{orderId}/setNewStatus", method = RequestMethod.PUT)
    public WaybillDto setNewStatus(@PathVariable Long orderId, @RequestBody String newStatusValue) {
        if(newStatusValue.equals("2") && newStatusValue.equals("3")) return null;

        User user = commonService.getCurrentUser();
        Order order = orderService.findOrderById(orderId);
        Waybill waybill = order.getWaybill();

        if (waybill.getDriver()==null || (waybill.getStatus()!=2 && waybill.getStatus()!=3) || waybill.getDriver().getUser().getId()!=user.getId()  ) return null;

        Integer newStatus = Integer.valueOf(newStatusValue);
        waybill.setStatus(newStatus);
        waybillService.save(waybill);
        return new WaybillDto(waybill);
    }


    @RequestMapping(value = "/orders/getMyOrders/{orderId}/markpoint/{pointId}", method = RequestMethod.PUT)
    public RouteListDto markOrder(@PathVariable Long orderId, @PathVariable Long pointId) {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();

        Optional<Order> order = orderService.findById(orderId);
        if (!order.isPresent() || !order.get().getWaybill().getDriver().getUser().getUsername().equals(name))
            return null;

        Optional<RouteList> point = routeListService.findById(pointId);
        if (!point.isPresent() || point.get().getWaybill().getId() != order.get().getWaybill().getId()) return null;
        else {
            if (point.get().getMarked() == null) point.get().setMarked(false);
            if (point.get().getMarked()) point.get().setMarked(false);
            else point.get().setMarked(true);
        }
        routeListService.save(point.get());
        return new RouteListDto(point.get());
    }

    /*    @Deprecated
    @PutMapping(value = "/order/{id}/CancellationAct/addProduct")
    public Object addProductToCancellationAct(@PathVariable Long id, Long productId) throws JSONException {
        Order orderById = orderService.findOrderById(id);
        Product productById = productService.findProductById(productId);
        CancellationAct cancellationAct = orderById.getConsignment().getCancellationAct();
        List<Product> product = cancellationAct.getProduct();
        JSONObject json = new JSONObject();
        if (!product.contains(productById)) {
            product.add(productById);
            orderById.getConsignment().getCancellationAct().setProduct(product);
            orderService.save(orderById);
            json.put("status", "success");
        } else {
            json.put("error", "product is already cancelled");
        }
        return json.toString();
    }*/

/*    @Deprecated
    @RequestMapping(value = "/orders/getMyOrders/{orderId}/consignment", method = RequestMethod.GET)
    public List<ProductDto> getDriverConsignment(@PathVariable Long orderId) {
        Optional<Order> order = orderService.findById(orderId);
        List<Product> products = order.isPresent() ? order.get().getConsignment().getProductList() : Collections.EMPTY_LIST;
        return Odt.ProductToDtoList(products);
    }*/

   /* @Deprecated
    @RequestMapping(value = "/orders/getMyOrders/{orderId}/cancelProduct/{productId}", method = RequestMethod.GET)
    public ProductDto cancelProduct(@PathVariable Long productId, @PathVariable Long orderId, @RequestParam(name = "cancel") int cancel) {
        Consignment consignment = orderService.findOrderById(orderId).getConsignment();
        CancellationAct cancellationAct = consignment.getCancellationAct();

        if (cancellationAct == null) {
            cancellationAct = new CancellationAct(new Date((new java.util.Date().getTime())), 0, 0D, consignment);
            CancellationAct save = cancellationActService.save(cancellationAct);
            consignment.setCancellationAct(save);
        }

        Optional<Product> product = productService.findById(productId);
        product.get().setCount(product.get().getCount() - cancel);
        product.get().setCancelledCount(product.get().getCancelledCount() == null ? 0 : product.get().getCancelledCount() + cancel);

        if (product.get().getCount() == 0) {
            product.get().setStatus(4);
        } else {
            product.get().setStatus(5);
        }

        cancellationAct.setPrice(product.get().getPrice() * cancel + cancellationAct.getPrice());
        Integer amount = cancellationAct.getAmount() + cancel;
        cancellationAct.setAmount(amount);

        product.get().setCancellationAct(cancellationAct);
        productService.save(product.get());
        cancellationActService.save(cancellationAct);

        return new ProductDto(product.get());
    }*/
}
