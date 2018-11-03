package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.auto.dto.AutoDto;
import com.itechart.trucking.auto.entity.Auto;
import com.itechart.trucking.client.dto.ClientDto;
import com.itechart.trucking.client.entity.Client;
import com.itechart.trucking.client.repository.ClientRepository;
import com.itechart.trucking.company.dto.CompanyDto;
import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.company.repository.CompanyRepository;
import com.itechart.trucking.consignment.dto.ConsignmentDto;
import com.itechart.trucking.consignment.entity.Consignment;
import com.itechart.trucking.consignment.repository.ConsignmentRepository;
import com.itechart.trucking.driver.dto.DriverDto;
import com.itechart.trucking.driver.entity.Driver;
import com.itechart.trucking.formData.OrderFormData;
import com.itechart.trucking.odt.Odt;
import com.itechart.trucking.order.dto.OrderDto;
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

    @Autowired
    private ProductRepository productRepository;

    @GetMapping(value = "/company/findFreeDrivers")
    public List<DriverDto> findFreeDrivers(@RequestParam String dateFrom, @RequestParam String dateTo) {
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
        List<Driver> customQueryDriverByDate = waybillRepository.findCustomQueryDriverByDate(dateDeparture, dateArrival, user.getCompany().getId());
        return Odt.DriverListToDtoList(customQueryDriverByDate);
    }

    @GetMapping(value = "/company/findFreeAutos")
    public List<AutoDto> findFreeAutos(@RequestParam String dateFrom, @RequestParam String dateTo) {
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
        List<Auto> customQueryAutoByDate = waybillRepository.findCustomQueryAutoByDate(dateDeparture, dateArrival, user.getCompany().getId());
        return Odt.AutoListToDtoList(customQueryAutoByDate);
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

    @GetMapping(value = "/companies/{companyId}/stocks")
    public List<Stock> findStocksByCompany(@PathVariable Long companyId) {
        Company companyById = companyRepository.findCompanyById(companyId);
        return stockRepository.findStocksByCompany(companyById);
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

    @GetMapping(value = "/orders/{id}/consignments")
    public Object getConsignments(@PathVariable Long id) {
        Order orderById = orderRepository.findOrderById(id);
        Consignment consignment = orderById.getConsignment();
        return new ConsignmentDto(consignment);
    }

    @GetMapping(value = "/orders/{id}")
    public OrderDto findOrderById(@PathVariable Long id) {
        Order orderById = orderRepository.findOrderById(id);
        return new OrderDto(orderById);
    }

    @GetMapping(value = "/clients/findClientsByNameLike")//todo correct search
    public List<ClientDto> findClientsByNameLike(@RequestParam String name) {
        List<Client> clientsByNameLikeIgnoreCase = clientRepository.findClientsByNameLikeIgnoreCase(String.format("%%%s%%", name));
        return Odt.ClientListToDtoList(clientsByNameLikeIgnoreCase);
    }

    @GetMapping(value = "/companies/findCompaniesByNameLike")//todo correct search
    public List<CompanyDto> findCompaniesByNameLikeRest(@RequestParam String name) {
        List<Company> top10CompaniesByNameLikeIgnoreCase = companyRepository.findTop10CompaniesByNameLikeIgnoreCase(String.format("%%%s%%", name));
        return Odt.CompanyListToDtoList(top10CompaniesByNameLikeIgnoreCase);
    }

    @GetMapping(value = "/companies/{companyId}/stocks")
    public List<StockDto> findStocksByCompany() {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByUsername = userRepository.findUserByUsername(name);
        List<Stock> companyStocks = userByUsername.getCompany().getCompanyStocks();
        return Odt.StockListToDtoList(companyStocks);
    }

    @GetMapping(value = "/companies/stocks/findStocksByAddressLike")//todo correct search
    public List<StockDto> findStocksByNameLike(@RequestParam String address) {
        List<Stock> stocksByAddressLike = stockRepository.findStocksByAddressLike(String.format("%%%s%%", address));
        return Odt.StockListToDtoList(stocksByAddressLike);
    }

    @GetMapping(value = "/companies/findStocksByUsername")
    public Object findCompanyByUsername() throws JSONException {
        try {
            List<Stock> companyStocks = userRepository.findUserByUsername(SecurityContextHolder.getContext().getAuthentication().getName()).getCompany().getCompanyStocks();
            return Odt.StockListToDtoList(companyStocks);
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
