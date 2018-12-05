package com.itechart.trucking.client.service;

import com.itechart.trucking.client.entity.Client;
import com.itechart.trucking.client.repository.ClientRepository;
import com.itechart.trucking.client.solrEntity.SolrClient;
import com.itechart.trucking.client.solrRepository.ClientSolrRepository;
import com.itechart.trucking.company.entity.Company;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.validation.Valid;
import java.util.List;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

//    @Autowired
//    private ClientSolrRepository clientSolrRepository;

    public Client findClientByName(String name) {
        return clientRepository.findClientByName(name);
    }

    public List<Client> findClientByType(String type) {
        return clientRepository.findClientByType(type);
    }

    public Client findClientById(Long clientId) {
        return clientRepository.findClientById(clientId);
    }

    public List<Client> findClientsByNameLikeIgnoreCase(String format) {
        return clientRepository.findClientsByNameLikeIgnoreCase(format);
    }

    public Page<Client> findAllByCompany(Company company, Pageable pageable) {
        return clientRepository.findAllByCompany(company, pageable);
    }

    public Client save(@Valid Client client) {
        @Valid Client savedClient = clientRepository.save(client);
        SolrClient solrClient = SolrClient.solrClientFromClient(savedClient);
//        clientSolrRepository.save(solrClient);
        return savedClient;
    }

    public Client update(@Valid Client client) {
        return save(client);
    }

    public void remove(Client client) {
        clientRepository.delete(client);
    }

}
