package com.itechart.trucking.order.entity;

import com.itechart.trucking.client.entity.Client;
import com.itechart.trucking.stock.entity.Stock;
import lombok.Data;

import javax.persistence.*;
import java.sql.Date;
import java.util.Objects;

@Entity
@Data
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Client client;
    private String status;
    private Stock sender;
    private Stock receiver;
    private Date dateAccepted;
    private Date dateExecuted;

}
