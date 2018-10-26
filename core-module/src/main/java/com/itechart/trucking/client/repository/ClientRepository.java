package com.itechart.trucking.client.repository;

import com.itechart.trucking.client.entity.Client;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientRepository extends CrudRepository<Client, Long> {

    Client findClientByName(String name);
    List<Client> findClientByType(String client);

}
