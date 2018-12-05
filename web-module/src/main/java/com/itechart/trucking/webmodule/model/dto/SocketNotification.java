package com.itechart.trucking.webmodule.model.dto;

import lombok.Data;

@Data
public class SocketNotification {
    protected String userName;
    protected String message;

    public SocketNotification(String userName, String message) {
        this.userName = userName;
        this.message = message;
    }
}
