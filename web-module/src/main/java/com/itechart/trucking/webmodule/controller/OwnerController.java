package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.cancellationAct.dto.CancellationActDto;
import com.itechart.trucking.cancellationAct.entity.CancellationAct;
import com.itechart.trucking.cancellationAct.repository.CancellationActRepository;
import com.itechart.trucking.client.dto.ClientDto;
import com.itechart.trucking.client.entity.Client;
import com.itechart.trucking.client.repository.ClientRepository;
import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.company.repository.CompanyRepository;
import com.itechart.trucking.consignment.entity.Consignment;
import com.itechart.trucking.consignment.repository.ConsignmentRepository;
import com.itechart.trucking.odt.Odt;
import com.itechart.trucking.order.dto.OrderDto;
import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.order.repository.OrderRepository;
import com.itechart.trucking.pagesDto.OwnerPageStatisticsDto;
import com.itechart.trucking.routeList.dto.RouteListDto;
import com.itechart.trucking.routeList.entity.RouteList;
import com.itechart.trucking.routeList.repository.RouteListRepository;
import com.itechart.trucking.user.dto.UserDto;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.repository.UserRepository;
import com.itechart.trucking.webmodule.model.util.ExcelUtil;
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
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RouteListRepository routeListRepository;

    @Autowired
    private CancellationActRepository cancellationActRepository;

    @Autowired
    private ConsignmentRepository consignmentRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String mainPage() {
        LOGGER.debug("'get' request on index page");
        return "index";
    }
    @GetMapping(value = "/company/getFullStat")//check xls method
    @ResponseBody
    public OwnerPageStatisticsDto getFullStat(){
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByUsername = userRepository.findUserByUsername(name);

        OwnerPageStatisticsDto ownerPageStatisticsDto = new OwnerPageStatisticsDto();
        ownerPageStatisticsDto.setWorkersAmmount(userByUsername.getCompany().getWorkersAmmount());

        List<Order> orders = orderRepository.findCustomQueryOrderByDateAcceptedLastSixMont(userByUsername.getCompany().getId());
        ownerPageStatisticsDto.setAcceptedAmmount(userByUsername.getCompany().getOrderAcceptedAmmount(orders));

        List<Order> ordersExecuted = orderRepository.findCustomQueryOrderByDateExecutedLastSixMont(userByUsername.getCompany().getId());
        ownerPageStatisticsDto.setExecutedAmmount(userByUsername.getCompany().getOrderExcutedAmmount(ordersExecuted));

        ownerPageStatisticsDto.setCancellationActAmmount(userByUsername.getCompany().getOrderFailedAmmount(ordersExecuted));
        ownerPageStatisticsDto.setTotalFailed();

        return ownerPageStatisticsDto;
    }

    @GetMapping(value = "/company/statistics")//check xls method
    @ResponseBody
    public void createStatisticsXls(@Value("${excel.path}")String path, HttpServletResponse response){
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByUsername = userRepository.findUserByUsername(name);
        try {
            String filename = new ExcelUtil().calcOrders(path, userByUsername.getUsername(),orderRepository.findCustomQueryOrderByDateExecutedLastSixMont(userByUsername.getCompany().getId()));
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

    @GetMapping(value = "/company/statistics/drivers")
    @ResponseBody
    public void createDriversXls(@Value("${excel.path}")String path, HttpServletResponse response){
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByUsername = userRepository.findUserByUsername(name);
        try (OutputStream os = response.getOutputStream()){
            String s = new ExcelUtil().calcDrivers(path, name, orderRepository.findCustomQueryOrderByDateAcceptedLastSixMont(userByUsername.getCompany().getId()));
            File file = new File(s);
            InputStream fis = new FileInputStream(file);
            byte[] bytes = new byte[8192];
            int length;
            while ((length=fis.read(bytes))>0){
                os.write(bytes,0,length);
            }
            fis.close();
        } catch (IOException e) {
            LOGGER.warn("Something went wrong: ", e);
        }
    }

    @GetMapping(value = "/company/user/{id}")
    @ResponseBody
    public UserDto findUserByIdAndCompany(@PathVariable Long id){
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByUsername = userRepository.findUserByUsername(name);
        User user = userRepository.customFindUserByIdAndCompanyId(id, userByUsername.getCompany().getId());
        return new UserDto(user);
    }

    @GetMapping(value = "/company/orders")
    @ResponseBody
    public List<OrderDto> fetchAllOrdersOfCompany(@ModelAttribute Order order) {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        Company company = userRepository.findUserByUsername(name).getCompany();
        List<Order> allByCompany = orderRepository.findAllByCompany(company);
        return Odt.OrderToDtoList(allByCompany);
    }

    @GetMapping(value = "/company/orders/{id}")
    @ResponseBody
    public OrderDto fetchOrderOfCompany(@PathVariable Long id) {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        Company company = userRepository.findUserByUsername(name).getCompany();
        Optional<Order> order = orderRepository.findById(id);
        if (order.isPresent() && order.get().getCompany().getId().equals(company.getId())) {
            System.out.println("CALLED");
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
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        Company company = userRepository.findUserByUsername(name).getCompany();
        Optional<Order> order = orderRepository.findById(id);

        List<RouteList> routeLists;
        if(order.isPresent() && order.get().getCompany().getId().equals(company.getId())) {
            routeLists = routeListRepository.findAllByWaybillOrderByPointLevel(order.get().getWaybill());
        }
        else {
            return null;
        }
        return Odt.RouteListToDtoList(routeLists);
    }

    @GetMapping(value = "/company/cancelAct/{id}")
    @ResponseBody
    public CancellationActDto fetchCancelActOfCompany(@PathVariable Long id) {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        Company company = userRepository.findUserByUsername(name).getCompany();
        Optional<Order> order = orderRepository.findById(id);

        Consignment consignment;
        CancellationAct cancellationAct;
        if (order.isPresent() && order.get().getCompany().getId().equals(company.getId())) {
            consignment = consignmentRepository.findConsignmentByOrder(order.get());
            cancellationAct = cancellationActRepository.findCancellationActByConsignment(consignment);
        } else {
            return null;
        }

        return new CancellationActDto(cancellationAct);
    }

    @PostMapping(value = "/createClient")
    @ResponseBody
    public Object createClient(String name) throws JSONException {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByUsername = userRepository.findUserByUsername(username);
        Client clientByName = clientRepository.findClientByName(name);
        if (clientByName==null){
            @Valid Client save = clientRepository.save(new Client(name, "default",userByUsername.getCompany()));
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
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByEmail = userRepository.findUserByUsername(name);

        Page<Client> clientPage = clientRepository.findAllByCompany(userByEmail.getCompany(), PageRequest.of(page - 1, 5));

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

        System.out.println(json);

        return json.toString();
    }
}