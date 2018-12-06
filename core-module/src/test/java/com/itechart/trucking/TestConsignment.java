package com.itechart.trucking;

import com.itechart.trucking.consignment.entity.Consignment;
import com.itechart.trucking.consignment.repository.ConsignmentRepository;
import com.itechart.trucking.consignment.service.ConsignmentService;
import com.itechart.trucking.order.entity.Order;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.internal.stubbing.answers.ReturnsElementsOf;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.internal.stubbing.answers.AnswerReturnValuesAdapter;
import org.mockito.stubbing.Answer;

import java.util.ArrayDeque;
import java.util.Collections;
import java.util.LinkedList;

import static org.mockito.Mockito.when;

public class TestConsignment {

    @Mock
    private ConsignmentRepository consignmentRepository;

    @InjectMocks
    private ConsignmentService consignmentService;

    @Before
    public void setUp() throws Exception {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testUpdate() {
        when(consignmentService.update(new Consignment()))
                .then(new ReturnsElementsOf(new LinkedList<>()));
    }

    @Test
    public void testFindConsignmentByOrder() {
        when(consignmentService.findConsignmentByOrder(new Order()))
                .then(new ReturnsElementsOf(Collections.emptyList()));
    }

    @Test
    public void testSave() {
        when(consignmentService.save(new Consignment()))
                .then(new ReturnsElementsOf(new ArrayDeque<>()));
    }

    @Test
    public void testCustomDeleteConsignmentsByOrderId() {
        try {
            consignmentService.customDeleteConsignmentsByOrderId(1L);
        }catch (Exception e){
            Assert.fail();
        }
    }

    @Test
    public void testRemove() {
        try {
            consignmentService.remove(new Consignment());
        }catch (Exception e){
            Assert.fail();
        }
    }
}
