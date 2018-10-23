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
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.repository.UserRepository;
import com.itechart.trucking.waybill.repository.WaybillRepository;
import com.itechart.trucking.webmodule.config.JwtGen;
import com.itechart.trucking.webmodule.model.util.ExcelUtil;
import com.itechart.trucking.webmodule.model.util.TokenUtil;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManagerFactory;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Controller
public class MainController {

    private static final Logger LOGGER = LoggerFactory.getLogger(MainController.class);

    @Autowired
    private UserRepository Repository;



    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String mainPage() {
        LOGGER.debug("'get' request on index page");
        return "index";
    }

//    TEST

    @GetMapping(value = "/xls")//check xls method
    @ResponseBody
    public String createXls(@Value("${excel.path}")String path){
        Optional<User> byId = Repository.findById(1L);
        User user = byId.get();
        try {
            new ExcelUtil().writeInExcel(path, user,new Date(),new Date(),"","","");
            return "Success";
        } catch (IOException e) {
            return "Fail";
        }
    }

}
