package com.itechart.trucking.webmodule.model.util;

import java.util.Random;

public class TokenUtil {

    public static String generateToken(int length){
        char[] chars = "zxcvbnmasdfghjklqwertyuiop1234567890!@#$^*~".toCharArray();
        StringBuilder stringBuilder = new StringBuilder();
        Random random = new Random();
        int len = chars.length;
        for (int i = 0; i < length; i++) {
            stringBuilder.append(chars[random.nextInt(len)]);
        }
        return stringBuilder.toString();
    }

}
