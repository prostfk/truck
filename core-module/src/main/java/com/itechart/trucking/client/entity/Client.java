package com.itechart.trucking.client.entity;

import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.order.entity.Order;
import lombok.Data;
import org.apache.solr.client.solrj.beans.Field;
import org.springframework.data.solr.core.mapping.Indexed;
import org.springframework.data.solr.core.mapping.SolrDocument;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_owner", nullable = false)
    private Company company;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "client")
    private List<Order> clientOrders;

    public Client() {
    }
    public Client(String name, String type, Company company) {
        this.name = name;
        this.type = type;
        this.company = company;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public List<Order> getClientOrders() {
        return clientOrders;
    }

    public void setClientOrders(List<Order> clientOrders) {
        this.clientOrders = clientOrders;
    }

    @Override
    public String toString() {
        return "Client{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", type='" + type + '\'' +
                '}';
    }
}
