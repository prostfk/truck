package com.itechart.trucking;

import com.itechart.trucking.cancellationAct.entity.CancellationAct;
import com.itechart.trucking.cancellationAct.repository.CancellationActRepository;
import com.itechart.trucking.cancellationAct.service.CancellationActService;
import com.itechart.trucking.consignment.entity.Consignment;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.LinkedList;

import static org.mockito.Mockito.when;

public class TestCancellationAct {

    @Mock
    private CancellationActRepository cancellationActRepository;

    @InjectMocks
    private CancellationActService cancellationActService;

    @Before
    public void setUp() throws Exception {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testSave() {
        when(cancellationActService.save(new CancellationAct()))
                .thenReturn(new CancellationAct());
    }

    @Test
    public void testFindCancellationActsByDateBefore() {
        when(cancellationActService.findCancellationActsByDateBefore("10-12-2018"))
                .thenReturn(new LinkedList<>());
    }

    @Test
    public void testFindCancellationActsByDateAfter() {
        when(cancellationActService.findCancellationActsByDateAfter("11-12-2018"))
                .thenReturn(new LinkedList<>());
    }

    @Test
    public void testFindCancellationActByConsignment() {
        when(cancellationActService.findCancellationActByConsignment(new Consignment()))
                .thenReturn(new CancellationAct());
    }

    @Test
    public void testFindCancellationActById() {
        CancellationAct cancellationAct = new CancellationAct();
        cancellationAct.setId(1L);
        when(cancellationActService.findCancellationActById(1L))
                .thenReturn(cancellationAct);
    }

    @Test
    public void testFindCancellationActsByPrice() {
        when(cancellationActService.findCancellationActsByPrice(1231))
                .thenReturn(new LinkedList<>());
    }
}
