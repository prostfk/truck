package com.itechart.trucking.webmodule.model.util;

import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.user.entity.User;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;

import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Date;
import java.util.List;

public class ExcelUtil {

    public String writeInExcel(String path, User user, Date startDate, Date endDate, List<Order> orders) throws IOException {//todo create really company info
        Workbook book = new HSSFWorkbook();
        Sheet sheet = book.createSheet("Stats");
        String[] strings = {user.getUsername(), user.getEmail(), user.getPassword(), user.getUserRole().name()};
        Row row = sheet.createRow(0);
        for (int i = 0; i < strings.length; i++) {
            Cell cell = row.createCell(i);
            cell.setCellValue(strings[i]);
        }
        book.write(new FileOutputStream(String.format("%s/%s.xls", path, user.getUsername())));
        book.close();
        return user.getUsername() + ".xls";
    }

}
