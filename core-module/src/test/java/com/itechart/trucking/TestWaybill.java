package com.itechart.trucking;

import com.itechart.trucking.waybill.entity.Waybill;
import com.itechart.trucking.waybill.repository.WaybillRepository;
import com.itechart.trucking.waybill.service.WaybillService;
import org.apache.tomcat.util.digester.ArrayStack;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedList;

import static org.mockito.Mockito.when;

public class TestWaybill {

    @Mock
    private WaybillRepository waybillRepository;

    @InjectMocks
    private WaybillService waybillService;

    @Before
    public void setUp() throws Exception {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testSave() {
        when(waybillService.save(new Waybill()))
                .thenReturn(new Waybill());
    }

    @Test
    public void testFindFreeAutos() {
        when(waybillService.findFreeAutos(new Date(),new Date(),1L))
                .thenReturn(new LinkedList<>());
    }

    @Test
    public void testFindFreeDrivers() {
        when(waybillService.findFreeDrivers(new Date(), new Date(), 2L))
                .thenReturn(new ArrayList<>());
    }

    @Test
    public void testFindFreeAutosToChange() {
        when(waybillService.findFreeAutosToChange(new Date(), new Date(),1L,2L))
                .thenReturn(new ArrayStack<>());
    }

    @Test
    public void testFindTop10WaybillsByUserId() {
        when(waybillService.findTop10WaybillsByUserId(1L))
                .thenReturn(new ArrayList<>(1));
    }

    @Test
    public void testFindCustomQueryAutoByDate() {
        when(waybillService.findCustomQueryAutoByDate(new Date(), new Date(), 2L))
                .thenReturn(new LinkedList<>());
    }

    @Test
    public void testFindCustomQueryDriverByDate() {
        when(waybillService.findCustomQueryDriverByDate(new Date(), new Date(),2L))
                .thenReturn(new LinkedList<>());
    }
}
