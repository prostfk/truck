package com.itechart.trucking.webmodule;

import com.itechart.trucking.webmodule.WebModuleApplication;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.results.ResultMatchers;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.context.WebApplicationContext;

import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.CoreMatchers.containsString;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@RunWith(SpringRunner.class)
@SpringBootTest
@ContextConfiguration(classes = WebModuleApplication.class)
@AutoConfigureMockMvc
public class TestRoles {


    @Autowired
    private MockMvc mvc;


    @Test
    public void testAdminGetUserPageWithRoleAdminShouldBeOk() throws Exception {
        mvc.perform(get("/api/users").with(user("admin").roles("ADMIN"))).andExpect(status().isOk());
    }

    @Test
    public void testTokenShouldBeFailed() throws Exception {
        mvc.perform(get("/anon/tokenValidation").param("token", "Sw6HKsd5hjaD0sflFsaFasW57Gda1"))
                .andExpect(content().json("{\"error\":\"no such token\"}"));
    }

    @Test
    public void testRegistrationShouldBeError() throws Exception {
        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.put("username", Collections.singletonList("roman123"));
        map.put("password", Collections.singletonList("zxccxz"));
        map.put("email", Collections.singletonList("lolprekol@mail.ru"));
        map.put("role", Collections.singletonList("ULTRA_USER"));
        mvc.perform(post("/registration").params(map))
                .andExpect(content().json("{\"error\":\"Invalid link!\"}"));
    }

    @Test
    public void testCheckCompanyName() throws Exception {
        mvc.perform(get("/checkCompanyName").param("name", "companyUltraSuperCoolTestNameNotExists"))
                .andExpect(content().json("{\"message\":\"all fine\"}"));
    }



}
