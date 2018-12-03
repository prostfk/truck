package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.client.entity.Client;
import com.itechart.trucking.client.repository.ClientRepository;
import com.itechart.trucking.client.solrEntity.SolrClient;
import com.itechart.trucking.client.solrRepository.ClientSolrRepository;
import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.company.service.CompanyService;
import com.itechart.trucking.odt.Odt;
import com.itechart.trucking.stock.entity.Stock;
import com.itechart.trucking.stock.repository.StockRepository;
import com.itechart.trucking.stock.solrEntity.SolrStock;
import com.itechart.trucking.stock.solrRepository.SolrStockRepository;
import com.itechart.trucking.token.entity.Token;
import com.itechart.trucking.token.service.TokenService;
import com.itechart.trucking.user.dto.UserDto;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.entity.UserRole;
import com.itechart.trucking.user.service.UserService;
import com.itechart.trucking.webmodule.config.JwtGen;
import com.itechart.trucking.webmodule.config.JwtVal;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.sql.Timestamp;
import java.time.Clock;
import java.time.LocalDateTime;
import java.util.List;

@RestController
public class AnonController {

    //DEVELOPMENT ONLY(init solr)
    @Autowired
    private ClientSolrRepository clientSolrRepository;
    @Autowired
    private SolrStockRepository solrStockRepository;
    @Autowired
    private ClientRepository clientRepository;
    @Autowired
    private StockRepository stockRepository;
    @GetMapping(value = "/initSolr")
    public Object initSolr() throws JSONException {
        JSONObject json = new JSONObject();
        try {
            Iterable<Stock> allStocks = stockRepository.findAll();
            Iterable<Client> allClients = clientRepository.findAll();
            solrStockRepository.deleteAll();
            clientSolrRepository.deleteAll();
            List<SolrStock> solrStocks = Odt.StockToSolrStocksList(allStocks);
            List<SolrClient> solrClients = Odt.ClientsToSolrClientsList(allClients);
            solrClients.forEach(solrClient -> clientSolrRepository.save(solrClient));
            solrStocks.forEach(stock -> solrStockRepository.save(stock));
//            solrStockRepository.saveAll(solrStocks);
//            clientSolrRepository.saveAll(solrClients);
            json.put("status", "ok");
        }catch (Exception e){
            json.put("status", "failed: " + e.getMessage());
        }
        return json.toString();
    }
    //DEVELOPMENT ONLY(init solr)

    @Autowired
    private JwtGen jwtGen;

    @Autowired
    private JwtVal jwtVal;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UserService userService;

    @Autowired
    private CompanyService companyService;

    @PostMapping(value = "/auth")
    public String getToken(@ModelAttribute final User user) throws JSONException {
        JSONObject json = new JSONObject();
        String generate = jwtGen.generate(user);
        User validate = jwtVal.validate(generate);
        if (generate == null) {
            json.put("error", "Invalid data");
        } else {
            User logginUser = userService.findUserByUsername(user.getUsername());
            if (logginUser == null) {
                json.put("error", "Invalid data");
                return json.toString();
            }
            json.put("status", 200);
            json.put("token", generate);
            json.put("role", validate.getUserRole().name());
            json.put("userId", logginUser.getId());
            json.put("companyId", logginUser.getCompany() == null ? "-1" : logginUser.getCompany().getId());
        }
        return json.toString();

    }

    @PostMapping(value = "/registration")
    public Object processAdminRegistration(@Valid UserDto userDto, String password, String companyName, String token, String birthDay, BindingResult bindingResult) throws JSONException {
        JSONObject jsonObject = new JSONObject();
        userDto.setUserRole(UserRole.ROLE_COMP_OWNER);
        Token tokenByTokenValue = tokenService.findTokenByTokenValue(token);
        if (tokenByTokenValue == null) {
            jsonObject.put("error", "Invalid link!");
            return jsonObject.toString();
        }
        if (companyService.findCompanyByName(companyName) != null) {
            jsonObject.put("error", "company with such name already exists");
            return jsonObject.toString();
        }
        userDto.setEmail(tokenByTokenValue.getEmail());
        boolean userNotInBase = userService.findUserByUsername(userDto.getUsername()) == null;
        if (!bindingResult.hasErrors() && userNotInBase) {
            if (userDto.getEmail().equals(tokenByTokenValue.getEmail())) {
                Company savedCompany = companyService.save(new Company(companyName, 1));
                userDto.setCompany(savedCompany);
                userService.registerCompanyOwner(userDto, password, savedCompany.getId());
                tokenService.remove(tokenByTokenValue);
                jsonObject.put("status", "success");
                return jsonObject.toString();
            }
        } else if (bindingResult.hasErrors()) {
            jsonObject.put("error", "Invalid data!");
        }else if (!userNotInBase){
            jsonObject.put("error", "user with such username already exists");
        }
        return jsonObject.toString();
    }

    @GetMapping(value = "/anon/tokenValidation")
    public Object validate(@RequestParam String token) throws JSONException {
        Token tokenByTokenValue = tokenService.findTokenByTokenValue(token);
        JSONObject json = new JSONObject();
        if (tokenByTokenValue != null) {
            json.put("message", "token exists");
        } else {
            json.put("error", "no such token");
        }
        return json.toString();
    }

    @GetMapping(value = "/checkCompanyName")
    public Object checkNameForExisting(@RequestParam String name) throws JSONException {
        Company companyByName = companyService.findCompanyByName(name);
        JSONObject json = new JSONObject();
        if (companyByName != null) {
            json.put("error", "such company already exists");
        } else {
            json.put("message", "all fine");
        }
        return json.toString();
    }

}
