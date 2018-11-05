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
import com.itechart.trucking.product.entity.Product;
import com.itechart.trucking.product.entity.ProductState;
import com.itechart.trucking.product.repository.ProductRepository;
import com.itechart.trucking.stock.dto.StockDto;
import com.itechart.trucking.stock.entity.Stock;
import com.itechart.trucking.stock.repository.StockRepository;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.repository.UserRepository;
import com.itechart.trucking.waybill.entity.Waybill;
import com.itechart.trucking.waybill.repository.WaybillRepository;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

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

    @GetMapping(value = "/getCompany")
    public CompanyDto getCompany(){
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findUserByUsername(name);
        Company company = user.getCompany();
        CompanyDto companyDto = new CompanyDto(company);
        if(company.getActive()==0) companyDto.setLockerId(company.getLockerId());
        return companyDto;
    }

    @PostMapping(value = "/orders/createOrder")
    public Object createOrder(OrderFormData orderFormData, String consignment) throws JSONException, ParseException {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findUserByUsername(name);
        if(user.getCompany().getActive()==0) return HttpStatus.NOT_ACCEPTABLE;
        Order orderToSave = orderService.getOrderFromDto(orderFormData, name);
        Waybill savedWaybill = waybillRepository.save(orderToSave.getWaybill());
        Order savedOrder = orderRepository.save(orderToSave);
        Consignment savedConsignment = consignmentRepository.save(new Consignment(new Date().toString(), savedOrder));
        JSONArray jsonArray = new JSONArray(consignment);
        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject jsonObject = new JSONObject(jsonArray.get(i).toString());
            Product product = getProductFromJsonFile(jsonObject);
            System.out.println(productRepository.saveProduct(product.getName(), product.getStatus().name(), product.getDescription(), savedConsignment.getId(), product.getPrice() + 0.0));
            System.out.println(savedConsignment);
        }

        return HttpStatus.OK;
    }


    @PostMapping(value = "/companies/orders/edit")//todo REDO!!!!!!!!!!!!!!!!!!!!!!!
    public Object editOrder(OrderFormData orderDto, Long orderId, Long waybillId, String consignment, Long consignmentId, HttpServletRequest request) throws ParseException, JSONException {
        JSONObject json = new JSONObject();
        Order orderFromDto = orderService.getOrderFromDto(orderDto, SecurityContextHolder.getContext().getAuthentication().getName());
        orderFromDto.setId(orderId);
        orderFromDto.getWaybill().setId(waybillId);
        Waybill savedWaybill = waybillRepository.save(orderFromDto.getWaybill());
        Order savedOrder = orderRepository.save(orderFromDto);
        Consignment consignment1 = new Consignment(new Date().toString(), savedOrder);
        consignment1.setId(consignmentId);
        Consignment savedConsignment = consignmentRepository.save(consignment1);
        JSONArray jsonArray = new JSONArray(consignment);
        productRepository.deleteWhereConsignmentId(consignmentId);
        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject jsonObject = new JSONObject(jsonArray.get(i).toString());
            Product product = getProductFromJsonFile(jsonObject);
            System.out.println(productRepository.saveProduct(product.getName(), product.getStatus().name(), product.getDescription(), savedConsignment.getId(), product.getPrice() + 0.0));
        }
        return HttpStatus.OK;

    }

    @GetMapping(value = "/orders/{id}/consignment")
    public Object getConsignments(@PathVariable Long id) {
        Order orderById = orderRepository.findOrderById(id);
        Consignment consignment = orderById.getConsignment();
        ConsignmentDto consignmentDto = new ConsignmentDto(consignment);
        consignmentDto.setProductList(consignment.getProductList());
        return consignmentDto;
    }

    @GetMapping(value = "/orders/{id}")
    public OrderDto findOrderById(@PathVariable Long id) {
        Order orderById = orderRepository.findOrderById(id);
        OrderDto orderDto = new OrderDto(orderById);
        orderDto.setClient(orderById.getClient());
        orderDto.setCompany(orderById.getCompany());
        orderDto.getWaybill().setAuto(orderById.getWaybill().getAuto());
        orderDto.getWaybill().setDriver(orderById.getWaybill().getDriver());
        orderDto.setConsignment(orderById.getConsignment());
        return orderDto;
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
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByEmail = userRepository.findUserByUsername(name);
        try {
            return Odt.StockListToDtoList(stockRepository.findStockByCompanyAndActive(userByEmail.getCompany(), true));
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

    private Product getProductFromJsonFile(JSONObject jsonObject) throws JSONException {
        Product product = new Product();
        Iterator keys = jsonObject.keys();
        while (keys.hasNext()) {
            String next = keys.next().toString();
            switch (next){
                case "price": product.setPrice(Integer.parseInt(jsonObject.getString(next)));break;
                case "name": product.setName(jsonObject.getString(next));break;
                case "description": product.setDescription(jsonObject.getString(next));break;
                case "status": product.setStatus(ProductState.valueOf(jsonObject.getString(next)));break;
            }
        }
        return product;
    }


}
