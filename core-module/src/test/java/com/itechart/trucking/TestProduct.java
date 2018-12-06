package com.itechart.trucking;

import com.itechart.trucking.consignment.entity.Consignment;
import com.itechart.trucking.product.entity.Product;
import com.itechart.trucking.product.repository.ProductRepository;
import com.itechart.trucking.product.service.ProductService;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.internal.stubbing.answers.ReturnsElementsOf;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.Stack;

import static org.mockito.Mockito.when;

public class TestProduct {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @Before
    public void setUp() throws Exception {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testFindById() {
        when(productService.findById(1L))
                .then(new ReturnsElementsOf(new ArrayDeque<>()));
    }

    @Test
    public void testSave() {
        when(productService.save(new Product()))
                .then(new ReturnsElementsOf(new ArrayList<>()));
    }

    @Test
    public void testDeleteWhereConsignmentId() {
        try {
            productService.deleteWhereConsignmentId(1L);
        }catch (Exception e){
            Assert.fail();
        }
    }

    @Test
    public void testFindAllByConsignment() {
        when(productService.findAllByConsignment(new Consignment()))
                .thenReturn(new LinkedList<>());
    }

    @Test
    public void testFindProductsByDescriptionLikeIgnoreCase() {
        when(productService.findProductsByDescriptionLikeIgnoreCase("desc"))
                .thenReturn(new ArrayList<>());
    }

    @Test
    public void testFindProductsByStatus() {
        when(productService.findProductsByStatus(2))
                .thenReturn(new Stack<>());
    }
}
