package com.itechart.trucking.webmodule.model.util;

import com.itechart.trucking.user.entity.User;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;

import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Date;

public class ExcelUtil {

    public void writeInExcel(String path, User user, Date startDate, Date endDate, String consumption, String income, String profit) throws IOException {
        Workbook book = new HSSFWorkbook();
        Sheet sheet = book.createSheet("Stats");
        String[] strings = {user.getUsername(), user.getEmail(), user.getPassword(), user.getUserRole().name()};
        Row row = sheet.createRow(0);
        for (int i = 0; i < strings.length; i++) {
            Cell cell = row.createCell(i);
            cell.setCellValue(strings[i]);
        }
        book.write(new FileOutputStream(String.format("%s/%s.xls", path, user.getUsername())));
//        book.write(new FileOutputStream(String.format("%s/%s-%s.xls", path, user.getUsername(), new Date().toString())));
        book.close();
    }

}
