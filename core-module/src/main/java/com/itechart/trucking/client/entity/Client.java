package com.itechart.trucking.client.entity;

import com.itechart.trucking.company.entity.Company;
import lombok.Data;

import javax.persistence.*;

@Entity
@Data
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String type;
    @OneToOne
    @JoinColumn(name = "client_owner")
    private Company company;

    public Client() {
    }

    public Client(String name, String type, Company company) {
        this.name = name;
        this.type = type;
        this.company = company;
    }
}
