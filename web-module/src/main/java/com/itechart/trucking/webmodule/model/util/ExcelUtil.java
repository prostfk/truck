package com.itechart.trucking.webmodule.model.util;

import com.itechart.trucking.cancellationAct.entity.CancellationAct;
import com.itechart.trucking.driver.entity.Driver;
import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.product.entity.Product;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.webmodule.model.annotations.Test;
import com.itechart.trucking.webmodule.model.entity.DriverExcelDto;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

public class ExcelUtil {

    @Test
    public String calcDrivers(String path, String username, List<Order> orders) throws IOException {
        Workbook book = new HSSFWorkbook();
        Sheet sheet = book.createSheet("Stats");
        List<Driver> drivers = new LinkedList<>();
        Row row = sheet.createRow(0);
        Cell cell = row.createCell(0);cell.setCellValue("Топ водителей");
        cell = row.createCell(1);cell.setCellValue("Номер паспорта");
        for (int i = 0; i < orders.size(); i++) {
            Driver driver = orders.get(i).getWaybill().getDriver();
            if (!drivers.contains(driver)){
                drivers.add(driver);
            }
        }
        for (int i = 0; i < drivers.size(); i++) {
            row = sheet.createRow(i+1);
            cell = row.createCell(0);
            cell.setCellValue(drivers.get(i).getName());
            cell = row.createCell(1);
            cell.setCellValue(drivers.get(i).getPassportNumber());
        }
        book.write(new FileOutputStream(String.format("%s/%s-drivers.xls", path, username)));
        book.close();
        return String.format("%s/%s-drivers.xls", path, username);
    }

    @Test
    public String calcOrders(String path, String username, List<Order> orders) throws IOException {
        Workbook book = new HSSFWorkbook();
        Sheet sheet = book.createSheet("Stats");
        String[] headers = {"Название заказа", "Дата создания", "Дата выполнения", "Доход" ,"Расход","Прибыль"};
        Row row = sheet.createRow(0);
        for (int i = 0; i < headers.length; i++) {
            Cell cell = row.createCell(i);
            cell.setCellValue(headers[i]);
        }
        for (int i = 0; i < orders.size(); i++) {
            Order order = orders.get(i);
            double profitFromOrder = getProfitFromOrder(order);
            double consumption = getConsumption(order);
            row = sheet.createRow(i+1);
            Cell cell = row.createCell(0);cell.setCellValue(order.getName());
            cell = row.createCell(1);cell.setCellValue(order.getDateAccepted());
            cell = row.createCell(2);cell.setCellValue(order.getDateExecuted());
            cell = row.createCell(3);cell.setCellValue(profitFromOrder);
            cell = row.createCell(4);cell.setCellValue(consumption);
            cell = row.createCell(5);cell.setCellValue(profitFromOrder - consumption);
        }
        book.write(new FileOutputStream(String.format("%s/%s.xls", path, username)));
        book.close();
        return String.format("%s/%s.xls",path, username);
    }

    private double getProfitFromOrder(Order order){
        List<Product> productList = order.getConsignment().getProductList();
        double profit = 0;
        for (Product product : productList) {
            profit += product.getPrice() * product.getCount();
        }
        return profit;
    }

    private double getConsumption(Order order){
        CancellationAct cancellationAct = order.getConsignment().getCancellationAct();
        if (cancellationAct==null){
            return 0;
        }
        List<Product> product = cancellationAct.getProduct();
        double consumption = 0;
        for (Product product1 : product) {
            consumption += product1.getPrice() * product1.getCount();
        }
        return consumption;
    }


}
