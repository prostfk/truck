package com.itechart.trucking.order.service;

import com.itechart.trucking.auto.entity.Auto;
import com.itechart.trucking.auto.repository.AutoRepository;
import com.itechart.trucking.client.entity.Client;
import com.itechart.trucking.client.repository.ClientRepository;
import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.company.repository.CompanyRepository;
import com.itechart.trucking.driver.entity.Driver;
import com.itechart.trucking.driver.repository.DriverRepository;
import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.order.entity.OrderDto;
import com.itechart.trucking.order.repository.OrderRepository;
import com.itechart.trucking.stock.repository.StockRepository;
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

    public Order getOrderFromDto(OrderDto dto) throws ParseException {
        SimpleDateFormat format = new SimpleDateFormat("dd/MM/yyyy");
        Auto autoById = autoRepository.findAutoById(dto.getAutoId());
        Company company = userRepository.findUserByUsername("user6").getCompany();//заглушка
        Driver driverById = driverRepository.findDriverById(dto.getDriverId());

        Order order = new Order();
        order.setCompany(company);
        order.setClient(clientRepository.findClientById(dto.getClientId()));
        order.setName(dto.getName());
        order.setStatus(dto.getStatus());
        order.setSender(stockRepository.findStockById(dto.getDepartureStock()));
        order.setReceiver(stockRepository.findStockById(dto.getDepartureStock()));
        order.setDateAccepted(new Date(format.parse(dto.getDateDeparture()).getTime()));
        order.setDateExecuted(new Date(format.parse(dto.getDateArrival()).getTime()));
        order.setWaybill(new Waybill(dto.getWaybillStatus(), driverById,autoById,order.getDateAccepted(),order.getDateExecuted()));
//        order.setCompany(company);
        return order;
    }

}
