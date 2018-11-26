package com.itechart.trucking.webmodule.config;

import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.solr.core.SolrTemplate;
import org.springframework.data.solr.repository.config.EnableSolrRepositories;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

@Configuration
@EnableSolrRepositories(value = {"com.itechart.trucking.client.solrRepository",
                                 "com.itechart.trucking.stock.solrRepository"})
//multicoreSupport=true
@ComponentScan
public class SolrConfig {

//    @Value("${solr.startScript}")
//    private String startScript;
//
//    @Value("${solr.stopScript}")
//    private String stopScript;

//    @Autowired
//    private SolrStartAndStopConfig solrStartAndStopConfig;

    @Bean
    public SolrClient solrClient() {
        return new HttpSolrClient.Builder("http://localhost:8983/solr").build();
    }

    @Bean
    public SolrTemplate solrTemplate(SolrClient client) throws Exception {
        return new SolrTemplate(client);
    }

//    @PostConstruct
//    public void startServer() {
//        solrStartAndStopConfig.startSolrServer(startScript);
//    }
//
//    @PreDestroy
//    public void stopServer() {
//        solrStartAndStopConfig.stopSolrServer(stopScript);
//    }

}
