package com.itechart.trucking.webmodule.model.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

public class FileUtil {

    private static final Logger LOGGER = LoggerFactory.getLogger(BirthDayCongratulations.class);

    public static String readFile(String path) {
        StringBuilder sb = new StringBuilder();
        try (FileReader fr = new FileReader(path)) {
            int i = 0;
            while ((i = fr.read()) != -1) {
                sb.append((char) i);
            }
        } catch (IOException e) {
            LOGGER.error("FILE NOT FOUND: ", e);
        }
        return sb.toString();
    }

}