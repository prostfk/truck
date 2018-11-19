package com.itechart.trucking.order.service;

import com.itechart.trucking.auto.entity.Auto;
import com.itechart.trucking.auto.repository.AutoRepository;
import com.itechart.trucking.client.entity.Client;
import com.itechart.trucking.client.repository.ClientRepository;
import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.company.repository.CompanyRepository;
import com.itechart.trucking.driver.entity.Driver;
import com.itechart.trucking.driver.repository.DriverRepository;
import com.itechart.trucking.formData.OrderFormData;
import com.itechart.trucking.order.dto.OrderDto;
import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.order.repository.OrderRepository;
import com.itechart.trucking.stock.repository.StockRepository;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.repository.UserRepository;
import com.itechart.trucking.waybill.entity.Waybill;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private AutoRepository autoRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private UserRepository userRepository;

    //check for selects
    public Order getOrderFromDto(OrderFormData orderFormData, String currentUserName) throws ParseException {
        SimpleDateFormat format = new SimpleDateFormat("dd/MM/yyyy");
        User userByUsername = userRepository.findUserByUsername(currentUserName);
        Company company = userByUsername.getCompany();
        Auto autoById = autoRepository.findAutoById(orderFormData.getAutoId());
        Driver driverById = driverRepository.findDriverById(orderFormData.getDriverId());
        Order order = new Order();
        order.setCompany(company);
        order.setClient(clientRepository.findClientById(orderFormData.getClientId()));
        order.setName(orderFormData.getName());
        order.setStatus(Integer.valueOf(orderFormData.getStatus()));
        order.setSender(stockRepository.findStockById(orderFormData.getDepartureStock()));
        order.setReceiver(stockRepository.findStockById(orderFormData.getDepartureStock()));
        order.setDateAccepted(new Date(format.parse(orderFormData.getDateDeparture()).getTime()));
        order.setDateExecuted(new Date(format.parse(orderFormData.getDateArrival()).getTime()));
        order.setWaybill(new Waybill(Integer.valueOf(orderFormData.getWaybillStatus()), driverById,autoById,order.getDateAccepted(),order.getDateExecuted()));
//        order.setCompany(company);
        return order;
    }

}
