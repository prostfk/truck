package com.itechart.trucking.webmodule.model.entity;

public class DriverExcelDto {

    private String name;
    private String passportNumber;
    private String earnings;

    public DriverExcelDto(String name, String passportNumber, String earnings) {
        this.name = name;
        this.passportNumber = passportNumber;
        this.earnings = earnings;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassportNumber() {
        return passportNumber;
    }

    public void setPassportNumber(String passportNumber) {
        this.passportNumber = passportNumber;
    }

    public String getEarnings() {
        return earnings;
    }

    public void setEarnings(String earnings) {
        this.earnings = earnings;
    }
}
