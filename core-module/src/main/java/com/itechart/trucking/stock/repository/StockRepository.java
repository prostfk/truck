package com.itechart.trucking.stock.repository;

import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.stock.entity.Stock;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockRepository extends CrudRepository<Stock, Long> {

    List<Stock> findStocksByCompany(Company company);

}
