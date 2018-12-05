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
import com.itechart.trucking.webmodule.model.dto.SocketNotification;
import com.itechart.trucking.webmodule.service.CommonService;
import com.itechart.trucking.webmodule.service.StompService;
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

    @Autowired
    private StompService stompService;

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
        if (!newStatusValue.equals("3")) return null;

        User user = commonService.getCurrentUser();
        Order order = orderService.findOrderById(orderId);
        Waybill waybill = order.getWaybill();

        if (waybill.getDriver() == null || (waybill.getStatus() != 2 && waybill.getStatus() != 3) || waybill.getDriver().getUser().getId() != user.getId())
            return null;

        int ammountNotMarkedPoins = 0;
        List<RouteList> routeLists = waybill.getRouteListList();
        for (RouteList point : routeLists) {
            if (point.getMarked() == null || !point.getMarked()) ammountNotMarkedPoins++;
        }
        if (ammountNotMarkedPoins != 0) return null;

        Integer newStatus = Integer.valueOf(newStatusValue);
        waybill.setStatus(newStatus);
        waybillService.save(waybill);

        String message ="Прибыл в конечный пункт. Заказ: " + order.getName();
        stompService.sendNotification("/topic/" + user.getCompany().getId() + "/driverArrival/", new SocketNotification("Водитель" +  waybill.getDriver().getName(), message));

        return new WaybillDto(waybill);
    }


    @RequestMapping(value = "/orders/getMyOrders/{orderId}/markpoint/{pointId}", method = RequestMethod.PUT)
    public RouteListDto markOrder(@PathVariable Long orderId, @PathVariable Long pointId) {
        User user = commonService.getCurrentUser();
        String name = user.getUsername();

        Optional<Order> order = orderService.findById(orderId);
        if (!order.isPresent() || !order.get().getWaybill().getDriver().getUser().getUsername().equals(name) || order.get().getWaybill().getStatus() != 2)
            return null;

        Optional<RouteList> point = routeListService.findById(pointId);
        if (!point.isPresent() || point.get().getWaybill().getId() != order.get().getWaybill().getId()) return null;
        else {
            if (point.get().getMarked() == null) point.get().setMarked(false);
            if (point.get().getMarked()) point.get().setMarked(false);
            else point.get().setMarked(true);
        }
        routeListService.save(point.get());
        String message = point.get().getMarked() == true ? "Прошел контрольную точку в заказе: " + order.get().getName() : "Отменил прохождение точки в заказе: " + order.get().getName();

        stompService.sendNotification("/topic/" + user.getCompany().getId() + "/markPoint/", new SocketNotification(name, message));

        return new RouteListDto(point.get());
    }
}
