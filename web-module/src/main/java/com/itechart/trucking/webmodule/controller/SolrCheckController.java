package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.client.solrRepository.ClientSolrRepository;
import com.itechart.trucking.stock.entity.Stock;
import com.itechart.trucking.stock.repository.StockRepository;
import com.itechart.trucking.stock.service.StockService;
import com.itechart.trucking.stock.solrEntity.SolrStock;
import com.itechart.trucking.stock.solrRepository.SolrStockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.util.LinkedList;

@Controller
@RequestMapping(value = "/rest")
public class SolrCheckController {

    @Autowired
    private SolrStockRepository solrStockRepository;

    @Autowired
    private ClientSolrRepository clientSolrRepository;

    @Autowired
    private StockRepository stockRepository;

    @GetMapping(value = "/stocks")
    @ResponseBody
    public Object getStocks() {
        return solrStockRepository.findAll();
    }

    @GetMapping(value = "/findStock")
    @ResponseBody
    public Object findStocks(@RequestParam Long companyId, @RequestParam Boolean active, @RequestParam String name) {
        return solrStockRepository.findAllByCompanyIdAndActiveAndName(companyId, active, name);
    }

    @GetMapping(value = "/clients")
    @ResponseBody
    public Object getClients() {
        return clientSolrRepository.findAll();
    }

}
