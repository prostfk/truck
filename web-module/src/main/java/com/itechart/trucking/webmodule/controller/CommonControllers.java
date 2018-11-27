package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.odt.Odt;
import com.itechart.trucking.order.dto.OrderDto;
import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.order.service.OrderService;
import com.itechart.trucking.stock.dto.StockDto;
import com.itechart.trucking.stock.entity.Stock;
import com.itechart.trucking.stock.service.StockService;
import com.itechart.trucking.stock.solrEntity.SolrStock;
import com.itechart.trucking.stock.solrRepository.SolrStockRepository;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.entity.UserRole;
import com.itechart.trucking.user.service.UserService;
import com.itechart.trucking.waybill.entity.Waybill;
import com.itechart.trucking.waybill.service.WaybillService;
import org.json.JSONException;
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
    private UserService userService;
    @Autowired
    private OrderService orderService;
    @Autowired
    private StockService stockService;
    @Autowired
    private WaybillService waybillService;
    @Autowired
    private SolrStockRepository solrStockRepository;


    // dispatcher | manager
    @RequestMapping(value = "/orders",method = RequestMethod.GET)
    public Object getOrders(@RequestParam(value = "page") int pageId) {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findUserByUsername(name);

        Page<Order> orderPage = orderService.findByCompany(user.getCompany(), PageRequest.of(pageId-1, 5));
        return orderPage.map(order -> new OrderDto(order));
    }

    @GetMapping(value = "/stocks")
    public Object stocks(@RequestParam(value = "page") int pageId) throws JSONException {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByEmail = userService.findUserByUsername(name);

        Page<Stock> stockPage = stockService.findStockByCompanyAndActive(userByEmail.getCompany(),true, PageRequest.of(pageId-1, 5));

        return stockPage.map(stock -> new StockDto(stock));
    }

    @DeleteMapping(value = "/stocks")
    public List<StockDto> stockDelete(@RequestBody String stockIds) {
        Long stockId = Long.parseLong(stockIds);
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByEmail = userService.findUserByUsername(name);

        if (userByEmail == null) {
            return null;
        }
        Stock stock = stockService.findStockById(stockId);
        if (stock == null) return null;

        if (stock.getCompany().getId()==userByEmail.getCompany().getId()) {
            stock.setActive(false);
            stockService.save(stock);
        }
        List<Stock> stockByCompanyAndActive = stockService.findStockByCompanyAndActive(userByEmail.getCompany(), true);
        return Odt.StockListToDtoList(stockByCompanyAndActive);
    }

    @PostMapping(value = "/stocks")
    public List<StockDto> createStock(@ModelAttribute Stock stock) {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByEmail = userService.findUserByUsername(name);
        Stock stock1 = new Stock();
        stock1.setActive(true);
        stock1.setName(stock.getName());
        stock1.setAddress(stock.getAddress());
        stock1.setCompany(userByEmail.getCompany());
        stock1.setLat(stock.getLat());
        stock1.setLng(stock.getLng());
        Stock save = stockService.save(stock1);
        solrStockRepository.save(SolrStock.solrStockFromStock(save));
        return Odt.StockListToDtoList(userByEmail.getCompany().getCompanyStocks());

    }

    //temporarily unavailable(in developing)
    @GetMapping(value = "/feed")
    public Object findFeed(){
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByUsername = userService.findUserByUsername(name);
        UserRole userRole = userByUsername.getUserRole();
        switch (userRole){
            case ROLE_DRIVER:
                List<Waybill> waybills = waybillService.findTop10WaybillsByUserId(userByUsername.getId());
        }
        return null;
    }

}
