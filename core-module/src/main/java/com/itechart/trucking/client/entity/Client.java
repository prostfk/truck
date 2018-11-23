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
@SolrDocument(solrCoreName = "client")
public class Client {

    @Id
    @Field
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Field
    private String name;
    @Field
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

    @Override
    public String toString() {
        return "Client{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", type='" + type + '\'' +
                '}';
    }
}
