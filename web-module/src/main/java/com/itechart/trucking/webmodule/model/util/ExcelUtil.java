package com.itechart.trucking.webmodule.model.util;

import com.itechart.trucking.cancellationAct.dto.CancellationStatisticDto;
import com.itechart.trucking.cancellationAct.entity.CancellationAct;
import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.pagesDto.OwnerPageStatisticsDto;
import com.itechart.trucking.product.entity.Product;
import com.itechart.trucking.webmodule.model.annotations.Test;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.*;

import java.io.FileOutputStream;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

public class ExcelUtil {

    @Test
    public String calcOrders(String path, String username, List<Order> orders) throws IOException {
        Workbook book = new HSSFWorkbook();
        DateFormat df = new SimpleDateFormat("dd/MM/yyyy");

        Sheet sheet = book.createSheet("Stats");
        String[] headers = {"Название заказа", "Дата создания", "Дата выполнения", "Доход", "Расход", "Прибыль"};
        Row row = sheet.createRow(0);
        for (int i = 0; i < headers.length; i++) {
            Cell cell = row.createCell(i);
            cell.setCellValue(headers[i]);
        }
        for (int i = 0; i < orders.size(); i++) {
            Order order = orders.get(i);
            double profitFromOrder = getProfitFromOrder(order);
            double consumption = getConsumption(order);
            row = sheet.createRow(i + 1);
            Cell cell = row.createCell(0);
            cell.setCellValue(order.getName());
            cell = row.createCell(1);
            cell.setCellValue(df.format(order.getDateAccepted()));
            cell = row.createCell(2);
            cell.setCellValue(df.format(order.getDateExecuted()));
            cell = row.createCell(3);
            cell.setCellValue(profitFromOrder);
            cell = row.createCell(4);
            cell.setCellValue(consumption);
            cell = row.createCell(5);
            cell.setCellValue(profitFromOrder - consumption);
        }
        book.write(new FileOutputStream(String.format("%s/%s.xls", path, username)));
        book.close();
        return String.format("%s/%s.xls", path, username);
    }

    public String calcFullStatistics(String path, String username, OwnerPageStatisticsDto ownerPageStatisticsDto) throws IOException {
        // init data from statistics.
        final int EXCELOFFSET = 1; //  EXCELOFFSET >=0
        Map acceptedAmmount = ownerPageStatisticsDto.getAcceptedAmmount();
        Map executedAmmount = ownerPageStatisticsDto.getExecutedAmmount();
        Map workersAmmount = ownerPageStatisticsDto.getWorkersAmmount();
        Map cancellationActAmmount = ownerPageStatisticsDto.getCancellationActAmmount();
        int totalItemsFailed = ownerPageStatisticsDto.getTotalItemsFailed();
        float totalPricaeFaile = ownerPageStatisticsDto.getTotalPricaeFaile();

        Workbook book = new HSSFWorkbook();
        Sheet sheet = book.createSheet("Stats");
        String[] headersAcceptedExecutedAmmount = {"Месяц", "Количество принятых заказов", "Количество выполненных заказов"};
        String[] headersStaff = {"Работники", "Количество"};
        String[] headersСancellationAct = {"Месяц", "Сумма товаров", "Сумма"};

        CreateHeaderRow(sheet, headersAcceptedExecutedAmmount, "Заказы", EXCELOFFSET, 2);
        generateAcceptedAmmountAndExecutedAmmountRows(sheet, acceptedAmmount, executedAmmount, EXCELOFFSET, 4);

        CreateHeaderRow(sheet, headersStaff, "Персонал", EXCELOFFSET, 12);
        generateStaffRows(sheet, workersAmmount, EXCELOFFSET, 14);

        CreateHeaderRow(sheet, headersСancellationAct, "Акты списания", EXCELOFFSET, 21);
        generateСancellationActRows(sheet, cancellationActAmmount, EXCELOFFSET, 23);

        setAutoSizeOfColumns(sheet, EXCELOFFSET);

        book.write(new FileOutputStream(String.format("%s/%s.xls", path, username)));
        book.close();
        return String.format("%s/%s.xls", path, username);
    }


    private void generateAcceptedAmmountAndExecutedAmmountRows(Sheet sheet, Map acceptedAmmount, Map executedAmmount, int EXCELOFFSET, int yPos) {
        yPos--;
        AtomicInteger rowNum = new AtomicInteger(yPos);

        acceptedAmmount.forEach((k, v) -> {
            {
                Row row = sheet.createRow(rowNum.get());

                Cell cellMonth = row.createCell(EXCELOFFSET); // month
                cellMonth.setCellValue(getMonthName(k));

                Cell cellAccepted = row.createCell(EXCELOFFSET + 1); // accepted val
                cellAccepted.setCellValue(String.valueOf(v));

                Cell cellExecuted = row.createCell(EXCELOFFSET + 2); // executed val
                cellExecuted.setCellValue(String.valueOf(executedAmmount.get(k)));
                rowNum.addAndGet(1);
            }
        });
    }

    private void generateStaffRows(Sheet sheet, Map workersAmmount, int EXCELOFFSET, int yPos) {
        yPos--;
        AtomicInteger rowNum = new AtomicInteger(yPos);

        workersAmmount.forEach((k, v) -> {
            {
                Row row = sheet.createRow(rowNum.get());

                Cell cellMonth = row.createCell(EXCELOFFSET); // month
                cellMonth.setCellValue(getStaffRole(k));

                Cell cellAccepted = row.createCell(EXCELOFFSET + 1); // accepted val
                cellAccepted.setCellValue(String.valueOf(v));

                rowNum.addAndGet(1);
            }
        });
    }

    private void generateСancellationActRows(Sheet sheet, Map cancellationActAmmount, int EXCELOFFSET, int yPos) {
        yPos--;
        AtomicInteger rowNum = new AtomicInteger(yPos);

        cancellationActAmmount.forEach((k, v) -> {
            {
                CancellationStatisticDto cancellationStatisticDto = (CancellationStatisticDto) v;


                Row row = sheet.createRow(rowNum.get());

                Cell cellMonth = row.createCell(EXCELOFFSET); // month
                cellMonth.setCellValue(getMonthName(k));

                Cell cellProductAmmount = row.createCell(EXCELOFFSET + 1); // accepted val
                cellProductAmmount.setCellValue(String.valueOf(cancellationStatisticDto.getProductAmmount()));

                Cell productPrice = row.createCell(EXCELOFFSET + 2); // accepted val
                productPrice.setCellValue(String.valueOf(cancellationStatisticDto.getProductPrice()));

                rowNum.addAndGet(1);
            }
        });
    }

    private void setAutoSizeOfColumns(Sheet sheet, int EXCELOFFSET) {
        for (int i = 0 + EXCELOFFSET; i < 3 + EXCELOFFSET; i++) {
            sheet.autoSizeColumn(i);
        }
    }

    private void CreateHeaderRow(Sheet sheet, String[] headers, String title, int EXCELOFFSET, int yPos) {
        yPos--;
        //creating title
        Row rowHeader = sheet.createRow(yPos);
        Cell cellHeader = rowHeader.createCell(1);
        cellHeader.setCellValue(title);
        //creating header
        Row row = sheet.createRow(yPos + 1);
        for (int i = 0; i < headers.length; i++) {
            Cell cell = row.createCell(i + EXCELOFFSET);
            cell.setCellValue(headers[i]);
        }
    }

    private double getProfitFromOrder(Order order) {
        List<Product> productList = order.getConsignment().getProductList();
        double profit = 0;
        for (Product product : productList) {
            profit += product.getPrice() * product.getCount();
        }
        return profit;
    }

    private double getConsumption(Order order) {
        CancellationAct cancellationAct = order.getConsignment().getCancellationAct();
        if (cancellationAct == null) {
            return 0;
        }
        List<Product> product = cancellationAct.getProduct();
        double consumption = 0;
        for (Product product1 : product) {
            consumption += product1.getPrice() * product1.getCount();
        }
        return consumption;
    }

    public String getMonthName(Object monthObj) {
        int i = (Integer) monthObj;
        String month = String.valueOf(i);
        String monthName;
        switch (month) {
            case "1":
                monthName = "Январь";
                break;
            case "2":
                monthName = "Февраль";
                break;
            case "3":
                monthName = "Март";
                break;
            case "4":
                monthName = "Апрель";
                break;
            case "5":
                monthName = "Май";
                break;
            case "6":
                monthName = "Июнь";
                break;
            case "7":
                monthName = "Июль";
                break;
            case "8":
                monthName = "Август";
                break;
            case "9":
                monthName = "Сентябрь";
                break;
            case "10":
                monthName = "Октябрь";
                break;
            case "11":
                monthName = "Ноябрь";
                break;
            case "12":
                monthName = "Декабрь";
                break;
            default:
                monthName = "-" + month;
                break;
        }
        return monthName;
    }

    public String getStaffRole(Object staffObj) {
        String staffName = String.valueOf(staffObj);
        switch (staffName) {
            case "ROLE_COMP_OWNER":
                staffName = "Владелецы компании";
                break;
            case "ROLE_ADMIN":
                staffName = "Администраторы компании";
                break;
            case "ROLE_DISPATCHER":
                staffName = "Диспетчеры";
                break;
            case "ROLE_MANAGER":
                staffName = "Менеджеры";
                break;
            case "ROLE_DRIVER":
                staffName = "Водители";
                break;
            default:
                staffName = "-" + staffName;
                break;
        }
        return staffName;
    }


}
