package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.auto.entity.Auto;
import com.itechart.trucking.client.entity.Client;
import com.itechart.trucking.client.repository.ClientRepository;
import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.company.repository.CompanyRepository;
import com.itechart.trucking.consignment.entity.Consignment;
import com.itechart.trucking.driver.entity.Driver;
import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.order.entity.OrderDto;
import com.itechart.trucking.order.repository.OrderRepository;
import com.itechart.trucking.order.service.OrderService;
import com.itechart.trucking.stock.entity.Stock;
import com.itechart.trucking.stock.repository.StockRepository;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.repository.UserRepository;
import com.itechart.trucking.waybill.entity.Waybill;
import com.itechart.trucking.waybill.repository.WaybillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
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
    private CompanyRepository companyRepository;

    @Autowired
    private WaybillRepository waybillRepository;

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private OrderService orderService;

    @Autowired
    private ClientRepository clientRepository;

    @RequestMapping(value = "/orders/createOrder/getDrivers",method = RequestMethod.GET)
    public List<Driver> getDrivers(){
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

        return waybillRepository.findCustomQueryDriverByDate(datedep,datearr,companyId);

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
        Object credentials = SecurityContextHolder.getContext().getAuthentication().getCredentials();
        System.out.println(credentials);
        String name = "user6";
        Company company = userRepository.findUserByUsername(name).getCompany();

        Optional<Order> order = orderRepository.findById(id);
        if(order.isPresent() && order.get().getCompany().getId()==company.getId())
        return order.get();
        else{
            System.out.println("access dined");
            return null;
        }
    }

    @PostMapping(value = "/orders/createOrder")
    public Order createOrder(OrderDto orderDto){
        /*        String name = SecurityContextHolder.getContext().getAuthentication().getName();*/
        Order order = null;
        try {
            order = orderService.getOrderFromDto(orderDto);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        System.out.println(orderDto + " - order dto ");
        System.out.println(order);
        waybillRepository.save(order.getWaybill());
        orderRepository.save(order);
        return order;
    }

    @GetMapping(value = "/clients/findClientsByNameLike")
    public List<Client> findClientsByNameLike(@RequestParam String name){
        return clientRepository.findClientsByNameLikeIgnoreCase(String.format("%%%s%%", name));
    }

    @GetMapping(value = "/companies/findCompaniesByNameLike")
    public List<Company> findCompaniesByNameLikeRest(@RequestParam String name){
        name = String.format("%%%s%%", name);
        return companyRepository.findTop10CompaniesByNameLikeIgnoreCase(name);
    }

    @GetMapping(value = "/companies/{companyId}/stocks")
    public List<Stock> findStocksByCompany(@PathVariable Long companyId){
        Company companyById = companyRepository.findCompanyById(companyId);
        return stockRepository.findStocksByCompany(companyById);
    }

    @GetMapping(value = "/companies/stocks/findStocksByAddressLike")
    public List<Stock> findStocksByNameLike(@RequestParam String address){
        address = String.format("%%%s%%", address);
        return stockRepository.findStocksByAddressLike(address);
    }

    @PostMapping(value = "/companies/orders/edit")
    public Object editOrder(OrderDto orderDto, Long orderId, Long waybillId, HttpServletRequest request) throws ParseException {
        request.getParameterNames().asIterator().forEachRemaining(System.out::println);
        Order orderFromDto = orderService.getOrderFromDto(orderDto);
        orderFromDto.setId(orderId);
        System.out.println(orderFromDto);
        Waybill waybill = orderFromDto.getWaybill();
        waybill.setId(waybillId);
        waybillRepository.save(waybill);
        return orderRepository.save(orderFromDto);
    }

    @PostMapping(value = "/orders/createConsignment")
    public Object createConsignment(Long orderId, @RequestParam(value = "consignments")String []consignments){
        for (int i = 0; i < consignments.length; i++) {
            System.out.println("i = " + consignments[i]);
        }
        return "Hello world";
    }

}
