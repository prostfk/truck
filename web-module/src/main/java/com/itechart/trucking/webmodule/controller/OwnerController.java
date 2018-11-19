package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.cancellationAct.dto.CancellationActDto;
import com.itechart.trucking.cancellationAct.entity.CancellationAct;
import com.itechart.trucking.cancellationAct.repository.CancellationActRepository;
import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.consignment.entity.Consignment;
import com.itechart.trucking.consignment.repository.ConsignmentRepository;
import com.itechart.trucking.odt.Odt;
import com.itechart.trucking.order.dto.OrderDto;
import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.order.repository.OrderRepository;
import com.itechart.trucking.routeList.dto.RouteListDto;
import com.itechart.trucking.routeList.entity.RouteList;
import com.itechart.trucking.routeList.repository.RouteListRepository;
import com.itechart.trucking.user.dto.UserDto;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.repository.UserRepository;
import com.itechart.trucking.webmodule.model.util.ExcelUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Controller
@PreAuthorize("hasAuthority('ROLE_COMP_OWNER')")
@RequestMapping(value = "/api")
public class OwnerController {

    private static final Logger LOGGER = LoggerFactory.getLogger(OwnerController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RouteListRepository routeListRepository;

    @Autowired
    private CancellationActRepository cancellationActRepository;

    @Autowired
    private ConsignmentRepository consignmentRepository;


    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String mainPage() {
        LOGGER.debug("'get' request on index page");
        return "index";
    }

    @GetMapping(value = "/company/statistics")//check xls method
    @ResponseBody
    public String createXls(@Value("${excel.path}")String path){
        Optional<User> byId = userRepository.findById(1L);
        User user = byId.get();
        try {
            new ExcelUtil().writeInExcel(path, user,new Date(),new Date(),"","","");
            return "Success";
        } catch (IOException e) {
            return "Fail";
        }
    }

    @GetMapping(value = "/company/user/{id}")
    @ResponseBody
    public UserDto findUserByIdAndCompany(@PathVariable Long id){
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByUsername = userRepository.findUserByUsername(name);
        User user = userRepository.customFindUserByIdAndCompanyId(id, userByUsername.getCompany().getId());
        return new UserDto(user);
    }

    @GetMapping(value = "/company/orders")
    @ResponseBody
    public List<OrderDto> fetchAllOrdersOfCompany(@ModelAttribute Order order) {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        Company company = userRepository.findUserByUsername(name).getCompany();
        List<Order> allByCompany = orderRepository.findAllByCompany(company);
        return Odt.OrderToDtoList(allByCompany);
    }

    @GetMapping(value = "/company/orders/{id}")
    @ResponseBody

    public OrderDto fetchOrderOfCompany(@PathVariable Long id) {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        Company company = userRepository.findUserByUsername(name).getCompany();
        Optional<Order> order = orderRepository.findById(id);
        if (order.isPresent() && order.get().getCompany().getId().equals(company.getId())) {
            System.out.println("CALLED");
            Order order1 = order.get();
            OrderDto orderDto = new OrderDto(order1);
            orderDto.getWaybill().setAuto(order.get().getWaybill().getAuto());
            orderDto.getWaybill().setDriver(order.get().getWaybill().getDriver());
            orderDto.setCompany(company);
            return orderDto;
        } else {
            System.out.println("access dined");
            return null;
        }
    }

   @RequestMapping(value ="/company/routList/{id}", method = RequestMethod.GET)
    @ResponseBody
    public List<RouteListDto> fetchRoutListOfOrder(@PathVariable Long id){
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        Company company = userRepository.findUserByUsername(name).getCompany();
        Optional<Order> order = orderRepository.findById(id);

        List<RouteList> routeLists;
        if(order.isPresent() && order.get().getCompany().getId().equals(company.getId())) {
            routeLists = routeListRepository.findAllByWaybillOrderByPointLevel(order.get().getWaybill());
        }
        else {
            return null;
        }
        return Odt.RouteListToDtoList(routeLists);
    }

    @GetMapping(value = "/company/cancelAct/{id}")
    @ResponseBody
    public CancellationActDto fetchCancelActOfCompany(@PathVariable Long id) {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        Company company = userRepository.findUserByUsername(name).getCompany();
        Optional<Order> order = orderRepository.findById(id);

        Consignment consignment;
        CancellationAct cancellationAct;
        if (order.isPresent() && order.get().getCompany().getId().equals(company.getId())) {
            consignment = consignmentRepository.findConsignmentByOrder(order.get());
            cancellationAct = cancellationActRepository.findCancellationActByConsignment(consignment);
        } else {
            return null;
        }

        return new CancellationActDto(cancellationAct);
    }
}