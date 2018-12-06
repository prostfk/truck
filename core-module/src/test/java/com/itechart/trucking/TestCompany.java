package com.itechart.trucking;

import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.company.repository.CompanyRepository;
import com.itechart.trucking.company.service.CompanyService;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.PageImpl;

import java.util.Collections;

import static org.mockito.Mockito.when;

public class TestCompany {

    @Mock
    private CompanyRepository companyRepository;

    @InjectMocks
    private CompanyService companyService;

    @Before
    public void setUp() throws Exception {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testFindCompanyById() {
        when(companyService.findCompanyById(1L))
                .thenReturn(new Company());
    }

    @Test
    public void testFindCompanyByName() {
        when(companyService.findCompanyByName("name"))
                .thenReturn(new Company());
    }

    @Test
    public void testCompaniesByPage(){
        when(companyService.findCompaniesByPage("1"))
                .thenReturn(new PageImpl<>(Collections.emptyList()));
    }
}
