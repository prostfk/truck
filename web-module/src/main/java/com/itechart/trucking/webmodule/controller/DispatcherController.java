package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.auto.entity.Auto;
import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.driver.entity.Driver;
import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.order.repository.OrderRepository;
import com.itechart.trucking.user.repository.UserRepository;
import com.itechart.trucking.waybill.repository.WaybillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping(value = "/api")
public class DispatcherController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private WaybillRepository waybillRepository;

    @RequestMapping(value = "/orders/createOrder/getdrivers",method = RequestMethod.GET)
    public boolean getDrivers(){
        SimpleDateFormat dateformat = new SimpleDateFormat("dd-M-yyyy");

        /*Заглушка*/
        String strdatefrom = "28-10-2018";
        String strdateto = "29-10-2018";
        Long companyId = 1L;

        java.util.Date datedep = null;
        java.util.Date datearr = null;
        try {
            datedep = dateformat.parse(strdatefrom);
            datearr = dateformat.parse(strdateto);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        List<Driver> drivers= waybillRepository.findCustomQueryDriverByDate(datedep,datearr,companyId);
        System.out.println(drivers.toString());
        return true;
    }

    @RequestMapping(value = "/orders/createOrder/getAutos",method = RequestMethod.GET)
    public List<Auto> getAutos(){
        SimpleDateFormat dateformat = new SimpleDateFormat("dd-M-yyyy");

        /*Заглушка*/
        String strdatefrom = "28-10-2018";
        String strdateto = "29-10-2018";
        Long companyId = 1L;

        java.util.Date datedep = null;
        java.util.Date datearr = null;
        try {
            datedep = dateformat.parse(strdatefrom);
            datearr = dateformat.parse(strdateto);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        return waybillRepository.findCustomQueryAutoByDate(datedep,datearr,companyId);
    }

    @RequestMapping(value = "/orders/{id}",method = RequestMethod.GET)
    public Order editOrder(@PathVariable Long id){
        /*        String name = SecurityContextHolder.getContext().getAuthentication().getName();*/
        System.out.println(id);
        String name = "user5";
        Company company = userRepository.findUserByUsername(name).getCompany();

        Optional<Order> order = orderRepository.findById(id);
        if(order.isPresent() && order.get().getCompany().getId()==company.getId())
        return order.get();
        else{
            System.out.println("access dined");
            return null;
        }
    }

    @RequestMapping(value = "/orders/createOrder",method = RequestMethod.POST)
    public boolean createOrder(@ModelAttribute Order order){
        /*        String name = SecurityContextHolder.getContext().getAuthentication().getName();*/
        System.out.println(order);
        return true;
    }

}
