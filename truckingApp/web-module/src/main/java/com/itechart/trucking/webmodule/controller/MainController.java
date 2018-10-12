package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.auto.repository.AutoRepository;
import com.itechart.trucking.cancellationAct.repository.CancellationActRepository;
import com.itechart.trucking.client.repository.ClientRepository;
import com.itechart.trucking.company.repository.CompanyRepository;
import com.itechart.trucking.consignment.repository.ConsignmentRepository;
import com.itechart.trucking.driver.repository.DriverRepository;
import com.itechart.trucking.order.repository.OrderRepository;
import com.itechart.trucking.product.repository.ProductRepository;
import com.itechart.trucking.routeList.repository.RouteListRepository;
import com.itechart.trucking.user.repository.UserRepository;
import com.itechart.trucking.waybill.repository.WaybillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManagerFactory;

@Controller
public class MainController {

    @Autowired
    private UserRepository Repository;

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String mainPage() {
        return "index";
    }

    @GetMapping(value = "/registration")
    public String getRegistration(){
        return "registration";
    }

    @GetMapping(value = "/auth")
    public String getAuthPage(){
        return "login";
    }

    @GetMapping(value = "/repo")
    @ResponseBody
    public Object getTest(){
        return Repository.findById(1L);
    }


}
