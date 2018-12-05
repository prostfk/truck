package com.itechart.trucking;

import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.order.repository.OrderRepository;
import com.itechart.trucking.order.service.OrderService;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.internal.stubbing.answers.ReturnsElementsOf;
import org.springframework.beans.factory.support.ManagedSet;


import java.util.*;

import static org.mockito.Mockito.when;

public class TestOrder {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderService orderService;

    @Before
    public void setUp() throws Exception {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testFindById() {
        when(orderService.findById(1L))
                .then(new ReturnsElementsOf(new LinkedList<>()));
    }

    @Test
    public void testFindCustomQueryOrderByDateExecutedLastSixMont() {
        when(orderService.findCustomQueryOrderByDateExecutedLastSixMont(1L))
                .then(new ReturnsElementsOf(new HashSet<>()));
    }

    @Test
    public void testFindAllByCompany() {
        when(orderService.findAllByCompany(new Company()))
                .then(new ReturnsElementsOf(new Stack<>()));
    }

    @Test
    public void testFindByDates() {
        when(orderService.findByDates(new Date(1L),new Date(2L), 1L))
                .then(new ReturnsElementsOf(new ManagedSet<>()));
    }

    @Test
    public void testFindCustomQueryOrderByDateAcceptedLastSixMont() {
        when(orderService.findCustomQueryOrderByDateAcceptedLastSixMont(2L))
                .then(new ReturnsElementsOf(new LinkedHashSet<>()));
    }
}
