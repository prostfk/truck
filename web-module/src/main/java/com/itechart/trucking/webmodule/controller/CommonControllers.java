package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.odt.Odt;
import com.itechart.trucking.order.dto.OrderDto;
import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.order.repository.OrderRepository;
import com.itechart.trucking.stock.dto.StockDto;
import com.itechart.trucking.stock.entity.Stock;
import com.itechart.trucking.stock.repository.StockRepository;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.repository.UserRepository;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@PreAuthorize("hasAuthority('ROLE_DISPATCHER') or hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COMP_OWNER')")
@CrossOrigin
@RestController
@RequestMapping(value = "/api")
public class CommonControllers {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private StockRepository stockRepository;


    // dispatcher | manager
    @RequestMapping(value = "/orders",method = RequestMethod.GET)
    public Object getOrders(@RequestParam(value = "page") int pageId) {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findUserByUsername(name);

        Page<Order> orderPage = orderRepository.findByCompany(user.getCompany(), PageRequest.of(pageId-1, 5));
        return orderPage.map(order -> new OrderDto(order));
    }

    @GetMapping(value = "/stocks")
    public Object stocks(@RequestParam(value = "page") int pageId) throws JSONException {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByEmail = userRepository.findUserByUsername(name);

        Page<Stock> stockPage = stockRepository.findStockByCompanyAndActive(userByEmail.getCompany(),true, PageRequest.of(pageId-1, 5));

        return stockPage.map(stock -> new StockDto(stock));
    }

    @DeleteMapping(value = "/stocks")
    public List<StockDto> stockDelete(@RequestBody String stockIds) {
        Long stockId = Long.parseLong(stockIds);
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByEmail = userRepository.findUserByUsername(name);

        if (userByEmail == null) {
            return null;
        }
        Stock stock = stockRepository.findStockById(stockId);
        if (stock == null) return null;

        if (stock.getCompany().getId()==userByEmail.getCompany().getId()) {
            stock.setActive(false);
            stockRepository.save(stock);
        }
        List<Stock> stockByCompanyAndActive = stockRepository.findStockByCompanyAndActive(userByEmail.getCompany(), true);
        return Odt.StockListToDtoList(stockByCompanyAndActive);
    }

    @PostMapping(value = "/stocks")
    public List<StockDto> createStock(@ModelAttribute Stock stock) {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByEmail = userRepository.findUserByUsername(name);

        Stock stock1 = new Stock();
        stock1.setActive(true);
        stock1.setName(stock.getName());
        stock1.setAddress(stock.getAddress());
        stock1.setCompany(userByEmail.getCompany());
        stock1.setLat(stock.getLat());
        stock1.setLng(stock.getLng())   ;
        stockRepository.save(stock1);

        return Odt.StockListToDtoList(userByEmail.getCompany().getCompanyStocks());

    }

}
