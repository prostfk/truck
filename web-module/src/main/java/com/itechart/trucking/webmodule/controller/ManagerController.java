package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.cancellationAct.entity.CancellationAct;
import com.itechart.trucking.cancellationAct.service.CancellationActService;
import com.itechart.trucking.consignment.entity.Consignment;
import com.itechart.trucking.consignment.service.ConsignmentService;
import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.order.service.OrderService;
import com.itechart.trucking.product.entity.Product;
import com.itechart.trucking.product.service.ProductService;
import com.itechart.trucking.routeList.entity.RouteList;
import com.itechart.trucking.routeList.service.RouteListService;
import com.itechart.trucking.user.service.UserService;
import com.itechart.trucking.waybill.entity.Waybill;
import com.itechart.trucking.waybill.service.WaybillService;
import com.itechart.trucking.webmodule.model.dto.SocketNotification;
import com.itechart.trucking.webmodule.service.StompService;
import org.springframework.beans.factory.annotation.Autowired;
import com.itechart.trucking.formData.WaybillFormData;
import com.itechart.trucking.odt.Odt;
import com.itechart.trucking.order.dto.OrderDto;
import com.itechart.trucking.product.dto.ProductDto;
import com.itechart.trucking.routeList.dto.RouteListDto;
import com.itechart.trucking.user.entity.User;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

@PreAuthorize("hasAuthority('ROLE_MANAGER')")
@CrossOrigin
@RestController
@RequestMapping(value = "/api")
public class ManagerController {


    @Autowired
    private OrderService orderService;

    @Autowired
    private ConsignmentService consignmentService;

    @Autowired
    private ProductService productService;

    @Autowired
    private RouteListService routeListService;

    @Autowired
    private CancellationActService cancellationActService;

    @Autowired
    private WaybillService waybillService;

    @Autowired
    private UserService userService;
    @Autowired
    private StompService stompService;

    @GetMapping(value = "/manager/orders")//todo findByStatus change on number value(Murat, please)
    public Object findActiveOrders(@RequestParam(value = "page") int pageId) {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByUsername = userService.findUserByUsername(name);
        Page<Order> orderPage = orderService.findAllByStatusAndCompanyId(1,userByUsername.getCompany().getId(), PageRequest.of(pageId-1, 5));
        return orderPage.map(OrderDto::new);
    }

    @GetMapping(value = "/manager/orders/{id}")
    public Order findOrderById(@PathVariable Long id) {
        System.out.println(orderService.findOrderById(id));
        return orderService.findOrderById(id);
    }

    @GetMapping(value = "/manager/products/{id}")
    public Object findProductsByOrderId(@PathVariable Long id,@RequestParam(value = "page") int pageId) {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByEmail = userService.findUserByUsername(name);

        Optional<Order> order = orderService.findById(id);
        if(!order.isPresent() || order.get().getCompany().getId()!=userByEmail.getCompany().getId()) return null;

        Page<Product> productPage = productService.findAllByConsignment(consignmentService.findConsignmentByOrder(order.get()),PageRequest.of(pageId-1, 5));

        return productPage.map(ProductDto::new);
    }

    @GetMapping(value = "/manager/routeList/{id}")
    public List<RouteListDto> getRouteList(@PathVariable Long id) {
        Optional<Order> order = orderService.findById(id);
        return order.map(order1 -> Odt.RouteListToDtoList(order1.getWaybill().getRouteListList())).orElse(null);
    }

    @PostMapping(value = "/manager/updateProductStatus/{id}")
    public Object changeStatus(@PathVariable Long id, @RequestBody String status) throws JSONException {
        Optional<Product> product = productService.findById(id);
        if (product.isPresent()) {
            product.get().setStatus(Integer.valueOf(status));
            Product save = productService.save(product.get());
            return new ProductDto(save);
        } else {
            JSONObject json = new JSONObject();
            json.put("error", "invalid data");
            return json;
        }
    }

    @DeleteMapping(value = "/manager/deletePoint/{id}")
    public boolean deletePoint(@PathVariable Long id) {
        try {
            routeListService.deleteById(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @PostMapping(value = "/manager/{orderId}/createPoint")
    public boolean createPoint(@PathVariable Long orderId, @RequestBody RouteList routeList) {
        Optional<Order> order = orderService.findById(orderId);
        if (!order.isPresent())
            return false;
        routeList.setWaybill(order.get().getWaybill());
        return routeListService.save(routeList) != null;

    }

    @GetMapping(value = "/manager/{productId}/cancelProduct/{orderId}")
    public ProductDto cancelProduct(@PathVariable Long productId, @PathVariable Long orderId, @RequestParam("cancel") int cancel) {
        Consignment consignment = orderService.findOrderById(orderId).getConsignment();
        CancellationAct cancellationAct = consignment.getCancellationAct();
        if(cancellationAct == null) {
            cancellationAct = new CancellationAct(new Date((new java.util.Date().getTime())), 0, new Double(0), consignment);
            cancellationActService.save(cancellationAct);
        }

        Optional<Product> product = productService.findById(productId);
        if (!product.isPresent())
            return null;

        if (cancel > 0) {
            product.get().setCancelledCount(product.get().getCancelledCount() + cancel);
            product.get().setCount(product.get().getCount() - cancel);

            if (product.get().getCount() == 0) {
                product.get().setStatus(4);
            } else {
                product.get().setStatus(5);
            }

            cancellationAct.setPrice(product.get().getPrice() * cancel + cancellationAct.getPrice());
            Integer amount = cancellationAct.getAmount() + cancel;
            cancellationAct.setAmount(amount);
            product.get().setCancellationAct(cancellationAct);
        } /*else {
            product.get().setStatus(1);
            cancellationAct.setPrice(cancellationAct.getPrice() - product.get().getPrice());
            Integer amount = cancellationAct.getAmount() - 1;
            cancellationAct.setAmount(amount);
            product.get().setCancellationAct(null);
        }*/



        productService.save(product.get());
        cancellationActService.save(cancellationAct);

        return new ProductDto(product.get());
    }

    @GetMapping(value = "/manager/{productId}/restoreProduct/{orderId}")
    public ProductDto restoreProduct(@PathVariable Long productId, @PathVariable Long orderId, @RequestParam("restore") int restore) {
        Consignment consignment = orderService.findOrderById(orderId).getConsignment();
        CancellationAct cancellationAct = consignment.getCancellationAct();
        if(cancellationAct == null) {
            cancellationAct = new CancellationAct(new Date((new java.util.Date().getTime())), 0, new Double(0), consignment);
            cancellationActService.save(cancellationAct);
        }

        Optional<Product> product = productService.findById(productId);
        if (!product.isPresent())
            return null;

        if (restore > 0) {
            product.get().setCancelledCount(product.get().getCancelledCount() - restore);
            product.get().setCount(product.get().getCount() + restore);

            if (product.get().getCancelledCount() == 0) {
                product.get().setStatus(1);
            } else {
                product.get().setStatus(5);
            }

            cancellationAct.setPrice(cancellationAct.getPrice() - product.get().getPrice() * restore);
            Integer amount = cancellationAct.getAmount() - restore;
            cancellationAct.setAmount(amount);
            product.get().setCancellationAct(cancellationAct);
        } /*else {
            product.get().setStatus(1);
            cancellationAct.setPrice(cancellationAct.getPrice() - product.get().getPrice());
            Integer amount = cancellationAct.getAmount() - 1;
            cancellationAct.setAmount(amount);
            product.get().setCancellationAct(null);
        }*/



        productService.save(product.get());
        cancellationActService.save(cancellationAct);

        return new ProductDto(product.get());
    }

    @GetMapping(value = "/manager/finishChecking/{orderId}")
    public OrderDto finishChecking(@PathVariable Long orderId) {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByUsername = userService.findUserByUsername(name);

        Optional<Order> order = orderService.findById(orderId);
        Waybill waybill = order.get().getWaybill();
        waybill.setStatus(2);
        waybill.setCheckDate(new Date((new java.util.Date()).getTime()));
        waybill.setUser(userByUsername);

        CancellationAct cancellationAct = order.get().getConsignment().getCancellationAct();
        if(cancellationAct != null) {
            cancellationAct.setDate(new Date((new java.util.Date()).getTime()));
            cancellationActService.save(cancellationAct);
        }
        waybillService.save(waybill);
        order.get().setWaybill(waybill);

        String message = "Поступил заказ на перевозку (" + order.get().getName() + " ) ";
        stompService.sendNotification("/topic/"+userByUsername.getCompany().getId()+"/changeWayBillStatusTo2/"+waybill.getDriver().getUser().getId(), new SocketNotification(name,message));

        return new OrderDto(order.get());
    }

    @GetMapping(value = "/manager/cancelChecking/{orderId}")
    public OrderDto cancelWaybillCheck(@PathVariable Long orderId, @RequestParam("status") String status) {
        System.out.println(orderId);
        System.out.println(status);
        Optional<Order> order = orderService.findById(orderId);
        System.out.println(order.isPresent());
        Waybill waybill = order.get().getWaybill();
        waybill.setStatus(Integer.valueOf(status));
        waybill.setCheckDate(null);
        waybill.setUser(null);

        CancellationAct cancellationAct = order.get().getConsignment().getCancellationAct();
        if(cancellationAct != null) {
            cancellationAct.setDate(null);
            cancellationActService.save(cancellationAct);
        }
        waybillService.save(waybill);
        order.get().setWaybill(waybill);

        return new OrderDto(order.get());
    }

    @PostMapping(value = "/manager/createRouteList")
    public Object createRouteList(RouteList routeListDto, WaybillFormData waybill) {
        //todo CREATE FORM SAVING IN DB
        return null;//!!!
    }

}
