package com.itechart.trucking.odt;

import org.junit.Assert;
import org.junit.Test;

import java.util.Collections;
import java.util.List;

import static org.junit.Assert.*;

public class OdtTest {

    @Test
    public void test(){
        String text = "abc";
        List<String> result = Odt.sad(Collections.singletonList(text),
                item -> item.toUpperCase());
        Assert.assertTrue(result.contains("ABC"));
    }

}