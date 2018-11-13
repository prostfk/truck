package com.itechart.trucking.client.repository;

import com.itechart.trucking.client.entity.Client;
import com.itechart.trucking.company.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientRepository extends CrudRepository<Client, Long> {

    Client findClientByName(String name);
    List<Client> findClientByType(String client);

    Client findClientById(Long clientId);

    List<Client> findClientsByNameLikeIgnoreCase(String format);

    Page<Client> findAllByCompany(Company company, Pageable pageable);
}
