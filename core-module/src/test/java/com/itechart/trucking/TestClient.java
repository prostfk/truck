package com.itechart.trucking;

import com.itechart.trucking.client.entity.Client;
import com.itechart.trucking.client.repository.ClientRepository;
import com.itechart.trucking.client.service.ClientService;
import com.itechart.trucking.client.solrRepository.ClientSolrRepository;
import com.itechart.trucking.company.entity.Company;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Collections;

import static org.mockito.Mockito.when;

public class TestClient {

    @Mock
    private ClientRepository clientRepository;

    @Mock
    private ClientSolrRepository clientSolrRepository;

    @InjectMocks
    private ClientService clientService;

    @Before
    public void setUp() throws Exception {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testFindAllByCompany() {
        when(clientService.findAllByCompany(new Company(), Pageable.unpaged()))
                .thenReturn(new PageImpl<>(Collections.emptyList()));
    }

    @Test
    public void testFindClientById() {
        when(clientService.findClientById(1L))
                .thenReturn(new Client());
    }

    @Test
    public void testFindClientByName() {
        when(clientService.findClientByName("Brushnichka"))
                .thenReturn(new Client("Brushnichka", "type", new Company()));
    }

    @Test
    public void testFindClientByType() {
        when(clientService.findClientByType("123321"))
                .thenReturn(Collections.emptyList());
    }

}
