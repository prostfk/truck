package com.itechart.trucking.token.service;

import com.itechart.trucking.token.entity.Token;
import com.itechart.trucking.token.repository.TokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.validation.Valid;

@Service
public class TokenService {

    @Autowired
    private TokenRepository tokenRepository;

    public Token findTokenByEmail(String email) {
        return tokenRepository.findTokenByEmail(email);
    }

    public Token findTokenByTokenValue(String tokenValue) {
        return tokenRepository.findTokenByTokenValue(tokenValue);
    }

    public Token save(@Valid Token token) {
        return tokenRepository.save(token);
    }

    public Token update(@Valid Token token) {
        return tokenRepository.save(token);
    }

    public void remove(Token token) {
        tokenRepository.delete(token);
    }

}
