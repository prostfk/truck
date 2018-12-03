package com.itechart.trucking.stock.repository;

import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.stock.entity.Stock;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockRepository extends CrudRepository<Stock, Long> {

    @Deprecated
    List<Stock> findStocksByCompany(Company company);

    @Deprecated
    List<Stock> findStockByCompanyAndActive(Company company, Boolean active);

    Page<Stock> findStockByCompanyAndActive(Company company, Boolean active, Pageable pageable);

    Stock findStockById(Long id);

    List<Stock> findStocksByAddressLike(String addressLike);
}
