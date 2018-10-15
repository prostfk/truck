package com.itechart.trucking.token.entity;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
@Table(name = "tokens")
public class Token {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String tokenValue;

    public Token() {
    }

    public Token(String email, String tokenValue) {
        this.email = email;
        this.tokenValue = tokenValue;
    }
}
