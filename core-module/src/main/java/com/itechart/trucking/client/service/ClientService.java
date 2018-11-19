package com.itechart.trucking.client.service;

import com.itechart.trucking.client.entity.Client;
import com.itechart.trucking.client.repository.ClientRepository;
import com.itechart.trucking.company.entity.Company;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    public Client findClientByName(String name){
        return clientRepository.findClientByName(name);
    }

    public List<Client> findClientByType(String type){
        return clientRepository.findClientByType(type);
    }

    public Client findClientById(Long clientId){
        return clientRepository.findClientById(clientId);
    }

    public List<Client> findClientsByNameLikeIgnoreCase(String format){
        return clientRepository.findClientsByNameLikeIgnoreCase(format);
    }

    public Page<Client> findAllByCompany(Company company, Pageable pageable){
        return clientRepository.findAllByCompany(company,pageable);
    }

}
