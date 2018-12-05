package com.itechart.trucking;

import com.itechart.trucking.auto.dto.AutoDto;
import com.itechart.trucking.auto.entity.Auto;
import com.itechart.trucking.auto.repository.AutoRepository;
import com.itechart.trucking.auto.service.AutoService;
import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.user.entity.User;
import org.json.JSONException;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.Collections;
import java.util.LinkedList;

import static org.mockito.Mockito.when;

public class TestAuto {

    @Mock
    private AutoRepository autoRepository;

    @InjectMocks
    private AutoService autoService;

    @Before
    public void setUp() throws Exception {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testFindAllByCompanyAndActive() {
        when(autoService.findAllByCompanyAndActive(new Company(), true))
                .thenReturn(Collections.emptyList());
    }

    @Test
    public void testFindAllByCompanyAndActiveOverloaded(){
        when(autoService.findAllByCompanyAndActive(new Company(),true, PageRequest.of(1,1)))
                .thenReturn(new PageImpl<>(Collections.emptyList()));
    }

    @Test
    public void testGetAutoStatistics() {
        when(autoService.getAutoStatistics()).thenReturn(new LinkedList<>());
    }

    @Test
    public void testSaveAuto() throws JSONException {
        when(autoService.saveAuto(new AutoDto(),new User()))
                .thenReturn(new AutoDto());
    }

    @Test
    public void testFindAutoById() {
        when(autoService.findAutoById(1L))
                .thenReturn(new Auto());
    }

    @Test
    public void testFindAutosByCompany() {
        when(autoService.findAutosByCompany(new Company()))
                .thenReturn(new LinkedList<>());
    }
}
