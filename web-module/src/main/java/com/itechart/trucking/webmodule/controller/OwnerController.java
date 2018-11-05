package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.company.repository.CompanyRepository;
import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.order.repository.OrderRepository;
import com.itechart.trucking.routeList.entity.RouteList;
import com.itechart.trucking.routeList.repository.RouteListRepository;
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

@PreAuthorize("hasAuthority('ROLE_COMP_OWNER')")
@Controller
@RequestMapping(value = "/api")
public class OwnerController {

    private static final Logger LOGGER = LoggerFactory.getLogger(OwnerController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RouteListRepository routeListRepository;

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String mainPage() {
        LOGGER.debug("'get' request on index page");
        return "index";
    }

//    TEST

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
    public User findUserByIdAndCompany(@PathVariable Long id){
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByUsername = userRepository.findUserByUsername(name);
        return userRepository.customFindUserByIdAndCompanyId(id, userByUsername.getCompany().getId());
    }

    @GetMapping(value = "/company/orders")
    @ResponseBody
    public List<Order> fetchAllOrdersOfCompany(@ModelAttribute Order order) {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        Company company = userRepository.findUserByUsername(name).getCompany();
        return orderRepository.findAllByCompany(company);
    }

    @GetMapping(value = "/company/orders/{id}")
    @ResponseBody
    public Order fetchOrderOfCompany(@PathVariable Long id) {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        Company company = userRepository.findUserByUsername(name).getCompany();
        Optional<Order> order = orderRepository.findById(id);
        if (order.isPresent() && order.get().getCompany().getId().equals(company.getId())) {
            System.out.println("CALLED");
            return order.get();
        } else {
            System.out.println("access dined");
            return null;
        }
    }

    @RequestMapping(value ="/company/routList/{id}", method = RequestMethod.GET)
    @ResponseBody
    public List<RouteList> fetchRoutListOfOrder(@PathVariable Long id){
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        Company company = userRepository.findUserByUsername(name).getCompany();
        Optional<Order> order = orderRepository.findById(id);

        List<RouteList> routeLists = null;
        if(order.isPresent() && order.get().getCompany().getId().equals(company.getId())) {
            routeLists = routeListRepository.findAllByWaybillOrderByPointLevel(order.get().getWaybill());
        }
        else {
            return null;
        }

        return routeLists;
    }
}
