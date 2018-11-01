package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.auto.entity.Auto;
import com.itechart.trucking.client.entity.Client;
import com.itechart.trucking.client.repository.ClientRepository;
import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.company.repository.CompanyRepository;
import com.itechart.trucking.consignment.entity.Consignment;
import com.itechart.trucking.consignment.repository.ConsignmentRepository;
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
import com.itechart.trucking.webmodule.config.UserDetailsServiceImpl;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

@PreAuthorize("hasAuthority('ROLE_DISPATCHER')")
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

    @Autowired
    private ConsignmentRepository consignmentRepository;

    @RequestMapping(value = "/orders/createOrder/getDriversByDates", method = RequestMethod.GET)
    public List<Driver> getDrivers(@RequestParam String dateFrom, @RequestParam String dateTo) {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findUserByUsername(name);
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/M/yyyy");
        java.util.Date dateDeparture = null;
        java.util.Date dateArrival = null;
        try {
            dateDeparture = dateFormat.parse(dateFrom);
            dateArrival = dateFormat.parse(dateTo);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return waybillRepository.findCustomQueryDriverByDate(dateDeparture, dateArrival, user.getCompany().getId());
    }

    @RequestMapping(value = "/orders/createOrder/getAutosByDates", method = RequestMethod.GET)
    public List<Auto> getAutos(@RequestParam String dateFrom, @RequestParam String dateTo) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/M/yyyy");
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findUserByUsername(name);
        java.util.Date dateDeparture = null;
        java.util.Date dateArrival = null;
        try {
            dateDeparture = dateFormat.parse(dateFrom);
            dateArrival = dateFormat.parse(dateTo);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return waybillRepository.findCustomQueryAutoByDate(dateDeparture, dateArrival, user.getCompany().getId());
    }

    @RequestMapping(value = "/orders/{id}", method = RequestMethod.GET)
    public Order editOrder(@PathVariable Long id) {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        Company company = userRepository.findUserByUsername(name).getCompany();
        Optional<Order> order = orderRepository.findById(id);
        if (order.isPresent() && order.get().getCompany().getId() == company.getId())
            return order.get();
        else {
            System.out.println("access dined");
            return null;
        }
    }

    @PostMapping(value = "/orders/createOrder")
    public Order createOrder(OrderDto orderDto, String consignments) throws ParseException {
        String[] split = consignments.split("`");
        Order order = null;
        try {
            order = orderService.getOrderFromDto(orderDto);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        System.out.println(orderDto + " - order dto ");
        System.out.println(order);
        waybillRepository.save(order.getWaybill());
        Order save = orderRepository.save(order);
        for (String s : split) {
            consignmentRepository.save(new Consignment(s, save));
        }
        return save;
    }

    @GetMapping(value = "/clients/findClientsByNameLike")
    public List<Client> findClientsByNameLike(@RequestParam String name) {
        return clientRepository.findClientsByNameLikeIgnoreCase(String.format("%%%s%%", name));
    }

    @GetMapping(value = "/companies/findCompaniesByNameLike")
    public List<Company> findCompaniesByNameLikeRest(@RequestParam String name) {
        name = String.format("%%%s%%", name);
        return companyRepository.findTop10CompaniesByNameLikeIgnoreCase(name);
    }

    @GetMapping(value = "/companies/{companyId}/stocks")
    public List<Stock> findStocksByCompany(@PathVariable Long companyId) {
        Company companyById = companyRepository.findCompanyById(companyId);
        return stockRepository.findStocksByCompany(companyById);
    }

    @GetMapping(value = "/companies/stocks/findStocksByAddressLike")
    public List<Stock> findStocksByNameLike(@RequestParam String address) {
        address = String.format("%%%s%%", address);
        return stockRepository.findStocksByAddressLike(address);
    }

    @PostMapping(value = "/companies/orders/edit")
    public Object editOrder(OrderDto orderDto, Long orderId, Long waybillId, String consignments, HttpServletRequest request) throws ParseException, JSONException {
        JSONObject json = new JSONObject();
        Order orderFromDto = orderService.getOrderFromDto(orderDto);
        orderFromDto.setId(orderId);
        orderFromDto.getWaybill().setId(waybillId);
        String[] split = consignments.split("`");
        consignmentRepository.customDeleteConsignmentsByOrderId(orderId);
        Waybill savedWaybill = waybillRepository.save(orderFromDto.getWaybill());
        Order savedOrder = orderRepository.save(orderFromDto);
        for (String s : split) {
            consignmentRepository.save(new Consignment(s, orderFromDto));
        }
        if (savedOrder != null && savedWaybill != null) {
            json.put("status", "all data has been saved");
            json.put("order", savedOrder);
        } else {
            json.put("error", "something went wrong");
        }
        return orderFromDto;
    }

    @GetMapping(value = "/orders/{id}/consignments")
    public Object getConsignments(@PathVariable Long id) {
        return consignmentRepository.customFindConsignmentsByOrderId(id);
    }

    @GetMapping(value = "/companies/findStocksByUsername")
    public Object findCompanyByUsername() throws JSONException {
        try {
            System.out.println(SecurityContextHolder.getContext().getAuthentication().getName());
            Company company = userRepository.findUserByUsername(SecurityContextHolder.getContext().getAuthentication().getName()).getCompany();
            return stockRepository.findStocksByCompany(company);
        } catch (NullPointerException e) {
            e.printStackTrace();
            JSONObject json = new JSONObject();
            json.put("error", "No stocks");
            return json.toString();
        }
    }

    @GetMapping(value = "/testUser")
    public Object getUserDetails() throws JSONException {
        JSONObject json = new JSONObject();
        json.put("name", SecurityContextHolder.getContext().getAuthentication().getName());
        json.put("details", SecurityContextHolder.getContext().getAuthentication().getDetails());
        json.put("principal", SecurityContextHolder.getContext().getAuthentication().getPrincipal());
        json.put("credentials", SecurityContextHolder.getContext().getAuthentication().getCredentials());
        json.put("authorities", SecurityContextHolder.getContext().getAuthentication().getAuthorities());
        return json.toString();
    }

    @PostMapping(value = "/orders/createConsignment")
    public Object createConsignment(Long orderId, @RequestParam(value = "consignments") String consignments) throws JSONException {
        JSONObject json = new JSONObject();

        return json.toString();
    }

}
