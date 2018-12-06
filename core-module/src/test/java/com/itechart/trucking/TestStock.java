package com.itechart.trucking;

import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.stock.entity.Stock;
import com.itechart.trucking.stock.repository.StockRepository;
import com.itechart.trucking.stock.service.StockService;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.LinkedList;

import static org.mockito.Mockito.when;

public class TestStock {

    @Mock
    private StockRepository stockRepository;

    @InjectMocks
    private StockService stockService;

    @Before
    public void setUp() throws Exception {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testSave() {
        when(stockService.save(new Stock()))
                .thenReturn(new Stock());
    }

    @Test
    public void testFindStockById() {
        when(stockService.findStockById(1L))
                .thenReturn(new Stock());
    }

    @Test
    public void testFindStockByCompanyAndActive() {
        when(stockService.findStockByCompanyAndActive(new Company(),true, Pageable.unpaged()))
                .thenReturn(new PageImpl<>(new LinkedList<>()));
    }

    @Test
    public void testFindStocksByAddressLike() {
        when(stockService.findStocksByAddressLike("Tolstogo"))
                .thenReturn(new ArrayList<>());
    }
}
