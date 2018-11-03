package com.itechart.trucking.order.entity;

import com.itechart.trucking.client.entity.Client;
import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.consignment.entity.Consignment;
import com.itechart.trucking.stock.entity.Stock;
import com.itechart.trucking.waybill.entity.Waybill;
import lombok.Data;

import javax.persistence.*;
import java.sql.Date;
import java.util.Objects;

@Entity
@Data
@Table(name = "orders")
public class Order {//enum

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String status;
    private Date dateAccepted;
    private Date dateExecuted;

    @OneToOne
    @JoinColumn(name = "waybill_id")
    private Waybill waybill;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sender")
    private Stock sender;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "receiver")
    private Stock receiver;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @OneToOne(fetch = FetchType.LAZY, mappedBy = "order")
    private Consignment consignment;

}
