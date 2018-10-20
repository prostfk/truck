package com.itechart.trucking.webmodule.model.util;

import org.springframework.beans.factory.annotation.Value;

import javax.mail.Message;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

public class EmailUtil {


    public static void sendMail(String username, String password, String toMail, String subject, String messageText) throws Exception {
        Properties props = System.getProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.port", 587);
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.auth", "true");
        Session session = Session.getDefaultInstance(props);
        MimeMessage msg = new MimeMessage(session);
        msg.setFrom(new InternetAddress(username, "Truck system"));
        msg.setRecipient(Message.RecipientType.TO, new InternetAddress(toMail));
        msg.setSubject(subject);
        msg.setContent(messageText, "text/html; charset=UTF-8");
        msg.setHeader("X-SES-CONFIGURATION-SET", "ConfigSet");
        Transport transport = session.getTransport();
        try {
            transport.connect("smtp.mail.ru", username, password);
            transport.sendMessage(msg, msg.getAllRecipients());
        } finally {
            transport.close();
        }
    }


}
