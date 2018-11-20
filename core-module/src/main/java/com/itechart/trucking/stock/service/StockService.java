package com.itechart.trucking.stock.service;

import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.stock.entity.Stock;
import com.itechart.trucking.stock.repository.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.validation.Valid;
import java.util.List;

@Service
public class StockService {

    @Autowired
    private StockRepository stockRepository;

    @Deprecated
    public List<Stock> findStocksByCompany(Company company){
        return stockRepository.findStocksByCompany(company);
    }

    @Deprecated
    public List<Stock> findStockByCompanyAndActive(Company company,Boolean active){
        return stockRepository.findStockByCompanyAndActive(company,active);
    }

    public Page<Stock> findStockByCompanyAndActive(Company company, Boolean active, Pageable pageable){
        return stockRepository.findStockByCompanyAndActive(company, active, pageable);
    }

    public Stock findStockById(Long id){
        return stockRepository.findStockById(id);
    }

    public List<Stock> findStocksByAddressLike(String addressLike){
        return stockRepository.findStocksByAddressLike(addressLike);
    }

    public Stock save(@Valid Stock stock){
        return stockRepository.save(stock);
    }

    public Stock update(@Valid Stock stock){
        return stockRepository.save(stock);
    }

    public void remove(Stock stock){
        stockRepository.delete(stock);
    }

}
