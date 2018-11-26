package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.auto.dto.AutoDto;
import com.itechart.trucking.auto.entity.Auto;
import com.itechart.trucking.cancellationAct.repository.CancellationActRepository;
import com.itechart.trucking.client.dto.ClientDto;
import com.itechart.trucking.client.entity.Client;
import com.itechart.trucking.client.repository.ClientRepository;
import com.itechart.trucking.client.solrEntity.SolrClient;
import com.itechart.trucking.client.solrRepository.ClientSolrRepository;
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
import com.itechart.trucking.order.dto.OrderDtoCalendar;
import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.order.repository.OrderRepository;
import com.itechart.trucking.order.service.OrderService;
import com.itechart.trucking.product.entity.Product;
import com.itechart.trucking.product.repository.ProductRepository;
import com.itechart.trucking.routeList.entity.RouteList;
import com.itechart.trucking.routeList.service.RouteListService;
import com.itechart.trucking.stock.dto.StockDto;
import com.itechart.trucking.stock.entity.Stock;
import com.itechart.trucking.stock.repository.StockRepository;
import com.itechart.trucking.stock.solrEntity.SolrStock;
import com.itechart.trucking.stock.solrRepository.SolrStockRepository;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.repository.UserRepository;
import com.itechart.trucking.waybill.dto.WaybillDto;
import com.itechart.trucking.waybill.dto.WaybillSocketUpdateDto;
import com.itechart.trucking.waybill.entity.Waybill;
import com.itechart.trucking.waybill.repository.WaybillRepository;
import com.itechart.trucking.webmodule.service.CommonService;
import com.itechart.trucking.webmodule.service.StompService;
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
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

@PreAuthorize("hasAuthority('ROLE_DISPATCHER')")
@CrossOrigin
@RestController
@RequestMapping(value = "/api")
public class DispatcherController {
    @Autowired
    private StompService stompService;

    @Autowired
    private CommonService commonService;

    @Autowired
    private UserRepository userRepository;

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

    @Autowired
    private RouteListService routeListService;

    @Autowired
    private CancellationActRepository cancellationActRepository;

    @Autowired
    private SolrStockRepository solrStockRepository;

    @Autowired
    private ClientSolrRepository clientSolrRepository;

//    @Autowired
//    private ClientSolrRepository clientSolrRepository;

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
        List<Driver> customQueryDriverByDate = waybillRepository.findFreeDrivers(dateDeparture, dateArrival, user.getCompany().getId());
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
        List<Auto> customQueryAutoByDate = waybillRepository.findFreeAutos(dateDeparture, dateArrival, user.getCompany().getId());
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
        Order savedOrder = orderService.save(orderToSave);
        routeListService.save(new RouteList("Отправление", 1,false, savedOrder.getSender().getLat(),savedOrder.getSender().getLng(),savedWaybill));
        routeListService.save(new RouteList("Отправление", null,false, savedOrder.getReceiver().getLat(),savedOrder.getReceiver().getLng(),savedWaybill));
        Consignment savedConsignment = consignmentRepository.save(new Consignment(new Date().toString(), savedOrder));
        JSONArray jsonArray = new JSONArray(consignment);
        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject jsonObject = new JSONObject(jsonArray.get(i).toString());
            Product product = getProductFromJsonFile(jsonObject);
            //changed product.getStatus().name() on product.getStatus()
            productRepository.saveProduct(product.getName(), product.getStatus(), product.getDescription(), savedConsignment.getId(), product.getPrice(), product.getCount());
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
        Order savedOrder = orderService.save(orderFromDto);
        Consignment consignment1 = new Consignment(new Date().toString(), savedOrder);
        consignment1.setId(consignmentId);
        Consignment savedConsignment = consignmentRepository.save(consignment1);
        JSONArray jsonArray = new JSONArray(consignment);
        productRepository.deleteWhereConsignmentId(consignmentId);
        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject jsonObject = new JSONObject(jsonArray.get(i).toString());
            Product product = getProductFromJsonFile(jsonObject);
            productRepository.saveProduct(product.getName(), product.getStatus(), product.getDescription(), savedConsignment.getId(), product.getPrice(), product.getCount());
        }
        return HttpStatus.OK;

    }

    @GetMapping(value = "/orders/{id}/consignment")
    public Object getConsignments(@PathVariable Long id) {
        Order orderById = orderService.findOrderById(id);
        Consignment consignment = orderById.getConsignment();
        ConsignmentDto consignmentDto = new ConsignmentDto(consignment);
        consignmentDto.setProductList(consignment.getProductList());
        return consignmentDto;
    }

    @GetMapping(value = "/orders/{id}")
    public OrderDto findOrderById(@PathVariable Long id) {
        Order orderById = orderService.findOrderById(id);
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
//        clientSolrRepository.deleteAll();
//        Iterable<Client> all = clientRepository.findAll();
//        clientSolrRepository.saveAll(Odt.ClientsToSolrClientsList(all));

        List<SolrClient> byName = clientSolrRepository.findByName(name);

        return Odt.SolrClientsListToDtoList(byName);
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
                case "price": product.setPrice(Double.parseDouble(jsonObject.getString(next)));break;
                case "name": product.setName(jsonObject.getString(next));break;
                case "description": product.setDescription(jsonObject.getString(next));break;
                //changed ProductState.valueOf(jsonObject.getString(next)) on Integer.valueOf(jsonObject.getString(next))
                case "status": product.setStatus(Integer.valueOf(jsonObject.getString(next)));break;
                case "count": product.setCount(Integer.parseInt(jsonObject.getString(next)));
            }
        }
        return product;
    }

    @RequestMapping(value = "/ordersByDate",method = RequestMethod.GET)
    public List<OrderDtoCalendar> getOrders(@RequestParam(value = "from") String from, @RequestParam(value = "to") String to) {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findUserByUsername(name);

        LocalDate localDateFrom = LocalDate.parse(from);
        Date localDateFromDate = Date.from(localDateFrom.atStartOfDay(ZoneId.systemDefault()).toInstant());
        LocalDate localDateTo = LocalDate.parse(to);
        Date localDateToDate = Date.from(localDateTo.atStartOfDay(ZoneId.systemDefault()).toInstant());

        List<Order> orders = orderService.findByDates(localDateFromDate,localDateToDate,user.getCompany().getId());

        List<OrderDtoCalendar> orderDtoCalendars = Odt.convertLists(orders,item -> new OrderDtoCalendar(item));
        return orderDtoCalendars;
    }

    // we should test if out driver and auto is free for new date
    @PutMapping(value = "/waybill/changedate")
    public Boolean changeDateOfWaybill(@ModelAttribute(value = "orderId") String orderIdS,@ModelAttribute(value = "daysOffset") String daysOffsetS) {
        User userByEmail = commonService.getCurrentUser();
        if(userByEmail==null) return false;

        Long orderId = Long.parseLong(orderIdS);
        Long daysOffset = Long.parseLong(daysOffsetS);
        if(orderId==null || daysOffset==null) return false;

        Order order = orderService.findOrderById(orderId);
        if(userByEmail.getCompany().getId()!=orderService.findOrderById(orderId).getCompany().getId()) return false;
        Waybill waybill = order.getWaybill();

        LocalDate localDateDep = waybill.getDateDeparture().toLocalDate().plusDays(daysOffset);
        LocalDate localDateArr = waybill.getDateArrival().toLocalDate().plusDays(daysOffset);
        if(!checkDatesForFreeAutosAndDrivers(userByEmail.getCompany(),waybill,java.sql.Date.valueOf(localDateDep),java.sql.Date.valueOf(localDateArr))) return false;
        waybill.setDateDeparture(java.sql.Date.valueOf(localDateDep));
        waybill.setDateArrival(java.sql.Date.valueOf(localDateArr));

        waybillRepository.save(waybill);

        WaybillSocketUpdateDto waybillSocketUpdateDto = new WaybillSocketUpdateDto();
        waybillSocketUpdateDto.setUpdaterUser(userByEmail.getId());
        waybillSocketUpdateDto.setUpdaterUserName(userByEmail.getUsername());
        waybillSocketUpdateDto.setOrderName(order.getName());
        waybillSocketUpdateDto.setCompanyId(userByEmail.getCompany().getId());
        waybillSocketUpdateDto.setWaybillDto(new WaybillDto(waybill));

        stompService.sendNotification("/topic/dispatcher", waybillSocketUpdateDto);

        return true;
    }

    private Boolean checkDatesForFreeAutosAndDrivers(Company company,Waybill waybill, java.sql.Date localDateDep, java.sql.Date localDateArr){
        boolean driverIsFree = false,autoIsFree=false;
        List<Driver> freeDrivers = waybillRepository.findFreeDriversToChange(localDateDep,localDateArr,company.getId(),waybill.getId());
        for (Driver driver:freeDrivers) {
            if (driver.getId()==waybill.getDriver().getId()){
                driverIsFree=true;
                break;
            }
        }
        List<Auto> freeAutos = waybillRepository.findFreeAutosToChange(localDateDep,localDateArr,company.getId(),waybill.getId());
        for (Auto auto:freeAutos) {
            if (auto.getId()==waybill.getAuto().getId()){
                autoIsFree=true;
                break;
            }
        }

        return (driverIsFree && autoIsFree);
    }

    @GetMapping(value = "/findStock")
    public List findStocks(@RequestParam Boolean active, @RequestParam String name){
        User userByUsername = userRepository.findUserByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        return solrStockRepository.findAllByCompanyIdAndActiveAndName(userByUsername.getCompany().getId(),active,name);
    }


}
