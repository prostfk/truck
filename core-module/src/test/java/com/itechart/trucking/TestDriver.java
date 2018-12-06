package com.itechart.trucking;

import com.itechart.trucking.driver.entity.Driver;
import com.itechart.trucking.driver.repository.DriverRepository;
import com.itechart.trucking.driver.service.DriverService;
import com.itechart.trucking.user.entity.User;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.internal.stubbing.answers.ReturnsElementsOf;

import java.util.LinkedHashSet;
import java.util.LinkedList;
import java.util.TreeSet;
import java.util.concurrent.ConcurrentLinkedQueue;

import static org.mockito.Mockito.when;

public class TestDriver {

    @Mock
    private DriverRepository driverRepository;

    @InjectMocks
    private DriverService driverService;

    @Before
    public void setUp() throws Exception {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testSave() {
        when(driverService.save(new Driver()))
                .then(new ReturnsElementsOf(new LinkedHashSet<>()));
    }

    @Test
    public void testUpdate() {
        when(driverService.update(new Driver()))
                .then(new ReturnsElementsOf(new TreeSet<>()));
    }

    @Test
    public void testFindDriverById() {
        when(driverService.findDriverById(2L))
                .then(new ReturnsElementsOf(new LinkedList<>()));
    }

    @Test
    public void testFindDriverByUser() {
        when(driverService.findDriverByUser(new User()))
                .then(new ReturnsElementsOf(new ConcurrentLinkedQueue<>()));
    }
}
