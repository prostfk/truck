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
import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.order.repository.OrderRepository;
import com.itechart.trucking.stock.repository.StockRepository;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.repository.UserRepository;
import com.itechart.trucking.waybill.entity.Waybill;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.validation.Valid;
import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Optional;

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
        order.setReceiver(stockRepository.findStockById(orderFormData.getDeliveryStock()));
        order.setDateAccepted(new Date(format.parse(orderFormData.getDateDeparture()).getTime()));
        order.setDateExecuted(new Date(format.parse(orderFormData.getDateArrival()).getTime()));
        order.setWaybill(new Waybill(Integer.valueOf(orderFormData.getWaybillStatus()), driverById, autoById, order.getDateAccepted(), order.getDateExecuted()));
//        order.setCompany(company);
        return order;
    }

    public Order findOrderById(Long id) {
        return orderRepository.findOrderById(id);
    }

    public Page<Order> findByCompany(Company company, Pageable pageable) {
        return orderRepository.findByCompany(company, pageable);
    }

    public Page<Order> findByCompanyAndWaybillStatus(Long companyId, Long waybillStatus, Pageable pageable) {
        return orderRepository.findByCompanyAndWaybillStatus(companyId, waybillStatus, pageable);
    }

    public List<Order> findCustomQueryOrderByDriver(Long driverId) {
        return orderRepository.findCustomQueryOrderByDriver(driverId);
    }

    public Order saveOrder(String orderName, Long clientId, Long sender, Long receiver, String dateDeparture, String dateArrival, Long waybillId, Long companyId) {
        return orderRepository.saveOrder(orderName, clientId, sender, receiver, dateDeparture, dateArrival, waybillId, companyId);
    }

    public Order updateOrder(Long orderId, String orderName, Long clientId, Long sender, Long receiver, String dateDeparture, String dateArrival, Long waybillId, Long companyId) {
        return orderRepository.updateOrder(orderId, orderName, clientId, sender, receiver, dateDeparture, dateArrival, waybillId, companyId);
    }

    public List<Order> findAllByCompany(Company company) {
        return orderRepository.findAllByCompany(company);
    }

    public List<Order> findCustomQueryOrderByDateAcceptedLastSixMont(Long companyId) {
        return orderRepository.findCustomQueryOrderByDateAcceptedLastSixMont(companyId);
    }

    public List<Order> findCustomQueryOrderByDateExecutedLastSixMont(Long companyId) {
        return orderRepository.findCustomQueryOrderByDateExecutedLastSixMont(companyId);
    }

    public List<Order> findAllByStatusAndCompanyId(Integer active, Long companyId) {
        return orderRepository.findAllByStatusAndCompanyId(active, companyId);
    }

    public Page<Order> findAllByStatusAndCompanyId(Integer active, Long companyId, Pageable pageable) {
        return orderRepository.findAllByStatusAndCompanyId(active, companyId, pageable);
    }

    public List<Order> findOrdersByDateAcceptedBetweenAndCompany(java.util.Date startDateAccepted, java.util.Date endDateAccepted, Company company) {
        return orderRepository.findOrdersByDateAcceptedBetweenAndCompany(startDateAccepted, endDateAccepted, company);
    }

    public List<Order> findOrdersByLastSixMonthAndClient(Company company, Client client) {
        Long companyId = company.getId();
        Long clientId = client.getId();
        if (companyId == null || clientId == null) return null;
        return orderRepository.findCustomQueryOrderByDateExecutedLastSixMontAndClientAndCompany(companyId, clientId);
    }

    public List<Order> findByDates(java.util.Date startDateAccepted, java.util.Date endDateAccepted, Long company) {
        return orderRepository.findByDates(startDateAccepted, endDateAccepted, company);
    }

    public List<Order> findAllByStatus(Integer status) {
        return orderRepository.findAllByStatus(status);
    }

    public Order save(@Valid Order order) {
        return orderRepository.save(order);
    }

    public Order update(@Valid Order order) {
        return orderRepository.save(order);
    }

    public void remove(Order order) {
        orderRepository.delete(order);
    }


    public Optional<Order> findById(Long orderId) {
        return orderRepository.findById(orderId);
    }
}