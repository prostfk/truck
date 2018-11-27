package com.itechart.trucking.webmodule.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class SolrStartAndStopConfig {

    private final static Logger LOGGER = LoggerFactory.getLogger(SolrStartAndStopConfig.class);

    void startSolrServer(String startScript){
        executeScript(startScript);
    }

    void stopSolrServer(String stopScript){
        executeScript(stopScript);
    }

    private void executeScript(String script){
        String fullCommand;
        if (System.getProperty("os.name").equals("Linux")){
            fullCommand = String.format("%s %s", "sh", script);
        }else{
            fullCommand = script;
        }
        try {
            Runtime.getRuntime().exec(fullCommand);
        } catch (IOException e) {
            LOGGER.error("NO SOLR SCRIPT! ", e.getMessage().toUpperCase());
            System.err.println(e.getMessage().toUpperCase());
        }
    }

}
