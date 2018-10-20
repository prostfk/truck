package com.itechart.trucking.token.repository;

import com.itechart.trucking.token.entity.Token;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TokenRepository extends CrudRepository<Token, Long> {

    Token findTokenByEmail(String email);
    Token findTokenByTokenValue(String tokenValue);

}
