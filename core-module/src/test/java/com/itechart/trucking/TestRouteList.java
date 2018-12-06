package com.itechart.trucking;

import com.itechart.trucking.routeList.entity.RouteList;
import com.itechart.trucking.routeList.repository.RouteListRepository;
import com.itechart.trucking.routeList.service.RouteListService;
import com.itechart.trucking.waybill.entity.Waybill;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.LinkedList;
import java.util.Optional;

import static org.mockito.Mockito.when;

public class TestRouteList {

    @Mock
    private RouteListRepository routeListRepository;

    @InjectMocks
    private RouteListService routeListService;

    @Before
    public void setUp() throws Exception {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testSave() {
        when(routeListService.save(new RouteList()))
                .thenReturn(new RouteList());
    }

    @Test
    public void testRemove() {
        try {
            routeListService.remove(new RouteList());
        }catch (Exception e){
            Assert.fail();
        }
    }

    @Test
    public void testFindAllByWaybillOrderByPointLevel() {
        when(routeListService.findAllByWaybillOrderByPointLevel(new Waybill()))
                .thenReturn(new LinkedList<>());
    }

    @Test
    public void testFindById() {
        when(routeListService.findById(1L))
                .thenReturn(Optional.of(new RouteList()));
    }
}
