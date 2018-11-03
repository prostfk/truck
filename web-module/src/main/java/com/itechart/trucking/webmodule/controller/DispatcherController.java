package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.auto.entity.Auto;
import com.itechart.trucking.client.entity.Client;
import com.itechart.trucking.client.repository.ClientRepository;
import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.company.repository.CompanyRepository;
import com.itechart.trucking.consignment.entity.Consignment;
import com.itechart.trucking.consignment.repository.ConsignmentRepository;
import com.itechart.trucking.driver.dto.DriverDto;
import com.itechart.trucking.driver.entity.Driver;
import com.itechart.trucking.formData.OrderFormData;
import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.order.repository.OrderRepository;
import com.itechart.trucking.order.service.OrderService;
import com.itechart.trucking.product.repository.ProductRepository;
import com.itechart.trucking.stock.dto.StockDto;
import com.itechart.trucking.stock.entity.Stock;
import com.itechart.trucking.stock.repository.StockRepository;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.repository.UserRepository;
import com.itechart.trucking.waybill.entity.Waybill;
import com.itechart.trucking.waybill.repository.WaybillRepository;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;

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

    @Autowired
    private ProductRepository productRepository;

    @GetMapping(value = "/getDrivers")
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

    @GetMapping(value = "/getAutosByDates")
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

    @GetMapping(value = "/orders/{id}")
    public Order getOrderById(@PathVariable Long id) {
        return orderRepository.findOrderById(id);
    }

    @GetMapping(value = "/clients/findClientsByNameLike")//todo correct search
    public List<Client> findClientsByNameLike(@RequestParam String name) {
        return clientRepository.findClientsByNameLikeIgnoreCase(String.format("%%%s%%", name));
    }

    @GetMapping(value = "/companies/findCompaniesByNameLike")//todo correct search
    public List<Company> findCompaniesByNameLikeRest(@RequestParam String name) {
        return companyRepository.findTop10CompaniesByNameLikeIgnoreCase(String.format("%%%s%%", name));
    }

    @GetMapping(value = "/companies/{companyId}/stocks")
    public List<Stock> findStocksByCompany() {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByUsername = userRepository.findUserByUsername(name);
        return userByUsername.getCompany().getCompanyStocks();
    }

    @GetMapping(value = "/companies/stocks/findStocksByAddressLike")//todo correct search
    public List<Stock> findStocksByNameLike(@RequestParam String address) {
        return stockRepository.findStocksByAddressLike(String.format("%%%s%%", address));
    }

    @GetMapping(value = "/companies/findStocksByUsername")
    public Object findCompanyByUsername() throws JSONException {
        try {
            return userRepository.findUserByUsername(SecurityContextHolder.getContext().getAuthentication().getName()).getCompany().getCompanyStocks();
        } catch (NullPointerException e) {
            e.printStackTrace();
            JSONObject json = new JSONObject();
            json.put("error", "No stocks");
            return json.toString();
        }
    }

    @PostMapping(value = "/companies/orders/edit")//todo REDO!!!!!!!!!!!!!!!!!!!!!!!
    public Object editOrder(OrderFormData orderDto, Long orderId, Long waybillId, String consignments, HttpServletRequest request) throws ParseException, JSONException {
        JSONObject json = new JSONObject();
        Order orderFromDto = orderService.getOrderFromDto(orderDto, SecurityContextHolder.getContext().getAuthentication().getName());
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

    @PostMapping(value = "/orders/createOrder")//todo REDO!!!!!!!!!!!!!!!!!!!!!!!!!!
    public Order createOrder(OrderFormData orderFormData, String consignment) throws ParseException {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findUserByUsername(name);
        String[] products = consignment.split("`");
        Order order = null;
        Waybill savedWaybill = waybillRepository.saveWaybill(
                orderFormData.getWaybillStatus(), orderFormData.getDriverId(), orderFormData.getAutoId(), orderFormData.getDateDeparture(), orderFormData.getDateArrival()
        );
        order = orderRepository.saveOrder(
                orderFormData.getName(), orderFormData.getClientId(), orderFormData.getDepartureStock(), orderFormData.getDeliveryStock(), orderFormData.getDateDeparture(), orderFormData.getDateArrival(), savedWaybill.getId(), user.getCompany().getId()
        );

//        productRepository.saveProduct()

        return order;
    }

}
