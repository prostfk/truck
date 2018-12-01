package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.cancellationAct.dto.CancellationActDto;
import com.itechart.trucking.cancellationAct.entity.CancellationAct;
import com.itechart.trucking.cancellationAct.repository.CancellationActRepository;
import com.itechart.trucking.cancellationAct.service.CancellationActService;
import com.itechart.trucking.client.dto.ClientDto;
import com.itechart.trucking.client.entity.Client;
import com.itechart.trucking.client.repository.ClientRepository;
import com.itechart.trucking.client.service.ClientService;
import com.itechart.trucking.client.solrEntity.SolrClient;
import com.itechart.trucking.client.solrRepository.ClientSolrRepository;
import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.company.repository.CompanyRepository;
import com.itechart.trucking.consignment.entity.Consignment;
import com.itechart.trucking.consignment.repository.ConsignmentRepository;
import com.itechart.trucking.consignment.service.ConsignmentService;
import com.itechart.trucking.odt.Odt;
import com.itechart.trucking.order.dto.OrderDto;
import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.order.repository.OrderRepository;
import com.itechart.trucking.order.service.OrderService;
import com.itechart.trucking.pagesDto.ClientStatisticsDto;
import com.itechart.trucking.pagesDto.OwnerPageStatisticsDto;
import com.itechart.trucking.routeList.dto.RouteListDto;
import com.itechart.trucking.routeList.entity.RouteList;
import com.itechart.trucking.routeList.repository.RouteListRepository;
import com.itechart.trucking.routeList.service.RouteListService;
import com.itechart.trucking.user.dto.UserDto;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.repository.UserRepository;
import com.itechart.trucking.user.service.UserService;
import com.itechart.trucking.webmodule.model.util.ExcelUtil;
import com.itechart.trucking.webmodule.service.CommonService;
import org.apache.poi.ss.usermodel.Workbook;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.*;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Controller
@PreAuthorize("hasAuthority('ROLE_COMP_OWNER')")
@RequestMapping(value = "/api")
public class OwnerController {

    private static final Logger LOGGER = LoggerFactory.getLogger(OwnerController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private CommonService commonService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private RouteListService routeListService;

    @Autowired
    private CancellationActService cancellationActService;

    @Autowired
    private ConsignmentService consignmentService;

    @Autowired
    private ClientService clientService;

    @Autowired
    private ClientSolrRepository clientSolrRepository;

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String mainPage() {
        LOGGER.debug("'get' request on index page");
        return "index";
    }

    @GetMapping(value = "/company/getFullStat")//check xls method
    @ResponseBody
    public OwnerPageStatisticsDto getFullStat(){
        User userByUsername = commonService.getCurrentUser();

        OwnerPageStatisticsDto ownerPageStatisticsDto = new OwnerPageStatisticsDto();
        ownerPageStatisticsDto.setWorkersAmmount(userByUsername.getCompany().getWorkersAmmount());

        List<Order> orders = orderService.findCustomQueryOrderByDateAcceptedLastSixMont(userByUsername.getCompany().getId());
        ownerPageStatisticsDto.setAcceptedAmmount(userByUsername.getCompany().getOrderAcceptedAmmount(orders));

        List<Order> ordersExecuted = orderService.findCustomQueryOrderByDateExecutedLastSixMont(userByUsername.getCompany().getId());
        ownerPageStatisticsDto.setExecutedAmmount(userByUsername.getCompany().getOrderExcutedAmmount(ordersExecuted));

        ownerPageStatisticsDto.setCancellationActAmmount(userByUsername.getCompany().getOrderFailedAmmount(ordersExecuted));
        ownerPageStatisticsDto.setTotalFailed();

        return ownerPageStatisticsDto;
    }

    @GetMapping(value = "/company/getStatByClient/{id}")//check xls method
    @ResponseBody
    public ClientStatisticsDto getStatByClient(@PathVariable Long id){
        User userByUsername = commonService.getCurrentUser();
        Company company = userByUsername.getCompany();
        Client client = clientService.findClientById(id);

        ClientStatisticsDto clientStatisticsDto = new ClientStatisticsDto();

        List<Order> orders= orderService.findOrdersByLastSixMonthAndClient(company,client);

        clientStatisticsDto.setExecutedAmmount(company.getOrderExcutedAmmount(orders));
        clientStatisticsDto.setClientDto(new ClientDto(client));
        return clientStatisticsDto;
    }

    @GetMapping(value = "/company/statistics")//check xls method
    @ResponseBody
    public void createStatisticsXls(@Value("${excel.path}")String path, HttpServletResponse response){
        User userByUsername = commonService.getCurrentUser();
        try {
            String filename = new ExcelUtil().calcOrders(path, userByUsername.getUsername(),orderService.findCustomQueryOrderByDateExecutedLastSixMont(userByUsername.getCompany().getId()));
            ServletOutputStream outputStream = response.getOutputStream();
            File file = new File(filename);
            FileInputStream fis = new FileInputStream(file);
            byte[] buffer= new byte[8192];
            int length;
            while ((length = fis.read(buffer)) > 0){
                outputStream.write(buffer, 0, length);
            }
            fis.close();
            outputStream.close();
        } catch (IOException e) {
            LOGGER.warn("Something went wrong: ", e);
        }
    }


    @GetMapping(value = "/company/fullStatistics")//check xls method
    @ResponseBody
    public void createFullStatisticsXls(@Value("${excel.path}")String path, HttpServletResponse response){
        User userByUsername = commonService.getCurrentUser();
        try {
            String filename = new ExcelUtil().calcFullStatistics(path, userByUsername.getUsername(),getFullStat());
            ServletOutputStream outputStream = response.getOutputStream();
            File file = new File(filename);
            FileInputStream fis = new FileInputStream(file);
            byte[] buffer= new byte[8192];
            int length;
            while ((length = fis.read(buffer)) > 0){
                outputStream.write(buffer, 0, length);
            }
            fis.close();
            outputStream.close();
        } catch (IOException e) {
            LOGGER.warn("Something went wrong: ", e);
        }
    }


    @GetMapping(value = "/company/user/{id}")
    @ResponseBody
    public UserDto findUserByIdAndCompany(@PathVariable Long id){
        User userByUsername = commonService.getCurrentUser();
        User user = userService.customFindUserByIdAndCompanyId(id, userByUsername.getCompany().getId());
        return new UserDto(user);
    }

    @GetMapping(value = "/company/orders")
    @ResponseBody
    public List<OrderDto> fetchAllOrdersOfCompany(@ModelAttribute Order order) {
        User userByUsername = commonService.getCurrentUser();
        Company company = userByUsername.getCompany();
        List<Order> allByCompany = orderService.findAllByCompany(company);
        return Odt.OrderToDtoList(allByCompany);
    }

    @GetMapping(value = "/company/orders/{id}")
    @ResponseBody
    public OrderDto fetchOrderOfCompany(@PathVariable Long id) {
        User userByUsername = commonService.getCurrentUser();
        Company company = userByUsername.getCompany();
        Optional<Order> order = orderService.findById(id);
        if (order.isPresent() && order.get().getCompany().getId().equals(company.getId())) {
            Order order1 = order.get();
            OrderDto orderDto = new OrderDto(order1);
            orderDto.getWaybill().setAuto(order.get().getWaybill().getAuto());
            orderDto.getWaybill().setDriver(order.get().getWaybill().getDriver());
            orderDto.setCompany(company);
            return orderDto;
        } else {
            System.out.println("access dined");
            return null;
        }
    }

    @RequestMapping(value ="/company/routList/{id}", method = RequestMethod.GET)
    @ResponseBody
    public List<RouteListDto> fetchRoutListOfOrder(@PathVariable Long id){
        User userByUsername = commonService.getCurrentUser();
        Company company = userByUsername.getCompany();
        Optional<Order> order = orderService.findById(id);

        List<RouteList> routeLists;
        if(order.isPresent() && order.get().getCompany().getId().equals(company.getId())) {
            routeLists = routeListService.findAllByWaybillOrderByPointLevel(order.get().getWaybill());
        }
        else {
            return null;
        }
        return Odt.RouteListToDtoList(routeLists);
    }

    @GetMapping(value = "/company/cancelAct/{id}")
    @ResponseBody
    public CancellationActDto fetchCancelActOfCompany(@PathVariable Long id) {
        User userByUsername = commonService.getCurrentUser();
        Company company =userByUsername.getCompany();
        Optional<Order> order = orderService.findById(id);

        Consignment consignment;
        CancellationAct cancellationAct;
        if (order.isPresent() && order.get().getCompany().getId().equals(company.getId())) {
            consignment = consignmentService.findConsignmentByOrder(order.get());
            cancellationAct = cancellationActService.findCancellationActByConsignment(consignment);
        } else {
            return null;
        }

        return new CancellationActDto(cancellationAct);
    }

    @PostMapping(value = "/createClient")
    @ResponseBody
    public Object createClient(String name) throws JSONException {
        User userByUsername = commonService.getCurrentUser();
        Client clientByName = clientService.findClientByName(name);
        if (clientByName==null){
            @Valid Client save = clientService.save(new Client(name, "default",userByUsername.getCompany()));
            clientSolrRepository.save(SolrClient.solrClientFromClient(save));
            return new ClientDto(save);
        }else{
            JSONObject json = new JSONObject();
            json.put("error", "Such client is already exists");
            return json.toString();
        }
    }

    @GetMapping(value = "/company/clients")
    @ResponseBody
    public Object fetchCompanyClients(@RequestParam(name = "page") int page) throws JSONException {
        User userByUsername = commonService.getCurrentUser();

        Page<Client> clientPage = clientService.findAllByCompany(userByUsername.getCompany(), PageRequest.of(page - 1, 5));

        for (Client client : clientPage) {
            System.out.println(client);
        }
        JSONObject json = new JSONObject();
        JSONArray jsonArray = new JSONArray();

        for (Client client:clientPage.getContent()) {
            JSONObject jsonObject;
            ClientDto clientDto = new ClientDto(client);
            jsonObject = new JSONObject(ClientDto.toMap(clientDto));
            jsonArray.put(jsonObject);
        }

        json.put("clients", jsonArray);
        json.put("currentPage", clientPage.getNumber());
        json.put("totalElements", clientPage.getTotalElements());
        return json.toString();
    }
}